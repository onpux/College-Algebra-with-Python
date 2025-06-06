// --- Calculadora de Funciones Cuadráticas ---
function solveQuadratic() {
  const a = parseFloat(document.getElementById('a').value);
  const b = parseFloat(document.getElementById('b').value);
  const c = parseFloat(document.getElementById('c').value);
  let result = '';
  if (isNaN(a) || isNaN(b) || isNaN(c)) {
    result = 'Por favor, ingresa todos los coeficientes.';
    document.getElementById('quad-result').textContent = result;
    return;
  }
  const disc = b*b - 4*a*c;
  let x1, x2;
  if (disc > 0) {
    x1 = (-b + Math.sqrt(disc)) / (2*a);
    x2 = (-b - Math.sqrt(disc)) / (2*a);
    result = `Raíces reales: x₁ = ${x1.toFixed(3)}, x₂ = ${x2.toFixed(3)}`;
  } else if (disc === 0) {
    x1 = -b / (2*a);
    result = `Raíz doble: x = ${x1.toFixed(3)}`;
  } else {
    result = 'No hay raíces reales.';
  }
  document.getElementById('quad-result').textContent = result;
  plotQuadratic(a, b, c);
}

function plotQuadratic(a, b, c) {
  const ctx = document.getElementById('quad-plot').getContext('2d');
  if (window.quadChart) window.quadChart.destroy();
  const xs = [], ys = [];
  for (let x = -10; x <= 10; x += 0.2) {
    xs.push(x);
    ys.push(a*x*x + b*x + c);
  }
  window.quadChart = new Chart(ctx, {
    type: 'line',
    data: { labels: xs, datasets: [{ label: 'f(x)', data: ys, borderColor: '#7ecbff', fill: false }] },
    options: {
      responsive: true,
      plugins: { legend: { display: false }, title: { display: true, text: 'Gráfica de la función cuadrática' } },
      scales: { x: { title: { display: true, text: 'x' } }, y: { title: { display: true, text: 'f(x)' } } }
    }
  });
}

// --- Simulador de Sistemas de Ecuaciones Lineales (2x2) ---
function solveLinearSystem() {
  const a1 = parseFloat(document.getElementById('l-a1').value);
  const b1 = parseFloat(document.getElementById('l-b1').value);
  const c1 = parseFloat(document.getElementById('l-c1').value);
  const a2 = parseFloat(document.getElementById('l-a2').value);
  const b2 = parseFloat(document.getElementById('l-b2').value);
  const c2 = parseFloat(document.getElementById('l-c2').value);
  if ([a1,b1,c1,a2,b2,c2].some(isNaN)) {
    document.getElementById('linear-result').textContent = 'Completa todos los coeficientes.';
    return;
  }
  const det = a1*b2 - a2*b1;
  if (det === 0) {
    document.getElementById('linear-result').textContent = 'El sistema no tiene solución única.';
    return;
  }
  const x = (c1*b2 - c2*b1) / det;
  const y = (a1*c2 - a2*c1) / det;
  document.getElementById('linear-result').textContent = `Solución: x = ${x.toFixed(3)}, y = ${y.toFixed(3)}`;
}

// --- Resolución Paso a Paso de Ecuaciones (ax + b = c) ---
function solveStepByStep() {
  const eq = document.getElementById('step-eq').value.replace(/\s+/g, '');
  // Only supports equations of the form ax+b=c
  const match = eq.match(/^([+-]?\d*)x([+-]\d+)?=(.+)$/);
  if (!match) {
    document.getElementById('step-result').textContent = 'Unsupported format. Example: 2x+3=7';
    return;
  }
  let a = match[1] === '' || match[1] === '+' ? 1 : match[1] === '-' ? -1 : parseFloat(match[1]);
  let b = match[2] ? parseFloat(match[2]) : 0;
  let c = parseFloat(match[3]);
  let steps = `Equation: ${a}x + ${b} = ${c}\n`;
  steps += `Step 1: Subtract ${b} from both sides → ${a}x = ${c-b}\n`;
  steps += `Step 2: Divide both sides by ${a} → x = ${(c-b)/a}`;
  document.getElementById('step-result').textContent = steps;
}

// Animated moving moon background
(function() {
  const canvas = document.getElementById('moon-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize);

  let t = 0;
  function moonPath(t) {
    // t: 0 to 1, full cycle
    // Move in a gentle arc from left to right and back
    const margin = 80;
    const cx = width / 2;
    const cy = height / 3;
    const rx = (width / 2) - margin;
    const ry = (height / 3) - margin;
    // Angle: 0 to PI (left to right), then PI to 0 (right to left)
    const angle = Math.PI * (1 - Math.abs(2 * t - 1));
    const x = cx + rx * Math.cos(angle - Math.PI);
    const y = cy + ry * Math.sin(angle - Math.PI);
    return [x, y];
  }

  function drawMoon(x, y) {
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    // Moon glow
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 48);
    gradient.addColorStop(0, '#fffbe7');
    gradient.addColorStop(0.5, '#e0e0e0');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.arc(x, y, 48, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    // Moon core
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, 2 * Math.PI);
    ctx.fillStyle = '#f7f7f7';
    ctx.shadowColor = '#fffbe7';
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.restore();
  }

  function animateMoon() {
    t += 0.0007;
    if (t > 1) t = 0;
    const [x, y] = moonPath(t);
    drawMoon(x, y);
    requestAnimationFrame(animateMoon);
  }
  animateMoon();
})();
