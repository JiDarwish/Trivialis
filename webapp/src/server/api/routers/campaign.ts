import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "marku/server/api/trpc";
import { apiResponses } from "marku/utils/apiResponses";
import { Prisma } from "@prisma/client";


export const campaignRouter = createTRPCRouter({
  getMyCampaigns: protectedProcedure
    .query(async ({ ctx }) => {
      const { id: userId } = ctx.session.user;

      const company = await ctx.prisma.company.findUnique({
        where: {
          userId,
        }
      });

      if (!company) {
        return apiResponses.error("User does not have a company");
      }

      const campaigns = await ctx.prisma.campaign.findMany({
        where: {
          companyId: company.id,
        }
      });

      return apiResponses.success("Campaigns found", campaigns);
    }),
  getCampaignById: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const company = await ctx.prisma.company.findUnique({
        where: {
          userId: ctx.session.user.id,
        }
      });

      if (!company) {
        return apiResponses.error("User does not have a company");
      }

      const campaign = await ctx.prisma.campaign.findUnique({
        where: {
          id,
        }
      });

      if (!campaign) {
        return apiResponses.error("Campaign not found");
      }

      if (campaign.companyId !== company.id) {
        return apiResponses.error("Campaign does not belong to user");
      }

      return apiResponses.success("Campaign found", campaign);
    }),
  createCampaign: protectedProcedure
    .input(z.object({
      campaignName: z.string(),
      campaignDescription: z.string(),
      campaignGoal: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { campaignName, campaignDescription, campaignGoal } = input;
      const { id: userId } = ctx.session.user;

      const company = await ctx.prisma.company.findUnique({
        where: {
          userId,
        }
      });

      if (!company) {
        return apiResponses.error("User does not have a company");
      }

      const newCampaign = await ctx.prisma.campaign.create({
        data: {
          name: campaignName,
          description: campaignDescription,
          goal: campaignGoal,
          company: {
            connect: {
              id: company.id,
            }
          }
        }
      });

      return apiResponses.success("Campaign created", newCampaign);
    }),
});

