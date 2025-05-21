export type Reservation = {
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
  profile?: {
    ProfileID: number;
    ProfileTypeCode?: string;
    ProfileStatusCode?: string;
    VIPStatusCode?: string;
    IsAnIndividual?: boolean;
    EmailAddress?: string;
    PhoneNumber?: string;
    CountryOfResidence?: string;
    Nationality?: string;
    BirthDate?: string;
    GenderCode?: string;
    Notes?: string;
    CreatedAt?: string;
    UpdatedAt?: string;
    nameInfos?: Array<{
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
    nameInfo?: {
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
  property?: {
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
  reservationStays?: Array<{
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
    roomType?: {
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
  reservationStay?: {
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
    roomType?: {
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
};

export type DetailedReservation = {
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
    EmailAddress?: string;
    PhoneNumber?: string;
    nameInfos: Array<{
      FirstName: string;
      LastName: string;
      NamePrefix?: string;
    }>;
  };
  creator?: {
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
    guestNameInfos: Array<{
      nameInfo: {
        FirstName: string;
        LastName: string;
        NamePrefix?: string;
      };
    }>;
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
    guestNameInfos: Array<{
      nameInfo: {
        FirstName: string;
        LastName: string;
        NamePrefix?: string;
      };
    }>;
    RoomTypeCode: string;
    RoomTypeDescription: string;
    guests: Array<{
      firstName: string;
      lastName: string;
      idType?: string;
      idNumber?: string;
      isPrimary: boolean;
    }>;
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

export type CreateReservationRequest = {
  profileId?: number;
  ProfileID?: number;
  propertyId?: number;
  bookingChannel?: string;
  notes?: string;
  stays: Array<{
    roomTypeId: number;
    arrivalDate: string;
    departureDate: string;
    adultCount?: number;
    childCount?: number;
    rateAmount: number | string;
    guestNames?: Array<{
      nameInfoId: number;
      isPrimaryGuest?: boolean;
    }>;
  }>;
  guestInfo?: {
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
    ProfileTypeCode?: string;
    ProfileStatusCode?: string;
  };
};

export type CreateReservationResponse = {
  ReservationID: number;
  confirmationNumber: string;
  guestName: string;
};

export type PatchReservationRequest = {
  notes?: string;
  bookingChannel?: string;
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

export type CancelReservationRequest = {
  reason: string;
};

export type CancelReservationResponse = {
  message: string;
};

export type CheckInRequest = {
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

export type CheckInResponse = {
  message: string;
  reservation: DetailedReservation;
};

export type CheckOutResponse = {
  message: string;
  reservation: DetailedReservation;
};

export type ReservationFilters = {
  confirmationNumber?: string;
  lastName?: string;
  arrivalDate?: string;
  status?: string;
};

export type ReservationStatusType = "confirmed" | "checked in" | "checked out" | "cancelled" | "no-show" | "reserved";

export type UserProfile = {
  ProfileID: number;
  EmailAddress: string;
  PhoneNumber: string;
  CreatedAt: string;
  VIPStatusCode: string;
  FirstName: string;
  LastName: string;
  NameInfoID: number;
};

export type UserProfileListResponse = Array<UserProfile>;

export type RoomType = {
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

export type RoomTypesResponse = Array<RoomType>;

export type Property = {
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

export type PropertiesResponse = Array<Property>; 