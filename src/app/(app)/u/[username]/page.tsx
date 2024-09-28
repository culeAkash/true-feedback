import AutoMessages from "@/components/AutoMessages";
import NewMessageForm from "@/components/NewMessageForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { notFound } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const MessagePage = async ({
  params,
}: {
  params: {
    username: string;
  };
}) => {
  const username = params.username;
  console.log(username);
  try {
    const response = await axios.get(
      `${process.env.HOST_NAME}/api/user-exists?username=${username}`
    );
  } catch (error) {
    const axiosError = error as AxiosError;
    if (!axiosError.response?.data.success) {
      notFound();
    }
  }

  const handleSubmitNewMessage = async (newMessage: string) => {
    "use server";

    try {
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(axiosError.message);
    }
  };

  return (
    <main className="h-full text-center p-8">
      <h1 className="text-3xl font-bold text-gray-900">Public Profile Link</h1>
      <section className="flex flex-col gap-2 items-center">
        <NewMessageForm handleSubmitNewMessage={handleSubmitNewMessage} />
      </section>
      <AutoMessages />
    </main>
  );
};

export default MessagePage;
