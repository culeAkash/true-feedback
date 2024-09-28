"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import messages from "@/messages.json";
import { date } from "zod";

const AutoMessages = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [reloadMessages, setReloadMessages] = useState(false);

  const getAutoMessages = async () => {
    const response = await axios.post("/api/suggest-messages", {
      data: {
        messages: messages,
      },
    });
    const message: string = response.data.message as string;
    setMessages(message.substring(1, message.length - 1).split(" || "));
  };

  useEffect(() => {
    getAutoMessages();
  }, [reloadMessages]);

  return (
    <section className="flex flex-col mt-9 h-[60%] gap-4">
      <Button className="w-[20%]" onClick={getAutoMessages}>
        Suggest Messages
      </Button>
      <div className="border-2 border-gray-900 rounded-sm h-fit">
        {messages.map((message, index) => (
          <div
            key={index}
            className="h-12 border-2 border-gray-950 rounded-sm m-1 flex flex-col place-content-center hover:bg-slate-400 hover:text-gray-800 hover:cursor-pointer"
          >
            <p className="text-sm font-bold">{message}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AutoMessages;
