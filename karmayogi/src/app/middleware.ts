import { NextRequest,NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    // Extract the token from cookies
    const token = req.cookies.get('token');

    // Define the paths that should be protected
    const protectedPaths = ['/((main))/*'];

    // Log the current request URL and token
    console.log(`Request URL: ${req.url}`);
    console.log(`Extracted Token: ${token}`);

    // Check if the request URL matches any of the protected paths
    const url = req.nextUrl.clone();
    const isProtectedPath = protectedPaths.some((path) => url.pathname.startsWith(path));

    // Log whether the path is protected
    console.log(`Is Protected Path: ${isProtectedPath}`);

    // If the path is protected and no token is found, redirect to login
    if (isProtectedPath && !token) {
        console.log('Redirecting to login page due to missing token');
        url.pathname = '/login'; // Redirect to the login page
        return NextResponse.redirect(url);
    }

    // Log if the request is allowed to proceed
    console.log('Request allowed to proceed');
    return NextResponse.next();
}

// Define routes where the middleware should apply
export const config = {
    matcher: ['/((main))/*'], // Apply middleware to all routes under ((main))
};
