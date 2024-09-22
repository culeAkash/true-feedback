import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    // user with username already present and verified so nothing to do, can move to login
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "User already exists and is verified",
        },
        { status: 400 }
      );
    }

    // user with username not present or not verified

    const existingUserByEmail = await UserModel.findOne({ email });
    console.log("line 30 ", existingUserByEmail);

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // user with email already present
    if (existingUserByEmail) {
      // user with email already present and verified
      // if (existingUserByEmail.isVerified) {
      //   return Response.json(
      //     {
      //       success: false,
      //       message: "Email already used",
      //     },
      //     {
      //       status: 400,
      //     }
      //   );
      // } else {
      // user with email already present and not verified
      // change the password
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.verifyCode = verifyCode;
      existingUserByEmail.verifyCodeExpiry = new Date(
        Date.now() + 60 * 60 * 1000
      );
      existingUserByEmail.username = username;
      console.log("Line 55 ", existingUserByEmail);

      await existingUserByEmail.save();
      // }
    } else {
      //brand new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
    }

    // send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    console.log(emailResponse);

    // send email response if failed to send email
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }

    // send success response
    return Response.json(
      {
        success: true,
        message: "User Registered successfully or Please verify your email",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
