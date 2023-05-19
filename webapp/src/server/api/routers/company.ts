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
import { env } from "marku/env.mjs";

async function typedFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 80000);
  const theOptions = { ...options, signal: controller.signal };
  const response = await fetch(url, theOptions);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}
type ApiCompanyReportResponse = {
  competitors: string;
  social_media_apps: string;
  industries_and_sectors: string;
  key_selling_points: string;
  subreddits: string;
  new_releases: string;
}
export const companyRouter = createTRPCRouter({
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


        const apiResponse = await typedFetch<ApiCompanyReportResponse>(`${env.MARKU_API_URI}/lang-api/company`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": env.MARKU_API_KEY,
          },
          body: JSON.stringify({
            name: company.name,
            websiteLink: company.websiteLink,
            description: company.description,
            toneAndVoice: company.toneAndVoice,
            preferredTargetAudiance: company.preferredTargetAudiance,
            socialMediaLinks: company.socialMediaLinks,
          })
        });

        if (!apiResponse) {
          throw new Error("No data returned from API");
        }

        const newCompanyReport = await ctx.prisma.companyReport.upsert({
          where: {
            companyId: company.id
          },
          update: {
            competitors: apiResponse.competitors,
            socialMediaApps: apiResponse.social_media_apps,
            industriesAndSectors: apiResponse.industries_and_sectors,
            keySellingPoints: apiResponse.key_selling_points,
            subreddits: apiResponse.subreddits,
            newReleases: apiResponse.new_releases,
          },
          create: {
            competitors: apiResponse.competitors,
            socialMediaApps: apiResponse.social_media_apps,
            industriesAndSectors: apiResponse.industries_and_sectors,
            keySellingPoints: apiResponse.key_selling_points,
            subreddits: apiResponse.subreddits,
            newReleases: apiResponse.new_releases,
            company: {
              connect: {
                id: company.id
              }
            }
          }
        });
        console.log("newCompanyReport", newCompanyReport);



        return apiResponses.success<Company>(`success ${apiResponse.competitors} ${apiResponse.subreddits}${apiResponse.socialMediaApps}${apiResponse.newReleases}${apiResponse.keySellingPoints}`, company);
      } catch (e) {
        return apiResponses.error<Company>(`Error updating company`);
      }
    }),

  // const apiResponse = await fetch(`${env.MARKU_API_URI}/lang-api/company`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "X-API-KEY": env.MARKU_API_KEY 
  //   },
  //   body: JSON.stringify({
  //     name: company.name,
  //     websiteLink: company.websiteLink,
  //     description: company.description,
  //     toneAndVoice: company.toneAndVoice,
  //     preferredTargetAudiance: company.preferredTargetAudiance,
  //     socialMediaLinks: company.socialMediaLinks,
  //   })
  // }).then(res => res.json());

  // Try 4 times before failing
  // axiosRetry(axios, { retries: 4 });
  // const apiResponse = await axios.post<ApiCompanyReportResponse>(`${env.MARKU_API_URI}/lang-api/company`, {
  //   name: company.name,
  //   websiteLink: company.websiteLink,
  //   description: company.description,
  //   toneAndVoice: company.toneAndVoice,
  //   preferredTargetAudiance: company.preferredTargetAudiance,
  //   socialMediaLinks: company.socialMediaLinks,
  // }, {
  //   timeout: 200000,
  //   headers: {
  //     "X-API-KEY": env.MARKU_API_KEY 
  //   }
  // });
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

