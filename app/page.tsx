import Footer from "../components/Footer";
import ToolSwitcher from "../components/ToolSwitcher";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-white px-6 py-4">
        <div className="mx-auto flex max-w-[720px] flex-wrap items-baseline gap-x-4 gap-y-0.5">
          <h1 className="text-[17px] font-semibold tracking-[-0.01em]">
            query builder
          </h1>
          <p className="text-[14px] text-ink-muted">
            A tool to help you search for posts on X.
          </p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[720px] flex-1 px-6 pb-12 pt-7">
        <ToolSwitcher />
      </main>
      <Footer />
    </div>
  );
}
