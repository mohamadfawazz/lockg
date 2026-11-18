/* LOCKG product 3D viewer: turns an admin "parts" spec into a lit, turning showcase */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const num = (v, d) => (typeof v === 'number' && isFinite(v) ? v : d);
const arr = (a, n, d) => Array.from({ length: n }, (_, i) => num(Array.isArray(a) ? a[i] : undefined, d));
const col = c => (/^#[0-9a-f]{6}$/i.test(c || '') ? c : '#888888');

export function build(model) {
  const g = new THREE.Group();
  (model && Array.isArray(model.parts) ? model.parts : []).slice(0, 80).forEach(p => {
    let geo;
    const s = p.s || [];
    if (p.t === 'box') { const [w, h, d] = arr(s, 3, .05); geo = new RoundedBoxGeometry(Math.max(w, .001), Math.max(h, .001), Math.max(d, .001), 3, Math.min(w, h, d) * .12); }
    else if (p.t === 'cyl') { const [a, b, h] = arr(s, 3, .02); geo = new THREE.CylinderGeometry(a, b, h, 48); }
    else if (p.t === 'sphere') geo = new THREE.SphereGeometry(num(s[0], .02), 40, 24);
    else if (p.t === 'torus') { const [r, t] = arr(s, 2, .01); geo = new THREE.TorusGeometry(r, t, 20, 64); }
    else if (p.t === 'cone') { const [r, h] = arr(s, 2, .02); geo = new THREE.ConeGeometry(r, h, 40); }
    else return;
    const m = new THREE.MeshPhysicalMaterial({ color: col(p.c), metalness: Math.min(1, Math.max(0, num(p.m, .5))), roughness: Math.min(1, Math.max(.05, num(p.g, .4))), clearcoat: num(p.m, .5) > .6 ? .4 : .1, clearcoatRoughness: .3 });
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(...arr(p.p, 3, 0)); mesh.rotation.set(...arr(p.r, 3, 0));
    mesh.castShadow = mesh.receiveShadow = true;
    g.add(mesh);
  });
  // centre it and scale to a ~1 unit showcase
  const box = new THREE.Box3().setFromObject(g), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
  const k = 1 / Math.max(size.x, size.y, size.z, .01);
  g.children.forEach(m => m.position.sub(c));
  const wrap = new THREE.Group(); wrap.add(g); wrap.scale.setScalar(k); wrap.position.y = size.y * k / 2;
  wrap.userData.h = size.y * k;
  return wrap;
}

function stage(renderer) {
  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
  const key = new THREE.SpotLight(0xffe6c8, 30, 8, .55, .8, 1.4); key.position.set(1.4, 2.6, 2); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -.0004;
  const rim = new THREE.DirectionalLight(0xffd8b0, 1.4); rim.position.set(-2, 1.4, -1.5);
  scene.add(key, rim, new THREE.HemisphereLight(0xfff1dc, 0x1a140f, .5));
  const floor = new THREE.Mesh(new THREE.CircleGeometry(1.6, 64), new THREE.ShadowMaterial({ opacity: .45 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const ring = new THREE.Mesh(new THREE.RingGeometry(.5, .512, 96), new THREE.MeshBasicMaterial({ color: 0xc8a574, transparent: true, opacity: .55 }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = .002; scene.add(ring);
  return { scene, ring };
}

const gold = () => { try { return getComputedStyle(document.documentElement).getPropertyValue('--gold').trim() || '#C8A574'; } catch (e) { return '#C8A574'; } };

/* live, turning viewer inside an element */
export function mount(el, model, opt = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: !!opt.keep });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05; renderer.outputColorSpace = THREE.SRGBColorSpace;
  el.appendChild(renderer.domElement); renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;touch-action:none';
  const { scene, ring } = stage(renderer);
  const cam = new THREE.PerspectiveCamera(32, 1, .01, 50); cam.position.set(1.9, 1.25, 2.9);
  const ctl = new OrbitControls(cam, renderer.domElement); ctl.enableDamping = true; ctl.enablePan = false; ctl.minDistance = 1.2; ctl.maxDistance = 5; ctl.autoRotate = opt.spin !== false; ctl.autoRotateSpeed = 1.6; ctl.maxPolarAngle = Math.PI * .52;
  let obj = null, t0 = performance.now(), alive = true;
  const set = m => { if (obj) scene.remove(obj); obj = build(m); scene.add(obj); ctl.target.set(0, obj.userData.h / 2, 0); t0 = performance.now(); };
  set(model);
  const fit = () => { const w = el.clientWidth || 300, h = el.clientHeight || 300; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  const ro = new ResizeObserver(fit); ro.observe(el); fit();
  const loop = () => { if (!alive) return; requestAnimationFrame(loop);
    const k = Math.min(1, (performance.now() - t0) / 900), e = 1 - Math.pow(1 - k, 3);
    if (obj) { obj.children[0].position.y = (1 - e) * .25; obj.children[0].rotation.y = (1 - e) * -1.2; }
    ring.material.color.set(gold()); ctl.update(); renderer.render(scene, cam); };
  loop();
  return { set, renderer, dispose() { alive = false; ro.disconnect(); ctl.dispose(); renderer.dispose(); renderer.domElement.remove(); } };
}

/* still picture for cards */
let snapR = null;
export function snapshot(model, w = 360, h = 300) {
  if (!snapR) { snapR = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); snapR.shadowMap.enabled = true; snapR.toneMapping = THREE.ACESFilmicToneMapping; snapR.outputColorSpace = THREE.SRGBColorSpace; }
  snapR.setPixelRatio(1); snapR.setSize(w, h, false);
  const { scene, ring } = stage(snapR); ring.material.color.set(gold());
  const o = build(model); scene.add(o);
  const cam = new THREE.PerspectiveCamera(30, w / h, .01, 50); cam.position.set(1.4, 1.0, 2.25); cam.lookAt(0, o.userData.h / 2, 0);
  snapR.render(scene, cam);
  return snapR.domElement.toDataURL('image/png');
}
