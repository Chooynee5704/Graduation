import type { Metadata } from 'next';
import '../src/style.css';
import '../src/invitation.css';
import '../src/rsvp.css';
import '../src/cinematic.css';
export const metadata:Metadata={title:'Phương Mai · Hello, future. · 07.11.2026',description:'Thiệp mời tốt nghiệp Nguyễn Thị Phương Mai — 07.11.2026, Đại học FPT, TP. Hồ Chí Minh.',icons:{icon:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){
  return <html lang="vi"><head><meta name="theme-color" content="#050505"/><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&family=Noto+Serif:ital,wght@0,400;0,500;0,600;1,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/></head><body>{children}</body></html>;
}
