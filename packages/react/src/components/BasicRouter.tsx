import React, { useEffect, type JSX } from "react";
import { TEIRender, TEIRoute } from "react-teirouter";

import { defineCustomElement } from "CETEIcean/utilities.js";

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

type Props = {
  doc: Document;
  elements: string[];
  routes?: Routes;
};

export interface Routes {
  [key: string]: TBehavior | JSX.Element;
};

export default function BasicRouter({ doc, elements, routes }: Props) {
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

  return <TEIRender data={doc.documentElement}>{teiRoutes}</TEIRender>;
}
