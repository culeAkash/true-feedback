import AutoMessages from "@/components/AutoMessages";
import CreateMessage from "@/components/CreateMessage";
import NewMessageForm from "@/components/NewMessageForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { errorToJSON } from "next/dist/server/render";
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

  return (
    <main className="h-full text-center p-8">
      <h1 className="text-3xl font-bold text-gray-900">Public Profile Link</h1>
      <CreateMessage username={username} />
    </main>
  );
};

export default MessagePage;
