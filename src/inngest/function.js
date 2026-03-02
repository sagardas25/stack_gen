import { Sandbox } from "e2b";
import { inngest } from "./client.js";
import { codeAgent } from "./agents/agents.js";

export const codeAgentFunction = inngest.createFunction(
  { id: "prompt-base" },
  { event: "code-agent/run" },

  async ({ event, step }) => {
    // get sandbox id
    const sandBoxId = await step.run("get-sandbox-id", async () => {
      const result = await Sandbox.create("saz159vr1u81suyjruee");
      return result.sandboxId;
    });

    // ai response
    const aiResponse = codeAgent(sandBoxId, event);

    // get sandbox url
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await Sandbox.connect(sandBoxId);
      const host = sandbox.getHost(3000);
      const url = `https://${host}`;
      return url;
    });

    return {
      url: sandboxUrl,
      title: "untitled",
      files: aiResponse.state.data.files,
      summary: aiResponse.state.data.summary,
    };
  },
);
