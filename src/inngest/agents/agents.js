import {
  createAgent,
  createNetwork,
  createTool,
  gemini,
} from "@inngest/agent-kit";
import Sandbox from "e2b";
import z from "zod";

export const codeAgent = ({ sandBoxId, event }) => {
  const supportAgent = createAgent({
    name: "code-agent",
    Description: "An expert coding agent",
    system: "you are a helpfull Ai-agent.Aways greet user with politeness",
    model: gemini({
      model: "gemini-2.5-flash",
    }),

    Tools: [
      // 1. Terminals
      createTool({
        name: "terminal_tool",
        description: "Use the terminals to run commands",
        parameters: z.object({
          command: z.string(),
        }),

        handler: async ({ command }, { network, agent, step }) => {
          await step?.run("terminal", async () => {
            const buffers = { stdout: "", stderr: "" };

            try {
              const sandbox = await Sandbox.connect(sandBoxId);

              const result = await sandbox.commands(CommandSeparator, {
                onStdout: (data) => {
                  buffers.stdout += data;
                },
                onStderr: (data) => {
                  buffers.stderr += data;
                },
              });

              return result.stdout;
            } catch (error) {
              console.error(
                `Command failed: ${error} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`,
              );
              return `Command failed: ${error} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
            }
          });
        },
      }),
      // 2. createOrUpdateFiles
      createTool({
        name: "createOrUpdateFiles",
        description: "create or update files in the sandbox",
        parameters: z.object({
          files: z.array(
            z.object({
              path: z.string(),
              file: z.string(),
            }),
          ),
        }),

        handlers: async ({ files }, { step, network }) => {
          const newFile = await step?.run("createOrUpdateFile", async () => {
            try {
              const updatedFiles = (await network?.state?.data.files) || {};

              const sandbox = await Sandbox.connect(sandBoxId);

              for (const file of files) {
                await sandbox.files.write(file.path, file.content);
                updatedFiles[file.path] = file.content;
              }

              return updatedFiles;
            } catch (error) {
              console.log("error : ", error);
            }
          });

          if (typeof newFile === "object") {
            network.state.data.files = newFile;
          }
        },
      }),
      // 3. readFiles
      createTool({
        name: "readFiles",
        description: "",
        parameters: z.object({
          files: z.array(z.string()),
        }),
        handler: async ({ files }, { step }) => {
          await step?.run("readFiles", async () => {
            try {
              const sandbox = await Sandbox.connect(sandBoxId);
              const contents = [];
              for (const file of files) {
                const content = await sandbox.files.read(file);
                contents.push({ path: file, content });
              }

              return JSON.stringify(contents);
            } catch (error) {
              return `error : ${error}`;
            }
          });
        },
      }),
    ],
  });

  const network = createNetwork({
    name: "coding-agent-network",
    agents: [codeAgent],
    maxIter: 10,
    router: async ({ network }) => {
      const summary = network.state.data.summary;
      if (summary) return;

      return codeAgent;
    },
  });

  const result = network.run(event.data.value);

  return result;
};
