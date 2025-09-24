import { User } from "@/lib/models/userModel";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const loadDB = async()=>{
    await connectDB();
}
loadDB();

export async function POST(request){
    try {

        const reqBody = await request.json();
        const {email, password} = reqBody;

        const user = await User.findOne({email});
        if (!user){
            return NextResponse.json({error: "Invalid email or password"}, {status: 400});
        }
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect){
            return NextResponse.json({error: "Invalid email or password"}, {status: 400});
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn: '1h'});

        const response = NextResponse.json({message: "Login successful"}, {status: 200});
        response.cookies.set("token", token, {httpOnly: true});
        return response;
        

    } catch (error) {
        console.log("error in login route", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}