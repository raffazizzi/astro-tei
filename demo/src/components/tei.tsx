import React from "react";
import BasicRouter from '@astro-tei/react';
import { DefaultBehaviors } from "@astro-tei/react";
import type { IRoutes } from "@astro-tei/react";
import Pb from './pb';

interface Props {
  doc: Document
  data: string
  elements: string[]
}

export default function TEI({doc, data, elements}: Props) {
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

  // Support server side and client side DOM processing.
  const usableDoc = typeof DOMParser !== 'undefined' ? (new DOMParser()).parseFromString(data, "text/xml") : doc;

  return <BasicRouter doc={usableDoc} elements={elements} routes={routes} />
}