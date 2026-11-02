'use client';
import {useEffect,useRef,useState,type FormEvent} from 'react';
import './admin.css';
type Guest={name:string;createdAt:number};
type GuestList={total:number;filtered:number;page:number;pageSize:number;rows:Guest[];updatedAt:number};
const date=new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',day:'2-digit',month:'2-digit',year:'numeric'});
const time=new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
export default function Dashboard(){
 const [data,setData]=useState<GuestList|null>(null);
 const [draft,setDraft]=useState('');const [query,setQuery]=useState('');const [page,setPage]=useState(1);const [revision,setRevision]=useState(0);
 const [loading,setLoading]=useState(true);const [error,setError]=useState('');const [access,setAccess]=useState(0);
 const [exporting,setExporting]=useState(false);const [notice,setNotice]=useState('');
 const exportRequest=useRef<AbortController|null>(null);
 useEffect(()=>()=>exportRequest.current?.abort(),[]);
 useEffect(()=>{
  const controller=new AbortController();setLoading(true);setError('');setNotice('');
  fetch('/api/admin/attendance?'+new URLSearchParams({q:query,page:String(page)}),{credentials:'same-origin',cache:'no-store',signal:controller.signal})
  .then(async response=>{if(controller.signal.aborted)return;setAccess(response.status);
   if(!response.headers.get('content-type')?.includes('application/json'))throw new Error('Phiên đăng nhập cần được làm mới. Hãy đăng nhập lại bằng ChatGPT.');
   const result=await response.json();if(!response.ok){setData(null);throw new Error(result.message||'Chưa tải được danh sách.');}
   if(!controller.signal.aborted)setData(result);
  }).catch(err=>{if(!controller.signal.aborted){setData(null);setError(err.message||'Kết nối chưa ổn định. Bạn thử lại nhé.');}})
  .finally(()=>{if(!controller.signal.aborted)setLoading(false);});
  return ()=>controller.abort();
 },[query,page,revision]);
 function search(event:FormEvent){event.preventDefault();setQuery(draft.trim());setPage(1);setRevision(v=>v+1);}
 function clear(){setDraft('');setQuery('');setPage(1);setRevision(v=>v+1);}
 async function exportCsv(){
  const controller=new AbortController();exportRequest.current=controller;setExporting(true);setNotice('');
  try{
   const response=await fetch('/api/admin/attendance?'+new URLSearchParams({q:query,format:'csv'}),{credentials:'same-origin',cache:'no-store',signal:controller.signal});
   if(!response.ok || !response.headers.get('content-type')?.includes('text/csv')){const result=await response.json().catch(()=>({}));if(response.status===401||response.status===403){setAccess(response.status);setData(null);}throw new Error(result.message||'Chưa tải được CSV. Bạn thử lại nhé.');}
   const blob=await response.blob();if(controller.signal.aborted)return;
   const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='khach-moi-phuong-mai.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice('Đã tải danh sách CSV theo bộ lọc hiện tại.');
  }catch(err){if(!controller.signal.aborted)setNotice(err instanceof Error?err.message:'Chưa tải được CSV.');}
  finally{if(!controller.signal.aborted)setExporting(false);}
 }
 const restricted=access===401||access===403;
 const pages=data?Math.max(1,Math.ceil(data.filtered/data.pageSize)):1;
 return <main className="admin-shell">
  <header className="admin-nav"><a className="admin-brand" href="/" aria-label="Về thiệp mời">&lt;pm/&gt;</a><span>Sổ khách mời</span><a href="/">Xem thiệp <span aria-hidden="true">↗</span></a></header>
  <section className="admin-heading"><div><p className="admin-kicker">Ngày tốt nghiệp của Mai</p><h1>Những lời hẹn gặp.</h1><p>Khách đã xác nhận tham dự sẽ xuất hiện ở đây.</p></div><div className="admin-event"><strong>07.11.2026</strong><span>10:00–12:30 · Đại học FPT</span></div></section>
  {restricted?<section className="admin-access"><span aria-hidden="true">⌑</span><h2>{access===401?'Đăng nhập để mở sổ khách mời':'Trang dành riêng cho Mai'}</h2><p>{error}</p><a className="admin-primary" href={access===401?'/signin-with-chatgpt?return_to=%2Fadmin':'/signout-with-chatgpt?return_to=%2Fadmin'} target="_top">{access===401?'Đăng nhập bằng ChatGPT':'Đổi tài khoản ChatGPT'}</a><a className="admin-text-link" href="/">Quay lại thiệp mời</a></section>:<>
   <section className="admin-summary" aria-label="Tổng quan"><div><span className="admin-count">{data?data.total.toLocaleString('vi-VN'):'—'}</span><div><h2>Lượt xác nhận</h2><p>{data?.updatedAt?'Cập nhật lúc '+time.format(data.updatedAt)+' · giờ Việt Nam':'Đang mở sổ khách mời…'}</p></div></div><button type="button" onClick={()=>setRevision(v=>v+1)} disabled={loading}>{loading?'Đang tải…':'Làm mới danh sách'} <span aria-hidden="true">↻</span></button></section>
   <section className="admin-list" aria-label="Danh sách xác nhận"><div className="admin-toolbar"><form onSubmit={search} role="search"><label htmlFor="guest-search">Tìm tên khách</label><div><input id="guest-search" value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Nhập tên để tìm…" maxLength={100} type="search"/><button type="submit" disabled={loading}>Tìm</button></div></form><button className="admin-export" type="button" onClick={exportCsv} disabled={loading||exporting||!data?.filtered}>{exporting?'Đang tải CSV…':'Tải danh sách CSV'} <span aria-hidden="true">↓</span></button></div>
    {query&&<div className="admin-filter"><span>Kết quả cho “{query}”</span><button type="button" onClick={clear}>Xóa bộ lọc</button></div>}
    <p className="admin-notice" role="status" aria-live="polite">{notice||(!loading&&data?`${data.filtered.toLocaleString('vi-VN')} lượt xác nhận${query?' khớp với tên đang tìm':''}.`:'')}</p>
    <div aria-busy={loading}>{loading?<div className="admin-empty" role="status"><span className="admin-loading" aria-hidden="true"/><h2>Đang tải những lời hẹn…</h2></div>:error?<div className="admin-empty" role="alert"><h2>Chưa mở được danh sách</h2><p>{error}</p><button onClick={()=>setRevision(v=>v+1)} type="button">Thử lại</button><a href="/signin-with-chatgpt?return_to=%2Fadmin" target="_top" className="admin-text-link">Đăng nhập lại</a></div>:data?.rows.length?<><table className="admin-table"><caption className="sr-only">Tên khách và thời điểm xác nhận, mới nhất trước</caption><thead><tr><th scope="col">Tên khách mời</th><th scope="col">Thời điểm xác nhận</th></tr></thead><tbody>{data.rows.map((guest,index)=><tr key={`${page}-${index}`}><td><span className="guest-order" aria-hidden="true">{String((page-1)*data.pageSize+index+1).padStart(2,'0')}</span><span>{guest.name}</span></td><td><time dateTime={new Date(guest.createdAt).toISOString()}><strong>{time.format(guest.createdAt)}</strong><span>{date.format(guest.createdAt)}</span></time></td></tr>)}</tbody></table><nav className="admin-pages" aria-label="Phân trang"><span>Trang {page} / {pages}</span><div><button type="button" onClick={()=>setPage(v=>v-1)} disabled={page<=1}>Trước</button><button type="button" onClick={()=>setPage(v=>v+1)} disabled={page>=pages}>Tiếp</button></div></nav></>:<div className="admin-empty"><span aria-hidden="true">{query?'⌕':'♡'}</span><h2>{query?'Chưa tìm thấy tên này':'Lời hẹn đầu tiên đang chờ.'}</h2><p>{query?'Thử nhập một phần tên hoặc xóa bộ lọc để xem tất cả.':'Khi khách điền tên và gửi xác nhận trong thiệp, tên sẽ được lưu tại đây.'}</p>{query?<button type="button" onClick={clear}>Xem tất cả</button>:<a className="admin-text-link" href="/#rsvp">Đến phần xác nhận tham dự</a>}</div>}</div>
   </section><p className="admin-footnote">Danh sách chỉ dành cho chủ thiệp. Số liệu tính theo lượt xác nhận; cùng một tên có thể xuất hiện nhiều lần.</p>
  </>}
  <footer className="admin-footer"><span>With love, Phương Mai.</span><a href="/">Về trang thiệp mời</a></footer>
 </main>;
}
