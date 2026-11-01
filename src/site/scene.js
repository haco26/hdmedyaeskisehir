import {readGeometry, saveGeometry} from './scene-cache.js';
import * as THREE from './vendor/three/build/three.module.js';
import { createReferenceShapes } from './logo-shape.js?v=machined-4-final';
import { RoomEnvironment } from './vendor/three/examples/jsm/environments/RoomEnvironment.js';

const stage = document.querySelector('#heroStage');
const canvas = document.querySelector('#logo3d');

async function start() {
  if (!stage || !canvas) return;

  try {
    const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
    const mobileScene = matchMedia('(max-width: 850px)').matches || matchMedia('(pointer: coarse)').matches;
    stage.dataset.loadDetail = 'material';
    stage.dispatchEvent(new CustomEvent('hd:scene-progress', {detail:{phase:'material'}}));
    const bakedGeometry = readGeometry();
    let reduced = motionPreference.matches;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: mobileScene ? 'low-power' : 'high-performance'
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobileScene ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, .1, 80);
    // Render into the viewport so enlargement has no artificial stage boundary.
    canvas.classList.add('hd-scene-surface');
    document.body.append(canvas);
    const shortcuts = document.createElement('nav');
    shortcuts.className = 'hero-orbit-links';
    shortcuts.setAttribute('aria-label', 'HD Medya hizmet kısayolları');
    shortcuts.innerHTML = '<a class="orbit-folder" href="#hizmetler"><span class="orbit-meta">Hizmetler</span><strong>Çözümler</strong><span class="orbit-file" aria-hidden="true"></span></a><a class="orbit-folder" href="#projeler"><span class="orbit-meta">Seçili işler</span><strong>Projeler</strong><span class="orbit-file" aria-hidden="true"></span></a><a class="orbit-folder" href="#teklif"><span class="orbit-meta">Yeni proje</span><strong>Proje başlat</strong><span class="orbit-file" aria-hidden="true"></span></a>';
    for (const link of shortcuts.querySelectorAll('a')) {
      link.addEventListener('pointermove', event => {
        if (reduced || event.pointerType === 'touch') return;
        const bounds = link.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;
        link.style.setProperty('--folder-x', `${(x * 5).toFixed(2)}px`);
        link.style.setProperty('--folder-y', `${(y * 4).toFixed(2)}px`);
      });
      link.addEventListener('pointerleave', () => {
        link.style.removeProperty('--folder-x');
        link.style.removeProperty('--folder-y');
      });
    }
    stage.append(shortcuts);
    const sculpture = new THREE.Group();
    const body = new THREE.Group();
    // The face and rear cap straddle the same centered rotation pivot.
    body.position.z = -.22;
    sculpture.add(body);
    const ribbonOrbit = new THREE.Group();
    ribbonOrbit.position.z = -.22;
    sculpture.add(ribbonOrbit);
    sculpture.position.y = .06;
    scene.add(sculpture);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    room.traverse(object => {
      if (object.isMesh && object.material.isMeshBasicMaterial) {
        object.material.color.multiply(new THREE.Color(0xfff6e9));
      }
    });
    const environment = pmrem.fromScene(room, .025);
    scene.environment = environment.texture;
    pmrem.dispose();
    room.dispose();

    const loader = new THREE.TextureLoader();
    const [normal, roughness] = await Promise.all([
      loader.loadAsync('./assets/materials/obsidian-normal.png'),
      loader.loadAsync('./assets/materials/obsidian-roughness.png')
    ]);
    // Gold and obsidian previously fetched two byte-identical normal maps.
    const goldNormal = normal.clone();
    for (const texture of [normal, roughness, goldNormal]) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1.25, 1.25);
      texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    }

    // The supplied aged-obsidian maps are the material, not a linear brushed
    // overlay. Their fine grain remains matte; raised form is modeled below.
    const capNormal = normal.clone();
    capNormal.repeat.set(5.5, 5.5);
    const capRoughness = roughness.clone();
    capRoughness.repeat.set(1.1, 1.1);
    const metal = new THREE.MeshStandardMaterial({
      color: 0x242723,
      metalness: .86,
      roughness: .94,
      roughnessMap: capRoughness,
      normalMap: capNormal,
      normalScale: new THREE.Vector2(.35, .35),
      envMapIntensity: 1.05
    });
    const champagne = new THREE.MeshStandardMaterial({
      color: 0xbda57c,
      metalness: .95,
      roughness: .56,
      normalMap: goldNormal,
      normalScale: new THREE.Vector2(.045, .045),
      envMapIntensity: 1.05
    });
    // Extrusion duplicates side vertices. Average coincident cut normals only
    // below a crease angle; curved D highlights become continuous while serif
    // corners and the thin HD slit keep their hard, original contour.
    function shaveCutNormals(geometry) {
      const positions = geometry.getAttribute('position');
      const normals = geometry.getAttribute('normal');
      const groups = new Map();
      for (let i = 0; i < positions.count; i++) {
        const key = `${positions.getX(i).toFixed(5)},${positions.getY(i).toFixed(5)},${positions.getZ(i).toFixed(5)}`;
        const bucket = groups.get(key) || [];
        bucket.push([i, normals.getX(i), normals.getY(i), normals.getZ(i)]);
        groups.set(key, bucket);
      }
      // The traced outline has very short rounded joins between long edges.
      // Smooth their shading over a small machining radius as well as exact
      // duplicates; otherwise each long D segment keeps a separate highlight.
      const radius = .10, bins = new Map();
      for (const bucket of groups.values()) {
        const i = bucket[0][0];
        const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
        const key = `${Math.floor(x / radius)},${Math.floor(y / radius)},${z.toFixed(5)}`;
        const entries = bins.get(key) || [];
        entries.push({ x, y, bucket });
        bins.set(key, entries);
      }
      for (const bucket of groups.values()) for (const [index, x, y, z] of bucket) {
        if (Math.abs(z) > .9999) continue;
        const vx = positions.getX(index), vy = positions.getY(index);
        const bx = Math.floor(vx / radius), by = Math.floor(vy / radius);
        const level = positions.getZ(index).toFixed(5);
        let nx = 0, ny = 0, nz = 0;
        for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
          for (const entry of bins.get(`${bx + dx},${by + dy},${level}`) || []) {
            const distance = Math.hypot(entry.x - vx, entry.y - vy);
            if (distance > radius) continue;
            const weight = 1 - distance / radius;
            for (const [, ax, ay, az] of entry.bucket) {
              if (Math.abs(az) > .9999 || x * ax + y * ay + z * az < .83) continue;
              nx += ax * weight; ny += ay * weight; nz += az * weight;
            }
          }
        }
        const length = Math.hypot(nx, ny, nz) || 1;
        normals.setXYZ(index, nx / length, ny / length, nz / length);
      }
      normals.needsUpdate = true;
      return geometry;
    }

    function capCoordinates(geometry) {
      const position = geometry.getAttribute('position');
      const surfaceNormal = geometry.getAttribute('normal');
      const uv = geometry.getAttribute('uv');
      for (let i = 0; i < position.count; i++) {
        if (Math.abs(surfaceNormal.getZ(i)) > .74) {
          uv.setXY(i, position.getX(i) / 5.2 + .5, position.getY(i) / 3.317 + .5);
        }
      }
      uv.needsUpdate = true;
      return geometry;
    }

    // The cap is genuinely raised geometry, not a painted normal-map illusion.
    // Long triangles are split adaptively; the boundary stays exactly on the
    // supplied contour and the relief fades before the bevel and narrow slit.
    function raisedCapGeometry(geometry, shape, amplitude = .029) {
      const contours = shape.extractPoints(16);
      const boundaries = [contours.shape, ...contours.holes];
      const edges = [];
      for (const points of boundaries) {
        for (let i = 0; i < points.length; i++) {
          const a = points[i], b = points[(i + 1) % points.length];
          const dx = b.x - a.x, dy = b.y - a.y;
          const square = dx * dx + dy * dy;
          if (square > 1e-12) edges.push([a.x, a.y, dx, dy, square]);
        }
      }
      const reliefCache = new Map();
      // Deterministic smooth hammer marks at two physical scales.
      function grain(x, y) {
        const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
        const blend = t => t * t * t * (t * (t * 6 - 15) + 10);
        const hash = (a, b) => {
          let n = Math.imul(a, 374761393) ^ Math.imul(b, 668265263);
          n = Math.imul(n ^ (n >>> 13), 1274126177);
          return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
        };
        const u = blend(fx), v = blend(fy);
        const a = hash(ix, iy) * (1 - u) + hash(ix + 1, iy) * u;
        const b = hash(ix, iy + 1) * (1 - u) + hash(ix + 1, iy + 1) * u;
        return a * (1 - v) + b * v;
      }
      function height(x, y) {
        const key = `${x.toFixed(5)},${y.toFixed(5)}`;
        if (reliefCache.has(key)) return reliefCache.get(key);
        let distance = Infinity;
        for (const [ax, ay, dx, dy, square] of edges) {
          const t = THREE.MathUtils.clamp(((x - ax) * dx + (y - ay) * dy) / square, 0, 1);
          const ex = x - ax - dx * t, ey = y - ay - dy * t;
          distance = Math.min(distance, ex * ex + ey * ey);
        }
        const fade = THREE.MathUtils.smoothstep(Math.sqrt(distance), .018, .145);
        // Real surface relief fades completely before the machined rim.
        const hammer = grain(x * 8.5 + 17.2, y * 8.5 - 5.1);
        const fine = grain(x * 19.0 - 4.7, y * 19.0 + 23.8);
        const value = amplitude * (.18 + .70 * hammer + .12 * fine) * fade;
        reliefCache.set(key, value);
        return value;
      }
      const sourcePosition = geometry.getAttribute('position');
      const sourceNormal = geometry.getAttribute('normal');
      const sourceUv = geometry.getAttribute('uv');
      const position = [], normal = [], uv = [];
      const output = new THREE.BufferGeometry();
      let raisedVertices = 0, maximumRelief = 0;
      function append(v, cap, sign) {
        let z = v[2], nx = v[3], ny = v[4], nz = v[5];
        if (cap) {
          const amount = height(v[0], v[1]);
          const epsilon = .003;
          const dx = (height(v[0] + epsilon, v[1]) - height(v[0] - epsilon, v[1])) / (2 * epsilon);
          const dy = (height(v[0], v[1] + epsilon) - height(v[0], v[1] - epsilon)) / (2 * epsilon);
          const length = Math.hypot(dx, dy, 1);
          z += sign * amount;
          nx = -dx / length; ny = -dy / length; nz = sign / length;
          raisedVertices++;
          maximumRelief = Math.max(maximumRelief, amount);
        }
        position.push(v[0], v[1], z);
        normal.push(nx, ny, nz);
        uv.push(v[6], v[7]);
      }
      function midpoint(a, b) { return a.map((value, i) => (value + b[i]) * .5); }
      function split(a, b, c, depth, sign) {
        const ab = (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
        const bc = (b[0] - c[0]) ** 2 + (b[1] - c[1]) ** 2;
        const ca = (c[0] - a[0]) ** 2 + (c[1] - a[1]) ** 2;
        if (depth < 13 && Math.max(ab, bc, ca) > .075 ** 2) {
          if (ab >= bc && ab >= ca) { const m = midpoint(a, b); split(a, m, c, depth + 1, sign); split(m, b, c, depth + 1, sign); }
          else if (bc >= ca) { const m = midpoint(b, c); split(a, b, m, depth + 1, sign); split(a, m, c, depth + 1, sign); }
          else { const m = midpoint(c, a); split(a, b, m, depth + 1, sign); split(m, b, c, depth + 1, sign); }
        } else { append(a, true, sign); append(b, true, sign); append(c, true, sign); }
      }
      function vertex(i) {
        return [sourcePosition.getX(i), sourcePosition.getY(i), sourcePosition.getZ(i),
          sourceNormal.getX(i), sourceNormal.getY(i), sourceNormal.getZ(i), sourceUv.getX(i), sourceUv.getY(i)];
      }
      for (const group of geometry.groups) {
        const start = position.length / 3;
        for (let i = group.start; i < group.start + group.count; i += 3) {
          const a = vertex(i), b = vertex(i + 1), c = vertex(i + 2);
          const cap = group.materialIndex === 0 && Math.abs(a[5]) > .99 && Math.abs(b[5]) > .99 && Math.abs(c[5]) > .99;
          if (cap) split(a, b, c, 0, Math.sign(a[5]));
          else { append(a, false, 0); append(b, false, 0); append(c, false, 0); }
        }
        output.addGroup(start, position.length / 3 - start, group.materialIndex);
      }
      output.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
      output.setAttribute('normal', new THREE.Float32BufferAttribute(normal, 3));
      output.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      output.computeBoundingBox(); output.computeBoundingSphere();
      output.userData.relief = { raisedVertices, maximumRelief, triangles: position.length / 9 };
      geometry.dispose();
      return output;
    }

    // One continuous solid: cap, rounded rim and side share a boundary.
    // Separate overlapping shells previously cut through each other on curves.
    stage.dataset.loadDetail = 'geometry';
    const cachedGeometry = await bakedGeometry;
    stage.dataset.geometryCache = cachedGeometry ? 'hit' : 'miss';
    for (const shape of cachedGeometry ? [null] : createReferenceShapes(THREE)) {
      let geometry;
      if (cachedGeometry) {
        geometry = new THREE.BufferGeometry();
        for (const [name, attribute] of Object.entries(cachedGeometry.attributes)) geometry.setAttribute(name, new THREE.BufferAttribute(attribute.array, attribute.itemSize));
        for (const group of cachedGeometry.groups) geometry.addGroup(group.start, group.count, group.materialIndex);
        geometry.userData = cachedGeometry.userData;
        geometry.computeBoundingBox(); geometry.computeBoundingSphere();
      } else {
        geometry = raisedCapGeometry(capCoordinates(shaveCutNormals(new THREE.ExtrudeGeometry(shape, {
          depth: .44, bevelEnabled: true, bevelThickness: .012,
          bevelSize: .008, bevelSegments: 6, steps: 1, curveSegments: 40
        }))), shape);
        saveGeometry(geometry).then(saved => {stage.dataset.geometryCacheSaved = String(saved);});
      }
      const monogram = new THREE.Mesh(geometry, [metal, champagne]);
      monogram.castShadow = monogram.receiveShadow = true;
      body.add(monogram);
    }

    const reliefStats = body.children.filter(object => object.geometry?.userData.relief).map(object => object.geometry.userData.relief);
    stage.dataset.reliefVertices = String(reliefStats.reduce((total, item) => total + item.raisedVertices, 0));
    stage.dataset.reliefMax = Math.max(...reliefStats.map(item => item.maximumRelief)).toFixed(4);

    // The off-axis sweep and alternating broad/edge-on folds must read on white.
    const TAU = Math.PI * 2;
    const ribbonSegments = mobileScene ? 192 : 384;
    const crossSegments = mobileScene ? 12 : 24;
    function ribbonPoint(angle, across, depth, target = new THREE.Vector3()) {
      const c = Math.cos(angle), s = Math.sin(angle);
      const center = new THREE.Vector3(
        2.86 * c + .24 * Math.sin(2 * angle + .4) + .14 * s,
        1.95 * s + .18 * Math.cos(2 * angle - .2) - .22 * c + .12,
        .24 - Math.sin(angle + .42) + .33 * Math.sin(2 * angle - .7)
      );
      const tangent = new THREE.Vector3(
        -2.86 * s + .48 * Math.cos(2 * angle + .4) + .14 * c,
        1.95 * c - .36 * Math.sin(2 * angle - .2) + .22 * s,
        -Math.cos(angle + .42) + .66 * Math.cos(2 * angle - .7)
      ).normalize();
      const radial = new THREE.Vector3(c, s, 0);
      radial.addScaledVector(tangent, -radial.dot(tangent)).normalize();
      const outward = new THREE.Vector3().crossVectors(radial, tangent).normalize();
      const twist = .22 + 1.12 * Math.sin(angle - .55) + .42 * Math.sin(2 * angle + .7);
      const widthAxis = radial.clone().multiplyScalar(Math.cos(twist))
        .addScaledVector(outward, Math.sin(twist));
      const depthAxis = outward.clone().multiplyScalar(Math.cos(twist))
        .addScaledVector(radial, -Math.sin(twist));
      const halfWidth = .105 + .13 * (.5 + .5 * Math.cos(angle + 2.1));
      return target.copy(center)
        .addScaledVector(widthAxis, across * halfWidth)
        .addScaledVector(depthAxis, depth * .019);
    }

    const positions = [];
    const indices = [];
    for (let i = 0; i <= ribbonSegments; i++) {
      const angle = i === ribbonSegments ? 0 : i / ribbonSegments * TAU;
      for (let j = 0; j <= crossSegments; j++) {
        const cross = j === crossSegments ? 0 : j / crossSegments * TAU;
        const c = Math.cos(cross), s = Math.sin(cross);
        // Rounded rectangular cross section gives clear, broad ribbon faces.
        const across = Math.sign(c) * Math.sqrt(Math.abs(c));
        const depth = Math.sign(s) * Math.sqrt(Math.abs(s));
        const point = ribbonPoint(angle, across, depth);
        positions.push(point.x, point.y, point.z);
        if (i < ribbonSegments && j < crossSegments) {
          const a = i * (crossSegments + 1) + j;
          const b = a + crossSegments + 1;
          indices.push(a, b, a + 1, b, b + 1, a + 1);
        }
      }
    }
    const ribbonGeometry = new THREE.BufferGeometry();
    ribbonGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    ribbonGeometry.setIndex(indices);
    ribbonGeometry.computeVertexNormals();

    // Average both periodic normal joins so neither closure leaves a visible seam.
    const normals = ribbonGeometry.getAttribute('normal');
    function joinNormals(a, b) {
      const value = new THREE.Vector3().fromBufferAttribute(normals, a)
        .add(new THREE.Vector3().fromBufferAttribute(normals, b)).normalize();
      normals.setXYZ(a, value.x, value.y, value.z);
      normals.setXYZ(b, value.x, value.y, value.z);
    }
    for (let i = 0; i <= ribbonSegments; i++) {
      joinNormals(i * (crossSegments + 1), i * (crossSegments + 1) + crossSegments);
    }
    for (let j = 0; j <= crossSegments; j++) {
      joinNormals(j, ribbonSegments * (crossSegments + 1) + j);
    }
    normals.needsUpdate = true;

    // Reflective transparency is intentionally used without a transmission pass.
    // This is a lightweight glass impression, with no claim of true refraction.
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0x8b887e,
      metalness: .38,
      roughness: .04,
      transmission: 0,
      transparent: true,
      opacity: .32,
      ior: 1.62,
      clearcoat: 1,
      clearcoatRoughness: .025,
      envMapIntensity: 2,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const ribbon = new THREE.Mesh(ribbonGeometry, glass);
    ribbon.renderOrder = 2;
    ribbonOrbit.add(ribbon);

    const outerLip = new THREE.MeshPhysicalMaterial({
      color: 0xc5b79c, metalness: 1, roughness: .13,
      transparent: true, opacity: .82, depthWrite: false,
      clearcoat: .8, envMapIntensity: 1.6
    });
    const innerLip = new THREE.MeshPhysicalMaterial({
      color: 0x64665d, metalness: .92, roughness: .19,
      transparent: true, opacity: .54, depthWrite: false,
      clearcoat: .8, envMapIntensity: 1.55
    });
    for (const side of [-1, 1]) {
      class RibbonEdge extends THREE.Curve {
        getPoint(t, target = new THREE.Vector3()) {
          return ribbonPoint(t === 1 ? 0 : t * TAU, side, 0, target);
        }
      }
      const lip = new THREE.Mesh(
        new THREE.TubeGeometry(new RibbonEdge(), ribbonSegments, side === 1 ? .011 : .009, 16, true),
        side === 1 ? outerLip : innerLip
      );
      lip.renderOrder = 3;
      ribbonOrbit.add(lip);
    }

    scene.add(new THREE.HemisphereLight(0xffffff, 0xb8b2a3, 1.7));
    const key = new THREE.DirectionalLight(0xfff8ef, 4);
    key.position.set(-3, 6, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(mobileScene ? 512 : 1024, mobileScene ? 512 : 1024);
    Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5 });
    key.shadow.normalBias = .02;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffc99b, 1.75);
    rim.position.set(4, 2, -3);
    scene.add(rim);
    const steelFill = new THREE.DirectionalLight(0xe5eee9, .65);
    steelFill.position.set(-4, -.5, 4);
    scene.add(steelFill);
    // Neutral, broad illumination keeps colored pinpoints off the charcoal face.

    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const context = shadowCanvas.getContext('2d');
    const gradient = context.createRadialGradient(128, 128, 2, 128, 128, 120);
    gradient.addColorStop(0, 'rgba(31,28,23,.25)');
    gradient.addColorStop(.4, 'rgba(31,28,23,.10)');
    gradient.addColorStop(1, 'rgba(31,28,23,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(5.7, .58),
      new THREE.MeshBasicMaterial({
        map: shadowTexture, transparent: true, depthWrite: false, opacity: .6
      })
    );
    shadow.position.set(.1, -2.18, -.8);
    scene.add(shadow);

    const MIN_ZOOM = .78;
    const MAX_ZOOM = 2.1;
    const modes = {
      signature: { x: -.035, y: -.12, z: -.035, scale: 1, camera: 11.7 },
      close: { x: .025, y: .17, z: 0, scale: 1.1, camera: 10.6 }
    };
    let mode = 'signature';
    let orbitYaw = 0, orbitPitch = 0, manualZoom = 1;
    let px = 0, py = 0, entered = false, drag = null;
    let currentScale = 1, currentZ = modes.signature.camera;
    let visible = true, dirty = true, disposed = false, unavailable = false, transitionPaused = false;
    let raf = 0, pulse = 0, ringTime = 0, last = performance.now(), warmed = false;
    let stageAspect = 1;
    sculpture.rotation.set(modes.signature.x, modes.signature.y, modes.signature.z);
    stage.dataset.sceneMode = mode;
    stage.dataset.scene = 'loading';
    stage.dataset.material = 'matte-aged-obsidian';
    stage.dataset.geometryVersion = 'machined-bezier-4';
    stage.dataset.zoom = '1.00';
    stage.style.touchAction = 'pan-y pinch-zoom';
    canvas.addEventListener('focus', () => stage.classList.add('is-focused'));
    canvas.addEventListener('blur', () => stage.classList.remove('is-focused'));
    canvas.setAttribute('aria-keyshortcuts', 'ArrowLeft ArrowRight ArrowUp ArrowDown + - R Escape');

    function requestRender() {
      dirty = true;
      if (warmed && !raf && visible && !document.hidden && !disposed && !unavailable && !transitionPaused) {
        raf = requestAnimationFrame(frame);
      }
    }
    function updateMotionPreference(event) {
      reduced = event.matches;
      px = py = 0;
      if (pulse) { clearTimeout(pulse); pulse = 0; }
      last = performance.now();
      requestRender();
    }
    motionPreference.addEventListener('change', updateMotionPreference);
    function reportOrbit() {
      stage.dataset.rotation = String(Math.round(orbitYaw * 180 / Math.PI));
      stage.dataset.pitch = String(Math.round(orbitPitch * 180 / Math.PI));
    }
    function setZoom(value) {
      const next = THREE.MathUtils.clamp(value, MIN_ZOOM, MAX_ZOOM);
      if (Math.abs(next - manualZoom) < .00001) return false;
      manualZoom = next;
      stage.dataset.zoom = manualZoom.toFixed(2);
      canvas.classList.toggle('is-enlarged', manualZoom > 1.1);
      stage.classList.toggle('is-enlarged', manualZoom > 1.1);
      requestRender();
      return true;
    }
    function choose(next) {
      mode = next;
      orbitYaw = orbitPitch = px = py = 0;
      manualZoom = 1;
      stage.dataset.sceneMode = mode;
      stage.dataset.zoom = '1.00';
      canvas.classList.remove('is-enlarged');
      stage.classList.remove('is-enlarged');
      reportOrbit();
      requestRender();
    }
    function positionViewport() {
      const bounds = stage.getBoundingClientRect();
      const width = Math.max(1, bounds.width), height = Math.max(1, bounds.height);
      stageAspect = width / height;
      // The stage is the virtual original camera frame; the viewport can see
      // outside that frame without changing the object's apparent initial size.
      camera.setViewOffset(width, height, -bounds.left, -bounds.top,
        Math.max(1, innerWidth), Math.max(1, innerHeight));
      requestRender();
    }
    function resize() {
      renderer.setSize(Math.max(1, innerWidth), Math.max(1, innerHeight), false);
      positionViewport();
    }
    addEventListener('resize', resize, { passive: true });
    addEventListener('scroll', positionViewport, { passive: true });
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    reportOrbit();
    resize();

    // Stage input is direct; once enlarged, the parts that escape the stage
    // remain a wheel target too. Empty viewport regions keep native scrolling.
    function wheelZoom(event) {
      if (event.ctrlKey || event.metaKey || !event.deltaY) return false;
      const unit = event.deltaMode === 1 ? 16 :
        event.deltaMode === 2 ? Math.max(1, stage.clientHeight) : 1;
      const delta = THREE.MathUtils.clamp(event.deltaY * unit, -300, 300);
      if ((delta < 0 && manualZoom >= MAX_ZOOM - .00001) ||
          (delta > 0 && manualZoom <= MIN_ZOOM + .00001)) return false;
      const next = manualZoom * Math.exp(-delta * .0012);
      if (!setZoom(next)) return false;
      event.preventDefault();
      return true;
    }
    stage.addEventListener('wheel', wheelZoom, { passive: false });
    const pointerRay = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    function wheelOverEnlargement(event) {
      if (manualZoom <= 1.1 || !visible || document.hidden ||
          disposed || unavailable || stage.contains(event.target)) return;
      pointerNdc.set(event.clientX / Math.max(1, innerWidth) * 2 - 1,
        1 - event.clientY / Math.max(1, innerHeight) * 2);
      // setViewOffset is already encoded in the camera projection matrix.
      pointerRay.setFromCamera(pointerNdc, camera);
      if (!pointerRay.intersectObject(sculpture, true).length) return;
      wheelZoom(event);
    }
    document.addEventListener('wheel', wheelOverEnlargement, { capture: true, passive: false });

    stage.addEventListener('dblclick', event => {
      if (event.target.closest('a,button')) return;
      choose(mode === 'close' ? 'signature' : 'close');
    });
    canvas.addEventListener('keydown', event => {
      const keys = ['+', '=', '-', 'ArrowLeft', 'ArrowRight', 'ArrowUp',
        'ArrowDown', 'Escape', 'r', 'R'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      if (event.key === '+' || event.key === '=') setZoom(manualZoom * 1.1);
      else if (event.key === '-') setZoom(manualZoom / 1.1);
      else if (['Escape', 'r', 'R'].includes(event.key)) choose('signature');
      else {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          orbitYaw += event.key === 'ArrowLeft' ? -Math.PI / 12 : Math.PI / 12;
        } else {
          orbitPitch += event.key === 'ArrowUp' ? -Math.PI / 12 : Math.PI / 12;
        }
        reportOrbit();
        requestRender();
      }
    });

    function endDrag(event) {
      if (!drag || drag.id !== event.pointerId) return;
      drag = null;
      canvas.classList.remove('is-dragging');
      if (stage.hasPointerCapture(event.pointerId)) {
        stage.releasePointerCapture(event.pointerId);
      }
      px = py = 0;
      requestRender();
    }
    stage.addEventListener('pointerdown', event => {
      if (event.button !== 0 || !event.isPrimary || event.target.closest('a,button')) return;
      if (event.pointerType !== 'touch') {
        // Keep repeated mouse drags on the sculpture, not native text/image drag.
        event.preventDefault();
        canvas.focus({ preventScroll: true });
      }
      drag = {
        id: event.pointerId, x: event.clientX, y: event.clientY,
        type: event.pointerType, active: event.pointerType !== 'touch'
      };
      stage.setPointerCapture(event.pointerId);
      canvas.classList.add('is-dragging');
      px = py = 0;
      entered = true;
      requestRender();
    });
    stage.addEventListener('pointermove', event => {
      if (drag && drag.id === event.pointerId) {
        const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
        if (!drag.active) {
          if (Math.hypot(dx, dy) < 7) return;
          if (Math.abs(dy) > Math.abs(dx) * 1.15) {
            endDrag(event);
            return;
          }
          if (Math.abs(dx) < Math.abs(dy) * 1.1) return;
          drag.active = true;
        }
        orbitYaw += dx / Math.max(280, stage.clientWidth) * TAU;
        if (drag.type !== 'touch') {
          orbitPitch += dy / Math.max(280, stage.clientHeight) * TAU;
        }
        drag.x = event.clientX;
        drag.y = event.clientY;
        px = py = 0;
        reportOrbit();
        requestRender();
        return;
      }
      if (reduced || event.pointerType === 'touch') return;
      const bounds = stage.getBoundingClientRect();
      px = THREE.MathUtils.clamp((event.clientX - bounds.left) / bounds.width * 2 - 1, -1, 1);
      py = THREE.MathUtils.clamp((event.clientY - bounds.top) / bounds.height * 2 - 1, -1, 1);
      entered = true;
      requestRender();
    });
    stage.addEventListener('dragstart', event => {
      if (!event.target.closest('a,button')) event.preventDefault();
    });
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('lostpointercapture', event => {
      if (!drag || drag.id !== event.pointerId) return;
      drag = null;
      canvas.classList.remove('is-dragging');
      px = py = 0;
      requestRender();
    });
    stage.addEventListener('pointerleave', () => {
      if (drag) return;
      entered = false;
      px = py = 0;
      requestRender();
    });

    function wallTransition(event) {
      transitionPaused = Boolean(event.detail?.active);
      if (transitionPaused) {
        if (pulse) clearTimeout(pulse);
        pulse = 0;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else {
        last = performance.now();
        requestRender();
      }
    }
    document.addEventListener('hd:wall-transition', wallTransition);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      canvas.classList.toggle('is-visible', visible);
      if (!visible && pulse) { clearTimeout(pulse); pulse = 0; }
      if (!visible && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      last = performance.now();
      requestRender();
    });
    intersectionObserver.observe(stage);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && pulse) { clearTimeout(pulse); pulse = 0; }
      if (document.hidden && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      last = performance.now();
      requestRender();
    });

    function frame(now) {
      raf = 0;
      if (!visible || document.hidden || disposed || unavailable || transitionPaused) return;
      const elapsed = Math.min(.08, Math.max(.001, (now - last) / 1000));
      last = now;
      const ease = reduced ? 1 : 1 - Math.exp(-elapsed * 12);
      const view = modes[mode];
      const hover = !drag && entered && !reduced ? 1 : 0;
      const tx = view.x + orbitPitch - py * .08 * hover;
      const ty = view.y + orbitYaw + px * .1 * hover;
      const tz = view.z + px * .012 * hover;
      const targetScale = view.scale * manualZoom;
      // Fit the complete default silhouette and ribbon across narrow stage ratios.
      const fitDistance = 6.62 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * stageAspect);
      const targetZ = Math.max(view.camera, fitDistance);
      const delta = Math.abs(sculpture.rotation.x - tx) +
        Math.abs(sculpture.rotation.y - ty) + Math.abs(sculpture.rotation.z - tz) +
        Math.abs(currentScale - targetScale) + Math.abs(currentZ - targetZ);
      const moving = delta > .00035;
      if (moving) {
        sculpture.rotation.x += (tx - sculpture.rotation.x) * ease;
        sculpture.rotation.y += (ty - sculpture.rotation.y) * ease;
        sculpture.rotation.z += (tz - sculpture.rotation.z) * ease;
        currentScale += (targetScale - currentScale) * ease;
        currentZ += (targetZ - currentZ) * ease;
        dirty = true;
      } else if (dirty) {
        sculpture.rotation.set(tx, ty, tz);
        currentScale = targetScale;
        currentZ = targetZ;
      }
      if (!reduced) {
        ringTime += elapsed;
        ribbonOrbit.rotation.z = ringTime * .075;
        ribbonOrbit.rotation.y = Math.sin(ringTime * .12) * .16;
        ribbonOrbit.rotation.x = Math.sin(ringTime * .09) * .09;
        dirty = true;
      }
      if (dirty) {
        sculpture.scale.setScalar(currentScale);
        camera.position.set(.08, .12, currentZ);
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
        dirty = false;
        stage.classList.add('ready', 'live3d');
        stage.dataset.scene = 'ready';
        canvas.classList.add('is-ready', 'is-visible');
      }
      // A quiet 24fps orbit; interaction temporarily uses native frame rate.
      if (moving || drag) raf = requestAnimationFrame(frame);
      else if (!reduced && !pulse) pulse = setTimeout(() => {
        pulse = 0;
        if (visible && !document.hidden && !disposed && !unavailable && !transitionPaused) requestRender();
      }, 1000 / (mobileScene ? 18 : 24));
    }
    // Compile/upload while the complete poster stays visible. The first
    // exposed frame already uses its final camera, material and contour.
    const firstView = modes.signature;
    const firstFit = 6.62 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * stageAspect);
    currentScale = firstView.scale;
    currentZ = Math.max(firstView.camera, firstFit);
    sculpture.scale.setScalar(currentScale);
    sculpture.rotation.set(firstView.x, firstView.y, firstView.z);
    camera.position.set(.08, .12, currentZ);
    camera.lookAt(0, 0, 0);
    await Promise.all([normal, roughness, goldNormal].map(texture => Promise.resolve(texture.image.decode?.()).catch(() => {})));
    stage.dataset.loadDetail = 'lighting';
    if (renderer.compileAsync) await renderer.compileAsync(scene, camera);
    else renderer.compile(scene, camera);
    renderer.render(scene, camera);
    await new Promise(resolve => requestAnimationFrame(resolve));
    if (disposed || unavailable) return;
    renderer.render(scene, camera);
    warmed = true;
    last = performance.now();
    stage.dataset.materialWarm = 'true';
    requestRender();

    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      unavailable = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      canvas.classList.remove('is-ready');
      stage.classList.remove('ready');
      stage.classList.add('scene-failed');
      stage.dataset.scene = 'failed';
    });
    addEventListener('pageshow', () => {
      last = performance.now();
      requestRender();
    });
    addEventListener('pagehide', event => {
      if (pulse) clearTimeout(pulse);
      pulse = 0;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (event.persisted) return;
      disposed = true;
      document.removeEventListener('wheel', wheelOverEnlargement, { capture: true });
      document.removeEventListener('hd:wall-transition', wallTransition);
      motionPreference.removeEventListener('change', updateMotionPreference);
      removeEventListener('resize', resize);
      removeEventListener('scroll', positionViewport);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      const geometries = new Set(), materials = new Set();
      scene.traverse(object => {
        if (object.geometry) geometries.add(object.geometry);
        if (Array.isArray(object.material)) object.material.forEach(material => materials.add(material));
        else if (object.material) materials.add(object.material);
      });
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      for (const texture of [normal, roughness, goldNormal, capNormal, capRoughness, shadowTexture]) texture.dispose();
      key.shadow.dispose();
      environment.dispose();
      renderer.dispose();
    }, { once: true });
  } catch (error) {
    canvas.classList.remove('is-ready');
    stage.classList.add('scene-failed');
    stage.dataset.scene = 'failed';
    console.warn('HD sculpture:', error);
  }
}

start();


