import Header from "@/components/header";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-slate-50 h-full">
      <Header />

      {children}
    </main>
  );
}
