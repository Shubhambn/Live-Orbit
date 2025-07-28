"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaRegCalendar, FaBars, FaTimes } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { RxDividerVertical } from "react-icons/rx";
import clsx from "clsx";
import Image from "next/image";
import { useAuthStore } from "@/Features/auth/store/useAuthStore";
import { navConfig } from "@/Features/auth/config/navconfig";
import { useAuth } from "@/Features/auth/hooks/useAuth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const userRole = useAuthStore(
    (state) => state.role
  ) as keyof typeof navConfig;
  const navItemsi = navConfig[userRole];
  const { fullName, role, isLoggedIn } = useAuth(); // get the user from the store once authed in.
  const logout = useAuthStore((state) => state.logout);
  return (
    <>
      <nav className="w-full py-4 px-4 shadow-md bg-white flex justify-between items-center relative z-30">
        {/* Logo and Title */}
        <Link href="/" className="flex  space-x-3">
          <section>
            <Image
              src="/assets/logo.svg"
              alt="App Logo"
              width={160}
              height={80}
              className="object-contain p-1"
            />
            <p className="text-gray-600 text-sm mt-[-2dvh]">
              Patient Progress Tracking
            </p>
          </section>
        </Link>

        {/* Date Display (Desktop Only) */}
        <div className="hidden sm:flex items-center space-x-2 text-gray-700">
          <FaRegCalendar />
          <p className="text-sm md:text-base">{date}</p>
        </div>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center space-x-3">
          {navItemsi.map(({ path, label }) => (
            <Link
              key={path}
              href={path}
              className={clsx(
                "rounded px-3 py-1 text-sm transition",
                pathname === path
                  ? "bg-accentMain text-white font-semibold"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              )}
            >
              {label}
            </Link>
          ))}
          {isLoggedIn && (
            <section className="flex justify-center items-center space-x-2">
              <RxDividerVertical className="size-6" />
              <FiUser />
              <p className="text-accentMain ">
                {fullName} ({role}){" "}
              </p>
              <IoLogOutOutline className="size-6" onClick={() => logout()} />
            </section>
          )}
        </div>

        {/* Hamburger for Mobile */}
        <FaBars
          className="sm:hidden text-2xl text-gray-800 cursor-pointer"
          onClick={() => setIsOpen(true)}
        />
      </nav>

      {/* Overlay and Mobile Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-opacity-40 z-20"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-0 right-0 w-3/4 sm:hidden h-full bg-[#253237] text-white p-6 z-30 shadow-lg flex flex-col justify-between">
            {/* Top: Date and Menu */}
            <div>
              <p className="text-sm text-center mb-4 md:text-base">{date}</p>

              {/* menu header */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg text-accentMain font-bold tracking-wide">
                  Menu
                </h2>
                <FaTimes
                  className="text-2xl text-accentMain cursor-pointer"
                  onClick={() => setIsOpen(false)}
                />
              </div>

              {/* nav items */}
              <nav className="flex flex-col space-y-5 text-base">
                {navItemsi.map(({ path, label }) => (
                  <Link
                    key={path}
                    href={path}
                    onClick={() => setIsOpen(false)}
                    className={clsx(
                      "transition duration-150 pb-1",
                      pathname === path
                        ? "text-white font-semibold border-b-2 border-accentMain"
                        : "text-white hover:text-accentMain"
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Bottom: User Info & Logout */}
            <div className="border-t border-gray-600 pt-4 mt-6 text-sm ">
              <p className="mb-1">{fullName}</p>
              <p className="text-accentMain font-medium mb-3">{userRole}</p>
              {isLoggedIn && (
                <button
                  onClick={() => logout()}
                  className="bg-accentMain text-white px-4 py-2 rounded hover:bg-opacity-80 transition"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
