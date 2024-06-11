"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function ExtSearchScreen() {
  return (
    <>
      <div className="flex items-start justify-start">
        <input
          type="text"
          className="border border-gray-300 rounded h-12 lg:h-12 lg:w-[35%] w-[70%] p-0 px-2 py-4 text-xl text-gray-700 focus:outline-none focus:border-blue-500"
          placeholder="search..."
        />

        <button
          className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-small h-12 lg:h-12 lg:w-[10%] w-[20%] py-4 px-1 rounded text-sm flex items-center justify-center"
          onClick={() => {}}
        >
          <MagnifyingGlassIcon
            className="h-5 lg:h-6 w-5 lg:w-6"
            aria-hidden="true"
          />
        </button>
      </div>
    </>
  );
}
