"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  EVENTS_INSTAGRAM,
  getGalleryMedia,
  getGalleryPhotos,
} from "@/lib/events-gallery";

interface EventsMediaGalleryProps {
  primary: string;
  accent: string;
}

export function EventsMediaGallery({ primary, accent }: EventsMediaGalleryProps) {
  const videos = getGalleryMedia();
  const photos = getGalleryPhotos();
  const [activeVideo, setActiveVideo] = useState<(typeof videos)[0] | null>(null);

  return (
    <section id="gallery" className="relative border-t border-white/[0.06] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-[10px] tracking-[0.45em] uppercase" style={{ color: accent }}>
          Real Work
        </p>
        <h2 className="mt-4 text-center font-[family-name:var(--font-playfair)] text-3xl font-light text-white md:text-5xl">
          From Our Instagram
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-white/40">
          Photos and videos from{" "}
          <a
            href={EVENTS_INSTAGRAM.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-white/20 underline-offset-4 hover:text-white/70"
          >
            {EVENTS_INSTAGRAM.handle}
          </a>{" "}
          — birthdays, flash mobs, decorations, and surprise moments in Amalapuram.
        </p>

        {/* Video reels */}
        <div className="mt-14">
          <h3 className="mb-6 text-center text-xs tracking-[0.3em] uppercase text-white/35">Videos</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((item, i) => (
              <motion.button
                key={item.shortcode}
                type="button"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActiveVideo(item)}
                className="group relative aspect-[9/16] max-h-[420px] overflow-hidden rounded-2xl border border-white/[0.08] text-left"
              >
                {item.poster ? (
                  <Image
                    src={item.poster}
                    alt={item.label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 320px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-purple-950/40" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/40 backdrop-blur-sm transition-transform group-hover:scale-110"
                    style={{ color: accent }}
                  >
                    ▶
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-[10px] tracking-wider uppercase text-white/50">{item.package}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-white/90">{item.label}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Photo grid */}
        <div className="mt-16">
          <h3 className="mb-6 text-center text-xs tracking-[0.3em] uppercase text-white/35">Photos</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((item, i) => (
              <motion.a
                key={`${item.shortcode}-${i}`}
                href={item.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 8) * 0.04 }}
                className="group relative aspect-square overflow-hidden rounded-xl border border-white/[0.06]"
              >
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 240px"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Video lightbox */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={activeVideo.src}
                poster={activeVideo.poster}
                controls
                autoPlay
                playsInline
                className="max-h-[80vh] w-full rounded-2xl bg-black"
              />
              <p className="mt-4 text-center text-sm text-white/70">{activeVideo.label}</p>
              <a
                href={activeVideo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-center text-xs tracking-wider uppercase"
                style={{ color: accent }}
              >
                View on Instagram →
              </a>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm"
                aria-label="Close video"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
