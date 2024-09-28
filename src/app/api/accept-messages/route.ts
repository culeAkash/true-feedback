import { getServerSession } from "next-auth";
import UserModel from "@/models/User";
import { AuthOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "next-auth";
import { NextRequest } from "next/server";

// currently logged in user will toggle the option of accepting messages
export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(AuthOptions);

  console.log(session);

  const user: User = session?.user as User;

  if (!session || !session?.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user?._id;

  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages: acceptMessages,
      },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept messages",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User is now accepting messages",
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to update user status to accept messages");

    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: NextRequest) {
  await dbConnect();

  console.log(request.nextUrl);

  const username = request.nextUrl.searchParams.get("username");

  try {
    const foundUser = await UserModel.findOne({
      username,
    });

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User found",
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to get the accepting message status of the user");
    return Response.json(
      {
        success: false,
        message: "Failed to get the accepting message status of the user",
      },
      {
        status: 500,
      }
    );
  }
}
