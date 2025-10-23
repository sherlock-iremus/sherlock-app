import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'

export default function MarkdownFromUrl({ url }: { url: string }) {
    const [content, setContent] = useState<string>('Loading...')

    useEffect(() => {
        fetch(url)
            .then((res) => res.text())
            .then(setContent)
            .catch(() => setContent('❌ Impossible de charger le fichier Markdown.'))
    }, [url])

    return (
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
            {content}
        </ReactMarkdown>
    )
}