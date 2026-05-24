"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/app/components/cart-provider";

function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  
  const [metodo, setMetodo] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [items, setItems] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null); // Nuevo estado

  useEffect(() => {
    setMetodo(searchParams.get("method"));
    setOrderId(searchParams.get("orderId"));
    setItems(searchParams.get("items"));
    setEmail(searchParams.get("clientEmail")); // Capturamos el email
    
    clearCart();
  }, [clearCart, searchParams]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-20 md:py-32 text-center space-y-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-100 text-stone-900 border border-stone-200">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-serif italic text-stone-900">
          {metodo === "transferencia" ? "Pedido Reservado" : "Gracias por tu pedido"}
        </h1>
        
        {metodo === "transferencia" ? (
          <div className="max-w-md mx-auto bg-stone-50 border border-stone-200 p-6 md:p-8 rounded-2xl text-left space-y-5 shadow-sm">
            <p className="text-stone-600 text-sm leading-relaxed">
              Para poner en marcha el proceso de manufactura artesanal de tus piezas de iluminación, realiza el ingreso bancario detallando los siguientes campos:
            </p>
            
            <div className="font-mono text-xs text-stone-700 space-y-2.5 bg-white p-5 rounded-xl border border-stone-100 divide-y divide-stone-100">
              <div className="pb-2">
                <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Número de pedido</span>
                <span className="text-sm font-semibold text-amber-900">{orderId}</span>
              </div>
              <div className="py-2">
                <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Tu Email de contacto</span>
                <span className="text-stone-800 font-medium">{email}</span>
              </div>
              <div className="py-2">
                <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Piezas seleccionadas</span>
                <span className="text-stone-800 font-medium">{items}</span>
              </div>
              <div className="py-2">
                <span className="text-stone-400 block text-[10px] uppercase tracking-wider">IBAN de ingreso</span>
                <span className="text-stone-900 font-semibold tracking-wide">ES21 1234 5678 9012 3456 7890</span>
              </div>
              <div className="pt-2">
                <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Concepto obligatorio</span>
                <span className="text-stone-900 bg-amber-50 px-1.5 py-0.5 rounded font-bold border border-amber-200/60">{orderId}</span>
              </div>
            </div>

            <p className="text-xs text-stone-500 italic leading-relaxed">
              * Se ha enviado una copia de las instrucciones a <strong>{email}</strong>. Por favor, utiliza el número de pedido <strong>{orderId}</strong> como concepto.
            </p>
          </div>
        ) : (
          <p className="text-stone-600 max-w-md mx-auto text-sm leading-relaxed">
            Hemos recibido tu pago correctamente a través de la pasarela segura. Nos ponemos manos a la obra con la selección de maderas nobles y cristales para tus piezas de iluminación. Pronto recibirás un correo electrónico de confirmación con el seguimiento.
          </p>
        )}
      </div>

      <div className="pt-4">
        <Link href="/" className="inline-block rounded-full bg-stone-900 text-stone-50 px-8 py-3 text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-mono text-xs text-stone-400">Cargando confirmación...</div>}>
      <SuccessContent />
    </Suspense>
  );
}