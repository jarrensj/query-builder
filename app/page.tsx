import TabbedForms from "../components/TabbedForms";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-gradient-to-b from-zinc-50 to-zinc-100">
      <div className="text-center mb-2">
        <h1 className="text-3xl font-bold text-zinc-800 tracking-tight">
          Twitter Query Builder
        </h1>
        <p className="text-zinc-500 mt-2">
          Build advanced search queries to find tweets on X
        </p>
      </div>
      <TabbedForms />
    </main>
  );
}
