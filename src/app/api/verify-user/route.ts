import { NextRequest, NextResponse } from "next/server";
import userModel from "@/models/User.models";
import dbConnection from "@/lib/dbConnection";
import { z } from "zod";

import { verifySchema } from "@/Schemas/verifySchema";
import { usernameValidation } from "@/Schemas/signUpSchema";

const verifyUserSchema = z.object({
  username: usernameValidation,
  verifyCode: verifySchema,
});

// Algo step 

// fetch data
// validate date
// check data
// find user and fetch based on the username 
// check user code and expairy data and compair
// if not match return faslw

export async function POST(req: NextRequest) {
  await dbConnection();

  try {
    // Parse request body
    const body = await req.json();

    // Validate request body
    const result = verifyUserSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input data",
          errors: errors,
        },
        { status: 400 }
      );
    }

    const { username, verifyCode } = result.data;
    const decodedUser = decodeURIComponent(username);

    const user = await userModel.findOne({ username: decodedUser });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User does not exist in database",
        },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === verifyCode;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeNotExpired && isCodeValid) {
      user.isVerified = true;
      await user.save();
      console.log("Validation succeeded:", result.data);
      return NextResponse.json(
        {
          success: true,
          message: "Verification successful",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: isCodeNotExpired
            ? "Invalid verification code"
            : "Verification code has expired",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in verification process:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
