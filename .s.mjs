import { webkit } from 'playwright';
const dir='/private/tmp/claude-501/-Users-tyleryoung-Documents-portfolio-2/86c7f7df-f24d-4b4a-9d74-b40b05475beb/scratchpad';
const b = await webkit.launch();
const p = await b.newPage({ viewport:{width:1440,height:800}, deviceScaleFactor:2 });
await p.goto('http://localhost:4399/design-system', { waitUntil:'networkidle' });
await p.screenshot({ path:`${dir}/ds-norule.png`, clip:{x:0,y:0,width:1440,height:640} });
await b.close();
