import { useEffect, useState } from 'react';
import { folderApi } from '../api';
import { Button } from './ui/Button';
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/Dialog';
import { Input, Label } from './ui/Input';

export default function FolderFormModal({ isOpen, mode, folder, parentFolderCode, onClose, onSuccess }: any) {
  const [title,setTitle]=useState(''); const [description,setDescription]=useState(''); const [active,setActive]=useState(true); const [loading,setLoading]=useState(false); const [error,setError]=useState<string|null>(null);
  useEffect(()=>{ setTitle(folder?.title||''); setDescription(folder?.description||''); setActive(folder?.active ?? true); setError(null); },[folder,isOpen]);
  async function submit(e:any){ e.preventDefault(); if(!title.trim()){setError('폴더명을 입력하세요.');return;} try{setLoading(true); setError(null); if(mode==='edit') await folderApi.update(folder.folderCode,{title,description,active}); else await folderApi.create({title,description,parentFolderCode: parentFolderCode || '-1'}); onSuccess?.(); onClose();} catch(e:any){setError(e.message);} finally{setLoading(false);} }
  return <Dialog open={isOpen} onClose={onClose} size="md"><form onSubmit={submit}><DialogHeader><DialogTitle>{mode==='edit'?'폴더 수정':'새 폴더'}</DialogTitle><DialogDescription>콘텐츠를 체계적으로 분류할 폴더 정보를 입력하세요.</DialogDescription></DialogHeader>{error&&<div className="error-banner">{error}</div>}<div className="form-body"><div className="form-field"><Label required>폴더명</Label><Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="예: 제품 문서"/></div><div className="form-field"><Label>설명</Label><textarea className="textarea small" value={description} onChange={e=>setDescription(e.target.value)} placeholder="폴더 설명"/></div>{mode==='edit'&&<label className="toggle-line"><input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)}/> 활성 상태</label>}</div><DialogFooter><Button type="button" variant="ghost" onClick={onClose}>취소</Button><Button type="submit" loading={loading}>{mode==='edit'?'저장':'생성'}</Button></DialogFooter></form></Dialog>;
}
