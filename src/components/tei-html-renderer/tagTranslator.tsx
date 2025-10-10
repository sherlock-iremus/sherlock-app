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
        case 'body': return <span className={'tei-' + tag}>{N}</span>
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
            return <span className='tei-note-wrapper'>
                <div className={'tei-' + tag + ' ' + 'tei-' + tag + '-' + respClass} onClick={() => noteClickHandler(computeNode)}>{N}</div>
            </span>
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
        case 'TEI': return <span className={'tei-' + tag}>{N}</span>
        case 'teiHeader': return <span className={'tei-' + tag}>{N}</span>
        case 'text': return <span className={'tei-' + tag}>{N}</span>
        case 'title': return <span className={'tei-' + tag}>{N}</span> // bold
        case 'seg': return ''
        default: return <div className={'tei-' + tag} style={{ 'backgroundColor': 'red' }} id={node.tag}>{N}</div>
    }
}

/*
bibl                http://localhost:5173/sherlock/?resource=http://data-iremus.huma-num.fr/id/cf4d646f-b379-459f-829d-409bbf5f1864
quote               http://localhost:5173/sherlock/?resource=http://data-iremus.huma-num.fr/id/08a48f8a-b519-44a7-b159-2a8a1441b60e
note auteur         http://localhost:5173/sherlock/?resource=http://data-iremus.huma-num.fr/id/0ece3f25-debe-4da8-9ab7-67768bb139b5
note editor         http://localhost:5173/sherlock/?resource=http://data-iremus.huma-num.fr/id/cf4d646f-b379-459f-829d-409bbf5f1864
                    http://localhost:5173/sherlock/?resource=http://data-iremus.huma-num.fr/id/694a0aac-e469-4031-8bda-e5934744173c
note applf          http://localhost:5173/sherlock/?resource=http://data-iremus.huma-num.fr/id/cf4d646f-b379-459f-829d-409bbf5f1864
note dans texte     http://localhost:5173/sherlock/?resource=http://data-iremus.huma-num.fr/id/4a42d198-13cf-4f2b-8212-7240e2a5ae5b
vers espacements    http://localhost:5173/sherlock/?resource=http://data-iremus.huma-num.fr/id/687e4d0f-31f2-41dd-a39d-da372049e9a9
renvoi interne      http://localhost:5173/sherlock/?resource=http://data-iremus.huma-num.fr/id/9a8c30b5-a2bd-47e9-a04f-7a3de57bfc3c
ital dans texte     http://localhost:5173/sherlock/?resource=http://data-iremus.huma-num.fr/id/c4265259-70e3-4000-a2f7-52be19e88341
ital et versifié    http://localhost:5173/sherlock/?resource=http://data-iremus.huma-num.fr/id/729da985-f813-4fa5-ae45-49592c5c5985
Ital pour certains mots dans le corps du texte en rom       http://localhost:5173/sherlock/?resource=http://data-iremus.huma-num.fr/id/781046dc-ad66-4184-8b6e-28904f5e684b
*/