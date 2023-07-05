import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "marku/server/api/trpc";
import { apiResponses } from "marku/utils/apiResponses";
import { WaitingListUser } from "@prisma/client";


export const waitingListRouter = createTRPCRouter({
  addToWaitingList: publicProcedure
    .input(z.object({
      email: z.string().email(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const existingUser = await ctx.prisma.waitingListUser.findUnique({ 
          where: { email: input.email },
        });

        if (existingUser) {
          return apiResponses.error<WaitingListUser>(`You are already on the waiting list!`);
        }

        const user = await ctx.prisma.waitingListUser.create({ 
          data: { email: input.email },
        });
        return apiResponses.success<WaitingListUser>(`You have been added to the waiting list!`, user);  
      } catch (e) {
        return apiResponses.error<WaitingListUser>(`Error adding you to the waiting list!`);
      }
    }
  ),
});

