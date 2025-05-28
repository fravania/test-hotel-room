"use client";
import React, { useState } from "react";
import Timeline from "react-calendar-timeline";
import moment from "moment";
import "@/styles/timeline.css";

interface Room {
  id: string;
  title: string;
  type: string;
  floor: string;
  exposure?: string;
  attributes?: string[];
  isClean?: boolean;
  isLocked?: boolean;
}

interface Booking {
  id: string;
  group: string;
  title: string;
  start_time: number;
  end_time: number;
  canMove?: boolean;
  canResize?: boolean;
  confirmationNumber?: string;
  arrivalDate?: string;
  departureDate?: string;
  adult?: number;
  rate?: string;
  folioBalance?: string;
  settlementType?: string;
  bookingAgency?: string;
  itemProps?: {
    style?: React.CSSProperties;
  };
}

interface Group {
  id: string;
  title: string;
}

interface MoveConfirmation {
  isOpen: boolean;
  itemId: string;
  newStartTime: number;
  newEndTime: number;
  newGroupId: string;
  oldStartTime: number;
  oldEndTime: number;
  oldGroupId: string;
  isResize?: boolean;
}

interface NewBookingForm {
  isOpen: boolean;
  roomId: string;
  startDate: string;
  endDate: string;
  guestName: string;
}

interface DeleteConfirmation {
  isOpen: boolean;
  bookingId: string;
  guestName: string;
}

const RoomScheduler: React.FC = () => {
  const [moveConfirmation, setMoveConfirmation] = useState<MoveConfirmation>({
    isOpen: false,
    itemId: "",
    newStartTime: 0,
    newEndTime: 0,
    newGroupId: "",
    oldStartTime: 0,
    oldEndTime: 0,
    oldGroupId: "",
  });

  const [newBookingForm, setNewBookingForm] = useState<NewBookingForm>({
    isOpen: false,
    roomId: "",
    startDate: moment().format("YYYY-MM-DD"),
    endDate: moment().add(1, "day").format("YYYY-MM-DD"),
    guestName: "",
  });

  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteConfirmation>({
      isOpen: false,
      bookingId: "",
      guestName: "",
    });

  // Sample room data
  const [rooms] = useState<Room[]>([
    {
      id: "101",
      title: "Room 101",
      type: "GLSK",
      floor: "01 Floor",
      exposure: "Gallery Suite King",
      attributes: ["HF", "KING", "TUB"],
      isClean: true,
    },
    {
      id: "102",
      title: "Room 102",
      type: "GLSK",
      floor: "01 Floor",
      exposure: "Gallery Suite King",
      attributes: ["HF", "KING", "TUB"],
      isClean: true,
    },
    {
      id: "103",
      title: "Room 103",
      type: "GLSK",
      floor: "01 Floor",
      exposure: "Gallery Suite King",
      attributes: ["HF", "KING", "TUB"],
      isClean: false,
    },
    {
      id: "104",
      title: "Room 104",
      type: "GLSK",
      floor: "01 Floor",
      exposure: "Gallery Suite King",
      attributes: ["HF", "KING", "TUB"],
      isClean: true,
    },
    {
      id: "201",
      title: "Room 201",
      type: "DBPK",
      floor: "02 Floor",
      exposure: "Deluxe Balcony Pool King",
      attributes: ["HF", "KING", "TUB", "BALCONY"],
      isClean: true,
    },
    {
      id: "202",
      title: "Room 202",
      type: "DBPK",
      floor: "02 Floor",
      exposure: "Deluxe Balcony Pool King",
      attributes: ["HF", "KING", "TUB", "BALCONY"],
      isClean: true,
    },
    {
      id: "203",
      title: "Room 203",
      type: "DBPK",
      floor: "02 Floor",
      exposure: "Deluxe Balcony Pool King",
      attributes: ["HF", "KING", "TUB", "BALCONY"],
      isClean: false,
    },
    {
      id: "204",
      title: "Room 204",
      type: "DBPK",
      floor: "02 Floor",
      exposure: "Deluxe Balcony Pool King",
      attributes: ["HF", "KING", "TUB", "BALCONY"],
      isClean: true,
    },
    {
      id: "301",
      title: "Room 301",
      type: "DLXK",
      floor: "03 Floor",
      exposure: "Deluxe Lake King",
      attributes: ["HF", "KING", "TUB", "LAKE"],
      isClean: true,
    },
    {
      id: "302",
      title: "Room 302",
      type: "DLXK",
      floor: "03 Floor",
      exposure: "Deluxe Lake King",
      attributes: ["HF", "KING", "TUB", "LAKE"],
      isClean: false,
    },
    {
      id: "303",
      title: "Room 303",
      type: "DLXK",
      floor: "03 Floor",
      exposure: "Deluxe Lake King",
      attributes: ["HF", "KING", "TUB", "LAKE"],
      isClean: true,
    },
    {
      id: "304",
      title: "Room 304",
      type: "DLXK",
      floor: "03 Floor",
      exposure: "Deluxe Lake King",
      attributes: ["HF", "KING", "TUB", "LAKE"],
      isClean: true,
    },
  ]);

  // Helper function to create booking times
  const createBookingTimes = (startDate: moment.Moment, nights: number) => {
    const checkIn = startDate.clone().set({ hour: 14, minute: 0 });
    const checkOut = startDate
      .clone()
      .add(nights, "days")
      .set({ hour: 12, minute: 0 });
    return {
      start_time: checkIn.valueOf(),
      end_time: checkOut.valueOf(),
    };
  };

  // Sample booking data
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "1",
      group: "102",
      title: "Halim, Susan",
      confirmationNumber: "27355030-1",
      arrivalDate: "Thu 03 08 2023",
      departureDate: "Sun 06 08 2023",
      adult: 2,
      rate: "IDR",
      folioBalance: "-7,000,000 IDR",
      settlementType: "100",
      bookingAgency: "WEBBHOTELIER",
      ...createBookingTimes(moment(), 2),
      canMove: true,
      canResize: true,
      itemProps: {
        style: {
          background: "#22C55E",
          color: "white",
          border: "1px solid #16A34A",
        },
      },
    },
    {
      id: "2",
      group: "102",
      title: "VIP Conference (Locked)",
      ...createBookingTimes(moment().add(3, "days"), 3),
      canMove: false,
      canResize: false,
      itemProps: {
        style: {
          background: "#EAB308",
          color: "white",
          border: "1px solid #CA8A04",
          cursor: "not-allowed",
        },
      },
    },
    {
      id: "3",
      group: "201",
      title: "Maria Garcia - Early Check-in",
      ...createBookingTimes(moment().subtract(1, "days"), 1),
      canMove: true,
      canResize: true,
      itemProps: {
        style: {
          background: "#3B82F6",
          color: "white",
          border: "1px solid #2563EB",
        },
      },
    },
    {
      id: "4",
      group: "301",
      title: "Wedding Party (Locked)",
      ...createBookingTimes(moment().add(2, "days"), 2),
      canMove: false,
      canResize: false,
      itemProps: {
        style: {
          background: "#EC4899",
          color: "white",
          border: "1px solid #DB2777",
          cursor: "not-allowed",
        },
      },
    },
    {
      id: "5",
      group: "302",
      title: "Maintenance Block (Locked)",
      ...createBookingTimes(moment(), 1),
      canMove: false,
      canResize: false,
      itemProps: {
        style: {
          background: "#64748B",
          color: "white",
          border: "1px solid #475569",
          cursor: "not-allowed",
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)",
        },
      },
    },
    {
      id: "6",
      group: "103",
      title: "Late Check-out Booking",
      ...createBookingTimes(moment().add(1, "days"), 1),
      canMove: true,
      canResize: true,
      itemProps: {
        style: {
          background: "#8B5CF6",
          color: "white",
          border: "1px solid #7C3AED",
        },
      },
    },
  ]);

  const checkOverlap = (
    startTime: number,
    endTime: number,
    roomId: string,
    excludeBookingId?: string
  ) => {
    return bookings.some(
      (booking) =>
        booking.group === roomId &&
        booking.id !== excludeBookingId &&
        ((startTime >= booking.start_time && startTime < booking.end_time) ||
          (endTime > booking.start_time && endTime <= booking.end_time) ||
          (startTime <= booking.start_time && endTime >= booking.end_time))
    );
  };

  const handleItemMove = (
    itemId: string,
    dragTime: number,
    newGroupOrder: number
  ) => {
    const booking = bookings.find((item) => item.id === itemId);
    if (!booking || !booking.canMove) return;

    const group = rooms[newGroupOrder];
    if (!group) return;

    const duration = booking.end_time - booking.start_time;
    const newEndTime = dragTime + duration;

    // Check for overlapping bookings
    if (checkOverlap(dragTime, newEndTime, group.id, itemId)) {
      alert("Cannot move booking: Time slot is already occupied");
      return;
    }

    setMoveConfirmation({
      isOpen: true,
      itemId,
      newStartTime: dragTime,
      newEndTime: newEndTime,
      newGroupId: group.id,
      oldStartTime: booking.start_time,
      oldEndTime: booking.end_time,
      oldGroupId: booking.group,
    });
  };

  const handleItemResize = (
    itemId: string,
    time: number,
    edge: "left" | "right"
  ) => {
    const booking = bookings.find((item) => item.id === itemId);
    if (!booking || !booking.canResize) return;

    let newStartTime = booking.start_time;
    let newEndTime = booking.end_time;

    if (edge === "left") {
      newStartTime = time;
    } else {
      newEndTime = time;
    }

    // Check for overlapping bookings
    if (checkOverlap(newStartTime, newEndTime, booking.group, itemId)) {
      alert("Cannot resize booking: Would overlap with another booking");
      return;
    }

    setMoveConfirmation({
      isOpen: true,
      itemId,
      newStartTime,
      newEndTime,
      newGroupId: booking.group,
      oldStartTime: booking.start_time,
      oldEndTime: booking.end_time,
      oldGroupId: booking.group,
      isResize: true,
    });
  };

  const handleConfirmMove = () => {
    setBookings(
      bookings.map((item) =>
        item.id === moveConfirmation.itemId
          ? {
              ...item,
              start_time: moveConfirmation.newStartTime,
              end_time: moveConfirmation.newEndTime,
              group: moveConfirmation.newGroupId,
            }
          : item
      )
    );
    setMoveConfirmation((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCancelMove = () => {
    setBookings(
      bookings.map((item) =>
        item.id === moveConfirmation.itemId
          ? {
              ...item,
              start_time: moveConfirmation.oldStartTime,
              end_time: moveConfirmation.oldEndTime,
              group: moveConfirmation.oldGroupId,
            }
          : item
      )
    );
    setMoveConfirmation((prev) => ({ ...prev, isOpen: false }));
  };

  const handleAddNewBooking = () => {
    setNewBookingForm({
      isOpen: true,
      roomId: rooms[0].id,
      startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().add(1, "day").format("YYYY-MM-DD"),
      guestName: "",
    });
  };

  const handleCreateBooking = () => {
    const startTime = moment(newBookingForm.startDate)
      .set({ hour: 14, minute: 0 })
      .valueOf();
    const endTime = moment(newBookingForm.endDate)
      .set({ hour: 12, minute: 0 })
      .valueOf();

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      group: newBookingForm.roomId,
      title: `${newBookingForm.guestName}`,
      start_time: startTime,
      end_time: endTime,
      canMove: true,
      canResize: true,
      itemProps: {
        style: {
          background: "#22C55E",
          color: "white",
          border: "1px solid #16A34A",
        },
      },
    };

    setBookings([...bookings, newBooking]);
    setNewBookingForm((prev) => ({ ...prev, isOpen: false }));
  };

  const handleDeleteClick = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      setDeleteConfirmation({
        isOpen: true,
        bookingId,
        guestName: booking.title,
      });
    }
  };

  const handleConfirmDelete = () => {
    setBookings(
      bookings.filter((booking) => booking.id !== deleteConfirmation.bookingId)
    );
    setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }));
  };

  const formatDateTime = (timestamp: number) => {
    return moment(timestamp).format("DD MMM YYYY");
  };

  const itemRenderer = (props: {
    item: Booking;
    itemContext: { title: string };
    getItemProps: () => React.HTMLAttributes<HTMLDivElement>;
  }) => {
    const { item, itemContext, getItemProps } = props;
    return (
      <div {...getItemProps()} className="relative group">
        <div
          style={{
            ...item.itemProps?.style,
            height: "100%",
            overflow: "hidden",
            paddingLeft: 8,
            paddingRight: 8,
            display: "flex",
            alignItems: "center",
          }}
        >
          <span className="truncate flex-1">{itemContext.title}</span>
          {item.canMove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(item.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/10 rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          )}
        </div>
        {/* Booking tooltip */}
        <div className="absolute z-[9999] invisible group-hover:visible bg-white border border-gray-200 text-black text-sm rounded-md p-3 -top-2 left-full translate-y-0 min-w-[250px] shadow-lg">
          <div className="space-y-1">
            <div className="font-medium">{item.title}</div>
            <div>Confirmation: {item.confirmationNumber}</div>
            <div>Arrival: {item.arrivalDate}</div>
            <div>Departure: {item.departureDate}</div>
            <div>Adult: {item.adult}</div>
            <div>Rate: {item.rate}</div>
            <div>Folio Balance: {item.folioBalance}</div>
            <div>Settlement Type: {item.settlementType}</div>
            <div>Booking Agency: {item.bookingAgency}</div>
          </div>
        </div>
      </div>
    );
  };

  const groupRenderer = ({ group }: { group: Group }) => {
    const room = rooms.find((r) => r.id === group.id);
    if (!room) return null;

    return (
      <div className="group/room relative hover:bg-gray-200">
        <div className="flex items-center px-2  ">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{room.title}</span>
              <span className="text-sm text-gray-600">{room.type}</span>
            </div>
          </div>
          {room.isClean && (
            <div className="text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2M6 7v-.282c0-.526.422-.943.944-.935L18 6" />
              </svg>
            </div>
          )}
        </div>
        {/* Room tooltip */}
        <div className="absolute z-[9999] invisible group-hover/room:visible bg-white border border-gray-200 text-black text-sm rounded-md p-3 left-full top-0 min-w-[250px] shadow-lg ml-2">
          <div className="font-medium border-b pb-2">{room.title}</div>
          <div className="space-y-2 pt-2">
            <div>
              <div className="text-gray-600">Room Type:</div>
              <div>{room.exposure}</div>
            </div>
            <div>
              <div className="text-gray-600">Floor:</div>
              <div>{room.floor}</div>
            </div>
            <div>
              <div className="text-gray-600">Exposure:</div>
              <div>{room.exposure}</div>
            </div>
            <div>
              <div className="text-gray-600">Room Attributes:</div>
              <div>{room.attributes?.join(", ")}</div>
            </div>
            <div>
              <div className="text-gray-600">Clean:</div>
              <div className="flex items-center gap-1">
                {room.isClean ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2M6 7v-.282c0-.526.422-.943.944-.935L18 6" />
                  </svg>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full relative">
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleAddNewBooking}
          className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md"
        >
          Add New Booking
        </button>
      </div>

      <Timeline
        groups={rooms.map((room) => ({
          id: room.id,
          title: room.title,
        }))}
        items={bookings}
        defaultTimeStart={moment().startOf("day").valueOf()}
        defaultTimeEnd={moment().startOf("day").add(7, "day").valueOf()}
        onItemMove={handleItemMove}
        onItemResize={handleItemResize}
        canMove
        canResize
        minZoom={24 * 60 * 60 * 1000}
        maxZoom={7 * 24 * 60 * 60 * 1000}
        timeSteps={{
          second: 0,
          minute: 0,
          hour: 1,
          day: 1,
          month: 1,
          year: 1,
        }}
        lineHeight={50}
        itemHeightRatio={0.8}
        sidebarWidth={180}
        groupRenderer={groupRenderer}
        // @ts-expect-error - Type compatibility issue with react-calendar-timeline
        itemRenderer={itemRenderer}
        className="bg-white rounded-lg shadow-sm [&_.rct-header-root]:bg-gray-100 [&_.rct-calendar-header]:bg-gray-50 [&_.rct-sidebar]:!overflow-visible"
      />

      {/* Move/Resize Confirmation Modal */}
      {moveConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Confirm {moveConfirmation.isResize ? "Resize" : "Move"} Booking
            </h3>
            <div className="space-y-3">
              <p>
                Are you sure you want to{" "}
                {moveConfirmation.isResize ? "resize" : "move"} this booking?
              </p>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">From: </span>
                  {formatDateTime(moveConfirmation.oldStartTime)} -{" "}
                  {formatDateTime(moveConfirmation.oldEndTime)}
                </p>
                <p>
                  <span className="font-medium">To: </span>
                  {formatDateTime(moveConfirmation.newStartTime)} -{" "}
                  {formatDateTime(moveConfirmation.newEndTime)}
                </p>
                {!moveConfirmation.isResize && (
                  <p>
                    <span className="font-medium">Room: </span>
                    {
                      rooms.find((r) => r.id === moveConfirmation.newGroupId)
                        ?.title
                    }
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCancelMove}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMove}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Booking Modal */}
      {newBookingForm.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Booking</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guest Name
                </label>
                <input
                  type="text"
                  value={newBookingForm.guestName}
                  onChange={(e) =>
                    setNewBookingForm((prev) => ({
                      ...prev,
                      guestName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter guest name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room
                </label>
                <select
                  value={newBookingForm.roomId}
                  onChange={(e) =>
                    setNewBookingForm((prev) => ({
                      ...prev,
                      roomId: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.title} ({room.type})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={newBookingForm.startDate}
                  onChange={(e) =>
                    setNewBookingForm((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={newBookingForm.endDate}
                  onChange={(e) =>
                    setNewBookingForm((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() =>
                  setNewBookingForm((prev) => ({ ...prev, isOpen: false }))
                }
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBooking}
                disabled={!newBookingForm.guestName}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center  z-100">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Booking</h3>
            <div className="space-y-3">
              <p>Are you sure you want to delete this booking?</p>
              <p className="text-sm text-gray-600">
                Guest:{" "}
                <span className="font-medium">
                  {deleteConfirmation.guestName}
                </span>
              </p>
              <p className="text-sm text-red-600">
                This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() =>
                  setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }))
                }
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Delete Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomScheduler;
