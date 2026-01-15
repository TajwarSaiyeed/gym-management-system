import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";


export default withAuth(
    function middleware(request: NextRequestWithAuth) {

        const user =
            request.nextauth.token?.role === "user" &&
            (request.nextUrl.pathname.startsWith("/exercise") ||
                request.nextUrl.pathname.startsWith("/diet") ||
                request.nextUrl.pathname.startsWith("/fees") ||
                request.nextUrl.pathname.startsWith("/add-user") ||
                request.nextUrl.pathname.startsWith("/students"));

        if (user) {
            return NextResponse.rewrite(new URL("/unauthorized", request.url));
        }

        const adminOrTrainer =
            request.nextUrl.pathname.startsWith("/user") &&
            request.nextauth.token?.role !== "user";

        if (adminOrTrainer) {
            return NextResponse.rewrite(new URL("/unauthorized", request.url));
        }

        const admin = request.nextauth.token?.role !== "admin" && request.nextUrl.pathname.startsWith("/manage-user");

        if (admin) {
            return NextResponse.rewrite(new URL("/unauthorized", request.url));
        }


    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        secret: process.env.NEXTAUTH_SECRET,
    }
);

export const config = {
    matcher: [
        "/",
        "/api",
        "/add-user",
        "/manage-user",
        "/profile",
        "/notifications",
        "/students/:path*",
        "/trainers/:path*",
        "/fees",
        "/exercise/:path*",
        "/diet/:path*",
        "/user/:path*",
    ],
};
