import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "marku/server/api/trpc";
import { apiResponses } from "marku/utils/apiResponses";
import { Campaign } from "@prisma/client";


export const campaignRouter = createTRPCRouter({
  getMyCampaigns: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const { id: userId } = ctx.session.user;

        const company = await ctx.prisma.company.findUnique({
          where: {
            userId,
          }
        });

        if (!company) {
          throw new Error("User does not have a company");
        }

        const campaigns = await ctx.prisma.campaign.findMany({
          where: {
            companyId: company.id,
          }
        });

        return apiResponses.success<Campaign[]>("Campaigns found", campaigns);
      } catch (e) {
        console.log(e);
        return apiResponses.error<Campaign[]>("Error getting campaigns");
      }
    }),
  getCampaignById: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        const { id } = input;

        const company = await ctx.prisma.company.findUnique({
          where: {
            userId: ctx.session.user.id,
          }
        });

        if (!company) {
          throw new Error("User does not have a company");
        }

        const campaign = await ctx.prisma.campaign.findUnique({
          where: {
            id,
          }
        });

        if (!campaign) {
          throw new Error("Campaign not found");
        }

        if (campaign.companyId !== company.id) {
          throw new Error("Campaign does not belong to user");
        }

        return apiResponses.success<Campaign>("Campaign found", campaign);
      } catch (e) {
        console.log(e);
        return apiResponses.error<Campaign>("Error getting campaign");
      }
    }),
  createCampaign: protectedProcedure
    .input(z.object({
      campaignName: z.string(),
      campaignDescription: z.string(),
      campaignGoal: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { campaignName, campaignDescription, campaignGoal } = input;
        const { id: userId } = ctx.session.user;

        const company = await ctx.prisma.company.findUnique({
          where: {
            userId,
          }
        });

        if (!company) {
          throw new Error("User does not have a company");
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

        return apiResponses.success<Campaign>("Campaign created", newCampaign);
      } catch (e) {
        console.log(e);
        return apiResponses.error<Campaign>("Error creating campaign");
      }
    }),
  deleteCampaign: protectedProcedure
    .input(z.object({ 
      id: z.string(), 
    }))
    .mutation(async ({ ctx, input }) => { 
      try {
        const { id } = input;
        const { id: userId } = ctx.session.user;

        const company = await ctx.prisma.company.findUnique({
          where: {
            userId,
          }
        });

        if (!company) {
          throw new Error("User does not have a company");
        }

        const campaign = await ctx.prisma.campaign.findUnique({
          where: {
            id,
          }
        });

        if (!campaign) {
          throw new Error("Campaign not found");
        }

        if (campaign.companyId !== company.id) {
          throw new Error("Campaign does not belong to user");
        }

        const deletedCampaign = await ctx.prisma.campaign.delete({
          where: {
            id,
          }
        });

        return apiResponses.success("Campaign deleted", deletedCampaign);
      } catch (e) {
        console.log(e);
        return apiResponses.error("Error deleting campaign");
      }
    }
  ),
});

