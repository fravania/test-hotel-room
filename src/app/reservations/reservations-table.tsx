"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reservation, ReservationFilters } from "@/lib/types";
import { reservationApi } from "@/lib/api";
import { formatDateString, getGuestName, getStatusLabel } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStatusColor } from "@/lib/ui-helpers";
import { DeleteReservationDialog } from "@/components/reservations";

// Helper function to check if a date is today
const isToday = (dateString?: string): boolean => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export default function ReservationsTable() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<ReservationFilters>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  // Fetch reservations from API
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const data = await reservationApi.getReservations(filters);
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [filters]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reservations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reservations.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle filter changes
  const handleFilterChange = (key: keyof ReservationFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" || value === "ALL" ? undefined : value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium block mb-1">
                Guest Name
              </label>
              <Input
                placeholder="Search by last name"
                value={filters.lastName || ""}
                onChange={(e) => handleFilterChange("lastName", e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium block mb-1">
                Confirmation #
              </label>
              <Input
                placeholder="Enter confirmation number"
                value={filters.confirmationNumber || ""}
                onChange={(e) =>
                  handleFilterChange("confirmationNumber", e.target.value)
                }
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium block mb-1">
                Arrival Date
              </label>
              <Input
                type="date"
                value={filters.arrivalDate || ""}
                onChange={(e) =>
                  handleFilterChange("arrivalDate", e.target.value)
                }
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium block mb-1">Status</label>
              <Select
                value={filters.status || "ALL"}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="CONF">Confirmed</SelectItem>
                  <SelectItem value="CKIN">Checked In</SelectItem>
                  <SelectItem value="CKOT">Checked Out</SelectItem>
                  <SelectItem value="CANC">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Confirmation Number</TableHead>
              <TableHead>Guest Name</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Departure</TableHead>
              <TableHead>Room Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  Loading reservations...
                </TableCell>
              </TableRow>
            ) : currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  No reservations found
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((reservation) => {
                const status = getStatusLabel(reservation.StatusCode);
                const roomType =
                  reservation.reservationStay?.roomType?.Description || "N/A";
                const channel = reservation.BookingChannelCode || "Direct";
                const arrivalDate = reservation.reservationStay?.ArrivalDate;
                const isArrivalToday = isToday(arrivalDate);

                return (
                  <TableRow 
                    key={reservation.ReservationID}
                    className={isArrivalToday ? "bg-sky-100 dark:bg-sky-900/20" : ""}
                  >
                    <TableCell className="font-medium">
                      {reservation.ConfirmationNumber}
                    </TableCell>
                    <TableCell>{getGuestName(reservation)}</TableCell>
                    <TableCell>
                      {reservation.reservationStay?.ArrivalDate
                        ? formatDateString(
                            reservation.reservationStay.ArrivalDate
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {reservation.reservationStay?.DepartureDate
                        ? formatDateString(
                            reservation.reservationStay.DepartureDate
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell>{roomType}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(status)}>{status}</Badge>
                    </TableCell>
                    <TableCell>{channel}</TableCell>
                    <TableCell className="flex justify-between items-center space-x-1">
                      <Link href={`/reservations/${reservation.ReservationID}`}>
                        <Button size="icon" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link
                        href={`/reservations/${reservation.ReservationID}/edit`}
                      >
                        <Button size="icon" variant="ghost">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteReservationDialog
                        reservationId={reservation.ReservationID}
                        confirmationNumber={reservation.ConfirmationNumber}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, reservations.length)} of{" "}
            {reservations.length}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <Button
                  key={number}
                  variant={currentPage === number ? "default" : "outline"}
                  size="sm"
                  onClick={() => paginate(number)}
                >
                  {number}
                </Button>
              )
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
