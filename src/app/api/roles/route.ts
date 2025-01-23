
import { RouteHandler } from "@/utils/server/route-handler";
import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";
import { z } from "zod";

const routeHandler = new RouteHandler();

// Add the route with validation and handler logic
routeHandler.addRoute(
    z.object({}),
    async () => {

        // Return a success response with the JWT token
        return {
            msg: UserRole,
        };
    },
    "GET"
);

export async function GET(req: NextRequest) {
    return routeHandler.handle(req);
}
