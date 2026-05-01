import React, { useEffect, useRef, useState } from "react";
import "../assets/css/ImageScroller.css";

export default function ImageScroller() {
  const scrollRef = useRef(null);
  const [spaces, setSpaces] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/spaces")
      .then((res) => res.json())
      .then((data) => {
        console.log("API response:", data);
        setSpaces(data.data || []);
      })
      .catch((err) => console.error("Error fetching spaces:", err));
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || spaces.length === 0) return;

    let animationFrame;

    const scroll = () => {
      scrollContainer.scrollLeft += 1;

      if (
        scrollContainer.scrollLeft >=
        scrollContainer.scrollWidth - scrollContainer.clientWidth
      ) {
        scrollContainer.scrollLeft = 0;
      }

      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrame);
  }, [spaces]);

  return (
    <div className="scroll-wrapper">
      <div className="scroll-track">
        {[...spaces, ...spaces].map((space, index) => (
          <img key={index} src={space.image_url} alt={space.name} />
        ))}
      </div>
    </div>
  );
}
