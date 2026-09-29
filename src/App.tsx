import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import React, { useState, useEffect, useMemo, cloneElement, useRef } from "react";
import BlurText from "./components/BlurText";
import TextType from "./components/TextType";
import { MagicCard, GlobalSpotlight } from "./components/MagicCard";
import ShapeGrid from "./components/ShapeGrid";
import { GitHubCalendar } from "react-github-calendar";
import { AnimatedThemeToggler } from "@/registry/magicui/animated-theme-toggler";
import { ScrollProgress } from "@/registry/magicui/scroll-progress";
import LogoLoop from "./LogoLoop";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";
import { 
  SiReact, 
  SiNextdotjs, 
  SiTypescript, 
  SiTailwindcss,
  SiPython,
  SiFastapi,
  SiDjango,
  SiNodedotjs,
  SiPostgresql,
  SiSupabase,
  SiPrisma,
  SiDocker,
  SiGit,
  SiGithub,
  SiPandas,
  SiNumpy,
  SiScikitlearn,
  SiLangchain,
  SiPytorch,
  SiTensorflow,
  SiRedis,
  SiLinux
} from 'react-icons/si';
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { format, subDays, differenceInDays, parseISO } from "date-fns";
import axios from "axios";
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code2, 
  BrainCircuit, 
  BarChart3, 
  ChevronRight,
  Database,
  Terminal,
  Trophy,
  GraduationCap,
  Loader2,
  CalendarDays,
  Atom,
  Server,
  Zap,
  FileCode2,
  Network,
  Brain,
  Flame,
  MessageSquare,
  Table,
  Grid3X3,
  Search,
  BarChart,
  Layers,
  Sun,
  Moon,
  Truck,
  Compass,
  Scale,
  Sparkles,
  Globe,
  FileText,
  MapPin
} from "lucide-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const techLogosRow1 = [
  { node: <SiPython />, title: "Python", href: "https://www.python.org" },
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiFastapi />, title: "FastAPI", href: "https://fastapi.tiangolo.com" },
  { node: <SiDjango />, title: "Django", href: "https://www.djangoproject.com" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { node: <SiNodedotjs />, title: "Node.js", href: "https://nodejs.org" },
  { node: <SiPostgresql />, title: "PostgreSQL", href: "https://www.postgresql.org" },
  { node: <SiSupabase />, title: "Supabase", href: "https://supabase.com" },
  { node: <SiPrisma />, title: "Prisma", href: "https://www.prisma.io" },
];

const techLogosRow2 = [
  { node: <SiLangchain />, title: "LangChain", href: "https://www.langchain.com" },
  { node: <SiPytorch />, title: "PyTorch", href: "https://pytorch.org" },
  { node: <SiTensorflow />, title: "TensorFlow", href: "https://www.tensorflow.org" },
  { node: <SiScikitlearn />, title: "Scikit-Learn", href: "https://scikit-learn.org" },
  { node: <SiPandas />, title: "Pandas", href: "https://pandas.pydata.org" },
  { node: <SiNumpy />, title: "NumPy", href: "https://numpy.org" },
  { node: <SiDocker />, title: "Docker", href: "https://www.docker.com" },
  { node: <SiRedis />, title: "Redis", href: "https://redis.io" },
  { node: <SiLinux />, title: "Linux", href: "https://www.kernel.org" },
  { node: <SiGit />, title: "Git", href: "https://git-scm.com" },
  { node: <SiGithub />, title: "GitHub", href: "https://github.com" },
];

const techLogos = [...techLogosRow1, ...techLogosRow2];

interface LeetCodeData {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  ranking: number;
  submissionCalendar: Record<string, number>;
}

function LeetCodeStats({ glowColor }: { glowColor: string }) {
  const [data, setData] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Keep LeetCode API directly in code
    axios.get("https://leetcode-api-faisalshohag.vercel.app/rQc2d1FK7A")
      .then(res => {
        if (res.data && typeof res.data.totalSolved === "number") {
          setData(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch LeetCode stats:", err);
        setLoading(false);
      });
  }, []);

  const streakInfo = useMemo(() => {
    if (!data?.submissionCalendar) return { current: 0, max: 0, activeDays: 0 };
    
    const timestamps = Object.keys(data.submissionCalendar)
      .map(t => parseInt(t))
      .sort((a, b) => a - b);
      
    if (timestamps.length === 0) return { current: 0, max: 0, activeDays: 0 };

    const activeDays = timestamps.length;
    
    // Sort dates
    const dates = timestamps.map(t => format(new Date(t * 1000), 'yyyy-MM-dd'));
    const uniqueDates = [...new Set(dates)].sort();

    let maxStreak = 0;
    let currentStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const prev = parseISO(uniqueDates[i-1]);
      const curr = parseISO(uniqueDates[i]);
      const diff = differenceInDays(curr, prev);
      
      if (diff === 1) {
        tempStreak++;
      } else {
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 1;
      }
    }
    maxStreak = Math.max(maxStreak, tempStreak);

    // Current streak
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');
    
    const lastActiveDate = uniqueDates[uniqueDates.length - 1];
    if (lastActiveDate === todayStr || lastActiveDate === yesterdayStr) {
      let cs = 1;
      for (let i = uniqueDates.length - 1; i > 0; i--) {
        const curr = parseISO(uniqueDates[i]);
        const prev = parseISO(uniqueDates[i-1]);
        const diff = differenceInDays(curr, prev);
        if (diff === 1) {
          cs++;
        } else {
          break;
        }
      }
      currentStreak = cs;
    }

    return { current: currentStreak, max: maxStreak, activeDays };
  }, [data]);

  if (loading) return (
    <div className="h-[220px] flex items-center justify-center bg-surface border border-border-subtle">
      <Loader2 className="animate-spin text-primary" />
    </div>
  );

  return (
    <MagicCard 
      className="bg-surface p-8 border border-border-subtle flex flex-col group relative"
      glowColor={glowColor}
    >
      <div className="flex justify-between items-start mb-6 relative z-20">
        <div>
          <h3 className="text-text-primary text-lg font-bold mb-1">LeetCode Progress</h3>
          <a 
            href="https://leetcode.com/u/rQc2d1FK7A/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-text-tertiary text-xs uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1 font-mono"
          >
            rQc2d1FK7A
          </a>
        </div>
        <a 
          href="https://leetcode.com/u/rQc2d1FK7A/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 group p-1"
          title="Visit LeetCode Profile"
        >
          <svg viewBox="0 0 94 111" width="22" height="22" className="text-text-tertiary group-hover:text-primary transition-colors fill-current">
            <path d="M67.5068 83.0664C70.0005 80.5764 74.0371 80.5829 76.5228 83.0809C79.0085 85.579 79.002 89.6226 76.5083 92.1127L65.4351 103.17C55.2192 113.371 38.5605 113.519 28.1723 103.513C28.1122 103.456 23.4866 98.9201 8.22703 83.957C-1.92478 74.0029 -2.93615 58.0749 6.61698 47.8464L24.4287 28.7745C33.91 18.6219 51.3874 17.5122 62.228 26.2789L78.4053 39.362C81.1449 41.5776 81.5728 45.5985 79.3611 48.3429C77.1493 51.0873 73.1355 51.5159 70.3959 49.3003L54.2187 36.2173C48.5493 31.6325 38.6319 32.2622 33.7399 37.5006L15.9279 56.5727C11.2772 61.5522 11.7866 69.574 17.1461 74.8292C28.3515 85.8169 36.9874 94.2846 36.9974 94.2942C42.3982 99.496 51.1309 99.4184 56.4336 94.1234L67.5068 83.0664Z" />
            <path d="M40.607 72.0014C37.086 72.0014 34.2317 69.1421 34.2317 65.615C34.2317 62.0879 37.086 59.2286 40.607 59.2286L87.6247 59.2286C91.1457 59.2286 94 62.0879 94 65.615C94 69.1421 91.1457 72.0014 87.6247 72.0014L40.607 72.0014Z" />
            <path d="M49.4124 2.02335C51.8179 -0.55232 55.8523 -0.686894 58.4235 1.72277C60.9946 4.13244 61.129 8.17385 58.7235 10.7495L15.9282 56.5729C11.2774 61.552 11.7867 69.5738 17.1459 74.8292L36.9094 94.2091C39.4256 96.6764 39.4686 100.72 37.0056 103.24C34.5426 105.761 30.5063 105.804 27.9901 103.337L8.22654 83.9567C-1.92467 74.0021 -2.93604 58.0741 6.61752 47.8463L49.4124 2.02335Z" />
          </svg>
        </a>
      </div>
      
      {data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Solved Card */}
            <div className="p-4 bg-background border border-border-subtle flex items-center gap-4">
              <div className="w-16 h-16 border-2 border-primary/30 flex items-center justify-center bg-surface shrink-0">
                <div className="text-center">
                  <div className="text-xl font-bold text-text-primary leading-none">{data.totalSolved}</div>
                  <div className="text-[9px] uppercase tracking-wider text-text-tertiary mt-1 font-bold">Solved</div>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-text-tertiary uppercase tracking-wider font-bold">Total Solved</div>
                <div className="text-xs text-text-secondary mt-0.5">
                  out of {data.totalQuestions}
                </div>
                <div className="text-[11px] font-mono text-primary font-semibold mt-1">
                  {((data.totalSolved / (data.totalQuestions || 1)) * 100).toFixed(1)}% Solved
                </div>
              </div>
            </div>

            {/* Easy Card */}
            <div className="p-4 bg-background border border-border-subtle flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <span className="text-emerald-500 font-bold text-xs uppercase tracking-wider">Easy</span>
                <span className="text-xs font-mono font-bold text-text-primary">{data.easySolved} <span className="text-text-tertiary font-normal">/ {data.totalEasy}</span></span>
              </div>
              <div className="w-full bg-surface h-2 border border-border-subtle overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500" 
                  style={{ width: `${data.totalEasy ? Math.min(100, (data.easySolved / data.totalEasy) * 100) : 0}%` }}
                />
              </div>
              <div className="text-[10px] text-text-tertiary mt-2">
                {data.totalEasy ? ((data.easySolved / data.totalEasy) * 100).toFixed(1) : 0}% completed
              </div>
            </div>

            {/* Medium Card */}
            <div className="p-4 bg-background border border-border-subtle flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <span className="text-amber-500 font-bold text-xs uppercase tracking-wider">Medium</span>
                <span className="text-xs font-mono font-bold text-text-primary">{data.mediumSolved} <span className="text-text-tertiary font-normal">/ {data.totalMedium}</span></span>
              </div>
              <div className="w-full bg-surface h-2 border border-border-subtle overflow-hidden">
                <div 
                  className="bg-amber-500 h-full transition-all duration-500" 
                  style={{ width: `${data.totalMedium ? Math.min(100, (data.mediumSolved / data.totalMedium) * 100) : 0}%` }}
                />
              </div>
              <div className="text-[10px] text-text-tertiary mt-2">
                {data.totalMedium ? ((data.mediumSolved / data.totalMedium) * 100).toFixed(1) : 0}% completed
              </div>
            </div>

            {/* Hard Card */}
            <div className="p-4 bg-background border border-border-subtle flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <span className="text-rose-500 font-bold text-xs uppercase tracking-wider">Hard</span>
                <span className="text-xs font-mono font-bold text-text-primary">{data.hardSolved} <span className="text-text-tertiary font-normal">/ {data.totalHard}</span></span>
              </div>
              <div className="w-full bg-surface h-2 border border-border-subtle overflow-hidden">
                <div 
                  className="bg-rose-500 h-full transition-all duration-500" 
                  style={{ width: `${data.totalHard ? Math.min(100, (data.hardSolved / data.totalHard) * 100) : 0}%` }}
                />
              </div>
              <div className="text-[10px] text-text-tertiary mt-2">
                {data.totalHard ? ((data.hardSolved / data.totalHard) * 100).toFixed(1) : 0}% completed
              </div>
            </div>
          </div>

          {/* Lower Row: Streaks & Global Rank */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border-subtle">
            <div className="text-center p-3 bg-background border border-border-subtle">
              <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1 font-bold">Daily Streak</div>
              <div className="text-base font-bold text-primary font-mono">{streakInfo.current}d</div>
            </div>
            <div className="text-center p-3 bg-background border border-border-subtle">
              <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1 font-bold">Max Streak</div>
              <div className="text-base font-bold text-primary font-mono">{streakInfo.max}d</div>
            </div>
            <div className="text-center p-3 bg-background border border-border-subtle">
              <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1 font-bold">Active Days</div>
              <div className="text-base font-bold text-primary font-mono">{streakInfo.activeDays}d</div>
            </div>
            <div className="text-center p-3 bg-background border border-border-subtle flex flex-col justify-center items-center">
              <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1 font-bold flex items-center gap-1">
                <Trophy size={11} className="text-primary" /> Global Rank
              </div>
              <div className="text-sm font-bold text-text-primary font-mono">#{data.ranking.toLocaleString()}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 flex items-center justify-center text-text-tertiary italic text-sm text-center">
          Failed to load stats.<br/>The API might be down.
        </div>
      )}
    </MagicCard>
  );
}

function GitHubActivity({ glowColor }: { glowColor: string }) {
  const currentYear = new Date().getFullYear();
  const years = [2026, 2025, 2024, 2023];
  const [selectedYear, setSelectedYear] = useState(years[0]);

  return (
    <MagicCard 
      className="bg-surface p-8 border border-border-subtle flex flex-col group relative"
      glowColor={glowColor}
    >
      <div className="flex justify-between items-start mb-6 relative z-20">
        <div>
          <h3 className="text-text-primary text-lg font-bold mb-1">GitHub Activity</h3>
          <a 
            href="https://github.com/OmChauhan07" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-text-tertiary text-xs uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1"
          >
            OmChauhan07 <ExternalLink size={10} />
          </a>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="appearance-none bg-background border border-border-subtle text-text-primary text-[10px] font-bold py-1.5 pl-3 pr-8 focus:outline-none focus:border-primary transition-colors cursor-pointer h-8 block"
            >
              {years.map(y => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-tertiary">
              <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <a 
            href="https://github.com/OmChauhan07" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 group"
          >
            <Github size={20} className="text-text-tertiary group-hover:text-primary transition-colors" />
          </a>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center min-h-[220px] p-4 bg-background border border-border-subtle">
        <div className="overflow-x-auto overflow-y-hidden custom-scrollbar pb-2">
          <div className="min-w-[700px]">
            <GitHubCalendar 
            username="OmChauhan07" 
            year={selectedYear === currentYear ? undefined : selectedYear}
            fontSize={12}
            blockSize={11}
            blockMargin={4}
            colorScheme="light"
            theme={{
               light: ['#EBEDF0', '#9BE9A8', '#40C463', '#30A14E', '#216E39'],
            }}
            hideColorLegend
            showWeekdayLabels
            renderBlock={(block, activity) => 
              React.cloneElement(block as React.ReactElement, {
                'data-tooltip-id': 'gh-tooltip',
                'data-tooltip-content': `${activity.count} contributions on ${activity.date}`,
              })
            }
          />
          <Tooltip id="gh-tooltip" style={{ borderRadius: '0', fontSize: '11px', backgroundColor: '#1A1A1A', color: 'white' }} />
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-text-tertiary uppercase tracking-widest font-bold">
          <div className="flex items-center gap-4">
             <span>Less</span>
             <div className="flex gap-1">
               {['#EBEDF0', '#9BE9A8', '#40C463', '#30A14E', '#216E39'].map(c => (
                 <div key={c} className="w-3 h-3" style={{ backgroundColor: c }} />
               ))}
             </div>
             <span>More</span>
          </div>
          <div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1 border border-primary/20">
            <CalendarDays size={12} />
            <span>Activity Record • {selectedYear}</span>
          </div>
        </div>
      </div>
    </MagicCard>
  );
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [hasEntered, setHasEntered] = useState(false);
  
  // Transition into content when scrolled
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      if (latest > 50 && !hasEntered) {
        setHasEntered(true);
      }
    });
    return () => unsubscribe();
  }, [scrollY, hasEntered]);

  const activityRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)';
  const gridHoverColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.04)';
  const glowColor = theme === 'dark' ? '255, 255, 255' : '0, 0, 0';

  return (
    <div ref={containerRef} className={`bg-background relative transition-colors duration-300 ${!hasEntered ? 'min-h-[110vh]' : ''}`}>
      <AnimatePresence mode="wait">
        {!hasEntered && (
          <motion.div 
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background overflow-hidden"
          >
            <div className="absolute inset-0 z-0 opacity-40">
              <ShapeGrid 
                speed={0.1} 
                squareSize={80}
                direction='diagonal'
                borderColor={gridColor}
                hoverFillColor={gridHoverColor}
                shape='square'
                hoverTrailAmount={5}
              />
            </div>
            
            <div className="relative z-10 text-center px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="text-6xl sm:text-8xl md:text-9xl font-display font-bold tracking-tighter text-text-primary px-4 border-l-4 border-primary">
                  <TextType 
                    text={["Om Chauhan"]}
                    typingSpeed={100}
                    loop={false}
                    showCursor={true}
                    cursorCharacter="_"
                  />
                </h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 0.6, duration: 1 }}
                  className="text-[10px] uppercase tracking-[0.5em] mt-8 font-bold text-text-tertiary"
                >
                  Scroll Down
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div 
        initial={false}
        animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0.05, y: 20 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className={hasEntered ? "min-h-screen" : "h-screen overflow-hidden"}>
          {/* Background Grid */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <ShapeGrid 
          speed={0.2} 
          squareSize={50}
          direction='diagonal'
          borderColor={gridColor}
          hoverFillColor={gridHoverColor}
          shape='square'
          hoverTrailAmount={10}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border-subtle z-50">
        <div className="max-w-[1024px] mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="font-display font-bold text-xl tracking-tight">Om Chauhan</a>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#work" className="text-sm font-medium hover:text-primary transition-colors">Work</a>
            <a href="#skills" className="text-sm font-medium hover:text-primary transition-colors">Skills</a>
            <a href="#experience" className="text-sm font-medium hover:text-primary transition-colors">Experience</a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
            <a 
              href="/Om.pdf" 
              download="Om.pdf"
              className="bg-tertiary text-background px-4 py-2 text-sm font-semibold tracking-wide hover:bg-primary transition-colors inline-block"
            >
              Resume
            </a>
            
            <AnimatedThemeToggler 
              theme={theme}
              onThemeChange={(newTheme) => setTheme(newTheme)}
              className="p-2 ml-2 bg-surface border border-border-subtle hover:border-primary transition-colors text-text-primary cursor-pointer"
              duration={450}
            />
          </div>
        </div>
      </nav>
      <ScrollProgress className="top-[64px] bg-neutral-900 dark:bg-white" />

      <main className="max-w-[1024px] mx-auto px-6 pt-32 pb-huge">
        {/* Hero Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="max-w-3xl mb-huge"
        >
          <BlurText
            text="Hi, I'm Om Chauhan."
            delay={150}
            animateBy="words"
            direction="top"
            className="text-5xl md:text-6xl lg:text-7xl mb-8 leading-[1.1] font-display font-bold"
          />
          <p className="text-xl text-text-secondary mb-10 max-w-2xl leading-relaxed">
            B.Tech Information Technology student & 3x national hackathon finalist with hands-on experience building full-stack applications, AI-powered systems, and data-driven solutions using Python, FastAPI, React, SQL, and generative AI.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <a href="#work" className="btn-primary flex items-center gap-2">
              View Work <ChevronRight size={18} />
            </a>
            <a 
              href="/Om_Chauhan_Resume.pdf" 
              download="Om_Chauhan_Resume.pdf"
              className="btn-secondary flex items-center gap-2"
            >
              <FileText size={18} /> Download Resume
            </a>
            <a href="#contact" className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors px-2 py-3">
              Get in Touch
            </a>
          </div>
        </motion.section>

        <hr className="section-divider" />

        {/* Activity Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="mb-huge relative"
          id="activity"
          ref={activityRef}
        >
          <GlobalSpotlight sectionRef={activityRef} glowColor={glowColor} />
          <h2 className="text-3xl mb-12">Live Activity</h2>
          <div className="flex flex-col gap-8">
            <GitHubActivity glowColor={glowColor} />
            <LeetCodeStats glowColor={glowColor} />
          </div>
        </motion.section>

        <hr className="section-divider" />

        {/* Skills Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="mb-huge relative"
          id="skills"
          ref={skillsRef}
        >
          <GlobalSpotlight sectionRef={skillsRef} glowColor={glowColor} />
          <div className="flex flex-col gap-6 py-4">
            <LogoLoop
              logos={techLogosRow1}
              speed={35}
              direction="left"
              logoHeight={56}
              gap={60}
              hoverSpeed={0}
              scaleOnHover
              fadeOut
              ariaLabel="Skills & Technologies - Row 1"
            />
            <LogoLoop
              logos={techLogosRow2}
              speed={35}
              direction="right"
              logoHeight={56}
              gap={60}
              hoverSpeed={0}
              scaleOnHover
              fadeOut
              ariaLabel="Skills & Technologies - Row 2"
            />
          </div>
        </motion.section>

        <hr className="section-divider" />

        {/* Projects Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="mb-huge relative"
          id="work"
          ref={projectsRef}
        >
          <GlobalSpotlight sectionRef={projectsRef} glowColor={glowColor} />
          <h2 className="text-3xl mb-12">Selected Projects</h2>

          <ScrollStack offset={96} itemDistance={28}>
            {[
              {
                title: "TransitOps",
                category: "Fleet Management & Operations",
                tags: "React • Vite • Node.js • Express • Prisma • Neon PostgreSQL • Recharts",
                desc: "An end-to-end transport operations and fleet management platform that digitizes vehicle & driver registries, trip dispatching, maintenance ticketing, and expense auditing while enforcing strict operational business rules and calculating fleet ROI through real-time KPI analytics.",
                highlights: [
                  "Role-Based Access Control (Fleet Manager, Driver, Safety Officer, Financial Analyst) with email OTP verification.",
                  "Trip Dispatch Board automatically managing vehicle & driver availability constraints.",
                  "Comprehensive maintenance tickets & fuel tracking to calculate true operational costs.",
                  "Executive KPI analytics dashboard with Revenue vs. Cost charts and CSV export."
                ],
                icon: <Truck className="text-primary" size={32} />,
                image: "/projects/transitops.svg",
                url: "https://github.com/OmChauhan07/TransitOps.git",
                liveUrl: "https://transit-ops-peach.vercel.app"
              },
              {
                title: "GlobeTrotter",
                category: "Multi-City Travel & Discovery",
                tags: "React 19 • Vite • Django REST Framework • Neon PostgreSQL • @dnd-kit • Recharts • Geoapify",
                desc: "A modern multi-city travel planning platform designed to make itinerary creation, attraction discovery, and budget analytics visual and effortless. Features drag-and-drop schedule reordering, multi-view calendar/timeline matrices, and public itinerary cloning.",
                highlights: [
                  "Interactive multi-city itinerary builder with arrival/departure boundary validation and drag-and-drop reordering.",
                  "Geoapify Places API discovery engine with resilient server-side caching and offline curated catalog fallback.",
                  "Server-authoritative budget engine with Recharts category spend donuts and daily expense alerts.",
                  "Multi-view matrices (Timeline, Calendar grid, and List) plus public itinerary sharing and 1-click duplication."
                ],
                icon: <Compass className="text-primary" size={32} />,
                image: "/projects/globetrotter.svg",
                url: "https://github.com/OmChauhan07/GlobeTrotter.git",
                liveUrl: "https://globetrotter-demo.vercel.app/"
              },
              {
                title: "Urban Furniture Accounting System",
                category: "Enterprise Financial Ledger",
                tags: "React 19 • Vite • Django 5.2 • DRF • Neon PostgreSQL • SimpleJWT • Swagger/OpenAPI",
                desc: "An enterprise-grade full-stack double-entry accounting application engineered for bespoke furniture manufacturers. Enforces strict mathematical ledger invariants (Σ Debits == Σ Credits) with zero cached balances and real-time aggregated financial statements.",
                highlights: [
                  "Double-entry core invariant engine: all financial statements aggregate directly from posted JournalItem records in real-time.",
                  "Complete AP/AR cycle: automated Sales Orders to Customer Invoices and Purchase Orders to Vendor Bills.",
                  "Dynamic real-time Balance Sheet, Profit & Loss, Trial Balance, General Ledger, and aged partner balance reports.",
                  "Multi-role security with scoped client/vendor portals preventing cross-tenant data access."
                ],
                icon: <Scale className="text-primary" size={32} />,
                image: "/projects/urban-furniture.svg",
                url: "https://github.com/OmChauhan07/Urban-Furniture-Accounting-System.git"
              },
              {
                title: "DocuMind",
                category: "Generative AI & Autonomous Documentation",
                tags: "React • Tailwind CSS • Python • CrewAI • Google Gemini • DOCX/PDF Pipeline",
                desc: "An AI-powered smart documentation platform that automates publication-ready technical report generation from source code, Jupyter notebooks, datasets, and project files using CrewAI multi-agent orchestration backed by Google Gemini models with DOCX and PDF export pipelines.",
                highlights: [
                  "Multi-agent AI orchestration (CrewAI) executing source analysis, synthesis, structured drafting, and quality review.",
                  "End-to-end processing pipeline accepting Python scripts, notebooks, datasets, and unstructured documentation.",
                  "Publication-ready document generation with structured sections (Executive Summary, Methodology, Results).",
                  "High-fidelity styled exports into formatted DOCX and PDF deliverables."
                ],
                icon: <Sparkles className="text-primary" size={32} />,
                image: "/projects/documind.svg",
                url: "https://github.com/OmChauhan07/DocuMind.git"
              }
            ].map((project, idx) => (
              <ScrollStackItem key={idx}>
                <div className="flex flex-col">
                  {project.image && (
                    <a
                      href={'liveUrl' in project && project.liveUrl ? project.liveUrl : project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full relative h-48 sm:h-64 md:h-72 border-b border-border-subtle bg-background overflow-hidden group cursor-pointer"
                      title={`Open ${project.title}`}
                    >
                      <img
                        src={project.image}
                        alt={`${project.title} Preview`}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface/60 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-background/85 backdrop-blur-md px-3 py-1.5 text-xs font-mono font-semibold flex items-center gap-1.5 border border-border-subtle text-text-primary shadow-lg">
                        <span>Open Project</span>
                        <ExternalLink size={12} />
                      </div>
                    </a>
                  )}
                  <div className="p-8 md:p-10 flex flex-col lg:flex-row gap-8 items-start justify-between">
                  <div className="w-full lg:w-1/3 shrink-0 flex flex-col justify-between">
                    <div>
                      <div className="w-14 h-14 bg-background border border-border-subtle flex items-center justify-center mb-5">
                        {project.icon}
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-bold text-primary">
                        {project.category}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary mt-2 mb-3">
                        {project.title}
                      </h3>
                      <p className="text-[11px] text-text-secondary uppercase tracking-wider font-mono font-semibold mb-6">
                        {project.tags}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-border-subtle">
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2"
                      >
                        <Github size={15} /> GitHub <ChevronRight size={14} />
                      </a>
                      {'liveUrl' in project && project.liveUrl && (
                        <a 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-1.5"
                        >
                          Live Demo <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="w-full lg:w-2/3 lg:border-l lg:border-border-subtle lg:pl-8 space-y-6">
                    <div>
                      <h4 className="text-xs uppercase font-mono tracking-widest text-text-tertiary mb-2 font-bold">Overview</h4>
                      <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                        {project.desc}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs uppercase font-mono tracking-widest text-text-tertiary mb-3 font-bold">Key Architectural Highlights</h4>
                      <div className="grid grid-cols-1 gap-2.5">
                        {project.highlights.map((item, hIdx) => (
                          <div key={hIdx} className="text-xs md:text-sm text-text-secondary flex items-start gap-2.5 bg-background/50 border border-border-subtle p-3">
                            <span className="text-primary font-bold mt-0.5">•</span>
                            <span className="leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollStackItem>
            ))}
          </ScrollStack>
        </motion.section>

        <hr className="section-divider" />

        {/* Experience & Education Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="mb-huge relative"
          id="experience"
          ref={experienceRef}
        >
          <GlobalSpotlight sectionRef={experienceRef} glowColor={glowColor} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl mb-12">Experience</h2>
              <div className="space-y-8">
                <MagicCard className="relative pl-8 border-l border-border-subtle p-6 bg-surface" glowColor={glowColor}>
                  <div className="absolute left-0 top-0 w-[5px] h-full bg-primary" />
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-bold">Data Analysis Intern</h3>
                    <span className="text-xs text-text-tertiary font-mono">MAY 2026 – JUNE 2026</span>
                  </div>
                  <p className="text-primary font-bold text-sm mb-1">Elevance Skills</p>
                  <p className="text-[11px] text-text-tertiary font-mono mb-3">NumPy • Pandas • Matplotlib • Seaborn • Plotly • Streamlit</p>
                  <ul className="text-sm text-text-secondary space-y-2 leading-relaxed">
                    <li>• Cleaned and analyzed operational data, building Pandas/Streamlit dashboards to visualize trends and surface key insights for the team.</li>
                  </ul>
                </MagicCard>

                <MagicCard className="relative pl-8 border-l border-border-subtle p-6 bg-surface" glowColor={glowColor}>
                  <div className="absolute left-0 top-0 w-[5px] h-full bg-primary" />
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-bold">Data Science Intern</h3>
                    <span className="text-xs text-text-tertiary font-mono">APR 2025 – MAY 2025</span>
                  </div>
                  <p className="text-primary font-bold text-sm mb-1">Cognifyz Technologies</p>
                  <p className="text-[11px] text-text-tertiary font-mono mb-3">NumPy • Pandas • Matplotlib • Seaborn • Scikit-learn</p>
                  <ul className="text-sm text-text-secondary space-y-2 leading-relaxed">
                    <li>• Cleaned and preprocessed large-scale datasets, engineered features, and trained/cross-validated predictive models in Scikit-learn, achieving 85% accuracy.</li>
                  </ul>
                </MagicCard>
              </div>
            </div>
            <div>
              <h2 className="text-3xl mb-12">Education</h2>
              <div className="space-y-8">
                {[
                  {
                    degree: "Bachelor of Technology in Information Technology",
                    school: "Charotar University of Science and Technology (CHARUSAT)",
                    location: "Anand, Gujarat",
                    date: "JULY 2024 – PRESENT",
                    cgpa: "CGPA: 7.14 / 10.00"
                  },
                  {
                    degree: "Diploma in Computer Engineering",
                    school: "D A Degree Engineering and Technology (GTU)",
                    location: "Mahemdavad, Gujarat",
                    date: "MAY 2021 – JUNE 2024",
                    cgpa: "CGPA: 8.00 / 10.00"
                  }
                ].map((edu, idx) => (
                  <MagicCard key={idx} className="flex gap-6 items-start p-6 bg-surface border border-border-subtle" glowColor={glowColor}>
                    <div className="p-3 bg-background border border-border-subtle shrink-0">
                      <GraduationCap size={24} className="text-primary" />
                    </div>
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold leading-snug">{edu.degree}</h3>
                      </div>
                      <p className="text-text-secondary text-sm mb-0.5">{edu.school}</p>
                      <p className="text-xs text-text-tertiary font-mono mb-2">{edu.location} • {edu.date}</p>
                      <p className="text-primary font-bold text-sm font-mono">{edu.cgpa}</p>
                    </div>
                  </MagicCard>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
        <hr className="section-divider" />

        {/* Contact Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="mb-huge relative"
          id="contact"
          ref={contactRef}
        >
          <GlobalSpotlight sectionRef={contactRef} glowColor={glowColor} />
          <div className="max-w-3xl">
            <h2 className="text-4xl mb-4">Let's Connect</h2>
            <p className="text-text-secondary mb-8">Currently open for new opportunities or collaborations. Feel free to reach out via direct channels or send a message below.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <a 
                href="mailto:odchauhan0702@gmail.com"
                className="p-4 bg-surface border border-border-subtle hover:border-primary transition-colors flex items-center gap-3 group"
              >
                <div className="p-2.5 bg-primary/10 text-primary shrink-0 group-hover:scale-105 transition-transform">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary">Email</div>
                  <div className="text-xs font-mono font-semibold text-text-primary truncate">odchauhan0702@gmail.com</div>
                </div>
              </a>

              <div className="p-4 bg-surface border border-border-subtle flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 text-primary shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary">Location</div>
                  <div className="text-xs font-semibold text-text-primary">Mahemdavad, Gujarat</div>
                </div>
              </div>
            </div>

            <MagicCard className="p-10 bg-surface border border-border-subtle" glowColor={glowColor}>
              <div id="contact-success" className="hidden flex flex-col items-center justify-center text-center py-10 space-y-6">
                <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full">
                  <Mail size={32} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-text-secondary">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                </div>
                <button 
                  onClick={() => {
                    const success = document.getElementById('contact-success');
                    const form = document.getElementById('contact-form');
                    if (success && form) {
                      success.classList.add('hidden');
                      form.classList.remove('hidden');
                    }
                  }}
                  className="btn-secondary"
                >
                  Send Another
                </button>
              </div>

              <form 
                id="contact-form"
                className="space-y-8 relative z-20" 
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  const name = formData.get('name') || '';
                  const email = formData.get('email') || '';
                  const message = formData.get('message') || '';
                  
                  // Direct to email (Gmail/default email client)
                  const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
                  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
                  window.location.href = `mailto:odchauhan0702@gmail.com?subject=${subject}&body=${body}`;
                  
                  // Show success state
                  const success = document.getElementById('contact-success');
                  if (success) {
                    form.classList.add('hidden');
                    success.classList.remove('hidden');
                    form.reset();
                  }
                }}
              >
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-text-secondary uppercase">Name</label>
                  <input 
                    name="name"
                    type="text" 
                    required
                    className="w-full bg-background border border-border-medium px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-text-secondary uppercase">Mail</label>
                  <input 
                    name="email"
                    type="email" 
                    required
                    className="w-full bg-background border border-border-medium px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="Email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-text-secondary uppercase">Message</label>
                  <textarea 
                    name="message"
                    rows={4} 
                    required
                    className="w-full bg-background border border-border-medium px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="message"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <button 
                    type="submit" 
                    className="btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Send Message
                  </button>
                  <a 
                    href="/Om_Chauhan_Resume.pdf" 
                    download="Om_Chauhan_Resume.pdf"
                    className="text-xs font-semibold text-text-tertiary hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    <FileText size={14} /> Download Resume (PDF)
                  </a>
                </div>
              </form>
            </MagicCard>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-background">
        <div className="max-w-[1024px] mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-sm text-text-tertiary">© 2026 Om Chauhan. Mahemdavad, Gujarat, India.</p>
          <div className="flex flex-wrap gap-8 items-center">
            <a 
              href="/Om_Chauhan_Resume.pdf" 
              download="Om_Chauhan_Resume.pdf"
              className="text-text-secondary hover:text-primary transition-colors flex items-center gap-1.5 text-sm font-semibold tracking-wide"
            >
              <FileText size={16} /> Resume
            </a>
            <a href="https://www.linkedin.com/in/om-chauhan-21043824b/" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 text-sm font-semibold tracking-wide">
              <Linkedin size={16} /> LinkedIn
            </a>
            <a href="https://github.com/OmChauhan07" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 text-sm font-semibold tracking-wide">
              <Github size={16} /> GitHub
            </a>
            <a href="mailto:odchauhan0702@gmail.com" className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 text-sm font-semibold tracking-wide">
              <Mail size={16} /> Email
            </a>
          </div>
        </div>
      </footer>
        </div>
      </motion.div>
    </div>
  );
}
