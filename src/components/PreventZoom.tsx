"use client"; // This marks the component as a client component

import { useEffect } from "react";

// Extend the DocumentEventMap to include 'gesturestart'
declare global {
  interface DocumentEventMap {
    gesturestart: GestureEvent;
  }
}

// Define a custom GestureEvent type
interface GestureEvent extends Event {
  scale: number;
}

const PreventZoom = () => {
  useEffect(() => {
    // Prevent pinch-to-zoom
    const handleTouchMove = (event: TouchEvent) => {
      if ((event as any).scale && (event as any).scale !== 1) {
        event.preventDefault();
      }
    };

    const handleGestureStart = (event: GestureEvent) => {
      if (event.scale !== 1) {
        event.preventDefault();
      }
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("gesturestart", handleGestureStart);

    // Prevent double-tap to zoom
    let lastTouchEnd = 0;
    const handleTouchEnd = (event: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener("touchend", handleTouchEnd, false);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("gesturestart", handleGestureStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return null; // No UI element needed for this component
};

export default PreventZoom;
