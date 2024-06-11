"use client";
import React, { useState } from "react";
import IframeModal from "../components/widgets/iframe_views";
import Image from "next/image";
import mapImage from "@/public/images/map.png";

export default function MapModel({ post }) {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Image
        onClick={openModal}
        src={mapImage}
        alt={`${post.title} location map direction view - ${post.address}`}
        title={`${post.title} location map direction view - ${post.address}`}
        style={{ width: "100%", height: "100%" }}
        width={500}
        height={200}
        className="h-full w-full rounded-sm object-cover"
        loading="lazy"
      />
      <IframeModal
        isOpen={modalOpen}
        onClose={closeModal}
        iframeUrl={post.gmap_link}
      />
    </>
  );
}
