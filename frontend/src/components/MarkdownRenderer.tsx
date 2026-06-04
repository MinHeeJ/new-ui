import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import 'highlight.js/styles/github.css';

function slug(text: any) { return String(text).toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/(^-|-$)/g, ''); }

export default function MarkdownRenderer({ content = '' }: { content?: string }) {
  return <div className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]} components={{
    h1: ({children}) => <h1 id={slug(children)}>{children}</h1>,
    h2: ({children}) => <h2 id={slug(children)}>{children}</h2>,
    h3: ({children}) => <h3 id={slug(children)}>{children}</h3>,
    a: (props) => <a {...props} target="_blank" rel="noreferrer" />,
  }}>{content}</ReactMarkdown></div>;
}
