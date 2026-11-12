// The Goodbye Money world as one three.js scene: sky dome, sun disc + halo, clouds, the lane (ground, road, houses,
// trees, poles), the taxi and the cast. update(id, f, camera) poses everything for shot `id` at frame f (a pure
// function of id + f). Sky / light / card machinery from the cartoon-3d-short skill's bridge short.
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { staticFile } from "remotion";
import { Batch, boxGeo, V, lam, buildLane, buildTaxi, Kit, Ray } from "./build";
import { ctex, cloudHD } from "./paint";
import { LIGHTS, LOOK, LightPreset } from "./lights";
import { TONE, CHAR, untone } from "./shade";
import { NOINK } from "./ink";
import { isEN, isVillage } from "./theme";
import { Pool, Actor, Fx, stage } from "./cast";
import { FPS, SHOTS, BAGS, camAt, taxiAt, V3, ShotDef } from "./story";

// ---------------- assets ----------------
// Kenney CC0 kit (optional: build.ts draws trees and bushes itself; anything missing is simply left out)
const KENNEY: string[] = [];
let kitP: Promise<Kit> | null = null;
export const loadKit = () => {
  if (!kitP) {
    const loader = new GLTFLoader();
    kitP = Promise.all(KENNEY.map((n) => loader.loadAsync(staticFile(`grandma/kenney/${n}.glb`)).then((g) => [n, g.scene] as const).catch(() => [n, null] as const)))
      .then((list) => Object.fromEntries(list.filter((e) => e[1]).map(([n, s]) => [n, s!])) as Kit);
  }
  return kitP;
};

/** sun disc (solid, soft rim) and the flat golden halo */
const discTex = () => ctex("sunDisc", 128, 128, (g) => {
  const gr = g.createRadialGradient(64, 64, 58, 64, 64, 64); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
});
const haloTex = () => ctex("sunHalo", 256, 256, (g) => {
  const im = g.createImageData(256, 256);
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    const u = Math.hypot(x - 127.5, y - 127.5) / 128;
    const a = (0.55 * Math.exp(-((u / 0.25) ** 2)) + 0.35 * Math.exp(-((u / 0.6) ** 2))) * (1 - Math.min(1, Math.max(0, (u - 0.8) / 0.2)));
    const i = (y * 256 + x) * 4; im.data[i] = im.data[i + 1] = im.data[i + 2] = 255; im.data[i + 3] = Math.round(255 * Math.min(1, a));
  }
  g.putImageData(im, 0, 0);
});
/** dusty ground and the asphalt lane, painted at 1024 px per tile */
const dustTex = () => {
  const t = ctex(isEN() ? "grassEN" : isVillage() ? "dustV" : "dustHD", 1024, 1024, (g, r) => {
    g.fillStyle = isEN() ? "#7fb35a" : isVillage() ? "#c9ad7a" : "#d4b98c"; g.fillRect(0, 0, 1024, 1024); // English verges are grass
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(${r() > 0.5 ? "255,240,210" : "120,90,60"},${(0.04 + 0.05 * r()).toFixed(3)})`; g.beginPath(); g.ellipse(r() * 1024, r() * 1024, 20 + r() * 70, 8 + r() * 30, r() * 3, 0, 7); g.fill(); }
    for (let i = 0; i < 120; i++) { g.fillStyle = "rgba(90,70,50,0.35)"; g.beginPath(); g.arc(r() * 1024, r() * 1024, 2 + r() * 3, 0, 7); g.fill(); }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
};
const roadTex = () => {
  if (isVillage()) { // a dirt track: dust with two darker wheel ruts
    const t = ctex("trackHD", 512, 1024, (g, r) => {
      g.fillStyle = "#c4a676"; g.fillRect(0, 0, 512, 1024);
      for (let i = 0; i < 180; i++) { g.fillStyle = `rgba(${r() > 0.5 ? "255,240,210" : "110,80,50"},${(0.05 + 0.06 * r()).toFixed(3)})`; g.beginPath(); g.ellipse(r() * 512, r() * 1024, 12 + r() * 50, 6 + r() * 22, r() * 3, 0, 7); g.fill(); }
      g.fillStyle = "rgba(110,80,50,0.22)"; g.fillRect(110, 0, 50, 1024); g.fillRect(352, 0, 50, 1024);
      g.fillStyle = "rgba(90,140,60,0.35)"; for (let i = 0; i < 90; i++) g.fillRect(230 + (r() - 0.5) * 40, r() * 1024, 4, 10 + r() * 14);
    });
    t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
  }
  const t = ctex(isEN() ? "roadEN" : "roadHD", 512, 1024, (g, r) => {
    g.fillStyle = isEN() ? "#6f6c6a" : "#8b8681"; g.fillRect(0, 0, 512, 1024);
    for (let i = 0; i < 160; i++) { g.fillStyle = `rgba(${r() > 0.5 ? "255,250,240" : "40,35,40"},${(0.04 + 0.06 * r()).toFixed(3)})`; g.beginPath(); g.ellipse(r() * 512, r() * 1024, 10 + r() * 50, 6 + r() * 20, r() * 3, 0, 7); g.fill(); }
    g.strokeStyle = "rgba(40,35,40,0.45)"; g.lineWidth = 3;
    for (let i = 0; i < 6; i++) { g.beginPath(); let x = r() * 512, y = r() * 1024; g.moveTo(x, y); for (let k = 0; k < 5; k++) { x += (r() - 0.5) * 60; y += 20 + r() * 30; g.lineTo(x, y); } g.stroke(); }
    if (isEN()) { g.fillStyle = "#e8e2cf"; g.fillRect(250, 80, 12, 300); g.fillRect(250, 600, 12, 300); g.fillStyle = "#e3c43a"; g.fillRect(6, 0, 10, 1024); g.fillRect(22, 0, 10, 1024); } // centre dashes, double yellow
    else { g.fillStyle = "#c9b48e"; g.fillRect(0, 0, 18, 1024); g.fillRect(494, 0, 18, 1024); } // dusty edges
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
};

/** every lens position of the film looking at its subject: houses / trees / poles on these lines are left out */
const sightLines = (): Ray[] => {
  const out: Ray[] = [];
  for (const s of SHOTS) for (let f = s.a - 8; f < s.b + 8; f += 2) {
    const id = s.id, c = camAt(id, Math.max(s.a, Math.min(s.b - 1, f))), o = V(...c.pos), look = V(...c.look);
    const fw = look.clone().sub(o), len = fw.length() * 0.97;
    fw.normalize();
    const rt = fw.clone().cross(V(0, 1, 0)).normalize(), up = rt.clone().cross(fw);
    const ty = Math.tan((c.fov * Math.PI) / 360), tx = ty * (9 / 16);
    for (const [sx, sy] of [[0, 0], [-0.6, 0], [0.6, 0], [0, 0.6], [0, -0.4]])
      out.push({ o, d: fw.clone().addScaledVector(rt, sx * tx).addScaledVector(up, sy * ty), len, core: sx === 0 && sy === 0 });
  }
  return out;
};

export class World {
  root = new THREE.Group();
  private pool = new Pool();
  private actors: Actor[] = [];
  private fxs: Fx[] = [];
  private hemi: THREE.HemisphereLight; private sun: THREE.DirectionalLight;
  private sky: THREE.Mesh; private skyMat: THREE.ShaderMaterial;
  private fog = new THREE.Fog("#bccbec", 25, 420);
  private sunDisc: THREE.Sprite; private sunHalo: THREE.Sprite;
  private sunCache = new Map<number, THREE.Vector3>();
  private cloudMaps: Record<"day" | "golden", THREE.Texture[]>;
  private clouds: THREE.Mesh[] = [];
  private taxi: THREE.Group;
  private bags = new THREE.Group();
  private frustum = new THREE.Frustum();
  private m4 = new THREE.Matrix4(); private v = new THREE.Vector3(); private sph = new THREE.Sphere();

  constructor(kit: Kit) {
    const R = this.root;
    // ---- sky + light ----
    this.skyMat = new THREE.ShaderMaterial({
      uniforms: { c0: { value: new THREE.Color() }, c1: { value: new THREE.Color() }, c2: { value: new THREE.Color() },
        c3: { value: new THREE.Color() }, c4: { value: new THREE.Color() }, e: { value: new THREE.Vector4() } },
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: `uniform vec3 c0, c1, c2, c3, c4; uniform vec4 e; varying vec3 vP;
        void main(){ float el = asin(clamp(normalize(vP).y, -1.0, 1.0));
          vec3 c = mix(c0, c1, smoothstep(0.0, e.x, el));
          c = mix(c, c2, smoothstep(e.x, e.y, el));
          c = mix(c, c3, smoothstep(e.y, e.z, el));
          c = mix(c, c4, smoothstep(e.z, e.w, el));
          gl_FragColor = vec4(c, 1.0); }`,
      side: THREE.BackSide, depthWrite: false, fog: false,
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(1100, 48, 24), this.skyMat);
    this.sky.renderOrder = -1; this.sky.frustumCulled = false; this.sky.layers.set(NOINK);
    R.add(this.sky);
    this.sunDisc = new THREE.Sprite(new THREE.SpriteMaterial({ map: discTex(), color: new THREE.Color(6.0, 4.4, 2.4), fog: false, depthWrite: false }));
    this.sunHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex(), color: new THREE.Color(1, 1, 1), fog: false, depthWrite: false, depthTest: true,
      transparent: true, blending: THREE.AdditiveBlending }));
    this.sunDisc.renderOrder = -0.5; this.sunHalo.renderOrder = 5;
    for (const m of [this.sunDisc, this.sunHalo]) { m.frustumCulled = false; m.layers.set(NOINK); R.add(m); }
    this.hemi = new THREE.HemisphereLight("#cfe6ff", "#6c5c8c", 1.1);
    this.sun = new THREE.DirectionalLight("#fff0d6", 2.6);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    R.add(this.hemi, this.sun, this.sun.target);
    this.cloudMaps = { day: [0, 1, 2, 3].map((k) => cloudHD(k, LOOK.day.cloud)), golden: [0, 1, 2, 3].map((k) => cloudHD(k, LOOK.golden.cloud)) };
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + 0.3, d = 620 + (i % 3) * 60;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: this.cloudMaps.day[i % 4], color: new THREE.Color(1.1, 1.1, 1.1), transparent: true, depthWrite: false, fog: false }));
      const w = 130 + (i % 4) * 30;
      m.position.set(Math.cos(a) * d, 120 + (i % 4) * 38, Math.sin(a) * d); m.scale.set(w, w / 2, 1);
      m.layers.set(NOINK);
      this.clouds.push(m); R.add(m);
    }

    // ---- ground + lane (static batch) ----
    const b = new Batch();
    const dust = lam("dust", () => ({ map: dustTex() })), road = lam("road", () => ({ map: roadTex() }));
    const ground = new THREE.PlaneGeometry(1800, 1800); ground.rotateX(-Math.PI / 2);
    const uv = ground.attributes.uv as THREE.BufferAttribute; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 300, uv.getY(i) * 300);
    b.add(ground, dust);
    const lane = new THREE.PlaneGeometry(7, 420); lane.rotateX(-Math.PI / 2); lane.translate(0, 0.012, -170);
    const luv = lane.attributes.uv as THREE.BufferAttribute; for (let i = 0; i < luv.count; i++) luv.setXY(i, luv.getX(i), luv.getY(i) * 60);
    b.add(lane, road);
    // raised kerb-side footpaths in front of the houses
    const path = lam("footpath", () => ({ color: isEN() ? "#b9b6ae" : "#c7b08c" }));
    if (!isVillage()) for (const s of [-1, 1]) b.add(boxGeo(V(s < 0 ? -6.5 : 4.2, 0, -380), V(s < 0 ? -4.2 : 6.5, 0.1, 40)), path);
    b.build(this.root);
    buildLane(R, kit, sightLines());

    // ---- taxi + bags ----
    this.taxi = buildTaxi();
    R.add(this.taxi);
    const bagA = lam("bagA", () => ({ color: "#7a4b8c" })), bagB = lam("bagB", () => ({ color: "#3d6f8f" }));
    const bb = new Batch();
    bb.add(boxGeo(V(-0.35, 0, -0.22), V(0.35, 0.62, 0.22)), bagA);
    bb.add(boxGeo(V(0.45, 0, -0.18), V(0.95, 0.42, 0.2)), bagB);
    bb.build(this.bags);
    this.bags.position.set(...BAGS);
    R.add(this.bags);
  }

  /** camera-relative sun, frozen per shot: the shot's mean view direction turned by az toward screen right, lifted by el */
  private shotSun(id: number, s: ShotDef, L: LightPreset) {
    let v = this.sunCache.get(id);
    if (v) return v;
    let fx = 0, fz = 0;
    for (let f = id === 14 ? 1833 : s.a; f < s.b; f += 3) { // 14: the sun sits behind the coin close-up
      const c = camAt(id, f), x = c.look[0] - c.pos[0], z = c.look[2] - c.pos[2], n = Math.hypot(x, z) || 1;
      fx += x / n; fz += z / n;
    }
    const n = Math.hypot(fx, fz) || 1; fx /= n; fz /= n;
    // golden: a low sun a little off-axis (more side light on faces than the backlit bridge preset); day: the preset
    // golden: a low warm sun behind the lens shoulder lights the faces (the bridge preset was backlit); 14 looks into it
    const az = THREE.MathUtils.degToRad(s.light === "golden" ? (id === 14 ? 4 : 128) : L.az), el = THREE.MathUtils.degToRad(s.light === "golden" ? (id === 14 ? 6 : 24) : L.el);
    const hx = fx * Math.cos(az) - fz * Math.sin(az), hz = fz * Math.cos(az) + fx * Math.sin(az);
    v = new THREE.Vector3(hx * Math.cos(el), Math.sin(el), hz * Math.cos(el)).normalize();
    this.sunCache.set(id, v);
    return v;
  }

  private actor(i: number) { while (this.actors.length <= i) this.actors.push(new Actor(this.root)); return this.actors[i]; }
  private fx(i: number) { while (this.fxs.length <= i) this.fxs.push(new Fx(this.root)); return this.fxs[i]; }

  update(id: number, f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene) {
    const t = f / FPS, s = SHOTS[id - 1], L = LIGHTS[s.light];
    // ---- camera ----
    const c = camAt(id, f);
    cam.position.set(...c.pos); cam.up.set(0, 1, 0); cam.lookAt(...c.look); cam.rotateZ(c.roll);
    cam.fov = c.fov; cam.near = 0.05; cam.far = 1500; cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    const focus = V(...c.look), dist = cam.position.distanceTo(focus);
    cam.layers.enable(NOINK);
    // ---- light rig: camera-relative sun frozen per shot, two-tone uniforms, shadow fit ----
    const K = LOOK[s.light], sunDir = this.shotSun(id, s, L);
    this.hemi.color.set(L.sky); this.hemi.groundColor.set(L.ground); this.hemi.intensity = L.hemiI;
    this.sun.color.set(L.sunCol); this.sun.intensity = L.sunI;
    let Rr = THREE.MathUtils.clamp(dist * 1.15 + 7, 12, 70);
    if (s.light === "golden") Rr = Math.max(Rr, 24);
    this.sun.position.copy(focus).addScaledVector(sunDir, 220); this.sun.target.position.copy(focus);
    const sc = this.sun.shadow.camera;
    sc.left = -Rr; sc.right = Rr; sc.top = Rr; sc.bottom = -Rr; sc.near = 20; sc.far = 480; sc.updateProjectionMatrix();
    this.sun.shadow.bias = L.bias; this.sun.shadow.normalBias = L.normalBias * (Rr / 12);
    TONE.uLitCol.value.set(...L.lit); TONE.uShadeCol.value.set(...L.shade); TONE.uShadeLift.value.set(...L.lift);
    TONE.uLambert.value = L.lambert; TONE.uSideK.value = L.sideK; TONE.uTerm.value = L.term; TONE.uBounce.value.set(...LOOK[s.light].bounce); TONE.uSat.value = LOOK[s.light].sat;
    CHAR.uCharTint.value.set(...L.charTint); CHAR.uCharShade.value = L.charShade; CHAR.uGrad.value = L.charGrad;
    CHAR.uBodyGrad.value = L.bodyGrad; CHAR.uSideTint.value.set(...L.sideTint);
    // ---- sky, fog, sun disc + halo, clouds ----
    const su = this.skyMat.uniforms;
    K.sky.c.forEach((h, i) => untone(h, su["c" + i].value));
    const e = K.sky.e.map((deg) => THREE.MathUtils.degToRad(deg));
    su.e.value.set(e[1], e[2], e[3], e[4]);
    this.sky.position.copy(cam.position);
    untone(L.fog, this.fog.color); this.fog.near = L.fogNear; this.fog.far = L.fogFar;
    scene.fog = this.fog; scene.background = null;
    const showSun = s.light === "golden";
    this.sunDisc.visible = this.sunHalo.visible = showSun;
    if (showSun) {
      this.sunDisc.position.copy(cam.position).addScaledVector(sunDir, 900);
      this.sunDisc.scale.setScalar(2 * 900 * Math.tan(THREE.MathUtils.degToRad(1.7)));
      this.sunHalo.position.copy(this.sunDisc.position); this.sunHalo.scale.setScalar(2 * 900 * Math.tan(THREE.MathUtils.degToRad(24)));
      (this.sunHalo.material as THREE.SpriteMaterial).color.set(L.sunDisc).multiplyScalar(1.3);
    }
    for (let i = 0; i < this.clouds.length; i++) {
      const m = this.clouds[i], mat = m.material as THREE.MeshBasicMaterial;
      m.lookAt(cam.position.x, m.position.y, cam.position.z);
      mat.map = this.cloudMaps[s.light][i % 4];
    }
    // ---- taxi + bags ----
    const [tx, , tz] = taxiAt(id, t);
    const moving = id >= 9 && id !== 12 && id !== 15;
    this.taxi.position.set(tx, moving ? 0.012 * Math.sin(t * 23) : 0, tz);
    this.taxi.visible = id !== 1 && id !== 12 && id !== 15 || (id === 12 && f < 1405);
    this.taxi.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
    this.bags.visible = id >= 2 && id <= 8;
    // ---- cast + effects ----
    const right = V(0, 0, 0).setFromMatrixColumn(cam.matrixWorld, 0);
    const st = stage(id, t, { pos: cam.position, right, sun: sunDir }, s.light);
    this.frustum.setFromProjectionMatrix(this.m4.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse));
    let ai = 0;
    const used: Actor[] = [];
    for (const p of st.places) {
      const sc2 = p.scale ?? 1;
      if (!this.frustum.intersectsSphere(this.sph.set(this.v.set(p.x, p.y + 1.1 * sc2, p.z), 3.5))) continue;
      const a = this.actor(ai++);
      const [w, h, k] = p.size ?? [300, 500, 0.5];
      a.r = this.pool.req(p.key, w, h, k, p.draw);
      a.mesh.visible = true;
      a.mesh.position.set(p.x, p.y, p.z);
      a.mesh.rotation.set(0, p.yaw ?? Math.atan2(cam.position.x - p.x, cam.position.z - p.z), p.roll ?? 0);
      a.mesh.scale.set(p.mirror ? -sc2 : sc2, sc2, sc2);
      a.mesh.castShadow = L.actorShadow;
      used.push(a);
    }
    for (let i = ai; i < this.actors.length; i++) this.actors[i].mesh.visible = false;
    let fi = 0;
    const fused: Fx[] = [];
    for (const p of st.fx) {
      if (!this.frustum.intersectsSphere(this.sph.set(this.v.set(p.x, p.y, p.z), Math.max(p.w, p.h)))) continue;
      const ef = this.fx(fi++);
      ef.r = this.pool.req(p.key, p.cw, p.ch, 1, p.draw);
      ef.use(!!p.soft);
      ef.mesh.visible = true;
      ef.mesh.position.set(p.x, p.y, p.z);
      if (p.flat) ef.mesh.rotation.set(-Math.PI / 2, 0, p.rot ?? 0);
      else { ef.mesh.quaternion.copy(cam.quaternion); ef.mesh.rotateZ(p.rot ?? 0); }
      ef.mesh.scale.set(p.w, p.h, 1);
      fused.push(ef);
    }
    for (let i = fi; i < this.fxs.length; i++) this.fxs[i].mesh.visible = false;
    this.pool.flush();
    for (const a of used) a.bind();
    for (const ef of fused) ef.bind();
    return focus;
  }
}
export type { V3 };
