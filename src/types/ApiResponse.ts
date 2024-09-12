import { Message } from "@/models/User";

export interface ApiReponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Message[];
}
