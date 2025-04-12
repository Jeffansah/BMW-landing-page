"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

const VideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Try to play immediately
    video.play().catch(() => {
      console.log("Initial autoplay failed, will try with HLS");
    });

    if (Hls.isSupported()) {
      const hls = new Hls({
        // Add configuration options to improve reliability
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        maxBufferSize: 60 * 1000 * 1000, // 60MB
        maxBufferHole: 0.5,
        lowLatencyMode: true,
        backBufferLength: 90,
        enableWorker: true,
        // Add error recovery options
        debug: false,
        // Increase the number of retries
        maxLoadingDelay: 10,
        // Increase the retry delay
        manifestLoadingTimeOut: 20000,
        manifestLoadingMaxRetry: 10,
        levelLoadingTimeOut: 20000,
        levelLoadingMaxRetry: 10,
        fragLoadingTimeOut: 20000,
        fragLoadingMaxRetry: 10,
      });

      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      // Handle errors and recovery
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log("Network error, trying to recover...");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("Media error, trying to recover...");
              hls.recoverMediaError();
              break;
            default:
              console.error("Fatal error, cannot recover:", data);
              hls.destroy();
              break;
          }
        }
      });

      // Add event listeners for stream issues
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Try to play again after manifest is loaded
        video.play().catch((err) => {
          console.error("HLS autoplay failed:", err);
        });
      });

      // Add event listeners for stream stalls
      video.addEventListener("stalled", () => {
        console.log("Video stalled, attempting to recover...");
        hls.startLoad();
      });

      video.addEventListener("waiting", () => {
        console.log("Video waiting for data...");
      });

      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((err) => {
          console.error("Safari autoplay failed:", err);
        });
      });

      // Add event listeners for Safari
      video.addEventListener("stalled", () => {
        console.log("Safari video stalled, reloading...");
        video.load();
      });
    }
  }, [src]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        position: "relative",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "cover",
        }}
      />
    </div>
  );
};

export default VideoPlayer;
