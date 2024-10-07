"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-6">
          <h1
            className={`max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white transition-all duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          >
            Upload and score your thumbnails
          </h1>
          <p
            className={`max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400 transition-all duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          >
            See how your thumbnails perform and get feedback from the community.
          </p>
          <div
            className={`transition-all duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          >
            <div className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
              Get started
              <svg
                className="w-5 h-5 ml-2 -mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <Link
              href="/create"
              scroll={true}
              className="cursor-pointer text-primary inline-flex items-center justify-center px-5 py-3 font-medium text-center border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-300 dark:hover:text-background dark:focus:ring-gray-800"
            >
              Create a Test
            </Link>
          </div>
        </div>
        <div className="lg:col-span-6 lg:flex mt-12 lg:mt-0">
          <div className="w-full relative">
            <Image
              className="rounded-lg object-cover skew-y-3"
              src="/landing.png"
              alt="mockup"
              width={700}
              height={500}
              priority
            />
            <div className="absolute -bottom-4 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent blur-xl transform -skew-y-3"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
