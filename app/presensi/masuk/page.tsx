import CreatePresensiForm from "@/components/masuk-form";
import Navbar from "@/components/navbar/navbar";

export default function PresensiMasuk() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-100 p-5 mt-20">
                <CreatePresensiForm />
            </main>
        </>
    );
}