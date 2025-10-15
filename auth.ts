import NextAuth, { getServerSession, type NextAuthOptions, type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import Google from "next-auth/providers/google";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: DefaultSession["user"] & {
            id: string;
        };
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.GOOGLE_ID ?? "",
            clientSecret: process.env.GOOGLE_SECRET ?? "",
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.id = user.id;
            return token;
        },
        async session({ session, token }) {
            if (token?.id) {
                session.user = {
                    ...session.user,
                    id: token.id as string,
                };
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export const handlers = { GET: handler, POST: handler };

export const auth = () => getServerSession(authOptions);

export { handler as GET, handler as POST };
