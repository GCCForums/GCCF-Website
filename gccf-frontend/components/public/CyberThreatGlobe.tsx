"use client";

import React, { useEffect, useRef, useState } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface CountryNode {
  name: string;
  country: string;
  code: string;
  lat: number;
  lng: number;
  unit: Point3D;
  isTarget?: boolean;
}

interface AttackArc {
  id: string;
  source: CountryNode;
  target: CountryNode;
  progress: number;
  speed: number;
  color: string;
  altitude: number;
}

interface ImpactPulse {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  opacity: number;
}

// Convert spherical (lat, lng) to unit sphere (radius = 1) ONCE at module load
const latLngToUnit3D = (lat: number, lng: number): Point3D => {
  const phi = (lat * Math.PI) / 180;
  const lambda = (lng * Math.PI) / 180;
  return {
    x: Math.cos(phi) * Math.sin(lambda),
    y: Math.sin(phi),
    z: Math.cos(phi) * Math.cos(lambda),
  };
};

// Major global cybersecurity & threat hubs
const RAW_COUNTRIES = [
  { name: "Kathmandu", country: "Nepal", code: "NP", lat: 28.39, lng: 84.12 },
  { name: "Washington", country: "United States", code: "US", lat: 38.9, lng: -77.0 },
  { name: "Frankfurt", country: "Germany", code: "DE", lat: 50.1, lng: 8.68 },
  { name: "Beijing", country: "China", code: "CN", lat: 39.9, lng: 116.4 },
  { name: "London", country: "United Kingdom", code: "UK", lat: 51.5, lng: -0.12 },
  { name: "Tokyo", country: "Japan", code: "JP", lat: 35.68, lng: 139.75 },
  { name: "Paris", country: "France", code: "FR", lat: 48.85, lng: 2.35 },
  { name: "Singapore", country: "Singapore", code: "SG", lat: 1.35, lng: 103.82 },
  { name: "Sydney", country: "Australia", code: "AU", lat: -33.87, lng: 151.2 },
  { name: "Brasilia", country: "Brazil", code: "BR", lat: -15.8, lng: -47.9 },
  { name: "Delhi", country: "India", code: "IN", lat: 28.6, lng: 77.2 },
  { name: "Seoul", country: "South Korea", code: "KR", lat: 37.56, lng: 126.97 },
  { name: "Dubai", country: "UAE", code: "AE", lat: 25.2, lng: 55.27 },
  { name: "Johannesburg", country: "South Africa", code: "ZA", lat: -26.2, lng: 28.0 },
  { name: "Toronto", country: "Canada", code: "CA", lat: 43.65, lng: -79.38 },
  { name: "Istanbul", country: "Turkey", code: "TR", lat: 41.0, lng: 28.98 },
];

const GLOBAL_COUNTRIES: CountryNode[] = RAW_COUNTRIES.map((c) => ({
  ...c,
  unit: latLngToUnit3D(c.lat, c.lng),
}));

// Asynchronously loaded unit coordinates to keep initial JS bundle ultra-light
let _borders: Point3D[][] = [];
let _dots: Point3D[] = [];
let _dataLoaded = false;

const loadGlobeGeoData = async () => {
  if (_dataLoaded) return;
  try {
    const [bordersMod, dotsMod] = await Promise.all([
      import("./worldBorders.json"),
      import("./landDots.json"),
    ]);
    _borders = (bordersMod.default as [number, number][][]).map((polygon) =>
      polygon.map(([lat, lng]) => latLngToUnit3D(lat, lng))
    );
    _dots = (dotsMod.default as [number, number][]).map(([lat, lng]) =>
      latLngToUnit3D(lat, lng)
    );
    _dataLoaded = true;
  } catch (err) {
    console.error("Failed to load globe geometry data", err);
  }
};

const getBorders = (): Point3D[][] => _borders;
const getDots = (): Point3D[] => _dots;

let _latRings: Point3D[][] | null = null;
const getLatRings = (): Point3D[][] => {
  if (!_latRings) {
    _latRings = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      const ring: Point3D[] = [];
      for (let lng = -180; lng <= 180; lng += 8) {
        ring.push(latLngToUnit3D(lat, lng));
      }
      _latRings.push(ring);
    }
  }
  return _latRings;
};

let _lngLines: Point3D[][] | null = null;
const getLngLines = (): Point3D[][] => {
  if (!_lngLines) {
    _lngLines = [];
    for (let lng = -180; lng < 180; lng += 45) {
      const line: Point3D[] = [];
      for (let lat = -80; lat <= 80; lat += 8) {
        line.push(latLngToUnit3D(lat, lng));
      }
      _lngLines.push(line);
    }
  }
  return _lngLines;
};

export default function CyberThreatGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isVisibleRef = useRef(true);

  // 3D rotation angles
  const rotationRef = useRef({ yaw: -1.45, pitch: 0.22 });
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const activeArcsRef = useRef<AttackArc[]>([]);
  const impactPulsesRef = useRef<ImpactPulse[]>([]);
  const lastSpawnTimeRef = useRef(0);
  const lastTickerTimeRef = useRef(0);

  // Live attacks list for the ticker bar
  const [liveAttacks, setLiveAttacks] = useState<
    { id: string; from: string; to: string; color: string }[]
  >([
    { id: "1", from: "US", to: "DE", color: "#ef4444" },
    { id: "2", from: "CN", to: "JP", color: "#f43f5e" },
    { id: "3", from: "UK", to: "SG", color: "#fb7185" },
    { id: "4", from: "DE", to: "NP", color: "#f59e0b" },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let lastRenderTimestamp = 0;

    // Pause rendering when scrolled out of view to save 100% CPU
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          isVisibleRef.current = entries[0].isIntersecting;
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Spawn live attack
    const spawnAttack = (timestamp: number) => {
      if (timestamp - lastSpawnTimeRef.current > 1600 && activeArcsRef.current.length < 5) {
        lastSpawnTimeRef.current = timestamp;

        const sourceIndex = Math.floor(Math.random() * GLOBAL_COUNTRIES.length);
        let targetIndex = Math.floor(Math.random() * (GLOBAL_COUNTRIES.length - 1));
        if (targetIndex >= sourceIndex) targetIndex++;

        const source = GLOBAL_COUNTRIES[sourceIndex];
        const target = GLOBAL_COUNTRIES[targetIndex];
        const colors = ["#f87171", "#fb7185", "#f43f5e", "#ef4444", "#f59e0b"];
        const arcColor = colors[Math.floor(Math.random() * colors.length)];

        const newArc: AttackArc = {
          id: Math.random().toString(36).substring(7),
          source,
          target,
          progress: 0,
          speed: 0.009 + Math.random() * 0.005,
          color: arcColor,
          altitude: 0.22 + Math.random() * 0.16,
        };

        activeArcsRef.current.push(newArc);

        // Throttle ticker state updates to every 3.5 seconds to prevent re-renders
        if (timestamp - lastTickerTimeRef.current > 3200) {
          lastTickerTimeRef.current = timestamp;
          setLiveAttacks((prev) => [
            { id: newArc.id, from: source.code, to: target.code, color: arcColor },
            ...prev.slice(0, 3),
          ]);
        }
      }
    };

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);

      // Skip rendering if not visible or if throttling (target ~38fps for high performance)
      if (!isVisibleRef.current) return;
      if (time - lastRenderTimestamp < 26) return;
      lastRenderTimestamp = time;

      if (!canvas || !containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      if (width === 0 || height === 0) return;

      const globeRadius = Math.min(width, height) * 0.38;
      const centerX = width / 2;
      const centerY = height / 2;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Auto rotation (West to East)
      if (!isDraggingRef.current) {
        rotationRef.current.yaw += 0.0024;
      }

      const { yaw, pitch } = rotationRef.current;

      // Calculate 3D rotation matrix once per frame
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);

      // 1. Atmosphere Glow Halo
      const haloGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        globeRadius * 0.8,
        centerX,
        centerY,
        globeRadius * 1.3
      );
      haloGradient.addColorStop(0, "rgba(61, 115, 189, 0.22)");
      haloGradient.addColorStop(0.5, "rgba(61, 115, 189, 0.08)");
      haloGradient.addColorStop(1, "transparent");

      ctx.fillStyle = haloGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // 2. Base Dark Globe Sphere
      const sphereGradient = ctx.createRadialGradient(
        centerX - globeRadius * 0.35,
        centerY - globeRadius * 0.35,
        globeRadius * 0.1,
        centerX,
        centerY,
        globeRadius
      );
      sphereGradient.addColorStop(0, "#1d3c68");
      sphereGradient.addColorStop(0.65, "#0b182d");
      sphereGradient.addColorStop(1, "#050d1a");

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
      ctx.fillStyle = sphereGradient;
      ctx.fill();

      ctx.strokeStyle = "rgba(90, 143, 217, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.clip(); // Clip within globe

      // 3. Latitude and Longitude Grid (Batched single path!)
      ctx.strokeStyle = "rgba(61, 115, 189, 0.16)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();

      getLatRings().forEach((ring) => {
        let first = true;
        ring.forEach((pt) => {
          const x1 = pt.x * cosY + pt.z * sinY;
          const z1 = -pt.x * sinY + pt.z * cosY;
          const z2 = pt.y * sinP + z1 * cosP;
          if (z2 > -0.2) {
            const y2 = pt.y * cosP - z1 * sinP;
            const sx = centerX + x1 * globeRadius;
            const sy = centerY - y2 * globeRadius;
            if (first) {
              ctx.moveTo(sx, sy);
              first = false;
            } else {
              ctx.lineTo(sx, sy);
            }
          } else {
            first = true;
          }
        });
      });

      getLngLines().forEach((line) => {
        let first = true;
        line.forEach((pt) => {
          const x1 = pt.x * cosY + pt.z * sinY;
          const z1 = -pt.x * sinY + pt.z * cosY;
          const z2 = pt.y * sinP + z1 * cosP;
          if (z2 > -0.2) {
            const y2 = pt.y * cosP - z1 * sinP;
            const sx = centerX + x1 * globeRadius;
            const sy = centerY - y2 * globeRadius;
            if (first) {
              ctx.moveTo(sx, sy);
              first = false;
            } else {
              ctx.lineTo(sx, sy);
            }
          } else {
            first = true;
          }
        });
      });
      ctx.stroke();

      // 4. Real World Coastlines (Batched path with single stroke!)
      ctx.strokeStyle = "rgba(90, 155, 235, 0.65)";
      ctx.lineWidth = 1.1;
      ctx.beginPath();

      getBorders().forEach((polygon) => {
        let started = false;
        polygon.forEach((pt) => {
          const x1 = pt.x * cosY + pt.z * sinY;
          const z1 = -pt.x * sinY + pt.z * cosY;
          const z2 = pt.y * sinP + z1 * cosP;
          if (z2 > -0.1) {
            const y2 = pt.y * cosP - z1 * sinP;
            const sx = centerX + x1 * globeRadius;
            const sy = centerY - y2 * globeRadius;
            if (!started) {
              ctx.moveTo(sx, sy);
              started = true;
            } else {
              ctx.lineTo(sx, sy);
            }
          } else {
            started = false;
          }
        });
      });
      ctx.stroke();

      // 5. Real Land Dot Matrix (ALL in ONE single batch draw call!)
      ctx.fillStyle = "rgba(145, 195, 255, 0.55)";
      ctx.beginPath();

      getDots().forEach((pt) => {
        const x1 = pt.x * cosY + pt.z * sinY;
        const z1 = -pt.x * sinY + pt.z * cosY;
        const z2 = pt.y * sinP + z1 * cosP;
        if (z2 > 0) {
          const y2 = pt.y * cosP - z1 * sinP;
          const sx = centerX + x1 * globeRadius;
          const sy = centerY - y2 * globeRadius;
          ctx.moveTo(sx + 1.2, sy);
          ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
        }
      });
      ctx.fill();

      // 6. Threat & Defense Country Nodes
      GLOBAL_COUNTRIES.forEach((c) => {
        const x1 = c.unit.x * cosY + c.unit.z * sinY;
        const z1 = -c.unit.x * sinY + c.unit.z * cosY;
        const z2 = c.unit.y * sinP + z1 * cosP;

        if (z2 > 0) {
          const y2 = c.unit.y * cosP - z1 * sinP;
          const sx = centerX + x1 * globeRadius;
          const sy = centerY - y2 * globeRadius;
          const depthAlpha = Math.min(1, Math.max(0.25, z2));

          const isAttacking = activeArcsRef.current.some((a) => a.source.code === c.code);
          const isTargeted = activeArcsRef.current.some((a) => a.target.code === c.code);

          if (isTargeted) {
            const pulse = (time % 1800) / 1800;
            ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - pulse) * depthAlpha})`;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.arc(sx, sy, 5 + pulse * 14, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = `rgba(56, 189, 248, ${0.95 * depthAlpha})`;
            ctx.beginPath();
            ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
            ctx.fill();

            if (z2 > 0.22) {
              ctx.fillStyle = `rgba(186, 230, 253, ${depthAlpha * 0.95})`;
              ctx.font = "bold 9px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
              ctx.fillText(c.country, sx + 7, sy + 3);
            }
          } else if (isAttacking) {
            ctx.fillStyle = `rgba(239, 68, 68, ${0.95 * depthAlpha})`;
            ctx.beginPath();
            ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
            ctx.fill();

            if (z2 > 0.25) {
              ctx.fillStyle = `rgba(255, 255, 255, ${depthAlpha * 0.95})`;
              ctx.font = "bold 9px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
              ctx.fillText(c.country, sx + 7, sy + 3);
            }
          } else {
            ctx.fillStyle = `rgba(147, 197, 253, ${0.4 * depthAlpha})`;
            ctx.beginPath();
            ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
            ctx.fill();

            if (z2 > 0.45) {
              ctx.fillStyle = `rgba(180, 210, 245, ${depthAlpha * 0.65})`;
              ctx.font = "8px ui-monospace, monospace";
              ctx.fillText(c.code, sx + 5, sy - 2);
            }
          }
        }
      });

      ctx.restore(); // Release clipping

      // 7. Spawn & Animate Attack Arcs
      spawnAttack(time);

      const remainingArcs: AttackArc[] = [];

      activeArcsRef.current.forEach((arc) => {
        arc.progress += arc.speed;

        if (arc.progress < 1) {
          remainingArcs.push(arc);

          const u1 = arc.source.unit;
          const u2 = arc.target.unit;

          const getPoint = (t: number) => {
            const rawX = u1.x * (1 - t) + u2.x * t;
            const rawY = u1.y * (1 - t) + u2.y * t;
            const rawZ = u1.z * (1 - t) + u2.z * t;
            const len = Math.sqrt(rawX * rawX + rawY * rawY + rawZ * rawZ) || 1;
            const elevation = Math.sin(t * Math.PI) * arc.altitude;
            const scale = (1 + elevation) / len;

            const px = rawX * scale;
            const py = rawY * scale;
            const pz = rawZ * scale;

            const x1 = px * cosY + pz * sinY;
            const z1 = -px * sinY + pz * cosY;
            const y2 = py * cosP - z1 * sinP;
            const z2 = py * sinP + z1 * cosP;

            return {
              x: centerX + x1 * globeRadius,
              y: centerY - y2 * globeRadius,
              z: z2 * globeRadius,
            };
          };

          const segments = 16;
          const currentSegIndex = Math.floor(arc.progress * segments);
          const startSeg = Math.max(0, currentSegIndex - 7);

          ctx.beginPath();
          let started = false;

          for (let s = startSeg; s <= currentSegIndex; s++) {
            const pt = getPoint(s / segments);
            if (pt.z > -globeRadius * 0.15) {
              if (!started) {
                ctx.moveTo(pt.x, pt.y);
                started = true;
              } else {
                ctx.lineTo(pt.x, pt.y);
              }
            }
          }

          if (started) {
            ctx.strokeStyle = arc.color;
            ctx.lineWidth = 2.2;
            ctx.stroke();
          }

          // Missile Projectile Head
          const headPt = getPoint(arc.progress);
          if (headPt.z > -globeRadius * 0.1) {
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(headPt.x, headPt.y, 2.8, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = arc.color;
            ctx.beginPath();
            ctx.arc(headPt.x, headPt.y, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Destination Impact Pulse
          const tu = arc.target.unit;
          const x1 = tu.x * cosY + tu.z * sinY;
          const z1 = -tu.x * sinY + tu.z * cosY;
          const z2 = tu.y * sinP + z1 * cosP;

          if (z2 > 0) {
            const y2 = tu.y * cosP - z1 * sinP;
            impactPulsesRef.current.push({
              x: centerX + x1 * globeRadius,
              y: centerY - y2 * globeRadius,
              radius: 4,
              maxRadius: 24,
              color: arc.color,
              opacity: 0.9,
            });
          }
        }
      });

      activeArcsRef.current = remainingArcs;

      // 8. Expanding Impact Pulses
      const remainingPulses: ImpactPulse[] = [];
      impactPulsesRef.current.forEach((pulse) => {
        pulse.radius += 0.9;
        pulse.opacity -= 0.04;

        if (pulse.opacity > 0 && pulse.radius < pulse.maxRadius) {
          remainingPulses.push(pulse);

          ctx.strokeStyle = pulse.color;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = pulse.opacity;
          ctx.beginPath();
          ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });
      impactPulsesRef.current = remainingPulses;
    };

    let startTimer = setTimeout(async () => {
      await loadGlobeGeoData();
      animationFrameId = requestAnimationFrame(render);
    }, 250);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Mouse & Touch Interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;
    rotationRef.current.yaw += deltaX * 0.006;
    rotationRef.current.pitch = Math.max(
      -1.2,
      Math.min(1.2, rotationRef.current.pitch + deltaY * 0.006)
    );
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - lastMousePosRef.current.x;
    const deltaY = e.touches[0].clientY - lastMousePosRef.current.y;
    rotationRef.current.yaw += deltaX * 0.007;
    rotationRef.current.pitch = Math.max(
      -1.2,
      Math.min(1.2, rotationRef.current.pitch + deltaY * 0.007)
    );
    lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-[480px]">
      {/* 3D Interactive Cyber Threat Globe Canvas */}
      <div
        ref={containerRef}
        className="relative w-full aspect-square cursor-grab active:cursor-grabbing bg-transparent flex items-center justify-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Live Dynamic Attacks Bar - Fixed Height to prevent any layout shift */}
      <div className="mt-2 h-[38px] w-full max-w-[420px] flex items-center justify-center overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-[#3d73bd]/35 shadow-lg backdrop-blur-md text-white text-xs font-mono">
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-300 shrink-0">
            LIVE ATTACKS:
          </span>
          <div className="flex items-center gap-2 flex-nowrap overflow-hidden">
            {liveAttacks.map((attack) => (
              <div
                key={attack.id}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-950/40 border border-red-900/40 text-[11px] shrink-0"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-ping shrink-0"
                  style={{ backgroundColor: attack.color }}
                />
                <span className="font-semibold text-red-300">{attack.from}</span>
                <span className="text-slate-400">➔</span>
                <span className="font-semibold text-cyan-300">{attack.to}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}