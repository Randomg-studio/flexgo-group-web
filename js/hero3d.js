// La F del logo en 3D: la barra flotante se separa al bajar por la página.
const contenedor = document.getElementById('hero-escena');
const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;

const webglDisponible = () => {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

const iniciar = async () => {
  const [THREE, { SVGLoader }, svg] = await Promise.all([
    import('../assets/vendor/three.module.min.js'),
    import('./svgloader.js'),
    fetch('assets/logos/flexgo-simbolo.svg').then((r) => r.text()),
  ]);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    contenedor.append(renderer.domElement);

  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camara.position.z = 9;

  escena.add(new THREE.HemisphereLight(0xffffff, 0x1a3a70, 1.9));
  const clave = new THREE.DirectionalLight(0xffffff, 1.7);
  clave.position.set(1.5, 2.5, 8);
  escena.add(clave);
  const cian = new THREE.PointLight(0x3fc8f4, 34, 20);
  cian.position.set(-3.4, -1.6, 3.2);
  escena.add(cian);

  // El símbolo oficial recorta el logo completo: de su trazo solo se usan la F y la barra.
  const trazo = svg.match(/ d="([^"]+)"/)[1];
  const piezas = trazo.split(/(?=M )/).map((d) => {
    const n = d.match(/-?\d+\.?\d*/g).map(Number);
    const xs = n.filter((_, i) => i % 2 === 0);
    return { d, ancho: Math.max(...xs) - Math.min(...xs), maxX: Math.max(...xs) };
  }).filter((p) => p.maxX <= 153);
  const aForma = (d) => {
    const { paths } = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`);
    return SVGLoader.createShapes(paths[0])[0];
  };
  const [piezaF, piezaBarra] = piezas.sort((a, b) => b.ancho - a.ancho);
  if (!piezaF || !piezaBarra) throw new Error('No se encontró la F');
  const cuerpo = { forma: aForma(piezaF.d) };
  const barra = { forma: aForma(piezaBarra.d) };

  const grupo = new THREE.Group();
  const extrude = { depth: 26, bevelEnabled: true, bevelThickness: 3.5, bevelSize: 2.6, bevelSegments: 3, curveSegments: 10 };

  const crear = (forma, material) => {
    const geo = new THREE.ExtrudeGeometry(forma, extrude);
    geo.translate(-76.5, -97, -13);
    const malla = new THREE.Mesh(geo, material);
    malla.scale.set(0.0165, -0.0165, 0.0165);
    grupo.add(malla);
    return malla;
  };

  crear(
    cuerpo.forma,
    new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.08, roughness: 0.38 })
  );
  const mallaBarra = crear(
    barra.forma,
    new THREE.MeshStandardMaterial({ color: 0x3fc8f4, emissive: 0x3fc8f4, emissiveIntensity: 0.46, metalness: 0, roughness: 0.42 })
  );
  escena.add(grupo);

  // Retícula de puntos: el patrón modular del manual, en profundidad.
  const puntos = [];
  for (let x = -7; x <= 7; x += 1) for (let y = -4; y <= 4; y += 1) puntos.push(x * 0.9, y * 0.9, -3.2);
  const geoPuntos = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(puntos, 3));
  const reticula = new THREE.Points(geoPuntos, new THREE.PointsMaterial({ color: 0x3fc8f4, size: 0.026, transparent: true, opacity: 0.42 }));
  escena.add(reticula);

  let ancho = 0;
  let alto = 0;
  let baseX = 0;
  let baseY = 0;
  let escala = 1;
  const medir = () => {
    ancho = contenedor.clientWidth;
    alto = contenedor.clientHeight;
    renderer.setSize(ancho, alto, false);
    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();
    const movil = ancho < 860;
    baseX = movil ? 0 : 2.28 * Math.min(1.3, camara.aspect / 1.5);
    baseY = movil ? 1.42 : 0.42;
    escala = movil ? 0.34 : Math.min(0.82, 0.58 + camara.aspect * 0.12);
  };

  let mx = 0;
  let my = 0;
  let suaveX = 0;
  let suaveY = 0;
  addEventListener(
    'pointermove',
    (e) => {
      mx = e.clientX / innerWidth - 0.5;
      my = e.clientY / innerHeight - 0.5;
    },
    { passive: true }
  );

  const dibujar = (t) => {
    const avance = Math.min(1, scrollY / Math.max(1, alto));
    suaveX += (mx - suaveX) * 0.05;
    suaveY += (my - suaveY) * 0.05;
    const flota = sinMovimiento ? 0 : Math.sin(t * 0.0009) * 0.05;

    grupo.position.set(baseX, baseY + flota + avance * 0.6, 0);
    grupo.scale.setScalar(escala * (1 - avance * 0.12));
    grupo.rotation.y = -0.34 + suaveX * 0.5 + avance * 1.1;
    grupo.rotation.x = 0.1 + suaveY * 0.32 - avance * 0.25;
    mallaBarra.position.set(avance * 1.7, Math.sin(t * 0.0012) * (sinMovimiento ? 0 : 0.02), avance * 1.4 + 0.1);
    reticula.position.x = -suaveX * 0.3;
    reticula.position.y = suaveY * 0.2 + avance * 0.5;
    renderer.render(escena, camara);
  };

  medir();
  addEventListener('resize', medir, { passive: true });
  dibujar(0);
  contenedor.classList.add('lista');

  if (sinMovimiento) {
    addEventListener('resize', () => dibujar(0), { passive: true });
    addEventListener('scroll', () => dibujar(0), { passive: true });
    return;
  }

  let visible = true;
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
  }).observe(contenedor);
  // En equipos lentos baja la resolución y, si no alcanza, deja la F quieta y solo responde al scroll.
  let anterior = 0;
  let lentos = 0;
  let quieta = false;
  const bucle = (t) => {
    if (quieta) return;
    requestAnimationFrame(bucle);
    if (!visible || document.hidden) {
      anterior = 0;
      return;
    }
    if (anterior && t - anterior > 45) lentos += 1;
    anterior = t;
    if (lentos === 3) {
      renderer.setPixelRatio(1);
      medir();
    }
    if (lentos === 10) {
      quieta = true;
      addEventListener('scroll', () => dibujar(t), { passive: true });
    }
    dibujar(t);
  };
  requestAnimationFrame(bucle);
};

const arrancar = () => iniciar().catch((e) => console.warn('Escena 3D no disponible:', e.message));
if (webglDisponible()) {
  // Primero el texto: la escena entra cuando la página ya se ve.
  setTimeout(arrancar, 700);
}
