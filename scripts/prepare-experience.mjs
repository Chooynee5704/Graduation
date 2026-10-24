import { readFileSync,writeFileSync } from 'node:fs';
const source=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const body=source.match(/<body>([\s\S]*)<\/body>/i)?.[1];
if(!body)throw new Error('Invitation body is missing.');
writeFileSync(new URL('../app/experience.html',import.meta.url),body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''));
