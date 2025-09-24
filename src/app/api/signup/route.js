import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/userModel";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helper/mailer";

// connect to DB once when route file loads
const loadDB = async () => {
  await connectDB();
};
loadDB();

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    // check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    // send verification email
    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error in signup route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
