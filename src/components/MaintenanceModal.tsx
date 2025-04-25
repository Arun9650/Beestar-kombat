import React, { useEffect, useState } from "react";

const MaintenanceModal = () => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleCloseBot = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.close();
    } else {
      console.warn("Telegram WebApp API not available.");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4 text-red-600">🚧 Bot Under Maintenance</h2>
            <p className="mb-6 text-gray-700">
              We’re currently performing some updates. Please check back later.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCloseBot}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Close Bot
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MaintenanceModal;
