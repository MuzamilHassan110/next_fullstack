'use client'
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const images = [
    "/image1.png",
    "/image2.jpg",
    "/image3.jpg",
    "/image4.jpg",
    "/image5.jpg",
  ];

  const containerRef = useRef(null);

  useEffect(() => {
    // Register the ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;

    // Create the animation
    gsap.to(container, {
      yPercent: -100 * (images.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: `+=${window.innerHeight * images.length}`,
        scrub: true,
        pin: true,
      },
    });
  }, [images]);

  return (
    <div className="flex h-screen">
      {/* Left Side: Static Content */}
      

      {/* Right Side: Scrollable Images */}
      <div className="w-1/3 h-full overflow-hidden bg-white">
        <div ref={containerRef} className="relative">
          {images.map((src, index) => (
            <div
              key={index}
              className="h-screen flex justify-center items-center"
            >
              <img src={src} alt={`Image ${index + 1}`} className="h-auto max-w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
