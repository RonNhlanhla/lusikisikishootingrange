import { internalMutation } from "../_generated/server";
import { v } from "convex/values";
import { resend } from "../sendEmails";

export const sendBookingEmail = internalMutation({
    args: {
        to: v.string(),
        bookingId: v.id("bookings"),
    },
    handler: async (ctx, { to, bookingId }) => {
        await resend.sendEmail(ctx, {
            from: "Mode <bookings@mode.com>",
            to,
            subject: "Your booking is confirmed",
            html: `Your booking ${bookingId} is confirmed.`,
        });
    },
});
