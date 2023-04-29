// withBackgroundSlider.tsx
import React, { useEffect, useRef } from "react";

const bgImageArray = [
  "paper.jpg",
];

const StaticBackground: React.FC = () => {
  const base = "/backgrounds/";
  const secs = 100;
  const containerRef = useRef<HTMLDivElement>(null);

  // cache images
  useEffect(() => {
    bgImageArray.forEach((image) => {
      new Image().src = base + image;
    });
  }, []);

  useEffect(() => {
    function backgroundSequence() {
      let k = 0;
      for (let i = 0; i < bgImageArray.length; i++) {
        setTimeout(function() {
          if (containerRef.current) {
            containerRef.current.style.background = "url(" + base + bgImageArray[k] + ") no-repeat center center fixed";
            containerRef.current.style.backgroundSize = "cover";
          }
          if ((k + 1) === bgImageArray.length) {
            setTimeout(function() {
              backgroundSequence();
            }, (secs * 1000));
          } else {
            k++;
          }
        }, (secs * 1000) * i);
      }
    }

    backgroundSequence();
  }, []);

  return (
    <div
      ref={containerRef}
      className="background-static fixed inset-0 z-[-1]"
    />
  );
};

export default StaticBackground;
