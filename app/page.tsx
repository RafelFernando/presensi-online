import Navbar from "@/components/navbar/navbar";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";


export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  switch (session.user.role) {
    case "user":
      redirect("/presensi");

    case "admin":
      redirect("/admin/dashboard");

    default:
      redirect("/login");
  }
  return (
    <main className="min-h-full flex flex-col">
    </main>
  );
}
