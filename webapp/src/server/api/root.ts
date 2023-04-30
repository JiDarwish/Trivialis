import { createTRPCRouter } from "marku/server/api/trpc";
import { campaignRouter } from "./routers/campaign";
import { companyRouter } from "./routers/company";
import { elementRouter } from "./routers/element";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  campaign: campaignRouter,
  company: companyRouter,
  element: elementRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
