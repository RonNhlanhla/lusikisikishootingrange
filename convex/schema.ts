import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  authAccounts: defineTable({
    provider: v.string(),
    providerAccountId: v.string(),
    userId: v.id("users"),
    secret: v.optional(v.string()),
    emailVerified: v.optional(v.string()),
    accessToken: v.optional(v.string()),
    refreshToken: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    tokenType: v.optional(v.string()),
    scope: v.optional(v.string()),
    idToken: v.optional(v.string()),
    sessionState: v.optional(v.string()),
  })
    .index("providerAndAccountId", ["provider", "providerAccountId"])
    .index("userIdAndProvider", ["userId", "provider"]),
  numbers: defineTable({
    value: v.number(),
  }),
  userRoles: defineTable({
    role: v.string(), //learner & admin
    // other fields...
  }),
  users: defineTable({
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    userRoleId: v.optional(v.id("userRoles")),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    location: v.optional(v.string()),
    profile_bio: v.optional(v.string()),
    profile_picture: v.optional(v.string()),
    PSIRA_number: v.optional(v.string()),
    PSIRA_grade: v.optional(v.string()),
    firearm_training: v.optional(
      v.array(
        v.union(
          v.literal("rifle"),
          v.literal("handgun"),
          v.literal("shotgun"),
          v.literal("hunting rifle")
        )
      )
    ),
    competency_status: v.optional(v.string()),
    competency_number: v.optional(v.string()),
    competency_issue_date: v.optional(v.string()),
    competency_expiry_date: v.optional(v.string()),
    competency_types: v.optional(v.array(v.string())),
    regulation_21_status: v.optional(v.string()),
    regulation_21_expiry: v.optional(v.string()),
    regulation_21_number: v.optional(v.string()),
    registered_firearms: v.optional(
      v.array(
        v.object({
          id: v.string(),
          make: v.string(),
          model: v.string(),
          caliber: v.string(),
          serial_number: v.string(),
          license_type: v.string(),
          expiry_date: v.string(),
        })
      )
    ),
    // other "users" fields...
  }).index("email", ["email"]),
  courses: defineTable({
    authority: v.string(),
    course_description: v.string(),
    course_id: v.float64(),
    course_name: v.string(),
    price: v.float64(),
  }).index("by_authority", ["authority"]),
  file: defineTable({
    name: v.string(),
    storageId: v.id("_storage"),
  }),
  jobs: defineTable({
    job_title: v.string(),
    job_description: v.string(),
    job_location: v.string(),
    price: v.float64(),
    user: v.string(),  // Store user email directly
    status: v.union(
      v.literal('active'),
      v.literal('filled'),
      v.literal('cancelled')
    ),
    created_at: v.optional(v.number()),
    updated_at: v.optional(v.number()),
  })
    .index("by_job_title", ["job_title"])
    .index("by_user", ["user"])
    .index("by_status", ["status"]),
  registrations: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("cancelled")),
    amount: v.number(),
    paymentId: v.optional(v.string()),
    registeredAt: v.number(),
    deliveryMethod: v.optional(v.union(v.literal("collect"), v.literal("delivery"))),
    address: v.optional(v.string()),
    recipientName: v.optional(v.string()),
    idNumber: v.optional(v.string()),
    bookingDate: v.optional(v.number()),
    pdfStorageId: v.optional(v.string()),
    pdfName: v.optional(v.string()),
    downloadFeePaid: v.optional(v.boolean()),
  })
    .index("by_userId", ["userId"])
    .index("by_courseId", ["courseId"])
    .index("by_userId_and_courseId", ["userId", "courseId"]),
  bookings: defineTable({
    userId: v.id("users"),
    userEmail: v.string(),
    types: v.array(
      v.union(
        v.literal("Handgun"),
        v.literal("Self Loading Rifle"),
        v.literal("Hunting Rifle"),
        v.literal("Shotgun")
      )
    ),
    date: v.number(),
    status: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_date", ["date"]),
});