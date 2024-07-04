import { PrismaClient } from "@prisma/client/extension";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { compare } from "bcryptjs";
export async function POST(req:NextRequest,res:NextResponse){
    try {
        const prisma = new PrismaClient();
        const {email,password} = await req.json();

        const user = prisma.user.findUnique({
            where:{
                email:email
            }
        })

        if(!user){
            return NextResponse.json({
                type : "user-error",
                message : "The user does not exists."
            })
        }


        const isPassValid = await compare(user.password,password);

        if(!isPassValid){
            return NextResponse.json({
                type : "user-error",
                message : "Password is incorrect"
            })
        }


        const token = jwt.sign({
            id:user.id,
            email:user.email
        },process.env.PASS_HASH_KEY as string,{
            expiresIn:'2d'
        });

        return NextResponse.json({
            type:"success",
            message : token
        });

    } catch (error) {
        console.log(error)
    }
}