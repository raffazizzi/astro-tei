import React, { type JSX } from "react";
import { Behavior } from "@astro-tei/react";

interface TEIProps {
  teiNode: Node,
  availableRoutes?: string[]
}

export type PbBehavior = (props: TEIProps) => JSX.Element | null;

const Pb: PbBehavior = ({teiNode}: TEIProps) => {

  const pb = teiNode as Element
  const n = pb.getAttribute('n') || ''
  const facRef = pb.getAttribute('facs') || ''

  const [expanded, setExpanded] = React.useState(false)
  const handleChange = () => {
    setExpanded(!expanded)
  }

  if (n) {
    return (
      <Behavior node={teiNode}>
        <div id="accordionExample" className="grid">
          {expanded ? null : 
            <img src={facRef} alt={`Image of page ${n}`} className="w-full my-4 mx-0 z-0 h-[54px] opacity-[0.4] overflow-clip object-cover" style={{gridArea: "1/1"}}/>
          }
          <div style={{
            width: '100%',
            margin: '1em 0',
            gridArea: "1/1",
            position: "relative",
            zIndex: 1,
            backgroundColor: 'transparent',
          }}
            className="rounded-t-lg border border-neutral-200">
            <h2 className="mb-0" id="headingOne">
              <button
                className="group relative flex w-full items-center rounded-t-[15px] border-0 py-4 px-5 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white"
                type="button"
                data-te-collapse-init
                data-te-target="#collapseOne"
                aria-expanded={expanded}
                aria-controls="collapseOne"
                onClick={() => handleChange()}
                >
                <span className="font-bold">Page {n}</span>
                <span
                  className={`ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out ${!expanded ? "rotate-[-180deg]" : ""} fill-[#212529] motion-reduce:transition-none dark:fill-blue-300`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </button>
            </h2>
            <div
              id="collapseOne"
              className={!expanded ? `hidden` : `block`}
              aria-labelledby="headingOne"
              data-te-parent="#accordionExample">
              <div className="py-4 px-5">
                <img src={facRef} alt={`Image of page ${n}`}/>
              </div>
            </div>
          </div>
        </div>
      </Behavior>    
    )
  }
  return null
}

export default Pb
