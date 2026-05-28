"use client";

import { useState } from "react";
import Link from "next/link";
import { CartNav } from "@/app/components/cart-nav";

export function SiteNav() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGOTIPO */}
        <Link
          href="/"
          onClick={() => setMenuAbierto(false)}
          className="text-xl font-medium tracking-tighter text-stone-900 z-50"
        >
          Veta <span className="italic font-serif">&</span> Lux
        </Link>

        {/* NAVEGACIÓN ESCRITORIO (Ahora con Proceso incluido) */}
        <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-stone-600">
          <Link href="/" className="hover:text-stone-900 transition-colors">
            Inicio
          </Link>
          <Link href="/coleccion" className="hover:text-stone-900 transition-colors">
            Colección
          </Link>
          {/* 🌟 NUEVO ENLACE ESTRATÉGICO */}
          <Link href="/proceso" className="hover:text-stone-900 transition-colors">
            Proceso
          </Link>
          <Link href="/contacto" className="hover:text-stone-900 transition-colors">
            Contacto
          </Link>
        </div>

        {/* CONTENEDOR DERECHO */}
        <div className="flex items-center gap-4 z-50">
          <CartNav />

          {/* BOTÓN HAMBURGUESA MÓVIL */}
          <button
            type="button"
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="flex flex-col justify-center items-center w-8 h-8 md:hidden space-y-1.5 focus:outline-none"
            aria-label="Abrir menú"
          >
            <span className={`block h-0.5 w-6 bg-stone-800 transition-transform duration-300 ease-out rounded ${menuAbierto ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-6 bg-stone-800 transition-opacity duration-300 ease-out rounded ${menuAbierto ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-stone-800 transition-transform duration-300 ease-out rounded ${menuAbierto ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* MENÚ DESPLEGABLE MÓVIL */}
      <div 
        className={`fixed inset-0 bg-stone-950/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${menuAbierto ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMenuAbierto(false)}
      />

      <div 
        className={`fixed top-0 right-0 h-screen w-64 bg-stone-50 border-l border-stone-200 p-8 pt-24 shadow-xl transition-transform duration-300 ease-in-out transform md:hidden ${menuAbierto ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col gap-6 text-sm uppercase tracking-widest text-stone-600 font-medium">
          <Link href="/" onClick={() => setMenuAbierto(false)} className="hover:text-stone-900 border-b border-stone-200/60 pb-3 transition-colors">
            Inicio
          </Link>
          <Link href="/coleccion" onClick={() => setMenuAbierto(false)} className="hover:text-stone-900 border-b border-stone-200/60 pb-3 transition-colors">
            Colección
          </Link>
          {/* 🌟 MÓVIL: ENLACE A PROCESO */}
          <Link href="/proceso" onClick={() => setMenuAbierto(false)} className="hover:text-stone-900 border-b border-stone-200/60 pb-3 transition-colors">
            Proceso
          </Link>
          <Link href="/contacto" onClick={() => setMenuAbierto(false)} className="hover:text-stone-900 border-b border-stone-200/60 pb-3 transition-colors">
            Contacto
          </Link>
        </div>
      </div>
    </nav>
  );
}