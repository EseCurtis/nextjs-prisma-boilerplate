import { DBClient } from "@/config/database";
import { MailerService } from "@/utils/server/mailer-service"; // Utility to send emails
import { requestConfirmationSchema } from "@/utils/server/request-schemas";
import { RouteHandler } from "@/utils/server/route-handler";
import crypto from "crypto";
import { NextRequest } from "next/server";

const routeHandler = new RouteHandler();

// Add the route with validation and handler logic
routeHandler.addRoute(
    requestConfirmationSchema,
    async (req: NextRequest, body) => {
        try {
            const { email } = body;

            // Check if the user exists
            const user = await DBClient.users.findUnique({
                where: { email },
            });

            if (!user) {
                return {
                    msg: "User not found",
                    status: 404,
                };
            }

            // Generate a new OTP and expiration time
            const otp = crypto.randomInt(100000, 999999); // 6-digit OTP
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

            // Store the OTP in the database
            await DBClient.confirmations.create({
                data: { user: { connect: { email } }, otp, expiresAt },
            });

            // Send the OTP to the user's email
            await MailerService.sendTemplate.ACCOUNT_CONFIRMATION_OTP({ email, otp });

            return {
                msg: "Confirmation OTP sent successfully. Please check your email.",
                data: {
                    user: {
                        requestedConfirmation: true
                    }
                },
                status: 200,
            };
        } catch (error) {
            console.error("Error requesting account confirmation:", error);
            return {
                msg: "Internal server error",
                status: 500,
            };
        }
    },
    "POST"
);

// Handle POST request for account confirmation
export async function POST(req: NextRequest) {
    return routeHandler.handle(req);
}
