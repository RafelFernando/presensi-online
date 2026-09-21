'use client';
import Link from "next/link";
import { SignUpCredentials } from "@/lib/auth/action";
import { useFormState } from "react-dom";
import { RegisterButton } from "@/components/auth/button";
import { useActionState, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function FormRegister() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [state, formAction] = useFormState(SignUpCredentials, null);
    return (
        <form action={formAction} className="space-y-6">
            {state?.message ? (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100" role="alert">
                    <span className="font-medium">{state?.message}</span>
                </div>
            ) : null}

            <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                <input type="text" name="name" placeholder="John Doe" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5 " />
                <div aria-live="polite" aria-atomic="true">
                    <span className="text-sm text-red-500 mt-2">{state?.error?.name}</span>
                </div>
            </div>
            <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                <input type="email" name="email" placeholder="JohnDoe@gmail.com" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5 " />
                <div aria-live="polite" aria-atomic="true">
                    <span className="text-sm text-red-500 mt-2">{state?.error?.email}</span>
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

                <div aria-live="polite" aria-atomic="true">
                    <span className="text-sm text-red-500 mt-2">
                        {state?.error?.password}
                    </span>
                </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
                <label
                    htmlFor="confirmPassword"
                    className="block mb-2 text-sm font-medium text-gray-900"
                >
                    Confirm Password
                </label>

                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="********"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5 pr-10"
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                        aria-label={
                            showConfirmPassword
                                ? "Sembunyikan confirm password"
                                : "Tampilkan confirm password"
                        }
                    >
                        {showConfirmPassword ? (
                            <FaEyeSlash size={18} />
                        ) : (
                            <FaEye size={18} />
                        )}
                    </button>
                </div>

                <div aria-live="polite" aria-atomic="true">
                    <span className="text-sm text-red-500 mt-2">
                        {state?.error?.confirmPassword}
                    </span>
                </div>
            </div>

            <RegisterButton />

            <p className="text-sm text-center font-light text-gray-500">Already have an account? <Link href="/login"><span className="text-blue-600 font-medium pl-1 hover:text-blue-700">Sign In</span></Link></p>
        </form>
    )
}