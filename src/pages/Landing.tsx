import { useEffect, useRef } from "react";
import { books } from "../data/books";
import { Page } from "../types";
import { ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LandingCurve } from "../assets/LandingCurve";

gsap.registerPlugin(ScrollTrigger);

interface LandingProps {
  onNavigate: (page: Page) => void;
}

const featuredBooks = {
  book1: books[0],
  book2: books[2],
  book3: books[5],
  book4: books[3],
};

export default function Landing({ onNavigate }: LandingProps) {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Hero Refs
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null); // scroll lama
  const scrollIndicatorRef = useRef<HTMLDivElement>(null); // scroll baru (horizontal)

  // Content Refs
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Book Refs
  const book1Ref = useRef<HTMLImageElement>(null);
  const book2Ref = useRef<HTMLImageElement>(null);
  const book3Ref = useRef<HTMLImageElement>(null);
  const book4Ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const path = svgRef.current?.querySelector("#curve-path") as SVGPathElement;
    if (!path) return;

    // Elements that animate on page load
    const elementsOnLoad = [
      titleRef.current,
      scrollRef.current,
      scrollIndicatorRef.current, // scroll baru ikut fade in
    ].filter(Boolean);

    // Elements that animate when scrolling ends
    const elementsOnScrollEnd = [
      descRef.current,
      buttonRef.current,
      book1Ref.current,
      book2Ref.current,
      book3Ref.current,
      book4Ref.current,
    ].filter(Boolean);

    // Initial States
    gsap.set(elementsOnLoad, { opacity: 0 });
    gsap.set(elementsOnScrollEnd, { opacity: 0, y: 80 });

    // SVG Path Init
    const pathLength = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    // Animation 1: Fade-in on load
    gsap.to(elementsOnLoad, {
      opacity: 1,
      duration: 1.6,
      delay: 0.3,
      stagger: 0.2,
      ease: "power2.out",
    });

    // Animation 2: Title sticky shrink
    gsap.to(titleRef.current, {
      y: () => {
        const heroHeight = window.innerHeight;
        const titleHeight = titleRef.current?.offsetHeight || 0;
        return -(heroHeight / 2 - titleHeight / 2 - 145);
      },
      scale: 0.8,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: mainContainerRef.current,
        start: "top top",
        end: "50% top",
        scrub: 1,
      },
    });

    // Animation 3: SVG drawing
    gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: mainContainerRef.current,
        start: "top top",
        end: "50% top",
        scrub: 1.2,
      },
    });

    // Animation 4: Content reveal
    gsap.to(elementsOnScrollEnd, {
      opacity: 1,
      y: 0,
      stagger: 0.12,
      ease: "power2.out",
      duration: 1.2,
      scrollTrigger: {
        trigger: contentContainerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    // Animation 5: Old scroll indicator fade
    gsap.to(scrollRef.current, {
      opacity: 0,
      y: -20,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: mainContainerRef.current,
        start: "top top",
        end: "top top-=100",
        scrub: true,
      },
    });

    // Animation 6: NEW SCROLL INDICATOR SLIDE + FADE
    gsap.to(scrollIndicatorRef.current, {
      y: -40,
      opacity: 0,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: mainContainerRef.current,
        start: "top top",
        end: "30% top",
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div
      ref={mainContainerRef}
      className="min-h-[200vh] bg-white text-black relative"
    >
      {/* HERO SECTION */}
      <div className="h-[150vh] sticky top-0 flex items-center justify-center overflow-hidden">
        <LandingCurve ref={svgRef} />

        <div className="relative z-40 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center min-h-screen">
          <div className="w-full block">
            {/* TITLE */}
            <h1
              ref={titleRef}
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight max-w-2xl"
            >
              One Stop Digital
              <span className="block mt-1">Library</span>
              <span className="block mt-1">for Creatives.</span>
            </h1>

            {/* NEW SCROLL INDICATOR (HORIZONTAL) */}
            <div
              ref={scrollIndicatorRef}
              className="flex items-center gap-2 mt-6 text-gray-700 text-lg sm:text-xl md:text-2xl font-medium"
            >
              <span>Scroll Down</span>
              <ChevronDown className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div
        ref={contentContainerRef}
        className="relative z-20 bg-white pt-16 sm:pt-20 lg:pt-36 pb-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Description */}
          <div className="max-w-2xl mx-auto text-center mb-16 lg:mb-24">
            <p
              ref={descRef}
              className="text-xl sm:text-2xl lg:text-3xl text-gray-800 mb-8 leading-relaxed"
            >
              Digital library of books chosen by creatives for creatives.
            </p>
            <button
              ref={buttonRef}
              className="cursor-pointer rounded-full px-12 py-4 font-bold border-2 
                         border-gray-900 bg-white text-gray-900 
                         hover:bg-gray-900 hover:border-gray-900 hover:text-white"
              onClick={() => onNavigate("home")}
            >
              View Collection
            </button>
          </div>

          {/* Books */}
          <div className="grid grid-cols-12 gap-6 lg:gap-12 items-center">
            <div ref={book1Ref} className="col-span-6 sm:col-span-4 lg:col-span-3">
              <img
                src={featuredBooks.book1.cover}
                className="w-full shadow-2xl rounded-lg transform -rotate-3 hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-300"
                alt={featuredBooks.book1.title}
              />
            </div>

            <div ref={book2Ref} className="col-span-6 sm:col-span-4 lg:col-span-3">
              <img
                src={featuredBooks.book2.cover}
                className="w-full shadow-2xl rounded-lg transform rotate-2 hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-300"
                alt={featuredBooks.book2.title}
              />
            </div>

            <div ref={book3Ref} className="col-span-6 sm:col-span-4 lg:col-span-3">
              <img
                src={featuredBooks.book3.cover}
                className="w-full shadow-2xl rounded-lg transform rotate-4 hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-300"
                alt={featuredBooks.book3.title}
              />
            </div>

            <div ref={book4Ref} className="col-span-6 sm:col-span-4 lg:col-span-3">
              <img
                src={featuredBooks.book4.cover}
                className="w-full shadow-2xl rounded-lg transform -rotate-2 hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-300"
                alt={featuredBooks.book4.title}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
