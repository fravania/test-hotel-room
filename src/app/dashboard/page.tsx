"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, Users, ArrowUpRight, BarChart3, BedDouble } from "lucide-react";
import { reservationApi } from "@/lib/api";
import { Reservation } from "@/lib/types";

export default function DashboardPage() {
  const [todayArrivals, setTodayArrivals] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    totalActiveReservations: 0,
    reservationsToday: 0,
    guestsCheckedIn: 0,
    guestsCheckedOut: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        // Fetch today's arrivals
        const arrivals = await reservationApi.getReservations({ arrivalDate: today });
        setTodayArrivals(arrivals);
        
        // Set demo stats (in a real app, these would be from API endpoints)
        setStats({
          totalActiveReservations: 42,
          reservationsToday: arrivals.length,
          guestsCheckedIn: 18,
          guestsCheckedOut: 12
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your hotel reservation dashboard
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Active Reservations"
          value={stats.totalActiveReservations.toString()}
          description="Total current bookings"
          icon={<BedDouble className="h-4 w-4" />}
        />
        <StatsCard 
          title="Today&apos;s Arrivals"
          value={stats.reservationsToday.toString()}
          description="Check-ins expected today"
          icon={<CalendarClock className="h-4 w-4" />}
        />
        <StatsCard 
          title="Checked In"
          value={stats.guestsCheckedIn.toString()}
          description="Guests currently staying"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard 
          title="Checked Out"
          value={stats.guestsCheckedOut.toString()}
          description="Completed today"
          icon={<BarChart3 className="h-4 w-4" />}
        />
      </div>
      
      {/* Today's Arrivals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Today&apos;s Arrivals</CardTitle>
            <CardDescription>
              Guests expected to check in today
            </CardDescription>
          </div>
          <Link href="/reservations">
            <Button variant="outline" size="sm">
              View All
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <p>Loading arrivals...</p>
            </div>
          ) : todayArrivals.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center border rounded-md">
              <div className="text-center">
                <CalendarClock className="h-10 w-10 text-muted-foreground mb-2 mx-auto" />
                <p>No arrivals scheduled for today</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {todayArrivals.slice(0, 5).map((reservation) => {
                const guestName = reservation.profile?.nameInfo
                  ? `${reservation.profile.nameInfo.FirstName} ${reservation.profile.nameInfo.LastName}`
                  : "N/A";
                  
                const roomInfo = reservation.reservationStay?.room
                  ? reservation.reservationStay.room.RoomNumber
                  : reservation.reservationStay?.roomType
                    ? reservation.reservationStay.roomType.Description
                    : "N/A";
                
                return (
                  <div key={reservation.ReservationID} className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <p className="font-medium">{guestName}</p>
                      <div className="text-sm text-muted-foreground">
                        <p>Room: {roomInfo}</p>
                        <p>Confirmation: {reservation.ConfirmationNumber}</p>
                      </div>
                    </div>
                    <Link href={`/reservations/${reservation.ReservationID}`}>
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </Link>
                  </div>
                );
              })}
              
              {todayArrivals.length > 5 && (
                <div className="text-center pt-2">
                  <Link href="/reservations">
                    <Button variant="link" size="sm">
                      View {todayArrivals.length - 5} more arrivals
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Stats Card Component
const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon 
}: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}; 