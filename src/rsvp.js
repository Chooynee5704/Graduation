const form = document.querySelector('.rsvp-form');
const input = document.querySelector('#guest-name');
const status = document.querySelector('#rsvp-status');
const button = form.querySelector('button');
let requestId = crypto.randomUUID();
let submittedName = '';

input.addEventListener('input', () => { if(submittedName && input.value.trim().replace(/\s+/gu,' ')!==submittedName){requestId=crypto.randomUUID();submittedName='';} input.removeAttribute('aria-invalid'); status.textContent=''; status.removeAttribute('data-state'); });
form.addEventListener('submit', async event => {
  event.preventDefault();
  const name = input.value.trim().replace(/\s+/gu,' ');
  if(name.length<2 || name.length>100){ input.setAttribute('aria-invalid','true');status.dataset.state='error';status.textContent='Bạn vui lòng nhập tên từ 2 đến 100 ký tự nhé.';input.focus();return; }
  button.disabled=true;input.disabled=true;status.dataset.state='pending';status.textContent='Đang gửi lời hẹn của bạn…';
  submittedName=name;
  try {
    const response=await fetch('/api/rsvp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,id:requestId}),credentials:'same-origin'});
    if(!response.headers.get('content-type')?.includes('application/json'))throw new Error('Chưa gửi được lời hẹn. Bạn thử lại hoặc gọi Mai nhé.');
    const data=await response.json();
    if(!response.ok)throw new Error(data.message || 'Chưa gửi được xác nhận. Bạn thử lại hoặc gọi Mai nhé.');
    status.dataset.state='success';status.textContent=`Cảm ơn ${name}! Mai đã nhận được lời hẹn. Hẹn gặp bạn trong ngày tốt nghiệp nhé.`;
    input.value='';requestId=crypto.randomUUID();
  } catch(error){status.dataset.state='error';status.textContent=error instanceof TypeError?'Kết nối chưa ổn định. Bạn thử lại hoặc gọi Mai nhé.':error.message || 'Chưa gửi được lời hẹn. Bạn thử lại hoặc gọi Mai nhé.';}
  finally {button.disabled=false;input.disabled=false;}
});
