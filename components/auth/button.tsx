"use client";

import { useFormStatus } from "react-dom";
import clsx from "clsx";

export const RegisterButton = () => {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="cursor-pointer w-full bg-blue-700 text-white px-5 py-2.5 font-medium rounded-lg text-center uppercase hover:bg-blue-800 disabled:opacity-50"
        >
            {pending ? "Sedang Mendaftar..." : "Daftar"}
        </button>
    );
};

interface LoginButtonProps {
    disabled?: boolean;
}

export const LoginButton = ({
    disabled = false,
}: LoginButtonProps) => {
    const { pending } = useFormStatus();

    const isDisabled = disabled || pending;

    return (
        <button
            type="submit"
            disabled={isDisabled}
            className={clsx(
                "w-full text-white px-5 py-2.5 font-medium rounded-lg text-center uppercase transition",
                isDisabled
                    ? "opacity-50 cursor-not-allowed bg-blue-700"
                    : "cursor-pointer bg-blue-700 hover:bg-blue-800"
            )}
        >
            {pending ? "Sedang Masuk..." : "Masuk"}
        </button>
    );
};