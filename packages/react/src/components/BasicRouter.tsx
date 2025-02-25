import React, { useEffect } from "react";
import type { JSX } from "react";
import { defineCustomElement } from "CETEIcean/utilities.js";
import { TEIRender, TEIRoute } from "react-teirouter";

import {
  type TBehavior,
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
  routes?: Routes
};

export interface Routes {
  [key: string]: TBehavior | JSX.Element;
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

  const defaultRoutes: Routes = {
    "tei-tei": Tei,
    "teieg-egxml": Eg,
    "tei-graphic": Graphic,
    "tei-list": List,
    "tei-note": Note,
    "tei-ptr": Ptr,
    "tei-ref": Ref,
    "tei-teiheader": TeiHeader,
  };

  const _routes = routes ? routes : defaultRoutes;

  const teiRoutes = Object.keys(_routes).map((el, i) => {
    return <TEIRoute el={el} component={_routes[el]} key={`tr-${i}`} />;
  });

  return <TEIRender data={teiDom.documentElement}>{teiRoutes}</TEIRender>;
}