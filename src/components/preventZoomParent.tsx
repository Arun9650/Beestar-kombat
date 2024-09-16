// ParentComponent.tsx

import React from "react";
import PreventZoom from "@/components/PreventZoom";

interface Props {
  children: React.ReactNode; // Typing for children
}

const ParentComponent: React.FC<Props> = ({ children }) => {
  return (
    <div>
      {/* Prevent Zoom Functionality */}
      <PreventZoom />
      
      {/* Render children passed down */}
      <main>{children}</main>
    </div>
  );
};

export default ParentComponent;
