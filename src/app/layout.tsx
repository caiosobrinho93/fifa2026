import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Bebas_Neue, Poppins, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta" });
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ["latin"], variable: "--font-bebas-neue" });
const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: "--font-poppins" 
});
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Copa Album 2026 | Coleção Oficial",
  description: "O álbum de figurinhas digital mais completo da Copa do Mundo 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${inter.variable} ${plusJakarta.variable} ${bebasNeue.variable} ${outfit.variable}`}>
      <body className="bg-background text-white selection:bg-primary/30 min-h-screen flex flex-col font-outfit antialiased">
        <Toaster position="top-center" expand={true} richColors theme="dark" />
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
