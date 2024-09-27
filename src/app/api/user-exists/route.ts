import { NextRequest, NextResponse } from "next/server";
import UserModel, { User } from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";
import { notFound } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  console.log(searchParams);

  const username = searchParams.get("username");

  console.log(username);
  dbConnect();
  //check from db if user with this username exists
  try {
    const user = await UserModel.findOne({ username });
    console.log(user);
    if (!user || !user.isVerified) {
      return Response.json(
        {
          success: false,
          message: `User not found with username = ${username}`,
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User exists",
      },
      {
        status: 200,
      }
    );
  } catch (error) {}

  return Response.json({
    success: true,
    message: "User exists",
  });
}
