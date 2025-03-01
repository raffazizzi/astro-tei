import React from "react";
import type { JSX, PropsWithChildren } from "react";

interface BehaviorProps {
  node: Node;
  className?: string;
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

export default function Behavior({children, node, className, keepOriginal = true, rewriteIds = true}
  : PropsWithChildren<BehaviorProps>) {

  const el = node as HTMLElement;
  if (!el.tagName) {
    throw new Error("Behavior component must be passed an Element node.");
  }
  let hiddenOriginal: JSX.Element | null = null;

  if (keepOriginal) {
    const hiddenContent = hideContent(el, rewriteIds).outerHTML
      .replace(/<([^\s/]+)([^>]*?)\/>/gm, "<$1$2></$1>"); // expand self closing elements
    hiddenOriginal = React.createElement("cetei-original",
      {
        "hidden": "",
        "data-original": "",
        dangerouslySetInnerHTML: {__html: hiddenContent}
      }
    );
  }

  const classAtt: Record<string, string> = {}
  if (className) {
    classAtt.className = className;
  }
  const attributes: Record<string, string> = Object.assign(classAtt, forwardAttributes(el.attributes))
  
  return React.createElement(el.tagName, 
    attributes,
    hiddenOriginal,
    children);
}
