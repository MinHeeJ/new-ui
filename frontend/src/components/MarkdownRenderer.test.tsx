import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MarkdownRenderer from './MarkdownRenderer';

describe('MarkdownRenderer', () => {
  it('테이블, 링크, 이미지, 코드블록을 렌더링한다', async () => {
    render(<MarkdownRenderer content={`# 제목\n\n[링크](https://example.com)\n\n![대체텍스트](https://example.com/a.png)\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n\`\`\`js\nconst answer = 42;\n\`\`\``} />);

    expect(screen.getByRole('heading', { name: '제목' })).toHaveAttribute('id', '제목');
    expect(screen.getByRole('link', { name: '링크' })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('img', { name: '대체텍스트' })).toHaveAttribute('src', 'https://example.com/a.png');
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText(/answer/).closest('code')).toHaveClass('hljs');
  });

  it('rehype-sanitize로 위험 HTML을 차단한다', () => {
    const { container } = render(<MarkdownRenderer content={'<script>alert("xss")</script><img src="x" onerror="alert(1)" alt="safe" />'} />);

    expect(container.querySelector('script')).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'safe' })).not.toHaveAttribute('onerror');
  });
});
