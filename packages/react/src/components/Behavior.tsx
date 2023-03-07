import React from "react";
import { serialize } from "CETEIcean/utilities.js";

interface Props {
  node: Node;
  children?: JSX.Element | JSX.Element[];
}

/* This is a React component that takes a node and some children as props. It returns a span element
with the original content of the node hidden from view.
Use this component when the original TEI needs to be replaced by HTML structures. */
export const Behavior = ({ children, node }: Props) => {
  // const serializer = new XMLSerializer();

  if (node.nodeType === 1) {
    const el = node as Element;
    return React.createElement(
      el.tagName,
      {},
      <>
        <span
          hidden
          aria-hidden
          data-original
          dangerouslySetInnerHTML={{ __html: serialize(el) }}
        />
        {children}
      </>
    );
  }

  return (
    <>
      <span
        hidden
        aria-hidden
        data-original
        dangerouslySetInnerHTML={{ __html: node.textContent || "" }}
      />
      {children}
    </>
  )
};
