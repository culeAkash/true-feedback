"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/models/User";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ApiReponse } from "@/types/ApiResponse";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const { toast } = useToast();

  const formattedDate = new Date(message.createdAt).toLocaleDateString("en-CA");

  const handleDeleteConfirm = async () => {
    console.log(message._id);

    // const response = await axios.delete<ApiReponse>(
    //   `/api/delete-message/${message._id}`
    // );

    // if (response.data.success) {
    //   onMessageDelete(message._id);
    //   toast({
    //     title: "success",
    //     description: response.data.message,
    //   });
    // }
  };

  return (
    <Card className="flex flex-row place-content-between">
      <CardDescription className="p-3">
        <p className="text-xl font-medium text-black">{message.content}</p>
        <p>{formattedDate}</p>
      </CardDescription>
      <CardFooter className="p-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <X className="w-5 h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                message
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default MessageCard;
