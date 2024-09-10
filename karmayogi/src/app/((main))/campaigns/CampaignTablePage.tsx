"use client";
import React, { useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import { campaignsAtom, isCreateModalOpenAtom } from "@/states/campcard.atom";
import { DataTable } from "./campaign-table";
import { columns } from "./columns";
import CreateCampaignModal from "@/components/atoms/Campaigns/CreateCampaignModal";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function CampaignTablePage() {
  const [campaigns, setCampaigns] = useAtom(campaignsAtom);
  const [isCreateModalOpen, setIsCreateModalOpen] = useAtom(isCreateModalOpenAtom);
  const router = useRouter();

  // Memoize the fetch function to avoid unnecessary re-renders
  const fetchCampaigns = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVICES_BE_HOST}/campaigns`, {
        cache: 'no-store',
        credentials: 'include', // Ensure cookies are sent with the request
      });

      if (response.status === 401) {
        // If not authenticated, redirect to login page
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch campaigns");
      }

      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  }, [setCampaigns, router]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleCreateClick = () => setIsCreateModalOpen(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center p-4 bg-white shadow-sm">
        <h1 className="text-4xl font-bold text-gray-900">Campaigns</h1>
        <Button onClick={handleCreateClick}>Create +</Button>
      </header>

      <main className="container mx-auto py-10">
        {campaigns.length > 0 ? (
          <DataTable columns={columns} data={campaigns} />
        ) : (
          <p className="text-center text-gray-500">No campaigns available.</p>
        )}
      </main>

      <CreateCampaignModal />
    </div>
  );
}
