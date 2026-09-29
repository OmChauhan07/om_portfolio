import React, { useRef, useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export interface LogoItem {
  node?: React.ReactNode;
  src?: string;
  alt?: string;
  title?: string;
  href?: string;
  className?: string;
  key?: React.Key;
}

export interface LogoLoopProps extends React.HTMLAttributes<HTMLDivElement> {
  logos?: LogoItem[];
  items?: LogoItem[];
  speed?: number; // Pixels per second or speed factor, default 80
  direction?: "left" | "right" | "up" | "down";
  logoHeight?: number; // Height in pixels, default 48
  gap?: number; // Gap between logos in pixels, default 48
  hoverSpeed?: number; // Speed when hovered (0 pauses)
  scaleOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  fadeColor?: string;
  ariaLabel?: string;
  useCustomRender?: boolean;
  renderItem?: (item: LogoItem, index: number) => React.ReactNode;
  repeat?: number;
  className?: string;
  style?: React.CSSProperties;
  key?: React.Key;
}

export function LogoLoop({
  logos,
  items,
  speed = 80,
  direction = "left",
  logoHeight = 48,
  gap = 48,
  hoverSpeed = 0,
  scaleOnHover = false,
  fadeOut = false,
  fadeOutColor,
  fadeColor,
  ariaLabel = "Technology partners",
  useCustomRender = false,
  renderItem,
  repeat = 4,
  className,
  style,
  ...props
}: LogoLoopProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const logoList = useMemo(() => {
    return logos || items || [];
  }, [logos, items]);

  const isVertical = direction === "up" || direction === "down";
  const isReverse = direction === "right" || direction === "down";

  // Calculate dynamic duration based on total track length (including repeats), height/gap and speed
  const baseDuration = useMemo(() => {
    const totalPx = Math.max(logoList.length, 1) * repeat * (logoHeight + gap);
    const calculatedDuration = totalPx / Math.max(speed, 5);
    return Math.max(calculatedDuration, 20);
  }, [logoList.length, repeat, logoHeight, gap, speed]);

  // Adjust duration if hovered and hoverSpeed is specified (and > 0)
  const currentDuration = useMemo(() => {
    if (isHovered && hoverSpeed !== undefined && hoverSpeed > 0) {
      const totalPx = Math.max(logoList.length, 1) * repeat * (logoHeight + gap);
      return totalPx / hoverSpeed;
    }
    return baseDuration;
  }, [isHovered, hoverSpeed, baseDuration, logoList.length, repeat, logoHeight, gap]);

  const effectiveFadeColor = fadeOutColor || fadeColor || "var(--color-background, #FAFAF9)";

  const renderLogoItem = (logo: LogoItem, index: number) => {
    if (useCustomRender && renderItem) {
      return renderItem(logo, index);
    }

    const content = (
      <div
        className={cn(
          "flex items-center justify-center transition-all duration-300 text-text-secondary hover:text-text-primary",
          scaleOnHover && "hover:scale-125 transform-gpu",
          logo.className
        )}
        style={{
          height: `${logoHeight}px`,
          minWidth: `${logoHeight}px`,
        }}
        title={logo.title || logo.alt}
      >
        {logo.node ? (
          <div
            className="flex items-center justify-center select-none"
            style={{
              fontSize: `${Math.round(logoHeight * 0.75)}px`,
              width: `${logoHeight}px`,
              height: `${logoHeight}px`,
            }}
          >
            {logo.node}
          </div>
        ) : logo.src ? (
          <img
            src={logo.src}
            alt={logo.alt || logo.title || "Logo"}
            className="object-contain max-h-full max-w-full select-none"
            style={{ height: `${logoHeight}px` }}
          />
        ) : (
          <span className="text-sm font-semibold select-none">{logo.title}</span>
        )}
      </div>
    );

    if (logo.href) {
      return (
        <a
          key={logo.key || `${logo.title || index}-${index}`}
          href={logo.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={logo.title || logo.alt || `Logo ${index}`}
          className="inline-flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {content}
        </a>
      );
    }

    return (
      <div key={logo.key || `${logo.title || index}-${index}`} className="inline-flex items-center justify-center">
        {content}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative flex overflow-hidden w-full select-none",
        isVertical ? "flex-col h-full" : "flex-row items-center",
        className
      )}
      style={{
        ...style,
      }}
      {...props}
    >
      {/* Animated track loops */}
      <div
        className={cn(
          "flex shrink-0 items-center justify-around",
          isVertical ? "flex-col animate-marquee-vertical" : "flex-row animate-marquee"
        )}
        style={{
          gap: `${gap}px`,
          ["--gap" as string]: `${gap}px`,
          ["--duration" as string]: `${currentDuration}s`,
          animationDuration: `${currentDuration}s`,
          animationDirection: isReverse ? "reverse" : "normal",
          animationPlayState: isHovered && hoverSpeed === 0 ? "paused" : "running",
          paddingRight: isVertical ? 0 : `${gap}px`,
          paddingBottom: isVertical ? `${gap}px` : 0,
        }}
      >
        {Array(repeat)
          .fill(0)
          .map((_, loopIdx) => (
            <React.Fragment key={loopIdx}>
              {logoList.map((logo, logoIdx) =>
                renderLogoItem(logo, loopIdx * logoList.length + logoIdx)
              )}
            </React.Fragment>
          ))}
      </div>

      {/* Duplicate track for seamless infinite marquee loop */}
      <div
        className={cn(
          "flex shrink-0 items-center justify-around",
          isVertical ? "flex-col animate-marquee-vertical" : "flex-row animate-marquee"
        )}
        style={{
          gap: `${gap}px`,
          ["--gap" as string]: `${gap}px`,
          ["--duration" as string]: `${currentDuration}s`,
          animationDuration: `${currentDuration}s`,
          animationDirection: isReverse ? "reverse" : "normal",
          animationPlayState: isHovered && hoverSpeed === 0 ? "paused" : "running",
          paddingRight: isVertical ? 0 : `${gap}px`,
          paddingBottom: isVertical ? `${gap}px` : 0,
        }}
        aria-hidden="true"
      >
        {Array(repeat)
          .fill(0)
          .map((_, loopIdx) => (
            <React.Fragment key={loopIdx}>
              {logoList.map((logo, logoIdx) =>
                renderLogoItem(logo, loopIdx * logoList.length + logoIdx)
              )}
            </React.Fragment>
          ))}
      </div>

      {/* Fade Out Edge Gradients */}
      {fadeOut && !isVertical && (
        <>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-36 z-10"
            style={{
              background: `linear-gradient(to right, ${effectiveFadeColor}, transparent)`,
            }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-36 z-10"
            style={{
              background: `linear-gradient(to left, ${effectiveFadeColor}, transparent)`,
            }}
          />
        </>
      )}

      {fadeOut && isVertical && (
        <>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-16 z-10"
            style={{
              background: `linear-gradient(to bottom, ${effectiveFadeColor}, transparent)`,
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-10"
            style={{
              background: `linear-gradient(to top, ${effectiveFadeColor}, transparent)`,
            }}
          />
        </>
      )}
    </div>
  );
}

export default LogoLoop;
