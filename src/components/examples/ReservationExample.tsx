"use client";

import { useState } from 'react';
import { 
  useReservations, 
  useReservation, 
  useCreateReservation,
  useUpdateReservation,
  useCancelReservation,
  useCheckInGuest,
  useCheckOutGuest
} from '@/lib/swr-hooks';
import { CreateReservationRequest, PatchReservationRequest, CheckInRequest } from '@/lib/types';

const ReservationExample = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  // Fetch all reservations
  const { 
    data: reservations, 
    error: reservationsError, 
    isLoading: reservationsLoading,
    mutate: mutateReservations 
  } = useReservations();
  
  // Fetch single reservation details
  const { 
    data: reservation, 
    error: reservationError, 
    isLoading: reservationLoading 
  } = useReservation(selectedId);
  
  // Create reservation mutation
  const { 
    trigger: createReservation, 
    isMutating: isCreating 
  } = useCreateReservation();
  
  // Update reservation mutation
  const { 
    trigger: updateReservation, 
    isMutating: isUpdating 
  } = useUpdateReservation(selectedId || 0);
  
  // Cancel reservation mutation
  const { 
    trigger: cancelReservation, 
    isMutating: isCancelling 
  } = useCancelReservation(selectedId || 0);
  
  // Check-in mutation
  const { 
    trigger: checkInGuest, 
    isMutating: isCheckingIn 
  } = useCheckInGuest(selectedId || 0);
  
  // Check-out mutation
  const { 
    trigger: checkOutGuest, 
    isMutating: isCheckingOut 
  } = useCheckOutGuest(selectedId || 0);

  // Example of creating a reservation
  const handleCreateReservation = async () => {
    const newReservation: CreateReservationRequest = {
      ConfirmationNumber: 'RES' + Math.floor(Math.random() * 10000),
      profile: {
        FirstName: 'John',
        LastName: 'Doe',
        EmailAddress: 'john.doe@example.com',
        PhoneNumber: '+1234567890'
      },
      reservationStays: [
        {
          ArrivalDate: '2023-10-01',
          DepartureDate: '2023-10-05',
          RoomTypeID: 101,
          RoomID: 201
        }
      ],
      BookingChannelCode: 'DIRECT',
      PropertyID: 1
    };
    
    try {
      await createReservation({ method: 'POST', body: newReservation });
      // Refetch the list after creation
      mutateReservations();
    } catch (error) {
      console.error('Failed to create reservation:', error);
    }
  };
  
  // Example of updating a reservation
  const handleUpdateReservation = async () => {
    if (!selectedId) return;
    
    const updateData: PatchReservationRequest = {
      notes: 'Need extra pillows',
      stays: [
        {
          stayId: 1,
          departureDate: '2023-10-06' // Extend stay by one day
        }
      ]
    };
    
    try {
      await updateReservation({ method: 'PATCH', body: updateData });
      // No need to manually refetch as SWR will revalidate automatically
    } catch (error) {
      console.error('Failed to update reservation:', error);
    }
  };
  
  // Example of cancelling a reservation
  const handleCancelReservation = async () => {
    if (!selectedId) return;
    
    try {
      await cancelReservation({ method: 'DELETE', body: { reason: 'Guest request' } });
      setSelectedId(null);
      mutateReservations();
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
    }
  };
  
  // Example of checking in a guest
  const handleCheckIn = async () => {
    if (!selectedId) return;
    
    const checkInData: CheckInRequest = {
      roomId: 201,
      guestDetails: {
        useReservedGuest: true,
        guests: [
          {
            firstName: 'John',
            lastName: 'Doe',
            isPrimary: true
          }
        ]
      },
      paymentMethod: 'credit_card',
      specialRequests: 'Late arrival'
    };
    
    try {
      await checkInGuest({ method: 'POST', body: checkInData });
      // Refetch the reservation details
      mutateReservations();
    } catch (error) {
      console.error('Failed to check in guest:', error);
    }
  };
  
  // Example of checking out a guest
  const handleCheckOut = async () => {
    if (!selectedId) return;
    
    try {
      await checkOutGuest({ method: 'POST' });
      mutateReservations();
    } catch (error) {
      console.error('Failed to check out guest:', error);
    }
  };

  // Select a reservation to view details
  const selectReservation = (id: number) => {
    setSelectedId(id);
  };

  if (reservationsLoading) return <div>Loading reservations...</div>;
  if (reservationsError) return <div>Error loading reservations</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reservations Example</h1>
      
      {/* Reservation Actions */}
      <div className="flex gap-2">
        <button 
          onClick={handleCreateReservation}
          disabled={isCreating}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isCreating ? 'Creating...' : 'Create Reservation'}
        </button>
      </div>
      
      {/* Reservations List */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Reservations</h2>
        {reservations?.length ? (
          <ul className="space-y-2">
            {reservations.map(res => (
              <li 
                key={res.ReservationID} 
                className={`p-3 border rounded cursor-pointer ${selectedId === res.ReservationID ? 'bg-blue-100 border-blue-500' : ''}`}
                onClick={() => selectReservation(res.ReservationID)}
              >
                Reservation #{res.ReservationID} - {res.profile?.nameInfo?.FirstName || 'Unknown'} {res.profile?.nameInfo?.LastName || 'Guest'}
              </li>
            ))}
          </ul>
        ) : (
          <p>No reservations found</p>
        )}
      </div>
      
      {/* Selected Reservation Details */}
      {selectedId && (
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Reservation Details</h2>
          
          {reservationLoading && <p>Loading details...</p>}
          {reservationError && <p>Error loading details</p>}
          
          {reservation && (
            <div className="space-y-4">
              <div>
                <p><strong>Confirmation:</strong> {reservation.ConfirmationNumber}</p>
                <p><strong>Guest:</strong> {reservation.profile.nameInfos[0]?.FirstName} {reservation.profile.nameInfos[0]?.LastName}</p>
                <p><strong>Room:</strong> {reservation.reservationStays[0]?.room.RoomNumber}</p>
                <p><strong>Check-in:</strong> {reservation.reservationStays[0]?.ArrivalDate}</p>
                <p><strong>Check-out:</strong> {reservation.reservationStays[0]?.DepartureDate}</p>
                <p><strong>Status:</strong> {reservation.StatusCode}</p>
              </div>
              
              {/* Detail Actions */}
              <div className="flex gap-2">
                <button 
                  onClick={handleUpdateReservation}
                  disabled={isUpdating}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  {isUpdating ? 'Updating...' : 'Update'}
                </button>
                
                {reservation.StatusCode === 'CONFIRMED' && (
                  <button 
                    onClick={handleCheckIn}
                    disabled={isCheckingIn}
                    className="px-3 py-1 bg-purple-500 text-white rounded"
                  >
                    {isCheckingIn ? 'Checking In...' : 'Check In'}
                  </button>
                )}
                
                {reservation.StatusCode === 'CHECKED_IN' && (
                  <button 
                    onClick={handleCheckOut}
                    disabled={isCheckingOut}
                    className="px-3 py-1 bg-orange-500 text-white rounded"
                  >
                    {isCheckingOut ? 'Checking Out...' : 'Check Out'}
                  </button>
                )}
                
                <button 
                  onClick={handleCancelReservation}
                  disabled={isCancelling || ['COMPLETED', 'CANCELLED'].includes(reservation.StatusCode)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReservationExample; 