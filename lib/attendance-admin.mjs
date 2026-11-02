const OWNER_EMAIL = 'mainee5704@gmail.com';
const headers = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', Vary: 'Cookie' };
const json = (data, status=200) => Response.json(data, {status,headers});
export function isAttendanceOwner(request, localPreview=false) {
  const id=request.headers.get('oai-authenticated-user-id');
  const email=request.headers.get('oai-authenticated-user-email')?.trim().toLowerCase();
  return Boolean(id && (email===OWNER_EMAIL || (localPreview && id==='local_seedy' && email==='seedy@sites.test')));
}
export function csvCell(value) {
  let text=String(value??'');
  if (/^[\s]*[=+\-@]/u.test(text)) text="'"+text;
  return '"'+text.replaceAll('"','""')+'"';
}
export async function handleAttendanceAdmin(request, db, {localPreview=false}={}) {
  if (!request.headers.get('oai-authenticated-user-id')) return json({message:'Đăng nhập bằng tài khoản của Mai để xem danh sách.'},401);
  if (!isAttendanceOwner(request,localPreview)) return json({message:'Danh sách này chỉ dành cho chủ thiệp mời.'},403);
  if (request.method!=='GET') return new Response('Method not allowed',{status:405,headers:{...headers,Allow:'GET'}});
  const url=new URL(request.url);
  const q=(url.searchParams.get('q')||'').trim().replace(/\s+/gu,' ');
  const rawPage=url.searchParams.get('page')||'1';
  if (q.length>100 || !/^[1-9]\d{0,5}$/.test(rawPage)) return json({message:'Bộ lọc chưa hợp lệ. Hãy tìm tên tối đa 100 ký tự.'},400);
  const page=Number(rawPage), pageSize=50, exporting=url.searchParams.get('format')==='csv';
  if (!db) return json({message:'Chưa tải được sổ khách mời. Bạn thử lại sau nhé.'},503);
  const escaped=q.replace(/[\\%_]/g,'\\$&');
  const where=q?" WHERE name LIKE ? ESCAPE '\\'":'';
  const params=q?['%'+escaped+'%']:[];
  try {
    const statement=(sql,args=[])=>db.prepare(sql).bind(...args);
    const [totalRow,filteredRow]=await Promise.all([
      statement('SELECT COUNT(*) AS count FROM attendance').first(),
      statement('SELECT COUNT(*) AS count FROM attendance'+where,params).first()
    ]);
    const total=Number(totalRow?.count||0), filtered=Number(filteredRow?.count||0);
    if(exporting && filtered>10000) return json({message:'Danh sách vượt 10.000 lượt. Hãy tìm theo tên để thu hẹp trước khi tải.'},422);
    const result=await statement('SELECT name, created_at FROM attendance'+where+' ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?',[...params,exporting?10000:pageSize,exporting?0:(page-1)*pageSize]).all();
    if(result.success===false) throw new Error('Database query failed');
    const rows=result.results||[];
    if(exporting) {
      const formatter=new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',dateStyle:'short',timeStyle:'medium'});
      const csv='\uFEFF'+[['Tên khách mời','Thời điểm xác nhận (giờ Việt Nam)'],...rows.map(r=>[r.name,formatter.format(new Date(r.created_at))])].map(row=>row.map(csvCell).join(',')).join('\r\n');
      return new Response(csv,{headers:{...headers,'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="khach-moi-phuong-mai.csv"'}});
    }
    return json({total,filtered,page,pageSize,rows:rows.map(r=>({name:r.name,createdAt:r.created_at})),updatedAt:Date.now()});
  } catch { return json({message:'Chưa tải được sổ khách mời. Bạn thử làm mới lại nhé.'},503); }
}
