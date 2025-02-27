import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { User } from "@prisma/client";
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const existingUser = await prisma?.user?.findUnique({
          where: { email: credentials?.email },
        });

        if (!existingUser) {
          return null;
        }

        if(existingUser?.password){
          const passwordMatch = await compare(
            credentials?.password,
            existingUser?.password
          );
          if (!passwordMatch) {
            return null;
          }
        }
       
        return {
          id: `${existingUser?.id}`,
          name: existingUser?.name,
          email: existingUser?.email,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      
      async profile(profile) {
        // Check if user exists in the database
        let user = await prisma.user.findUnique({
          where: { email: profile.email || '' },
        });

        // If user doesn't exist, create a new one
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.email,
              name: profile.name,
            },
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
   
  ],
  callbacks: {
     async signIn({ user, account }) {
    if (account?.provider === "google") {
      // Check if user already exists in the database
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
        include: { accounts: true },
      });

      if (existingUser) {
        // If the user exists but doesn't have a Google account linked, link it
        const existingGoogleAccount = existingUser.accounts.find(
          (acc) => acc.provider === "google"
        );

        if (!existingGoogleAccount) {
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
            },
          });
        }
      }
    }
    return true;
  },
  
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as User;

        return {
          ...token,
          id: u?.id,
          name: u?.name,
          email: u?.email,
        };
      }
      return token;
    },

    async session({ session, token }) {

      return {
        ...session,
        user: {
          ...session?.user,
          id: token?.id,
          name: token?.name
        },
      };
    },
  },
};