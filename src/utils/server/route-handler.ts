/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthUserType } from "@/types/base-types";
import jwt from "jsonwebtoken"; // Assuming you're using JWT for auth
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

export class RouteHandler {
    private routeHandler: { schema: z.ZodSchema<any>, handler: (req: NextRequest, body: any, variables: any, user?: AuthUserType) => Promise<unknown> }
        = { schema: z.object({}), handler: async () => { } };
    private method: string = "POST";
    private requiredRoles?: string[]; // Store the required roles for the route

    // Add a route with validation and handler, including optional role protection
    addRoute<T>(
        schema: z.ZodSchema<T>,
        handler: (req: NextRequest, body: T, variables?: any, user?: AuthUserType) => Promise<unknown>,
        method: string = "POST",
        requiredRoles?: string[] // Pass requiredRoles for authorization (array of roles)
    ) {
        this.routeHandler = { schema, handler };
        this.method = method;
        this.requiredRoles = requiredRoles;
    }

    // Middleware to check authentication and authorization
    private async authenticate(req: NextRequest) {
        const token = req.headers.get("Authorization")?.replace("Bearer ", "");



        if (!token) {
            throw new Error("Unauthorized");
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET! || "NO_JWT") as any;

            // Optionally check if the user's role is in the list of required roles
            if (this.requiredRoles && !this.requiredRoles.includes(decoded.role)) {
                throw new Error("Forbidden");
            }

            return decoded; // Return decoded user information
        } catch (error) {
            console.log(error)
            throw new Error("Unauthorized");
        }
    }

    // Handle the incoming request with validation, authentication, and authorization
    async handle(req: NextRequest, variables?: any) {
        const routeConfig = this.routeHandler;

        try {
            // Check authentication
            const user = this.requiredRoles && await this.authenticate(req); // Get authenticated user

            // Parse and validate the request body using Zod if the method is POST or PUT
            let parsedBody: any = {};
            if (this.method === "POST" || this.method === "PUT") {
                const body = await req.json();
                parsedBody = routeConfig.schema.parse(body); // This will throw an error if validation fails
            }

            // Call the route's handler if validation and authentication are successful
            const response = await routeConfig.handler(req, parsedBody, { ...variables }, user);

            const status = (response as any)?.status || 200;

            // Return the response from the handler
            return NextResponse.json(response, { status });
        } catch (error: any) {
            // Handle validation or other errors
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((err) => `${err.path.join('.')} - ${err.message}`);
                return NextResponse.json({ msg: "Validation Error", errors: errorMessages }, { status: 400 });
            }

            if (error.message === "Unauthorized") {
                return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
            }

            if (error.message === "Forbidden") {
                return NextResponse.json({ msg: "Forbidden" }, { status: 403 });
            }

            console.error("Error:", error);
            return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
        }
    }
}


