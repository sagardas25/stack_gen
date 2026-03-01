import { inngest } from "./client.js";
import { createAgent, gemini } from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },

  async ({ event, step }) => {
    const helloAgent = createAgent({
      name: "hello agent",
      Description: "greets users",
      system: "you are a helpfull Ai-agent.Aways greet user with politeness",
      model: gemini({
        model: "gemini-2.5-flash",
      }),
    });

    const response = await helloAgent.run(
      `say hello to the user : ${event.data.email}`,
    );

    console.log("repose : ", response);

    const output = response?.output?.[0]?.content;
    console.log("output : ", output);

    return output;
  },
);
