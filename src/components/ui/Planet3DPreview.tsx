import React, { useEffect, useRef } from 'react';
import { CelestialBodyData } from '../../types/astronomy';

interface Planet3DPreviewProps {
  body: CelestialBodyData;
  size?: number;
  className?: string;
}

export const Planet3DPreview: React.FC<Planet3DPreviewProps> = ({
  body,
  size = 180,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const rotationAngleRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isMounted = true;

    const render = () => {
      if (!isMounted) return;
      rotationAngleRef.current += 0.015;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const r = size * 0.36;

      // Draw Rings if present (back half)
      if (body.hasRings && body.ringOuterRadius) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1, body.id === 'uranus' ? 1.4 : 0.42);
        const ringGrad = ctx.createRadialGradient(0, 0, r * 1.2, 0, 0, r * 2.2);
        ringGrad.addColorStop(0, 'rgba(217, 119, 6, 0.1)');
        ringGrad.addColorStop(0.3, 'rgba(253, 224, 71, 0.7)');
        ringGrad.addColorStop(0.55, 'rgba(180, 83, 9, 0.05)'); // Cassini gap
        ringGrad.addColorStop(0.75, 'rgba(254, 240, 138, 0.65)');
        ringGrad.addColorStop(1, 'rgba(217, 119, 6, 0.0)');
        ctx.fillStyle = ringGrad;
        ctx.beginPath();
        ctx.arc(0, 0, r * 2.2, Math.PI, 0, false);
        ctx.arc(0, 0, r * 1.2, 0, Math.PI, true);
        ctx.fill();
        ctx.restore();
      }

      // Draw Planet Sphere with clip
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      // Base Planet Color
      ctx.fillStyle = body.color;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      // Rotating Surface Patterns
      const rot = (rotationAngleRef.current * 20) % (r * 2);

      if (body.id === 'earth') {
        // Deep blue ocean
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

        // Rotating Continents
        ctx.fillStyle = '#16a34a';
        for (let offset = -r * 2; offset <= r * 2; offset += r * 1.5) {
          const landX = cx + offset + rot;
          ctx.beginPath();
          ctx.arc(landX - r * 0.2, cy - r * 0.1, r * 0.45, 0, Math.PI * 2);
          ctx.arc(landX + r * 0.3, cy + r * 0.25, r * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }

        // White cloud swirls
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        for (let offset = -r * 2; offset <= r * 2; offset += r * 1.8) {
          const cloudX = cx + offset + rot * 1.2;
          ctx.beginPath();
          ctx.ellipse(cloudX, cy - r * 0.3, r * 0.6, r * 0.12, 0.1, 0, Math.PI * 2);
          ctx.ellipse(cloudX - r * 0.2, cy + r * 0.4, r * 0.5, r * 0.1, -0.1, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (body.id === 'jupiter') {
        // Atmospheric Bands
        const bands = [
          { y: -0.7, h: 0.25, c: '#78350f' },
          { y: -0.4, h: 0.2, c: '#fed7aa' },
          { y: -0.15, h: 0.3, c: '#9a3412' },
          { y: 0.2, h: 0.25, c: '#ffedd5' },
          { y: 0.5, h: 0.25, c: '#7c2d12' },
        ];
        for (const band of bands) {
          ctx.fillStyle = band.c;
          ctx.fillRect(cx - r, cy + band.y * r, r * 2, band.h * r);
        }

        // Great Red Spot drifting
        const grsX = cx + (Math.sin(rotationAngleRef.current) * r * 0.5);
        ctx.fillStyle = '#b91c1c';
        ctx.beginPath();
        ctx.ellipse(grsX, cy + r * 0.25, r * 0.28, r * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (body.id === 'mars') {
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
        // Polar ice cap
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(cx, cy - r * 0.85, r * 0.25, 0, Math.PI * 2);
        ctx.fill();
      } else if (body.id === 'sun') {
        // Multi-layer solar corona
        const sunGrad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, r * 0.1, cx, cy, r);
        sunGrad.addColorStop(0, '#fffbeb');
        sunGrad.addColorStop(0.3, '#fef08a');
        sunGrad.addColorStop(0.7, '#f59e0b');
        sunGrad.addColorStop(1, '#d97706');
        ctx.fillStyle = sunGrad;
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }

      // 3D Spherical Light Gradient (Sunlight coming from top-left)
      if (body.id !== 'sun') {
        const sphereLight = ctx.createRadialGradient(
          cx - r * 0.35, cy - r * 0.35, r * 0.05,
          cx, cy, r
        );
        sphereLight.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
        sphereLight.addColorStop(0.5, 'rgba(0, 0, 0, 0.0)');
        sphereLight.addColorStop(0.85, 'rgba(3, 7, 18, 0.65)');
        sphereLight.addColorStop(1, 'rgba(3, 7, 18, 0.95)');

        ctx.fillStyle = sphereLight;
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }

      ctx.restore();

      // Atmospheric Rim Glow
      if (body.atmosphere.hasAtmosphere && body.id !== 'sun') {
        ctx.strokeStyle = body.accentColor;
        ctx.lineWidth = r * 0.08;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(cx, cy, r + ctx.lineWidth * 0.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }

      // Draw Rings front half
      if (body.hasRings && body.ringOuterRadius) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1, body.id === 'uranus' ? 1.4 : 0.42);
        const ringGrad = ctx.createRadialGradient(0, 0, r * 1.2, 0, 0, r * 2.2);
        ringGrad.addColorStop(0, 'rgba(217, 119, 6, 0.1)');
        ringGrad.addColorStop(0.3, 'rgba(253, 224, 71, 0.7)');
        ringGrad.addColorStop(0.55, 'rgba(180, 83, 9, 0.05)');
        ringGrad.addColorStop(0.75, 'rgba(254, 240, 138, 0.65)');
        ringGrad.addColorStop(1, 'rgba(217, 119, 6, 0.0)');
        ctx.fillStyle = ringGrad;
        ctx.beginPath();
        ctx.arc(0, 0, r * 2.2, 0, Math.PI, false);
        ctx.arc(0, 0, r * 1.2, Math.PI, 0, true);
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isMounted = false;
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [body, size]);

  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-label={`${body.name} rotating preview`}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="pointer-events-none"
      />
    </div>
  );
};
