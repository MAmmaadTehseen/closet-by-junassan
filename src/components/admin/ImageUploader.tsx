"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, ImageIcon, Loader2, GripVertical } from "lucide-react";
import { uploadProductImage } from "@/lib/admin-actions";

interface ImgEntry {
  uid: string;   // stable client-side key
  url: string;   // public URL once uploaded
  preview: string; // local object URL while uploading
  status: "uploading" | "done" | "error";
  error?: string;
}

const MAX = 5;
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

export default function ImageUploader({ initialImages = [] }: { initialImages?: string[] }) {
  const [images, setImages] = useState<ImgEntry[]>(() =>
    initialImages.map((url) => ({
      uid: url,
      url,
      preview: url,
      status: "done",
    })),
  );
  const [dragging, setDragging] = useState(false);
  const [dragUid, setDragUid] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reorder = (fromUid: string, toUid: string) => {
    if (fromUid === toUid) return;
    setImages((prev) => {
      const fromIdx = prev.findIndex((i) => i.uid === fromUid);
      const toIdx = prev.findIndex((i) => i.uid === toUid);
      if (fromIdx < 0 || toIdx < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  };

  const update = (uid: string, patch: Partial<ImgEntry>) =>
    setImages((prev) => prev.map((img) => (img.uid === uid ? { ...img, ...patch } : img)));

  const remove = (uid: string) =>
    setImages((prev) => prev.filter((img) => img.uid !== uid));

  const processFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      const slots = MAX - images.filter((i) => i.status !== "error").length;
      const toUpload = Array.from(files).slice(0, slots);

      for (const file of toUpload) {
        const uid     = crypto.randomUUID();
        const preview = URL.createObjectURL(file);

        setImages((prev) => [
          ...prev,
          { uid, url: "", preview, status: "uploading" },
        ]);

        const fd = new FormData();
        fd.append("file", file);

        const result = await uploadProductImage(fd);

        if ("url" in result) {
          URL.revokeObjectURL(preview);
          update(uid, { url: result.url, preview: result.url, status: "done" });
        } else {
          update(uid, { status: "error", error: result.error });
        }
      }
    },
    [images],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    processFiles(e.target.files);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const doneImages = images.filter((i) => i.status === "done");

  return (
    <div className="space-y-3">
      {/* Hidden inputs — consumed by the server action form */}
      {doneImages.map((img, i) => (
        <input key={img.uid} type="hidden" name={`image_${i}`} value={img.url} />
      ))}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {images.map((img, i) => (
            <div
              key={img.uid}
              draggable={img.status === "done"}
              onDragStart={() => setDragUid(img.uid)}
              onDragOver={(e) => {
                if (dragUid && dragUid !== img.uid) e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragUid) reorder(dragUid, img.uid);
                setDragUid(null);
              }}
              onDragEnd={() => setDragUid(null)}
              className={`relative aspect-square overflow-hidden rounded-xl border border-border bg-cream ${
                img.status === "done" ? "cursor-grab active:cursor-grabbing" : ""
              } ${dragUid === img.uid ? "opacity-50" : ""}`}
            >
              {img.status === "uploading" ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-cream">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Uploading
                  </span>
                </div>
              ) : img.status === "error" ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-red-50 p-2">
                  <ImageIcon className="h-4 w-4 text-red-400" />
                  <span className="text-center text-[9px] text-red-600">{img.error}</span>
                </div>
              ) : (
                <Image src={img.preview} alt="" fill sizes="120px" className="object-cover" />
              )}

              {/* Cover badge */}
              {i === 0 && img.status === "done" && (
                <span className="absolute bottom-1 left-1 rounded bg-ink/70 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-paper">
                  Cover
                </span>
              )}

              {/* Drag handle */}
              {img.status === "done" && (
                <span className="pointer-events-none absolute bottom-1 right-1 rounded bg-ink/40 p-0.5 text-paper">
                  <GripVertical className="h-3 w-3" />
                </span>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => remove(img.uid)}
                className="absolute right-1 top-1 rounded-full bg-ink/70 p-0.5 text-paper transition hover:bg-ink"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {images.filter((i) => i.status !== "error").length < MAX && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition ${
            dragging
              ? "border-ink bg-ink/5"
              : "border-border bg-cream/40 hover:border-ink hover:bg-cream"
          }`}
        >
          <Upload className="h-6 w-6 text-muted-foreground" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Click to upload or drag &amp; drop
          </p>
          <p className="text-[11px] text-muted-foreground">
            JPEG · PNG · WebP · GIF · max 5 MB each · up to {MAX} images
          </p>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        onChange={onInputChange}
      />

      <p className="text-[11px] text-muted-foreground">
        {doneImages.length} / {MAX} uploaded
        {doneImages.length > 1 && <span className="ml-1">· Drag to reorder — first image is the cover</span>}
        {doneImages.length === 0 && (
          <span className="ml-1 text-accent-red">· At least 1 image required</span>
        )}
      </p>
    </div>
  );
}
