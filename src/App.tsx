import React, {
  useState,
  useEffect,
  useRef,
  type ReactNode,
  type MouseEvent,
  Suspense,
} from "react";
import Lenis from "lenis";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Activity,
  Lock,
  Server,
  Clock,
  ShieldCheck,
  ZapOff,
  Zap,
  Layers,
  TrendingUp,
  Cpu,
  Menu,
  X,
} from "lucide-react";
import Scene from "./3D/Scene";

// --- TYPES ---
interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
}

// --- TERMINAL TEXT FORMATTER HELPER ---
const formatTerminalText = (text: string) => {
  const parts = text.split(
    /(\+\d+\.?\d*%? APY|rebalance\(\)|confirmed|0x[a-fA-F0-9]+\.\.\.)/g
  );
  return parts.map((part, i) => {
    const isImportant =
      /(\+\d+\.?\d*%? APY|rebalance\(\)|confirmed|0x[a-fA-F0-9]+\.\.\.)/.test(
        part
      );
    return isImportant ? (
      <b key={i} className="font-bold tracking-normal text-purple-400">
        {part}
      </b>
    ) : (
      part
    );
  });
};

// --- DYNAMIC TERMINAL COMPONENT ---
const SentinelTerminal = () => {
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [stageIndex, setStageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const scriptStages = [
    "[MONITOR] Scanning Monad whitelisted pools...",
    "[CALCULATE] Profit Delta: +12.4% APY detected",
    "[CALCULATE] Validating strategy guardrails...",
    "[EXECUTE] broadcasting rebalance() to Monad...",
    "[SUCCESS] Transaction 0x74f... confirmed",
    "[IDLE] Cooling down Sentinel engine...",
    "[SYSTEM] All sentinels synchronized.",
  ];

  useEffect(() => {
    if (stageIndex < scriptStages.length) {
      if (charIndex < scriptStages[stageIndex].length) {
        const timeout = setTimeout(() => {
          setCurrentText((prev) => prev + scriptStages[stageIndex][charIndex]);
          setCharIndex((prev) => prev + 1);
        }, 40);
        return () => clearTimeout(timeout);
      } else {
        const delay = setTimeout(() => {
          setDisplayedLogs((prev) =>
            [...prev, scriptStages[stageIndex]].slice(-6)
          );
          setCurrentText("");
          setCharIndex(0);
          setStageIndex((prev) => (prev + 1) % scriptStages.length);
        }, 1500);
        return () => clearTimeout(delay);
      }
    }
  }, [charIndex, stageIndex]);

  return (
    <div className="relative group w-full lg:max-w-xl text-left">
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-white/10 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      <div className="relative bg-[#08080A] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-white/10 border border-white/20"></div>
            <div className="w-3 h-3 rounded-full bg-purple-500/40"></div>
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          </div>
          <span className="text-[10px] font-mono text-purple-300/60 uppercase tracking-[0.2em] font-bold">
            sentinel_node_mainnet.py
          </span>
        </div>
        <div className="p-6 sm:p-8 font-mono text-[10px] sm:text-sm h-72 bg-black/60 flex flex-col justify-start overflow-hidden">
          <div className="space-y-3">
            {displayedLogs.map((log, i) => (
              <div
                key={i}
                className="flex gap-3 text-white/50 opacity-100 transition-opacity duration-500"
              >
                <span className="text-purple-500 font-bold">❯</span>
                <span
                  className={
                    log.includes("SUCCESS") || log.includes("EXECUTE")
                      ? "text-purple-400"
                      : "text-white"
                  }
                >
                  {formatTerminalText(log)}
                </span>
              </div>
            ))}
            <div className="flex gap-3">
              <span className="text-purple-500 animate-pulse font-bold">❯</span>
              <span className="text-white">
                {formatTerminalText(currentText)}
                <span className="w-2 h-4 bg-purple-500 inline-block align-middle ml-1 animate-blink"></span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 3D DONUT CHART ---
const DonutChart3D = () => {
  const [rotation, setRotation] = useState({ x: 15, y: 0 });
  const data = [
    { name: "User APY", value: 85, color: "#4c1d95" },
    { name: "AI Fee", value: 10, color: "#a855f7" },
    { name: "Platform Fee", value: 5, color: "#FFFFFF" },
  ];

  return (
    <div className="relative flex flex-col lg:flex-row items-center justify-center py-10 lg:py-20 gap-8 lg:gap-12">
      <div
        className="relative w-72 h-72 sm:w-80 sm:h-80 transition-transform duration-500 ease-out cursor-crosshair"
        style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = (e.clientY - rect.top) / rect.height;
          const y = (e.clientX - rect.left) / rect.width;
          setRotation({ x: 10 + x * 15, y: (y - 0.5) * 20 });
        }}
        onMouseLeave={() => setRotation({ x: 15, y: 0 })}
      >
        <div className="absolute inset-0 rounded-full bg-purple-600/10 blur-[100px] translate-z-[-50px]" />

        <div
          className="relative w-full h-full"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 opacity-20"
              style={{ transform: `translateZ(${-i * 2}px)` }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    innerRadius="70%"
                    outerRadius="100%"
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`depth-${index}`}
                        fill={entry.color}
                        filter="brightness(0.4)"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          ))}

          <div
            className="absolute inset-0 drop-shadow-[0_15px_35px_rgba(126,34,206,0.3)]"
            style={{ transform: "translateZ(10px)" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius="70%"
                  outerRadius="100%"
                  dataKey="value"
                  paddingAngle={2}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth={1}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<div className="hidden" />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            style={{ transform: "translateZ(40px)" }}
          >
            <span className="text-white text-3xl sm:text-4xl font-black italic tracking-tighter uppercase drop-shadow-2xl">
              SPLIT
            </span>
            <div className="h-[1px] w-8 bg-purple-400/50 my-1" />
            <span className="text-purple-300 font-mono text-[8px] uppercase tracking-[0.3em] font-bold">
              Velocity
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:flex lg:flex-col gap-4 font-mono text-left bg-white/5 p-6 sm:p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
        {data.map((item, i) => (
          <div key={i} className="group flex items-center gap-4 cursor-default">
            <div
              className="w-3 h-3 rounded-full transition-all group-hover:scale-150"
              style={{
                backgroundColor: item.color,
                boxShadow: `0 0 15px ${item.color}`,
              }}
            />
            <div>
              <span className="block text-[9px] text-gray-500 uppercase font-black tracking-widest">
                {item.name}
              </span>
              <span className="text-sm text-white font-bold">
                {item.value}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 3D ICONS ---
const ThreeDIcon = ({ children }: { children: ReactNode }) => (
  <div className="relative group/icon flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-purple-600/40 blur-[30px] rounded-full scale-150 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-700" />
    <div className="relative w-16 h-16 rounded-[18px] flex items-center justify-center bg-[#1a1a1c] shadow-[10px_10px_20px_rgba(0,0,0,0.5),-2px_-2px_5px_rgba(255,255,255,0.05),inset_2px_2px_2px_rgba(255,255,255,0.1),inset_-2px_-2px_10px_rgba(0,0,0,0.8)] transition-all duration-500 group-hover/icon:-translate-y-2 group-hover/icon:rotate-3">
      <div className="absolute inset-[3px] rounded-[15px] bg-gradient-to-br from-[#e9d5ff] via-[#6b21a8] to-[#2e1065] border border-purple-400/30 shadow-inner overflow-hidden">
        <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-[conic-gradient(from_45deg,transparent,rgba(255,255,255,0.3),transparent)] animate-[spin_15s_linear_infinite] opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.3),transparent_70%)]" />
      </div>
      <div className="relative z-10 text-purple-100 drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] group-hover/icon:scale-110 transition-transform duration-500">
        <div
          style={{
            filter:
              "url(#purple-chrome) drop-shadow(0px 2px 2px rgba(0,0,0,0.5))",
          }}
        >
          {children}
        </div>
      </div>
    </div>
    <svg className="absolute w-0 h-0">
      <defs>
        <filter id="purple-chrome" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
          <feSpecularLighting
            in="blur"
            surfaceScale="5"
            specularConstant="1"
            specularExponent="40"
            lightingColor="#a855f7"
            result="specOut"
          >
            <fePointLight x="-5000" y="-10000" z="20000" />
          </feSpecularLighting>
          <feComposite
            in="specOut"
            in2="SourceAlpha"
            operator="in"
            result="specOut"
          />
          <feComposite
            in="SourceGraphic"
            in2="specOut"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
          />
        </filter>
      </defs>
    </svg>
  </div>
);

const WhiteMetallicIcon = ({ children }: { children: ReactNode }) => (
  <div className="relative group/icon flex items-center justify-center shrink-0">
    <div className="absolute inset-0 bg-white/10 blur-[20px] rounded-full scale-125 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-700" />
    <div className="relative w-14 h-14 rounded-xl flex items-center justify-center bg-[#1a1a1c] shadow-[8px_8px_16px_rgba(0,0,0,0.6),inset_1px_1px_2px_rgba(255,255,255,0.1)] transition-all duration-500 group-hover/icon:-translate-y-1">
      <div className="absolute inset-[2px] rounded-[10px] bg-gradient-to-br from-[#ffffff] via-[#9ca3af] to-[#374151] shadow-inner overflow-hidden">
        <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-[conic-gradient(from_45deg,transparent,rgba(255,255,255,0.4),transparent)] animate-[spin_20s_linear_infinite] opacity-20" />
      </div>
      <div className="relative z-10 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        {children}
      </div>
    </div>
  </div>
);

const NAVIGATION = [
  { name: "Home", href: "#" },
  { name: "Protocol", href: "#features" },
  { name: "Why Us", href: "#why-monad" },
  { name: "Tokenomics", href: "#tokenomics" },
];

const TiltCard = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotation({
      x: ((y - centerY) / centerY) * -12,
      y: ((x - centerX) / centerX) * 12,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setRotation({ x: 0, y: 0 });
      }}
      className={`relative transition-all duration-300 ease-out transform-gpu ${className}`}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.02, 1.02, 1.02)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
};

const GridFloor = () => (
  <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
    <div
      className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px] sm:bg-[size:60px_60px] [transform:perspective(1200px)_rotateX(68deg)_scale(3)] origin-bottom"
      style={{ maskImage: "linear-gradient(to top, black, transparent 60%)" }}
    ></div>
  </div>
);

const App = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => {
      lenis.destroy();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (href === "#") {
      lenisRef.current?.scrollTo(0);
    } else {
      lenisRef.current?.scrollTo(href, { offset: -80 });
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] text-white font-sans selection:bg-purple-500/40 overflow-x-hidden">
      {/* --- NAVBAR --- */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileMenuOpen
            ? "bg-[#020408]/90 backdrop-blur-md border-b border-white/5"
            : "bg-transparent pt-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => lenisRef.current?.scrollTo(0)}
          >
            <img
              src="/assets/Thresh_logo_nobg.png"
              alt="Thresh Logo"
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain group-hover:scale-110 transition-transform duration-500 brightness-0 invert"
            />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2 py-1">
            {NAVIGATION.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="px-5 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white transition-all"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Desktop Button */}
          <div className="hidden md:block">
            <button className="relative group px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 rounded-xl p-[1.5px] bg-[linear-gradient(110deg,#E2E8F0,45%,#A855F7,55%,#E2E8F0)] bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite] group-hover:opacity-0 transition-opacity duration-500">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#020408]" />
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#e9d5ff] via-[#6b21a8] to-[#2e1065] shadow-[0_0_30px_rgba(168,85,247,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)]" />
              <span className="relative z-10 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent group-hover:text-white transition-colors duration-500">
                Whitepaper
              </span>
              <div className="absolute inset-0 z-20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
            </button>
          </div>

          {/* Mobile Trigger */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Slide Menu */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-[#020408]/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 ${
            mobileMenuOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col p-6 gap-4">
            {NAVIGATION.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-xl font-bold italic uppercase tracking-tighter"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative min-h-screen flex items-center px-6 sm:px-12 overflow-hidden">
        <GridFloor />
        <div className="absolute top-0 left-0 z-[99] w-full h-screen flex justify-end pointer-events-none">
          <div className="w-1/2 h-full ">
              <Scene />
          </div>
        </div>
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* <img
            src="/assets/monad_theme.png"
            alt="Background Theme"
            className="w-full h-full object-cover object-right opacity-150 scale-105"
          /> */}
          <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-[#020408] via-[#020408]/80 sm:via-[#020408]/20 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full pt-20 text-center sm:text-left">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6 group cursor-default">
              <img
                src="/assets/monad_logo_small.png"
                alt="Monad"
                className="w-4 h-4 object-contain opacity-80 group-hover:rotate-12 transition-transform"
              />
              <span className="text-white-400 font-mono text-[11px] tracking-wide uppercase">
                Active on <span className="text-white-300">Monad Testnet</span>
              </span>
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-[90px] font-bold leading-[1.05] tracking-tight mb-8">
              Thresh Velocity <br />
              <span className="text-white/90 italic uppercase">
                Beyond Boundaries
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-lg mx-auto sm:mx-0 leading-relaxed mb-12">
              The autonomous treasury infrastructure for Monad DAOs. Turn "Lazy
              Capital" into hedge fund level yield with AI Sentinels.{" "}
            </p>
            <button className="group relative px-10 py-4 bg-[#0f0f11] rounded-xl font-bold text-white transition-all duration-500 hover:scale-105 active:scale-95 border border-white/10 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7e22ce] via-[#a855f7] to-[#4c1d95] opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.4)_45%,rgba(255,255,255,0.6)_50%,rgba(255,255,255,0.4)_55%,transparent_65%)] bg-[length:200%_100%] animate-shimmer pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-[1px] bg-white/40 z-10" />
              <div className="absolute inset-0 z-20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
              <span className="relative z-10 uppercase tracking-[0.1em] italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                Enter Protocol
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* --- FEATURES --- */}
      <section
        id="features"
        className="relative z-10 py-20 sm:py-32 bg-[#050505] border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle subtitle="Solving the governance latency problem with restricted delegation. ">
            Core Protocol
          </SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Velocity Engine",
                stat: "400ms",
                sub: "Latency",
                icon: <Clock size={32} />,
                desc: "Traditional multisigs are too slow for volatile alpha. Thresh rebalances every block to capture spikes.",
              },
              {
                title: "Micro-Rebalancing",
                stat: "<$0.01",
                sub: "Tx Cost",
                icon: <Activity size={32} />,
                desc: "Leverage Monad's parallel execution to move positions profitably even at small scales.",
              },
              {
                title: "Vault Guardrails",
                stat: "0%",
                sub: "Theft Risk",
                icon: <Lock size={32} />,
                desc: "Non-custodial ERC-4626 vaults. The AI can only move funds between whitelisted strategies.",
              },
            ].map((item, i) => (
              <TiltCard key={i}>
                <div className="relative h-full p-8 rounded-[40px] overflow-hidden group transition-all duration-500 bg-[#0f0f11]/60 backdrop-blur-2xl border border-white/10 shadow-[inset_0px_0px_20px_rgba(255,255,255,0.05)] hover:shadow-[inset_0px_0px_30px_rgba(168,85,247,0.1),0_0_25px_rgba(168,85,247,0.2)] flex flex-col text-left">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.1),transparent_70%)] opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <ThreeDIcon>{item.icon}</ThreeDIcon>
                    <div className="text-right">
                      <div className="text-3xl font-mono font-bold text-white mb-1">
                        {item.stat}
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                        {item.sub}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 uppercase italic tracking-tighter relative z-10">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm font-medium mt-auto border-t border-white/5 pt-6 group-hover:text-gray-300 relative z-10">
                    {item.desc}
                  </p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* --- ARCHITECTURE --- */}
      <section
        id="architecture"
        className="py-20 sm:py-32 relative overflow-hidden bg-[#020408] border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionTitle subtitle="Separating Custody (The DAO) from Execution (The AI Sentinel). ">
            The AI Sentinel
          </SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-12 relative text-left">
              <div className="absolute left-[27px] top-6 bottom-6 w-[2px] -translate-x-1/2 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-white/10 w-[1px] mx-auto"></div>
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-purple-500 to-transparent blur-xl opacity-0 animate-beam-drop"></div>
                <div
                  className="absolute inset-0 w-full h-full opacity-40 animate-dotted-flow"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #a855f7 40%, transparent 50%)",
                    backgroundSize: "4px 20px",
                    backgroundRepeat: "repeat-y",
                  }}
                ></div>
              </div>
              {[
                {
                  title: "Hire & Fire",
                  icon: <ShieldCheck size={24} />,
                  desc: "The DAO Multisig grants the OPERATOR_ROLE to the AI. Permissions can be revoked instantly.",
                },
                {
                  title: "Deterministic Loop",
                  icon: <Server size={24} />,
                  desc: "The Sentinel monitors yields every 400ms. If Net Profit > Threshold, it broadcasts the trade.",
                },
                {
                  title: "Panic Button",
                  icon: <ZapOff size={24} />,
                  desc: "A decentralized Kill Switch allows the DAO to halt all AI operations in a single click.",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="relative z-10 flex gap-6 sm:gap-10 group"
                >
                  <WhiteMetallicIcon>{step.icon}</WhiteMetallicIcon>
                  <div className="pt-2 text-left">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 uppercase italic">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-xs sm:text-sm max-w-sm">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <SentinelTerminal />
          </div>
        </div>
      </section>

      {/* --- WHY MONAD SECTION --- */}
      <section
        id="why-monad"
        className="py-20 sm:py-32 bg-[#050505] border-t border-white/5 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 relative text-center">
          <SectionTitle subtitle="Institutional-grade capital velocity through parallel EVM infrastructure. ">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
              <span className="sm:mr-8">WHY</span>
              <div className="flex items-center">
                <img
                  src="/assets/monad_logo_small.png"
                  alt="Monad Logo"
                  className="w-8 h-8 md:w-12 md:h-12 object-contain mr-2"
                />
                <span
                  style={{
                    fontFamily:
                      '"Futura Now Text Medium", Futura, "Tw Cen MT", "Century Gothic", sans-serif',
                    fontWeight: "500",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontStyle: "normal",
                  }}
                >
                  MONAD
                </span>
              </div>
            </div>
          </SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Parallelism",
                icon: <Zap size={28} />,
                desc: "Execute rebalancing trades simultaneously without head-of-line blocking.",
              },
              {
                title: "MonadDB",
                icon: <Layers size={28} />,
                desc: "Optimized state storage allows AI sentinels to track treasury delta in real-time.",
              },
              {
                title: "Cost-Efficiency",
                icon: <TrendingUp size={28} />,
                desc: "Sub-cent fees enable rebalancing even for small yield opportunities.",
              },
              {
                title: "Block Finality",
                icon: <Cpu size={28} />,
                desc: "1-second finality ensures rebalances are confirmed before yield spikes decay.",
              },
            ].map((box, i) => (
              <TiltCard key={i} className="h-full">
                <div className="relative h-full p-8 rounded-[32px] overflow-hidden bg-[#0f0f11]/60 backdrop-blur-2xl border border-white/10 shadow-[inset_0px_0px_20px_rgba(255,255,255,0.05)] group transition-all duration-500 hover:border-purple-500/40 flex flex-col text-left">
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg" />
                  <div className="mb-8 relative z-10 flex justify-center w-fit">
                    <ThreeDIcon>{box.icon}</ThreeDIcon>
                  </div>
                  <div className="relative z-10 mt-auto">
                    <h4 className="text-xl font-bold mb-3 uppercase italic tracking-tighter text-white group-hover:text-purple-300 transition-colors">
                      {box.title}
                    </h4>
                    <div className="h-[1px] w-12 bg-purple-500/30 mb-4 group-hover:w-full transition-all duration-700" />
                    <p className="text-sm text-gray-400 leading-relaxed font-medium opacity-80 group-hover:opacity-100">
                      {box.desc}
                    </p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* --- TOKENOMICS SECTION --- */}
      <section
        id="tokenomics"
        className="py-20 sm:py-32 bg-[#020408] border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle subtitle="Transparent revenue split designed for sustainable treasury growth. ">
            $THRESH Tokenomics
          </SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <h3 className="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase leading-tight">
                Yield Split
                <br />
                Infrastructure
              </h3>
              <p className="text-gray-400 font-mono leading-relaxed text-sm">
                Thresh utilizes a specialized net-yield split to incentivize AI
                Node Operators and sustain protocol development.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group relative p-8 rounded-[32px] overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-purple-500/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-purple-900/40 to-black backdrop-blur-xl -z-10" />
                  <div className="relative z-10">
                    <div className="mb-4 p-3 bg-purple-500/20 rounded-xl w-fit mx-auto lg:mx-0 border border-purple-400/20">
                      <Cpu className="text-purple-400" size={20} />
                    </div>
                    <div className="text-purple-300/60 text-xs uppercase mb-1 font-black tracking-widest">
                      AI Node Processing
                    </div>
                    <div className="text-4xl font-black font-mono text-white">
                      10.0%
                    </div>
                  </div>
                </div>
                <div className="group relative p-8 rounded-[32px] overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-purple-900/20 to-black backdrop-blur-xl -z-10" />
                  <div className="relative z-10">
                    <div className="mb-4 p-3 bg-white/5 rounded-xl w-fit mx-auto lg:mx-0 border border-white/10">
                      <Layers className="text-white/60" size={20} />
                    </div>
                    <div className="text-white/40 text-xs uppercase mb-1 font-black tracking-widest">
                      Platform Fee
                    </div>
                    <div className="text-4xl font-black font-mono text-white">
                      5.0%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DonutChart3D />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 sm:py-20 border-t border-white/10 bg-[#020408]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-left">
          <div className="col-span-1 sm:col-span-2 flex flex-col items-start">
            <div
              className="flex flex-col items-center gap-0 mb-8 cursor-pointer w-fit"
              onClick={() => lenisRef.current?.scrollTo(0)}
            >
              <img
                src="/assets/Thresh_logo_nobg.png"
                alt="Thresh Icon"
                className="w-32 h-32 sm:w-40 sm:h-40 object-contain brightness-0 invert drop-shadow-[0_0_30px_rgba(168,85,247,0.2)]"
              />
              <div className="font-black text-3xl sm:text-4xl tracking-tighter italic uppercase text-white leading-none -mt-4">
                THRESH
              </div>
            </div>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed text-left border-l border-white/10 pl-4">
              The autonomous treasury infrastructure for Monad DAOs. Turning
              lazy capital into institutional yield.{" "}
            </p>
          </div>
          <div className="space-y-4 text-left">
            <h5 className="font-bold uppercase text-xs text-purple-400 font-mono tracking-widest">
              Built Using
            </h5>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a
                  href="https://www.monad.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-white transition-colors group"
                >
                  <img
                    src="/assets/monad_logo_small.png"
                    alt="Monad"
                    className="w-5 h-5 object-contain brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  <span>Monad</span>
                </a>
              </li>
              <li>
                <a
                  href="https://soliditylang.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-white transition-colors group"
                >
                  <img
                    src="https://raw.githubusercontent.com/ethereum/solidity/develop/docs/logo.svg"
                    alt="Solidity"
                    className="w-5 h-5 object-contain brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  <span>Solidity</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4 text-left">
            <h5 className="font-bold uppercase text-xs text-purple-400 font-mono tracking-widest">
              Protocol
            </h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  WhitePaper
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Demo Video
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-white/5 mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] uppercase font-mono tracking-[0.3em] text-gray-600">
          <span>© 2025 Thresh Velocity Corp.</span>
          <span>Live on Monad Testnet</span>
        </div>
      </footer>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes dotted-flow { 0% { background-position: 0 0; } 100% { background-position: 0 20px; } }
        .animate-dotted-flow { animation: dotted-flow 1.5s linear infinite; }
        @keyframes beam-drop { 0% { top: -20%; opacity: 0; } 10% { opacity: 1; } 50% { opacity: 1; } 90% { opacity: 0; } 100% { top: 120%; opacity: 0; } }
        .animate-beam-drop { animation: beam-drop 8s ease-in-out infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-blink { animation: blink 1s step-end infinite; }
        .perspective-1000 { perspective: 1000px; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .animate-shimmer { animation: shimmer 3s linear infinite; }
      `,
        }}
      />
    </div>
  );
};

const SectionTitle = ({ children, subtitle }: SectionTitleProps) => (
  <div className="mb-12 sm:mb-16 text-center relative z-10 px-4">
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 uppercase italic tracking-tighter">
      {children}
    </h2>
    {subtitle && (
      <p className="text-gray-400 max-w-2xl text-sm sm:text-base leading-relaxed mx-auto font-mono tracking-tight">
        {subtitle}
      </p>
    )}
  </div>
);

export default App;
