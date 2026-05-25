import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import IdleProvider from "@/app/components/IdleProvider";
import Script from "next/script";

export const metadata = {
  title: "Ferretería Inventario",
  description:
    "Sistema de gestión de inventarios para ferreterías PYME",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <Script id="maze-script" strategy="afterInteractive">
          {`
            (function (m, a, z, e) {
              var s, t, u, v;
              try {
                t = m.sessionStorage.getItem('maze-us');
              } catch (err) {}

              if (!t) {
                t = new Date().getTime();
                try {
                  m.sessionStorage.setItem('maze-us', t);
                } catch (err) {}
              }

              u = document.currentScript || (function () {
                var w = document.getElementsByTagName('script');
                return w[w.length - 1];
              })();
              v = u && u.nonce;

              s = a.createElement('script');
              s.src = z + '?apiKey=' + e;
              s.async = true;
              if (v) s.setAttribute('nonce', v);
              a.getElementsByTagName('head')[0].appendChild(s);
              m.mazeUniversalSnippetApiKey = e;
            })(
              window,
              document,
              'https://snippet.maze.co/maze-universal-loader.js',
              'f7e27c73-2bd9-456f-a935-2c491cc58e23'
            );
          `}
        </Script>
      </head>

      <body>
        <IdleProvider>
          {children}
        </IdleProvider>

        <Toaster
          position="top-right"
          reverseOrder={false}
        />
      </body>
    </html>
  );
}