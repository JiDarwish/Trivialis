import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "marku/server/api/trpc";
import { apiResponses } from "marku/utils/apiResponses";

export const companyRouter = createTRPCRouter({
  updateInformation: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const company = await ctx.prisma.company.upsert({ 
        where: {
          userId: ctx.session.user.id,
        },
        update: {
          name: input.name,
          description: input.description,
        },
        create: {
          name: input.name,
          description: input.description,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        }
      });

      return apiResponses.success(company);
    }),

    //
    // protectedProcedure
    // .input(
    //   z.object({
    //     name: z.string(),
    //     description: z.string(),
    //   })
    // )
    // .mutation(async ({ ctx, input }) => {
    //   console.log("Here yo", ctx.prisma)
    //   const company = await ctx.prisma.company.upsert({
    //     where: {
    //       userId: ctx.session.user.id,
    //     },
    //     update: {
    //       name: input.name,
    //       description: input.description,
    //     },
    //     create: {
    //       name: input.name,
    //       description: input.description,
    //       user: {
    //         connect: {
    //           id: ctx.session.user.id,
    //         },
    //       },
    //     },
    //   });
    //
    //   return apiResponses.success(company);
    // }),

});

