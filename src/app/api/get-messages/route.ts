import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(AuthOptions);

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

  const userId = new mongoose.Types.ObjectId(user?._id);

  try {
    const user = await UserModel.aggregate([
      {
        $match: { _id: userId },
      },
      {
        $unwind: {
          path: "$messages",
        },
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: { _id: "$_id", messages: { $push: "$messages" } },
      },
    ]);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Not able to fetch user messages",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Not able to fetch user messages",
      },
      {
        status: 500,
      }
    );
  }
}
