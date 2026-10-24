const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export async function handleRsvp(request,db){
  if(request.method!=='POST')return new Response('Method not allowed',{status:405,headers:{Allow:'POST','Cache-Control':'no-store'}});
  const origin=request.headers.get('origin');
  if(origin && origin!==new URL(request.url).origin)return json({message:'Bạn vui lòng gửi xác nhận từ trang thiệp mời.'},403);
  if(!request.headers.get('content-type')?.startsWith('application/json'))return json({message:'Định dạng gửi chưa đúng.'},415);
  if(Number(request.headers.get('content-length')||0)>2048)return json({message:'Nội dung gửi quá dài.'},413);
  let data;
  try{const raw=await request.text();if(raw.length>2048)return json({message:'Nội dung gửi quá dài.'},413);data=JSON.parse(raw);}catch{return json({message:'Nội dung gửi chưa đúng.'},400);}
  if(!data||typeof data.name!=='string'||typeof data.id!=='string'||!uuid.test(data.id))return json({message:'Bạn vui lòng kiểm tra tên rồi gửi lại nhé.'},400);
  const name=data.name.trim().replace(/\s+/gu,' ');
  if(name.length<2||name.length>100||/[\u0000-\u001f\u007f]/u.test(data.name))return json({message:'Bạn vui lòng nhập tên từ 2 đến 100 ký tự nhé.'},400);
  if(!db)return json({message:'Chưa kết nối được sổ khách mời. Bạn thử lại sau hoặc gọi Mai: 0979190137.'},503);
  try{
    const result=await db.prepare('INSERT INTO attendance (id, name, created_at) VALUES (?, ?, ?) ON CONFLICT(id) DO NOTHING').bind(data.id,name,Date.now()).run();
    return json({ok:true},result.meta?.changes===0?200:201);
  }catch{return json({message:'Chưa lưu được lời hẹn. Bạn thử lại hoặc gọi Mai nhé.'},503);}
}
