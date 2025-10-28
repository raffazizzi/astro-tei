import CETEI from "CETEIcean";
const { createRequire } = await import("module");
const require = createRequire(import.meta.url);
const {JSDOM} = require("jsdom")

export interface ProcessedTei {
  dom: Document;
  ceteicean: typeof CETEI;
  serialized: string;
  elements: string[];
}

const processTei = (data: string): ProcessedTei => {
  const jdom = new JSDOM(data, { contentType: "text/xml" });
  const teiDoc = jdom.window.document;

  const ceteicean = new CETEI({
    documentObject: teiDoc,
  });

  const teiData = ceteicean.preprocess(teiDoc);
  teiData.firstElementChild.setAttribute("data-elements", Array.from(ceteicean.els).join(","));

  // Replace input JSDOM tree with new tree so that we can use the JSDOM native serialize method.
  teiDoc.documentElement.replaceWith(teiData);

  return {
    dom: teiDoc,
    ceteicean,
    serialized: jdom.serialize(),
    elements: Array.from(ceteicean.els) as string[]
  };
};

export { processTei as default, processTei };