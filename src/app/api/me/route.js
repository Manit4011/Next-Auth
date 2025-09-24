import { getDataFromToken } from "@/helper/getDataFromToken";
import { User } from "@/lib/models/userModel";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

connectDB();

export async function GET(request){
    //get data from token
    const userId = await getDataFromToken(request);
    const userData = await User.findById(userId).select("-password");
    return NextResponse.json({user: userData}, {status: 200});
}