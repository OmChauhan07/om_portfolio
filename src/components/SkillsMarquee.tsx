import React from "react";
import { Marquee } from "@/registry/magicui/marquee";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Database,
  Brain,
  Cpu,
  BarChart3,
  Layers,
  Server,
  Zap,
  Code2,
  Table,
  Grid3X3,
  Search,
  MessageSquare,
  FileCode2,
  GitBranch,
  Network
} from "lucide-react";

interface SkillItem {
  name: string;
  category: string;
  color: string;
  bgLight: string;
  icon: React.ReactNode;
}

// Brand SVG helpers for official logos
const PythonIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
    <path
      d="M11.91 2C6.44 2 6.78 4.38 6.78 4.38L6.8 6.85H12V7.61H4.37S2 7.33 2 12.82c0 5.48 2.08 5.29 2.08 5.29H6.1v-2.58s-.11-3.08 3.03-3.08h5.16s2.94.05 2.94-2.84V4.84S17.65 2 11.91 2z"
      fill="#3776AB"
    />
    <path
      d="M12.09 22c5.47 0 5.13-2.38 5.13-2.38l-.02-2.47H12v-.76h7.63s2.37.28 2.37-5.21c0-5.48-2.08-5.29-2.08-5.29h-2.02v2.58s.11 3.08-3.03 3.08H9.71s-2.94-.05-2.94 2.84v4.77S6.35 22 12.09 22z"
      fill="#FFD43B"
    />
    <circle cx="8.9" cy="4.9" r="0.8" fill="#fff" />
    <circle cx="15.1" cy="19.1" r="0.8" fill="#fff" />
  </svg>
);

const ReactIcon = () => (
  <svg className="w-5 h-5 animate-spin-slow" viewBox="-11.5 -10.23174 23 20.46348" fill="none">
    <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
    <g stroke="#61DAFB" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

const NodeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#5FA04E">
    <path d="M12 2L3 7.2v10.4L12 22.8l9-5.2V7.2L12 2zm6.7 14.5L12 20.5l-6.7-4V8.5L12 4.5l6.7 4v8z" />
  </svg>
);

const DjangoIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#092E20">
    <path d="M11.146 0h3.333v17.433c-1.631.304-2.871.425-4.326.425-4.423 0-6.907-2.062-6.907-5.877 0-3.701 2.55-5.998 6.471-5.998.583 0 1.02.048 1.429.17zm0 8.788c-.34-.097-.68-.146-1.116-.146-2.063 0-3.325 1.116-3.325 3.325 0 2.087 1.214 3.252 3.155 3.252.388 0 .825-.049 1.286-.146zm11.237 0V24h-3.35V0h3.35z" />
  </svg>
);

const PostgresIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#4169E1">
    <path d="M12 2a10 10 0 0 0-3.16 19.49c-.1-.7-.18-1.57-.18-2.58 0-1.87.5-3.32 1.46-4.22-.39-.14-.8-.22-1.25-.22-1.4 0-2.54.89-2.87 2.14a8 8 0 1 1 12.38-2.61c.45.69.75 1.5.86 2.37.11.89.04 1.7-.22 2.38A10 10 0 0 0 12 2z" />
  </svg>
);

const SupabaseIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
    <path
      d="M21.362 9.354H12V.348a.348.348 0 0 0-.598-.242L2.638 8.87a1.392 1.392 0 0 0 .97 2.378H12v9.006a.348.348 0 0 0 .598.242l8.764-8.764a1.392 1.392 0 0 0-.97-2.378z"
      fill="#3ECF8E"
    />
  </svg>
);

const FastApiIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 13h9l-1 9 12-13h-9l1-7z" fill="#009688" />
  </svg>
);

const TypeScriptIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#3178C6">
    <path d="M3 3h18v18H3V3zm14.15 9.77h-2.1v5.6h-1.85v-5.6h-2.1v-1.63h6.05v1.63zm3.17 3.5c-.32.61-.8.95-1.58.95-.91 0-1.55-.58-1.55-1.48 0-.97.74-1.39 1.86-1.74l.43-.13c.8-.25 1.25-.61 1.25-1.34 0-.97-.83-1.6-2.12-1.6-1.07 0-1.85.45-2.22 1.27l1.37.84c.19-.43.51-.62.9-.62.5 0 .82.26.82.68 0 .4-.28.62-.97.85l-.46.16c-1.18.4-1.84.97-1.84 2.1 0 1.5 1.15 2.35 2.68 2.35 1.21 0 2.06-.52 2.52-1.42l-1.07-.85z" />
  </svg>
);

const TailwindIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#06B6D4">
    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
  </svg>
);

// Row 1: Web & Backend, Core Languages, Databases
const skillsRow1: SkillItem[] = [
  {
    name: "Python",
    category: "Core Language",
    color: "text-[#3776AB]",
    bgLight: "bg-[#3776AB]/10",
    icon: <PythonIcon />,
  },
  {
    name: "React",
    category: "Frontend UI",
    color: "text-[#61DAFB]",
    bgLight: "bg-[#61DAFB]/10",
    icon: <ReactIcon />,
  },
  {
    name: "FastAPI",
    category: "High-Perf API",
    color: "text-[#009688]",
    bgLight: "bg-[#009688]/10",
    icon: <FastApiIcon />,
  },
  {
    name: "Django",
    category: "Full-Stack Web",
    color: "text-[#092E20]",
    bgLight: "bg-[#44B78B]/10",
    icon: <DjangoIcon />,
  },
  {
    name: "Node.js",
    category: "JavaScript Runtime",
    color: "text-[#5FA04E]",
    bgLight: "bg-[#5FA04E]/10",
    icon: <NodeIcon />,
  },
  {
    name: "PostgreSQL / Neon",
    category: "Serverless SQL",
    color: "text-[#00E599]",
    bgLight: "bg-[#00E599]/10",
    icon: <PostgresIcon />,
  },
  {
    name: "Supabase",
    category: "Backend Platform",
    color: "text-[#3ECF8E]",
    bgLight: "bg-[#3ECF8E]/10",
    icon: <SupabaseIcon />,
  },
  {
    name: "Prisma ORM",
    category: "Type-Safe DB",
    color: "text-[#5A67D8]",
    bgLight: "bg-[#5A67D8]/10",
    icon: <Layers className="w-5 h-5 text-[#5A67D8]" />,
  },
  {
    name: "TypeScript",
    category: "Typed JavaScript",
    color: "text-[#3178C6]",
    bgLight: "bg-[#3178C6]/10",
    icon: <TypeScriptIcon />,
  },
  {
    name: "Tailwind CSS",
    category: "Utility Styling",
    color: "text-[#06B6D4]",
    bgLight: "bg-[#06B6D4]/10",
    icon: <TailwindIcon />,
  },
  {
    name: "Git & GitHub",
    category: "Version Control",
    color: "text-[#F05032]",
    bgLight: "bg-[#F05032]/10",
    icon: <GitBranch className="w-5 h-5 text-[#F05032]" />,
  },
];

// Row 2: AI, Agentic Systems, Data Science & Analytics
const skillsRow2: SkillItem[] = [
  {
    name: "Gemini API",
    category: "Multimodal AI",
    color: "text-[#4E75F8]",
    bgLight: "bg-[#4E75F8]/10",
    icon: <Sparkles className="w-5 h-5 text-[#4E75F8]" />,
  },
  {
    name: "CrewAI",
    category: "Multi-Agent Workflows",
    color: "text-[#F97316]",
    bgLight: "bg-[#F97316]/10",
    icon: <Brain className="w-5 h-5 text-[#F97316]" />,
  },
  {
    name: "LangChain",
    category: "LLM Orchestration",
    color: "text-[#22D3EE]",
    bgLight: "bg-[#22D3EE]/10",
    icon: <Network className="w-5 h-5 text-[#22D3EE]" />,
  },
  {
    name: "Scikit-learn",
    category: "Machine Learning",
    color: "text-[#F7931E]",
    bgLight: "bg-[#F7931E]/10",
    icon: <Cpu className="w-5 h-5 text-[#F7931E]" />,
  },
  {
    name: "Pandas",
    category: "Data Analysis",
    color: "text-[#150458]",
    bgLight: "bg-[#150458]/10",
    icon: <Table className="w-5 h-5 text-[#818CF8]" />,
  },
  {
    name: "NumPy",
    category: "Scientific Computing",
    color: "text-[#013243]",
    bgLight: "bg-[#013243]/10",
    icon: <Grid3X3 className="w-5 h-5 text-[#38BDF8]" />,
  },
  {
    name: "Power BI",
    category: "Business Intelligence",
    color: "text-[#F2C811]",
    bgLight: "bg-[#F2C811]/10",
    icon: <BarChart3 className="w-5 h-5 text-[#F2C811]" />,
  },
  {
    name: "SQL & RDBMS",
    category: "Data Architecture",
    color: "text-[#336791]",
    bgLight: "bg-[#336791]/10",
    icon: <Database className="w-5 h-5 text-[#336791]" />,
  },
  {
    name: "DRF",
    category: "REST Framework",
    color: "text-[#A30000]",
    bgLight: "bg-[#A30000]/10",
    icon: <Code2 className="w-5 h-5 text-[#EF4444]" />,
  },
  {
    name: "EDA",
    category: "Exploratory Analysis",
    color: "text-[#00A3E0]",
    bgLight: "bg-[#00A3E0]/10",
    icon: <Search className="w-5 h-5 text-[#00A3E0]" />,
  },
  {
    name: "LLMs & GenAI",
    category: "Foundational Models",
    color: "text-[#FF9900]",
    bgLight: "bg-[#FF9900]/10",
    icon: <MessageSquare className="w-5 h-5 text-[#FF9900]" />,
  },
];

interface SkillCardProps {
  skill: SkillItem;
  key?: React.Key;
}

const SkillCard = ({ skill }: SkillCardProps) => {
  return (
    <figure
      className={cn(
        "relative flex items-center gap-3.5 px-5 py-3.5 cursor-pointer overflow-hidden border transition-all duration-200 select-none group shrink-0",
        // Light styles
        "border-border-subtle bg-surface hover:border-primary hover:bg-surface-raised",
        // Dark styles
        "dark:border-border-subtle dark:bg-surface dark:hover:border-primary dark:hover:bg-surface-raised"
      )}
    >
      <div className="w-10 h-10 flex items-center justify-center bg-background border border-border-subtle group-hover:scale-110 transition-transform shrink-0">
        {skill.icon}
      </div>
      <div className="flex flex-col min-w-0 pr-2">
        <figcaption className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors tracking-tight whitespace-nowrap">
          {skill.name}
        </figcaption>
        <p className="text-[11px] font-mono text-text-tertiary tracking-wide whitespace-nowrap">
          {skill.category}
        </p>
      </div>
    </figure>
  );
};

export function SkillsMarquee() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-4">
      {/* Row 1 - Forward */}
      <Marquee pauseOnHover className="[--duration:28s] py-2">
        {skillsRow1.map((skill) => (
          <SkillCard key={skill.name} skill={skill} />
        ))}
      </Marquee>

      {/* Row 2 - Reverse */}
      <Marquee reverse pauseOnHover className="[--duration:28s] py-2">
        {skillsRow2.map((skill) => (
          <SkillCard key={skill.name} skill={skill} />
        ))}
      </Marquee>

      {/* Edge gradient masks for smooth fade in/out */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-36 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-36 bg-gradient-to-l from-background to-transparent z-10" />
    </div>
  );
}

export default SkillsMarquee;
