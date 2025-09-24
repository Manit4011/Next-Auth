//logout route

import { NextResponse } from "next/server";

export async function POST(request){
    try {
        const response = NextResponse.json({message: "Logout successful"}, {status: 200});
        response.cookies.set("token", "", {httpOnly: true, expires: new Date(0)});
        return response;
        
    } catch (error) {
        console.log("error in logout route", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}