import { Fragment } from 'react'
import { ParsedLeaf, ParsedNode } from './TEIHTMLRenderer'

function computeNode(node: ParsedNode, noteClickHandler: any) {
    return <Fragment>
        {node.children.map(item => {
            return ((item as ParsedLeaf).text || (item as ParsedLeaf).text === '')
                ? <Fragment key={item.id}>
                    {(item as ParsedLeaf).text}
                </Fragment>
                : <Fragment key={item.id}>
                    {tagTranslate((item as ParsedNode).tag, item as ParsedNode, noteClickHandler)}
                </Fragment>
        })}
    </Fragment>
}

export function tagTranslate(tag: any, node: ParsedNode, noteClickHandler: any) {
    const N = computeNode(node, noteClickHandler)
    switch (tag) {
        case 'ab': return <span className={'tei-' + tag}>{N}</span>
        case 'bibl': return <div className={'tei-' + tag}>{N}</div>
        case 'biblScope': return <span className={'tei-' + tag}>{N}</span>
        case 'date': return <span className={'tei-' + tag}>{N}</span>
        case 'div': return <div className={'tei-' + tag}>{N}</div>
        case 'figure': return <div className={'tei-' + tag}>{N}</div>
        case 'graphic':
            return <img className={'tei-' + tag} style={{ width: '100%' }}
                src={'https://github.com/OBVIL/mercure-galant/blob/gh-pages/' + (node.attributes as any).url + '?raw=true'}
            />
        case 'head':
            return <h1 className={'tei-' + tag}>{N}</h1>
        case 'hi': return <span className={'tei-' + tag}>{N}</span>
        case 'l': return <div className={'tei-' + tag}>{N}</div>
        case 'lb': return <br />
        case 'lg': return <div className={'tei-' + tag}>{N}</div>
        case 'label': return <div className={'tei-' + tag}>{N}</div>
        case 'note':
            let respClass = ''
            if ('resp' in node.attributes && node.attributes.resp === 'editor') respClass = 'editor'
            if ('resp' in node.attributes && node.attributes.resp === 'author') respClass = 'author'
            return <div className={'tei-' + tag + ' ' + 'tei-' + tag + '-' + respClass} onClick={() => noteClickHandler(computeNode)}>{N}</div>
        case 'p': return <p className={'tei-' + tag}>{N}</p>
        case 'quote': return <div className={'tei-' + tag}>{N}</div>
        case 'ref':
            if ((node.attributes as any)?.target) {
                return <a className={'tei-' + tag}
                    href={
                        'https://github.com/OBVIL/mercure-galant/blob/gh-pages/'
                        + (node.attributes as any).target
                        + '?raw=true'
                    }
                >
                    {N}
                </a>
            } else {
                return <a className={'tei-' + tag}>
                    {N}
                </a>
            }
        case 'space': return <span className={'tei-' + tag}>{N}</span> // mr 4
        case 'title': return <span className={'tei-' + tag}>{N}</span> // bold
        case 'seg': return ''
        default: return <div className={'tei-' + tag} style={{ 'backgroundColor': 'red' }} id={node.tag}>{N}</div>
    }
}