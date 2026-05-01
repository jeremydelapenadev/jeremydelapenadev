import React, { useEffect, useRef } from "react";
import { spaces } from "../assets/data"; // import your spaces array
import "../assets/css/ImageScroller.css"; // import CSS for styling

export default function ImageScroller() {
  const scrollRef = useRef();

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let animationFrame;

    const scroll = () => {
      if (scrollContainer) {
        scrollContainer.scrollLeft += 1; // adjust speed
        // reset to start when reaching the end
        if (
          scrollContainer.scrollLeft >=
          scrollContainer.scrollWidth - scrollContainer.clientWidth
        ) {
          scrollContainer.scrollLeft = 0;
        }
        animationFrame = requestAnimationFrame(scroll);
      }
    };

    animationFrame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="scroll-wrapper" ref={scrollRef}>
      {spaces.map((space) => (
        <img
          key={space.id}
          src={space.image}
          alt={space.name}
          className="scroll-img"
        />
      ))}
    </div>
  );
}
