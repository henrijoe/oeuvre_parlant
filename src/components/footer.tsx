import React from "react"
import Link from "next/link"


export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-[#EA580C]">
      <div className="pt-3 text-center">
        <p>© {new Date().getFullYear()} Arts Parlants. Tous droits réservés.</p>
        <p className="mt-1 italic">
          Conçu par <span className="font-semibold">DHJ-dev</span>
        </p>
      </div>
    </footer>
  );
}