import { useEffect, useState } from "react"
import TEINode from "./TEINode"
import { xmlToJson } from "./utils"

export interface ParsedNode {
  id: string,
  tag: string,
  attributes: object,
  children: ParsedTEIItem[],
}

export interface ParsedLeaf {
  id: string,
  text: string
}

export type ParsedTEIItem = ParsedLeaf | ParsedNode

export const TEIHTMLRenderer: React.FC<{
  TEIDocumentURL: string,
  setNote: (e: any) => void,
}> = ({ TEIDocumentURL, setNote }) => {
  const [TEIRoot, setTEIRoot] = useState<ParsedTEIItem[]>([])

  useEffect(() => {
    fetch(TEIDocumentURL).then((response) =>
      response.text().then((articleXML) => {
        const TEI = xmlToJson(articleXML)
        setTEIRoot([TEI])
      }).catch(e => console.warn("Error during XML JSONification :", e))
    ).catch(e => console.warn("Error during TEIDocumentURL fetching (", TEIDocumentURL, ')', e))
  }, [TEIDocumentURL, setNote])

  return (
    <div>
      {TEIRoot.map((item, index) => (
        <TEINode key={'root' + index} item={item} setNote={setNote} />
      ))}
    </div>
  )
}