import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import AdminLayout from '../layouts/AdminLayout';
import PortalLayout from '../layouts/PortalLayout';
import LoginPage from '../pages/LoginPage';
import AdminHomePage from '../pages/admin/AdminHomePage';
import AdminFolderPage from '../pages/admin/AdminFolderPage';
import ArticleEditPage from '../pages/admin/ArticleEditPage';
import ArticleListPage from '../pages/admin/ArticleListPage';
import ArticleReadPage from '../pages/portal/ArticleReadPage';
import FolderPage from '../pages/portal/FolderPage';
import PortalHomePage from '../pages/portal/PortalHomePage';

export default function AppRouter(){ return <BrowserRouter><Routes><Route path="/" element={<Navigate to="/portal" replace/>}/><Route path="/login" element={<LoginPage/>}/><Route path="/portal" element={<PortalLayout/>}><Route index element={<PortalHomePage/>}/><Route path="folder/:folderCode" element={<FolderPage/>}/><Route path="article/:articleCode" element={<ArticleReadPage/>}/></Route><Route path="/admin" element={<PrivateRoute><AdminLayout/></PrivateRoute>}><Route index element={<AdminHomePage/>}/><Route path="articles" element={<ArticleListPage/>}/><Route path="folder" element={<AdminFolderPage/>}/><Route path="folder/:folderCode" element={<AdminFolderPage/>}/><Route path="article/new" element={<ArticleEditPage/>}/><Route path="article/:articleCode" element={<ArticleEditPage/>}/></Route><Route path="*" element={<Navigate to="/portal" replace/>}/></Routes></BrowserRouter>; }
