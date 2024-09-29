"use server";

import axios from "axios";

export const handleSubmitNewMessage = async (
  newMessage: string,
  username: string
) => {
  try {
    console.log(newMessage);

    const response = await axios.post(
      `${process.env.HOST_NAME}/api/send-message`,
      {
        data: {
          username,
          content: newMessage,
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    return axiosError.response?.data;
  }
};
