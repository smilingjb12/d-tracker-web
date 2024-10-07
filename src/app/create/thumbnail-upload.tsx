import { UploadFileResponse } from "@/components/upload-zone/upload-files";
import { UploadZone } from "@/components/upload-zone/upload-zone";
import { nextEnv } from "@/nextEnv";
import clsx from "clsx";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface ThumbnailUploadProps {
  title: string;
  imageId: string;
  onUploadComplete: (uploaded: UploadFileResponse[]) => void;
  showUpload: boolean;
  error?: string;
  className?: string;
}

export function ThumbnailUpload({
  title,
  imageId,
  onUploadComplete,
  showUpload,
  error,
  className,
}: ThumbnailUploadProps) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const alreadyUploaded = !!imageId;
  const imageUrl = useQuery(
    api.files.getFileUrl,
    imageId
      ? {
          fileId: imageId as Id<"_storage">,
        }
      : "skip"
  )!;

  return (
    <div
      className={clsx(
        "flex flex-col gap-4 border border-1 rounded-sm p-2 overflow-hidden relative h-[350px] w-[350px]",
        error ? "border-red-400" : "border-transparent",
        className
      )}
    >
      <h2 className="text-2xl font-bold text-center">{title}</h2>
      {imageId && (
        <div className="relative w-full h-full">
          <Image
            className="object-cover"
            fill
            alt={`Image ${title}`}
            src={imageUrl}
          />
        </div>
      )}
      {showUpload && !alreadyUploaded && (
        <div className="flex justify-center">
          <UploadZone
            uploadImmediately
            maxFileSizeInBytes={Number(nextEnv.NEXT_PUBLIC_UPLOAD_SIZE_LIMIT)}
            uploadUrl={generateUploadUrl}
            fileTypes={{
              "image/*": [".png", ".jpeg", ".jpg"],
            }}
            onUploadComplete={onUploadComplete}
            onUploadError={(error: unknown) => {
              console.error(error);
            }}
          />
        </div>
      )}

      {error && <div className="text-red-400">{error}</div>}
    </div>
  );
}
