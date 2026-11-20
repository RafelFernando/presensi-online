import KeluarForm from "@/components/keluar-form";
import NavbarLayout from "@/components/navbar/navbar-layout";

export default function PresensiKeluar() {
    return (
        <>
            <NavbarLayout />
            <main className="min-h-screen bg-gray-100 p-5 mt-5">
                <KeluarForm />
            </main>
        </>
    );
}