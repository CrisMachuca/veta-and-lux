"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/[locale]/components/cart-provider";
import { formatEUR } from "@/app/[locale]/lib/precio";
import { useTranslations } from "next-intl";

const COSTES_ENVIO = { peninsula: 0, islas: 25, internacional: 65 };
const PROVINCIAS_PENINSULA = ["Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Barcelona", "Burgos", "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ciudad Real", "Córdoba", "Cuenca", "Gerona", "Granada", "Guadalajara", "Guipúzcoa", "Huelva", "Huesca", "Jaén", "La Coruña", "La Rioja", "León", "Lérida", "Lugo", "Madrid", "Málaga", "Murcia", "Navarra", "Orense", "Palencia", "Pontevedra", "Salamanca", "Segovia", "Sevilla", "Soria", "Tarragona", "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora", "Zaragoza"];
const PROVINCIAS_ISLAS = ["Baleares", "Las Palmas (Canarias)", "Santa Cruz de Tenerife (Canarias)", "Ceuta", "Melilla"];
const PAISES_INTERNACIONAL = [{ code: "FR", name: "Francia" }, { code: "IT", name: "Italia" }, { code: "DE", name: "Alemania" }, { code: "PT", name: "Portugal" }];

export function CarritoClient() {
  const { lines, subtotal, removeLine, clearCart } = useCart();
  const t = useTranslations("CarritoClient");
  const [cargando, setCargando] = useState(false);
  const [metodoPago, setMetodoPago] = useState<"stripe" | "transferencia">("stripe");
  const [regionEnvio, setRegionEnvio] = useState<"peninsula" | "islas" | "internacional">("peninsula");

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [calle, setCalle] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [provinciaOId, setProvinciaOId] = useState("");

  useEffect(() => { setProvinciaOId(""); }, [regionEnvio]);

  const costeEnvioActual = COSTES_ENVIO[regionEnvio];
  const totalAbsoluto = subtotal + costeEnvioActual;

  const gestionarPago = async () => {
    try {
      if (!email.trim() || !nombre.trim() || !calle.trim() || !localidad.trim() || !codigoPostal.trim() || !provinciaOId) {
        alert(t("alert_campos"));
        return;
      }
      setCargando(true);
      const direccionEstructurada = { calle, localidad, codigoPostal, regionUbicacion: provinciaOId, paisBase: regionEnvio === "internacional" ? provinciaOId : "España" };
      const respuesta = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, metodoPago, regionEnvio, costeEnvio: costeEnvioActual, datosCliente: { email, nombre, direccion: direccionEstructurada } }),
      });
      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.error || t("alert_error"));
      if (datos.url) window.location.href = datos.url;
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || t("alert_error"));
    } finally {
      setCargando(false);
    }
  };

  if (lines.length === 0) return <p className="text-center p-10 text-stone-500">{t("vacio")}</p>;

  return (
    <div className="space-y-10">
      <ul className="space-y-6">
        {lines.map((line) => (
          <li key={line.productId} className="flex gap-6 rounded-2xl border border-stone-200/80 bg-white/80 p-5 ring-1 ring-stone-100">
            <div className="shrink-0 w-24 h-24 overflow-hidden rounded-xl bg-stone-100">
              <img src={line.imagen} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-medium text-stone-900">{line.nombre}</h2>
                <span className="inline-block text-[11px] uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md mt-1 font-medium">
                  {t("pieza_unica")}
                </span>
                <p className="text-stone-900 font-medium tabular-nums mt-2">{formatEUR(line.precioUnit)}</p>
              </div>
              <button type="button" onClick={() => removeLine(line.productId)} className="text-sm text-stone-400 hover:text-stone-900 underline">
                {t("quitar")}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="space-y-4">
        <h3 className="text-sm uppercase tracking-widest text-stone-500 font-medium">{t("envio_titulo")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button type="button" onClick={() => setRegionEnvio("peninsula")} className={`p-4 rounded-xl border text-center transition-all ${regionEnvio === "peninsula" ? "border-stone-900 bg-stone-900/5 ring-1 ring-stone-900" : "border-stone-200 bg-white/50"}`}>
            <span className="font-medium text-stone-900 text-sm block">{t("peninsula_nombre")}</span>
            <span className="text-xs text-stone-500 mt-1 block">{t("peninsula_info")}</span>
          </button>
          <button type="button" onClick={() => setRegionEnvio("islas")} className={`p-4 rounded-xl border text-center transition-all ${regionEnvio === "islas" ? "border-stone-900 bg-stone-900/5 ring-1 ring-stone-900" : "border-stone-200 bg-white/50"}`}>
            <span className="font-medium text-stone-900 text-sm block">{t("islas_nombre")}</span>
            <span className="text-xs text-stone-600 mt-1 block">+{formatEUR(COSTES_ENVIO.islas)}</span>
          </button>
          <button type="button" onClick={() => setRegionEnvio("internacional")} className={`p-4 rounded-xl border text-center transition-all ${regionEnvio === "internacional" ? "border-stone-900 bg-stone-900/5 ring-1 ring-stone-900" : "border-stone-200 bg-white/50"}`}>
            <span className="font-medium text-stone-900 text-sm block">{t("inter_nombre")}</span>
            <span className="text-xs text-stone-600 mt-1 block">+{formatEUR(COSTES_ENVIO.internacional)}</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm uppercase tracking-widest text-stone-500 font-medium">{t("pago_titulo")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button type="button" onClick={() => setMetodoPago("stripe")} className={`p-5 rounded-xl border text-left transition-all ${metodoPago === "stripe" ? "border-stone-900 bg-stone-900/5 ring-1 ring-stone-900" : "border-stone-200 bg-white/50"}`}>
            <span className="font-medium text-stone-900 block">{t("stripe_nombre")}</span>
            <p className="text-xs text-stone-500 mt-1">{t("stripe_info")}</p>
          </button>
          <button type="button" onClick={() => setMetodoPago("transferencia")} className={`p-5 rounded-xl border text-left transition-all ${metodoPago === "transferencia" ? "border-stone-900 bg-stone-900/5 ring-1 ring-stone-900" : "border-stone-200 bg-white/50"}`}>
            <span className="font-medium text-stone-900 block">{t("trans_nombre")}</span>
            <p className="text-xs text-stone-500 mt-1">{t("trans_info")}</p>
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 md:p-8 space-y-4">
        <div className="border-b pb-3 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <h3 className="text-sm uppercase tracking-widest text-stone-500 font-medium">{t("datos_titulo")}</h3>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-stone-100 text-stone-800 self-start md:self-auto">
            📍 {t("modalidad")}: {regionEnvio === "peninsula" ? t("peninsula_nombre") : regionEnvio === "islas" ? t("islas_nombre") : t("inter_nombre")}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-stone-500 block mb-1">{t("label_nombre")}</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder={t("placeholder_nombre")} className="w-full px-4 py-2 rounded-xl border border-stone-300 text-sm text-stone-900 focus:border-stone-900 outline-none" />
          </div>
          <div>
            <label className="text-xs text-stone-500 block mb-1">{t("label_email")}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("placeholder_email")} className="w-full px-4 py-2 rounded-xl border border-stone-300 text-sm text-stone-900 focus:border-stone-900 outline-none" />
          </div>
        </div>
        <div>
          <label className="text-xs text-stone-500 block mb-1">{t("label_direccion")}</label>
          <input type="text" value={calle} onChange={(e) => setCalle(e.target.value)} placeholder={t("placeholder_direccion")} className="w-full px-4 py-2 rounded-xl border border-stone-300 text-sm text-stone-900 focus:border-stone-900 outline-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-stone-500 block mb-1">{t("label_ciudad")}</label>
            <input type="text" value={localidad} onChange={(e) => setLocalidad(e.target.value)} placeholder={t("placeholder_ciudad")} className="w-full px-4 py-2 rounded-xl border border-stone-300 text-sm text-stone-900 focus:border-stone-900 outline-none" />
          </div>
          <div>
            <label className="text-xs text-stone-500 block mb-1">{t("label_cp")}</label>
            <input type="text" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} placeholder={t("placeholder_cp")} className="w-full px-4 py-2 rounded-xl border border-stone-300 text-sm text-stone-900 focus:border-stone-900 outline-none" />
          </div>
          <div>
            <label className="text-xs text-stone-500 block mb-1">{regionEnvio === "internacional" ? t("label_pais") : t("label_provincia")}</label>
            <select value={provinciaOId} onChange={(e) => setProvinciaOId(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-stone-300 text-sm text-stone-900 focus:border-stone-900 outline-none cursor-pointer">
              <option value="">{t("sel_opcion")}</option>
              {regionEnvio === "peninsula" && PROVINCIAS_PENINSULA.map((p) => <option key={p} value={p}>{p}</option>)}
              {regionEnvio === "islas" && PROVINCIAS_ISLAS.map((p) => <option key={p} value={p}>{p}</option>)}
              {regionEnvio === "internacional" && PAISES_INTERNACIONAL.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-stone-100/40 p-6 space-y-4">
        <div className="flex justify-between border-b pb-3 text-xs uppercase text-stone-500">
          <span>{t("subtotal_texto")}</span>
          <span className="text-base text-stone-900">{formatEUR(subtotal)}</span>
        </div>
        <div className="flex justify-between border-b pb-3 text-xs uppercase text-stone-500">
          <span>{t("envio_texto")} ({regionEnvio === "peninsula" ? t("peninsula_nombre") : regionEnvio === "islas" ? t("islas_nombre") : t("inter_nombre")})</span>
          <span className="text-sm font-medium text-stone-800">{costeEnvioActual === 0 ? t("gratis_texto") : formatEUR(costeEnvioActual)}</span>
        </div>
        <div className="flex justify-between pt-2 text-sm uppercase text-stone-600 font-medium">
          <span>{t("total_texto")}</span>
          <span className="text-2xl font-light text-stone-900">{formatEUR(totalAbsoluto)}</span>
        </div>
        <div className="flex justify-between items-center pt-4">
          <button type="button" onClick={clearCart} disabled={cargando} className="text-sm text-stone-600 underline">{t("vaciar_texto")}</button>
          <button type="button" onClick={gestionarPago} disabled={cargando} className="rounded-full bg-stone-900 text-stone-50 px-8 py-3 text-sm uppercase tracking-widest hover:bg-stone-800">
            {cargando ? t("cargando_texto") : metodoPago === "stripe" ? t("btn_stripe") : t("btn_trans")}
          </button>
        </div>
      </div>
    </div>
  );
}