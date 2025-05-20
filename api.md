# API Documentation: `/frontend_api/reservations`

## GET `/frontend_api/reservations`

List reservations with optional filters.

```ts
type ReservationResponse = Array<{
  ReservationID: number;
  ProfileID: number;
  PropertyID: number;
  ConfirmationNumber: string;
  ReservationDate: string;
  BookingChannelCode: string;
  StatusCode: string;
  CancellationDate: string | null;
  CancellationReason: string | null;
  Notes: string;
  CreatedAt: string;
  UpdatedAt: string;
  CreatedBy: number;
  profile: {
    ProfileID: number;
    ProfileTypeCode: string;
    ProfileStatusCode: string;
    VIPStatusCode: string;
    IsAnIndividual: boolean;
    EmailAddress: string;
    PhoneNumber: string;
    CountryOfResidence: string;
    Nationality: string;
    BirthDate: string;
    GenderCode: string;
    Notes: string;
    CreatedAt: string;
    UpdatedAt: string;
    nameInfos: Array<{
      NameInfoID: number;
      ProfileID: number;
      NamePrefix?: string;
      FirstName: string;
      MiddleName?: string;
      LastName: string;
      NameSuffix?: string;
      IsPrimary: boolean;
      CreatedAt: string;
      UpdatedAt: string;
    }>;
    nameInfo: {
      NameInfoID: number;
      ProfileID: number;
      NamePrefix?: string;
      FirstName: string;
      MiddleName?: string;
      LastName: string;
      NameSuffix?: string;
      IsPrimary: boolean;
      CreatedAt: string;
      UpdatedAt: string;
    };
  };
  property: {
    PropertyID: number;
    PropertyCode: string;
    PropertyName: string;
    Address?: string | null;
    City: string;
    State?: string | null;
    Country: string;
    PostalCode?: string | null;
    Phone?: string | null;
    Email?: string | null;
    CheckInTime: string;
    CheckOutTime: string;
    CreatedAt: string;
    UpdatedAt: string;
  };
  reservationStays: Array<{
    ReservationStayID: number;
    ReservationID: number;
    RoomTypeID: number;
    RoomID?: number | null;
    ArrivalDate: string;
    DepartureDate: string;
    AdultCount: number;
    ChildCount: number;
    RateAmount: string;
    StatusCode: string;
    Notes?: string | null;
    CreatedAt: string;
    UpdatedAt: string;
    CreatedBy: number;
    roomType: {
      RoomTypeID: number;
      PropertyID: number;
      RoomTypeCode: string;
      Description: string;
      MaxOccupancy: number;
      BedType?: string | null;
      StandardRate: string;
      CreatedAt: string;
      UpdatedAt: string;
    };
    room?: {
      RoomID: number;
      RoomNumber: string;
    } | null;
  }>;
  reservationStay: {
    ReservationStayID: number;
    ReservationID: number;
    RoomTypeID: number;
    RoomID?: number | null;
    ArrivalDate: string;
    DepartureDate: string;
    AdultCount: number;
    ChildCount: number;
    RateAmount: string;
    StatusCode: string;
    Notes?: string | null;
    CreatedAt: string;
    UpdatedAt: string;
    CreatedBy: number;
    roomType: {
      RoomTypeID: number;
      PropertyID: number;
      RoomTypeCode: string;
      Description: string;
      MaxOccupancy: number;
      BedType?: string | null;
      StandardRate: string;
      CreatedAt: string;
      UpdatedAt: string;
    };
    room?: {
      RoomID: number;
      RoomNumber: string;
    } | null;
  };
}>;
```

---

## GET `/frontend_api/reservations/:id`

Get detailed reservation data.

### Response

```ts
type DetailedReservationResponse = {
  ReservationID: number;
  ProfileID: number;
  PropertyID: number;
  ConfirmationNumber: string;
  ReservationDate: string;
  BookingChannelCode: string;
  StatusCode: string;
  CancellationDate: string | null;
  CancellationReason: string | null;
  Notes: string;
  CreatedAt: string;
  UpdatedAt: string;
  CreatedBy: number;
  property: {
    PropertyName: string;
  };
  profile: {
    ProfileID: number;
    EmailAddress: string;
    PhoneNumber: string;
    nameInfos: Array<{
      FirstName: string;
      LastName: string;
      NamePrefix?: string;
    }>;
  };
  creator: {
    FirstName: string;
    LastName: string;
  };
  reservationStays: Array<{
    ReservationStayID: number;
    ReservationID: number;
    RoomTypeID: number;
    RoomID: number | null;
    ArrivalDate: string;
    DepartureDate: string;
    AdultCount: number;
    ChildCount: number;
    RateAmount: string;
    StatusCode: string;
    Notes: string | null;
    CreatedAt: string;
    UpdatedAt: string;
    CreatedBy: number;
    roomType: {
      RoomTypeCode: string;
      Description: string;
    };
    room: null | {
      RoomNumber?: string;
    };
    guestNameInfos: Array<any>;
  }>;
  PropertyName: string;
  CreatedByFirstName: string;
  CreatedByLastName: string;
  ProfileFirstName: string;
  ProfileLastName: string;
  ProfileNamePrefix: string;
  stays: Array<{
    ReservationStayID: number;
    ReservationID: number;
    RoomTypeID: number;
    RoomID: number | null;
    ArrivalDate: string;
    DepartureDate: string;
    AdultCount: number;
    ChildCount: number;
    RateAmount: string;
    StatusCode: string;
    Notes: string | null;
    CreatedAt: string;
    UpdatedAt: string;
    CreatedBy: number;
    roomType: {
      RoomTypeCode: string;
      Description: string;
    };
    room: null | {
      RoomNumber?: string;
    };
    guestNameInfos: Array<any>;
    RoomTypeCode: string;
    RoomTypeDescription: string;
    guests: Array<any>;
  }>;
  folios: Array<{
    FolioStayID: number;
    ReservationStayID: number;
    Status: string;
    Amount: string;
    Source: string;
    FolioType: string;
    CreatedAt: string;
    UpdatedAt: string;
    UpdatedBy: number | null;
  }>;
};
```

---

## POST /frontend_api/reservations

## Creates a new reservation for a guest. This endpoint supports both assigning an existing profile or creating a new guest profile along with reservation and stay information.

## Request Body

```ts
interface CreateReservationRequest {
  profileId?: number; // Optional: Use if guest profile already exists
  ProfileID?: number; // Alias for profileId
  propertyId?: number; // Optional, defaults to 1
  bookingChannel?: string; // Optional, defaults to "DIRECT"
  notes?: string;
  stays: StayInput[];
  guestInfo?: GuestInfoInput;
}

interface StayInput {
  roomTypeId: number;
  arrivalDate: string; // ISO date
  departureDate: string; // ISO date
  adultCount?: number; // default: 1
  childCount?: number; // default: 0
  rateAmount: number | string;
  guestNames?: {
    nameInfoId: number;
    isPrimaryGuest?: boolean;
  }[];
}

interface GuestInfoInput {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    stateProvince?: string;
    postalCode?: string;
    country?: string;
  };
  namePrefix?: string;
  nameSuffix?: string;
  middleName?: string;
  ProfileTypeCode?: string; // default: "GUEST"
  ProfileStatusCode?: string; // default: "Active"
}
```

---

## Response

```ts
interface ReservationResponse {
  ReservationID: number;
  ProfileID: number;
  PropertyID: number;
  ConfirmationNumber: string;
  BookingChannelCode: string;
  StatusCode: string;
  Notes?: string;
  CreatedBy: number;
  profile: {
    ProfileID: number;
    EmailAddress: string;
    PhoneNumber: string;
    ProfileTypeCode: string;
    ProfileStatusCode: string;
    nameInfo: {
      FirstName: string;
      LastName: string;
    } | null;
  };
  reservationStays: {
    ReservationStayID: number;
    RoomTypeID: number;
    ArrivalDate: string;
    DepartureDate: string;
    AdultCount: number;
    ChildCount: number;
    RateAmount: number;
    roomType?: any;
    room?: any;
    guestNameInfos: {
      nameInfo: {
        FirstName: string;
        LastName: string;
      };
    }[];
  }[];
}
```

---

## Error Responses

- `400 Bad Request` – if profile ID is missing and `guestInfo` is not provided.
- `500 Internal Server Error` – for general server errors during profile or reservation creation.

---

## Notes

- Automatically generates confirmation number.
- Profile is created on the fly if not provided, along with name and contact info.
- Stay dates are auto-generated between arrival and departure.
- Supports multiple stays and guest names per reservation.
- RateAmount string values will be parsed into float.

---

## PATCH `/frontend_api/reservations/:id`

Update reservation notes or stay details.

### Request

```ts
type PatchReservationRequest = {
  notes?: string;
  stays?: Array<{
    stayId: number;
    arrivalDate?: string;
    departureDate?: string;
    adultCount?: number;
    childCount?: number;
    roomTypeId?: number;
    rateAmount?: number;
  }>;
};
```

### Response

```ts
type UpdatedReservationResponse = DetailedReservationResponse;
```

---

## DELETE `/frontend_api/reservations/:id`

Cancel a reservation.

### Request

```ts
type CancelReservationRequest = {
  reason: string;
};
```

### Response

```ts
type CancelReservationResponse = {
  message: string;
};
```

---

## POST `/frontend_api/reservations/:id/check-in`

Check-in a guest.

### Request

```ts
type CheckInRequest = {
  roomId: number;
  guestDetails: {
    useReservedGuest: boolean;
    guests: Array<{
      firstName: string;
      lastName: string;
      idType?: string;
      idNumber?: string;
      isPrimary: boolean;
    }>;
  };
  paymentMethod: string;
  specialRequests?: string;
};
```

### Response

```ts
type CheckInResponse = {
  message: string;
  reservation: DetailedReservationResponse;
};
```

---

## POST `/frontend_api/reservations/:id/check-out`

Check-out a guest.

### Response

```ts
type CheckOutResponse = {
  message: string;
  reservation: DetailedReservationResponse;
};
```

---

## POST `/frontend_api/reservations/transform`

Remove redundant fields like `reservationStay` or `nameInfo`.

### Request

```ts
type TransformReservationsRequest = Array<any>; // full reservation list
```

### Response

Transformed version of reservations.

---

## POST `/frontend_api/reservations/optimize`

Same as `/transform`, optimized for storage/transmission.

---

## GET `/frontend_api/profiles`

List user profiles.

### Query Parameters

_None._

### Response

```ts
type UserProfile = {
  ProfileID: number;
  EmailAddress: string;
  PhoneNumber: string;
  CreatedAt: string; // Alternatively, you can use Date if you want to handle it as a Date object
  VIPStatusCode: string;
  FirstName: string;
  LastName: string;
  NameInfoID: number;
};

type UserProfileListResponse = Array<UserProfile>;
```

## GET `frontend_api/room-types`

List room types.

### Query Parameters

_None._

### Response

```ts
type RoomType = {
  RoomTypeID: string;
  PropertyID: string;
  RoomTypeCode: string;
  Description: string;
  MaxOccupancy: number;
  BedType: string | null;
  StandardRate: number;
  CreatedAt: string;
  UpdatedAt: string;
};

type RoomTypesResponse = Array<RoomType>;
```

## GET `frontend_api/properties`

List properties.

### Query Parameters

_None._

### Response

```ts
type Property = {
  PropertyID: string;
  PropertyCode: string;
  PropertyName: string;
  Address: string | null;
  City: string | null;
  State: string | null;
  Country: string | null;
  PostalCode: string | null;
  Phone: string | null;
  Email: string | null;
  CheckInTime: string;
  CheckOutTime: string;
  CreatedAt: string;
  UpdatedAt: string;
  RoomTypes: RoomType[];
};

type PropertiesResponse = Array<Property>;
```
