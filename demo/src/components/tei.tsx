import React from "react";
import BasicRouter from '@astro-tei/react';
import { DefaultBehaviors } from "@astro-tei/react";
import type { IRoutes } from "@astro-tei/react";
import Pb from './pb';

interface TeiReactProps {
  tei: string
  elements: string[]
}

export default function TeiReact({tei, elements}: TeiReactProps) {
  const {
    Tei,
    Eg,
    Graphic,
    List,
    Note,
    Ptr,
    Ref,
    TeiHeader
  } = DefaultBehaviors;

  const routes: IRoutes = {
    "tei-tei": Tei,
    "teieg-egxml": Eg,
    "tei-graphic": Graphic,
    "tei-list": List,
    "tei-note": Note,
    "tei-ptr": Ptr,
    "tei-ref": Ref,
    "tei-teiheader": TeiHeader,
    "tei-pb": Pb,
  };

  return <BasicRouter elements={elements} tei={tei} routes={routes}/>;
}