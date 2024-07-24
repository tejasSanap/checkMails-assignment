"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
function page() {
  const { data: session } = useSession();
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google");
    } finally {
      setLoading(false);
    }
  };

  const saveKey = () => {
    if (apiKey) {
      console.log("elasd");
      localStorage.setItem("openApiKey", apiKey);
      router.push("/emails");
    }
  };
  useEffect(() => {
    const storedApiKey = localStorage.getItem("openApiKey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  return (
    <>
      <div className="flex flex-col h-screen justify-center items-center gap-10">
        {!session ? (
          <Button onClick={handleSignIn} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue with Google
          </Button>
        ) : (
          <div className="flex flex-col gap-2">
            welcome {session.user.name}
            <Button onClick={() => signOut()}> Sign Out</Button>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Label>
            Log in with Google and enter your OpenAI API key to proceed.
          </Label>
          <Input
            placeholder="Enter your OpenAI API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          ></Input>

          <Button onClick={saveKey} disabled={!session}>
            Proceed To Mails
          </Button>
        </div>
      </div>
    </>
  );
}

export default page;
