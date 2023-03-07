# :rocket: Astro TEI

An Astro component for publishing TEI as Custom Elements powered by [CETEIcean](https://github.com/TEIC/CETEIcean).

Astro TEI will pre-process a TEI string on the server side (during SSR or SSG) and use CETEIcean on the client side to register TEI as Custom Elements and apply CETEIcean behaviors.

> Want to use React with your TEI elements? Check out the [Astro-TEI React component](https://github.com/raffazizzi/astro-tei/tree/main/packages/react#readme).

## Installation

You'll need both `astro-tei` and `jsdom` installed.

```sh
npm install astro-tei jsdom --save-dev
```

## Usage

```astro
---
import Tei from 'astro-tei';

// Load TEI data with a dynamic import.
// You can also use Node's library fs to get the file's content.
const teiFile = (await import("someTEI.xml?raw")).default;
---

<Tei data={teiFile} />

```

## Adding styles

CETEIcean's default example CSS is bundled in another component for convenience and can be optionally added as shown below. Other custom styles can be added by importing CSS files or through your preferred method.

```astro
---
import Tei, {TeiBaseStyle} from 'astro-tei';

// Load TEI data with a dynamic import.
// You can also use Node's library fs to get the file's content.
const teiFile = (await import("someTEI.xml?raw")).default;
---

<TeiBaseStyle />
<Tei data={teiFile} />

```
