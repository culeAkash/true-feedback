"use client";
import React, { useEffect, useState } from "react";
import { handleSubmitNewMessage } from "@/actions";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { messageSchema } from "@/schemas/messageSchema";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useToast } from "@/hooks/use-toast";

const CreateMessage = ({ username }: { username: string }) => {
  const [autoMessages, setAutoMessages] = useState<string[]>([]);
  const { toast } = useToast();

  const getAutoMessages = async () => {
    const response = await axios.post("/api/suggest-messages", {
      data: {
        messages: autoMessages,
      },
    });
    const message: string = response.data.message as string;
    setAutoMessages(message.substring(1, message.length - 1).split(" || "));
  };

  useEffect(() => {
    getAutoMessages();
  }, []);

  const form = useForm<zod.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const { setValue } = form;

  const handleSendMessage = async (data: z.infer<typeof messageSchema>) => {
    const { success, message } = await handleSubmitNewMessage(
      data.content,
      username
    );

    if (!success) {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: message,
      });
    }

    setValue("content", "");
  };

  return (
    <>
      <section className="flex flex-col gap-2 items-center mt-3">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSendMessage)}
            className="flex flex-col flex-grow w-full gap-3"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter the message you want to send"
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-[20%]">
              Send Message
            </Button>
          </form>
        </Form>
      </section>
      <section className="flex flex-col mt-9 h-[60%] gap-4">
        <Button className="w-[20%]" onClick={getAutoMessages}>
          Suggest Messages
        </Button>
        <div className="border-2 border-gray-900 rounded-sm h-fit">
          {autoMessages.map((message, index) => (
            <div
              onClick={() => setValue("content", message)}
              key={index}
              className="h-12 border-2 border-gray-950 rounded-sm m-1 flex flex-col place-content-center hover:bg-slate-400 hover:text-gray-800 hover:cursor-pointer"
            >
              <p className="text-sm font-bold">{message}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default CreateMessage;
