import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "marku/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  createUser: publicProcedure
  .input(
    z.object({
      name: z.string(),
      message: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.user.create({
        data: {
          name: input.name,
        },
      });
      return {
        success: true,
      };
    } catch (error) {
      console.log(error);
    }
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
