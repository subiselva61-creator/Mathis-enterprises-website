import { createElement, type CSSProperties, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import "./StarBorder.css";

export type StarBorderProps = {
  as?: ElementType;
  className?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  children?: ReactNode;
  style?: CSSProperties;
} & Omit<HTMLAttributes<HTMLElement>, "children" | "color" | "style">;

export default function StarBorder({
  as: Component = "div",
  className = "",
  color = "white",
  speed = "6s",
  thickness = 1,
  children,
  style,
  ...rest
}: StarBorderProps) {
  const stripStyle = {
    background: `linear-gradient(90deg, transparent 0%, ${color} 45%, ${color} 55%, transparent 100%)`,
    animationDuration: speed,
  };

  return createElement(
    Component,
    {
      ...rest,
      className: `star-border-container ${className}`,
      style: {
        padding: `${thickness}px 0`,
        ...style,
      },
    },
    createElement(
      "div",
      { className: "border-gradient-bottom", "aria-hidden": true },
      createElement("div", { className: "border-gradient-track", style: stripStyle })
    ),
    createElement(
      "div",
      { className: "border-gradient-top", "aria-hidden": true },
      createElement("div", { className: "border-gradient-track", style: stripStyle })
    ),
    createElement("div", { className: "inner-content" }, children)
  );
}
