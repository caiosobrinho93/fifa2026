import type { Metadata } from "next";
import { Outfit, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { InventoryProvider } from "@/contexts/InventoryContext";

// Bug fix #7: mantendo apenas as 2 fontes realmente usadas (salva ~300KB de rede)
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ["latin"], variable: "--font-bebas-neue", display: 'swap' });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: 'swap' });

export const metadata: Metadata = {
  title: "Copa 2026 | Álbum de Figurinhas Digital",
  description: "O álbum de figurinhas digital mais completo da Copa do Mundo 2026. Colecione, negocie e complete sua coleção dos maiores craques do mundo.",
  keywords: ["copa 2026", "figurinhas", "álbum digital", "FIFA 2026", "colecionismo"],
  openGraph: {
    title: "Copa 2026 | Álbum de Figurinhas Digital",
    description: "Colecione os craques da Copa 2026. Sistema gamificado de figurinhas digitais.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${bebasNeue.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="bg-background text-white selection:bg-primary/30 min-h-screen flex flex-col font-outfit antialiased" suppressHydrationWarning>
        <AuthProvider>
          <InventoryProvider>
            <Toaster 
              position="bottom-right" 
              expand={false} 
              richColors 
              theme="dark" 
              toastOptions={{
                className: 'bg-black/90 backdrop-blur-xl border border-white/10 text-white font-outfit shadow-2xl',
                classNames: {
                  toast: 'rounded-xl',
                  title: 'text-sm font-black uppercase tracking-widest font-bebas',
                  description: 'text-xs text-white/70',
                  success: 'border-primary/50 bg-[#0f172a] text-white',
                  error: 'border-red-500/50 bg-[#1e0f0f] text-white',
                }
              }}
            />
            <main className="flex-1 overflow-x-hidden">
              {children}
            </main>
          </InventoryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
