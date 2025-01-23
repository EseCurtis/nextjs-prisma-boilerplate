
import { DBClient } from "@/config/database";
import { updateUserSchema } from "@/utils/server/request-schemas";
import { RouteHandler } from "@/utils/server/route-handler";
import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";

const routeHandler = new RouteHandler();


routeHandler.addRoute(
    updateUserSchema,
    async (req: NextRequest, body, { }, authUser) => {
        try {
            const { userId } = authUser!;
            const { firstName, lastName, role } = body;

            // Validate and fetch user data
            const matchedUser = await DBClient.users.findUnique({
                where: { uuid: userId },
            });

            if (!matchedUser) {
                return {
                    msg: "User not found",
                    status: 404,
                };
            }

            // Update user profile
            const updatedUser = await DBClient.users.update({
                where: {
                    uuid: matchedUser.uuid,
                },
                data: {
                    firstName: firstName || matchedUser.firstName,
                    lastName: lastName || matchedUser.lastName,
                    role: role || matchedUser.role,
                },
            });

            // Prepare sanitized user data for response
            const sanitizedUser = {
                uuid: updatedUser.uuid,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                role: updatedUser.role,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt,
            };

            return {
                msg: "User updated successfully",
                data: sanitizedUser,
            };
        } catch (error) {
            console.error("Error updating user:", error);
            return {
                msg: "Internal server error",
                status: 500,
            };
        }
    },
    "PUT", // Use PUT method for updating resources
    [UserRole.MANAGER] // Role-based access control
);

// Handle PUT request for updating user profile data
export async function PUT(req: NextRequest) {
    return routeHandler.handle(req);
}
