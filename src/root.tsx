import type { ReactElement, ReactNode } from "react";
import type { Route } from "./+types/root";
import { useEffect } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { Expanded } from "./components/recipes/atomic/Expanded";
import { StyledToast } from "./components/Toast";
import { $sharedData } from "./lib/utils/shared-data";
import { toaster } from "./lib/utils/toaster";
import stylesheet from "./styles/index.css?url";
import "@fontsource/kaisei-decol";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export function Layout({ children }: { children: ReactNode }): ReactElement {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function (): ReactElement {
  useEffect(() => {
    const unsubscribe = $sharedData.subscribe((next, prev) => {
      if (prev == null) {
        return;
      }

      if (next.budget !== prev.budget) {
        toaster.create({
          id: "budget-updated",
          title: "予算が更新されました",
          description: `¥${prev.budget.toLocaleString()} → ¥${next.budget.toLocaleString()}`,
          type: "info",
        });
      }
    });

    return (): void => {
      unsubscribe();
    };
  }, []);

  return (
    <Expanded basedOn="screen" items="center">
      <Outlet />
      <StyledToast />
    </Expanded>
  );
}
