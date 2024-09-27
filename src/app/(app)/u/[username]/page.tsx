import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { notFound } from "next/navigation";
import React from "react";

const MessagePage = async ({
  params,
}: {
  params: {
    username: string;
  };
}) => {
  const username = params.username;
  console.log(username);
  let message;

  try {
    const response = await axios.get(
      `${process.env.HOST_NAME}/api/user-exists?username=${username}`
    );

    message = response.data.message;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (!axiosError.response?.data.success) {
      notFound();
    }
  }

  return (
    <main className="h-full text-center p-8">
      <h1 className="text-3xl font-bold text-gray-900">Public Profile Link</h1>
      <section className="flex flex-col gap-2 items-center">
        <Input
          type="text"
          placeholder="Write your secret message here...."
          className="mt-3"
        ></Input>
        <Button className="w-[10%]">Send it</Button>
      </section>
      <section className="">
        <Button>Suggest Messages</Button>
      </section>
    </main>
  );
};

export default MessagePage;
