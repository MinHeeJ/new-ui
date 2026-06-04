import { Search, ShieldCheck, LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchApi } from '../api';

export default function HeaderBar({ mode = 'portal' }: { mode?: 'portal' | 'admin' }) {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const t = setTimeout(async () => {
      if (keyword.trim().length < 2) { setResults([]); return; }
      try { setLoading(true); setResults(await searchApi.search(keyword.trim(), mode === 'portal')); } catch { setResults([]); } finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [keyword, mode]);
  return <header className="app-header"><Link to={mode === 'admin' ? '/admin' : '/portal'} className="brand-mark"><span className="brand-logo">C</span><span>CMS</span></Link><div className="header-search"><Search size={18}/><input value={keyword} onChange={e=>setKeyword(e.target.value)} placeholder="문서 검색..."/><div className={`search-popover ${keyword.length>=2?'open':''}`}>{loading ? <div className="search-row muted">검색 중...</div> : results.length===0 ? <div className="search-row muted">검색 결과가 없습니다.</div> : results.slice(0,6).map(r=><button className="search-row" key={r.articleCode} onClick={()=>{setKeyword(''); navigate(`${mode==='admin'?'/admin/article':'/portal/article'}/${r.articleCode}`)}}><strong>{r.title}</strong><span>{r.folderTitle || 'Uncategorized'}</span></button>)}</div></div><nav className="header-nav"><Link to="/portal">Portal</Link><Link to="/admin"><ShieldCheck size={16}/>Admin</Link><Link to="/login"><LogIn size={16}/>Login</Link></nav></header>;
}
