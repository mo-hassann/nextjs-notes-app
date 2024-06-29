import TodoContainer from "@/client/todo/components/todo-container";
import Header from "@/components/header";

export default async function Home() {
  return (
    <main className="bg-slate-50 h-full">
      <Header />

      <section className="flex items-center justify-center h-full">
        <TodoContainer />
      </section>
    </main>
  );
}
