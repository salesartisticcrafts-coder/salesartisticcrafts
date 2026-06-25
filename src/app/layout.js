import "./globals.css";
import "./App.css";

export const metadata = {
  title: "ARTISTIC CRAFTS — Luxury Marble Jewelry & Decor Atelier",
  description: "ARTISTIC CRAFTS crafts premium marble jewelry and luxury home decor from the world's rarest stones. Handcrafted rings, pendants, vases, sculptures and bespoke custom pieces.",
  keywords: "luxury marble jewelry, marble decor, custom marble design, white marble ring, onyx pendant, marble vase, luxury atelier India",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>◈</text></svg>",
  },
  openGraph: {
    title: "ARTISTIC CRAFTS — Luxury Marble Jewelry & Decor",
    description: "Crafted from stone. Designed for eternity. Premium marble jewelry and decor from the world's finest quarries.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#C9A96E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
