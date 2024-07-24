"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { DrawerDemo } from "@/components/drawer";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
function page() {
  const { data: session } = useSession();
  const [mails, setMails] = useState([]);
  const [selectedMail, setSelectedMail] = useState({});
  const [apiKey, setApiKey] = useState("");
  const [mailsToFetch, setMailsToFetch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const handleSelectChange = (value) => {
    setMailsToFetch(value);
  };

  const fetchAndClassifyEmails = async () => {
    if (mailsToFetch == null) {
      console.log("herhe");
      toast({
        variant: "destructive",
        title: "Select Mails From Dropdown First",
      });
      return;
    }

    setLoading(true);

    try {
      // Fetch emails
      console.log("session", session);
      const fetchResponse = await axios.get("/api/emails", {
        headers: { Authorization: `Bearer ${session.accessToken}` },
        params: { maxResults: mailsToFetch },
      });

      const fetchedEmails = fetchResponse.data.emails;
      console.log("Fetched emails:", fetchedEmails);

      let updatedMails = fetchedEmails;

      try {
        // Classify emails
        const classifyResponse = await axios.post("/api/classify", {
          emails: fetchedEmails,
          apiKey,
        });

        console.log(
          "Classify response:",
          classifyResponse.data.classifications
        );
        updatedMails = fetchedEmails.map((mail) => {
          const classifiedEmail = classifyResponse.data.classifications.find(
            (item) => item.id === mail.id
          );

          const classification = classifiedEmail
            ? classifiedEmail.classification
            : "General";

          const validClassification =
            normalizeAndValidateCategory(classification);

          return {
            ...mail,
            classification: validClassification,
          };
        });
      } catch (classificationError) {
        const errorMessage =
          classificationError.response?.data?.error?.code ||
          "An error occurred while fetching emails.";
        toast({
          variant: "destructive",
          title: "Error classifying emails",
          description: errorMessage,
        });

        updatedMails = fetchedEmails.map((mail) => ({
          ...mail,
          classification: "General",
        }));
      }

      setMails(updatedMails);
      localStorage.setItem("mails", JSON.stringify(updatedMails));
    } catch (error) {
      console.error("Error fetching emails:", error);

      toast({
        variant: "destructive",
        title: "Error fetching emails",
      });
    } finally {
      setLoading(false);
    }
  };

  const normalizeAndValidateCategory = (category) => {
    // Convert category to lowercase and remove unwanted characters including asterisks
    const normalizedCategory = category
      .toLowerCase()
      .replace(/[*^]/g, "") // Remove asterisks and other unwanted characters
      .replace(/[^a-z0-9\s]/g, ""); // Remove non-alphanumeric characters except spaces

    // Define a mapping of normalized categories to valid categories
    const categoryMapping = {
      important: "Important",
      promotions: "*Promotions",
      social: "Social",
      marketing: "Marketing",
      spam: "Spam",
    };

    // Check if the normalized category matches any predefined category
    return categoryMapping[normalizedCategory] || "General";
  };

  const handleEmailClick = (email) => {
    setSelectedMail(email);
    openDrawer();
  };

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  useEffect(() => {
    const key = localStorage.getItem("openApiKey");
    const storedMails = JSON.parse(localStorage.getItem("mails"));
    if (storedMails) {
      setMails(storedMails);
    }
    setApiKey(key);
  }, [session]);

  const handleLogout = async () => {
    console.log("first");
    localStorage.removeItem("mails");
    localStorage.getItem("openApiKey");
    await signOut({ redirect: false });
    router.push("/");
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="fixed top-0 z-1 bg-white w-3/4 pt-10">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={session?.user?.image} alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <div>{session?.user?.name}</div>
              <div>{session?.user?.email}</div>
            </div>
          </div>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
        <div className="flex w-full justify-between pt-6">
          <div>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue
                  value={mailsToFetch}
                  placeholder="select emails to classify"
                ></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">last 15 emails</SelectItem>
                <SelectItem value="30">last 30 emails</SelectItem>
                <SelectItem value="45">last 45 emails</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={fetchAndClassifyEmails}>fetch and classify</Button>
        </div>
        <Separator className="mt-5" />
      </div>

      <div className="flex flex-col items-center w-3/4 justify-center gap-20 mt-48">
        {loading ? (
          <div className="flex flex-col space-y-3">
            {" "}
            <Skeleton className="h-[125px] w-[450px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-2">
            {mails.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "flex flex-col items-start  gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                  selectedMail.selected === item.id && "bg-muted"
                )}
                onClick={() => handleEmailClick(item)}
              >
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-betwee ">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">
                        {item.mailFrom?.split("<")[0]}
                      </div>
                    </div>
                    <div
                      className={cn(
                        "ml-auto text-xs",
                        selectedMail.selected === item.id
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      <Badge>{item.classification}</Badge>
                    </div>
                  </div>
                  <div className="text-xs font-medium">{item.subject}</div>
                </div>
                <div className="max-w-full line-clamp-3 text-xs text-muted-foreground">
                  {item.body}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <DrawerDemo
        isOpen={drawerOpen}
        onClose={closeDrawer}
        email={selectedMail}
      />
    </div>
  );
}

export default page;
