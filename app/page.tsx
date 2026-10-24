import markup from './experience.html?raw';
import Experience from './experience';
export default function Page(){return <><div dangerouslySetInnerHTML={{__html:markup}}/><Experience/></>;}
