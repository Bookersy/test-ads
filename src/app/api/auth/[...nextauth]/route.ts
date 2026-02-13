import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth-config";

// authOptions is async for D1/Cloudflare - NextAuth supports this at runtime
const handler = NextAuth(authOptions as NextAuthOptions);

export { handler as GET, handler as POST };
