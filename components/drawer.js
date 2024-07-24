"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

export function DrawerDemo({ isOpen, onClose, email }) {
  function handleCloseClick(event) {
    event.preventDefault();
    onClose();
  }

  return (
    <Drawer open={isOpen} onClose={onClose} direction="right">
      <DrawerTrigger asChild direction="right"></DrawerTrigger>
      <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-[600px] rounded-t-[10px]">
        {/* <DrawerContent className="flex flex-col rounded-t-[10px] h-full w-[400px] mt-24 fixed bottom-0 right-0"> */}
        <div className="p-4 bg-white flex-1 h-full">
          <DrawerHeader
            direction="right"
            className="flex items-center justify-between"
          >
            <DrawerTitle>Inbox</DrawerTitle>
            <div>
              <Badge>{email.classification}</Badge>
            </div>
          </DrawerHeader>

          <Separator />

          <div className="flex flex-1 flex-col">
            <div className="flex items-start p-4">
              <div className="flex items-center gap-4 text-sm">
                <Avatar>
                  <AvatarFallback>
                    {email?.mailFrom?.split("<")[0].slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="font-semibold">
                    {email?.mailFrom?.split("<")[0]}
                  </div>
                  <div className="line-clamp-1 text-xs">{email.subject}</div>
                  <div className="line-clamp-1 text-xs">
                    <span className="font-medium">Reply-To:</span>{" "}
                    {email?.mailFrom?.split("<")[1]}
                  </div>
                </div>
              </div>
              {email.date && (
                <div className="ml-auto text-xs text-muted-foreground"></div>
              )}
            </div>
            <Separator />

            <div className="flex-1 whitespace-pre-wrap p-4 text-sm text-ellipsis">
              <ScrollArea className="h-[60vh] p-1">
                <div className="whitespace-pre-wrap">{email.body}</div>
              </ScrollArea>
            </div>
            <Separator className="mt-auto" />
            <div className="p-4"></div>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button onClick={handleCloseClick}>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
