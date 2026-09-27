import KeluarForm from "@/components/keluar-form";
import Navbar from "@/components/navbar/navbar";

export default function PresensiKeluar() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-100 p-5 mt-20">
                <KeluarForm />
            </main>
        </>
    );
}