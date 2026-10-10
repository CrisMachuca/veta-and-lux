"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { useCart } from "@/app/[locale]/components/cart-provider";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { SiteFooter } from "@/app/[locale]/components/site-footer";
import { enviarEvento, leerPedidoPendiente, marcarCompraMedida } from "@/app/[locale]/lib/analytics";

// Datos bancarios configurados en .env (los mismos que se envían por correo)
const IBAN = process.env.NEXT_PUBLIC_IBAN_TRANSFERENCIA;
const TITULAR = process.env.NEXT_PUBLIC_TITULAR_CUENTA || "Veta & Lux";

function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const t = useTranslations("CheckoutExito");

  const metodo = searchParams.get("method");
  const orderId = searchParams.get("orderId") || "";
  const items = searchParams.get("items");
  const email = searchParams.get("clientEmail") || "";
  const total = searchParams.get("total");

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // GA4: una sola vez por pedido (se ignora al recargar o volver a esta página)
  const sessionId = searchParams.get("session_id") || "";
  useEffect(() => {
    if (metodo === "stripe" && sessionId) {
      const pedido = leerPedidoPendiente();
      if (pedido && marcarCompraMedida(sessionId)) {
        enviarEvento("purchase", { transaction_id: sessionId, currency: "EUR", value: pedido.value, shipping: pedido.shipping, items: pedido.items });
      }
    } else if (metodo === "transferencia" && orderId && marcarCompraMedida(orderId)) {
      // Una transferencia es una reserva, no un pago confirmado: evento propio
      enviarEvento("reserva_transferencia", { transaction_id: orderId, currency: "EUR", value: Number(total) || 0 });
    }
  }, [metodo, sessionId, orderId, total]);

  return (
    <section className="max-w-3xl mx-auto px-4 py-20 md:py-32 text-center space-y-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-100 text-stone-900 border border-stone-200">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-nixie text-stone-900">
          {metodo === "transferencia" ? t("tituloTransferencia") : t("tituloTarjeta")}
        </h1>

        {metodo === "transferencia" ? (
          <div className="max-w-md mx-auto bg-white border border-stone-200 p-6 md:p-8 rounded-2xl text-left space-y-5 shadow-sm">
            <p className="text-stone-600 text-sm leading-relaxed">{t("introTransferencia")}</p>

            <div className="font-mono text-xs text-stone-700 space-y-2.5 bg-stone-50 p-5 rounded-xl border border-stone-100 divide-y divide-stone-100">
              <div className="pb-2">
                <span className="text-stone-400 block text-[10px] uppercase tracking-wider">{t("numeroPedido")}</span>
                <span className="text-sm font-semibold text-amber-900">{orderId}</span>
              </div>
              <div className="py-2">
                <span className="text-stone-400 block text-[10px] uppercase tracking-wider">{t("email")}</span>
                <span className="text-stone-800 font-medium">{email}</span>
              </div>
              <div className="py-2">
                <span className="text-stone-400 block text-[10px] uppercase tracking-wider">{t("piezas")}</span>
                <span className="text-stone-800 font-medium">{items}</span>
              </div>
              {total && (
                <div className="py-2">
                  <span className="text-stone-400 block text-[10px] uppercase tracking-wider">{t("importe")}</span>
                  <span className="text-stone-900 font-semibold">{total.replace(".", ",")} €</span>
                </div>
              )}
              <div className="py-2">
                <span className="text-stone-400 block text-[10px] uppercase tracking-wider">{t("iban")}</span>
                <span className="text-stone-900 font-semibold tracking-wide">{IBAN || t("ibanPorCorreo")}</span>
              </div>
              <div className="py-2">
                <span className="text-stone-400 block text-[10px] uppercase tracking-wider">{t("titular")}</span>
                <span className="text-stone-800 font-medium">{TITULAR}</span>
              </div>
              <div className="pt-2">
                <span className="text-stone-400 block text-[10px] uppercase tracking-wider">{t("concepto")}</span>
                <span className="text-stone-900 bg-amber-50 px-1.5 py-0.5 rounded font-bold border border-amber-200/60">{orderId}</span>
              </div>
            </div>

            <p className="text-xs text-stone-500 italic leading-relaxed">
              {t.rich("notaTransferencia", {
                email,
                pedido: orderId,
                b: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
          </div>
        ) : (
          <p className="text-stone-600 max-w-md mx-auto text-sm leading-relaxed">{t("textoTarjeta")}</p>
        )}
      </div>

      <div className="pt-4">
        <Link href="/" className="inline-block rounded-full bg-stone-900 text-stone-50 px-8 py-3 text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors">
          {t("volver")}
        </Link>
      </div>
    </section>
  );
}

function Cargando() {
  const t = useTranslations("CheckoutExito");
  return <div className="text-center py-20 font-mono text-xs text-stone-400">{t("cargando")}</div>;
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <SiteNav />
      <Suspense fallback={<Cargando />}>
        <SuccessContent />
      </Suspense>
      <SiteFooter />
    </main>
  );
}
