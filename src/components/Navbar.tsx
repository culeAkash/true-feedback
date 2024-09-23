"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Session, User } from "next-auth";

import React from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();

  console.log("In navbar", session);

  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a className="text-xl font-bold mb-4 md:mb-0" href="">
          True Feedback
        </a>
        {session ? (
          <div className="flex flex-row justify-between">
            <span className="mr-4">
              Welcome, {user?.username || user?.email}
            </span>
            <Button className="w-full md:m-auto" onClick={() => signOut()}>
              Logout
            </Button>
          </div>
        ) : (
          <Link href={"/sign-in"}>
            <Button className="w-full md:m-auto">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
