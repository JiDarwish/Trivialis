import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "marku/server/api/trpc";
import { apiResponses } from "marku/utils/apiResponses";

export const elementRouter = createTRPCRouter({
  getElementsForCampaign: protectedProcedure
    .input(z.object({
      campaignId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const { campaignId } = input;

      const elements = await ctx.prisma.element.findMany({
        where: {
          campaignId,
        }
      });

      return apiResponses.success("Elements found", elements);
    }),
  createElement: protectedProcedure
    .input(z.object({
      campaignId: z.string(),
      elementName: z.string(),
      elementDescription: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { campaignId, elementName, elementDescription } = input;

      const element = await ctx.prisma.element.create({
        data: {
          campaignId,
          name: elementName,
          description: elementDescription,
        }
      });

      return apiResponses.success("Element created", element);
    }),
});

