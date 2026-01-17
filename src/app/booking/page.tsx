import { Suspense } from "react";
import BookingClient from "./BookingClient";


export const dynamic = "force-dynamic";

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading booking...</div>}>
      <BookingClient />
    </Suspense>
  );
}
