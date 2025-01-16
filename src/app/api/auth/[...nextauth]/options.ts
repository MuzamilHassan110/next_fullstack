import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnection from "@/lib/dbConnection";
import userModel from "@/models/User.models";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnection();
        try {
          const user = await userModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("User can't found");
          }
          if (!user.isVerified) {
            throw new Error("Please verifed your email before login");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Password is not correct");
          } else {
            return user;
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),

  ],
  pages: {
    signIn: '/sing-in',
  },
  session: {
      strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
async session({ session, token }) {
        if(token){
          session.user._id = token?._id;
          session.user.isVerified = token?.isVerified;
          session.user.isAcceptingMessages = token?.isAcceptingMessages;
          session.user.username = token?.username;
        }
      return session
    },
    async jwt({ token, user }) {
      if(user){
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token
    }
  }
};
