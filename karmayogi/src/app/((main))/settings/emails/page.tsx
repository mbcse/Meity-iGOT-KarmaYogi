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
import { useToast } from "@/components/hooks/use-toast";

export interface IAccount {
  _id: string;
  email: string;
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchConnectedAccounts();
  }, []);

  const fetchConnectedAccounts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CHANNELS_BE_HOST}/setup/accounts`);

      if (response.ok) {
        const data = await response.json();
        setConnectedAccounts(data);
      } else {
        setError("Failed to fetch connected accounts");
        toast({
          title: "Error",
          description: "Failed to fetch connected accounts",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while fetching accounts. Please try again.");
      toast({
        title: "Error",
        description: "An error occurred while fetching accounts",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
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

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Email account setup successfully",
        });
        fetchConnectedAccounts(); // Refresh the list of connected accounts
        // Reset form fields
        setEmail("");
        setPassword("");
        setImapURI("");
        setImapPort("");
        setSmtpURI("");
        setSmtpPort("");
      } else {
        setError(data.error || "Failed to setup email account");
        toast({
          title: "Error",
          description: data.error || "Failed to setup email account",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred. Please try again.");
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="emails">
      <Card>
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
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
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
