"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { navlinks } from "@/data/navbar-data";

const Navlinks = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverRect, setHoverRect] = useState({
    width: 0,
    height: 0,
    x: 0,
  });
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const updateHoverRect = (index: number | null) => {
    if (index === null || !itemRefs.current[index]) return;

    const element = itemRefs.current[index];
    if (!element || !navRef.current) return;

    const navRect = navRef.current.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    setHoverRect({
      width: elementRect.width,
      height: 2,
      x: elementRect.left - navRect.left,
    });
  };

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
    updateHoverRect(index);
  };

  // Set initial position for the first link
  useEffect(() => {
    if (itemRefs.current[0] && navRef.current) {
      const element = itemRefs.current[0];
      const navRect = navRef.current.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      setHoverRect({
        width: elementRect.width,
        height: 2,
        x: elementRect.left - navRect.left,
      });
    }
  }, []);

  // Update active index based on current path
  useEffect(() => {
    const path = window.location.pathname;
    const index = navlinks.findIndex((item) => `/${item.slug}` === path);
    if (index !== -1) {
      setActiveIndex(index);
      updateHoverRect(index);
    }
  }, []);

  return (
    <div
      ref={navRef}
      className="relative flex items-center gap-7 text-white"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {navlinks.map((link, index) => (
        <Link
          href={`/${link.slug}`}
          key={link.slug}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          className="relative text-white"
          onMouseEnter={() => handleMouseEnter(index)}
          onClick={() => setActiveIndex(index)}
        >
          <p>{link.name}</p>
        </Link>
      ))}

      <motion.div
        className="absolute -bottom-[15.5px] h-0.5 bg-white"
        initial={{
          width: hoverRect.width,
          x: hoverRect.x,
          opacity: 0,
        }}
        animate={{
          width: hoverRect.width,
          x: hoverRect.x,
          opacity: hoveredIndex !== null ? 1 : 0,
        }}
        transition={{
          type: "tween",
          duration: 0.4,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default Navlinks;
