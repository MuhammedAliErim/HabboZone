import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col w-full max-w-6xl mx-auto">
        {children}
      </main>
      <Footer />
    </>
  );
}
