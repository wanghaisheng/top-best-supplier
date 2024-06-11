"use client";
import { useState } from "react";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/s3_uploader", {
        cache: "no-store",
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <>
      <h1>Upload Files to s3 Bucket</h1>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={!file || uploading}>
          {uploading ? "uploading..." : "upload"}
        </button>
      </form>
    </>
  );
};

export default UploadForm;
