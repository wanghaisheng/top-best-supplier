import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import ConfirmAction from "./confirm";
import { useState } from "react";

export function ActionButtons({
  id,
  onDelete,
  onView,
  onEdit,
  info = "Are you sure you want to delete this?",
  headerText = "Delete Item",
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="text-red-500 hover:bg-white p-1 rounded mx-1"
      >
        <TrashIcon className="w-4 h-4" />
      </button>

      <button
        className="text-blue-500 hover:bg-green-600 p-1 rounded mx-1"
        onClick={() => onEdit(id)}
      >
        <PencilIcon className="w-4 h-4" />
      </button>

      <button
        className="text-green-500 hover:bg-green-600 p-1 rounded mx-1"
        onClick={() => onView(id)}
      >
        <EyeIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <ConfirmAction
          info={info}
          headerText={headerText}
          isOpen={isOpen}
          onConfirm={() => {
            onDelete(id);
            setIsOpen((prev) => !prev);
          }}
          onCancel={() => setIsOpen((prev) => !prev)}
          confirmButtonText="Proceed"
        />
      )}
    </div>
  );
}
