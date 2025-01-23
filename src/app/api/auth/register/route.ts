import { DBClient } from "@/config/database";
import { stripSensitiveProperties } from "@/utils/helpers";
import { MailerService } from "@/utils/server/mailer-service";
import { registerUserSchema } from "@/utils/server/request-schemas";
import { RouteHandler } from "@/utils/server/route-handler";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

const routeHandler = new RouteHandler();

// Add route with validation and handler logic
routeHandler.addRoute(
    registerUserSchema,
    async (req: NextRequest, body) => {
        try {
            const { password, firstName, lastName, email } = body;

            // Check if the user already exists by email
            const existingUser = await DBClient.users.findUnique({
                where: {
                    email,
                },
            });

            if (existingUser) {
                return { msg: "User with this email already exists", status: 400 };
            }

            // Hash the password before storing
            const passwordHash = await bcrypt.hash(password, 10);

            // Create the new user
            const createdUser = await DBClient.users.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    role: UserRole.MANAGER,
                    passwordHash,
                },
            });

            // Send email to new user
            await MailerService.sendTemplate.WELCOME_USER({ email: createdUser.email, firstName: createdUser.firstName });

            return {
                msg: "User registered successfully",
                data: stripSensitiveProperties(createdUser, ["id"]),
            };
        } catch (error) {
            console.error("Error registering user:", error);
            return { msg: "Error registering user", status: 500 };
        }
    }
);

export async function POST(req: NextRequest) {
    return routeHandler.handle(req);
}
