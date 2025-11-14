import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    /** simple role for authorization */
    role?: string | null;
  }

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      role?: string | null;
    } | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      name?: string | null;
      email?: string | null;
      role?: string | null;
    };
  }
}
