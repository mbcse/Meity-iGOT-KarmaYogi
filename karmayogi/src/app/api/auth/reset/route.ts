import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return NextResponse.json({
                type: "user-error",
                message: "The user does not exist.",
            });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.PASS_HASH_KEY as string, { expiresIn: '1h' });

        console.log(`Password reset token for ${email}: ${token}`);

        return NextResponse.json({
            type: "success",
            message: "Password reset email sent.",
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            type: "error",
            message: "An error occurred while processing the password reset request.",
        });
    }
}
