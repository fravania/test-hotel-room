import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationConfiguration as BaseSWRMutationConfig, SWRMutationResponse } from 'swr/mutation';
import { 
  Reservation, 
  DetailedReservation, 
  CreateReservationRequest, 
  CreateReservationResponse,
  PatchReservationRequest,
  CancelReservationRequest,
  CancelReservationResponse,
  CheckInRequest,
  CheckInResponse,
  CheckOutResponse,
  ReservationFilters
} from './types';
import { getApiBaseUrl, apiConfig } from './config';

// Get the API base URL from the configuration
const API_BASE_URL = getApiBaseUrl();

// Define types for mutation arguments
type MutationArg<T> = {
  method: string;
  body?: T;
};

// Define a generic SWRMutationConfiguration type
type SWRMutationConfiguration<Data = unknown, Error = unknown, ARG = unknown> = 
  BaseSWRMutationConfig<Data, Error, string, ARG>;

// Fetcher function for SWR
const fetcher = async <T>(url: string): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);
  
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'Something went wrong');
    }

    return response.json() as Promise<T>;
  } finally {
    clearTimeout(timeoutId);
  }
};

// Mutation function for SWR mutations
const mutationFetcher = async <T, R>(
  url: string,
  { arg }: { arg: MutationArg<R> }
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);
  
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: arg.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: arg.body ? JSON.stringify(arg.body) : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'Something went wrong');
    }

    return response.json() as Promise<T>;
  } finally {
    clearTimeout(timeoutId);
  }
};

// Reservation hooks
export const useReservations = (
  filters?: ReservationFilters,
  config?: SWRConfiguration
): SWRResponse<Reservation[], Error> => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value.toString());
    });
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const key = `/reservations${queryString}`;
  
  return useSWR<Reservation[], Error>(key, fetcher, config);
};

export const useReservation = (
  id: number | null,
  config?: SWRConfiguration
): SWRResponse<DetailedReservation, Error> => {
  return useSWR<DetailedReservation, Error>(
    id ? `/reservations/${id}` : null,
    fetcher,
    config
  );
};

export const useCreateReservation = (
  config?: SWRMutationConfiguration<CreateReservationResponse, Error, MutationArg<CreateReservationRequest>>
): SWRMutationResponse<CreateReservationResponse, Error, string, MutationArg<CreateReservationRequest>> => {
  return useSWRMutation<CreateReservationResponse, Error, string, MutationArg<CreateReservationRequest>>(
    '/reservations',
    mutationFetcher,
    config
  );
};

export const useUpdateReservation = (
  id: number,
  config?: SWRMutationConfiguration<DetailedReservation, Error, MutationArg<PatchReservationRequest>>
): SWRMutationResponse<DetailedReservation, Error, string, MutationArg<PatchReservationRequest>> => {
  return useSWRMutation<DetailedReservation, Error, string, MutationArg<PatchReservationRequest>>(
    `/reservations/${id}`,
    mutationFetcher,
    config
  );
};

export const useCancelReservation = (
  id: number,
  config?: SWRMutationConfiguration<CancelReservationResponse, Error, MutationArg<CancelReservationRequest>>
): SWRMutationResponse<CancelReservationResponse, Error, string, MutationArg<CancelReservationRequest>> => {
  return useSWRMutation<CancelReservationResponse, Error, string, MutationArg<CancelReservationRequest>>(
    `/reservations/${id}`,
    mutationFetcher,
    config
  );
};

export const useCheckInGuest = (
  id: number,
  config?: SWRMutationConfiguration<CheckInResponse, Error, MutationArg<CheckInRequest>>
): SWRMutationResponse<CheckInResponse, Error, string, MutationArg<CheckInRequest>> => {
  return useSWRMutation<CheckInResponse, Error, string, MutationArg<CheckInRequest>>(
    `/reservations/${id}/check-in`,
    mutationFetcher,
    config
  );
};

export const useCheckOutGuest = (
  id: number,
  config?: SWRMutationConfiguration<CheckOutResponse, Error, MutationArg<never>>
): SWRMutationResponse<CheckOutResponse, Error, string, MutationArg<never>> => {
  return useSWRMutation<CheckOutResponse, Error, string, MutationArg<never>>(
    `/reservations/${id}/check-out`,
    mutationFetcher,
    config
  );
};

export const useTransformReservations = (
  config?: SWRMutationConfiguration<Reservation[], Error, MutationArg<Reservation[]>>
): SWRMutationResponse<Reservation[], Error, string, MutationArg<Reservation[]>> => {
  return useSWRMutation<Reservation[], Error, string, MutationArg<Reservation[]>>(
    '/reservations/transform',
    mutationFetcher,
    config
  );
};

export const useOptimizeReservations = (
  config?: SWRMutationConfiguration<Reservation[], Error, MutationArg<Reservation[]>>
): SWRMutationResponse<Reservation[], Error, string, MutationArg<Reservation[]>> => {
  return useSWRMutation<Reservation[], Error, string, MutationArg<Reservation[]>>(
    '/reservations/optimize',
    mutationFetcher,
    config
  );
}; 