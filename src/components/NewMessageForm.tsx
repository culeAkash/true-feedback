"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { messageSchema } from "@/schemas/messageSchema";

interface NewMessageFormProps {
  handleSubmitNewMessage: (newMessage: string) => Promise<void>;
}

const NewMessageForm = ({ handleSubmitNewMessage }: NewMessageFormProps) => {
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = form;

  const newMessage = watch("content");

  console.log(errors);

  const sendMessage = async () => {
    const response = await handleSubmitNewMessage(newMessage);
    console.log(response);
  };

  return (
    <>
      <Input
        {...register("content")}
        type="text"
        placeholder="Write your secret message here...."
        className="mt-3"
        name="newmessage"
        onChange={(e) => setValue("content", e.target.value)}
      ></Input>
      {/* {errors && <p></p>} */}
      <Button className="w-[10%]" onClick={sendMessage}>
        Send it
      </Button>
    </>
  );
};

export default NewMessageForm;
