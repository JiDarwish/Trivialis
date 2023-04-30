import NextAuth from "next-auth";
import { authOptions } from "marku/server/auth";

export default NextAuth(authOptions);
