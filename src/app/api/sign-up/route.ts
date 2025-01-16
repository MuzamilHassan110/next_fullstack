import { NextRequest, NextResponse } from 'next/server';
import userModel from "@/models/User.models";
import dbConnection from "@/lib/dbConnection";
import bcrypt from "bcrypt";
import crypto from "crypto";

import sendVerificationEmail from "@/helper/sendVerificationEmail";

export async function POST(req: NextRequest) {
  // connect db
  await dbConnection();

  try {
    // get data
    const { email, username, password } = await req.json();
   
    // check exsit user

    const exsitingUserIsVerifiedByUsername = await userModel.findOne({
      username,
      isVerified: true,
    });
    if (exsitingUserIsVerifiedByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "User is already exsit",
        },
        {
          status: 400,
        }
      );
    }

    // hashedPassword
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate the verified code

    const generateVerifiedCode = (): any => {
      return parseInt(crypto.randomInt(100000, 1000000).toString());
    };
    const verifiedCode = generateVerifiedCode();

    const expiryDate = new Date();

    expiryDate.setHours(expiryDate.getHours() + 1);

    // find user with email
    const existingUserWithEmail = await userModel.findOne({ email });
    
    if (existingUserWithEmail) {
      if (existingUserWithEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User already exist on this email",
          },
          {
            status: 400,
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        (existingUserWithEmail.password = hashedPassword),
          (existingUserWithEmail.verifyCode = verifiedCode),
          (existingUserWithEmail.verifyCodeExpiry = new Date(
            Date.now() + 3600000
          ));

        await existingUserWithEmail.save();
      }
    } else {
      const newUser = new userModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifiedCode,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    // send email notification
    const emailResponsie = await sendVerificationEmail(
      username,
      email,
      verifiedCode
    );
    if (!emailResponsie.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponsie.message,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Email sent successfully!",
      },
      {
        status: 200,
      }
    );
  }
  catch (error) {
    console.error("Error in registering user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in registering user",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
