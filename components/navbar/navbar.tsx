import { auth } from "@/lib/auth/auth";
import NavbarClient from "./navlink";

export default async function Navbar() {
  const session = await auth();

  return <NavbarClient session={session} />;
}