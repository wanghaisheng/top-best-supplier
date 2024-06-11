import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function SearchScreen() {
  return (
    <>
      <div className="flex items-center mx-2">
        <input
          type="text"
          className="border border-gray-300 rounded h-6 lg:h-8 w-3/4 p-0 mx-auto px-2 py-4 text-sm text-gray-700 focus:outline-none focus:border-blue-500"
          placeholder="search..."
        />

        <button
          className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-small h-6 lg:h-8 w-1/6 py-4 px-1 rounded text-sm flex items-center justify-center"
          onClick={() => {}}
        >
          <MagnifyingGlassIcon
            className="h-5 lg:h-6 w-5 lg:w-6"
            aria-hidden="true"
          />
        </button>
      </div>
      <div className="font-small items-center mx-2 pt-20 px-5 block text-sm font-small text-gray-900">
        {"your search result will appear here"}
      </div>
    </>
  );
}
