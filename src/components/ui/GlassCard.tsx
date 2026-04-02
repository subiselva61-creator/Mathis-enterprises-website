import type { CSSProperties, ReactNode } from "react";
import "./GlassCard.css";

export type GlassCardProps = {
  children?: ReactNode;
  className?: string;
  blur?: number;
  distortion?: number;
  flexibility?: number;
  borderColor?: string;
  borderSize?: number;
  borderRadius?: number;
  borderOpacity?: number;
  backgroundColor?: string;
  backgroundOpacity?: number;
  innerLightColor?: string;
  innerLightSpread?: number;
  innerLightBlur?: number;
  innerLightOpacity?: number;
  outerLightColor?: string;
  outerLightSpread?: number;
  outerLightBlur?: number;
  outerLightOpacity?: number;
  color?: string;
  chromaticAberration?: number;
  onHoverScale?: number;
  saturation?: number;
  brightness?: number;
};

export default function GlassCard({
  children,
  className = "",
  blur = 15,
  distortion = 46,
  flexibility = 0,
  borderColor = "#ffffff",
  borderSize = 0,
  borderRadius = 30,
  borderOpacity = 0.4,
  backgroundColor = "#000000ff",
  backgroundOpacity = 0,
  innerLightColor = "#ffffff",
  innerLightSpread = 1,
  innerLightBlur = 10,
  innerLightOpacity = 0,
  outerLightColor = "#ffffff",
  outerLightSpread = 1,
  outerLightBlur = 10,
  outerLightOpacity = 0,
  color = "#ffffff",
  chromaticAberration = 0,
  onHoverScale = 1,
  saturation = 199,
  brightness = 131,
}: GlassCardProps) {
  const style = {
    "--gc-blur": `${blur}px`,
    "--gc-distortion": `${distortion}px`,
    "--gc-flexibility": flexibility,
    "--gc-border-color": borderColor,
    "--gc-border-size": `${borderSize}px`,
    "--gc-border-radius": `${borderRadius}px`,
    "--gc-border-opacity": borderOpacity,
    "--gc-background-color": backgroundColor,
    "--gc-background-opacity": backgroundOpacity,
    "--gc-inner-light-color": innerLightColor,
    "--gc-inner-light-spread": innerLightSpread,
    "--gc-inner-light-blur": `${innerLightBlur}px`,
    "--gc-inner-light-opacity": innerLightOpacity,
    "--gc-outer-light-color": outerLightColor,
    "--gc-outer-light-spread": outerLightSpread,
    "--gc-outer-light-blur": `${outerLightBlur}px`,
    "--gc-outer-light-opacity": outerLightOpacity,
    "--gc-color": color,
    "--gc-chromatic-aberration": `${chromaticAberration}px`,
    "--gc-hover-scale": onHoverScale,
    "--gc-saturation": `${saturation}%`,
    "--gc-brightness": `${brightness}%`,
  } as CSSProperties;

  return (
    <div className={`glass-card ${className}`} style={style}>
      <div className="glass-card-inner">{children}</div>
    </div>
  );
}
