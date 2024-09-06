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
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface IAccount {
  _id: string;
  email: string;
  password: string;
  smtpPort: string | number;
  smtpURI: string;
  imapPort: string | number;
  imapURI: string;
  lastSyncedAt?: Date;
  lastSeenUID?: number;
}

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imapURI, setImapURI] = useState("");
  const [imapPort, setImapPort] = useState("");
  const [smtpURI, setSmtpURI] = useState("");
  const [smtpPort, setSmtpPort] = useState("");
  const [connectedAccounts, setConnectedAccounts] = useState<IAccount[]>([]);

  useEffect(() => {
    const fetchConnectedAccounts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_CHANNELS_BE_HOST}/setup/accounts`);

        if (response.ok) {
          const data = await response.json();
          setConnectedAccounts(data);
        } else {
          alert("Failed to fetch connected accounts");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      }
    };

    fetchConnectedAccounts();
  }, []);

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
          smtpPort,
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
    <div id="emails">
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
                placeholder="SMTP Port"
                value={smtpPort}
                onChange={(e) => setSmtpPort(e.target.value)}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={handleSave}>Save</Button>
        </CardFooter>
      </Card>

      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-4">Connected Accounts</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>IMAP URI</TableHead>
              <TableHead>IMAP Port</TableHead>
              <TableHead>SMTP URI</TableHead>
              <TableHead>SMTP Port</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {connectedAccounts.map((account: IAccount) => (
              <TableRow key={account._id}>
                <TableCell>{account.email}</TableCell>
                <TableCell>{account.imapURI}</TableCell>
                <TableCell>{account.imapPort}</TableCell>
                <TableCell>{account.smtpURI}</TableCell>
                <TableCell>{account.smtpPort}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
