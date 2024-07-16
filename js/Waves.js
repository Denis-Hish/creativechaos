export default function FooterWaves() {
  const mountPoint = document.getElementById('waves');
  waves({
    fills: [
      'rgba(255, 0, 0, 0.5)',
      'rgba(255, 127, 0, 0.5)',
      'rgba(255, 255, 0, 0.5)',
      'rgba(0, 255, 0, 0.5)',
      'rgba(0, 255, 255, 0.5)',
      'rgba(255, 0, 255, 0.3)',
      'rgba(0, 255, 255, 0.5)',
      'rgba(255, 255, 255, 0.7)',
    ],
    flowRate: 2,
    swayRate: 3,
    wavelength: 16,
    offset: 0.12,
    randomHeight: 0.5,
    offset: 0.2,
    swayVelocity: 0.5,
    complexity: 6,
    curviness: 0.8,
    randomOffset: 0.06,
    randomSwayRate: 0.4,
    randomWavelength: 0.05,
  }).mount(mountPoint);
}
