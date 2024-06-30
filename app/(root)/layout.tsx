import Header from "@/components/header";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-full bg-background container">
      <Header />

      {children}
    </main>
  );
}
