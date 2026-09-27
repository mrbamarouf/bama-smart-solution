import { Navigate, Outlet, useParams } from "react-router-dom";
import { isLanguage } from "../types";
import { LanguageProvider } from "./LanguageProvider";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { lazy } from "react";
import { useMobileViewport } from "../mobile/useMobileViewport";

const MobileSite = lazy(() => import("../mobile/MobileSite"));

export function LocalizedLayout() {
  const { lang } = useParams();
  const mobile = useMobileViewport();

  if (!isLanguage(lang)) return <Navigate to="/en" replace />;

  return (
    <LanguageProvider language={lang}>
      {mobile ? (
        <MobileSite language={lang} />
      ) : (
        <>
          <SiteHeader language={lang} />
          <main>
            <Outlet />
          </main>
          <SiteFooter language={lang} />
        </>
      )}
    </LanguageProvider>
  );
}
