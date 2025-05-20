# SWR API Hooks

This directory contains hooks built with [SWR](https://swr.vercel.app/) for data fetching and mutations in the Hotel Dashboard.

## Fetching Data

```tsx
// Fetch a list of reservations
const { data, error, isLoading, mutate } = useReservations(filters);

// Fetch a single reservation
const { data, error, isLoading } = useReservation(reservationId);
```

## Mutations

```tsx
// Create a reservation
const { trigger, isMutating } = useCreateReservation();
await trigger({ 
  method: 'POST', 
  body: newReservationData 
});

// Update a reservation
const { trigger, isMutating } = useUpdateReservation(reservationId);
await trigger({ 
  method: 'PATCH', 
  body: updateData 
});

// Cancel a reservation
const { trigger, isMutating } = useCancelReservation(reservationId);
await trigger({ 
  method: 'DELETE', 
  body: { reason: 'Guest request' } 
});

// Check-in
const { trigger, isMutating } = useCheckInGuest(reservationId);
await trigger({ 
  method: 'POST', 
  body: checkInData 
});

// Check-out
const { trigger, isMutating } = useCheckOutGuest(reservationId);
await trigger({ 
  method: 'POST' 
});
```

## Benefits of SWR

1. **Automatic Revalidation**: Data is automatically refreshed when the window is refocused or the network is reconnected.

2. **Deduplication**: Duplicate requests are automatically deduplicated during a time window.

3. **Cache**: Data is cached for better performance and UX.

4. **Optimistic Updates**: You can update the local data optimistically before sending the actual request.

5. **Error Handling**: Better handling of errors with retry mechanisms.

## Configuration

Global SWR configuration can be added to your app's entry point:

```tsx
import { SWRConfig } from 'swr';

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig 
      value={{
        refreshInterval: 3000,
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}
```

## Example Usage

See `/components/examples/ReservationExample.tsx` for a complete example of using these hooks.

Visit `/examples/swr` in the browser to see the working example. 