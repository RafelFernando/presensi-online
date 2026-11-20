"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import clsx from "clsx";
import AOS from "aos";
import "aos/dist/aos.css";

export default function NavbarClient({ session }: any) {
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    AOS.init();
  }, []);

  if (!session) return null;

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/bgn-logo.png"
              alt="Logo"
              width={800}
              height={800}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* DESKTOP: avatar + sign out */}
          <div className="hidden items-center gap-4 md:flex">
            <div className="overflow-hidden rounded-full border border-gray-200">
              <Image
                src={session.user.image || "/avatar.svg"}
                width={32}
                height={32}
                alt="avatar"
                className="h-8 w-8 rounded-full object-cover"
              />
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">
                Login as {session.user.role}
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {session.user.name}
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#193F7A]"
            >
              Sign Out
            </button>
          </div>

          {/* MOBILE: hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <IoClose className="h-7 w-7" />
            ) : (
              <IoMenu className="h-7 w-7" />
            )}
          </button>
        </div>

        {/* MOBILE MENU PANEL */}
        <div
          className={clsx(
            "overflow-hidden border-t border-gray-100 bg-white transition-all duration-300 md:hidden",
            menuOpen ? "max-h-96" : "max-h-0"
          )}
        >
          <div className="space-y-3 px-4 py-4">
            {/* Profil */}
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <div className="overflow-hidden rounded-full border border-gray-200">
                <Image
                  src={session.user.image || "/avatar.svg"}
                  width={40}
                  height={40}
                  alt="avatar"
                  className="h-10 w-10 rounded-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {session.user.name}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {session.user.email}
                </p>
              </div>
            </div>

            {/* Sign Out */}
            <button
              onClick={() => {
                setMenuOpen(false);
                setShowModal(true);
              }}
              className="w-full rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* MODAL SIGN OUT */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
            {/* Icon */}
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-red-100 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                  />
                </svg>
              </div>
            </div>

            {/* Text */}
            <h3 className="mb-2 text-center text-xl font-bold text-gray-800">
              Konfirmasi Sign Out
            </h3>
            <p className="mb-6 text-center text-sm text-gray-500">
              Apakah Anda yakin ingin keluar dari akun ini?
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex-1 rounded-lg bg-blue-500 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}