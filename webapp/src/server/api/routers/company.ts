import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure
} from "marku/server/api/trpc";
import { apiResponses } from "marku/utils/apiResponses";
import type { Company } from "@prisma/client";

export const companyRouter = createTRPCRouter({
  updateAdditionalCompanyInformation: protectedProcedure
    .input(
      z.object({
        toneAndVoice: z.string(),
        preferredTargetAudience: z.string(),
        socialMediaLinks: z.string(),
      })
    ).mutation(async ({ ctx, input }) => {
      try {
        const company = await ctx.prisma.company.update({
          where: {
            userId: ctx.session.user.id,
          }, 
          data: {
            toneAndVoice: input.toneAndVoice,
            preferredTargetAudiance: input.preferredTargetAudience,
            socialMediaLinks: input.socialMediaLinks,
          }
        });
        return apiResponses.success<Company>("success", company);
      } catch (e) {
        return apiResponses.error<Company>("Error updating company");
      }
    }),

        updateInformation: protectedProcedure
          .input(
            z.object({
              name: z.string(),
              website: z.string(),
              description: z.string()
            })
          )
          .mutation(async ({ ctx, input }) => {
            try {

              const company = await ctx.prisma.company.upsert({
                where: {
                  userId: ctx.session.user.id
                },
                update: {
                  name: input.name,
                  websiteLink: input.website,
                  description: input.description
                },
                create: {
                  name: input.name,
                  description: input.description,
                  websiteLink: input.website,
                  user: {
                    connect: {
                      id: ctx.session.user.id
                    }
                  }
                }
              });
              //
              // TODO post this to the langchain thingy
              return apiResponses.success<Company>("success", company);
            } catch (e) {
              return apiResponses.error<Company>("Error updating company");
            }
          }),

        getMyCompany: protectedProcedure
          .query(async ({ ctx }) => {
            try {
              const company = await ctx.prisma.company.findFirst({
                where: {
                  userId: ctx.session.user.id
                }
              });

              if (!company) {
                throw apiResponses.error("company not found");
              }
              return apiResponses.success<Company>("success", company);
            } catch (e) {
              return apiResponses.error<Company>("Error getting company");
            }
          }),

      });

