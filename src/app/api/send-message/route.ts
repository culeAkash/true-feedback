import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { messageSchema } from "@/schemas/messageSchema";
import { Message } from "@/models/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  //validate with zod
  const result = messageSchema.safeParse({ content });

  console.log(result);

  if (!result.success) {
    return Response.json(
      {
        success: false,
        message: "Invalid message",
        errors: result.error.format().content?._errors || [],
      },
      {
        status: 422,
      }
    );
  }

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // if user is not accepting messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        {
          status: 403,
        }
      );
    }

    const newMessage = {
      content,
      createdAt: new Date(),
    };

    user.messages.push(newMessage as Message);

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error sending message", error);

    return Response.json(
      {
        success: false,
        message: `Error sending message : ${error}`,
      },
      {
        status: 500,
      }
    );
  }
}
