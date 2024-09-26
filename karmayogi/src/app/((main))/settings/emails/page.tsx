"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imapURI, setImapURI] = useState("");
  const [imapPort, setImapPort] = useState("");
  const [smtpURI, setSmtpURI] = useState("");
  const [smtpHost, setSmtpHost] = useState("");

  const handleSave = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CHANNELS_BE_HOST}/setup/account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          imapURI,
          imapPort,
          smtpURI,
          smtpHost,
        }),
      });

      if (response.ok) {
        alert("Email account setup successfully");
      } else {
        alert("Failed to setup email account");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div id="llms">
      <Card x-chunk="dashboard-04-chunk-4">
        <CardHeader>
          <CardTitle>Email Account Setup</CardTitle>
          <CardDescription>
            Configure your email account settings below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                placeholder="IMAP URI"
                value={imapURI}
                onChange={(e) => setImapURI(e.target.value)}
                required
              />
              <Input
                placeholder="IMAP Port"
                value={imapPort}
                onChange={(e) => setImapPort(e.target.value)}
                required
              />
              <Input
                placeholder="SMTP URI"
                value={smtpURI}
                onChange={(e) => setSmtpURI(e.target.value)}
                required
              />
              <Input
                placeholder="SMTP Host"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={handleSave}>Save</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
