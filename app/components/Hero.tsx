"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1 }
    );
  }, []);

  return (
    <h1
      ref={titleRef}
      className="text-4xl font-bold text-green-700"
    >
      Rwanda Agri Hub 🌱
    </h1>
  );
}
