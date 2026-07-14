import Footer from "@/components/Footer";

export default function MainRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid size-full min-h-screen w-full grid-rows-[1fr_auto] bg-blue-100">
      <div className="m-2 flex items-center justify-center rounded-br-[4rem] rounded-tl-[4rem] bg-gray-50 py-8">
        {children}
      </div>
      <Footer />
    </div>
  );
}
