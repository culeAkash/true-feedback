import { createMistral } from "@ai-sdk/mistral";
import { generateText } from "ai";
import messages from "@/messages.json";

const mistral = createMistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

const model = mistral("mistral-large-latest");

export async function POST(request: Request) {
  const { data } = await request.json();
  const messages = data.messages;

  try {
    const prompt = `Create a list of three open-ended and engaging questions formatted in a single string. Each question should be seperated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for diverse audience. Avoid personal or sensitive topics,focusing instead on universal themes that encourage friendly interactions. For example, your output should be structured like this: 'What's your hobby you've recently started? || If you could have dinner with any historial figure, who would it be? || What's a simple thing that makes you happy?. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.Give unique response. Don't give duplicate response from ${messages}`;

    const { text } = await generateText({
      model,
      prompt,
    });

    console.log(text);

    return Response.json(
      {
        success: true,
        message: text,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: error,
      },
      {
        status: 500,
      }
    );
  }
}
