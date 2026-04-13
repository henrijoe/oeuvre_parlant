// app/layout.tsx
import { Montserrat } from "next/font/google";
import "./globals.css";
import "../assets/css/tailwind.css";
import "../assets/css/materialdesignicons.min.css";
import { Providers } from "@/lib/providers/providers";
import CartProvider from "@/components/cartProvider";
import { AuthProvider } from "@/contexts/AuthContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Arts-Parlants",
  description: "Exposition d'œuvres d'art",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="fr" className="light" dir="ltr">
      <body className={`${montserrat.variable} font-montserrat text-base text-black dark:text-white dark:bg-slate-900`}>
        <Providers>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;