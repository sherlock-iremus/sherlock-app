import type React from "react";

import { Link } from "@heroui/link";
import { Trans, useTranslation } from "react-i18next";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-col h-screen">
      <main className="flex-grow mx-auto px-6 pt-16 max-w-7xl container">
        {children}
      </main>
      <footer className="flex justify-center items-center py-3 w-full">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://heroui.com"
          title={t("heroui-com-homepage")}
        >
          <span className="text-default-600">
            <Trans ns="base">powered-by</Trans>
          </span>
          <p className="text-primary">HeroUI</p>
        </Link>
      </footer>
    </div>
  );
}
