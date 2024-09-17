import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmail";

import { ApiReponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiReponse> {
  const { error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Verification Code | True Feedback",
    react: VerificationEmail({ username, otp: verifyCode }),
  });

  if (error) {
    console.error(
      "Error sending verification email",
      error.name,
      error.message
    );
    return {
      success: false,
      message: `${error.name} : ${error.message}`,
    };
  }

  return {
    success: true,
    message: "Verification email sent",
  };
}
