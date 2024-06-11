import React from "react";

export default function iframe({ post }) {
  return (
    <iframe
      className="h-[100%] w-full"
      src={post.gmap_link}
      style={{ border: 0 }}
      allowFullScreen={false}
      loading="lazy"
    ></iframe>
  );
}
