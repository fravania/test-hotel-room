"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Check,
  LogOut,
  User,
  Home,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { DetailedReservation } from "@/lib/types";
import { reservationApi } from "@/lib/api";
import { formatDateString, getStatusLabel } from "@/lib/utils";
import { getStatusColor } from "@/lib/ui-helpers";
import { DeleteReservationDialog } from "@/components/reservations";

// Define proper type for params
interface PageProps {
  params: {
    id: string;
  };
}

// This component handles showing reservation details and actions
export default function ReservationDetail({ params }: PageProps) {
  const router = useRouter();
  // Access the ID directly for now, but save in a const to prepare for future Next.js changes
  const reservationId = params.id;
  
  const [reservation, setReservation] = useState<DetailedReservation | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Fetch reservation details
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        setLoading(true);
        const data = await reservationApi.getReservationById(Number(reservationId));
        setReservation(data);
      } catch (error) {
        console.error("Error fetching reservation:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId]);

  // Handle check-in
  const handleCheckIn = async () => {
    if (!reservation) return;

    try {
      setActionLoading(true);

      // Default room is the first room in the reservation
      const roomId = reservation.reservationStays[0]?.room?.RoomNumber
        ? parseInt(reservation.reservationStays[0].room.RoomNumber)
        : 0;

      // Use the guest from the reservation
      const checkInData = {
        roomId,
        guestDetails: {
          useReservedGuest: true,
          guests: [
            {
              firstName: reservation.profile.nameInfos[0]?.FirstName || "",
              lastName: reservation.profile.nameInfos[0]?.LastName || "",
              isPrimary: true,
            },
          ],
        },
        paymentMethod: "card",
      };

      await reservationApi.checkInGuest(Number(reservationId), checkInData);
      toast.success("Guest checked in successfully");

      // Refresh data
      const data = await reservationApi.getReservationById(Number(reservationId));
      setReservation(data);
    } catch (error) {
      console.error("Error checking in guest:", error);
      toast.error("Failed to check in guest");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle check-out
  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      await reservationApi.checkOutGuest(Number(reservationId));
      toast.success("Guest checked out successfully");

      // Refresh data
      const data = await reservationApi.getReservationById(Number(reservationId));
      setReservation(data);
    } catch (error) {
      console.error("Error checking out guest:", error);
      toast.error("Failed to check out guest");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        Loading reservation details...
      </div>
    );
  }

  if (!reservation) {
    return notFound();
  }

  const statusLabel = getStatusLabel(reservation.StatusCode);
  const canCheckIn = statusLabel === "confirmed";
  const canCheckOut = statusLabel === "checked in";
  const canCancel =
    statusLabel !== "cancelled" && statusLabel !== "checked out";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reservations
        </Button>
        <div className="flex items-center gap-2">
          {canCheckIn && (
            <Button
              onClick={handleCheckIn}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="mr-2 h-4 w-4" />
              Check In
            </Button>
          )}

          {canCheckOut && (
            <Button
              onClick={handleCheckOut}
              disabled={actionLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Check Out
            </Button>
          )}

          {canCancel && (
            <DeleteReservationDialog
              reservationId={reservation.ReservationID}
              confirmationNumber={reservation.ConfirmationNumber}
            />
          )}

          <Link href={`/reservations/${reservationId}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Reservation Details</CardTitle>
              <Badge className={`${getStatusColor(statusLabel)} capitalize`}>
                {statusLabel}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">Confirmation Number</p>
                <p className="text-sm">{reservation.ConfirmationNumber}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">Property</p>
                <p className="text-sm">{reservation.property.PropertyName}</p>
              </div>
            </div>

            {reservation.creator && (
              <div className="flex items-start gap-4">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium">Created By</p>
                  <p className="text-sm">{`${reservation.creator.FirstName} ${reservation.creator.LastName}`}</p>
                </div>
              </div>
            )}

            {reservation.CancellationReason && (
              <div className="mt-4 p-3 bg-red-50 rounded-md">
                <p className="font-medium text-red-700">Cancellation Reason</p>
                <p className="text-sm text-red-600">
                  {reservation.CancellationReason}
                </p>
                {reservation.CancellationDate && (
                  <p className="text-xs text-red-500 mt-1">
                    Cancelled on{" "}
                    {formatDateString(reservation.CancellationDate)}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guest Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reservation.profile.nameInfos.map((nameInfo, index) => (
              <div key={index} className="flex items-start gap-4">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium">
                    {`${nameInfo.FirstName} ${nameInfo.LastName}`}
                    {index === 0 && (
                      <span className="text-xs ml-2 text-muted-foreground">
                        (Primary)
                      </span>
                    )}
                  </p>

                  {index === 0 && (
                    <>
                      {reservation.profile.EmailAddress && (
                        <p className="text-sm">
                          Email: {reservation.profile.EmailAddress}
                        </p>
                      )}
                      {reservation.profile.PhoneNumber && (
                        <p className="text-sm">
                          Phone: {reservation.profile.PhoneNumber}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stay Information</CardTitle>
        </CardHeader>
        <CardContent>
          {reservation.reservationStays.map((stay, index) => (
            <div key={index} className="mb-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Arrival Date</p>
                  <p>{formatDateString(stay.ArrivalDate)}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Departure Date</p>
                  <p>{formatDateString(stay.DepartureDate)}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Status</p>
                  <Badge className={`${getStatusColor(statusLabel)} capitalize`}>
                    {statusLabel}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3 mt-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Room Type</p>
                  <p>{stay?.roomType?.Description || "Standard Room"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Room</p>
                  <p>{stay?.room?.RoomNumber || "Not assigned"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Guests</p>
                  <p>{stay.guestNameInfos.length || 2} Adults</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-1 mt-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Rate per Night</p>
                  <p>Rp {stay.RateAmount ? parseFloat(stay.RateAmount).toLocaleString() : "2.500.000"}</p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Total Nights:</p>
                </div>
                <div className="space-y-1 text-right">
                  <p>{(() => {
                    const arrivalDate = new Date(stay.ArrivalDate);
                    const departureDate = new Date(stay.DepartureDate);
                    const diffTime = departureDate.getTime() - arrivalDate.getTime();
                    return diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 1;
                  })()}</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 mt-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Total Amount:</p>
                </div>
                <div className="space-y-1 text-right">
                  <p>Rp {(() => {
                    if (!stay.RateAmount) return "0";
                    const rate = parseFloat(stay.RateAmount);
                    const arrivalDate = new Date(stay.ArrivalDate);
                    const departureDate = new Date(stay.DepartureDate);
                    const diffTime = departureDate.getTime() - arrivalDate.getTime();
                    const nights = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 1;
                    return (rate * nights).toLocaleString();
                  })()}</p>
                </div>
              </div>

              {index < reservation.reservationStays.length - 1 && (
                <Separator className="my-6" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Folio Information</CardTitle>
        </CardHeader>
        <CardContent>
          {reservation.folios && reservation.folios.length > 0 ? (
            reservation.folios.map((folio, index) => (
              <div key={index} className="mb-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Folio:</p>
                    <p>{folio.FolioType}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">Transaction:</p>
                    <p>{folio.Source}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">Date:</p>
                    <p>{formatDateString(folio.CreatedAt)}</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mt-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Total Amount:</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p>{folio.Amount && parseFloat(folio.Amount) < 0 ? "" : "+"}
                      Rp {folio.Amount ? parseFloat(folio.Amount).toLocaleString() : "0"}</p>
                  </div>
                </div>

                {index < reservation.folios.length - 1 && (
                  <Separator className="my-6" />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No folio information available
            </div>
          )}

          {reservation.folios && reservation.folios.length > 0 && (
            <>
              <Separator className="my-6" />

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Balance:</p>
                </div>
                <div className="space-y-1 text-right">
                  <p>Rp {reservation.folios.reduce((total, folio) => {
                    return total + (folio.Amount ? parseFloat(folio.Amount) : 0);
                  }, 0).toLocaleString()}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
