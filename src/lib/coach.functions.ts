import { createServerFn } from "@tanstack/react-start";

import { generateCoachReply, type CoachContext } from "./coach.server";

export type CoachRequest = { message: string; context: CoachContext };

/**
 * Server boundary for coaching. All personalization happens server-side so an
 * AI provider key (process.env, read inside the handler) is never exposed.
 */
export const askCoach = createServerFn({ method: "POST" })
  .inputValidator((input: CoachRequest) => input)
  .handler(async ({ data }) => {
    // const apiKey = process.env['LOVABLE_API_KEY']; // wired when AI is enabled
    return { reply: generateCoachReply(data.message, data.context) };
  });
