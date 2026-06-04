import '../../index.css';
import { ArrowRight, BarChart3, FileText, FolderOpen, PenLine, PlusCircle, Rocket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { folderApi, searchApi } from '../../api';
import { LoadingSkeleton, ErrorState, EmptyState } from '../../components/AsyncStates';
import StatusBadge from '../../components/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export default function AdminHomePage() {
  const nav = useNavigate();
  const [folders, setFolders] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const [fs, as] = await Promise.all([folderApi.getRoots(false), searchApi.search('', false)]);
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

  const draft = articles.filter((a) => a.status === 'DRAFT').length;

  if (error) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Card className="rounded-2xl border border-red-100 bg-red-50/70 p-4 shadow-sm">
          <ErrorState message={error} onRetry={load} />
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
        <CardContent className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
          <section className="space-y-5">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              <Rocket className="h-3.5 w-3.5" /> Admin Dashboard
            </span>
            <article className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                콘텐츠 운영 현황
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                게시글 작성, 발행 상태, 폴더 구조를 한눈에 관리하세요. CMS 운영 흐름을 빠르게 파악할 수 있는 관리자 홈입니다.
              </p>
            </article>
          </section>
          <Button
            className="h-12 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            onClick={() => nav('/admin/article/new')}
          >
            <PlusCircle className="h-4 w-4" /> 새 게시글
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <LoadingSkeleton rows={6} />
        </Card>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <Metric icon={<FolderOpen className="h-5 w-5" />} label="폴더" value={folders.length} helper="관리 중인 루트 폴더" />
            <Metric icon={<FileText className="h-5 w-5" />} label="게시글" value={articles.length} helper="전체 콘텐츠" />
            <Metric icon={<PenLine className="h-5 w-5" />} label="초안" value={draft} helper="작성 중인 게시글" />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between gap-4 p-6">
                <section>
                  <p className="text-sm font-medium text-slate-500">Content pipeline</p>
                  <CardTitle className="mt-1 text-2xl font-bold tracking-tight text-slate-950">최근 게시글</CardTitle>
                </section>
                <Button
                  variant="outline"
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                  onClick={() => nav('/admin/articles')}
                >
                  전체 보기 <ArrowRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {articles.length === 0 ? (
                  <EmptyState title="게시글이 없습니다." />
                ) : (
                  <section className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200">
                    {articles.slice(0, 6).map((a) => (
                      <Button
                        variant="ghost"
                        className="group flex w-full items-center gap-4 rounded-none bg-white p-4 text-left transition hover:bg-slate-50"
                        key={a.articleCode}
                        onClick={() => nav(`/admin/article/${a.articleCode}`)}
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <FileText className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <strong className="block truncate text-sm font-semibold text-slate-950">{a.title}</strong>
                          <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm font-normal text-slate-500">
                            <span>{a.folderTitle || 'Uncategorized'}</span>
                            <span>{formatDate(a.updatedAt)}</span>
                          </span>
                        </span>
                        <StatusBadge status={a.status} />
                      </Button>
                    ))}
                  </section>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <CardHeader className="p-6">
                <p className="text-sm font-medium text-slate-500">Operations</p>
                <CardTitle className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 p-6 pt-0">
                <Button
                  variant="ghost"
                  className="flex h-14 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-left text-sm font-semibold text-slate-800 shadow-sm hover:bg-blue-50 hover:text-blue-700"
                  onClick={() => nav('/admin/article/new')}
                >
                  새 게시글 작성 <PlusCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  className="flex h-14 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-left text-sm font-semibold text-slate-800 shadow-sm hover:bg-blue-50 hover:text-blue-700"
                  onClick={() => nav('/admin/folder')}
                >
                  폴더 관리 <FolderOpen className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  className="flex h-14 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-left text-sm font-semibold text-slate-800 shadow-sm hover:bg-blue-50 hover:text-blue-700"
                  onClick={() => nav('/portal')}
                >
                  포털 확인 <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </main>
  );
}

function Metric({ icon, label, value, helper }: any) {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <CardContent className="flex items-center gap-4 p-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">{icon}</span>
        <span className="min-w-0">
          <span className="text-sm font-medium text-slate-500">{label}</span>
          <strong className="mt-1 block text-3xl font-bold tracking-tight text-slate-950">{value}</strong>
          <span className="text-sm font-normal text-slate-500">{helper}</span>
        </span>
        <BarChart3 className="ml-auto h-5 w-5 text-slate-300" />
      </CardContent>
    </Card>
  );
}

function formatDate(v?: string) {
  return v ? new Date(v).toLocaleDateString('ko-KR') : '-';
}
