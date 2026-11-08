const topo = require('topojson-client');
const fs = require('fs');
const t = JSON.parse(fs.readFileSync('node_modules/world-atlas/land-10m.json'));
const land = topo.feature(t, t.objects.land);
const K = 120, COS = Math.cos(22*Math.PI/180), LON0 = 60, LAT0 = 38;
const px = ([lon, lat]) => [(lon-LON0)*K*COS, (LAT0-lat)*K];
const polys = land.features.flatMap(f => f.geometry.type==='Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates);
function clip(ring){
  const B=[['lo',58,1],['lo',100,-1],['la',-2,1],['la',40,-1]];
  let pts=ring;
  for(const [ax,v,sgn] of B){
    const i=ax==='lo'?0:1; const inside=p=>sgn*(p[i]-v)>=0;
    const out=[];
    for(let k=0;k<pts.length;k++){
      const a=pts[k], b=pts[(k+1)%pts.length];
      const ia=inside(a), ib=inside(b);
      if(ia) out.push(a);
      if(ia!==ib){ const t=(v-a[i])/(b[i]-a[i]); out.push([a[0]+t*(b[0]-a[0]), a[1]+t*(b[1]-a[1])]); }
    }
    pts=out; if(!pts.length) break;
  }
  return pts;
}
let d = '';
let n = 0;
for (const poly of polys) {
  const ring = poly[0];
  const inBox = ring.some(([lo,la]) => lo>55 && lo<105 && la>-5 && la<42);
  if (!inBox) continue;
  for (const r of poly) {
    let pts = clip(r).map(px); const out = [];
    for (const p of pts) { const l = out[out.length-1]; if (!l || Math.hypot(p[0]-l[0],p[1]-l[1])>2.5) out.push(p); }
    if (out.length < 3) continue;
    // clip far coords roughly
    d += 'M' + out.map(p=>p[0].toFixed(0)+' '+p[1].toFixed(0)).join('L') + 'Z';
    n += out.length;
  }
}
fs.writeFileSync(process.argv[2], `// Generated from Natural Earth 10m land (world-atlas@2.0.2) by an equirectangular\n// projection: x = (lon - ${LON0}) * ${K} * cos 22°, y = (${LAT0} - lat) * ${K}.\nexport const LAND_PATH =\n  ${JSON.stringify(d)};\n`);
console.log(n, d.length);
