import { Sandbox } from "e2b";
import { inngest } from "./client.js";
import { createAgent, gemini } from "@inngest/agent-kit";

export const codeAgentFunction = inngest.createFunction(
  { id: "prompt-base" },
  { event: "code-agent/run" },

  async ({ event, step }) => {
    // get sandbox id
    const sandBoxId = await step.run("get-sandbox-id", async () => {
      const result = await Sandbox.create("saz159vr1u81suyjruee");
      return result.sandboxId;
    });

    const helloAgent = createAgent({
      name: "hello agent",
      Description: "greets users",
      system: "you are a helpfull Ai-agent.Aways greet user with politeness",
      model: gemini({
        model: "gemini-2.5-flash",
      }),
    });

    // get sandbox url
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await Sandbox.connect(sandBoxId);
      const host = sandbox.getHost(3000);
      const url = `https://${host}`;
      return url;
    });
  },
);
