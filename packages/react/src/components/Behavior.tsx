import React from "react";
import type { JSX, PropsWithChildren } from "react";
import { hideContent } from "CETEIcean/utilities.js";

interface BehaviorProps {
  node: Node;
  keepOriginal?: boolean;
  rewriteIds?: boolean;
}

export default function Behavior({children, node, keepOriginal = true, rewriteIds = true}
  : PropsWithChildren<BehaviorProps>) {

  let hiddenOriginal: JSX.Element | null = null;

  if (keepOriginal) {
    
    hiddenOriginal = React.createElement("cetei-original",
      {hidden: "", "data-original": ""},
      hideContent(node, rewriteIds)
    );
  }
  
  return <>{hiddenOriginal}{children}</>
}
