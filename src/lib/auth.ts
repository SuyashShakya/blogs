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
    }),
   
  ],
  callbacks: {
    // async signIn({ account, profile }) {
    //   console.log('hello')
    //   if (account?.provider === "google") {
    //     if (!profile?.email) {
    //       return false; // Reject if no email is provided
    //     }
    //     console.log('hello2')

    //     const existingUser = await prisma.user.findUnique({
    //       where: { email: profile.email },
    //     });
    //     console.log('hello3')
    //     if (existingUser) {
    //       console.log('hello4')
    //       // If user exists, update their name
    //       await prisma.user.update({
    //         where: { email: profile.email },
    //         data: { name: profile.name || existingUser.name },
    //       });
    //     } else {
    //       console.log('hello5')
    //       // If user does not exist, create a new one
    //       await prisma.user.create({
    //         data: {
    //           email: profile.email,
    //           name: profile.name || profile.email.split("@")[0], // Default name if none provided
    //           password: "", // Leave empty as Google doesn't require a password
    //         },
    //       });
    //     }
    //   }

    //   return true;
    // },

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
      console.log('session', session, token)
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