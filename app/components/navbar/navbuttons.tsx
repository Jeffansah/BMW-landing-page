"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";

import { navbuttons } from "@/data/navbuttons";
import Link from "next/link";

const NavButtons = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverRect, setHoverRect] = useState({
    width: 0,
    height: 0,
    x: 0,
  });
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  // Set initial position for the first button
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

  return (
    <div
      ref={navRef}
      className="relative flex items-center gap-7 text-white"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {navbuttons.map((button, index) => (
        <div
          key={index}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          onMouseEnter={() => handleMouseEnter(index)}
          className="cursor-pointer"
        >
          <Link href={`/${button.name}`}>
            <button.component size={20} color="white" weight="regular" />
          </Link>
        </div>
      ))}

      <motion.div
        className="absolute -bottom-[30px] h-0.5 bg-white"
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

export default NavButtons;
