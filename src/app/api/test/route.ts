
import { RouteHandler } from "@/utils/server/route-handler";
import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";
import { z } from "zod";

const routeHandler = new RouteHandler();

routeHandler.addRoute(
    z.object({}),
    async (req: NextRequest, body, { }, authUser) => {
        try {
            const { userId } = authUser!;



            return {
                msg: "User bio data retrieved successfully",
                data: { userId },
            };
        } catch (error) {
            console.error("Error retrieving bio data:", error);
            return {
                msg: "Internal server error",
                status: 500,
            };
        }
    },
    "GET",
    [UserRole.CUSTOMER, UserRole.DELIVERY_PARTNER, UserRole.MANAGER] // Role-based access control
);

// Handle GET request for retrieving user bio data
export async function GET(req: NextRequest) {
    return routeHandler.handle(req,);
}
