import { Outlet } from 'react-router-dom';
import HeaderBar from '../components/HeaderBar';
import Sidebar from '../components/Sidebar';
export default function PortalLayout(){ return <div className="app-shell"><HeaderBar mode="portal"/><div className="app-body"><Sidebar mode="portal"/><main className="app-main"><Outlet/></main></div></div>; }
