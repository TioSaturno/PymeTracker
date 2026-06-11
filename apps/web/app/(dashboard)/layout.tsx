import { cookies } from "next/headers";
import Sidebar from "../components/Sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let rol = "";
  if (token) {
    try {
      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(
        Buffer.from(payloadBase64, "base64").toString("utf-8")
      );
      rol = payload.rol || "";
    } catch {
      rol = "";
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar rol={rol} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
