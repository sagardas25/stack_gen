import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client.js";
import { codeAgentFunction } from "@/inngest/function.js";

// Create an API that serves functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* functions will be passed here  */
    codeAgentFunction,
  ],
});

