"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { reservationApi } from "@/lib/api";

type DeleteReservationDialogProps = {
  reservationId: number;
  confirmationNumber: string;
};

export const DeleteReservationDialog = ({
  reservationId,
  confirmationNumber,
}: DeleteReservationDialogProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reason, setReason] = useState("");

  const handleDelete = async () => {
    if (!reason) {
      toast.error("Please provide a cancellation reason");
      return;
    }

    try {
      setIsDeleting(true);
      await reservationApi.cancelReservation(reservationId, reason);
      toast.success("Reservation cancelled successfully");
      setOpen(false);
      
      // Navigate back to reservations list or refresh the current page
      router.push("/reservations");
      router.refresh();
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      toast.error("Failed to cancel reservation");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1"
      >
        <Trash2 className="h-4 w-4" />
        <span>Cancel</span>
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel reservation #{confirmationNumber}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Label htmlFor="reason" className="mb-2 block">
              Cancellation Reason <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reason"
              placeholder="Enter reason for cancellation"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isDeleting}
              required
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting || !reason}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Cancelling..." : "Confirm Cancellation"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}; 