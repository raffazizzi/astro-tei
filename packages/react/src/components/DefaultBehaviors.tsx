import React, { type PropsWithChildren, type ReactElement } from "react";
import { serialize } from "CETEIcean/utilities.js";
import { TEINode, TEINodes } from "./TEINode"
import type { TEIComponentProps } from "./TEINode"

import Behavior, {forwardAttributes} from "./Behavior";

type ImgProps = {
  src: string;
  width?: string | number;
  height?: string | number;
};

export const SafeUnchangedNode = ({element, content}: TEIComponentProps) => {
  // Re-build an element that does not need changing
  // to avoid routes from being infinitely re-applied.
  return React.createElement(
    element.tagName.toLowerCase(),
    forwardAttributes(element.attributes),
    content)
};

export const Eg = ({element}: TEIComponentProps) => {
  let content = serialize(element, true);
  const ws = content.match(/^[\t ]+/);
  if (ws) {
    content = content.replace(new RegExp("^" + ws[0], "mg"), "");
  }
  return (
    <Behavior node={element}>
      <pre>{content}</pre>
    </Behavior>
  )
};

export const Graphic = ({element}: TEIComponentProps) => {
  const el = element as Element;
  const src = el.getAttribute("url");
  if (!src) {return null};

  const imgProps: ImgProps = { src };

  if (el.getAttribute("width")) {
    imgProps.width = el.getAttribute("width") || "";
  }

  if (el.getAttribute("height")) {
    imgProps.height = el.getAttribute("width") || "";
  }

  return (
    <Behavior node={element}>
      <img {...imgProps} />
    </Behavior>
  );
};

export const List = ({element, content}: TEIComponentProps) => {
  if (element.getAttribute("type") !== "gloss") {
    return <SafeUnchangedNode element={element} content={content} />;
  }

  const children = Array.from(element.childNodes);

  return (
    <Behavior node={element}>
      <dl>
        {children.map((child, i) => {
          if (child.nodeType !== 1) {
            return (
              <TEINode
                key={`t-${i}`}
                node={child}
              />
            );
          }
          const childEl = child as Element;
          switch (childEl.localName) {
            case "tei-label":
              return (
                <dt key={`tt-${i}`}>
                  <TEINodes nodes={childEl.childNodes} />
                </dt>
              );
            case "tei-item":
              return (
                <dd key={`td-${i}`}>
                  <TEINodes nodes={childEl.childNodes} />
                </dd>
              );
          }
        })}
      </dl>
    </Behavior>
  );
};

export const Ptr = ({element}: TEIComponentProps) => {
  const target = element.getAttribute("target") || "";
  return (
    <Behavior node={element}>
      <a href={target}>{target}</a>
    </Behavior>
  );
};

export const Ref = ({element, content}: TEIComponentProps) => {
  const target = element.getAttribute("target") || "";
  return (
    <Behavior node={element}>
      <a href={target}>{content}</a>
    </Behavior>
  );
};

// Note Context
type NoteCounterContextType = {
  n: number
  setNoteCounter: React.Dispatch<React.SetStateAction<number>>
}

const NoteCounterContext = React.createContext<NoteCounterContextType>({
  n: 0,
  setNoteCounter: () => console.warn('no note counter data provider')
})

const NoteCounterProvider = ({ children }: PropsWithChildren) => {
  const [n, setNoteCounter] = React.useState<number>(0)

  return <NoteCounterContext value={{ n, setNoteCounter }}>{children}</NoteCounterContext>;
};

export const Note = ({element, content}: TEIComponentProps) => {
  // THIS BEHAVIORS DEPENDS ON THE Tei BEHAVIOR
  if (element.getAttribute("place") !== "end") {
    return <SafeUnchangedNode element={element} content={content} />;
  }

  const id = `_note_${element.getAttribute("data-idx")}`;

  return (
    <Behavior node={element}>
      <sup>
        <a id={`src${id}`} href={`#${id}`}>
          {element.getAttribute("data-idx")}
        </a>
      </sup>
    </Behavior>
  );
};

export const Tei = ({element, content}: TEIComponentProps) => {
  const before: React.ReactElement[] = [];
  const after: React.ReactElement[] = [];

  // end notes
  const endNotes: React.ReactElement[] = Array.from(
    element.getElementsByTagName("tei-note")
  ).reduce<ReactElement[]>((acc, note: Element, i) => {
    if (note.getAttribute("place") === "end") {
      // Add an index to the note
      note.setAttribute("data-idx", (i + 1).toString());
      const id = `_note_${i + 1}`
      acc.push(
        <li id={id} key={id}>
          {<TEINodes key={`en${i}`} nodes={note.childNodes} />}
        </li>
      );
    }
    return acc;
  }, []);

  if (endNotes.length > 0) {
    after.push(
      <ol key={`endnotes-${after.length}`} className="ceteicean-notes">
        {endNotes}
      </ol>
    );
  }

  return (
    <NoteCounterProvider>
      {before}
      <SafeUnchangedNode element={element} content={content}/>
      {after}
    </NoteCounterProvider>
  );
};

export const TeiHeader = ({element}: TEIComponentProps) => {
  return <Behavior node={element} />
};
