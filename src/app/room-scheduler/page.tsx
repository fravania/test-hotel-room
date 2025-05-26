"use client";

import React from "react";
import dynamic from "next/dynamic";

// Use dynamic import to avoid SSR issues with react-calendar-timeline
const RoomScheduler = dynamic(
  () =>
    import("@/components/room-scheduler/RoomScheduler").then(
      (mod) => mod.default
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
  }
);

export default function RoomSchedulerPage() {
  return (
    <div className="container mx-auto p-4 h-screen">
      <h1 className="text-2xl font-bold mb-4">Room Scheduler</h1>
      <RoomScheduler />
    </div>
  );
}
