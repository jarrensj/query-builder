import Footer from "../components/Footer";
import ToolSwitcher from "../components/ToolSwitcher";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex min-h-[56px] max-w-[720px] items-center px-5 sm:px-6">
          <span className="text-[15px] font-semibold tracking-[-0.01em]">
            QueryBuilder
          </span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[720px] flex-1 px-5 pb-12 pt-7 sm:px-6 sm:pb-16 sm:pt-[52px]">
        <h1 className="text-[28px] font-medium leading-[1.15] tracking-[-0.02em] sm:text-[34px]">
          QueryBuilder
        </h1>
        <p className="mt-3 max-w-[48ch] text-ink-muted [text-wrap:pretty]">
          A tool to create links to help you query and search for posts.
        </p>
        <ToolSwitcher />
      </main>
      <Footer />
    </div>
  );
}
