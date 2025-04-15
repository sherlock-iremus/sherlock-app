import { Fragment } from 'react'
import { ParsedLeaf, ParsedNode } from './TEIHTMLRenderer'

function computeNode(node: ParsedNode, setNote: any) {
    return <Fragment>
        {node.children.map(item => {
            return ((item as ParsedLeaf).text || (item as ParsedLeaf).text === '')
                ? <Fragment key={item.id}>
                    {(item as ParsedLeaf).text}
                </Fragment>
                : <Fragment key={item.id}>
                    {tagTranslate((item as ParsedNode).tag, item as ParsedNode, setNote)}
                </Fragment>
        })}
    </Fragment>
}

export function tagTranslate(tag: any, node: ParsedNode, setNote: any) {
    const N = computeNode(node, setNote)
    switch (tag) {
        case 'ab': return <span>{N}</span>
        case 'bibl': return <div>{N}</div>
        case 'biblScope': return <span>{N}</span>
        case 'date': return <span>{N}</span>
        case 'div': return <div>{N}</div>
        case 'figure': return <div>{N}</div>
        case 'graphic':
            return <img style={{ width: '100%' }}
                src={'https://github.com/OBVIL/mercure-galant/blob/gh-pages/' + (node.attributes as any).url + '?raw=true'}
            />
        case 'head': return <h1>{N}</h1>
        case 'hi': return <span>{N}</span>
        case 'l': return <div>{N}</div>
        case 'lb': return <br />
        case 'lg': return <div>{N}</div>
        case 'label': return <div>{N}</div>
        case 'note': return <span onClick={() => setNote(computeNode)}>{N}</span>
        case 'p': return <p>{N}</p>
        case 'quote': return <div className='quote'>{N}</div>
        case 'ref':
            if ((node.attributes as any)?.target) {
                return <a
                    href={
                        'https://github.com/OBVIL/mercure-galant/blob/gh-pages/'
                        + (node.attributes as any).target
                        + '?raw=true'
                    }
                    className={'ref'}
                >
                    {N}
                </a>
            } else {
                return <a>
                    {N}
                </a>
            }
        case 'space': return <span>{N}</span> // mr 4
        case 'title': return <span>{N}</span> // bold
        default: return <div style={{ 'backgroundColor': 'red' }} id={node.tag}>{N}</div>
    }
}