// El Studio de Sanity tiene su propio <html>: el layout raíz solo pasa el contenido
export default function StudioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
