import { Editor } from "@tinymce/tinymce-react";
import { NEXT_PUBLIC_S3_UPLOADER } from "@/constants";
import { useState } from "react";

export default function ReusableEditor({
  initialValue,
  onChange,
  height = "400",
}) {
  const customButton = {
    type: "button",
    text: "Insert Date",
    onAction: (editor) => {
      // insert current date on click
      editor.insertContent(new Date().toLocaleString());
    },
    icon: "date",
  };

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_KEY}
      init={{
        height: height,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image ",
        images_upload_url: NEXT_PUBLIC_S3_UPLOADER,
        automatic_uploads: true,
        images_reuse_filename: true,
        images_upload_base_path: "",
        images_upload_handler(blobInfo, progress) {
          return new Promise((resolve) => {
            // implementation
            resolve("upload result");
          });
        },
      }}
      onLoadContent={(e) => onChange(initialValue)}
      initialValue={initialValue}
      onChange={(e) => onChange(e.target.getContent())}
    />
  );
}
