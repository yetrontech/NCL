"use client";

import { useEffect, useRef, useState } from "react";
import {
  LOCATION_GALLERIES,
  type LocationGalleryId,
} from "@/lib/location-galleries";

export default function LocationGalleryModal({
  galleryId,
  onClose,
}: {
  galleryId: LocationGalleryId | null;
  onClose: () => void;
}) {
  const gallery = galleryId ? LOCATION_GALLERIES[galleryId] : null;
  const open = Boolean(gallery);
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const photoCount = gallery?.photos.length ?? 0;
  const photo = gallery?.photos[index];

  useEffect(() => {
    setIndex(0);
  }, [galleryId]);

  useEffect(() => {
    if (!gallery) return;

    const next = gallery.photos[(index + 1) % gallery.photos.length];
    const preload = new Image();
    preload.src = next.src;
  }, [gallery, index]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.body.classList.toggle("gallery-open", open);
    const onKeyDown = (event: KeyboardEvent) => {
      if (!open) return;
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") {
        setIndex((current) => (current + 1) % photoCount);
      }
      if (event.key === "ArrowLeft") {
        setIndex((current) => (current - 1 + photoCount) % photoCount);
      }
    };
    if (open) document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("gallery-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, photoCount]);

  if (!gallery || !photo) return null;

  function goTo(nextIndex: number) {
    setIndex((nextIndex + photoCount) % photoCount);
  }

  return (
    <div
      className="gallery-modal open"
      role="dialog"
      aria-modal="true"
      aria-label={`${gallery.name} photo tour`}
    >
      <div className="gallery-modal-backdrop" onClick={onClose}></div>
      <div className="gallery-modal-dialog">
        <p className="gallery-modal-kicker">Interior tour</p>
        <h3 className="gallery-modal-title">{gallery.name}</h3>
        <button
          className="gallery-modal-close"
          type="button"
          aria-label="Close photo tour"
          onClick={onClose}
        >
          &times;
        </button>

        <div
          className="gallery-stage"
          onTouchStart={(event) => {
            touchStartX.current = event.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const start = touchStartX.current;
            const end = event.changedTouches[0]?.clientX;
            touchStartX.current = null;
            if (start == null || end == null) return;
            const delta = end - start;
            if (delta < -40) goTo(index + 1);
            if (delta > 40) goTo(index - 1);
          }}
        >
          <img key={photo.src} src={photo.src} alt={photo.alt} />
          {photoCount > 1 ? (
            <>
              <button
                className="gallery-nav gallery-nav-prev"
                type="button"
                aria-label="Previous photo"
                onClick={() => goTo(index - 1)}
              >
                ‹
              </button>
              <button
                className="gallery-nav gallery-nav-next"
                type="button"
                aria-label="Next photo"
                onClick={() => goTo(index + 1)}
              >
                ›
              </button>
            </>
          ) : null}
        </div>

        <div className="gallery-meta">
          <p className="gallery-caption">{photo.caption}</p>
          <p className="gallery-count">
            {index + 1} / {photoCount}
          </p>
        </div>

        <div className="gallery-dots" role="tablist" aria-label="Photo slides">
          {gallery.photos.map((item, photoIndex) => (
            <button
              key={item.src}
              type="button"
              role="tab"
              aria-selected={photoIndex === index}
              aria-label={`Show ${item.caption}`}
              className={`gallery-dot${photoIndex === index ? " active" : ""}`}
              onClick={() => setIndex(photoIndex)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
