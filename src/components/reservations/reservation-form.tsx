"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateReservationRequest,
  DetailedReservation,
  PatchReservationRequest,
  RoomType,
  Property,
  UserProfile,
} from "@/lib/types";
import { reservationApi, roomTypeApi, propertyApi, profileApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

// Define schema for form validation
const formSchema = z.object({
  FirstName: z.string().min(1, "First name is required"),
  LastName: z.string().min(1, "Last name is required"),
  EmailAddress: z.string().email("Invalid email").optional().or(z.literal("")),
  PhoneNumber: z.string().optional().or(z.literal("")),
  ArrivalDate: z.string().min(1, "Arrival date is required"),
  DepartureDate: z.string().min(1, "Departure date is required"),
  RoomTypeID: z.coerce.number().min(1, "Room type is required"),
  AdultCount: z.coerce.number().min(1, "Adult count is required").default(1),
  ChildCount: z.coerce.number().default(0),
  RateAmount: z.coerce.number().min(0, "Rate amount is required").default(0),
  BookingChannelCode: z.string().min(1, "Booking channel is required"),
  PropertyID: z.coerce.number().min(1, "Property is required"),
  Notes: z.string().optional().or(z.literal("")),
  IsPresentForCheckIn: z.boolean().default(false),
  SpecificRoomNumber: z.string().optional(),
  IDType: z.string().optional(),
  IDNumber: z.string().optional(),
});

export type ReservationFormValues = z.infer<typeof formSchema>;

type ReservationFormProps = {
  isEditing?: boolean;
  initialData?: DetailedReservation;
};

type GuestSearchProps = {
  onSelect: (guest: UserProfile) => void;
};

const GuestSearch = ({ onSelect }: GuestSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setIsLoading(true);
        const profilesData = await profileApi.getProfiles();
        setProfiles(profilesData);
      } catch (error) {
        console.error("Error loading profiles:", error);
        toast.error("Failed to load guest profiles");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfiles();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProfiles([]);
      return;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = profiles.filter(
      (profile) =>
        profile.FirstName.toLowerCase().includes(lowercaseSearch) ||
        profile.LastName.toLowerCase().includes(lowercaseSearch) ||
        profile.EmailAddress.toLowerCase().includes(lowercaseSearch)
    );
    setFilteredProfiles(filtered);
  }, [searchTerm, profiles]);

  const handleSelect = (profile: UserProfile) => {
    onSelect(profile);
    setSearchTerm("");
    setFilteredProfiles([]);
  };

  const getStatusBadge = (vipStatus: string) => {
    switch (vipStatus) {
      case "GOLD":
        return <Badge className="bg-yellow-500">Gold</Badge>;
      case "PLATINUM":
        return <Badge className="bg-slate-400">Platinum</Badge>;
      default:
        return <Badge className="bg-gray-200 text-gray-700">Regular</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Guest Information</h2>
      <div className="space-y-4">
        <div>
          <h3 className="mb-2">Search for Guest</h3>
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading && <div className="text-center py-2">Loading guests...</div>}

        {filteredProfiles.length > 0 && (
          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-muted text-muted-foreground font-medium text-sm">
              <div className="col-span-3">Name</div>
              <div className="col-span-5">Email</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Action</div>
            </div>
            <div className="divide-y">
              {filteredProfiles.map((profile) => (
                <div
                  key={profile.ProfileID}
                  className="grid grid-cols-12 gap-4 px-4 py-3 items-center"
                >
                  <div className="col-span-3">{`${profile.FirstName} ${profile.LastName}`}</div>
                  <div className="col-span-5 truncate">{profile.EmailAddress}</div>
                  <div className="col-span-2">
                    {getStatusBadge(profile.VIPStatusCode)}
                  </div>
                  <div className="col-span-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelect(profile)}
                    >
                      Select
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ReservationForm = ({
  isEditing = false,
  initialData,
}: ReservationFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGuest, setSelectedGuest] = useState<UserProfile | null>(null);
  const [isPresentForCheckIn, setIsPresentForCheckIn] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [roomTypesData, propertiesData] = await Promise.all([
          roomTypeApi.getRoomTypes(),
          propertyApi.getProperties(),
        ]);

        setRoomTypes(roomTypesData);
        setProperties(propertiesData);
      } catch (error) {
        console.error("Error loading form data:", error);
        toast.error("Failed to load form data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleGuestSelect = (guest: UserProfile) => {
    setSelectedGuest(guest);
    
    form.setValue("FirstName", guest.FirstName);
    form.setValue("LastName", guest.LastName);
    form.setValue("EmailAddress", guest.EmailAddress || "");
    form.setValue("PhoneNumber", guest.PhoneNumber || "");
  };

  // Get default values from initialData if editing
  const getDefaultValues = (): ReservationFormValues => {
    if (isEditing && initialData) {
      const firstStay = initialData.reservationStays[0] || {};
      const nameInfo = initialData.profile.nameInfos[0] || {};

      // Format dates from ISO format to YYYY-MM-DD for date inputs
      const formatDateForInput = (isoDate: string): string => {
        if (!isoDate) return "";
        try {
          // Parse the date and handle it in a timezone-safe way
          const date = new Date(isoDate);
          // Get year, month, and day parts individually and format as YYYY-MM-DD
          const year = date.getFullYear();
          // getMonth() is 0-indexed, so add 1 to get the correct month
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        } catch (error) {
          console.error("Error parsing date:", isoDate, error);
          return "";
        }
      };

      console.log("Initial dates from API:", {
        arrival: firstStay.ArrivalDate,
        departure: firstStay.DepartureDate
      });

      return {
        FirstName: nameInfo.FirstName || "",
        LastName: nameInfo.LastName || "",
        EmailAddress: initialData.profile.EmailAddress || "",
        PhoneNumber: initialData.profile.PhoneNumber || "",
        ArrivalDate: formatDateForInput(firstStay.ArrivalDate),
        DepartureDate: formatDateForInput(firstStay.DepartureDate),
        RoomTypeID: Number(firstStay.RoomTypeID) ||
          Number(firstStay.roomType?.RoomTypeCode || "0"),
        AdultCount: Number(firstStay.AdultCount) || 1,
        ChildCount: Number(firstStay.ChildCount) || 0,
        RateAmount: Number(firstStay.RateAmount) || 0,
        BookingChannelCode: initialData.BookingChannelCode || "DIRECT_WEB",
        PropertyID: Number(initialData.PropertyID) || 1,
        Notes: initialData.Notes || "",
        IsPresentForCheckIn: false,
        SpecificRoomNumber: "",
        IDType: "",
        IDNumber: "",
      };
    }

    // Default values for new reservation
    return {
      FirstName: "",
      LastName: "",
      EmailAddress: "",
      PhoneNumber: "",
      ArrivalDate: "",
      DepartureDate: "",
      RoomTypeID: 0,
      AdultCount: 1,
      ChildCount: 0,
      RateAmount: 0,
      BookingChannelCode: "DIRECT_WEB",
      PropertyID: 1,
      Notes: "",
      IsPresentForCheckIn: false,
      SpecificRoomNumber: "",
      IDType: "",
      IDNumber: "",
    };
  };

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(formSchema) as never,
    defaultValues: getDefaultValues(),
  });

  // Set form values from initialData after the component mounts
  useEffect(() => {
    if (isEditing && initialData) {
      const firstStay = initialData.reservationStays[0] || {};
      const nameInfo = initialData.profile.nameInfos[0] || {};

      // Format dates from ISO format to YYYY-MM-DD for date inputs
      const formatDateForInput = (isoDate: string): string => {
        if (!isoDate) return "";
        try {
          // Parse the date and handle it in a timezone-safe way
          const date = new Date(isoDate);
          // Get year, month, and day parts individually and format as YYYY-MM-DD
          const year = date.getFullYear();
          // getMonth() is 0-indexed, so add 1 to get the correct month
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        } catch (error) {
          console.error("Error parsing date:", isoDate, error);
          return "";
        }
      };

      // Set form values explicitly to ensure they're updated
      const arrivalDate = formatDateForInput(firstStay.ArrivalDate);
      const departureDate = formatDateForInput(firstStay.DepartureDate);

      console.log("Setting dates:", { arrivalDate, departureDate, original: firstStay.ArrivalDate });
      
      form.setValue("FirstName", nameInfo.FirstName || "");
      form.setValue("LastName", nameInfo.LastName || "");
      form.setValue("EmailAddress", initialData.profile.EmailAddress || "");
      form.setValue("PhoneNumber", initialData.profile.PhoneNumber || "");
      form.setValue("ArrivalDate", arrivalDate);
      form.setValue("DepartureDate", departureDate);
      form.setValue("RoomTypeID", Number(firstStay.RoomTypeID) || 
        Number(firstStay.roomType?.RoomTypeCode || "0"));
      form.setValue("AdultCount", Number(firstStay.AdultCount) || 1);
      form.setValue("ChildCount", Number(firstStay.ChildCount) || 0);
      form.setValue("RateAmount", Number(firstStay.RateAmount) || 0);
      form.setValue("BookingChannelCode", initialData.BookingChannelCode || "DIRECT_WEB");
      form.setValue("PropertyID", Number(initialData.PropertyID) || 1);
      form.setValue("Notes", initialData.Notes || "");
    }
  }, [isEditing, initialData, form]);

  const onSubmit = async (data: ReservationFormValues) => {
    try {
      setIsSubmitting(true);

      // Convert date strings to ISO format for API
      const formatDateToISO = (dateString: string): string => {
        if (!dateString) return "";
        // Create a date object from the YYYY-MM-DD string
        // and return the ISO string with time component
        const date = new Date(dateString);
        return date.toISOString();
      };

      // Format dates for API
      const arrivalDateISO = formatDateToISO(data.ArrivalDate);
      const departureDateISO = formatDateToISO(data.DepartureDate);
      
      console.log("Date conversion:", {
        original: {
          arrival: data.ArrivalDate,
          departure: data.DepartureDate
        },
        converted: {
          arrival: arrivalDateISO,
          departure: departureDateISO
        }
      });

      if (isEditing && initialData) {
        // Update existing reservation
        const firstStay = initialData.reservationStays[0] || {};
        const stayId = firstStay.ReservationStayID || 1;
        
        // Include all fields like in create flow, following the PatchReservationRequest type
        const patchData: PatchReservationRequest = {
          notes: data.Notes,
          bookingChannel: data.BookingChannelCode,
          stays: [
            {
              stayId: stayId, // Use the actual stay ID
              arrivalDate: arrivalDateISO,
              departureDate: departureDateISO,
              roomTypeId: data.RoomTypeID,
              adultCount: data.AdultCount || 0,
              childCount: data.ChildCount || 0,
              rateAmount: data.RateAmount || 0,
            },
          ],
        };

        console.log("Sending update request:", patchData);
        await reservationApi.updateReservation(
          initialData.ReservationID,
          patchData
        );
        toast.success("Reservation updated successfully");
      } else {
        // Create new reservation
        const createData: CreateReservationRequest = {
          profileId: selectedGuest?.ProfileID, // Use the selected guest's ID if available
          propertyId: data.PropertyID,
          bookingChannel: data.BookingChannelCode,
          notes: data.Notes,
          stays: [
            {
              roomTypeId: data.RoomTypeID,
              arrivalDate: arrivalDateISO,
              departureDate: departureDateISO,
              adultCount: data.AdultCount || 0,
              childCount: data.ChildCount || 0,
              rateAmount: data.RateAmount || 0,
            },
          ],
          // Only include guestInfo if we don't have a profileId
          ...(!selectedGuest?.ProfileID && {
            guestInfo: {
              firstName: data.FirstName,
              lastName: data.LastName,
              email: data.EmailAddress || '',
              phoneNumber: data.PhoneNumber || '0',
            },
          })
        };

        await reservationApi.createReservation(createData);
        toast.success("Reservation created successfully");
      }

      // Navigate back to reservations list
      router.push("/reservations");
      router.refresh();
    } catch (error) {
      console.error("Error submitting reservation:", error);
      toast.error(
        isEditing
          ? "Failed to update reservation"
          : "Failed to create reservation"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Watch for room type changes to update rate
  const selectedRoomTypeId = form.watch("RoomTypeID");
  const selectedIsPresentForCheckIn = form.watch("IsPresentForCheckIn");

  useEffect(() => {
    // Update rate based on selected room type
    if (selectedRoomTypeId) {
      const selectedRoomType = roomTypes.find(rt => Number(rt.RoomTypeID) === selectedRoomTypeId);
      if (selectedRoomType?.StandardRate) {
        form.setValue("RateAmount", Number(selectedRoomType.StandardRate));
      }
    }
  }, [selectedRoomTypeId, roomTypes, form]);

  useEffect(() => {
    setIsPresentForCheckIn(selectedIsPresentForCheckIn);
  }, [selectedIsPresentForCheckIn]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as never)} className="space-y-6">
        {!isEditing && <GuestSearch onSelect={handleGuestSelect} />}
        
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="text-center py-4">Loading form data...</div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="FirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="LastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="EmailAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="PhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="ArrivalDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arrival Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="DepartureDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departure Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="RoomTypeID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Type</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={field.value ? field.value.toString() : ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select room type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roomTypes.map((roomType) => (
                              <SelectItem
                                key={roomType.RoomTypeID}
                                value={roomType.RoomTypeID.toString()}
                              >
                                {roomType.Description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="RateAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rate (per night in IDR)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="AdultCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Adults</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            min={1}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ChildCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Children</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            min={0}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="PropertyID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value ? field.value.toString() : ""}
                        disabled={isEditing}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {properties.map((property) => (
                            <SelectItem
                              key={property.PropertyID}
                              value={property.PropertyID.toString()}
                            >
                              {property.PropertyName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="BookingChannelCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking Channel</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select booking channel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DIRECT_WEB">Direct - Hotel Website</SelectItem>
                          <SelectItem value="DIRECT_PHONE">Direct - Phone</SelectItem>
                          <SelectItem value="DIRECT_WALKIN">Direct - Walk-in</SelectItem>
                          <SelectItem value="BOOKING">Booking.com</SelectItem>
                          <SelectItem value="EXPEDIA">Expedia</SelectItem>
                          <SelectItem value="AIRBNB">Airbnb</SelectItem>
                          <SelectItem value="AGODA">Agoda</SelectItem>
                          <SelectItem value="OTHER_OTA">Other OTA</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="IsPresentForCheckIn"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Guest is present for immediate check-in</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {isPresentForCheckIn && (
                  <div className="space-y-4 border rounded-md p-4">
                    <h3 className="font-medium">Check-in Details</h3>
                    
                    <FormField
                      control={form.control}
                      name="SpecificRoomNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specific Room</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select room number" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="101">101</SelectItem>
                              <SelectItem value="102">102</SelectItem>
                              <SelectItem value="103">103</SelectItem>
                              <SelectItem value="201">201</SelectItem>
                              <SelectItem value="202">202</SelectItem>
                              <SelectItem value="203">203</SelectItem>
                              <SelectItem value="301">301</SelectItem>
                              <SelectItem value="302">302</SelectItem>
                              <SelectItem value="303">303</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="IDType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select ID type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="passport">Passport</SelectItem>
                                <SelectItem value="drivers_license">Driver&apos;s License</SelectItem>
                                <SelectItem value="id_card">ID Card</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="IDNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter ID number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="Notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requests/Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter any special requests or notes"
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Reservation"
                : "Create Reservation"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
