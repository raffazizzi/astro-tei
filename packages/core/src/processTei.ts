import { JSDOM } from "jsdom";
import CETEI from "CETEIcean";

const processTei = (data: string): JSDOM => {
  const jdom = new JSDOM(data, { contentType: "text/xml" });
  const teiDoc = jdom.window.document;

  const ceteicean = new CETEI({
    documentObject: teiDoc,
  });

  const teiData = ceteicean.preprocess(teiDoc);
  teiData.firstElementChild.setAttribute("data-elements", Array.from(ceteicean.els).join(","));

  // Replace input JSDOM tree with new tree so that we can use the JSDOM native serialize method.
  teiDoc.documentElement.replaceWith(teiData);

  return jdom;
};

export { processTei as default, processTei };
