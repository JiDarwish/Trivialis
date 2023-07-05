/* eslint-disable @typescript-eslint/no-unsafe-return */
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure
} from "marku/server/api/trpc";
import { apiResponses } from "marku/utils/apiResponses";
import type { Company, CompanyReport } from "@prisma/client";

type ApiCompanyReportResponse = {
  competitors: string;
  socialMediaApps: string;
  industriesAndSectors: string;
  keySellingPoints: string;
  subreddits: string;
  newReleases: string;
}

// async function retryFetch<T>(url: string, options?: RequestInit, retries = 4, delay = 500): Promise<T> {
//   for (let i = 0; i < retries; i++) {
//     try {
//       return await typedFetch<T>(url, options);
//     } catch (error) {
//       if (i < retries - 1) {
//         await new Promise((resolve) => setTimeout(resolve, delay));
//       } else {
//         throw error;
//       }
//     }
//   }
//   throw new Error("Retry limit exceeded");
// }
//
// async function typedFetch<T>(url: string, options?: RequestInit): Promise<T> {
//   const response = await fetch(url, options);
//   if (!response.ok) {
//     throw new Error("Network response was not ok");
//   }
//   return await response.json();
// }
//

export const companyReportRouter = createTRPCRouter({
    getMyCompanyReport: protectedProcedure 
    .input(
      z.object({})
    )
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
        const companyReport = await ctx.prisma.companyReport.findFirst({
          where: {
            companyId: company.id 
          }
        });
        if (!companyReport) {
          throw apiResponses.error("company report not found");
        }
        return apiResponses.success<CompanyReport>("success", companyReport);
      } catch (e) {
        return apiResponses.error<CompanyReport>("Error getting company report");
      }
    }),

    saveMyCompanyReport: protectedProcedure 
    .input(
      z.object({
        competitors: z.string(),
        socialMediaApps: z.string(),
        industriesAndSectors: z.string(),
        keySellingPoints: z.string(),
        subreddits: z.string(),
        newReleases: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const company = await ctx.prisma.company.findFirst({
          where: {  
            userId: ctx.session.user.id
          }
        });
        if (!company) {
          throw apiResponses.error("company not found");
        }
        const newCompanyReport = await ctx.prisma.companyReport.create({
          data: {
            competitors: input.competitors,
            socialMediaApps: input.socialMediaApps,
            industriesAndSectors: input.industriesAndSectors,
            keySellingPoints: input.keySellingPoints,
            subreddits: input.subreddits,
            newReleases: input.newReleases,
            company: {
              connect: {
                id: company.id
              }
            }
          }
        });
        return apiResponses.success<CompanyReport>("success", newCompanyReport);
      } catch (e) {
        return apiResponses.error<CompanyReport>("Error updating company");
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

