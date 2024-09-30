"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/models/User";
import { ApiReponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { acceptMessageSchema } from "../../../schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCardSkeleton } from "@/components/Skeletons";
const Dashboard = () => {
  const session = useSession();

  console.log(session.data?.user._id);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  // fetch messages from the backend on either first page render or on demand when the refresh button is clicked
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiReponse>("/api/get-messages");
        console.log(response.data.messages);
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing refreshed messages",
            variant: "destructive",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiReponse>;

        toast({
          title: "Error",
          description:
            axiosError.response?.data?.message ?? "Error fetching messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setIsSwitchLoading, setMessages, toast]
  );

  // handler for deleting messages as called by the message card component
  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) => {
      return prevMessages.filter((message) => {
        console.log(message._id, messageId);
        return message._id !== messageId;
      });
    });
  };

  const { watch, setValue, register } = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiReponse>(
        `/api/accept-messages?userId=${session.data?.user._id}`
      );
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiReponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data?.message ?? "Error accepting messages",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [session.data?.user._id, setValue, toast]);

  useEffect(() => {
    if (!session || !session.data?.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [fetchMessages, session, fetchAcceptMessage]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiReponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });

      setValue("acceptMessages", !acceptMessages);

      const description = acceptMessages
        ? "Accepting messages now"
        : "Not accepting messages now";
      toast({
        title: "Success",
        description,
        variant: "destructive",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiReponse>;

      toast({
        title: "Error",
        description:
          axiosError.response?.data?.message ?? "Error fetching messages",
        variant: "destructive",
      });
    }
  };

  const username = session.data?.user.username;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Url copied to clipboard",
      description: "profileUrl has been copied to clipboard",
    });
  };

  console.log(messages);

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
            value={profileUrl}
          />
          <Button onClick={copyToClipBoard}>Copy</Button>
        </div>
      </div>
      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
      </div>
      <Separator />
      <Button
        className="mt-4"
        variant={"outline"}
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 &&
          messages.map((message) => (
            <Suspense
              key={message._id as string}
              fallback={<MessageCardSkeleton />}
            >
              <MessageCard
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            </Suspense>
          ))}
        {messages.length == 0 && (
          <p className="text-2xl text-red-600">No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
