import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync('artifacts/land.geojson','utf8'));
const paths=data.features.flatMap(f=>f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates).map(poly=>poly.map(ring=>ring.map(([x,y],i)=>`${i?'L':'M'}${((x+180)*.94+10).toFixed(1)},${((85-y)*1.25+15).toFixed(1)}`).join('')+'Z').join('')).join('');
fs.writeFileSync('public/images/world-map.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 280"><defs><pattern id="g" width="9" height="8" patternUnits="userSpaceOnUse"><path d="M9 0H0V8" fill="none" stroke="#00ff72" stroke-width=".45"/></pattern></defs><path d="${paths}" fill="url(#g)" stroke="#00ed65" stroke-width=".5"/></svg>`);
