# :rocket: Astro TEI - React

An Astro component for publishing TEI as Custom Elements powered by [CETEIcean](https://github.com/TEIC/CETEIcean).

This utility provides the React version of CETEIcean's default behaviors and provides a way of mapping your own React components to TEI elements.

We recommend using the companion [Astro TEI Component](https://github.com/raffazizzi/astro-tei#readme) to pre-process a TEI string on the server side (during SSR or SSG) with the utility `processTEI()`. The React components included in this package are best used to provide reactive components starting from the pre-processed DOM, which can themselves be pre-rendered or hydrated following React's and Astro's conventions.

## Installation

We recommend using this together with `astro-tei` and `jsdom`.

```sh
npm install @astro-tei/react astro-tei jsdom --save-dev
```

## Basic Usage

You will want to load TEI data and pre-process it before passing it to the React component. We suggest relying on Astro TEI component to handle this process, as shown below. 

The Astro TEI Component provides the utility `processTEI()` to pre-process the TEI and return a `JSDOM` serializable object.

```astro
---
import { TeiBaseStyle, processTei } from 'astro-tei';
import BasicRouter from '@astro-tei/react';

// Load TEI data with a dynamic import.
// One could also use Node's library fs to get the file's content.
const teiFile = (await import("someTEI.xml?raw")).default;

// processTEI() will pre-process the TEI and return an object:
// {
//   dom: Document,
//   serialized: string,
//   elements: string[]
// }
const tei = processTei(teiFile);
---

<!-- CETEIcean's default example CSS is bundled in another component
  for convenience and can be optionally added as shown above.
  Other custom styles can be added by importing CSS files or
  through your preferred method. -->
<TeiBaseStyle/>

<!-- BasicRouter provides CETEIcean's default behaviors as React components
  that can all be rendered on the server.
  For new components that need to run client-side code, use client:*,
  e.g. client:load (see more instructions below). -->
<BasicRouter elements={elements} tei={tei} />
```

## Adding custom React components

In order to provide your own React components, you'll need to wrap `<BasicRouter>` in a React component that can import and map (route) your components to TEI element names. In Astro, import your wrapper component instead of `<BasicRouter>`.

```tsx
import React from "react";
import BasicRouter from '@astro-tei/react';

// You can still use the Default Behaviors!
import { DefaultBehaviors } from "@astro-tei/react";
import type { TEIComponentMap } from "@astro-tei/react";

// Here is a custom component for tei-pb with some fun reactivity!
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

  const routes: TEIComponentMap = {
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

  // Pass the new Routes to BasicRouter; here you can also add more React for handling State, Context, and more!
  return <BasicRouter elements={elements} tei={tei} routes={routes}/>;
}
```