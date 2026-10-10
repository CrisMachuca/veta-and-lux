'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

interface FadeInProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  scale?: number;
}

// Desplazamiento inicial según la dirección
const DESPLAZAMIENTO = {
  up: '0px, 40px',
  down: '0px, -40px',
  left: '40px, 0px',
  right: '-40px, 0px',
  none: '0px, 0px',
};

// Aparición al entrar en pantalla con CSS (clase .reveal en globals.css) en lugar de framer-motion:
// misma interfaz, mucho menos JavaScript. Sin JavaScript o con «reducir movimiento», el contenido se ve sin animar.
export default function FadeIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  scale = 1
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { rootMargin: '0px 0px -50px 0px' }
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  const estilo = {
    '--reveal-desplazamiento': DESPLAZAMIENTO[direction],
    '--reveal-escala': scale,
    '--reveal-retraso': `${delay}s`,
    '--reveal-duracion': `${duration}s`,
  } as CSSProperties;

  return (
    <div ref={ref} className={visible ? 'reveal reveal-visible' : 'reveal'} style={estilo}>
      {children}
    </div>
  );
}
