"use client"; // This marks the component as a client component

import { useEffect } from "react";

const PreventZoom = () => {
  useEffect(() => {
    // Prevent pinch-to-zoom (for browsers that support GestureEvent)
    const handleTouchMove = (event: TouchEvent | any) => {
      if (event.scale && event.scale !== 1) {
        event.preventDefault();
      }
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });

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
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return null; // No UI element needed for this component
};

export default PreventZoom;
