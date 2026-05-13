import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";

const rejectUsers: Array<string> = [];
const allowUsers: Array<string> = ['ronald0806zeus@gmail.com'];
const allowDomains = ['gmail.com', 'modesecurity.co.za'];

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
  callbacks: {
    async createOrUpdateUser(ctx: any, args: any) {
      console.log("createOrUpdateUser called with args:", JSON.stringify(args, null, 2));
      if (!args.profile.email) {
        throw `No email, no access`;
      }

      // Check if user is explicitly banned
      if (rejectUsers.includes(args.profile.email)) {
        throw `User ${args.profile.email} is banned.`;
      }

      // Check if user is explicitly allowed OR from an allowed domain
      const emailDomain = args.profile.email.split('@')[1];
      const isAllowedByEmail = allowUsers.includes(args.profile.email);
      const isAllowedByDomain = allowDomains.length > 0 && allowDomains.includes(emailDomain);

      if (!isAllowedByEmail && !isAllowedByDomain) {
        throw new Error(`User ${args.profile.email} is not authorized`);
      }

      // Check if user exists
      const existingUser = await ctx.db.query('users')
        .withIndex('email', (q: any) => q.eq('email', args.profile.email))
        .first();

      if (existingUser) {
        // User exists - update their profile information
        await ctx.db.patch(existingUser._id, {
          email: args.profile.email,
          name: args.profile.name,
          image: args.profile.image,
        });
        return existingUser._id;
      }

      // User doesn't exist - create if OAuth user
      if (args.type === 'oauth') {
        return ctx.db.insert("users", {
          email: args.profile.email,
          name: args.profile.name,
          image: args.profile.image,
        });
      }

      throw `User ${args.profile.email} doesn't exist`;
    },
  },
});