"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/models/User";
import { ApiReponse } from "@/types/ApiResponse";
import axios from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";

const Dashboard = () => {
  const session = useSession();

  console.log(session.data?.user._id);

  const [messages, setMessages] = useState<Message[]>([]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    try {
      const response = await axios.get<ApiReponse>("/api/get-messages");
      console.log(response.data.messages);
      setMessages(response.data.messages || []);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!session || !session.data?.user) return;
    fetchMessages();
  }, [fetchMessages, session]);

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) => {
      return prevMessages.filter((message) => message._id !== messageId);
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-semibold mb-2">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy your unique link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button>Copy</Button>
        </div>
      </div>
      <div className="mb-4">
        <Switch />
      </div>
      <Separator />
      <Button
        className="mt-4"
        variant={"outline"}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {/* {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )} */}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-2xl text-red-600">No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
