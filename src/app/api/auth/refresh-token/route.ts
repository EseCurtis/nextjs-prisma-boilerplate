import { DBClient } from "@/config/database";
import { AuthUserType } from "@/types/base-types";
import { refreshTokenSchema } from "@/utils/server/request-schemas";
import { RouteHandler } from "@/utils/server/route-handler";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const routeHandler = new RouteHandler();

// Add the route with validation and handler logic
routeHandler.addRoute(
    refreshTokenSchema,
    async (req: NextRequest, body) => {
        const { refreshToken } = body;

        try {
            // Verify the refresh token
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || "NO_JWT") as AuthUserType;

            // Check if the user exists in the database
            const matchedUser = await DBClient.users.findUnique({
                where: {
                    uuid: decoded.userId
                }
            });

            // If the user doesn't exist, return an error
            if (!matchedUser) {
                return {
                    msg: "Invalid refresh token",
                    status: 401
                };
            }

            const authUser: AuthUserType = {
                userId: matchedUser.uuid,
                email: matchedUser.email,
                role: matchedUser.role,
            };

            // Generate a new JWT token
            const newToken = jwt.sign(
                authUser,
                process.env.JWT_SECRET || "NO_JWT",
                { expiresIn: "24h" }
            );

            // Return a success response with the new JWT token
            return {
                msg: "Token refreshed successfully",
                data: { token: newToken, refreshToken, user: authUser }
            };
        } catch (error) {
            console.error("Error requesting new token:", error);
            return {
                msg: "Invalid refresh token",
                status: 401
            };
        }
    }
);

export async function POST(req: NextRequest) {
    return routeHandler.handle(req);
}
