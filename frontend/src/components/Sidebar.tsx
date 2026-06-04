import { FileText, Folder, Home, LayoutDashboard, LogOut, PlusCircle, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { folderApi } from '../api';
import { useAuthStore } from '../store/auth-store';
import { LoadingSkeleton, ErrorState, EmptyState } from './AsyncStates';

export default function Sidebar({ mode = 'portal' }: { mode?: 'portal' | 'admin' }) {
  const [folders, setFolders] = useState<any[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState<string|null>(null);
  const navigate = useNavigate(); const logout = useAuthStore(s=>s.logout);
  async function load(){ try{ setLoading(true); setError(null); setFolders(await folderApi.getRoots(mode==='portal')); } catch(e:any){ setError(e.message); } finally{ setLoading(false); } }
  useEffect(()=>{ load(); },[mode]);
  const folderPath = (code:string) => mode==='portal' ? `/portal/folder/${code}` : `/admin/folder/${code}`;
  return <aside className="app-sidebar"><div className="sidebar-section"><p className="sidebar-label">Navigation</p>{mode==='portal'? <NavLink end to="/portal" className="nav-item"><Home size={17}/>Portal Home</NavLink> : <><NavLink end to="/admin" className="nav-item"><LayoutDashboard size={17}/>Dashboard</NavLink><NavLink to="/admin/articles" className="nav-item"><FileText size={17}/>게시글 관리</NavLink><NavLink to="/admin/folder" className="nav-item"><Settings size={17}/>폴더 관리</NavLink><Link to="/admin/article/new" className="nav-item accent"><PlusCircle size={17}/>새 게시글</Link></>}</div><div className="sidebar-section grow"><p className="sidebar-label">Folders</p>{loading && <LoadingSkeleton rows={4}/>} {error && <ErrorState message={error} onRetry={load}/>} {!loading&&!error&&folders.length===0&&<EmptyState title="폴더가 없습니다." description="관리자에서 폴더를 생성하세요."/>} {!loading&&!error&&folders.map(f=><NavLink key={f.folderCode} to={folderPath(f.folderCode)} className="folder-link"><Folder size={16}/><span>{f.title}</span></NavLink>)}</div>{mode==='admin'&&<button className="nav-item logout" onClick={()=>{logout(); navigate('/login')}}><LogOut size={17}/>로그아웃</button>}</aside>;
}
