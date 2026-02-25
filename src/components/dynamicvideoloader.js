import React, { useState, useEffect } from 'react';

//fragments can be used to alter playback times by using #t=10,20 where 10 is the seconds to start at and 20 is the second to stop
const DynamicVideoLoader = ({ videoName, loop=true, muted=true, autoPlay=true, fragment=''}) => {
  const [videoSrc, setVideoSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dynamically import the video based on its name
    const loadVideo = async () => {
      try {
        // NOTE: Dynamic imports with variables may require specific webpack configuration.
        // The path must be partially static so webpack can resolve the context.
        // This example assumes videos are in 'src/assets/videos'
        const videoModule = await import(`/public/videos/${videoName}.mp4`);
        setVideoSrc(videoModule.default);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load video:", error);
        setIsLoading(false);
      }
    };

    loadVideo();
  }, [videoName]); // Re-run effect if videoName changes

  if (isLoading) {
    return <div className="video-loader">Loading Video...</div>; // A simple loader
  }

  if (!videoSrc) {
    return <div className="video-error">Video not found.</div>;
  }

  return (
    <div className="video-background">
        <video src={videoSrc + fragment} loop={loop} muted={muted} autoPlay={autoPlay}></video>
        {/* <video controls width="100%">
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
        </video> */}
    </div>
  );
};

export default DynamicVideoLoader;
