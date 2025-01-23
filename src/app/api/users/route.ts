import { DBClient } from "@/config/database";
import { stripSensitiveProperties } from "@/utils/helpers";
import { RouteHandler } from "@/utils/server/route-handler";
import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";
import { z } from "zod";

const routeHandler = new RouteHandler();

routeHandler.addRoute(
    z.object({}),
    async (req: NextRequest) => {
        try {
            const searchParams = req.nextUrl.searchParams;
            const page = Number(searchParams.get("page")) || 1; // Current page number
            const limit = Number(searchParams.get("limit")) || 10; // Items per page
            const role = (searchParams.get("role") || undefined) as UserRole | undefined;

            // Calculate the offset for pagination
            const offset = (page - 1) * limit;

            // Fetch the users for the current page
            const users = await DBClient.users.findMany({
                skip: offset,
                take: limit,
                orderBy: { createdAt: "desc" },
                where: {
                    role,

                }
            });

            // Count total users for pagination metadata
            const totalUsers = await DBClient.users.count();

            // Calculate total pages
            const totalPages = Math.ceil(totalUsers / limit);

            return {
                msg: "Users retrieved successfully",
                data: users.map((user) =>
                    stripSensitiveProperties(user, ["id"])
                ),
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: totalUsers,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1,
                },
            };
        } catch (error) {
            console.error("Error retrieving users:", error);
            return { msg: "Internal server error", status: 500 };
        }
    },
    "GET",
    [UserRole.MANAGER]
);

// Handle GET request for retrieving all users (number-based pagination)
export async function GET(req: NextRequest) {
    return routeHandler.handle(req);
}
