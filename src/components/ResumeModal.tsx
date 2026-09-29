import React, { useEffect } from "react";
import { 
  X, 
  Printer, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  ExternalLink,
  Award,
  GraduationCap,
  Briefcase,
  Code2,
  FolderGit2
} from "lucide-react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-4xl bg-surface border border-border-subtle shadow-2xl z-10 my-auto flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Top Actions */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-border-subtle bg-background/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
            <span className="text-xs uppercase font-bold tracking-widest text-text-primary">
              Om Chauhan — Curriculum Vitae
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-surface border border-border-subtle hover:border-primary text-text-primary transition-colors cursor-pointer"
              title="Print / Save PDF"
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-surface border border-transparent hover:border-border-subtle transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Resume Content Viewport */}
        <div className="overflow-y-auto p-6 sm:p-10 custom-scrollbar space-y-8 bg-surface text-text-primary">
          {/* Header */}
          <div className="border-b border-border-subtle pb-6 text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-text-primary">
              Om Chauhan
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-text-secondary font-mono">
              <a href="tel:+917359798392" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Phone size={13} className="text-primary" /> +91-7359798392
              </a>
              <a href="mailto:odchauhan0702@gmail.com" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Mail size={13} className="text-primary" /> odchauhan0702@gmail.com
              </a>
              <a href="https://www.linkedin.com/in/om-chauhan-21043824b/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Linkedin size={13} className="text-primary" /> Om Chauhan
              </a>
              <a href="https://github.com/OmChauhan07" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Github size={13} className="text-primary" /> OmChauhan07
              </a>
              <span className="flex items-center gap-1.5 text-text-tertiary">
                <MapPin size={13} className="text-primary" /> Mahemdavad, Gujarat, India
              </span>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-primary flex items-center gap-2">
              Summary
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              B.Tech Information Technology student and 3x national hackathon finalist with hands-on experience building full-stack applications, AI-powered systems, and data-driven solutions. Proficient in Python, FastAPI, React, SQL, machine learning, and generative AI, with experience developing production-oriented projects and automated data workflows.
            </p>
          </div>

          {/* Technical Skills */}
          <div className="space-y-3">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-primary flex items-center gap-2">
              <Code2 size={14} /> Technical Skills
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-background border border-border-subtle">
                <span className="font-bold text-text-primary block mb-1">Languages:</span>
                <span className="text-text-secondary">Python, JavaScript, SQL, HTML5, CSS3</span>
              </div>
              <div className="p-3 bg-background border border-border-subtle">
                <span className="font-bold text-text-primary block mb-1">Frameworks & Web:</span>
                <span className="text-text-secondary">React.js, Django, FastAPI, Node.js, Express.js</span>
              </div>
              <div className="p-3 bg-background border border-border-subtle">
                <span className="font-bold text-text-primary block mb-1">AI, ML & Data:</span>
                <span className="text-text-secondary">Pandas, NumPy, Scikit-learn, Google GenAI, CrewAI, LangChain</span>
              </div>
              <div className="p-3 bg-background border border-border-subtle">
                <span className="font-bold text-text-primary block mb-1">Databases & Tools:</span>
                <span className="text-text-secondary">PostgreSQL (Neon), MongoDB, Git, GitHub, Jupyter</span>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-primary flex items-center gap-2">
              <Briefcase size={14} /> Experience
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-background border-l-2 border-primary border-t border-r border-b border-border-subtle space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="font-bold text-text-primary text-sm">Data Analysis Intern</h3>
                    <p className="text-xs font-semibold text-primary">Elevance Skills</p>
                  </div>
                  <span className="text-[11px] font-mono text-text-tertiary">May 2026 – June 2026</span>
                </div>
                <p className="text-[11px] text-text-tertiary font-mono">
                  NumPy, Pandas, Matplotlib, Seaborn, Plotly, Streamlit
                </p>
                <ul className="text-xs text-text-secondary space-y-1.5 list-disc list-inside">
                  <li>Cleaned and analyzed operational data, building Pandas/Streamlit dashboards to visualize trends and surface key insights for the team.</li>
                </ul>
              </div>

              <div className="p-4 bg-background border-l-2 border-primary border-t border-r border-b border-border-subtle space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="font-bold text-text-primary text-sm">Data Science Intern</h3>
                    <p className="text-xs font-semibold text-primary">Cognifyz Technologies</p>
                  </div>
                  <span className="text-[11px] font-mono text-text-tertiary">April 2025 – May 2025</span>
                </div>
                <p className="text-[11px] text-text-tertiary font-mono">
                  NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn
                </p>
                <ul className="text-xs text-text-secondary space-y-1.5 list-disc list-inside">
                  <li>Cleaned and preprocessed large-scale datasets, engineered features, and trained/cross-validated predictive models in Scikit-learn, achieving 85% accuracy.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-primary flex items-center gap-2">
              <FolderGit2 size={14} /> Key Projects
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-background border border-border-subtle space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-text-primary text-sm">DocuMind</h3>
                    <span className="text-[11px] text-text-tertiary font-mono">| React, FastAPI, CrewAI, GenAI</span>
                  </div>
                  <span className="text-[11px] font-mono text-text-tertiary">June 2026 – Present</span>
                </div>
                <ul className="text-xs text-text-secondary space-y-1 list-disc list-inside">
                  <li>Built a 2-agent AI pipeline using CrewAI and Google Gemini for automated document analysis and structured report generation.</li>
                  <li>Designed a Django + FastAPI architecture with PostgreSQL/pgvector, object storage, and asynchronous processing.</li>
                </ul>
              </div>

              <div className="p-4 bg-background border border-border-subtle space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-text-primary text-sm">DAO Browser</h3>
                    <span className="text-[11px] text-text-tertiary font-mono">| Chromium, Electron, Flask, NLTK</span>
                  </div>
                  <span className="text-[11px] font-mono text-text-tertiary">Feb 2026 – May 2026</span>
                </div>
                <ul className="text-xs text-text-secondary space-y-1 list-disc list-inside">
                  <li>Built a Chromium-based desktop browser with an AI-powered article summarizer (Flask, NLTK/Sumy LSA).</li>
                  <li>Implemented privacy features (ad/tracker/NSFW blocking) along with Focus Mode and Exam Mode lockdown systems.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-primary flex items-center gap-2">
              <GraduationCap size={14} /> Education
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-background border border-border-subtle space-y-1.5">
                <h3 className="font-bold text-text-primary text-sm">
                  Charotar University of Science and Technology (CHARUSAT)
                </h3>
                <p className="text-xs text-text-secondary">Anand, Gujarat</p>
                <p className="text-xs font-medium text-text-primary">
                  Bachelor of Technology in Information Technology
                </p>
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-primary font-bold font-mono">CGPA: 7.14 / 10.00</span>
                  <span className="text-text-tertiary font-mono">July 2024 – Present</span>
                </div>
              </div>

              <div className="p-4 bg-background border border-border-subtle space-y-1.5">
                <h3 className="font-bold text-text-primary text-sm">
                  D A Degree Engineering and Technology (GTU)
                </h3>
                <p className="text-xs text-text-secondary">Mahemdavad, Gujarat</p>
                <p className="text-xs font-medium text-text-primary">
                  Diploma in Computer Engineering
                </p>
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-primary font-bold font-mono">CGPA: 8.00 / 10.00</span>
                  <span className="text-text-tertiary font-mono">May 2021 – June 2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements & Certifications */}
          <div className="space-y-3">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-primary flex items-center gap-2">
              <Award size={14} /> Achievements & Certifications
            </h2>
            <div className="p-4 bg-background border border-border-subtle space-y-2.5 text-xs text-text-secondary">
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <div>
                  <strong className="text-text-primary font-semibold">National Hackathon Finalist (3x):</strong> Reached the national finals at Odoo x SPIT (Dec 2025), Odoo x CGC Mohali (Aug 2025), and Odoo x GVP (Mar 2025).
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <div>
                  <strong className="text-text-primary font-semibold">FreeCodeCamp Python Certification:</strong> Demonstrated proficiency in Python programming, problem solving, data structures, and algorithmic concepts through freeCodeCamp’s Python curriculum.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <div>
                  <strong className="text-text-primary font-semibold">IBM Machine Learning Professional Certificate:</strong> Applied ML algorithms, data preprocessing, and predictive modeling.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <div>
                  <strong className="text-text-primary font-semibold">AWS Cloud Development Certification:</strong> Cloud computing fundamentals and application deployment.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
