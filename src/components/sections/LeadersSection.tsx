"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LeaderCategory, LeaderProfile } from "@/types";
import { HiUser, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useState } from "react";

interface LeaderSectionProps {
  principal: LeaderProfile & { speech: string };
  categories: LeaderCategory[];
}

export function LeadersSection({ principal, categories }: LeaderSectionProps) {
  const scrollSlider = (id: string, direction: "left" | "right") => {
    const slider = document.getElementById(id);
    if (slider) {
      const scrollAmount = slider.clientWidth * 0.8;
      slider.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="space-y-32">
      {/* Principal Leader Section - ID for scrolling */}
      <section id="message" className="scroll-mt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid gap-12 lg:grid-cols-2 items-center"
        >
          {/* Left: Large Photo */}
          <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:mx-0 overflow-hidden rounded-[40px] bg-gradient-to-br from-blue-100 to-purple-100 shadow-2xl">
            {principal.photo ? (
              <Image
                src={principal.photo}
                alt={principal.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-6 text-slate-400">
                  <HiUser className="h-40 w-40" />
                  <span className="text-lg font-medium">Administrator Photo</span>
                </div>
              </div>
            )}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />

            {/* Name Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h2 className="text-3xl font-bold">{principal.name}</h2>
              <p className="text-lg font-medium opacity-90">{principal.title}</p>
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 rounded-full bg-blue-50 px-4 py-2 text-blue-600">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500" />
              </span>
              <span className="text-sm font-bold uppercase tracking-wider">
                Administrator's Message
              </span>
            </div>
            <blockquote className="text-2xl font-medium leading-relaxed text-slate-700 lg:text-3xl">
              "{principal.speech}"
            </blockquote>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                Our commitment to the people of Woreda 9 is unwavering. We
                strive to build a community where every voice is heard, every
                child has access to quality education, and every family feels
                safe and supported.
              </p>
              <p>
                Through transparent governance and active community participation,
                we are transforming challenges into opportunities for growth and
                development.
              </p>
            </div>
            <div className="pt-4">
              <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto lg:mx-0" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Members Section */}
      <section id="members" className="space-y-16 scroll-mt-32">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-slate-900">Our Team</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Dedicated professionals working tirelessly to serve the community across various departments.
          </p>
        </div>

        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category.id} className="space-y-6">
              <div className="flex items-center gap-4 px-4">
                <div className="h-8 w-1 bg-blue-600 rounded-full" />
                <h3 className="text-2xl font-bold text-slate-900">{category.title}</h3>
              </div>

              {/* Slider Container */}
              <div className="relative group">
                {/* Navigation Buttons */}
                <button
                  onClick={() => scrollSlider(`slider-${category.id}`, "left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg text-slate-700 transition-all hover:bg-blue-50 hover:text-blue-600 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500/20 opacity-0 group-hover:opacity-100"
                  aria-label="Scroll left"
                >
                  <HiChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => scrollSlider(`slider-${category.id}`, "right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg text-slate-700 transition-all hover:bg-blue-50 hover:text-blue-600 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500/20 opacity-0 group-hover:opacity-100"
                  aria-label="Scroll right"
                >
                  <HiChevronRight className="h-6 w-6" />
                </button>

                {/* Scrollable Area */}
                <div
                  id={`slider-${category.id}`}
                  className="flex overflow-x-auto pb-8 pt-4 gap-6 px-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
                >
                  {category.leaders.map((leader, idx) => (
                    <motion.div
                      key={leader.name}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex-none w-72 snap-center"
                    >
                      <div className="group/card relative overflow-hidden rounded-3xl bg-white p-4 shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl border border-slate-100 h-full">
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100 mb-4">
                          {leader.photo ? (
                            <Image
                              src={leader.photo}
                              alt={leader.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                              <HiUser className="h-20 w-20 text-slate-300" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-blue-600/10 opacity-0 transition-opacity group-hover/card:opacity-100" />
                        </div>
                        <div className="text-center">
                          <h4 className="text-lg font-bold text-slate-900 group-hover/card:text-blue-600 transition-colors">
                            {leader.name}
                          </h4>
                          <p className="text-sm font-medium text-slate-500">
                            {leader.title}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Fade edges */}
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
