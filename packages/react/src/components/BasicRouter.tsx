import React, { useEffect } from "react";
import { defineCustomElement } from "CETEIcean/utilities.js";
import {TEINode, ComponentMapProvider } from "./TEINode";
import type { TEIComponentMap } from "./TEINode";

import {
  Tei,
  Eg,
  Graphic,
  List,
  Note,
  Ptr,
  Ref,
  TeiHeader,
} from "./DefaultBehaviors";

type BasicRouterProps = {
  tei: string
  elements: string[]
  routes?: TEIComponentMap
};

// Support server side and client side DOM processing.
let localParser: (data: string) =>  Document;

// @ts-expect-error: env is not recognized by the linter on import.meta, but we need this for SSR.
if (import.meta.env.SSR) {
  const { createRequire } = await import("module");
  const require = createRequire(import.meta.url);
  const {JSDOM} = require("jsdom")
  localParser = (data) => {
    const j = new JSDOM(data, { contentType: "text/xml" })
    return j.window.document
  }
} else {
  localParser = (data) => {
    return (new DOMParser()).parseFromString(data, "text/xml")
  }
}

export default function BasicRouter({tei, elements, routes}: BasicRouterProps) {
  const teiDom = localParser(tei)

  useEffect(() => {
    for (const el of elements) {
      defineCustomElement(el);
    }
  });

  const defaultRoutes: TEIComponentMap = {
    "tei-tei": Tei,
    "teieg-egxml": Eg,
    "tei-graphic": Graphic,
    "tei-list": List,
    "tei-note": Note,
    "tei-ptr": Ptr,
    "tei-ref": Ref,
    "tei-teiheader": TeiHeader
  };

  return <ComponentMapProvider componentMap={routes ? routes : defaultRoutes}>
    <TEINode node={teiDom.documentElement} />
  </ComponentMapProvider>
}
