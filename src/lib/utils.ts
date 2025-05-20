import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Reservation, ReservationStatusType } from "./types"

/**
 * Combines class names with Tailwind's merge utility
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string to a readable format
 */
export const formatDateString = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return "Invalid date"
  }
}

/**
 * Gets the guest name from a reservation
 */
export const getGuestName = (reservation: Reservation): string => {
  if (reservation.profile?.nameInfo) {
    const { FirstName, LastName } = reservation.profile.nameInfo
    return `${FirstName} ${LastName}`
  }
  return "N/A"
}

/**
 * Gets the room information from a reservation
 */
export const getRoomInfo = (reservation: Reservation): string => {
  if (reservation.reservationStay?.room) {
    return reservation.reservationStay.room.RoomNumber
  }
  if (reservation.reservationStay?.roomType) {
    return reservation.reservationStay.roomType.Description
  }
  return "N/A"
}

/**
 * Maps status code to a friendly name
 */
export const getStatusLabel = (statusCode: string): ReservationStatusType => {
  // Convert to lowercase for case-insensitive matching
  const statusLower = statusCode.toLowerCase();
  
  const statusMap: Record<string, ReservationStatusType> = {
    "confirmed": "confirmed",
    "reserved": "reserved",
    "checked in": "checked in",
    "checked out": "checked out",
    "cancelled": "cancelled",
    "no-show": "no-show",
    
    // Also support legacy codes
    "conf": "confirmed",
    "resv": "reserved",
    "ckin": "checked in", 
    "ckot": "checked out",
    "canc": "cancelled",
    "nosw": "no-show"
  }
  
  return statusMap[statusLower] || "confirmed"
}
