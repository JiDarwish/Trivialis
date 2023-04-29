import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "marku/server/api/trpc";

export const campaignRouter = createTRPCRouter({
  getMyCampaigns: protectedProcedure
    .query(async ({ ctx }) => {
      // Get campaigns for the current user
    }),
  getCampaignById: publicProcedure
    .query(async ({ ctx, input }) => {
      // Get a campaign by id 
    }),
  createCampaign: protectedProcedure.input(
    z.object({
      name: z.string(),
      message: z.string(),
    })
  )
    .mutation(async ({ ctx, input }) => {
      // Create a campaign
    }),

});

