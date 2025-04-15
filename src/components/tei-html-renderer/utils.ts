import { ParsedTEIItem } from "./TEIHTMLRenderer"

export function xmlToJson(xml: string): ParsedTEIItem {
  // Step 2: Parse the XML document
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xml, "application/xml")

  // Step 3: Convert XML to JSON according to custom rules
  return xmlifyElement(xmlDoc.documentElement)
}

function xmlifyElement(xml: Element): ParsedTEIItem {
  const children: ParsedTEIItem[] = []
  let textNodeRank = 1
  for (const childNode of xml.childNodes) {
    switch (childNode.nodeType) {
      case Node.ELEMENT_NODE:
        children.push(xmlifyElement(childNode as Element))
        break
      case Node.TEXT_NODE:
        const id = getPathTo(xml) + childNode.nodeName + '_' + textNodeRank + '/text()[1]'
        children.push({
          id,
          text: childNode.textContent || ''
        })
        textNodeRank++
        break
    }
  }
  return {
    id: getPathTo(xml),
    tag: xml.tagName,
    attributes: getAllAttributes(xml),
    children: children
  }
}

function getAllAttributes(node: Element) {
  const attributes: any = {}
  if (node.attributes) {
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i]
      attributes[attr.name] = attr.value
    }
  }
  return attributes
}

function getPathTo(node: Element | null | undefined): string {
  if (!node?.parentNode) return ""
  var ix = 0
  var siblings = node?.parentNode?.children
  if (siblings) {
    for (var i = 0; i < siblings?.length; i++) {
      var sibling = siblings.item(i)
      if (sibling === node)
        return (
          getPathTo(sibling?.parentElement) +
          "/" +
          node?.tagName +
          "[" +
          (ix + 1) +
          "]"
        )
      if (sibling?.nodeType === 1 && sibling?.tagName === node?.tagName) ix++
    }
  }
  return ""
}
