import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { UsernameQuerySchema } from "@/schemas/signUpSchema";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, verifyCode } = await request.json();

    const decodedUserName = decodeURIComponent(username);

    //validate with zod
    const result = UsernameQuerySchema.safeParse({ username: decodedUserName });

    console.log(result);

    if (!result.success) {
      const userNameErrors = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          errors: userNameErrors,
        },
        { status: 400 }
      );
    }

    const existingUnverifiedUser = await UserModel.findOne({
      username: decodedUserName,
    });

    if (!existingUnverifiedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 400 }
      );
    }

    const isCodeValid = verifyCode === existingUnverifiedUser.verifyCode;
    const isCodeNotExpired =
      new Date(existingUnverifiedUser.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      existingUnverifiedUser.isVerified = true;
      await existingUnverifiedUser.save();
      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Verification Code is incorrect",
        },
        { status: 400 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification Code has expired, please sign-up again to get a new code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
