import { Outlet } from 'react-router-dom';
import HeaderBar from '../components/HeaderBar';
import Sidebar from '../components/Sidebar';
export default function AdminLayout(){ return <div className="app-shell"><HeaderBar mode="admin"/><div className="app-body"><Sidebar mode="admin"/><main className="app-main"><Outlet/></main></div></div>; }
