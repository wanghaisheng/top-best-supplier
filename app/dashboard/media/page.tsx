"use client";
import React, { useState } from "react";
import Gallary from "./gallary";
import { FileModel } from "@/app/models/file_model";

export default function Page() {
  const [selected, setSelected] = useState<FileModel>({});

  return (
    <div className="mt-20">
      <Gallary isDialog={true} setSelected={setSelected} />
    </div>
  );
}
