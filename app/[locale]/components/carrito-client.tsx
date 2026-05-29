"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/app/[locale]/components/cart-provider";
import { formatEUR } from "@/app/[locale]/lib/precio";

const COSTES_ENVIO = {
  peninsula: 0,
  islas: 25,       
  internacional: 65 
};

// Listado de provincias españolas peninsulares para evitar que metan Baleares/Canarias en "Gratis"
const PROVINCIAS_PENINSULA = [
  "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Barcelona", "Burgos", "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ciudad Real", "Córdoba", "Cuenca", "Gerona", "Granada", "Guadalajara", "Guipúzcoa", "Huelva", "Huesca", "Jaén", "La Coruña", "La Rioja", "León", "Lérida", "Lugo", "Madrid", "Málaga", "Murcia", "Navarra", "Orense", "Palencia", "Pontevedra", "Salamanca", "Segovia", "Sevilla", "Soria", "Tarragona", "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora", "Zaragoza"
];

const PROVINCIAS_ISLAS = ["Baleares", "Las Palmas (Canarias)", "Santa Cruz de Tenerife (Canarias)", "Ceuta", "Melilla"];

const PAISES_INTERNACIONAL = [
  { code: "FR", name: "Francia" },
  { code: "IT", name: "Italia" },
  { code: "DE", name: "Alemania" },
  { code: "PT", name: "Portugal" }
];

export function CarritoClient() {
  const { lines, subtotal, removeLine, clearCart } = useCart();
  const [cargando, setCargando] = useState(false);
  const [metodoPago, setMetodoPago] = useState<"stripe" | "transferencia">("stripe");
  const [regionEnvio, setRegionEnvio] = useState<"peninsula" | "islas" | "internacional">("peninsula");

  // Estados desagregados para la dirección del cliente
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [calle, setCalle] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [provinciaOId, setProvinciaOId] = useState(""); // Almacenará la provincia o el país según la región

  // Resetear la ubicación específica si el usuario cambia los botones de envío superiores
  useEffect(() => {
    setProvinciaOId("");
  }, [regionEnvio]);

  const costeEnvioActual = COSTES_ENVIO[regionEnvio];
  const totalAbsoluto = subtotal + costeEnvioActual;

  const gestionarPago = async () => {
    try {
      // Validación estricta obligatoria para ambos métodos de pago
      if (!email.trim() || !nombre.trim() || !calle.trim() || !localidad.trim() || !codigoPostal.trim() || !provinciaOId) {
        alert("Por favor, rellene todos los campos de contacto y envío obligatorios antes de proceder.");
        return;
      }

      setCargando(true);

      // Agrupamos la dirección estructurada para mandársela al backend
      const direccionEstructurada = {
        calle,
        localidad,
        codigoPostal,
        regionUbicacion: provinciaOId, // Guardará la provincia o país seleccionado
        paisBase: regionEnvio === "internacional" ? provinciaOId : "España"
      };

      const respuesta = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          lines, 
          metodoPago,
          regionEnvio, 
          costeEnvio: costeEnvioActual, 
          datosCliente: { email, nombre, direccion: direccionEstructurada }
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || "Algo salió mal.");
      }

      if (datos.url) {
        window.location.href = datos.url;
      }
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Hubo un problema al procesar tu solicitud.");
    } finally {
      setCargando(false);
    }
  };

  if (lines.length === 0) return <p className="text-center p-10 text-stone-500">Tu carrito está vacío.</p>;

  return (
    <div className="space-y-10">
      {/* Lista de Productos Modificada */}
      <ul className="space-y-6">
        {lines.map((line) => (
          <li key={line.productId} className="flex gap-6 rounded-2xl border border-stone-200/80 bg-white/80 p-5 ring-1 ring-stone-100">
            <div className="shrink-0 w-24 h-24 overflow-hidden rounded-xl bg-stone-100">
              <img src={line.imagen} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-medium text-stone-900">{line.nombre}</h2>
                {/* 🌟 RECUPERADO: Indicativo exclusivo de Pieza Única */}
                <span className="inline-block text-[11px] uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md mt-1 font-medium">
                  Pieza única
                </span>
                <p className="text-stone-900 font-medium tabular-nums mt-2">{formatEUR(line.precioUnit)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeLine(line.productId)}
                className="text-sm text-stone-400 hover:text-stone-900 underline"
              >
                Quitar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* SELECTOR DE DESTINO DE ENVÍO */}
      <div className="space-y-4">
        <h3 className="text-sm uppercase tracking-widest text-stone-500 font-medium">Destino del Envío Asegurado</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setRegionEnvio("peninsula")}
            className={`p-4 rounded-xl border text-center transition-all ${regionEnvio === "peninsula" ? "border-stone-900 bg-stone-900/5 ring-1 ring-stone-900" : "border-stone-200 bg-white/50"}`}
          >
            <span className="font-medium text-stone-900 text-sm block">España Peninsular</span>
            <span className="text-xs text-stone-500 mt-1 block">De cortesía (Gratis)</span>
          </button>

          <button
            type="button"
            onClick={() => setRegionEnvio("islas")}
            className={`p-4 rounded-xl border text-center transition-all ${regionEnvio === "islas" ? "border-stone-900 bg-stone-900/5 ring-1 ring-stone-900" : "border-stone-200 bg-white/50"}`}
          >
            <span className="font-medium text-stone-900 text-sm block">Islas, Ceuta o Melilla</span>
            <span className="text-xs text-stone-600 mt-1 block">+{formatEUR(COSTES_ENVIO.islas)}</span>
          </button>

          <button
            type="button"
            onClick={() => setRegionEnvio("internacional")}
            className={`p-4 rounded-xl border text-center transition-all ${regionEnvio === "internacional" ? "border-stone-900 bg-stone-900/5 ring-1 ring-stone-900" : "border-stone-200 bg-white/50"}`}
          >
            <span className="font-medium text-stone-900 text-sm block">Europa Seleccionada</span>
            <span className="text-xs text-stone-600 mt-1 block">+{formatEUR(COSTES_ENVIO.internacional)}</span>
          </button>
        </div>
      </div>

      {/* Selector de Método de Pago */}
      <div className="space-y-4">
        <h3 className="text-sm uppercase tracking-widest text-stone-500 font-medium">Selecciona el método de pago</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setMetodoPago("stripe")}
            className={`p-5 rounded-xl border text-left transition-all ${metodoPago === "stripe" ? "border-stone-900 bg-stone-900/5 ring-1 ring-stone-900" : "border-stone-200 bg-white/50"}`}
          >
            <span className="font-medium text-stone-900 block">Tarjeta de crédito o PayPal</span>
            <p className="text-xs text-stone-500 mt-1">Pasarela segura gestionada por Stripe.</p>
          </button>

          <button
            type="button"
            onClick={() => setMetodoPago("transferencia")}
            className={`p-5 rounded-xl border text-left transition-all ${metodoPago === "transferencia" ? "border-stone-900 bg-stone-900/5 ring-1 ring-stone-900" : "border-stone-200 bg-white/50"}`}
          >
            <span className="font-medium text-stone-900 block">Transferencia Bancaria</span>
            <p className="text-xs text-stone-500 mt-1">Te facilitaremos el IBAN tras reservar la obra.</p>
          </button>
        </div>
      </div>

      {/* FORMULARIO CON CONTRASTE ALTO Y TÍTULO DINÁMICO */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 md:p-8 space-y-4">
        <div className="border-b pb-3 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <h3 className="text-sm uppercase tracking-widest text-stone-500 font-medium">
            Datos de Contacto y Envío Artesanal
          </h3>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-stone-100 text-stone-800 self-start md:self-auto">
            📍 Modalidad: {
              regionEnvio === "peninsula" ? "España Peninsular (Gratis)" :
              regionEnvio === "islas" ? "Islas, Ceuta o Melilla (+25,00€)" : 
              "Europa Seleccionada (+65,00€)"
            }
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-stone-500 block mb-1">Nombre Completo</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              placeholder="Ej. Cristina García" 
              className="w-full px-4 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:border-stone-900 focus:outline-none" 
            />
          </div>
          <div>
            <label className="text-xs text-stone-500 block mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="cristina@ejemplo.com" 
              className="w-full px-4 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:border-stone-900 focus:outline-none" 
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-stone-500 block mb-1">Dirección (Calle, número, piso...)</label>
          <input 
            type="text" 
            value={calle} 
            onChange={(e) => setCalle(e.target.value)} 
            placeholder="Av. de la Constitución 14, 2B" 
            className="w-full px-4 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:border-stone-900 focus:outline-none" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-stone-500 block mb-1">Localidad / Ciudad</label>
            <input 
              type="text" 
              value={localidad} 
              onChange={(e) => setLocalidad(e.target.value)} 
              placeholder="Ej. Sevilla" 
              className="w-full px-4 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:border-stone-900 focus:outline-none" 
            />
          </div>
          <div>
            <label className="text-xs text-stone-500 block mb-1">Código Postal</label>
            <input 
              type="text" 
              value={codigoPostal} 
              onChange={(e) => setCodigoPostal(e.target.value)} 
              placeholder="Ej. 41001" 
              className="w-full px-4 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:border-stone-900 focus:outline-none" 
            />
          </div>
          
          <div>
            <label className="text-xs text-stone-500 block mb-1">
              {regionEnvio === "internacional" ? "País de Destino" : "Provincia"}
            </label>
            <select
              value={provinciaOId}
              onChange={(e) => setProvinciaOId(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:border-stone-900 focus:outline-none cursor-pointer"
            >
              <option value="" className="text-stone-400">Selecciona...</option>
              
              {regionEnvio === "peninsula" && PROVINCIAS_PENINSULA.map((p) => (
                <option key={p} value={p} className="text-stone-900">{p}</option>
              ))}

              {regionEnvio === "islas" && PROVINCIAS_ISLAS.map((p) => (
                <option key={p} value={p} className="text-stone-900">{p}</option>
              ))}

              {regionEnvio === "internacional" && PAISES_INTERNACIONAL.map((p) => (
                <option key={p.name} value={p.name} className="text-stone-900">{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Desglose Final */}
      <div className="rounded-2xl border bg-stone-100/40 p-6 space-y-4">
        <div className="flex justify-between border-b pb-3 text-xs uppercase text-stone-500">
          <span>Subtotal piezas</span>
          <span className="text-base text-stone-900">{formatEUR(subtotal)}</span>
        </div>
        <div className="flex justify-between border-b pb-3 text-xs uppercase text-stone-500">
          <span>Envío Asegurado ({regionEnvio === "peninsula" ? "Península" : regionEnvio === "islas" ? "Islas" : "Internacional"})</span>
          <span className="text-sm font-medium text-stone-800">{costeEnvioActual === 0 ? "Gratuito" : formatEUR(costeEnvioActual)}</span>
        </div>
        <div className="flex justify-between pt-2 text-sm uppercase text-stone-600 font-medium">
          <span>Total pedido</span>
          <span className="text-2xl font-light text-stone-900">{formatEUR(totalAbsoluto)}</span>
        </div>

        <div className="flex justify-between items-center pt-4">
          <button type="button" onClick={clearCart} disabled={cargando} className="text-sm text-stone-600 underline">Vaciar</button>
          <button type="button" onClick={gestionarPago} disabled={cargando} className="rounded-full bg-stone-900 text-stone-50 px-8 py-3 text-sm uppercase tracking-widest hover:bg-stone-800">
            {cargando ? "Procesando..." : metodoPago === "stripe" ? "Proceder al pago" : "Confirmar pedido"}
          </button>
        </div>
      </div>
    </div>
  );
}