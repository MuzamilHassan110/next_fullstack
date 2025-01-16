import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/dbConnection";
import userModel from "@/models/User.models";
import { z } from "zod";
import { usernameValidation } from "@/Schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});


// Algo => step

// get user from param
// validateUser from zod
// check params validation 
// user already exist
// user uique

export async function GET(NextRequest: Request) {
  await dbConnection();
  try {
    const { searchParams } = new URL(NextRequest.url);
    // const user = searchParams.get("username");
    const queryParams = {
      username: searchParams.get("username"),
    };
    const result = usernameQuerySchema.safeParse(queryParams);
    console.log("result", result);
    if (!result.success) {
      const username = result.error.format().username?._errors || [];
      
      return NextResponse.json(
        {
          success: false,
          message: "Invalid query parameter",
        },
        {
          status: 400,
        },
       
      );
    }

    const { username } = result.data;
    console.log(username);
    const existingVerifiedUser = await userModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is Already exist",
        },
        {
          status: 400,
        }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Username Unique",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in Name checking:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in Checking username",
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      }
    );
  }
}
