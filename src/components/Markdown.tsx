import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { Link } from 'react-router-dom';
import { rehypePlaceholders, rehypeSectionize } from '../lib/markdown';

const isExternal = (href: string) => /^https?:\/\//i.test(href);

const components: Components = {
  a({ href = '', children, node: _node, ...rest }) {
    if (isExternal(href)) {
      const bare = typeof children === 'string' && children === href;
      return (
        <a {...rest} href={href} target="_blank" rel="noopener noreferrer" className={bare ? 'ext bare' : 'ext'}>
          {children}
        </a>
      );
    }
    if (href.startsWith('/')) return <Link to={href}>{children}</Link>;
    return <a {...rest} href={href}>{children}</a>;
  },
  table({ children, node: _node, ...rest }) {
    return (
      <div className="table-wrap" tabIndex={0} role="region" aria-label="Scrollable table">
        <table {...rest}>{children}</table>
      </div>
    );
  },
  input({ node: _node, ...rest }) {
    if (rest.type === 'checkbox') {
      return <input {...rest} aria-label={rest.checked ? 'Done' : 'Not done'} />;
    }
    return <input {...rest} />;
  },
};

export default function Markdown({ md }: { md: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap', properties: { className: ['heading-anchor'] } }],
        rehypePlaceholders,
        rehypeSectionize,
      ]}
      components={components}
    >
      {md}
    </ReactMarkdown>
  );
}
