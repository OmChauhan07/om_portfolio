import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import React, { useState, useEffect, useMemo, cloneElement, useRef } from "react";
import BlurText from "./components/BlurText";
import TextType from "./components/TextType";
import { MagicCard, GlobalSpotlight } from "./components/MagicCard";
import ShapeGrid from "./components/ShapeGrid";
import { GitHubCalendar } from "react-github-calendar";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { format, startOfYear, endOfYear, subDays, differenceInDays, parseISO } from "date-fns";
import axios from "axios";
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code2, 
  BrainCircuit, 
  BarChart3, 
  Smartphone,
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
  Moon
} from "lucide-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

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
    // Using a more reliable LeetCode stats API
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

  const heatmapValues = useMemo(() => {
    if (!data?.submissionCalendar) return [];
    return Object.entries(data.submissionCalendar).map(([timestamp, count]) => ({
      date: format(new Date(parseInt(timestamp) * 1000), "yyyy-MM-dd"),
      count: count
    }));
  }, [data]);

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
    <div className="h-[430px] flex items-center justify-center bg-surface border border-border-subtle">
      <Loader2 className="animate-spin text-primary" />
    </div>
  );

  const currentYear = new Date().getFullYear();

  return (
    <MagicCard 
      className="bg-surface p-8 border border-border-subtle h-full flex flex-col group relative"
      glowColor={glowColor}
    >
      <div className="flex justify-between items-start mb-8 relative z-20">
        <div>
          <h3 className="text-text-primary text-lg font-bold mb-1">LeetCode Progress</h3>
          <a 
            href="https://leetcode.com/u/rQc2d1FK7A/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-text-tertiary text-xs uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1"
          >
            rQc2d1FK7A <ExternalLink size={10} />
          </a>
        </div>
        <Terminal size={20} className="text-text-tertiary" />
      </div>
      
      {data ? (
        <>
          <div className="flex items-center gap-8 mb-8">
            <div className="relative w-28 h-28 border-4 border-border-subtle flex items-center justify-center bg-background">
              <div className="text-center group-hover:scale-110 transition-transform">
                <div className="text-xl font-bold text-text-primary leading-none">{data.totalSolved}</div>
                <div className="text-[10px] uppercase text-text-tertiary mt-1">Solved</div>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-cyan-600 font-medium">Easy</span>
                <span className="text-text-primary font-mono">{data.easySolved}/{data.totalEasy}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-yellow-600 font-medium">Medium</span>
                <span className="text-text-primary font-mono">{data.mediumSolved}/{data.totalMedium}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-red-600 font-medium">Hard</span>
                <span className="text-text-primary font-mono">{data.hardSolved}/{data.totalHard}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center min-h-[220px] p-4 bg-background border border-border-subtle mb-8">
            <div className="overflow-x-auto overflow-y-hidden custom-scrollbar pb-2">
              <div className="min-w-[700px]">
                <CalendarHeatmap
                  startDate={startOfYear(new Date())}
                endDate={endOfYear(new Date())}
                values={heatmapValues}
                gutterSize={4}
                showWeekdayLabels={true}
                classForValue={(value) => {
                  if (!value) return 'color-empty';
                  return `color-scale-${Math.min(value.count, 4)}`;
                }}
                tooltipDataAttrs={(value: any) => {
                  if (!value || !value.date) return { 'data-tooltip-id': 'leetcode-tooltip', 'data-tooltip-content': 'No submissions' };
                  return {
                    'data-tooltip-id': 'leetcode-tooltip',
                    'data-tooltip-content': `${value.count} submissions on ${value.date}`,
                  };
                }}
              />
              <Tooltip id="leetcode-tooltip" style={{ borderRadius: '0', fontSize: '11px', backgroundColor: '#1A1A1A', color: 'white' }} />
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
                <span>Activity Record • {currentYear}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-6 border-t border-border-subtle">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-2 bg-background border border-border-subtle">
                <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1">Daily Streak</div>
                <div className="text-sm font-bold text-primary">{streakInfo.current}d</div>
              </div>
              <div className="text-center p-2 bg-background border border-border-subtle">
                <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1">Max Streak</div>
                <div className="text-sm font-bold text-primary">{streakInfo.max}d</div>
              </div>
              <div className="text-center p-2 bg-background border border-border-subtle">
                <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1">Active Days</div>
                <div className="text-sm font-bold text-primary">{streakInfo.activeDays}d</div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-8 h-8 border border-primary/30 flex items-center justify-center bg-background">
                    <Trophy size={14} className="text-primary" />
                  </div>
                ))}
              </div>
              <div className="text-right">
                <div className="text-[10px] text-text-tertiary uppercase tracking-wider">Ranking</div>
                <div className="text-xs font-mono text-text-primary">#{data.ranking.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-text-tertiary italic text-sm text-center">
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
          <div className="flex bg-background border border-border-subtle p-1 h-8">
            {years.map(y => (
              <button 
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-3 text-[10px] font-bold transition-colors ${selectedYear === y ? 'bg-primary text-background' : 'text-text-tertiary hover:text-text-primary'}`}
              >
                {y}
              </button>
            ))}
          </div>
          <Github size={20} className="text-text-tertiary" />
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
              href="https://drive.google.com/file/d/1BxtvmVCzSOm9cmZkN79Yy2S1jrIHU9Cp/view?usp=sharing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-tertiary text-background px-4 py-2 text-sm font-semibold tracking-wide hover:bg-primary transition-colors inline-block"
            >
              Resume
            </a>
            
            <button 
              onClick={toggleTheme}
              className="p-2 ml-2 bg-surface border border-border-subtle hover:border-primary transition-colors text-text-primary"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>
      </nav>

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
          <p className="text-xl text-text-secondary mb-10 max-w-2xl">
            I specialize in building AI-powered analytics systems using Python, SQL, and modern visualization tools. Currently focused on ML engineering and scalable data workflows.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#work" className="btn-primary flex items-center gap-2">
              View Work <ChevronRight size={18} />
            </a>
            <a href="#contact" className="btn-secondary">Get in Touch</a>
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
          <h2 className="text-3xl mb-12">Skills & Disciplines</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MagicCard className="card-default group" glowColor={glowColor}>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                  <Code2 size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold">Web & Mobile</h3>
              </div>
              <p className="text-sm text-text-secondary mb-8 leading-relaxed">
                Building robust, responsive interfaces using Flutter, React, and modern backend stacks like Node.js.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: "REACT", icon: <Atom size={14} />, color: "text-[#61DAFB]" },
                  { name: "NODE.JS", icon: <Server size={14} />, color: "text-[#339933]" },
                  { name: "FLUTTER", icon: <Layers size={14} />, color: "text-[#02569B]" },
                  { name: "DART", icon: <Zap size={14} />, color: "text-[#0175C2]" },
                  { name: "SUPABASE", icon: <Database size={14} />, color: "text-[#3ECF8E]" }
                ].map(skill => (
                  <div key={skill.name} className="flex items-center gap-2 px-3 py-2 border border-border-medium bg-background group/skill hover:border-primary transition-colors">
                    <span className={`${skill.color} filter brightness-90 group-hover/skill:brightness-110 transition-all`}>{skill.icon}</span>
                    <span className="text-[10px] font-bold tracking-widest text-text-primary">{skill.name}</span>
                  </div>
                ))}
              </div>
            </MagicCard>

            <MagicCard className="card-default group" glowColor={glowColor}>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                  <BrainCircuit size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold">AI / ML</h3>
              </div>
              <p className="text-sm text-text-secondary mb-8 leading-relaxed">
                Implementing predictive models and exploring generative AI techniques using Python and industry-standard frameworks.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: "PYTHON", icon: <FileCode2 size={14} />, color: "text-[#3776AB]" },
                  { name: "TENSORFLOW", icon: <Network size={14} />, color: "text-[#FF6F00]" },
                  { name: "SCIKIT-LEARN", icon: <Brain size={14} />, color: "text-[#F7931E]" },
                  { name: "PYTORCH", icon: <Flame size={14} />, color: "text-[#EE4C2C]" },
                  { name: "LLMS", icon: <MessageSquare size={14} />, color: "text-[#FF9900]" }
                ].map(skill => (
                  <div key={skill.name} className="flex items-center gap-2 px-3 py-2 border border-border-medium bg-background group/skill hover:border-primary transition-colors">
                    <span className={`${skill.color} filter brightness-90 group-hover/skill:brightness-110 transition-all`}>{skill.icon}</span>
                    <span className="text-[10px] font-bold tracking-widest text-text-primary">{skill.name}</span>
                  </div>
                ))}
              </div>
            </MagicCard>

            <MagicCard className="card-default group" glowColor={glowColor}>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                  <BarChart3 size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold">Data Science</h3>
              </div>
              <p className="text-sm text-text-secondary mb-8 leading-relaxed">
                Extracting narratives from complex datasets through EDA, statistical analysis, and clean visualizations.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: "PANDAS", icon: <Table size={14} />, color: "text-[#150458]" },
                  { name: "NUMPY", icon: <Grid3X3 size={14} />, color: "text-[#013243]" },
                  { name: "EDA", icon: <Search size={14} />, color: "text-[#00A3E0]" },
                  { name: "SQL", icon: <Database size={14} />, color: "text-[#336791]" },
                  { name: "POWER BI", icon: <BarChart3 size={14} />, color: "text-[#F2C811]" }
                ].map(skill => (
                  <div key={skill.name} className="flex items-center gap-2 px-3 py-2 border border-border-medium bg-background group/skill hover:border-primary transition-colors">
                    <span className={`${skill.color} filter brightness-90 group-hover/skill:brightness-110 transition-all`}>{skill.icon}</span>
                    <span className="text-[10px] font-bold tracking-widest text-text-primary">{skill.name}</span>
                  </div>
                ))}
              </div>
            </MagicCard>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                title: "Restaurant Rating Prediction",
                tags: "Python, Scikit-learn, Pandas",
                desc: "Engineered an end-to-end machine learning pipeline to predict restaurant ratings with high accuracy.",
                icon: <BrainCircuit className="text-primary" size={32} />,
                url: "https://github.com/OmChauhan07/Restaurant-rating-analysis.git"
              },
              {
                title: "LinkHood Social Platform",
                tags: "Flutter, Supabase, PostGIS",
                desc: "Real-time, location-aware social platform featuring geospatial queries and live post sharing.",
                icon: <Smartphone className="text-primary" size={32} />,
                url: "https://github.com/OmChauhan07/LinkHood.git"
              },
              {
                title: "AgriConnect Marketplace",
                tags: "Flutter, Supabase, PostgreSQL",
                desc: "Full-stack mobile marketplace facilitating direct peer-to-peer transactions between farmers and buyers.",
                icon: <Database className="text-primary" size={32} />,
                url: "https://github.com/OmChauhan07/Agri_Connect.git"
              },
              {
                title: "DAO Browser",
                tags: "Electron, Python, Chromium",
                desc: "Decentralized dashboard for exploring and voting on DAO proposals across multiple blockchains.",
                icon: <Terminal className="text-primary" size={32} />,
                url: "https://github.com/Darshanh20/DAO-BROWSER.git"
              }
            ].map((project, idx) => (
              <MagicCard key={idx} className="group p-6 bg-surface border border-border-subtle" glowColor={glowColor}>
                <div className="aspect-video bg-background mb-8 flex items-center justify-center border border-border-subtle group-hover:border-border-medium transition-colors">
                  {project.icon}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl leading-none">{project.title}</h3>
                    <a href={project.url} target="_blank" rel="noopener noreferrer">
                      <Github size={18} className="text-text-tertiary hover:text-primary transition-colors" />
                    </a>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed uppercase tracking-widest font-bold font-body">{project.tags}</p>
                  <p className="text-base text-text-secondary">{project.desc}</p>
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 text-[13px] font-bold tracking-widest text-primary uppercase border-b border-transparent hover:border-primary transition-all"
                  >
                    View Project <ChevronRight size={14} />
                  </a>
                </div>
              </MagicCard>
            ))}
          </div>
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
              <div className="space-y-12">
                <MagicCard className="relative pl-8 border-l border-border-subtle p-6 bg-surface" glowColor={glowColor}>
                  <div className="absolute left-0 top-0 w-[5px] h-full bg-primary" />
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">Data Science Intern</h3>
                    <span className="text-xs text-text-tertiary">APR 2025 – MAY 2025</span>
                  </div>
                  <p className="text-primary font-bold text-sm mb-4">Cognifyz Technologies</p>
                  <ul className="text-sm text-text-secondary space-y-3 leading-relaxed">
                    <li>• Performed EDA on real-world datasets using Pandas and NumPy.</li>
                    <li>• Engineered features and handled missing data for model training.</li>
                    <li>• Built and compared multiple classification/regression models using Scikit-learn.</li>
                  </ul>
                </MagicCard>
              </div>
            </div>
            <div>
              <h2 className="text-3xl mb-12">Education</h2>
              <div className="space-y-8">
                {[
                  {
                    degree: "B.Tech in Information Technology",
                    school: "CHARUSAT",
                    date: "JULY 2024 – CURRENT",
                    cgpa: "CGPA: 6.90"
                  },
                  {
                    degree: "Diploma in Computer Engineering",
                    school: "GTU",
                    date: "MAY 2021 – JUNE 2024",
                    cgpa: "CGPA: 8.00"
                  }
                ].map((edu, idx) => (
                  <MagicCard key={idx} className="flex gap-6 items-start p-6 bg-surface border border-border-subtle" glowColor={glowColor}>
                    <div className="p-3 bg-background border border-border-subtle shrink-0">
                      <GraduationCap size={24} className="text-primary" />
                    </div>
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xl font-bold">{edu.degree}</h3>
                      </div>
                      <p className="text-text-secondary text-sm mb-1">{edu.school} • {edu.date}</p>
                      <p className="text-primary font-bold text-sm">{edu.cgpa}</p>
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
          <div className="max-w-2xl">
            <h2 className="text-4xl mb-4">Let's Connect</h2>
            <p className="text-text-secondary mb-12">Currently open for new opportunities or collaborations. Feel free to reach out via the form below or professional networks.</p>
            
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
                <button 
                  type="submit" 
                  className="btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Send Message
                </button>
              </form>
            </MagicCard>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-background">
        <div className="max-w-[1024px] mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-sm text-text-tertiary">© 2026 Om Chauhan. Built with Zen & Precision.</p>
          <div className="flex gap-8">
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
