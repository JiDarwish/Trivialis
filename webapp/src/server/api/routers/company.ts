/* eslint-disable @typescript-eslint/no-unsafe-return */
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure
} from "marku/server/api/trpc";
import { apiResponses } from "marku/utils/apiResponses";
import type { Company, CompanyReport } from "@prisma/client";
import axios from "axios";
import axiosRetry from "axios-retry";

type ApiCompanyReportResponse = {
  competitors: string;
  socialMediaApps: string;
  industriesAndSectors: string;
  keySellingPoints: string;
  subreddits: string;
  newReleases: string;
}
//
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
export const companyRouter = createTRPCRouter({
  // updateAdditionalCompanyInformation: protectedProcedure
  //   .input(
  //     z.object({
  //       toneAndVoice: z.string(),
  //       preferredTargetAudience: z.string(),
  //       socialMediaLinks: z.string(),
  //     })
  //   ).mutation(async ({ ctx, input }) => {
  //     try {
  //       const company = await ctx.prisma.company.update({
  //         where: {
  //           userId: ctx.session.user.id,
  //         },
  //         data: {
  //           toneAndVoice: input.toneAndVoice,
  //           preferredTargetAudiance: input.preferredTargetAudience,
  //           socialMediaLinks: input.socialMediaLinks,
  //         }
  //       });
  //       return apiResponses.success<Company>("success", company);
  //     } catch (e) {
  //       return apiResponses.error<Company>("Error updating company");
  //     }
  //   }),
  //
  updateInformation: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        website: z.string(),
        description: z.string(),
        toneAndVoice: z.string(),
        preferredTargetAudience: z.string(),
        socialMediaLinks: z.string(),
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
            description: input.description,
            toneAndVoice: input.toneAndVoice,
            preferredTargetAudiance: input.preferredTargetAudience,
            socialMediaLinks: input.socialMediaLinks,
          },
          create: {
            name: input.name,
            description: input.description,
            websiteLink: input.website,
            toneAndVoice: input.toneAndVoice,
            preferredTargetAudiance: input.preferredTargetAudience,
            socialMediaLinks: input.socialMediaLinks,
            user: {
              connect: {
                id: ctx.session.user.id
              }
            }
          }
        });

        // // Try 4 times before failing
        // axiosRetry(axios, { retries: 4 });
        // const apiResponse = await axios.post<ApiCompanyReportResponse>('http://0.0.0.0:9000/lang-api/company', {
        //   name: company.name,
        //   websiteLink: company.websiteLink,
        //   description: company.description,
        //   toneAndVoice: company.toneAndVoice,
        //   preferredTargetAudiance: company.preferredTargetAudiance,
        //   socialMediaLinks: company.socialMediaLinks,
        // }, {
        //   timeout: 200000,
        // });
        // console.log("apiResponse", apiResponse);
        //
        // const newCompanyReport = await ctx.prisma.companyReport.upsert({
        //   where: {
        //     companyId: company.id
        //   },
        //   update: {
        //     competitors: apiResponse.data.competitors,
        //     socialMediaApps: apiResponse.data.socialMediaApps,
        //     industriesAndSectors: apiResponse.data.industriesAndSectors,
        //     keySellingPoints: apiResponse.data.keySellingPoints,
        //     subreddits: apiResponse.data.subreddits,
        //     newReleases: apiResponse.data.newReleases,
        //   },
        //   create: {
        //     competitors: apiResponse.data.competitors,
        //     socialMediaApps: apiResponse.data.socialMediaApps,
        //     industriesAndSectors: apiResponse.data.industriesAndSectors,
        //     keySellingPoints: apiResponse.data.keySellingPoints,
        //     subreddits: apiResponse.data.subreddits,
        //     newReleases: apiResponse.data.newReleases,
        //     company: {
        //       connect: {
        //         id: company.id
        //       }
        //     }
        //   }
        // });
        // console.log("newCompanyReport", newCompanyReport);

        return apiResponses.success<Company>("success", company);
      } catch (e) {
        return apiResponses.error<Company>("Error updating company");
      }
    }),

    // getMyCompanyReport: protectedProcedure 
    // .input(
    //   z.object({
    //     id: z.string(),
    //   })
    // )
    // .mutation(async ({ ctx, input }) => {
    //   try {
    //     const company = await ctx.prisma.company.findFirst({
    //       where: {
    //         userId: ctx.session.user.id
    //       }
    //     });
    //     if (!company) {
    //       throw apiResponses.error("company not found");
    //     }
    //     const companyReport = await ctx.prisma.companyReport.findFirst({
    //       where: {
    //         companyId: company.id 
    //       }
    //     });
    //     if (!companyReport) {
    //       throw apiResponses.error("company report not found");
    //     }
    //     return apiResponses.success<CompanyReport>("success", companyReport);
    //   } catch (e) {
    //     return apiResponses.error<CompanyReport>("Error getting company report");
    //   }
    // }),
    //
    // saveMyCompanyReport: protectedProcedure 
    // .input(
    //   z.object({
    //     competitors: z.string(),
    //     socialMediaApps: z.string(),
    //     industriesAndSectors: z.string(),
    //     keySellingPoints: z.string(),
    //     subreddits: z.string(),
    //     newReleases: z.string(),
    //   })
    // )
    // .mutation(async ({ ctx, input }) => {
    //   try {
    //     const company = await ctx.prisma.company.findFirst({
    //       where: {  
    //         userId: ctx.session.user.id
    //       }
    //     });
    //     if (!company) {
    //       throw apiResponses.error("company not found");
    //     }
    //     const newCompanyReport = await ctx.prisma.companyReport.create({
    //       data: {
    //         competitors: input.competitors,
    //         socialMediaApps: input.socialMediaApps,
    //         industriesAndSectors: input.industriesAndSectors,
    //         keySellingPoints: input.keySellingPoints,
    //         subreddits: input.subreddits,
    //         newReleases: input.newReleases,
    //         company: {
    //           connect: {
    //             id: company.id
    //           }
    //         }
    //       }
    //     });
    //     return apiResponses.success<Company>("success", company);
    //   } catch (e) {
    //     return apiResponses.error<Company>("Error updating company");
    //   }
    // }),
    //
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

