import prisma from "@/lib/database/conn";
import { Login } from "@/lib/database/users";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 3 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await Login(credentials);

        if (res.success && res.user) {
          return {
            id: res.user.id,
            username: res.user.username,
            points: res.user.points,
            totalPoints: res.user.totalPoints,
            role: res.user.role,
            userClassName: res.user.userClassName,
            classId: res.user.classId,
          };
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.points = user.points;
        token.totalPoints = user.totalPoints;
        token.role = user.role;
        return token;
      }

      if (token.id) {
        const dbUser = await prisma.users.findFirst({
          where: { id: token.id as string },
        });

        if (!dbUser) {
          return { ...token, id: null };
        }

        token.username = dbUser.username;
        token.points = dbUser.points;
        token.totalPoints = dbUser.totalPoints;
        token.role = dbUser.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (!token.id) {
        return { ...session, user: null } as any;
      }
      session.user = {
        id: token.id as string,
        username: token.username as string,
        points: token.points as number,
        totalPoints: token.totalPoints as number,
        role: token.role as string,
        userClassName: token.userClassName,
        classId: token.classId,
      };

      return session;
    },
  },
};
