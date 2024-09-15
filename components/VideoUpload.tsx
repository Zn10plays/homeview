import React, { ChangeEvent, FC, useState, useTransition } from "react";
import { TbVideoPlus } from "react-icons/tb";

import SpinnerMini from "./Loader";
import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/utils/helper";

interface VideoUploadProps {
  onChange: (fieldName: string, videoSrc: string) => void;
  initialVideo?: string;
}

const VideoUpload: FC<VideoUploadProps> = ({ onChange, initialVideo = "" }) => {
  const [video, setVideo] = useState(initialVideo);
  const [isLoading, startTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);
  const { edgestore } = useEdgeStore();

  const uploadVideo = (e: any, file: File) => {
    if(!file.type.startsWith("video")) return;
    setVideo(URL.createObjectURL(file));
    startTransition(async () => {
      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: initialVideo,
        },
      });

      onChange("video", res.url);
      setTimeout(() => {
        e.target.form?.requestSubmit();
      }, 1000);
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    uploadVideo(e, file);
  };

  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(false)
    uploadVideo(e, e.dataTransfer.files[0])
  }

  return (
    <label
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      htmlFor="video"
      className={cn(
        "relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 w-full h-[240px] flex flex-col justify-center items-center text-neutral-600",
        isLoading && "opacity-70",
        isDragging && "border-red-500"
      )}
    >
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-20">
          <SpinnerMini className="w-[32px] h-[32px] text-red-600" />
        </div>
      )}
      {video ? (
        <div className="absolute inset-0 w-full h-full">
          <video
            src={video}
            controls
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <>
          <TbVideoPlus className="!w-[64px] !h-[64px] mb-4" />
          <span className="font-semibold text-lg">Upload video</span>
        </>
      )}
      <input
        type="file"
        accept="video/*"
        id="video"
        className="w-0 h-0 opacity-0"
        onChange={handleChange}
        autoFocus
      />
    </label>
  );
};

export default VideoUpload;