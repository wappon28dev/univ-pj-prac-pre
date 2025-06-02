import type { ReactElement } from "react";
import type { Route } from "./+types/booths.$id";
import type { Booth } from "@/lib/booth";
import { Icon } from "@iconify/react";
import { css } from "panda/css";
import { Grid, HStack, styled as p } from "panda/jsx";
import { data, Link } from "react-router";
// import ArrowBack from "virtual:icons/material-symbols/arrow-back";
// import NoteStack from "virtual:icons/material-symbols/note-stack";
import { Button } from "@/components/recipes/atomic/Button";
import { booths } from "@/lib/booth";

export function meta({ params }: Route.MetaArgs): Route.MetaDescriptors {
  const id = params.id;
  const booth = booths.find((b) => b.id === id);
  if (booth == null) {
    return [];
  }

  return [{ title: `${booth.name} | 夏祭り in 予算` }];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs): Promise<Booth> {
  const id = params.id;
  const booth = booths.find((b) => b.id === id);

  if (booth == null) {
    throw data("屋台が見つかりません", { status: 404 });
  }

  const res = await fetch(booth.src);
  if (!res.ok) {
    throw data("屋台の読み込みに失敗しました", { status: res.status });
  }

  const blob = new Blob([await res.text()], { type: "text/html" });
  booth.src = URL.createObjectURL(blob);

  return booth;
}

export default async function ({ loaderData }: Route.ComponentProps): Promise<ReactElement> {
  const booth = loaderData;

  return (
    <Grid
      gap="0"
      gridTemplateRows="1fr auto"
      h="full"
      w="full"
    >
      <p.div
        bg="bg-variant"
        w="full"
      >
        <iframe
          className={css({
            w: "full",
            h: "full",
            roundedBottom: "lg",
          })}
          sandbox="allow-scripts"
          src={booth.src}
          title={booth.name}
        >
        </iframe>
      </p.div>
      <HStack
        justifyContent="space-between"
        p="3"
        w="full"
      >
        <Link to="/" viewTransition>
          <Button size="sm" variant="text">
            <HStack>
              {/* <ArrowBack /> */}
              <Icon icon="material-symbols:arrow-back" />
              <p.p>祭り広場</p.p>
            </HStack>
          </Button>
        </Link>
        <HStack>
          {/* <NoteStack /> */}
          <Icon icon="material-symbols:note-stack" />
          <p.p fontSize="lg" fontWeight="bold">
            {booth.name}
          </p.p>
        </HStack>
        <p.div w="4em" />
      </HStack>
    </Grid>
  );
}
