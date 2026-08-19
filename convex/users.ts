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

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new ConvexError("Not authenticated");

    const currentUserRole = await getInternalUserRole(ctx, currentUserId);
    if (currentUserRole?.role !== "admin") {
      throw new ConvexError("Not authorized");
    }

    let roleRecord = await ctx.db
      .query("userRoles")
      .filter((q) => q.eq(q.field("role"), args.role))
      .unique();

    if (!roleRecord) {
      const roleId = await ctx.db.insert("userRoles", { role: args.role });
      roleRecord = await ctx.db.get(roleId);
    }

    const userId = args.userId;
    const someRoleId = roleRecord!._id;
    await ctx.db.patch(userId, { userRoleId: someRoleId });
  },
});

export const seedAdmin = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    let adminRole = await ctx.db
      .query("userRoles")
      .filter((q) => q.eq(q.field("role"), "admin"))
      .unique();

    if (!adminRole) {
      const roleId = await ctx.db.insert("userRoles", { role: "admin" });
      adminRole = await ctx.db.get(roleId);
    }

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      throw new ConvexError(`User with email ${args.email} not found. Please sign up or log in first so the user record is created.`);
    }

    await ctx.db.patch(user._id, { userRoleId: adminRole!._id });
    return `Successfully promoted ${args.email} to admin!`;
  },
});

export const getUsersForAdmin = query({
  args: {},
  handler: async (ctx) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) return null;

    const currentUserRole = await getInternalUserRole(ctx, currentUserId);
    if (currentUserRole?.role !== "admin") return null;

    const allUsers = await ctx.db.query("users").collect();
    const enrichedUsers = await Promise.all(
      allUsers.map(async (user) => {
        const roleDoc = user.userRoleId ? await ctx.db.get(user.userRoleId) : null;
        return {
          ...user,
          role: roleDoc?.role ?? "user",
        };
      })
    );

    return enrichedUsers;
  },
});

export const getAllBookingsForAdmin = query({
  args: {},
  handler: async (ctx) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) return null;

    const currentUserRole = await getInternalUserRole(ctx, currentUserId);
    if (currentUserRole?.role !== "admin") return null;

    return await ctx.db.query("bookings").collect();
  },
});

export const updateBookingStatus = mutation({
  args: {
    bookingId: v.id("bookings"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new ConvexError("Not authenticated");

    const currentUserRole = await getInternalUserRole(ctx, currentUserId);
    if (currentUserRole?.role !== "admin") {
      throw new ConvexError("Not authorized");
    }

    await ctx.db.patch(args.bookingId, { status: args.status });
  },
});

export const getAllRegistrationsForAdmin = query({
  args: {},
  handler: async (ctx) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) return null;

    const currentUserRole = await getInternalUserRole(ctx, currentUserId);
    if (currentUserRole?.role !== "admin") return null;

    const registrations = await ctx.db.query("registrations").collect();
    const enriched = await Promise.all(
      registrations.map(async (reg) => {
        const course = await ctx.db.get(reg.courseId);
        const user = await ctx.db.get(reg.userId);
        const pdfUrl = reg.pdfStorageId ? await ctx.storage.getUrl(reg.pdfStorageId) : undefined;
        return {
          ...reg,
          courseName: course?.course_name || "Unknown Course",
          userEmail: user?.email || "Unknown User",
          userName: user?.name || "Unknown User",
          pdfUrl,
        };
      })
    );

    return enriched;
  },
});

export const updateRegistrationStatus = mutation({
  args: {
    registrationId: v.id("registrations"),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("cancelled")),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new ConvexError("Not authenticated");

    const currentUserRole = await getInternalUserRole(ctx, currentUserId);
    if (currentUserRole?.role !== "admin") {
      throw new ConvexError("Not authorized");
    }

    await ctx.db.patch(args.registrationId, { status: args.status });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new ConvexError("Not authenticated");
    const currentUserRole = await getInternalUserRole(ctx, currentUserId);
    if (currentUserRole?.role !== "admin") {
      throw new ConvexError("Not authorized");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const updateRegistrationPdf = mutation({
  args: {
    registrationId: v.id("registrations"),
    pdfStorageId: v.optional(v.string()),
    pdfName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new ConvexError("Not authenticated");
    const currentUserRole = await getInternalUserRole(ctx, currentUserId);
    if (currentUserRole?.role !== "admin") {
      throw new ConvexError("Not authorized");
    }
    await ctx.db.patch(args.registrationId, {
      pdfStorageId: args.pdfStorageId,
      pdfName: args.pdfName,
    });
  },
});

export const markDownloadFeeAsPaid = mutation({
  args: {
    registrationId: v.string(),
  },
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId("registrations", args.registrationId);
    if (!id) throw new ConvexError("Invalid registration ID");
    await ctx.db.patch(id, { downloadFeePaid: true });
  },
});


