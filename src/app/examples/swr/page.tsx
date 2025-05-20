import ReservationExample from '@/components/examples/ReservationExample';

export default function SWRExamplePage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">SWR API Example</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ReservationExample />
      </div>
    </div>
  );
} 