"use client";

import { useFormStatus } from "react-dom";
import clsx from "clsx";
import { useTopLoader } from "nextjs-toploader";
import { useEffect } from "react";

export const RegisterButton = () => {
  const { pending } = useFormStatus();
  const { start, done } = useTopLoader();

  useEffect(() => {
    if (pending) {
      start();
    } else {
      done();
    }

    return () => {
      // Pastikan loader berhenti kalau komponen unmount saat pending
      if (pending) done();
    };
  }, [pending, start, done]);

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="w-full cursor-pointer rounded-lg bg-blue-700 px-5 py-2.5 text-center font-medium uppercase text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Sedang Mendaftar..." : "Daftar"}
    </button>
  );
};

interface LoginButtonProps {
  disabled?: boolean;
}

export const LoginButton = ({ disabled = false }: LoginButtonProps) => {
  const { pending } = useFormStatus();
  const { start, done } = useTopLoader();

  useEffect(() => {
    if (pending) {
      start();
    } else {
      done();
    }

    return () => {
      if (pending) done();
    };
  }, [pending, start, done]);

  const isDisabled = disabled || pending;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      aria-busy={pending}
      className={clsx(
        "w-full rounded-lg px-5 py-2.5 text-center font-medium uppercase text-white transition",
        isDisabled
          ? "cursor-not-allowed bg-blue-700 opacity-50"
          : "cursor-pointer bg-blue-700 hover:bg-blue-800"
      )}
    >
      {pending ? "Sedang Masuk..." : "Masuk"}
    </button>
  );
};