import CreatePresensiForm from "@/components/masuk-form";
import NavbarLayout from "@/components/navbar/navbar-layout";

export default function PresensiMasuk() {
    return (
        <>
            <NavbarLayout />
            <main className="min-h-screen bg-gray-100 p-5 mt-5">
                <CreatePresensiForm />
            </main>
        </>
    );
}