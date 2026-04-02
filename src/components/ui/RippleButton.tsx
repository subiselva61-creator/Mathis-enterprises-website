"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import "./RippleButton.css";

type Ripple = { id: string; x: number; y: number; diameter: number };

const RippleContext = createContext<{ ripples: Ripple[] } | null>(null);

export type RippleButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  children?: ReactNode;
};

export function RippleButton({
  variant = "default",
  size = "default",
  className = "",
  children,
  onClick,
  disabled,
  type = "button",
  ...rest
}: RippleButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const pushRipple = useCallback(
    (clientX: number, clientY: number) => {
      const el = buttonRef.current;
      if (!el || disabled) return;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const diameter = Math.max(rect.width, rect.height) * 2.2;
      setRipples((prev) => [...prev, { id, x, y, diameter }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    },
    [disabled]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      pushRipple(e.clientX, e.clientY);
      onClick?.(e);
    },
    [onClick, pushRipple]
  );

  const variantClass = `ripple-button--variant-${variant}`;
  const sizeClass = size !== "default" ? `ripple-button--size-${size}` : "";
  const mergedClass = ["ripple-button", variantClass, sizeClass, className].filter(Boolean).join(" ");

  return (
    <button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      className={mergedClass}
      onClick={handleClick}
      {...rest}
    >
      <RippleContext.Provider value={{ ripples }}>{children}</RippleContext.Provider>
    </button>
  );
}

export function RippleButtonRipples() {
  const ctx = useContext(RippleContext);
  if (!ctx?.ripples?.length) {
    return <span className="ripple-button__ripples" aria-hidden />;
  }
  return (
    <span className="ripple-button__ripples" aria-hidden>
      {ctx.ripples.map((r) => (
        <span
          key={r.id}
          className="ripple-button__ripple"
          style={{
            left: r.x,
            top: r.y,
            width: r.diameter,
            height: r.diameter,
            marginLeft: -r.diameter / 2,
            marginTop: -r.diameter / 2,
          }}
        />
      ))}
    </span>
  );
}
