import { createAccount, getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Retrieves the internal user role for a given user ID.
 */
async function getInternalUserRole(ctx: QueryCtx, userId: Id<"users">) {
  const user = await ctx.db.get(userId);
  const userRole = await ctx.db
    .query("userRoles")
    .filter((q) => q.eq(q.field("_id"), user?.userRoleId))
    .unique();/*  */

  return { role: userRole?.role ?? "user" };
}

/**
 * Admin creates a new user account with specified email, password, and role.
 * @param args - The arguments for creating a user, including:
 *   - email: The email of the new user.
 *   - password: The password for the new user.
 *   - userRoleId: Optional ID for the user's role.
 * @returns The newly created user account.
 */
export const adminCreateUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    userRoleId: v.optional(v.id("userRoles")),
  },
  handler: async (
    ctx: any,
    args: { password: string; email: string; userRoleId?: string }
  ) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const userRole = await getInternalUserRole(ctx, userId);
    if (userRole?.role !== "admin") {
      throw new ConvexError("Not authorized");
    }

    const providerId = "password";
    const secret = args.password;
    const account = {
      id: args.email,
      secret: secret,
    };
    const profile = {
      email: args.email,
      userRoleId: args.userRoleId ?? null,
    };
    const newUser = await createAccount(ctx, {
      provider: providerId,
      account: account,
      profile: profile,
      shouldLinkViaEmail: false,
      shouldLinkViaPhone: false,
    });
    return newUser;
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});