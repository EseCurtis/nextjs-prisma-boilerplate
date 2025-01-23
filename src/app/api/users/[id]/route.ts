/* eslint-disable @typescript-eslint/no-explicit-any */

import { DBClient } from "@/config/database";
import { stripSensitiveProperties } from "@/utils/helpers";
import { RouteHandler } from "@/utils/server/route-handler";
import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";
import { z } from "zod";

const routeHandler = new RouteHandler();

// Add route for creating feedback for user
routeHandler.addRoute(
    z.object({}),
    async (req: NextRequest, body, { userId }) => {
        try {

            // Find the user by userId
            const user = await DBClient.users.findUnique({
                where: { uuid: userId },

            });

            if (!user) {
                return { msg: "User not found", status: 404 };
            }

            return {
                msg: "User retrieved successfully",
                data: stripSensitiveProperties(user, ["id"]),
            };

        } catch (error) {
            console.error("Error creating feedback:", error);
            return { msg: "Internal server error", status: 500 };
        }
    },
    "GET",
    [UserRole.MANAGER]
);



// Handle POST request for creating feedback
export async function GET(req: NextRequest, { params }: { params: any }) {
    const { id: userId } = await params;

    return routeHandler.handle(req, { userId });
}