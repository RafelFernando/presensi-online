'use client';

import { SignInCredentials } from "@/lib/auth/action";
import { LoginButton } from "@/components/auth/button";
import ReCAPTCHA from "react-google-recaptcha";
import { useActionState, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { useFormState } from "react-dom";

export default function FormLogin() {
    const [showPassword, setShowPassword] = useState(false);

    const [state, formAction] = useFormState(
        SignInCredentials,
        null
    );

    const [recaptchaToken, setRecaptchaToken] =
        useState("");

    return (
        <form
            action={formAction}
            className="space-y-4"
        >

            {state?.message ? (
                <div
                    className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100"
                    role="alert"
                >
                    <span className="font-medium">
                        {state.message}
                    </span>
                </div>
            ) : null}

            {/* EMAIL */}
            <div>
                <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900"
                >
                    Email
                </label>

                <input
                    type="email"
                    name="email"
                    placeholder="Masukkan email..."
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
                />

                <div
                    aria-live="polite"
                    aria-atomic="true"
                >
                    <span className="text-sm text-red-500 mt-2">
                        {state?.error?.email}
                    </span>
                </div>
            </div>

            {/* PASSWORD */}
            <div>
                <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900"
                >
                    Password
                </label>

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="********"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5 pr-10"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                        aria-label={
                            showPassword
                                ? "Sembunyikan password"
                                : "Tampilkan password"
                        }
                    >
                        {showPassword ? (
                            <FaEyeSlash size={18} />
                        ) : (
                            <FaEye size={18} />
                        )}
                    </button>
                </div>

                <div
                    aria-live="polite"
                    aria-atomic="true"
                >
                    <span className="text-sm text-red-500 mt-2">
                        {state?.error?.password}
                    </span>
                </div>
            </div>

            <div className="flex justify-end text-xs">
                <Link
                    href=""
                    className="text-primary hover:underline"
                >
                    Lupa Kata Sandi?
                </Link>
            </div>

            {/* RECAPTCHA */}
            <div className="w-full flex justify-center">
                <ReCAPTCHA
                    sitekey={
                        process.env
                            .NEXT_PUBLIC_RECAPTCHA_SITE_KEY!
                    }
                    onChange={(token) => {
                        setRecaptchaToken(token || "");
                    }}
                    onExpired={() => {
                        setRecaptchaToken("");
                    }}
                />

                <input
                    type="hidden"
                    name="recaptchaToken"
                    value={recaptchaToken}
                />
            </div>
            <div
                aria-live="polite"
                aria-atomic="true"
            >
                <span className="text-sm text-red-500 mt-2">
                    {state?.error?.recaptchaToken}
                </span>
            </div>

            {/* LOGIN */}
            <LoginButton disabled={!recaptchaToken} />

        </form>
    );
}