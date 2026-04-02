"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Color, type Mesh, ShaderMaterial } from "three";
import styles from "./Silk.module.css";

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

type SilkUniforms = {
  uSpeed: { value: number };
  uScale: { value: number };
  uNoiseIntensity: { value: number };
  uColor: { value: Color };
  uRotation: { value: number };
  uTime: { value: number };
};

function SilkPlane({ uniforms, paused }: { uniforms: SilkUniforms; paused?: boolean }) {
  const meshRef = useRef<Mesh>(null);

  /* Scale from state.viewport each frame — R3F viewport is often 0 on first layout, leaving a 0×0 mesh. */
  useFrame((state, delta) => {
    const m = meshRef.current;
    if (!m) return;
    const { width, height } = state.viewport;
    if (width > 0 && height > 0) {
      m.scale.set(width, height, 1);
    }
    if (paused) return;
    const material = m.material as ShaderMaterial;
    material.uniforms.uTime.value += 0.1 * delta;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
    </mesh>
  );
}

export type SilkProps = {
  className?: string;
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
  /** When true, freezes time (no motion) but keeps rendering so layout/scale stay correct. */
  paused?: boolean;
  frameloop?: "always" | "demand" | "never";
};

export default function Silk({
  className = "",
  speed = 5,
  scale = 1,
  color = "#7B7481",
  noiseIntensity = 1.5,
  rotation = 0,
  paused = false,
  frameloop = "always",
}: SilkProps) {
  const uniforms = useMemo<SilkUniforms>(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(color) },
      uRotation: { value: rotation },
      uTime: { value: 0 },
    }),
    [speed, scale, noiseIntensity, color, rotation]
  );

  const planeKey = `${speed}-${scale}-${color}-${noiseIntensity}-${rotation}`;

  return (
    <div className={`${styles.canvasWrap} ${className}`.trim()}>
      <Canvas
        className={styles.canvas}
        dpr={[1, 2]}
        frameloop={frameloop}
        gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          /* Mid-tone clear so the canvas never reads as “empty black” before the first draw. */
          gl.setClearColor(0x2a2630, 1);
        }}
      >
        <SilkPlane key={planeKey} uniforms={uniforms} paused={paused} />
      </Canvas>
    </div>
  );
}
