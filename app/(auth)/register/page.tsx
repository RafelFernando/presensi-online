import FormRegister from "@/components/auth/form-register";

export default function Register() {
    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
            <FormRegister />
        </div>
    )
}