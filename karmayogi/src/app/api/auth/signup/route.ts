import { PrismaClient } from "@prisma/client/extension";
import { NextRequest, NextResponse } from "next/server";
import {hash} from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req:NextRequest,res:NextResponse){
    try {
        const prisma = new PrismaClient();
        const {email,password,name} = await req.json();

        const passwordHash = await hash(password,10);

        const user = prisma.user.create({
            data:{
                email:email,
                name : name,
                password:passwordHash
            }
        })

        if(!user){
            return NextResponse.json({
                type : "error",
                message : "User could not be created ."
            })
        }


        const token = jwt.sign({
            id : user.id,
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