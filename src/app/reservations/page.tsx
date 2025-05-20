import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ReservationsTable from "./reservations-table";

export const metadata: Metadata = {
  title: "Reservations | Hotel Admin",
  description: "Manage your hotel reservations",
};

export default function ReservationsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
          <p className="text-muted-foreground">
            Manage all your hotel reservations in one place
          </p>
        </div>
        <Link href="/reservations/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Reservation
          </Button>
        </Link>
      </div>

      <ReservationsTable />
    </div>
  );
}
