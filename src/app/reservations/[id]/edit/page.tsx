"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { DetailedReservation } from "@/lib/types";
import { reservationApi } from "@/lib/api";
import { ReservationForm } from "@/components/reservations";
import React from "react";

export default function EditReservation({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  // Extract ID at the beginning to avoid direct access
  const { id } = React.use(params);
  const [reservation, setReservation] = useState<DetailedReservation | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        setLoading(true);
        const data = await reservationApi.getReservationById(Number(id));
        setReservation(data);
      } catch (error) {
        console.error("Error fetching reservation:", error);
        router.push("/reservations");
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        Loading reservation details...
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="flex justify-center items-center h-96">
        Reservation not found. Redirecting...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reservation Details
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Reservation</CardTitle>
        </CardHeader>
      </Card>

      <ReservationForm isEditing initialData={reservation} />
    </div>
  );
}
