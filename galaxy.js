const canvas = document.querySelector('#galaxy');
const context = canvas.getContext('2d');

if (context) {
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const colors = ['#fff2ff', '#eab4ff', '#ae8cff', '#9dc7ff', '#ff9ccf'];
  const fullTurn = 2 * Math.PI;
  const stars = Array.from({ length: 1000 }, (_, index) => {
    const radius = .42 * Math.sqrt(Math.random()) + .035;
    return {
      radius,
      angle: (index % 3) * fullTurn / 3 + radius * 12
        + (Math.random() - Math.random()) * (.32 + radius * 1.2),
      size: .45 + Math.random() ** 4 * 2,
      alpha: .16 + Math.random() * .72,
      phase: Math.random() * fullTurn,
      color: colors[index % colors.length],
    };
  });
  const distantStars = Array.from({ length: 85 }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: .4 + Math.random(),
    alpha: .15 + Math.random() * .6,
  }));

  let elapsed = 0;
  let previousTime = null;
  let frame = null;

  function draw() {
    const size = canvas.clientWidth;
    if (!size) return;

    const resolution = Math.round(size * Math.min(devicePixelRatio || 1, 2));
    if (canvas.width !== resolution || canvas.height !== resolution) {
      canvas.width = resolution;
      canvas.height = resolution;
    }
    const scale = resolution / size;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.clearRect(0, 0, size, size);

    context.fillStyle = '#e7d5ff';
    for (const star of distantStars) {
      context.globalAlpha = star.alpha;
      context.fillRect(star.x * size, star.y * size, star.size, star.size);
    }

    context.save();
    context.translate(size / 2, size / 2);
    context.rotate(-.37);
    for (const star of stars) {
      const angle = star.angle + elapsed * .21;
      const x = Math.cos(angle) * star.radius * size;
      const y = Math.sin(angle) * star.radius * size * .69;
      const twinkle = .8 + .2 * Math.sin(elapsed * 2 + star.phase);
      context.fillStyle = star.color;
      context.globalAlpha = star.alpha * twinkle;
      context.fillRect(x, y, star.size, star.size);
    }
    context.restore();
    context.globalAlpha = 1;
  }

  function animate(time) {
    if (previousTime !== null) elapsed += Math.min(time - previousTime, 50) / 1000;
    previousTime = time;
    draw();
    frame = requestAnimationFrame(animate);
  }

  function updateMotion() {
    if (motionPreference.matches || document.hidden) {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      previousTime = null;
      draw();
    } else if (frame === null) {
      frame = requestAnimationFrame(animate);
    }
  }

  motionPreference.addEventListener('change', updateMotion);
  document.addEventListener('visibilitychange', updateMotion);
  new ResizeObserver(draw).observe(canvas);
  updateMotion();
}

const cubeScene = document.querySelector('.cube-scene');

if (cubeScene && 'IntersectionObserver' in window) {
  const cubeObserver = new IntersectionObserver(([entry]) => {
    cubeScene.classList.toggle('in-view', entry.intersectionRatio >= .5);
  }, { threshold: .5 });
  cubeObserver.observe(cubeScene);
}
