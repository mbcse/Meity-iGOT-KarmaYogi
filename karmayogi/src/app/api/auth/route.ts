import { PrismaClient } from "@prisma/client/extension";
import { NextRequest, NextResponse } from "next/server";
import {verify} from '@node-rs/argon2'
import jwt from 'jsonwebtoken'
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


        const isPassValid = await verify(user.password,password,{
            memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
        });

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