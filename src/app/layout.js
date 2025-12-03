import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Ferretería Inventario",
  description: "Sistema de gestión de inventarios para ferreterías PYME",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
