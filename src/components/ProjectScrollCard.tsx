import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { 
  ExternalLink, 
  Github, 
  ChevronRight, 
  ChevronDown, 
  Lock, 
  ArrowUpRight,
  Eye,
  Layers,
  Sparkles,
  CheckCircle2,
  Code2
} from "lucide-react";
import { Safari } from "@/registry/magicui/safari";

export interface ProjectData {
  title: string;
  category: string;
  tags: string;
  desc: string;
  highlights?: string[];
  icon: React.ReactNode;
  image: string;
  url: string;
  liveUrl?: string;
}

export interface ProjectScrollCardProps {
  key?: React.Key;
  project: ProjectData;
  index: number;
  total: number;
  topOffset?: number;
}

export function ProjectScrollCard({
  project,
  index,
  total,
  topOffset = 84,
}: ProjectScrollCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [manualShowDetails, setManualShowDetails] = useState<boolean | null>(null);

  // Scroll tracking across the container's height
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: [`start ${topOffset}px`, "end end"],
  });

  // Slide-up transform: 100% (hidden at bottom) -> 0% (covering the landing image)
  // 0.0 -> 0.10: detail card stays at 100% so user first sees the whole landing page image
  // 0.10 -> 0.60: detail card slides up to 0% to cover the whole image
  // 0.60 -> 1.0: detail card remains fully covering the landing page image
  const scrollYTransform = useTransform(
    scrollYProgress,
    [0.10, 0.60],
    ["100%", "0%"]
  );

  // Text blur: 14px -> 0px as user scrolls
  const scrollBlur = useTransform(
    scrollYProgress,
    [0.12, 0.58],
    [14, 0]
  );
  const filterTransform = useTransform(
    scrollBlur,
    (val) => `blur(${Math.max(0, val).toFixed(1)}px)`
  );

  // Text & content opacity: 0.15 -> 1
  const opacityTransform = useTransform(
    scrollYProgress,
    [0.10, 0.52],
    [0.15, 1]
  );

  // Vertical lift for inner typography
  const textYTransform = useTransform(
    scrollYProgress,
    [0.12, 0.60],
    [28, 0]
  );

  // Determine actual values (respecting manual toggle if clicked)
  const y = manualShowDetails === true ? "0%" : manualShowDetails === false ? "100%" : scrollYTransform;
  const filter = manualShowDetails !== null ? "blur(0px)" : filterTransform;
  const opacity = manualShowDetails !== null ? 1 : opacityTransform;
  const textY = manualShowDetails !== null ? 0 : textYTransform;

  const targetRedirectUrl = project.liveUrl || project.url;

  const getCleanUrl = (urlStr?: string, fallback: string = ""): string => {
    if (!urlStr) return fallback;
    return urlStr.replace(/^https?:\/\//, "").replace(/\/$/, "");
  };

  const safariUrl = getCleanUrl(
    project.liveUrl,
    getCleanUrl(project.url, `${project.title.toLowerCase().replace(/[^a-z0-9]/g, "")}.vercel.app`)
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[175vh] mb-16 last:mb-0"
      style={{
        zIndex: index + 10,
      }}
    >
      {/* Sticky Frame with Rounded Corners */}
      <div
        className="sticky w-full rounded-2xl md:rounded-3xl border border-border-subtle bg-surface shadow-2xl overflow-hidden transition-all duration-300"
        style={{
          top: `${topOffset}px`,
          height: `calc(100vh - ${topOffset + 24}px)`,
          maxHeight: "750px",
          minHeight: "520px",
        }}
      >
        {/* ============================================================== */}
        {/* BASE LAYER: The Whole Image of the Project in Safari Component */}
        {/* ============================================================== */}
        <div className="absolute inset-0 w-full h-full flex flex-col bg-background/95 select-none overflow-hidden items-center justify-between p-3 sm:p-5 md:p-6">
          {/* Top Quick Bar */}
          <div className="w-full max-w-[1203px] flex items-center justify-between gap-3 mb-2 shrink-0 z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-text-primary px-3 py-1 rounded-full bg-surface border border-border-subtle shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>{project.title}</span>
              </span>
              <span className="hidden md:inline-block text-xs font-mono text-text-tertiary">
                Landing Page Preview
              </span>
            </div>

            <div className="flex items-center gap-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-primary text-surface hover:opacity-90 transition-opacity shadow-sm"
                >
                  <span>Open Live App</span>
                  <ExternalLink size={11} />
                </a>
              )}
              <button
                onClick={() => setManualShowDetails(manualShowDetails === true ? false : true)}
                className="flex items-center gap-1.5 text-xs font-mono px-3 py-1 border border-border-subtle rounded-full bg-surface hover:bg-background text-text-secondary hover:text-text-primary transition-colors cursor-pointer shadow-sm"
                title="Toggle Project Details"
              >
                <Layers size={12} className="text-primary" />
                <span>View Details</span>
              </button>
            </div>
          </div>

          {/* Centered Safari Component Window */}
          <div className="relative w-full max-w-[1203px] flex-1 min-h-0 flex items-center justify-center py-1">
            <a
              href={targetRedirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block group cursor-pointer transition-transform duration-500 hover:scale-[1.008]"
              title={`Click to open ${project.title} (${safariUrl})`}
            >
              <Safari
                url={safariUrl}
                imageSrc={project.image}
                mode="default"
                className="w-full shadow-2xl drop-shadow-2xl"
              />
            </a>
          </div>

          {/* Floating scroll prompt indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: [0, 6, 0] }}
            transition={{
              opacity: { duration: 0.5, delay: 0.2 },
              y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
            }}
            className="shrink-0 pt-1 pointer-events-none z-10"
          >
            <div className="bg-surface/95 backdrop-blur-md border border-border-subtle shadow-xl px-4 py-1.5 rounded-full text-xs font-mono font-medium text-text-secondary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Scroll to reveal project details</span>
              <ChevronDown size={14} className="text-primary" />
            </div>
          </motion.div>
        </div>

        {/* ============================================================== */}
        {/* DETAIL LAYER: Comes from down with blurry text to normal       */}
        {/* which covers the whole landing page img                        */}
        {/* ============================================================== */}
        <motion.div
          className="absolute inset-0 w-full h-full bg-surface border-t border-border-subtle shadow-2xl flex flex-col overflow-y-auto scrollbar-thin z-20 rounded-2xl md:rounded-3xl"
          style={{
            y,
          }}
        >
          {/* Detail Sheet Top Status Bar */}
          <div className="h-12 border-b border-border-subtle bg-surface/90 backdrop-blur-md px-5 flex items-center justify-between shrink-0 sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
                Project Details
              </span>
              <span className="text-xs font-mono text-text-tertiary hidden sm:inline">
                ({index + 1} / {total})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setManualShowDetails(false)}
                className="text-xs font-mono text-text-secondary hover:text-text-primary px-3 py-1 rounded-full border border-border-subtle hover:bg-background transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Peek Landing Page Image"
              >
                <Eye size={12} className="text-primary" />
                <span className="hidden sm:inline">View Landing Page</span>
              </button>
            </div>
          </div>

          {/* Sliding Content Container with Blur to Normal Transition */}
          <motion.div
            className="p-6 sm:p-8 md:p-12 flex flex-col flex-1 justify-between gap-8 will-change-[transform,filter,opacity]"
            style={{
              filter,
              opacity,
              y: textY,
            }}
          >
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-between">
              {/* Left Column: Icon, Category, Title, Tags & CTA Buttons */}
              <div className="w-full lg:w-5/12 shrink-0 flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-background border border-border-subtle flex items-center justify-center mb-6 shadow-sm">
                    {project.icon}
                  </div>
                  <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-primary">
                    {project.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-text-primary mt-2 mb-3">
                    {project.title}
                  </h3>
                  <p className="text-xs text-text-secondary uppercase tracking-wider font-mono font-semibold mb-6">
                    {project.tags}
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-border-subtle">
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-primary rounded-xl text-xs sm:text-sm py-2.5 px-4 sm:px-5 flex items-center gap-2 font-mono font-medium shadow-md"
                  >
                    <Github size={16} /> GitHub <ChevronRight size={14} />
                  </a>
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-secondary rounded-xl text-xs sm:text-sm py-2.5 px-4 sm:px-5 flex items-center gap-1.5 font-mono font-medium shadow-sm hover:border-primary/50"
                    >
                      <span>Live Demo</span>
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>

                {/* Prominent Direct URL Chip */}
                {project.liveUrl && (
                  <div className="mt-5 pt-4 border-t border-border-subtle/70">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary block mb-1">
                      Direct Application URL
                    </span>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-primary hover:underline flex items-center gap-1.5 break-all font-semibold"
                    >
                      <Lock size={12} className="shrink-0" />
                      <span>{project.liveUrl}</span>
                      <ArrowUpRight size={13} className="shrink-0" />
                    </a>
                  </div>
                )}
              </div>

              {/* Right Column: Clean Project Overview Description */}
              <div className="w-full lg:w-7/12 lg:border-l lg:border-border-subtle lg:pl-10 space-y-6">
                <div>
                  <h4 className="text-xs uppercase font-mono tracking-widest text-text-tertiary mb-3 font-bold flex items-center gap-2">
                    <Sparkles size={14} className="text-primary" />
                    <span>Project Overview</span>
                  </h4>
                  <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-normal">
                    {project.desc}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border-subtle">
                  <div className="p-4 rounded-xl bg-background/50 border border-border-subtle">
                    <div className="flex items-center gap-2 text-xs font-mono text-primary font-bold mb-1">
                      <CheckCircle2 size={14} />
                      <span>Production Deployment</span>
                    </div>
                    <p className="text-xs text-text-tertiary font-mono">
                      {project.liveUrl ? "Live on Vercel Cloud" : "Public Git Repository"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-background/50 border border-border-subtle">
                    <div className="flex items-center gap-2 text-xs font-mono text-primary font-bold mb-1">
                      <Code2 size={14} />
                      <span>Full Stack Integration</span>
                    </div>
                    <p className="text-xs text-text-tertiary font-mono">
                      End-to-End Modern Architecture
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-xs font-mono text-text-tertiary">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>Production Ready & Verified</span>
              </span>
              <span className="hidden sm:inline">
                Scroll down to explore next project ↓
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProjectScrollCard;
