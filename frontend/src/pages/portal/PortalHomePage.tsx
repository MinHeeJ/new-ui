import '../../index.css';
import { ArrowRight, FileText, FolderOpen, Search, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { folderApi, searchApi } from '../../api';
import { LoadingSkeleton, EmptyState, ErrorState } from '../../components/AsyncStates';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

export default function PortalHomePage() {
  const navigate = useNavigate();
  const [folders, setFolders] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const [fs, as] = await Promise.all([folderApi.getRoots(true), searchApi.search(keyword, true)]);
      setFolders(fs || []);
      setArticles(as || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function search() {
    try {
      setLoading(true);
      setArticles(await searchApi.search(keyword, true));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
        <CardContent className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <section className="flex flex-col justify-center gap-5">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              <Sparkles className="h-3.5 w-3.5" /> CMS Portal
            </span>
            <article className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                필요한 문서를 빠르게 탐색하세요.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                발행된 콘텐츠만 노출되는 안전하고 명확한 지식 포털입니다. 카테고리와 검색으로 원하는 콘텐츠를 빠르게 찾을 수 있습니다.
              </p>
            </article>
          </section>
          <Card className="rounded-2xl border border-slate-200 bg-slate-50/80 shadow-none">
            <CardHeader className="space-y-1 p-5">
              <CardTitle className="text-base font-semibold text-slate-950">문서 검색</CardTitle>
              <p className="text-sm text-slate-500">제목 또는 본문 키워드로 발행된 게시글을 검색하세요.</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 p-5 pt-0 sm:flex-row">
              <Input
                className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                icon={<Search className="h-4 w-4" />}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && search()}
                placeholder="제목 또는 본문 검색"
              />
              <Button
                className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                onClick={search}
              >
                검색
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {error && (
        <Card className="rounded-2xl border border-red-100 bg-red-50/70 p-4 shadow-none">
          <ErrorState message={error} onRetry={load} />
        </Card>
      )}

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-4 p-6">
            <section>
              <p className="text-sm font-medium text-slate-500">Published categories</p>
              <CardTitle className="mt-1 text-2xl font-bold tracking-tight text-slate-950">카테고리</CardTitle>
            </section>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">{folders.length}개</span>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {loading ? (
              <LoadingSkeleton rows={3} />
            ) : folders.length === 0 ? (
              <EmptyState title="카테고리가 없습니다." />
            ) : (
              <section className="grid gap-3">
                {folders.map((f) => (
                  <Button
                    variant="ghost"
                    className="group flex min-h-24 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md"
                    key={f.folderCode}
                    onClick={() => navigate(`/portal/folder/${f.folderCode}`)}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <FolderOpen className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <strong className="block truncate text-sm font-semibold text-slate-950">{f.title}</strong>
                        <span className="mt-1 block truncate text-sm font-normal text-slate-500">{f.description || '콘텐츠 폴더'}</span>
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
                  </Button>
                ))}
              </section>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-4 p-6">
            <section>
              <p className="text-sm font-medium text-slate-500">Latest articles</p>
              <CardTitle className="mt-1 text-2xl font-bold tracking-tight text-slate-950">최근 게시글</CardTitle>
            </section>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">{articles.length}개</span>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {loading ? (
              <LoadingSkeleton rows={6} />
            ) : articles.length === 0 ? (
              <EmptyState title="발행된 게시글이 없습니다." />
            ) : (
              <section className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200">
                {articles.map((article) => (
                  <Button
                    variant="ghost"
                    key={article.articleCode}
                    className="group flex w-full items-center gap-4 rounded-none bg-white p-4 text-left transition hover:bg-slate-50"
                    onClick={() => navigate(`/portal/article/${article.articleCode}`)}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                      <FileText className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <strong className="block truncate text-sm font-semibold text-slate-950">{article.title}</strong>
                      <span className="mt-1 line-clamp-1 block text-sm font-normal text-slate-500">{(article.contentMd || '').slice(0, 90)}</span>
                    </span>
                    <span className="hidden shrink-0 text-sm font-normal text-slate-500 sm:inline">{article.folderTitle || '-'}</span>
                    <span className="hidden shrink-0 text-sm font-normal text-slate-500 md:inline">{formatDate(article.publishedAt)}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
                  </Button>
                ))}
              </section>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function formatDate(v?: string) {
  return v ? new Date(v).toLocaleDateString('ko-KR') : '-';
}
