"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/components/cart-provider";
import { formatEUR } from "@/app/lib/precio";

export function CarritoClient() {
  const { lines, subtotal, setLineQuantity, removeLine, clearCart } = useCart();
  const [cargando, setCargando] = useState(false);
  const [metodoPago, setMetodoPago] = useState<"stripe" | "transferencia">("stripe");

  // NUEVO: Estados para los datos del cliente (solo obligatorios en transferencia)
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");

  const gestionarPago = async () => {
    try {
      // Validación: Si es transferencia, obligamos a rellenar los datos de contacto
      if (metodoPago === "transferencia") {
        if (!email.trim() || !nombre.trim() || !direccion.trim()) {
          alert("Por favor, rellena todos los datos de contacto y envío para poder reservar tu pedido.");
          return;
        }
      }

      setCargando(true);

      const respuesta = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          lines, 
          metodoPago,
          // Enviamos los datos del cliente al servidor
          datosCliente: metodoPago === "transferencia" ? { email, nombre, direccion } : null
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || "Algo salió mal.");
      }

      if (datos.url) {
        window.location.href = datos.url;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al procesar tu solicitud.");
    } finally {
      setCargando(false);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200/80 bg-white/70 p-10 md:p-14 text-center ring-1 ring-stone-100">
        <p className="text-stone-600 leading-relaxed mb-6">
          Tu carrito está vacío. Explora la colección y añade piezas que te inspiren.
        </p>
        <Link
          href="/coleccion"
          className="inline-block rounded-full bg-stone-900 text-stone-50 px-8 py-3 text-sm uppercase tracking-widest hover:bg-stone-800 transition-colors"
        >
          Ver colección
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Lista de Productos */}
      <ul className="space-y-6">
        {lines.map((line) => (
          <li
            key={line.productId}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-2xl border border-stone-200/80 bg-white/80 p-4 sm:p-5 ring-1 ring-stone-100"
          >
            <div className="shrink-0 w-full sm:w-28 aspect-[4/5] sm:aspect-square overflow-hidden rounded-xl bg-stone-100">
              <img src={line.imagen} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium text-stone-900">{line.nombre}</h2>
                <p className="text-stone-500 text-sm mt-1">{line.precioLabel} / unidad</p>
              </div>
              <div className="flex flex-col items-stretch sm:items-end gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={cargando}
                    onClick={() => setLineQuantity(line.productId, line.quantity - 1)}
                    className="h-10 w-10 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 text-lg leading-none disabled:opacity-50"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    disabled={cargando}
                    value={line.quantity}
                    onChange={(e) => setLineQuantity(line.productId, parseInt(e.target.value, 10) || 1)}
                    className="w-14 text-center rounded-lg border border-stone-200 py-2 text-stone-900 tabular-nums disabled:opacity-50"
                  />
                  <button
                    type="button"
                    disabled={cargando}
                    onClick={() => setLineQuantity(line.productId, line.quantity + 1)}
                    className="h-10 w-10 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 text-lg leading-none disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                <p className="text-stone-900 font-medium tabular-nums">
                  {formatEUR(line.precioUnit * line.quantity)}
                </p>
                <button
                  type="button"
                  disabled={cargando}
                  onClick={() => removeLine(line.productId)}
                  className="text-sm text-stone-500 hover:text-stone-900 underline decoration-stone-300 underline-offset-2 self-start sm:self-end disabled:opacity-50"
                >
                  Quitar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Selector de Método de Pago */}
      <div className="space-y-4">
        <h3 className="text-sm uppercase tracking-widest text-stone-500 font-medium">
          Selecciona el método de pago
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setMetodoPago("stripe")}
            className={`p-5 rounded-xl border text-left transition-all ${
              metodoPago === "stripe"
                ? "border-stone-900 bg-stone-900/5 ring-1 ring-stone-900"
                : "border-stone-200 bg-white/50 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-stone-900">Tarjeta de crédito o PayPal</span>
              <div className="flex gap-2 text-xs text-stone-400">
                <span>Visa</span>•<span>MC</span>•<span>PayPal</span>
              </div>
            </div>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              Pago instantáneo y cifrado a través de pasarela segura de Stripe.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setMetodoPago("transferencia")}
            className={`p-5 rounded-xl border text-left transition-all ${
              metodoPago === "transferencia"
                ? "border-stone-900 bg-stone-900/5 ring-1 ring-stone-900"
                : "border-stone-200 bg-white/50 hover:bg-white"
            }`}
          >
            <span className="font-medium text-stone-900 block">Transferencia Bancaria</span>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              Te facilitaremos nuestro IBAN al finalizar para que realices el ingreso manual.
            </p>
          </button>
        </div>
      </div>

      {/* NUEVO: Formulario de datos de envío Desplegable (Solo si elige transferencia) */}
      {metodoPago === "transferencia" && (
        <div className="rounded-2xl border border-stone-200 bg-white p-6 md:p-8 space-y-4 animate-fadeIn">
          <h3 className="text-sm uppercase tracking-widest text-stone-500 font-medium mb-2">
            Datos de Contacto y Envío Artesanal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="nombreClient" className="text-xs text-stone-500 block">Nombre Completo</label>
              <input
                id="nombreClient"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Cristina García"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:border-stone-900 transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="emailClient" className="text-xs text-stone-500 block">Correo Electrónico</label>
              <input
                id="emailClient"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cristina@ejemplo.com"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:border-stone-900 transition-colors"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="direccionClient" className="text-xs text-stone-500 block">Dirección de Entrega Completa</label>
            <input
              id="direccionClient"
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Calle, Número, Piso, Código Postal, Ciudad"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:border-stone-900 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Bloque de Desglose Final */}
      <div className="rounded-2xl border border-stone-200/80 bg-stone-100/40 p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-baseline gap-4">
          <span className="text-sm uppercase tracking-widest text-stone-500">Subtotal</span>
          <span className="text-2xl font-light text-stone-900 tabular-nums">{formatEUR(subtotal)}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={clearCart}
            disabled={cargando}
            className="text-sm text-stone-600 hover:text-stone-900 underline decoration-stone-300 underline-offset-2 order-2 sm:order-1 disabled:opacity-30"
          >
            Vaciar carrito
          </button>
          <button
            type="button"
            onClick={gestionarPago}
            disabled={cargando}
            className="order-1 sm:order-2 inline-flex justify-center items-center rounded-full bg-stone-900 text-stone-50 px-8 py-3 text-sm uppercase tracking-widest hover:bg-stone-800 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed min-w-[240px] h-[46px]"
          >
            {cargando ? "Procesando..." : metodoPago === "stripe" ? "Proceder al pago" : "Confirmar pedido por transferencia"}
          </button>
        </div>
      </div>
    </div>
  );
}