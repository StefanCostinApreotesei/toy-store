import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { prisma } from "./prisma";

// After this many failed attempts the account locks for LOCK_WINDOW_MS.
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_WINDOW_MS = 15 * 60 * 1000;

class AccountLockedError extends CredentialsSignin {
  code = "account_locked";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Parolă", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = (credentials.email as string).trim().toLowerCase();
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new AccountLockedError();
        }

        const isPasswordValid = await compare(password, user.hashedPassword);

        if (!isPasswordValid) {
          const attempts = user.failedLoginAttempts + 1;
          const shouldLock = attempts >= MAX_FAILED_ATTEMPTS;
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: attempts,
              lockedUntil: shouldLock ? new Date(Date.now() + LOCK_WINDOW_MS) : null,
            },
          });
          if (shouldLock) throw new AccountLockedError();
          return null;
        }

        if (user.failedLoginAttempts > 0 || user.lockedUntil) {
          await prisma.user.update({
            where: { id: user.id },
            data: { failedLoginAttempts: 0, lockedUntil: null },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tokenVersion: user.tokenVersion,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
        token.tokenVersion = (user as { tokenVersion: number }).tokenVersion ?? 0;
        return token;
      }

      // On session refresh, revalidate the JWT against the user's current
      // tokenVersion. A password change bumps the version, which logs out
      // every issued JWT for that user.
      if (trigger === "update" || !token.tokenVersionCheckedAt ||
          Date.now() - (token.tokenVersionCheckedAt as number) > 60_000) {
        if (token.id) {
          const current = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { tokenVersion: true },
          });
          if (!current || current.tokenVersion !== token.tokenVersion) {
            return {};
          }
          token.tokenVersionCheckedAt = Date.now();
        }
      }

      return token;
    },
    async session({ session, token }) {
      // jwt() returns `{}` when tokenVersion no longer matches; without an id
      // we surface an expired-looking session so the client logs out.
      if (!token?.id) {
        return { ...session, expires: new Date(0).toISOString() };
      }
      session.user.id = token.id as string;
      (session.user as { role: string }).role = token.role as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
