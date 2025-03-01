import React, { createContext, use, useMemo } from "react";
import type { PropsWithChildren } from "react";
import { forwardAttributes } from "./Behavior";

export interface TEIComponentProps {
  element: HTMLElement, 
  content?: React.ReactNode[]
}

export interface TEIComponentMap {
  [tagName: string]: React.ComponentType<TEIComponentProps>;
}

const ComponentMapContext = createContext<TEIComponentMap>({});

interface ComponentMapProviderProps {
  componentMap: TEIComponentMap;
}

export const ComponentMapProvider: React.FC<PropsWithChildren<ComponentMapProviderProps>> = ({ componentMap, children }) => {
  const memoizedMap = useMemo(() => componentMap, [componentMap]);

  return <ComponentMapContext value={memoizedMap}>{children}</ComponentMapContext>;
};

const useComponentMap = () => use(ComponentMapContext);

export const TEINode = ({ node }: { node: Node }) => {
  const componentMap = useComponentMap();

  // nodeType 3 is Node.TEXT_NODE
  if (node.nodeType === 3) {
    return node.textContent;
  }

  // nodeType 1 is Node.ELEMENT_NODE
  if (node.nodeType === 1) {
    const el = node as HTMLElement;
    // CETEIcean generates <style> from <tei:rendition>;
    // make sure it's not processed further or hydration errors may occur
    if(el.tagName === 'style') {
      return node.textContent
    }
    const Component = componentMap[el.tagName.toLowerCase()];
    const children = Array.from(el.childNodes).map((child, index) => (
      <TEINode key={index} node={child} />
    ));
    if (Component) {
      return <Component element={el} content={children}/>;
    }
    return React.createElement(el.tagName.toLowerCase(), forwardAttributes(el.attributes), children)
  }

  return null;
};

export const TEINodes = ({ nodes }: { nodes: Node[] | NodeListOf<ChildNode> }) => {
  return Array.from(nodes).map((child, index) => (
    <TEINode key={index} node={child} />
  ));
}

