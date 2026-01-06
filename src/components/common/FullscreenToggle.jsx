import { useEffect, useState } from "react";

import {Maximize, Minimize} from "lucide-react";

const FullscreenToggle = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
  
    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  return (
    <button
      onClick={toggleFullscreen}
      className="hidden lg:flex items-center justify-center p-2 rounded-md
                 hover:bg-gray-200 transition"
      title={isFullscreen ? "Exit Fullscreen (F11)" : "Enter Fullscreen (F11)"}
    >
      {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
    </button>
  );
};

export default FullscreenToggle;
