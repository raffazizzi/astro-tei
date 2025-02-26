import React from "react";
import type { JSX, PropsWithChildren } from "react";

interface BehaviorProps {
  node: Node;
  keepOriginal?: boolean;
  rewriteIds?: boolean;
}

function hideContent(root: HTMLElement, rewriteIds: boolean = true): HTMLElement {
  const elements = root.querySelectorAll("*");
  elements.forEach((element) => {
    element.setAttribute("data-processed", "");
    if (rewriteIds && element.id) {
      element.setAttribute("data-origid", element.id);
      element.removeAttribute("id");
    }
  });
  return root;
}

export const forwardAttributes = (atts: NamedNodeMap) => {
  return Array.from(atts).reduce<Record<string, string>>((acc, att) => {
    acc[att.name === "ref" ? "Ref" : att.name] = att.value;
    return acc;
  }, {});
};

export default function Behavior({children, node, keepOriginal = true, rewriteIds = true}
  : PropsWithChildren<BehaviorProps>) {

  const el = node as HTMLElement;
  if (!el.tagName) {
    throw new Error("Behavior component must be passed an Element node.");
  }
  let hiddenOriginal: JSX.Element | null = null;

  if (keepOriginal) {
    hiddenOriginal = React.createElement("cetei-original",
      {
        hidden: "",
        "data-original": "",
        dangerouslySetInnerHTML: {__html: hideContent(el, rewriteIds).outerHTML}
      }
    );
  }
  
  return React.createElement(el.tagName, forwardAttributes(el.attributes), hiddenOriginal, children);
}
