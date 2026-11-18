/* LOCKG 3D builder engine v2
   product parts + built-in LOCKG modules + wireframe mock-up scenes (cars, pickup, home)
   + install story (view, open, place, fix, close, lock) + clean minimal explode */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const num = (v, d) => (typeof v === 'number' && isFinite(v) ? v : d);
const arr = (a, n, d) => Array.from({ length: n }, (_, i) => num(Array.isArray(a) ? a[i] : undefined, d));
const col = c => (/^#[0-9a-f]{6}$/i.test(c || '') ? c : '#888888');
const css = (k, d) => { try { return getComputedStyle(document.documentElement).getPropertyValue(k).trim() || d; } catch (e) { return d; } };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const eio = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const eout = k => 1 - Math.pow(1 - k, 3);

/* ---------------- product parts ---------------- */
function partMesh(p) {
  const s = p.s || [];
  let geo;
  switch (p.t) {
    case 'box': case 'rbox': case 'plate': { const [w, h, d] = arr(s, 3, .05); const r = p.t === 'rbox' ? Math.min(w, h, d) * .35 : Math.min(w, h, d) * .12; geo = new RoundedBoxGeometry(Math.max(w, .002), Math.max(h, .002), Math.max(d, .002), 3, r); break; }
    case 'cyl': { const [a, b, h] = arr(s, 3, .02); geo = new THREE.CylinderGeometry(a, b, h, 48); break; }
    case 'hex': { const [a, h] = arr(s, 2, .02); geo = new THREE.CylinderGeometry(a, a, h, 6); break; }
    case 'sphere': geo = new THREE.SphereGeometry(num(s[0], .02), 40, 24); break;
    case 'torus': { const [r, t] = arr(s, 2, .01); geo = new THREE.TorusGeometry(r, t, 20, 64); break; }
    case 'cone': { const [r, h] = arr(s, 2, .02); geo = new THREE.ConeGeometry(r, h, 40); break; }
    case 'capsule': { const [r, l] = arr(s, 2, .02); geo = new THREE.CapsuleGeometry(r, l, 8, 24); break; }
    default: return null;
  }
  const metal = clamp(num(p.m, .5), 0, 1);
  const m = new THREE.MeshPhysicalMaterial({ color: col(p.c), metalness: metal, roughness: clamp(num(p.g, .4), .05, 1), clearcoat: metal > .6 ? .4 : .1, clearcoatRoughness: .3 });
  if (p.e) { m.emissive = new THREE.Color(col(p.c)); m.emissiveIntensity = .6; }
  const mesh = new THREE.Mesh(geo, m);
  mesh.position.set(...arr(p.p, 3, 0)); mesh.rotation.set(...arr(p.r, 3, 0));
  mesh.castShadow = mesh.receiveShadow = true;
  mesh.userData.n = String(p.n || '').slice(0, 24);
  mesh.userData.glow = !!p.e;
  return mesh;
}

/* built-in LOCKG modules (metres, standing on y=0, centred, front = +z) */
const BLK = '#1d1d1f', GLD = '#C8A574', STL = '#3a3b3e', FLT = '#2a211a';
const B = (t, s, p, c, m, g, n, r, e) => ({ t, s, p, c, m, g, n, r, e });
export const MODULES = {
  lockg_one: () => [
    B('box', [.07, 1.15, .035], [0, .575, 0], BLK, .6, .5, 'Steel rail'),
    ...[.25, .4, .75, .85].map(y => B('box', [.018, .06, .006], [0, y, .019], '#050505', .2, .9)),
    B('cyl', [.009, .009, .012], [0, .16, .02], STL, .9, .3, 'Anchor bolts', [Math.PI / 2, 0, 0]), B('cyl', [.009, .009, .012], [0, 1.1, .02], STL, .9, .3, '', [Math.PI / 2, 0, 0]),
    B('box', [.17, .09, .13], [0, .045, .075], GLD, .95, .3, 'Stock cradle'), B('box', [.13, .012, .1], [0, .094, .075], FLT, 0, 1, ''),
    B('box', [.13, .12, .1], [0, .55, .07], GLD, .95, .3, 'Trigger cover'),
    B('box', [.16, .13, .11], [0, 1.0, .07], BLK, .7, .4, 'Barrel lock'),
    B('torus', [.024, .004], [0, 1.0, .127], GLD, 1, .25, 'Print sensor', [0, 0, 0], 1), B('cyl', [.02, .02, .006], [0, 1.0, .126], '#0b0b0b', .2, .2, '', [Math.PI / 2, 0, 0])],
  car_adapter: () => [
    B('box', [.95, .018, .34], [0, .009, 0], BLK, .6, .5, 'Base plate'),
    ...[[-.42, -.13], [.42, -.13], [-.42, .13], [.42, .13]].map(([x, z], i) => B('cyl', [.012, .012, .012], [x, .022, z], STL, .9, .3, i ? '' : 'Floor bolts')),
    B('box', [.9, .03, .05], [0, .033, 0], STL, .8, .35, 'Slide rail'),
    B('box', [.06, .16, .2], [-.4, .1, 0], BLK, .6, .5, 'Bracket'), B('box', [.06, .16, .2], [.4, .1, 0], BLK, .6, .5, ''),
    B('box', [.14, .1, .12], [.25, .07, .12], BLK, .7, .4, 'Print lock'), B('torus', [.02, .0035], [.25, .07, .181], GLD, 1, .25, '', [0, 0, 0], 1)],
  lockbox: () => [
    B('box', [.34, .1, .25], [0, .05, 0], BLK, .6, .5, 'Steel box'), B('box', [.345, .012, .255], [0, .104, 0], '#141414', .6, .5, 'Lid'),
    B('box', [.08, .05, .006], [.1, .05, .126], '#0b0b0b', .2, .2, 'Keypad'), B('torus', [.016, .003], [-.08, .05, .128], GLD, 1, .25, 'Print sensor', [0, 0, 0], 1),
    B('box', [.2, .006, .004], [0, .02, .126], GLD, 1, .3, '')],
  key_vault: () => [
    B('box', [.22, .3, .08], [0, .15, 0], BLK, .6, .5, 'Steel body'), B('box', [.2, .28, .012], [0, .15, .045], '#141416', .6, .6, 'Door'),
    B('box', [.11, .014, .004], [0, .26, .053], GLD, 1, .3, 'Gold strip'), B('torus', [.022, .004], [0, .17, .053], GLD, 1, .25, 'Print sensor', [0, 0, 0], 1)],
  drawer_safe: () => [
    B('box', [.4, .14, .32], [0, .07, 0], BLK, .6, .5, 'Safe body'), B('box', [.38, .12, .01], [0, .07, .162], '#151515', .6, .6, 'Front'),
    B('torus', [.018, .0035], [.12, .07, .168], GLD, 1, .25, 'Print sensor', [0, 0, 0], 1), B('box', [.12, .01, .004], [-.08, .07, .168], GLD, 1, .3, '')],
  wall_rail: () => [
    B('box', [.9, .06, .03], [0, .03, 0], BLK, .6, .5, 'Wall rail'),
    ...[-.4, -.13, .13, .4].map((x, i) => B('cyl', [.008, .008, .012], [x, .03, .018], STL, .9, .3, i ? '' : 'Bolts', [Math.PI / 2, 0, 0]))]
};

export function buildProduct(model) {
  const g = new THREE.Group();
  const list = [];
  const base = model && MODULES[model.base];
  if (base) list.push(...base());
  (model && Array.isArray(model.parts) ? model.parts : []).slice(0, 90).forEach(p => list.push(p));
  if (!list.length) list.push(...MODULES.lockbox());
  list.forEach(p => { const m = partMesh(p); if (m) g.add(m); });
  const box = new THREE.Box3().setFromObject(g), c = box.getCenter(new THREE.Vector3());
  g.children.forEach(m => { m.position.x -= c.x; m.position.z -= c.z; m.position.y -= box.min.y; });
  const b2 = new THREE.Box3().setFromObject(g), ctr = b2.getCenter(new THREE.Vector3());
  const size = b2.getSize(new THREE.Vector3());
  const ax = size.x <= size.y && size.x <= size.z ? 'x' : size.y <= size.z ? 'y' : 'z';
  const thin = new THREE.Vector3(ax === 'x' ? 1 : 0, ax === 'y' ? 1 : 0, ax === 'z' ? 1 : 0);
  const lo = b2.min[ax], span = Math.max(size[ax], 1e-3);
  g.children.forEach(m => { m.userData.home = m.position.clone(); const d = m.position.clone().sub(ctr); d[ax] = 0; m.userData.dir = d; m.userData.rank = clamp((m.position[ax] - lo) / span, 0, 1); });
  g.userData.size = size; g.userData.thin = thin;
  return g;
}

/* ---------------- wireframe mock-up scenes ---------------- */
function wire(geo, mats) {
  const g = new THREE.Group();
  const fill = new THREE.Mesh(geo, mats.fill); fill.renderOrder = 1;
  g.add(fill, new THREE.LineSegments(new THREE.EdgesGeometry(geo, 22), mats.line));
  return g;
}
function lineLoop(pts, mats, z) { return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts.map(([x, y]) => new THREE.Vector3(x, y, z))), mats.thin); }
const bx = (w, h, d) => new THREE.BoxGeometry(w, h, d);
function at(o, x, y, z) { o.position.set(x, y, z); return o; }

function carBody(profile, W, mats, arches) {
  const sh = new THREE.Shape(); profile.forEach(([x, y], i) => i ? sh.lineTo(x, y) : sh.moveTo(x, y));
  const yb = profile[0][1], fr = profile[profile.length - 1];
  sh.lineTo(fr[0], yb);
  arches.slice().sort((a, b) => b.x - a.x).forEach(a => { sh.lineTo(a.x + a.r, yb); sh.absarc(a.x, a.cy, a.r, 0, Math.PI, false); sh.lineTo(a.x - a.r, yb); });
  sh.lineTo(profile[0][0], yb);
  const geo = new THREE.ExtrudeGeometry(sh, { depth: W - .08, bevelEnabled: true, bevelThickness: .04, bevelSize: .04, bevelSegments: 2, curveSegments: 14 });
  geo.translate(0, 0, -(W - .08) / 2);
  return wire(geo, mats);
}
function wheel(x, y, z, r, mats) {
  const g = new THREE.Group();
  g.add(wire(new THREE.CylinderGeometry(r, r, .24, 28).rotateX(Math.PI / 2), mats));
  g.add(wire(new THREE.CylinderGeometry(r * .55, r * .55, .25, 10).rotateX(Math.PI / 2), mats));
  return at(g, x, y, z);
}
function seats(mats0, y, W, rows) {
  const g = new THREE.Group(), mats = { fill: mats0.fill, line: mats0.thin };
  rows.forEach((x, i) => {
    (i === 0 ? [-W * .24, W * .24] : [0]).forEach(z => {
      const w = i === 0 ? .5 : W * .8;
      g.add(at(wire(bx(.5, .12, w), mats), x, y, z));
      g.add(at(wire(bx(.1, .55, w).rotateZ(.2), mats), x - .27, y + .3, z));
    });
  });
  return g;
}

function vehicle(type, mats) {
  const S = new THREE.Group();
  let W, anchors, open, wide, openCam;
  if (type === 'sedan' || type === 'hatchback') {
    const hb = type === 'hatchback';
    W = 1.82;
    const L = hb ? 2.1 : 2.36, wr = .33, ax = hb ? 1.35 : 1.45;
    const prof = hb
      ? [[-L, .3], [-L - .02, .7], [-L + .05, 1.05], [-L + .18, 1.42], [-.2, 1.47], [.62, 1.45], [1.3, 1.0], [L - .08, .84], [L + .02, .6], [L, .32]]
      : [[-L, .3], [-L - .03, .62], [-L + .06, .95], [-L + .12, .98], [-1.38, .98], [-.62, 1.42], [.45, 1.45], [1.3, 1.0], [L - .1, .84], [L + .02, .62], [L, .32]];
    S.add(carBody(prof, W, mats, [{ x: ax, cy: .34, r: .4 }, { x: -ax, cy: .34, r: .4 }]));
    [ax, -ax].forEach(x => [-W / 2 + .1, W / 2 - .1].forEach(z => S.add(wheel(x, wr, z, wr, mats))));
    const win = hb ? [[-L + .2, 1.05], [-L + .26, 1.36], [.6, 1.39], [1.22, 1.02]] : [[-1.3, 1.0], [-.62, 1.36], [.42, 1.39], [1.2, 1.02]];
    [W / 2 + .005, -W / 2 - .005].forEach(z => { S.add(lineLoop(win, mats, z)); S.add(lineLoop([[0, .4], [0, 1.0]], mats, z)); });
    S.add(seats(mats, .5, W, hb ? [.2, -.95] : [.25, -.75]));
    S.add(at(wire(new THREE.TorusGeometry(.17, .012, 4, 24).rotateY(Math.PI / 2).rotateZ(.35), { fill: mats.fill, line: mats.thin }), .78, 1.02, -W * .24));
    S.add(at(wire(bx(.3, .22, W - .2), { fill: mats.fill, line: mats.thin }), 1.1, .86, 0));
    if (!hb) {
      S.add(at(wire(bx(.86, .5, W - .3), mats), -1.82, .71, 0));
      const pv = at(new THREE.Group(), -1.38, 1.0, 0); pv.add(at(wire(bx(.9, .035, W - .12), mats), -.45, 0, 0)); S.add(pv);
      open = k => { pv.rotation.z = -1.15 * k; };
      anchors = { trunk_floor: { p: [-1.82, .47, 0], front: [-1, 0, 0], type: 'floor', max: [.8, .45, 1.4] }, trunk_side: { p: [-1.82, .72, -W / 2 + .16], front: [0, 0, 1], type: 'wall', max: [.8, .45, .3] }, under_seat: { p: [.25, .36, -W * .24], front: [1, 0, 0], type: 'floor', max: [.45, .12, .45] } };
      openCam = [[-5.2, 2.6, 2.2], [-1.8, .8, 0]];
    } else {
      const pv = at(new THREE.Group(), -L + .2, 1.44, 0); pv.add(at(wire(bx(.06, .78, W - .12).rotateZ(.12), mats), -.08, -.38, 0)); S.add(pv);
      S.add(at(wire(bx(.7, .45, W - .3), mats), -L + .5, .66, 0));
      open = k => { pv.rotation.z = -1.75 * k; };
      anchors = { trunk_floor: { p: [-L + .5, .45, 0], front: [-1, 0, 0], type: 'floor', max: [.65, .45, 1.3] }, under_seat: { p: [.2, .36, -W * .24], front: [1, 0, 0], type: 'floor', max: [.45, .12, .45] } };
      openCam = [[-4.8, 2.5, 2.4], [-L + .5, .8, 0]];
    }
    wide = [[-5.6, 3.1, 5.0], [0, .75, 0]];
  } else if (type === 'suv') {
    W = 1.95; const L = 2.4, wr = .38;
    const prof = [[-L, .38], [-L - .02, .72], [-L + .04, 1.02], [-L + .14, 1.72], [-2.1, 1.78], [.6, 1.8], [1.45, 1.18], [L - .1, 1.02], [L + .02, .74], [L, .4]];
    S.add(carBody(prof, W, mats, [{ x: 1.5, cy: .38, r: .45 }, { x: -1.5, cy: .38, r: .45 }]));
    [1.5, -1.5].forEach(x => [-W / 2 + .1, W / 2 - .1].forEach(z => S.add(wheel(x, wr, z, wr, mats))));
    [W / 2 + .005, -W / 2 - .005].forEach(z => { S.add(lineLoop([[-L + .2, 1.1], [-L + .26, 1.66], [.55, 1.7], [1.38, 1.2]], mats, z)); S.add(lineLoop([[-.6, .5], [-.6, 1.1]], mats, z)); S.add(lineLoop([[.45, .5], [.45, 1.15]], mats, z)); });
    S.add(seats(mats, .62, W, [.4, -.75]));
    S.add(at(wire(bx(.85, .5, W - .3), mats), -L + .55, .85, 0));
    const pv = at(new THREE.Group(), -L + .14, 1.74, 0); pv.add(at(wire(bx(.06, 1.0, W - .12).rotateZ(.08), mats), -.05, -.5, 0)); S.add(pv);
    open = k => { pv.rotation.z = -1.8 * k; };
    anchors = { trunk_floor: { p: [-L + .55, .62, 0], front: [-1, 0, 0], type: 'floor', max: [.8, .6, 1.5] }, cargo_side: { p: [-L + .55, .95, -W / 2 + .17], front: [0, 0, 1], type: 'wall', max: [.8, .6, .3] }, under_seat: { p: [.4, .46, -W * .24], front: [1, 0, 0], type: 'floor', max: [.45, .12, .45] } };
    wide = [[-6, 3.4, 5.4], [0, .9, 0]]; openCam = [[-5.6, 2.9, 2.6], [-L + .5, 1.0, 0]];
  } else { // pickup
    W = 1.98; const wr = .42;
    const prof = [[-.7, .45], [-.72, 1.86], [-.55, 1.92], [.45, 1.92], [1.25, 1.32], [2.5, 1.16], [2.64, .82], [2.62, .45]];
    S.add(carBody(prof, W, mats, [{ x: 1.6, cy: .42, r: .48 }]));
    S.add(at(wire(bx(2.05, .45, W - .06), mats), -1.75, .675, 0));
    S.add(at(wire(bx(2.0, .04, W - .12), mats), -1.75, .9, 0));
    S.add(at(wire(bx(.06, .52, W - .06), mats), -.78, 1.16, 0));
    [W / 2 - .03, -W / 2 + .03].forEach(z => S.add(at(wire(bx(2.05, .52, .06), mats), -1.75, 1.16, z)));
    const pv = at(new THREE.Group(), -2.77, .9, 0); pv.add(at(wire(bx(.06, .52, W - .06), mats), 0, .26, 0)); S.add(pv);
    [1.6, -1.85].forEach(x => [-W / 2 + .1, W / 2 - .1].forEach(z => S.add(wheel(x, wr, z, wr, mats))));
    [W / 2 + .005, -W / 2 - .005].forEach(z => S.add(lineLoop([[-.6, 1.22], [-.55, 1.8], [.42, 1.82], [1.15, 1.32]], mats, z)));
    S.add(seats(mats, .78, W, [.45, -.3]));
    open = k => { pv.rotation.z = 1.5 * k; };
    anchors = { bed_floor: { p: [-1.75, .92, 0], front: [-1, 0, 0], type: 'floor', max: [1.9, .5, 1.8] }, bed_wall: { p: [-.84, 1.16, 0], front: [-1, 0, 0], type: 'wall', max: [1.6, .45, .3] }, under_seat: { p: [-.3, .62, 0], front: [1, 0, 0], type: 'floor', max: [1.2, .2, .4] } };
    anchors.trunk_floor = anchors.bed_floor;
    wide = [[-6.4, 3.6, 5.4], [-.3, 1.0, 0]]; openCam = [[-5.8, 3.0, 2.4], [-1.8, 1.0, 0]];
  }
  return { group: S, anchors, open, wide, openCam, def: Object.keys(anchors)[0] };
}

function home(type, mats) {
  const S = new THREE.Group(); let anchors, open = () => {}, wide, openCam, def;
  const wall = (w = 4, h = 2.7) => { S.add(at(wire(bx(w, h, .1), mats), 0, h / 2, -.05)); };
  if (type === 'wall' || type === 'garage') {
    wall(4.2, 2.8);
    if (type === 'garage') { S.add(at(wire(bx(1.2, .9, .5), mats), 1.4, .45, .25)); S.add(at(wire(bx(1.5, .04, .35), mats), 1.4, 1.6, .18)); }
    else { S.add(at(wire(bx(1.6, .75, .4), mats), 1.35, .375, .2)); S.add(at(wire(bx(.5, .05, .3), mats), 1.35, .95, .2)); }
    anchors = { wall: { p: [-.4, 1.25, 0], front: [0, 0, 1], type: 'wall', max: [1.6, 1.8, .4] }, floor: { p: [-.4, 0, .5], front: [0, 0, 1], type: 'floor', max: [1.5, 1.5, 1] } };
    wide = [[2.4, 1.7, 4.4], [-.2, 1.1, 0]]; openCam = wide; def = 'wall';
  } else if (type === 'closet' || type === 'cabinet') {
    wall();
    const cl = type === 'closet', W = cl ? 1.2 : 1.5, H = cl ? 2.2 : .82, D = cl ? .6 : .46;
    S.add(at(wire(bx(W, H, D), mats), 0, H / 2, D / 2));
    if (cl) S.add(at(wire(bx(W - .04, .03, D - .04), mats), 0, 1.6, D / 2));
    const dl = at(new THREE.Group(), -W / 2, 0, D), dr = at(new THREE.Group(), W / 2, 0, D);
    dl.add(at(wire(bx(W / 2, H - .02, .03), mats), W / 4, H / 2, .015)); dr.add(at(wire(bx(W / 2, H - .02, .03), mats), -W / 4, H / 2, .015));
    S.add(dl, dr);
    open = k => { dl.rotation.y = -1.7 * k; dr.rotation.y = 1.7 * k; };
    anchors = { [cl ? 'closet_floor' : 'cabinet_floor']: { p: [0, .04, D / 2], front: [0, 0, 1], type: 'floor', max: [W - .1, H - .1, D - .05] }, [cl ? 'closet_back' : 'cabinet_back']: { p: [0, H * .55, .02], front: [0, 0, 1], type: 'wall', max: [W - .1, H - .3, D - .1] } };
    if (cl) anchors.closet_shelf = { p: [0, 1.62, D / 2], front: [0, 0, 1], type: 'floor', max: [W - .1, .5, D - .05] };
    wide = cl ? [[2.2, 1.9, 3.6], [0, 1.1, .3]] : [[1.9, 1.4, 2.6], [0, .45, .3]]; openCam = wide; def = Object.keys(anchors)[0];
  } else if (type === 'desk' || type === 'nightstand') {
    wall();
    const ds = type === 'desk', W = ds ? 1.4 : .5, H = ds ? .75 : .6, D = ds ? .7 : .45;
    S.add(at(wire(bx(W, .04, D), mats), 0, H - .02, D / 2));
    if (ds) [-W / 2 + .03, W / 2 - .03].forEach(x => S.add(at(wire(bx(.05, H - .04, D - .05), mats), x, (H - .04) / 2, D / 2)));
    else S.add(at(wire(bx(W, H - .04, D), mats), 0, (H - .04) / 2, D / 2));
    const dx = ds ? .35 : 0, dw = ds ? .5 : W - .04, dy = ds ? H - .12 : H - .18;
    const dr = new THREE.Group(); dr.add(at(wire(bx(dw, .12, D - .06), mats), dx, dy, D / 2)); S.add(dr);
    open = k => { dr.position.z = (D - .15) * k; };
    anchors = { drawer: { p: [dx, dy - .05, D / 2], front: [0, 0, 1], type: 'floor', max: [dw - .05, .1, D - .1], moves: dr }, [ds ? 'desk_top' : 'nightstand_top']: { p: [ds ? -.35 : 0, H, D / 2], front: [0, 0, 1], type: 'floor', max: [W * .6, .6, D - .1] } };
    if (ds) S.add(at(wire(bx(.5, .45, .5), mats), -.2, .225, .9));
    wide = ds ? [[2.0, 1.7, 2.8], [0, .5, .35]] : [[1.3, 1.2, 1.9], [0, .4, .25]]; openCam = wide; def = 'drawer';
  } else if (type === 'bed') {
    wall();
    S.add(at(wire(bx(1.6, .32, 2.05), mats), 0, .3, 1.05));
    S.add(at(wire(bx(1.55, .22, 1.95), mats), 0, .57, 1.05));
    S.add(at(wire(bx(1.7, 1.1, .08), mats), 0, .55, .04));
    S.add(at(wire(bx(.5, .55, .42), mats), 1.15, .275, .25));
    anchors = { under_bed: { p: [-.35, .02, 1.3], front: [1, 0, 0], type: 'floor', max: [1, .12, .8] }, headboard: { p: [0, .78, .09], front: [0, 0, 1], type: 'wall', max: [1.4, .4, .2] }, nightstand_top: { p: [1.15, .55, .25], front: [0, 0, 1], type: 'floor', max: [.45, .5, .38] } };
    wide = [[2.9, 2.2, 3.6], [0, .4, .9]]; openCam = wide; def = 'under_bed';
  } else {
    anchors = { floor: { p: [0, 0, 0], front: [0, 0, 1], type: 'floor', max: [3, 3, 3] } };
    wide = [[2.2, 1.6, 2.8], [0, .4, 0]]; openCam = wide; def = 'floor';
  }
  return { group: S, anchors, open, wide, openCam, def };
}

export const SCENES = ['sedan', 'hatchback', 'suv', 'pickup', 'wall', 'garage', 'closet', 'cabinet', 'desk', 'nightstand', 'bed', 'floor'];
const buildScene = (type, mats) => ['sedan', 'hatchback', 'suv', 'pickup'].includes(type) ? vehicle(type, mats) : home(type, mats);

const DEF_STEPS = {
  car: [['view', 'Your car', 'A clear view of where it goes.'], ['open', 'Open the trunk', 'Clear the floor.'], ['place', 'Set the LOCKG', 'It sits flat on the trunk floor.'], ['fix', 'Bolt it down', '4 bolts into the floor.'], ['close', 'Close and go', 'Locked. Only your print opens it.']],
  pickup: [['view', 'Your pickup', 'A clear view of the bed.'], ['open', 'Drop the tailgate', 'Easy reach to the bed.'], ['place', 'Set the LOCKG', 'On the bed floor.'], ['fix', 'Bolt it down', '4 bolts through the bed.'], ['close', 'Close and go', 'Locked. Only your print opens it.']],
  open: [['view', 'Your space', 'Where it goes.'], ['open', 'Open it', 'Make room.'], ['place', 'Set the LOCKG', 'It slides into place.'], ['fix', 'Fix it', 'Hidden bolts hold it.'], ['lock', 'Locked', 'Only your print opens it.']],
  wall: [['view', 'Your wall', 'Where it goes.'], ['place', 'Hold it to the wall', 'Level, at chest height.'], ['fix', 'Four anchor bolts', 'Hidden behind the rail.'], ['lock', 'Locked', 'Only your print opens it.']],
  floor: [['view', 'The product', 'Real size.'], ['place', 'Set it down', ''], ['lock', 'Locked', 'Only your print opens it.']]
};

/* ---------------- lighting stage ---------------- */
function stage(renderer, showcase) {
  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
  const key = new THREE.SpotLight(0xffe6c8, 30, 14, .6, .8, 1.2); key.position.set(1.4, 3.2, 2.4); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -.0004;
  const rim = new THREE.DirectionalLight(0xffd8b0, 1.4); rim.position.set(-2, 1.4, -1.5);
  scene.add(key, key.target, rim, new THREE.HemisphereLight(0xfff1dc, 0x1a140f, .55));
  let ring = null;
  if (showcase) {
    const floor = new THREE.Mesh(new THREE.CircleGeometry(1.6, 64), new THREE.ShadowMaterial({ opacity: .45 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
    ring = new THREE.Mesh(new THREE.RingGeometry(.5, .512, 96), new THREE.MeshBasicMaterial({ color: 0xc8a574, transparent: true, opacity: .55 }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = .002; scene.add(ring);
  }
  return { scene, ring, key };
}

/* ---------------- overlay UI ---------------- */
let cssDone = false;
function ui(el) {
  if (!cssDone) {
    cssDone = true;
    const s = document.createElement('style');
    s.textContent = `.v3ui{position:absolute;inset:0;pointer-events:none;font-family:'Jost',system-ui,sans-serif;color:var(--ivory,#F2EDE4);z-index:2}
.v3ui .bt{position:absolute;right:12px;top:12px;display:flex;gap:6px;pointer-events:auto}
.v3ui .bt button{height:32px;padding:0 13px;border-radius:999px;border:1px solid color-mix(in srgb,var(--gold,#C8A574) 40%,transparent);background:color-mix(in srgb,var(--ink,#15130F) 65%,transparent);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);color:inherit;font:400 11.5px 'Jost',system-ui,sans-serif;letter-spacing:.04em;cursor:pointer;display:flex;align-items:center;gap:6px;transition:background .25s,color .25s;touch-action:manipulation}
.v3ui .bt button.on{background:linear-gradient(135deg,var(--a1,#e2c38f),var(--a2,#a9834f));color:var(--ink,#15130F);border-color:transparent}
.v3ui .cap{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);width:min(92%,420px);text-align:center;transition:opacity .4s}
.v3ui .cap .st{display:flex;justify-content:center;gap:6px;margin-bottom:9px;pointer-events:auto}
.v3ui .cap .st i{width:22px;height:3px;border-radius:2px;background:rgba(255,255,255,.16);cursor:pointer;transition:background .3s,width .3s}
.v3ui .cap .st i.on{background:var(--gold,#C8A574);width:34px}.v3ui .cap .st i.done{background:color-mix(in srgb,var(--gold,#C8A574) 55%,transparent)}
.v3ui .cap b{display:block;font:400 19px/1.15 'Cormorant Garamond',Georgia,serif}.v3ui .cap small{display:block;font-size:11.5px;opacity:.65;margin-top:3px;min-height:14px}
.v3ui .cap em{font:500 9px 'Jost',sans-serif;letter-spacing:.3em;color:var(--gold,#C8A574);font-style:normal}
.v3ui .lb{position:absolute;left:0;top:0;white-space:nowrap;font:400 10.5px 'Jost',sans-serif;padding:4px 9px;border-radius:999px;background:color-mix(in srgb,var(--ink,#15130F) 72%,transparent);border:1px solid color-mix(in srgb,var(--gold,#C8A574) 35%,transparent);opacity:0;transition:opacity .35s}
.v3ui .lb.on{opacity:1}`;
    document.head.appendChild(s);
  }
  const u = document.createElement('div'); u.className = 'v3ui';
  u.innerHTML = `<div class="bt"></div><div class="cap" style="opacity:0"><div class="st"></div><em></em><b></b><small></small></div>`;
  el.appendChild(u); return u;
}

/* ---------------- live viewer ---------------- */
export function mount(el, model, opt = {}) {
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05; renderer.outputColorSpace = THREE.SRGBColorSpace;
  el.appendChild(renderer.domElement); renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;touch-action:none';
  const U = opt.ui === false ? null : ui(el);
  const cam = new THREE.PerspectiveCamera(32, 1, .01, 80);
  const ctl = new OrbitControls(cam, renderer.domElement); ctl.enableDamping = true; ctl.enablePan = false; ctl.maxPolarAngle = Math.PI * .52;
  let S = null, alive = true, user = false;
  ctl.addEventListener('start', () => { user = true; });
  const mats = {};

  function set(m) {
    const sceneType = m && m.scene && SCENES.includes(m.scene.type) ? m.scene.type : null;
    const st = stage(renderer, !sceneType);
    const gold = new THREE.Color(css('--gold', '#C8A574')), ivory = new THREE.Color(css('--ivory', '#F2EDE4'));
    mats.fill = new THREE.MeshBasicMaterial({ color: ivory, transparent: true, opacity: .035, depthWrite: false, side: THREE.DoubleSide });
    mats.line = new THREE.LineBasicMaterial({ color: gold, transparent: true, opacity: .42 });
    mats.thin = new THREE.LineBasicMaterial({ color: gold, transparent: true, opacity: .2 });
    const prod = buildProduct(m);
    const orient = new THREE.Group(), mountG = new THREE.Group(), drop = new THREE.Group();
    orient.add(prod); drop.add(orient); mountG.add(drop); st.scene.add(mountG);
    let ctx = null, A = null, steps = [], bolts = [], guide = null; const upV = new THREE.Vector3(0, 1, 0);
    if (sceneType) {
      ctx = buildScene(sceneType, mats); st.scene.add(ctx.group);
      const grid = new THREE.GridHelper(16, 32, gold, gold); grid.material.transparent = true; grid.material.opacity = .08; st.scene.add(grid);
      const shadow = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), new THREE.ShadowMaterial({ opacity: .35 })); shadow.rotation.x = -Math.PI / 2; shadow.receiveShadow = true; st.scene.add(shadow);
      A = ctx.anchors[m.mount && m.mount.at] || ctx.anchors[ctx.def];
      const ps = prod.userData.size, lay = !!(m.mount && m.mount.lay) && ps.y > Math.max(ps.x, ps.z) * 1.2;
      if (lay) orient.rotation.x = -Math.PI / 2;
      orient.updateMatrixWorld(true);
      let bb = new THREE.Box3().setFromObject(orient); const sz = bb.getSize(new THREE.Vector3());
      const mx = A.max || [9, 9, 9], k = Math.min(1, mx[0] / Math.max(sz.x, .01) * 1.1, mx[2] / Math.max(sz.z, .01) * 1.1, mx[1] / Math.max(sz.y, .01) * 1.3);
      if (k < 1) { orient.scale.setScalar(k); orient.updateMatrixWorld(true); bb = new THREE.Box3().setFromObject(orient); }
      const c = bb.getCenter(new THREE.Vector3());
      if (A.type === 'wall') { orient.position.set(-c.x, -c.y, -bb.min.z); upV.set(0, 0, 1); }
      else { orient.position.set(-c.x, -bb.min.y, -c.z); }
      orient.updateMatrixWorld(true);
      const bs = new THREE.Box3().setFromObject(orient).getSize(new THREE.Vector3());
      const bm = new THREE.MeshStandardMaterial({ color: gold, metalness: 1, roughness: .3 });
      const corners = A.type === 'wall'
        ? [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => [a * (bs.x / 2 - .02), b * (bs.y / 2 - .03), 0])
        : [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => [a * (bs.x / 2 - .025), 0, b * (bs.z / 2 - .025)]);
      corners.forEach(p => { const bo = new THREE.Mesh(new THREE.CylinderGeometry(.009, .009, .07, 12), bm); if (A.type === 'wall') bo.rotation.x = Math.PI / 2; bo.userData.p = new THREE.Vector3(...p); bo.visible = false; mountG.add(bo); bolts.push(bo); });
      const gg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), upV.clone().multiplyScalar(.9)]);
      guide = new THREE.Line(gg, new THREE.LineDashedMaterial({ color: gold, dashSize: .04, gapSize: .03, transparent: true, opacity: 0 })); guide.computeLineDistances(); mountG.add(guide);
      // face the anchor
      const f = new THREE.Vector3(...A.front), along = new THREE.Vector3(f.z, 0, -f.x);
      mountG.rotation.y = lay && A.type !== 'wall' ? Math.atan2(-along.x, -along.z) : Math.atan2(f.x, f.z);
      mountG.position.set(...A.p);
      if (A.moves) A.moves.attach(mountG);
      const kind = ['sedan', 'hatchback', 'suv'].includes(sceneType) ? 'car' : sceneType === 'pickup' ? 'pickup' : ['wall', 'garage'].includes(sceneType) ? 'wall' : sceneType === 'floor' ? 'floor' : 'open';
      const ACT = ['view', 'open', 'place', 'fix', 'close', 'lock'];
      steps = Array.isArray(m.steps) && m.steps.length ? m.steps.slice(0, 7).map(s => [ACT.includes(s.a) ? s.a : 'view', String(s.t || '').slice(0, 40), String(s.d || '').slice(0, 90)]) : DEF_STEPS[kind];
      if (!steps.some(s => s[0] === 'place')) steps.splice(Math.min(2, steps.length), 0, ['place', 'Set the LOCKG', '']);
      st.key.position.set(A.p[0] + 1.5, A.p[1] + 3.2, A.p[2] + 2.5); st.key.target.position.set(...A.p);
    } else {
      const sz = prod.userData.size, k = 1 / Math.max(sz.x, sz.y, sz.z, .01); orient.scale.setScalar(k);
    }
    const wb = new THREE.Box3().setFromObject(orient);
    S = { root: st.scene, st, prod, orient, mountG, drop, ctx, A, steps, bolts, guide, upV, sceneType, step: 0, t0: performance.now(), play: !!sceneType, ex: 0, exT: 0 };
    if (sceneType) { cam.position.set(...ctx.wide[0]); ctl.target.set(...ctx.wide[1]); ctl.minDistance = .4; ctl.maxDistance = 14; ctl.autoRotate = false; }
    else { cam.position.set(1.9, 1.25, 2.9); ctl.target.set(0, wb.getSize(new THREE.Vector3()).y / 2, 0); ctl.minDistance = 1.2; ctl.maxDistance = 5; ctl.autoRotate = opt.spin !== false; ctl.autoRotateSpeed = 1.6; }
    user = false;
    labels(); buttons();
  }

  let lbs = [];
  function labels() {
    if (!U) return; lbs.forEach(l => l.el.remove()); lbs = [];
    const seen = new Set();
    S.prod.children.forEach(mh => { const n = mh.userData.n; if (!n || seen.has(n) || lbs.length >= 7) return; seen.add(n); const e = document.createElement('div'); e.className = 'lb'; e.textContent = n; U.appendChild(e); lbs.push({ el: e, m: mh }); });
  }
  function buttons() {
    if (!U) return; const bt = U.querySelector('.bt'); bt.innerHTML = '';
    const mk = (t, f) => { const b = document.createElement('button'); b.innerHTML = t; b.onclick = e => { e.stopPropagation(); f(b); }; bt.appendChild(b); return b; };
    if (S.sceneType) mk('<svg width="9" height="9" viewBox="0 0 10 10"><path d="M2 1l7 4-7 4z" fill="currentColor"/></svg>Install', () => { S.exT = 0; syncEx(); S.step = 0; S.t0 = performance.now(); S.play = true; user = false; caption(); });
    S.exB = mk('Explode', () => { S.exT = S.exT ? 0 : 1; if (S.exT && S.sceneType) { S.play = false; S.step = S.steps.length - 1; S.t0 = -1e9; user = false; } syncEx(); });
    caption();
  }
  function syncEx() { if (S.exB) S.exB.classList.toggle('on', !!S.exT); caption(); }
  function caption() {
    if (!U) return; const cap = U.querySelector('.cap');
    if (!S.sceneType || S.exT) { cap.style.opacity = 0; return; }
    const i = clamp(S.step, 0, S.steps.length - 1), s = S.steps[i];
    cap.style.opacity = 1;
    const st = cap.querySelector('.st');
    if (st.children.length !== S.steps.length) { st.innerHTML = S.steps.map(() => '<i></i>').join(''); [...st.children].forEach((d, j) => d.onclick = e => { e.stopPropagation(); S.step = j; S.t0 = performance.now(); S.play = false; user = false; caption(); }); }
    [...st.children].forEach((d, j) => { d.className = j === i ? 'on' : j < i ? 'done' : ''; });
    cap.querySelector('em').textContent = String(i + 1).padStart(2, '0') + ' / ' + String(S.steps.length).padStart(2, '0');
    cap.querySelector('b').textContent = s[1]; cap.querySelector('small').textContent = s[2];
  }

  set(model);
  const fit = () => { const w = el.clientWidth || 300, h = el.clientHeight || 300; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  const ro = new ResizeObserver(fit); ro.observe(el); fit();
  const STEP = 2700, v = new THREE.Vector3(), tp = new THREE.Vector3(), tt = new THREE.Vector3();
  let lastStep = -2, lastT = performance.now();
  const loop = (now) => {
    if (!alive) return; requestAnimationFrame(loop);
    if (!S) return;
    const dt = Math.min(.05, (now - lastT) / 1000); lastT = now;
    // explode: straight out from the centre, gently staggered, no spin
    S.ex += (S.exT - S.ex) * Math.min(1, dt * 3.2);
    const sz = S.prod.userData.size, spread = Math.max(sz.x, sz.y, sz.z), thin = S.prod.userData.thin;
    S.prod.children.forEach(mh => {
      const r = mh.userData.rank, e = eio(clamp(S.ex * 1.3 - r * .3, 0, 1));
      mh.position.copy(mh.userData.home).addScaledVector(thin, e * spread * (.04 + r * .22)).addScaledVector(mh.userData.dir, e * .22);
    });
    if (S.sceneType) {
      if (S.play && now - S.t0 > STEP) { if (S.step < S.steps.length - 1) { S.step++; S.t0 = now; } else S.play = false; }
      if (S.step !== lastStep) { lastStep = S.step; if (!S.exT) user = false; caption(); }
      const k = clamp((now - S.t0) / (STEP * .7), 0, 1);
      const ixOf = a => S.steps.findIndex(s => s[0] === a);
      const val = a => { const ix = ixOf(a); if (ix < 0) return 0; return ix < S.step ? 1 : ix === S.step ? k : 0; };
      S.ctx.open(eio(Math.max(0, val('open') - val('close'))));
      const pIx = ixOf('place'), pl = eio(val('place'));
      S.drop.position.copy(S.upV).multiplyScalar((1 - pl) * .9);
      S.orient.visible = S.step >= pIx;
      S.guide.material.opacity = S.step === pIx ? .8 * (1 - pl * .7) : 0;
      const fx = val('fix');
      S.bolts.forEach((b, i) => { const e = eout(clamp(fx * 1.6 - i * .15, 0, 1)); b.visible = fx > 0; b.position.copy(b.userData.p).addScaledVector(S.upV, (1 - e) * .25 + .015); if (S.A.type === 'wall') b.rotation.z = (1 - e) * 12; else b.rotation.y = (1 - e) * 12; });
      const lk = Math.max(val('lock'), val('close')), pulse = lk > 0 && lk < 1 ? Math.sin(lk * Math.PI) : 0;
      S.prod.children.forEach(mh => { if (mh.userData.glow) mh.material.emissiveIntensity = .6 + pulse * 3; });
      if (!user) {
        const a = S.steps[clamp(S.step, 0, S.steps.length - 1)][0];
        const mode = S.exT ? 'close' : a === 'view' ? 'wide' : (a === 'open' || a === 'close') ? 'open' : 'close';
        if (mode === 'wide') { tp.set(...S.ctx.wide[0]); tt.set(...S.ctx.wide[1]); }
        else if (mode === 'open') { tp.set(...S.ctx.openCam[0]); tt.set(...S.ctx.openCam[1]); }
        else {
          S.mountG.getWorldPosition(tt);
          const s2 = new THREE.Box3().setFromObject(S.orient).getSize(v);
          if (S.A.type !== 'wall') tt.y += s2.y * .4;
          const f = new THREE.Vector3(...S.A.front), side = new THREE.Vector3(f.z, 0, -f.x);
          const dist = clamp(Math.max(s2.x, s2.y, s2.z) * 3.2 * (S.exT ? 1.3 : 1), 1.0, 4.2);
          tp.copy(tt).addScaledVector(f, dist * .8).addScaledVector(side, dist * .45); tp.y += dist * .7;
        }
        cam.position.lerp(tp, .045); ctl.target.lerp(tt, .05);
      }
    } else if (S.st.ring) S.st.ring.material.color.set(css('--gold', '#C8A574'));
    if (U && lbs.length) { const w = el.clientWidth, h = el.clientHeight; const used = []; lbs.forEach(l => { l.m.getWorldPosition(v); v.project(cam); const x = (v.x * .5 + .5) * w, y = (-v.y * .5 + .5) * h; l.el.style.transform = `translate(${x}px,${y}px) translate(-50%,-160%)`; const free = !used.some(([a, b]) => Math.abs(a - x) < 90 && Math.abs(b - y) < 26); if (free) used.push([x, y]); l.el.classList.toggle('on', S.ex > .7 && v.z < 1 && free); }); }
    ctl.update(); renderer.render(S.root, cam);
  };
  requestAnimationFrame(loop);
  const onTheme = () => { const g = css('--gold', '#C8A574'); mats.line && mats.line.color.set(g); mats.thin && mats.thin.color.set(g); };
  addEventListener('lockg-theme', onTheme);
  return { set, renderer, explode: on => { S.exT = on ? 1 : 0; syncEx(); }, dispose() { alive = false; ro.disconnect(); ctl.dispose(); renderer.dispose(); removeEventListener('lockg-theme', onTheme); el.querySelectorAll('.v3ui').forEach(x => x.remove()); renderer.domElement.remove(); } };
}

/* still picture for cards (product only) */
let snapR = null;
export function snapshot(model, w = 360, h = 300) {
  if (!snapR) { snapR = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); snapR.shadowMap.enabled = true; snapR.toneMapping = THREE.ACESFilmicToneMapping; snapR.outputColorSpace = THREE.SRGBColorSpace; }
  snapR.setPixelRatio(1); snapR.setSize(w, h, false);
  const { scene, ring } = stage(snapR, true); ring.material.color.set(css('--gold', '#C8A574'));
  const o = buildProduct(model); const sz = o.userData.size, k = 1 / Math.max(sz.x, sz.y, sz.z, .01); o.scale.setScalar(k); scene.add(o);
  const cam = new THREE.PerspectiveCamera(30, w / h, .01, 50); cam.position.set(1.4, 1.0, 2.25); cam.lookAt(0, sz.y * k / 2, 0);
  snapR.render(scene, cam);
  return snapR.domElement.toDataURL('image/png');
}
