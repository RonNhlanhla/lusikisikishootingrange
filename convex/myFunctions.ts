import { query, mutation, MutationCtx, QueryCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Returns basic info about the currently‑authenticated user.
 * Used by `api.myFunctions.getUserinfo` on the front‑end.
 */
export const getUserinfo = query({
    args: {},
    handler: async (ctx: QueryCtx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null; // not logged in

        const user = await ctx.db.get(userId);
        if (!user) return null;

        const roleDoc = user.userRoleId ? await ctx.db.get(user.userRoleId) : null;
        const role = roleDoc?.role ?? "user";

        // Return all fields needed in the UI
        return {
            _id: user._id,
            email: user.email,
            name: user.name,
            username: user.username ?? user.name,
            location: user.location,
            profile_bio: user.profile_bio,
            profile_picture: user.profile_picture,
            PSIRA_number: user.PSIRA_number,
            PSIRA_grade: user.PSIRA_grade,
            firearm_training: user.firearm_training,
            competency_status: user.competency_status,
            competency_number: user.competency_number,
            competency_issue_date: user.competency_issue_date,
            competency_types: user.competency_types,
            role,
            regulation_21_status: user.regulation_21_status,
            regulation_21_expiry: user.regulation_21_expiry,
            regulation_21_number: user.regulation_21_number,
            registered_firearms: user.registered_firearms,
        };
    },
});

/**
 * Returns all jobs posted by the current user.
 */
export const getJobsByUser = query({
    args: {},
    handler: async (ctx: QueryCtx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        const user = await ctx.db.get(userId);
        if (!user || !user.email) return [];

        // Assuming your `jobs` table has a `user` field that stores the creator's Email
        const jobs = await ctx.db
            .query("jobs")
            .filter((q) => q.eq(q.field("user"), user.email))
            .collect();

        return jobs;
    },
});

/**
 * Returns jobs posted by *other* users (i.e. everything except the current user's jobs).
 */
export const getJobsUsers = query({
    args: {},
    handler: async (ctx: QueryCtx) => {
        const userId = await getAuthUserId(ctx);
        let q = ctx.db.query("jobs");
        if (userId) {
            const user = await ctx.db.get(userId);
            if (user && user.email) {
                // Exclude the current user's own jobs
                q = q.filter((q) => q.neq(q.field("user"), user.email));
            }
        }
        const jobs = await q.collect();
        return jobs;
    },
});

/**
 * Example mutation – create a new job (you already have a similar one in `api.myFunctions.createJob`,
 * but keeping it here for completeness).
 */
export const createJob = mutation({
    args: {
        job_title: v.string(),
        job_description: v.string(),
        price: v.number(),
        job_location: v.string(),
    },
    handler: async (ctx: MutationCtx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("User must be logged in");

        const user = await ctx.db.get(userId);
        if (!user || !user.email) throw new Error("User email not found");

        await ctx.db.insert("jobs", {
            job_title: args.job_title,
            job_description: args.job_description,
            price: args.price,
            job_location: args.job_location,
            user: user.email,
            status: "active",
            created_at: Date.now(),
        });
    },
});

export const getJobById = query({
    args: {
        jobId: v.id("jobs"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.jobId);
    },
});

export const updateJob = mutation({
    args: {
        id: v.id("jobs"),
        job_title: v.string(),
        job_description: v.string(),
        price: v.number(),
        job_location: v.string(),
        status: v.union(
            v.literal("active"),
            v.literal("filled"),
            v.literal("cancelled")
        ),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        await ctx.db.patch(id, {
            ...updates,
            updated_at: Date.now(),
        });
    },
});

export const listCourses = query({
    args: { authority: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("courses")
            .withIndex("by_authority", (q) => q.eq("authority", args.authority))
            .collect();
    },
});

export const createRegistrations = mutation({
    args: {
        items: v.array(v.object({
            courseId: v.id("courses"),
            amount: v.number(),
            bookingDate: v.optional(v.number()),
        })),
        deliveryMethod: v.optional(v.union(v.literal("collect"), v.literal("delivery"))),
        address: v.optional(v.string()),
        recipientName: v.optional(v.string()),
        idNumber: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("User must be logged in");

        if (args.items.length === 0) {
            throw new Error("No items to register");
        }

        const firstItem = args.items[0];
        const registeredAt = Date.now();

        // Insert the first item to get an ID
        const paymentId = await ctx.db.insert("registrations", {
            userId,
            courseId: firstItem.courseId,
            status: "pending",
            amount: firstItem.amount,
            registeredAt,
            deliveryMethod: args.deliveryMethod,
            address: args.address,
            recipientName: args.recipientName,
            idNumber: args.idNumber,
            bookingDate: firstItem.bookingDate,
        });

        // Update the first item to have its own ID as paymentId
        await ctx.db.patch(paymentId, { paymentId });

        // Insert the rest
        for (let i = 1; i < args.items.length; i++) {
            const item = args.items[i];
            await ctx.db.insert("registrations", {
                userId,
                courseId: item.courseId,
                status: "pending",
                amount: item.amount,
                paymentId, // Link to the first one
                registeredAt,
                deliveryMethod: args.deliveryMethod,
                address: args.address,
                recipientName: args.recipientName,
                idNumber: args.idNumber,
                bookingDate: item.bookingDate,
            });
        }

        return paymentId;
    },
});

export const additionalUserInfo = mutation({
    args: {
        username: v.string(),
        location: v.string(),
        profile_bio: v.string(),
        profile_picture: v.string(),
        PSIRA_number: v.string(),
        PSIRA_grade: v.string(),
        firearm_training: v.array(
            v.union(
                v.literal("rifle"),
                v.literal("handgun"),
                v.literal("shotgun"),
                v.literal("hunting rifle")
            )
        ),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("User must be logged in");

        await ctx.db.patch(userId, {
            username: args.username,
            location: args.location,
            profile_bio: args.profile_bio,
            profile_picture: args.profile_picture,
            PSIRA_number: args.PSIRA_number,
            PSIRA_grade: args.PSIRA_grade,
            firearm_training: args.firearm_training,
        });
    },
});

export const updateUserProfile = mutation({
    args: {
        firstName: v.string(),
        lastName: v.string(),
        phone: v.string(),
        address: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("User must be logged in");

        await ctx.db.patch(userId, {
            name: `${args.firstName} ${args.lastName}`.trim(),
            phone: args.phone,
            location: args.address,
        });
    },
});

export const listNumbers = query({
    args: {
        count: v.number(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("numbers").take(args.count);
    },
});

export const addNumber = mutation({
    args: {
        value: v.number(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("numbers", { value: args.value });
    },
});

export const getMyRegistrations = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        const registrations = await ctx.db
            .query("registrations")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .collect();

        // Enrich with course details
        const enrichedRegistrations = await Promise.all(
            registrations.map(async (reg) => {
                const course = await ctx.db.get(reg.courseId);
                const pdfUrl = reg.pdfStorageId ? await ctx.storage.getUrl(reg.pdfStorageId) : undefined;
                return {
                    ...reg,
                    courseName: course?.course_name || "Unknown Course",
                    pdfUrl,
                };
            })
        );

        return enrichedRegistrations;
    },
});

export const bookRangeSession = mutation({
    args: {
        types: v.array(
            v.union(
                v.literal("Handgun"),
                v.literal("Self Loading Rifle"),
                v.literal("Hunting Rifle"),
                v.literal("Shotgun")
            )
        ),
        date: v.number(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("User must be logged in");

        const user = await ctx.db.get(userId);
        if (!user || !user.email) throw new Error("User email not found");

        const bookingId = await ctx.db.insert("bookings", {
            userId,
            userEmail: user.email,
            types: args.types,
            date: args.date,
            status: "pending",
        });

        await ctx.scheduler.runAfter(0, internal.internal.sendBookingEmail.sendBookingEmail, {
            to: user.email,
            bookingId,
        });
    },
});

export const getMyBookings = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        return await ctx.db
            .query("bookings")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .collect();
    },
});

export const updateCompetency = mutation({
    args: {
        competency_status: v.string(),
        competency_number: v.optional(v.string()),
        competency_issue_date: v.optional(v.string()),
        competency_types: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("User must be logged in");

        await ctx.db.patch(userId, {
            competency_status: args.competency_status,
            competency_number: args.competency_number,
            competency_issue_date: args.competency_issue_date,
            competency_types: args.competency_types,
        });
    },
});

export const updateRegulation21 = mutation({
    args: {
        regulation_21_status: v.string(),
        regulation_21_number: v.optional(v.string()),
        regulation_21_expiry: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("User must be logged in");

        await ctx.db.patch(userId, {
            regulation_21_status: args.regulation_21_status,
            regulation_21_number: args.regulation_21_number,
            regulation_21_expiry: args.regulation_21_expiry,
        });
    },
});

export const updateRegisteredFirearms = mutation({
    args: {
        registered_firearms: v.array(
            v.object({
                id: v.string(),
                make: v.string(),
                model: v.string(),
                caliber: v.string(),
                serial_number: v.string(),
                license_type: v.string(),
                expiry_date: v.string(),
            })
        ),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("User must be logged in");

        await ctx.db.patch(userId, {
            registered_firearms: args.registered_firearms,
        });
    },
});