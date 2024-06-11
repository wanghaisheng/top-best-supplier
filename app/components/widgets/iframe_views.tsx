import React from "react";

export default function IframeModal({ isOpen, onClose, iframeUrl }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white overflow-auto">
        <button
          className="absolute top-0 right-0 m-4 z-10 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          close map
        </button>

        <iframe
          className="w-screen h-screen"
          src={iframeUrl}
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
        ></iframe>

        <button
          className="fixed bottom-4 right-4 bg-red-700 p-2 rounded-lg shadow-md z-10 text-white hover:text-gray-800"
          onClick={onClose}
        >
          close map
        </button>
      </div>
    </div>
  );
}
