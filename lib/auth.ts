import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins"
import { resend } from "./resend";
import { admin } from "better-auth/plugins"

export const auth = betterAuth({
  //...
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    },
  },

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // Implement the sendVerificationOTP method to send the OTP to the user's email address
        const { data, error } = await resend.emails.send({
          from: 'PrajwalLMS <onboarding@resend.dev>',
          to: [email],
          subject: 'PrajwalLMS - Verify your Email',
          html: `<p>Your OTP: <strong>${otp}</strong> </p>`
        });
      },
    }),
    admin(),
  ]
});