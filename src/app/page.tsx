"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <div className="h-screen w-screen">
        <MapComponent />
      </div>
    </main>
  );
}
