import type {Metadata} from 'next';
import Dashboard from './dashboard';
import './admin.css';
export const metadata:Metadata={title:'Khách mời · Phương Mai',robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
export default function AdminPage(){return <Dashboard/>;}
