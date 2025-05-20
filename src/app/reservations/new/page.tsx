"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReservationForm } from "@/components/reservations";

export default function NewReservation() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reservations
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Reservation</CardTitle>
        </CardHeader>
      </Card>
      
      <ReservationForm />
    </div>
  );
} 