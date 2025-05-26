"use client";
import React, { useState } from "react";
import Timeline from "react-calendar-timeline";
import moment from "moment";
import "@/styles/timeline.css";

interface Room {
  id: string;
  title: string;
  type: string;
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

/** @note Using any type for itemRenderer due to type incompatibility with react-calendar-timeline's types */

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
    { id: "101", title: "Room 101", type: "GLSK" },
    { id: "102", title: "Room 102", type: "GLSK" },
    { id: "103", title: "Room 103", type: "GLSK" },
    { id: "104", title: "Room 104", type: "GLSK" },
    { id: "201", title: "Room 201", type: "DBPK" },
    { id: "202", title: "Room 202", type: "DBPK" },
    { id: "203", title: "Room 203", type: "DBPK" },
    { id: "204", title: "Room 204", type: "DBPK" },
    { id: "301", title: "Room 301", type: "DLXK" },
    { id: "302", title: "Room 302", type: "DLXK" },
    { id: "303", title: "Room 303", type: "DLXK" },
    { id: "304", title: "Room 304", type: "DLXK" },
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
      group: "101",
      title: "John Smith - Regular Booking",
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
      ...createBookingTimes(moment().add(1, "days"), 3),
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

    setBookings(
      bookings.map((item) =>
        item.id === itemId
          ? {
              ...item,
              start_time: newStartTime,
              end_time: newEndTime,
            }
          : item
      )
    );
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

  const handleDeleteClick = (itemId: string) => {
    const booking = bookings.find((b) => b.id === itemId);
    if (!booking) return;

    setDeleteConfirmation({
      isOpen: true,
      bookingId: itemId,
      guestName: booking.title,
    });
  };

  const handleConfirmDelete = () => {
    setBookings(
      bookings.filter((booking) => booking.id !== deleteConfirmation.bookingId)
    );
    setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }));
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(item.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-100 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 text-red-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
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
          title: `${room.title} (${room.type})`,
        }))}
        items={bookings}
        defaultTimeStart={moment().startOf("day").valueOf()}
        defaultTimeEnd={moment().startOf("day").add(7, "day").valueOf()}
        onItemMove={handleItemMove}
        onItemResize={handleItemResize}
        canMove
        canResize
        minZoom={24 * 60 * 60 * 1000} // 1 day
        maxZoom={7 * 24 * 60 * 60 * 1000} // 7 days
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
        className="bg-white rounded-lg shadow-sm"
        groupRenderer={({ group }: { group: Group }) => {
          const room = rooms.find((r) => r.id === group.id);
          return (
            <div className="flex flex-col py-2 px-4">
              <span className="font-medium">{room?.title}</span>
              <span className="text-xs text-muted-foreground">
                {room?.type}
              </span>
            </div>
          );
        }}
        // @ts-expect-error - Type compatibility issue with react-calendar-timeline
        itemRenderer={itemRenderer}
      />

      {/* Confirmation Modal */}
      {moveConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 z-100">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Booking</h3>
            <div className="space-y-3">
              <p>Are you sure you want to move this booking?</p>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">From: </span>
                  {moment(moveConfirmation.oldStartTime).format(
                    "DD MMM YYYY HH:mm"
                  )}{" "}
                  -{" "}
                  {moment(moveConfirmation.oldEndTime).format(
                    "DD MMM YYYY HH:mm"
                  )}
                </p>
                <p>
                  <span className="font-medium">To: </span>
                  {moment(moveConfirmation.newStartTime).format(
                    "DD MMM YYYY HH:mm"
                  )}{" "}
                  -{" "}
                  {moment(moveConfirmation.newEndTime).format(
                    "DD MMM YYYY HH:mm"
                  )}
                </p>
                <p>
                  <span className="font-medium">Room: </span>
                  {
                    rooms.find((r) => r.id === moveConfirmation.newGroupId)
                      ?.title
                  }
                </p>
                <p>
                  <span className="font-medium">Duration: </span>
                  {moment
                    .duration(
                      moveConfirmation.newEndTime -
                        moveConfirmation.newStartTime
                    )
                    .humanize()}
                </p>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 z-100">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 z-100">
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
