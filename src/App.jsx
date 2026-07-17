import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

// =========================================================================
// CHARREVEAL: KINETIC TYPOGRAPHY COMPONENT
// Splits any text string into individually animated characters,
// staggering their slide-up, skew, and rotation on scroll view.
// =========================================================================
const CharReveal = ({ text, className, delay = 0, trigger = "view" }) => {
  const letters = text.split("");
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.02,
        delayChildren: delay,
      }
    }
  };
  
  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <motion.span 
      className={className} 
      style={{ display: "inline-block", verticalAlign: "bottom" }}
      variants={containerVariants}
      initial="hidden"
      {...(trigger === "animate"
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: { once: true, amount: 0.1 } }
      )}
    >
      {letters.map((char, index) => (
        <motion.span
          key={index}
          style={{ display: "inline-block", transformOrigin: "left bottom" }}
          variants={childVariants}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

// =========================================================================
// DECRYPTEDTEXT: MATRIX/HACKER TEXT GLITCH DECRYPTION REVEAL
// Scrambles and decrypts letters when scrolled into viewport.
// =========================================================================
const DecryptedText = ({ text, delay = 0, triggerOnce = true }) => {
  const [displayText, setDisplayText] = useState("");
  const containerRef = useRef(null);
  
  useEffect(() => {
    let intervalId;
    let timeoutId;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+{}|:<>?-=[]\\;',./";
    const originalText = text;
    
    const startDecryption = () => {
      let iteration = 0;
      clearInterval(intervalId);
      
      intervalId = setInterval(() => {
        setDisplayText(
          originalText
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < iteration) return originalText[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );
        
        if (iteration >= originalText.length) {
          clearInterval(intervalId);
        }
        iteration += 1 / 3;
      }, 30);
    };
    
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        timeoutId = setTimeout(() => {
          startDecryption();
        }, delay * 1000);
        if (triggerOnce && containerRef.current) {
          observer.unobserve(containerRef.current);
        }
      }
    }, { threshold: 0.1 });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      if (containerRef.current) observer.disconnect();
    };
  }, [text, delay, triggerOnce]);
  
  return <span ref={containerRef}>{displayText || text}</span>;
};

// =========================================================================
// PARTICLECANVAS: INTERACTIVE CONSTELLATION MOUSE-REACTIVE BACKGROUND
// Renders vector-glowing particles reacting to cursor coordinates.
// =========================================================================
const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const particles = [];
    const particleCount = 70;
    
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.alpha = Math.random() * 0.5 + 0.1;
      }
      
      update(mouseX, mouseY) {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
        
        if (mouseX !== null && mouseY !== null) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            const force = (150 - distance) / 150;
            this.x -= (dx / distance) * force * 0.8;
            this.y -= (dy / distance) * force * 0.8;
          }
        }
      }
      
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = '#E53935'; 
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    let mouse = { x: null, y: null };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(mouse.x, mouse.y);
        particles[i].draw();
        
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.save();
            ctx.strokeStyle = 'rgba(229, 57, 53, 0.08)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none', 
        zIndex: 0 
      }} 
    />
  );
};

// =========================================================================
// BLUEPRINT CURSOR: DAMPED RETICLE CURSOR COMPONENT
// Renders a technical crosshair and spring-damped trailing circle
// that react dynamically when hovering over interactive elements.
// Bypassed on mobile devices.
// =========================================================================
const BlueprintCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsHovered(false);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      const isInteractive = target.closest('button, a, .glow-card, .timeline-content, input, textarea, [role="button"], .interactive-element');
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  // Check if mobile
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const springConfig = { damping: 30, stiffness: 350, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  if (isMobileDevice || !isVisible) return null;

  return (
    <>
      {/* 1. Trailing Spring Outer Circle */}
      <motion.div 
        className={`custom-cursor-outer ${isHovered ? 'hovered' : ''}`}
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          scale: isHovered ? 1.8 : 1
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      />

      {/* 2. Snappy Inner Reticle Crosshair */}
      <motion.div 
        className="custom-cursor-inner"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          rotate: isHovered ? 45 : 0,
          scale: isHovered ? 0.75 : 1
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="cursor-crosshair-h"></div>
        <div className="cursor-crosshair-v"></div>
      </motion.div>
    </>
  );
};

function App() {
  // =========================================================================
  // 1. GOM TẤT CẢ STATE LÊN ĐÂY (Giữ nguyên toàn bộ logic)
  // =========================================================================
  const [loading, setLoading] = useState(true);
  const [isHoveringBtn, setIsHoveringBtn] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [activeAchieveFilter, setActiveAchieveFilter] = useState('ALL');
  const [isSchoolExpanded, setIsSchoolExpanded] = useState(false);
  const [isUniversityExpanded, setIsUniversityExpanded] = useState(false);
  const [isProjSchoolExpanded, setIsProjSchoolExpanded] = useState(false);
  const [isProjUniversityExpanded, setIsProjUniversityExpanded] = useState(false);
  const [popupData, setPopupData] = useState({ isOpen: false, gallery: [], currentIndex: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState('vi');
  const [activeVideos, setActiveVideos] = useState({});
  const [hoveredProject, setHoveredProject] = useState(null);
  const [terminalStep, setTerminalStep] = useState(0);

  const handleCanvasMouseMove = (e, projTitle) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    const cleanTitle = projTitle.replace(/[^a-zA-Z0-9]/g, '-');
    const coordEl = document.getElementById(`coords-${cleanTitle}`);
    if (coordEl) {
      coordEl.textContent = `X: ${x}px Y: ${y}px`;
    }
  };

  useEffect(() => {
    if (!hoveredProject) {
      setTerminalStep(0);
      return;
    }
    const interval = setInterval(() => {
      setTerminalStep(prev => (prev + 1) % 6);
    }, 1200);
    return () => clearInterval(interval);
  }, [hoveredProject]);

  const renderTerminalLogs = (projTitle) => {
    const step = hoveredProject === projTitle ? terminalStep : 5;
    switch (step) {
      case 0:
        return (
          <>
            <div className="text-muted">$ npm run build</div>
            <div className="text-red">&gt; local compiler initializing...</div>
            <div>[INFO] ready for bundle transformation</div>
          </>
        );
      case 1:
        return (
          <>
            <div className="text-muted">$ npm run build</div>
            <div>&gt; bundling modules (48/417)...</div>
            <div className="text-muted">[░░░░░░░░░░░░░░░░░░░░] 11%</div>
          </>
        );
      case 2:
        return (
          <>
            <div className="text-muted">$ npm run build</div>
            <div>&gt; bundling modules (312/417)...</div>
            <div className="text-red">[██████████████░░░░░░] 74%</div>
          </>
        );
      case 3:
        return (
          <>
            <div className="text-muted">$ npm run build</div>
            <div className="text-green">✓ bundle compiled successfully</div>
            <div className="text-muted" style={{ fontSize: '0.45rem' }}>dist/assets/index-BP4gylNb.css (50.8kB)</div>
            <div className="text-muted" style={{ fontSize: '0.45rem' }}>dist/assets/index-CDkrWvSU.js (396.8kB)</div>
          </>
        );
      case 4:
        return (
          <>
            <div className="text-muted">$ npm run test</div>
            <div>&gt; running unit assertions...</div>
            <div className="text-green">PASS  src/App.test.jsx (6 tests, 12ms)</div>
            <div className="text-green">PASS  src/index.css (1 test, 2ms)</div>
          </>
        );
      case 5:
      default:
        return (
          <>
            <div className="text-muted">$ npm run dev</div>
            <div className="text-red">&gt; vite dev server ready</div>
            <div>&gt; local: http://localhost:5173/</div>
            <div className="text-green">&gt; hmr compiled successfully in 410ms</div>
          </>
        );
    }
  };

  const renderEventStub = (projTitle) => {
    const step = hoveredProject === projTitle ? terminalStep : 5;
    const isScanning = step < 2;

    return (
      <>
        <div className="ticket-perforation"></div>
        <div className="ticket-stamp">{lang === 'vi' ? 'ĐÃ PHÊ DUYỆT' : 'APPROVED'}</div>
        
        {hoveredProject === projTitle && isScanning && (
          <div className="barcode-laser-line"></div>
        )}

        <div className="ticket-barcode-wrapper">
          <div className="ticket-barcode"></div>
          <span className="barcode-text">PASS_NO. 2026-NPN</span>
        </div>

        <div className="ticket-status-box">
          {isScanning ? (
            <span className="status-scanning">SCANNING...</span>
          ) : (
            <span className="status-verified">VERIFIED ✓</span>
          )}
        </div>
      </>
    );
  };


  // =========================================================================
  // 2. BỘ TỪ ĐIỂN SONG NGỮ (Giữ nguyên gốc)
  // =========================================================================
  const translations = {
    vi: {
      navHome: "TRANG CHỦ", navEdu: "HỌC VẤN", navAward: "THÀNH TÍCH", navProj: "DỰ ÁN", navContact: "LIÊN HỆ",
      heroSub: "PORTFOLIO", heroTitleLine1: "NGUYỄN", heroTitleLine2: "TRÍ NHÂN",
      heroDesc: "Đây là không gian cá nhân để mình lưu giữ những cột mốc học tập, các hoạt động và dự án tâm huyết.",
      btnView: "XEM DỰ ÁN", btnConnect: "KẾT NỐI NGAY",
      timelineEdu: "HỌC VẤN", timelineExp: "KINH NGHIỆM / HOẠT ĐỘNG",
      achieveSub: "DẤU ẤN CÁ NHÂN", achieveTitle1: "THÀNH TÍCH", achieveTitle2: "NỔI BẬT",
      projSub: "DANH MỤC SÁNG TẠO", projTitle1: "GÓC ", projTitle2: "DỰ ÁN",
      filterAll: "TẤT CẢ", filterVideo:"VIDEO", filterDesign: "THIẾT KẾ", filterEvent: "SỰ KIỆN",
      filterSchool: "CẤP TRƯỜNG", filterDistrict: "CẤP QUẬN", filterCity: "CẤP THÀNH PHỐ", filterNational: "CẤP QUỐC GIA",
      contactSub: "LIÊN HỆ", contactTitle1: "HÀNH TRÌNH", contactTitle2: "BẮT ĐẦU", contactTitle3: "TỪ ĐÂY",
      contactDesc: "Nếu bạn có chung sở thích, muốn giao lưu học hỏi hay rủ mình tham gia dự án nào đó, đừng ngại liên hệ nhé!",
      footerNav: "ĐIỀU HƯỚNG", footerConnect: "KẾT NỐI", footerPhone: "ĐIỆN THOẠI", footerSocial: "MẠNG XÃ HỘI", goTop: "Cuộn lên trên"
    },
    en: {
      navHome: "HOME", navEdu: "EDUCATION", navAward: "AWARDS", navProj: "PROJECTS", navContact: "CONTACT",
      heroSub: "PORTFOLIO", heroTitleLine1: "NGUYEN", heroTitleLine2: "TRI NHAN",
      heroDesc: "A personal space where I document my academic journey, extracurricular activities, and passionate projects.",
      btnView: "VIEW WORK", btnConnect: "LET'S TALK",
      timelineEdu: "EDUCATION", timelineExp: "EXPERIENCE / ACTIVITIES",
      achieveSub: "PERSONAL MARKS", achieveTitle1: "OUTSTANDING", achieveTitle2: "ACHIEVEMENTS",
      projSub: "CREATIVE FOLDER", projTitle1: "PROJECT ", projTitle2: "HUB",
      filterAll: "ALL", filterVideo:"VIDEO", filterDesign: "DESIGN", filterEvent: "EVENTS",
      filterSchool: "SCHOOL LEVEL", filterDistrict: "DISTRICT LEVEL", filterCity: "CITY LEVEL", filterNational: "NATIONAL LEVEL",
      contactSub: "CONTACT", contactTitle1: "LET'S START", contactTitle2: "THE JOURNEY", contactTitle3: "HERE",
      contactDesc: "If you share the same interests, want to learn together, or collaborate on a project, feel free to reach out!",
      footerNav: "NAVIGATION", footerConnect: "CONNECT", footerPhone: "PHONE", footerSocial: "SOCIAL MEDIA", goTop: "Scroll to top"
    }
  };
  const t = translations[lang];

  // =========================================================================
  // 3. SPRING CURSOR PHYSICS
  // =========================================================================
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 40, stiffness: 450, mass: 0.45 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  // Cursor hover state helpers
  const handleMouseEnterInteractive = () => {
    setIsHoveringBtn(true);
  };

  const handleMouseLeaveInteractive = () => {
    setIsHoveringBtn(false);
  };

  // =========================================================================
  // 4. PARALLAX EFFECTS (SCROLL-LINKED)
  // =========================================================================
  const { scrollY } = useScroll();
  const blobScrollY1 = useTransform(scrollY, [0, 3000], [0, 200]);
  const blobScrollY2 = useTransform(scrollY, [0, 3000], [0, -200]);
  const blobScrollY3 = useTransform(scrollY, [0, 3000], [0, 80]);
  const heroImageParallax = useTransform(scrollY, [0, 1000], [0, 60]);

  // Section Background Monospace Parallax Transforms
  const bgNumY1 = useTransform(scrollY, [0, 1000], [0, 150]);
  const bgNumY2 = useTransform(scrollY, [0, 2000], [-50, 150]);
  const bgNumY3 = useTransform(scrollY, [500, 3000], [-80, 180]);
  const bgNumY4 = useTransform(scrollY, [1000, 4000], [-100, 200]);
  const bgNumY5 = useTransform(scrollY, [1500, 5000], [-120, 220]);

  // Reacts to cursor movement slightly
  const blobX = useTransform(cursorX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [-40, 40]);
  const blobY = useTransform(cursorY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [-40, 40]);

  // =========================================================================
  // 5. 3D CARD TILT ON MOUSE MOVE (React-driven bounding box calculation)
  // =========================================================================
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12; 
    const rotateY = ((x - centerX) / centerX) * 12;  
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    card.style.setProperty('--rx', rotateX);
    card.style.setProperty('--ry', rotateY);
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)`;
    card.style.setProperty('--rx', '0');
    card.style.setProperty('--ry', '0');
  };

  // =========================================================================
  // 6. POPUP, SCROLL & LOADING LOGICS
  // =========================================================================
  const openPopup = (project, clickedImgUrl) => {
    const fullGallery = [project.mainImg, ...project.images];
    const index = fullGallery.indexOf(clickedImgUrl);
    setPopupData({ isOpen: true, gallery: fullGallery, currentIndex: index !== -1 ? index : 0 });
  };
  const closePopup = () => setPopupData({ ...popupData, isOpen: false });

  const nextImage = (e) => {
    e.stopPropagation();
    setPopupData(prev => ({ ...prev, currentIndex: (prev.currentIndex + 1) % prev.gallery.length }));
  };
  const prevImage = (e) => {
    e.stopPropagation();
    setPopupData(prev => ({ ...prev, currentIndex: prev.currentIndex === 0 ? prev.gallery.length - 1 : prev.currentIndex - 1 }));
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleFullyLoaded = () => {
      setTimeout(() => {
        setLoading(false);
      }, 800); 
    };

    if (document.readyState === 'complete') {
      handleFullyLoaded();
    } else {
      window.addEventListener('load', handleFullyLoaded);
    }

    const emergencyTimer = setTimeout(() => {
      setLoading(false);
    }, 12000); 

    return () => {
      window.removeEventListener('load', handleFullyLoaded);
      clearTimeout(emergencyTimer);
    };
  }, []);

  useEffect(() => {
    const handleScrollActiveSection = () => {
      const sections = document.querySelectorAll('section');
      let currentSection = 'home';
      sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 150) {
          currentSection = section.getAttribute('id');
        }
      });
      setActiveSection(currentSection);
    };
    window.addEventListener('scroll', handleScrollActiveSection);
    return () => window.removeEventListener('scroll', handleScrollActiveSection);
  }, []);

  const handleNavClick = (e, targetId) => {
    if (e) e.preventDefault();
    setIsMobileMenuOpen(false);
    
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;
    
    const headerOffset = window.innerWidth <= 768 ? 70 : 80;
    const targetPosition = targetElement.offsetTop - headerOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 900;
    let start = null;
    
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);
      const ease = easeOutCubic(percentage);
      window.scrollTo(0, startPosition + distance * ease);
      
      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        window.location.hash = targetId;
      }
    };
    
    window.requestAnimationFrame(step);
  };

  const scrollToTop = (e) => {
    if (e) e.preventDefault();
    const startPosition = window.pageYOffset;
    const duration = 900;
    let start = null;
    
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);
      const ease = easeOutCubic(percentage);
      window.scrollTo(0, startPosition - startPosition * ease);
      
      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        // Prevent viewport jump by using history state
        if (window.history.pushState) {
          window.history.pushState('', document.title, window.location.pathname);
        } else {
          window.location.hash = '';
        }
      }
    };
    
    window.requestAnimationFrame(step);
  };

  // =========================================================================
  // 7. DATA STRUCTS (Giữ nguyên toàn bộ)
  // =========================================================================
  const projects = [
    {
      category: 'VIDEO',
      role: '/ VIDEO EDITOR / CONTENT',
      title: lang === 'vi' ? 'Phim Ngắn - "Hố Sâu Ảo Vọng"' : 'Short Film - "The Abyss of Delusion"',
      desc: lang === 'vi' ? 'Ấn phẩm phục vụ mục đích truyền thông của KN Production.' : 'Media publication for KN Production.',
      logo: 'https://www.fphotography.club/logo4.webp',
      mainVideo: 'https://www.youtube.com/embed/2x40K6FstAU?si=czshFspivRjlkkst',
      mainImg: '/images/design-1/1.png',
      images: []
    },
    {
      category: 'VIDEO',
      role: '/ VIDEO EDITOR / CONTENT',
      title: lang === 'vi' ? 'Phim Ngắn - "Áp Lực Học Đường"' : 'Short Film - "School Pressure"',
      desc: lang === 'vi' ? 'Ấn phẩm phục vụ mục đích truyền thông của KN Production.' : 'Media publication for KN Production.',
      logo: 'https://www.fphotography.club/logo4.webp',
      mainVideo: 'https://www.youtube.com/embed/i4RDEnNLbmw?si=EJ3iOby896wRgZja',
      mainImg: '/images/thumb/3.png',
      images: []
    },
    {
      category: 'VIDEO',
      role: '/ VIDEO EDITOR / CONTENT',
      title: lang === 'vi' ? 'Recap Video - "Sự Kiện Chiếu Phim Tết 2026"' : 'Recap Video - "Lunar New Year Film Screening Event 2026."',
      desc: lang === 'vi' ? 'Ấn phẩm phục vụ mục đích truyền thông của CLB F-Photo.' : 'Media publication for F-Photography Club.',
      logo: 'https://www.fphotography.club/logo-black.webp',
      mainVideo: 'https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1387063549363314%2F&show_text=false&width=560&t=0',
      mainImg: '/images/project-4/1.png',
      images: []
    },
    {
      category: 'VIDEO',
      role: '/ VIDEO EDITOR / CONTENT',
      title: lang === 'vi' ? 'Podcast - "Hãy Yêu Thương Mẹ Khi Còn Có Thể"' : 'Podcast - "Love your mother while you still can."',
      desc: lang === 'vi' ? 'Ấn phẩm phục vụ mục đích truyền thông của CLB F-Photo.' : 'Media publication for F-Photography Club.',
      logo: 'https://www.fphotography.club/logo-black.webp',
      mainVideo: 'https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2044582789446743%2F&show_text=false&width=560&t=0',
      mainImg: '/images/thumb/2.png',
      images: []
    },
    {
      category: 'VIDEO',
      role: '/ VIDEO EDITOR / CONTENT',
      title: lang === 'vi' ? 'Recap Video - "Giao Lưu Nhiếp Ảnh Cấp CLB"' : 'Recap Video - "Photography Club Exchange"',
      desc: lang === 'vi' ? 'Ấn phẩm phục vụ mục đích truyền thông của CLB F-Photo.' : 'Media publication for F-Photography Club.',
      logo: 'https://www.fphotography.club/logo-black.webp',
      mainVideo: 'https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2420607978395005%2F&show_text=false&width=560&t=0',
      mainImg: '/images/project-3/2.png',
      images: []
    },
    {
      category: 'VIDEO',
      role: '/ VIDEO EDITOR / CONTENT',
      title: lang === 'vi' ? 'Live Session - "Người Gieo Mầm Xanh"' : 'Live Session - "Người Gieo Mầm Xanh"',
      desc: lang === 'vi' ? 'Ấn phẩm phục vụ mục đích truyền thông của CLB F-Photo.' : 'Media publication for F-Photography Club.',
      logo: 'https://www.fphotography.club/logo-black.webp',
      mainVideo: 'https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F681113428169427%2F&show_text=false&width=560&t=0',
      mainImg: '/images/thumb/1.png',
      images: []
    },
    {
      category: 'THIẾT KẾ',
      role: '/ GRAPHIC DESIGNER / CONTENT',
      title: lang === 'vi' ? 'Social Media Post - "Giới thiệu AIGEO Team"' : 'Social Media Post - "Introducing the AIGEO Team"',
      desc: lang === 'vi' ? 'Ấn phẩm phục vụ mục đích truyền thông của AIGEO.' : 'Media publication for AIGEO Project.',
      link: 'https://www.facebook.com/share/p/18yonBX57N/',
      logo: '/images/dev-4/6.png',
      mainImg: '/images/design-10/1.png',
      images: [
        '/images/design-10/2.png',
        '/images/design-10/3.png',
        '/images/design-10/4.png',
        '/images/design-10/5.png',
      ]
    },
    {
      category: 'THIẾT KẾ',
      role: '/ GRAPHIC DESIGNER / CONTENT',
      title: lang === 'vi' ? 'Social Media Post - "Giới thiệu Đội ngũ Phát triển HopVan"' : 'Social Media Post - "Introducing the HopVan Development Team"',
      desc: lang === 'vi' ? 'Ấn phẩm phục vụ mục đích truyền thông của HopVan.' : 'Media publication for HopVan Project.',
      link: 'https://www.facebook.com/share/p/1Bm7xV9gFm/',
      logo: 'https://hopvan.info.vn/logo.webp',
      mainImg: '/images/design-9/1.png',
      images: [
        '/images/design-9/2.png',
        '/images/design-9/3.png',
        '/images/design-9/4.png',
        '/images/design-9/5.png',
      ]
    },
    {
      category: 'THIẾT KẾ',
      role: '/ GRAPHIC DESIGNER / CONTENT',
      title: lang === 'vi' ? 'Social Media Post - "Giới thiệu BCN Gen 2.0"' : 'Social Media Post - "Introducing BoD Gen 2.0"',
      desc: lang === 'vi' ? 'Ấn phẩm phục vụ mục đích truyền thông của CLB F-Photo.' : 'Media publication for F-Photography Club.',
      link: 'https://www.facebook.com/share/p/14e6gstVdFK/',
      logo: '/images/design-8/1.png',
      mainImg: '/images/design-8/1.png',
      images: [
        '/images/design-8/2.png',
        '/images/design-8/3.png',
        '/images/design-8/4.png',
        '/images/design-8/5.png'
      ]
    },
    {
      category: 'THIẾT KẾ',
      role: '/ GRAPHIC DESIGNER / CONTENT',
      title: lang === 'vi' ? 'ID Card Design - "ID Card CLB F-Photo"' : 'ID Card Design - "F-Photo Club ID Card"',
      desc: lang === 'vi' ? 'Ấn phẩm phục vụ mục đích truyền thông của CLB F-Photo.' : 'Media publication for F-Photography Club.',
      link: 'https://www.behance.net/gallery/240268505/ID-CARD-F-PHOTO',
      logo: '/images/design-7/1.png',
      mainImg: '/images/design-7/1.png',
      images: [
        '/images/design-7/2.png',
        '/images/design-7/3.png',
        '/images/design-7/4.png',
        '/images/design-7/5.png'
      ]
    },
    {
      category: 'THIẾT KẾ',
      role: '/ GRAPHIC DESIGNER / CONTENT',
      title: lang === 'vi' ? 'Key Visual - "Sự Kiện Chiếu Phim Địa Đạo"' : 'Key Visual - "Dia Dao Movie Screening Event"',
      desc: lang === 'vi' ? 'Ấn phẩm phục vụ mục đích truyền thông của CLB F-Photo.' : 'Media publication for F-Photography Club.',
      link: 'https://www.behance.net/gallery/239999329/KEY-VISUAL-CHIU-PHIM-MIN-PHI-DA-DO',
      logo: '/images/design-6/1.png',
      mainImg: '/images/design-6/2.png',
      images: [
        '/images/design-6/1.png',
        '/images/design-6/3.png',
        '/images/design-6/4.png',
        '/images/design-6/5.png'
      ]
    },
    {
      category: 'THIẾT KẾ',
      role: '/ GRAPHIC DESIGNER / CONTENT',
      title: lang === 'vi' ? 'Social Media Post - "Tứ Trụ F-Photography"' : 'Social Media Post - "The Four Pillars of F-Photography"',
      desc: lang === 'vi' ? 'Ấn phẩm phục vụ mục đích truyền thông của CLB F-Photo.' : 'Media publication for F-Photography Club.',
      link: 'https://www.facebook.com/share/p/1Da7hQkz8E/',
      logo: '/images/design-5/1.png',
      mainImg: '/images/design-5/2.png',
      images: [
        '/images/design-5/3.png',
        '/images/design-5/4.png',
        '/images/design-5/5.png',
        '/images/design-5/6.png'
      ]
    },
    {
      category: 'THIẾT KẾ',
      role: '/ GRAPHIC DESIGNER / CONTENT',
      title: lang === 'vi' ? 'Key Visual - "Club Day 2025-2026"' : 'Key Visual - "Club Day 2025-2026"',
      desc: lang === 'vi' ? 'Ấn phẩm phục vụ mục đích truyền thông của FSchool Cần Thơ.' : 'Media publication for FSchool Cantho.',
      link: 'https://www.behance.net/gallery/236223807/KEY-VISUAL-CLUB-DAY-2025',
      logo: '/images/design-4/1.png',
      mainImg: '/images/design-4/1.png',
      images: [
        '/images/design-4/2.png',
        '/images/design-4/3.png',
        '/images/design-4/4.png',
        '/images/design-4/5.png'
      ]
    },
    {
      category: 'THIẾT KẾ',
      role: '/ GRAPHIC DESIGNER / CONTENT',
      title: lang === 'vi' ? 'Social Media Post - "F-Photo Thay Áo Mới"' : 'Social Media Post - "F-Photo New Look"',
      desc: lang === 'vi' ? 'Ấn phẩm phục vụ mục đích truyền thông của CLB F-Photo.' : 'Media publication for F-Photography Club.',
      link: 'https://www.behance.net/gallery/236223287/SOCIAL-MEDIA-POST-F-PHOTO-THAY-AO-MI',
      logo: '/images/design-3/1.png',
      mainImg: '/images/design-3/2.png',
      images: [
        '/images/design-3/1.png',
        '/images/design-3/3.png',
        '/images/design-3/4.png',
        '/images/design-3/5.png'
      ]
    },
    {
      category: 'THIẾT KẾ',
      role: '/ GRAPHIC DESIGNER / CONTENT',
      title: lang === 'vi' ? 'Magazine - "Tạp chí F-Star Phương Nghi"' : 'Magazine - "F-Star Phuong Nghi Magazine"',
      desc: lang === 'vi' ? 'Ấn phẩm được lựa chọn đăng tải trên Tập san kiến đọc.' : 'Publication selected to be featured in the "Kien Doc" Journal.',
      link: 'https://www.behance.net/gallery/236216401/MAGAZINE-F-STAR-PHUONG-NGHI',
      logo: '/images/design-2/1.png',
      mainImg: '/images/design-2/1.png',
      images: [
        '/images/design-2/2.png',
        '/images/design-2/3.png',
        '/images/design-2/4.png',
        '/images/design-2/5.png'
      ]
    },
    {
      category: 'THIẾT KẾ',
      role: '/ GRAPHIC DESIGNER / CONTENT',
      title: lang === 'vi' ? 'Một số dự án design khác' : 'Other design projects',
      desc: lang === 'vi' ? 'Ấn phẩm phục vụ mục đích truyền thông của F-Photo & KN Production.' : 'Media publication for F-Photography Club & KN Production.',
      link: 'https://www.behance.net/gallery/244426789/SOCIAL-MEDIA-POST-KIEU-KN-PRODUCTION',
      logo: '/images/design-1/4.png',
      mainImg: '/images/design-1/1.png',
      images: [
        '/images/design-1/4.png',
        '/images/design-1/2.png',
        '/images/design-1/3.png',
        '/images/design-1/5.png'
      ]
    },
    {
      category: 'SỰ KIỆN',
      role: lang === 'vi' ? '/ QUẢN LÝ DỰ ÁN / BAN TỔ CHỨC' : '/ PROJECT MANAGER / ORGANIZING COMMITTEE',
      title: lang === 'vi' ? 'Sự kiện chiếu phim đặc biệt - Chào mừng tết Nguyên đán 2026' : 'Special Movie Screening Event - Lunar New Year 2026',
      desc: lang === 'vi' ? 'Chào đón xuân Bính Ngọ 2026, CLB Nhiếp ảnh F-Photography, CLB Nấu ăn F-Chef và CLB Tâm lý F-Heart "bắt tay" tổ chức buổi công chiếu phim Tết đặc biệt: “NHÀ BÀ NỮ”.' : 'To celebrate the Year of the Horse 2026, F-Photography Club, F-Chef Club, and F-Heart Club collaborated for the first time to host a special Lunar New Year movie screening: "NHA BA NU".',
      link: 'https://www.facebook.com/share/p/1NFeGFSmao/',
      logo: '/images/project-4/2.png',
      mainVideo: 'https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1387063549363314%2F&show_text=false&width=560&t=0',
      mainImg: '/images/project-4/1.png',
      images: [
        '/images/project-4/1.png',
        '/images/project-4/3.jpg',
        '/images/project-4/4.jpg',
        '/images/project-4/5.jpg'
      ]
    },
    {
      category: 'SỰ KIỆN',
      role: lang === 'vi' ? '/ QUẢN LÝ DỰ ÁN / BAN TỔ CHỨC' : '/ PROJECT MANAGER / ORGANIZING COMMITTEE',
      title: lang === 'vi' ? 'Sự kiện giao lưu CLB F-Photography & CLB Nhiếp ảnh THPT BHN' : 'Exchange Event: F-Photography Club & BHN High School Photography Club',
      desc: lang === 'vi' ? 'Buổi giao lưu nhiếp ảnh cùng CLB Nhiếp Ảnh Trường THPT Bùi Hữu Nghĩa.' : 'An exchange session with Bui Huu Nghia High School Photography Club.',
      link: 'https://www.facebook.com/share/p/18sa5xu2Aa/',
      logo: '/images/project-3/1.png',
      mainVideo: 'https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2420607978395005%2F&show_text=false&width=560&t=0',
      mainImg: '/images/project-3/2.png',
      images: [
        '/images/project-3/2.png',
        '/images/project-3/1.png',
        '/images/project-3/4.jpg',
        '/images/project-3/5.jpg'
      ]
    },
    {
      category: 'SỰ KIỆN',
      role: lang === 'vi' ? '/ QUẢN LÝ DỰ ÁN / BAN TỔ CHỨC' : '/ PROJECT MANAGER / ORGANIZING COMMITTEE',
      title: lang === 'vi' ? 'Sự kiện "Photobooth cùng FSchoolers"' : 'Event: "Photobooth with FSchoolers"',
      desc: lang === 'vi' ? 'Dự án Photobooth với sự kết hợp đặc biệt dành riêng cho các bạn học sinh THPT FPT Cần Thơ, cuộc hợp tác giữa CLB nhiếp ảnh F-Photography và Photogenic Vietnam' : 'A special Photobooth project dedicated to FPT Can Tho High School students, in collaboration between F-Photography Club and Photogenic Vietnam.',
      logo: '/images/project-2/1.png',
      link: 'https://www.facebook.com/share/p/1KUKEKgU6v/',
      mainImg: '/images/project-2/1.png',
      images: [
        '/images/project-2/2.png',
        '/images/project-2/3.png',
        '/images/project-2/4.png',
        '/images/project-2/5.png'
      ]
    },
    {
      category: 'SỰ KIỆN',
      role: lang === 'vi' ? '/ QUẢN LÝ DỰ ÁN / BAN TỔ CHỨC' : '/ PROJECT MANAGER / ORGANIZING COMMITTEE',
      title: lang === 'vi' ? 'Cuộc thi ảnh Catch The Moment: Summer 2025' : 'Photo Contest: Catch The Moment: Summer 2025',
      desc: lang === 'vi' ? '“Catch the moment: Summer 2025” là sân chơi dành riêng cho cán bộ nhân viên, giáo viên và học sinh trường THPT FPT Cần Thơ.' : '"Catch the moment: Summer 2025" is an exclusive playground for staff, teachers, and students of FPT Can Tho High School.',
      logo: '/images/project-1/2.png',
      link: 'https://www.facebook.com/share/p/1KNRQsYXUC/',
      mainImg: '/images/project-1/1.png',
      images: [
        '/images/project-1/2.png',
        '/images/project-1/3.png',
        '/images/project-1/4.png',
        '/images/project-1/5.png'
      ]
    },
    {
      category: 'DỰ ÁN',
      role: lang === 'vi' ? '/ QUẢN LÝ DỰ ÁN / DEVELOPER' : '/ PROJECT MANAGER / DEVELOPER',
      title: lang === 'vi' ? 'Dự Án AIGEO - Nền tảng học tập Địa Lý thông minh' : 'AIGEO Project - A Smart Geography Learning Platform',
      desc: lang === 'vi' ? 'Nền tảng học tập Địa Lý thông minh.' : 'A Smart Geography Learning Platform.',
      link: 'https://aigeo.info.vn',
      logo: '/images/dev-4/6.png',
      mainImg: '/images/dev-4/1.png',
      images: [
        '/images/dev-4/2.png',
        '/images/dev-4/3.png',
        '/images/dev-4/4.png',
        '/images/dev-4/5.png'
      ]
    },
    {
      category: 'DỰ ÁN',
      role: lang === 'vi' ? '/ QUẢN LÝ DỰ ÁN / DEVELOPER' : '/ PROJECT MANAGER / DEVELOPER',
      title: lang === 'vi' ? 'Dự Án HopVan - Nền tảng học và luyện thi môn Ngữ Văn' : 'HopVan Project - Literature Learning & Exam Prep Platform',
      desc: lang === 'vi' ? 'Nền tảng học và luyện thi môn Ngữ Văn.' : 'A platform dedicated to Literature learning and exam preparation.',
      mainVideo: 'https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F971032818719526%2F&show_text=false&width=560&t=0',
      link: 'https://hopvan.info.vn',
      logo: 'https://hopvan.info.vn/logo.webp',
      mainImg: '/images/dev-3/1.png',
      images: [
        '/images/dev-3/2.png',
        '/images/dev-3/3.png',
        '/images/dev-3/4.png',
        '/images/dev-3/5.png'
      ]
    },
    {
      category: 'DỰ ÁN',
      role: lang === 'vi' ? '/ QUẢN LÝ DỰ ÁN / DEVELOPER' : '/ PROJECT MANAGER / DEVELOPER',
      title: lang === 'vi' ? 'FPC NEWS - Trang thông tin điện tử CLB F-Photography' : 'FPC NEWS - Information Portal of F-Photography Club',
      desc: lang === 'vi' ? 'Trang thông tin điện tử của CLB F-Photography' : 'Official information portal of the F-Photography Club.',
      link: 'https://fphotography.club/fpcnews',
      logo: 'https://www.fphotography.club/fpcnews/logo-fn.webp',
      mainImg: '/images/dev-2/1.png',
      images: [
        '/images/dev-2/2.png',
        '/images/dev-2/3.png',
        '/images/dev-2/4.png',
        '/images/dev-2/5.png'
      ]
    },
    {
      category: 'DỰ ÁN',
      role: lang === 'vi' ? '/ QUẢN LÝ DỰ ÁN / DEVELOPER' : '/ PROJECT MANAGER / DEVELOPER',
      title: lang === 'vi' ? 'FPC ADMIN - Trang quản trị trực tuyến CLB F-Photography' : 'FPC ADMIN - Online administration page of F-Photography Club',
      desc: lang === 'vi' ? 'Trang quản trị trực tuyến của CLB F-Photography' : 'Online administration page of the F-Photography Club.',
      link: 'https://fphotography.club',
      logo: 'https://www.fphotography.club/logo-black.webp',
      mainImg: '/images/dev-1/1.png',
      images: [
        '/images/dev-1/2.png',
        '/images/dev-1/3.png',
        '/images/dev-1/4.png',
        '/images/dev-1/5.png'
      ]
    }
  ];
  const filteredProjects = activeFilter === 'ALL' ? projects : projects.filter(p => p.category === activeFilter);

  // Dữ liệu thành tích (Giữ nguyên gốc)
  const achievementsData = [
    { level: 'Cấp Quận', titleVi: 'Giải Công nhận Kỳ thi Học sinh giỏi', titleEn: 'Consolation Prize in Excellent Student Competition', metaVi: 'Quận Cái Răng • 2023', metaEn: 'Cai Rang District • 2023', descVi: 'Đoạt giải Công nhận Kỳ thi HSG môn Địa cấp Quận lớp 9.', descEn: 'Won the Consolation Prize in the District-level Geography Excellent Student Competition for 9th Grade.', link:'https://www.facebook.com/photo.php?fbid=632210875573463&set=a.632214185573132&type=3'   },
    { level: 'Cấp Quận', titleVi: 'Giải Ba Cuộc thi Khoa học Kỹ thuật', titleEn: 'Third Prize in Science & Engineering Fair', metaVi: 'Quận Cái Răng • 2023', metaEn: 'Cai Rang District • 2023', descVi: 'Đoạt giải Ba Cuộc thi KHKT cấp Quận lớp 9.', descEn: 'Won Third Prize in the District-level Science and Engineering Fair for 9th Grade.', link:'https://www.facebook.com/photo.php?fbid=632210875573463&set=a.632214185573132&type=3'   },
    { level: 'Cấp trường', titleVi: 'Giải Nhì Cuộc thi Stempetition 2023-2024', titleEn: 'Second Prize in Stempetition 2023-2024', metaVi: 'THPT FPT Cần Thơ • 2023', metaEn: 'FPT High School Can Tho • 2023', descVi: 'Đoạt giải Nhì Cuộc thi Stempetition Cấp trường.', descEn: 'Won Second Prize in the School-level Stempetition.', link:'https://www.facebook.com/share/18owhaRzuX/'   },
    { level: 'Cấp trường', titleVi: 'Đội thi Ấn tượng tại Phiên toà giả định 2023', titleEn: 'Impressive Team in Mock Trial 2023', metaVi: 'THPT FPT Cần Thơ • 2023', metaEn: 'FPT High School Can Tho • 2023', descVi: 'Đoạt giải Ấn tượng Phiên toà giả định Cấp trường.', descEn: 'Won the Impressive Team Award in the School-level Mock Trial.', link:'https://baocantho.com.vn/hoc-sinh-thpt-fpt-mo-phong-nhu-mot-phien-toa-that--a167101.html'   },
    { level: 'Cấp trường', titleVi: 'Top 5 Dự án Xuất sắc nhất Infinity 2023-2024', titleEn: 'Top 5 Best Projects in Infinity 2023-2024', metaVi: 'THPT FPT Cần Thơ • 2024', metaEn: 'FPT High School Can Tho • 2024', descVi: 'Lọt Top 5 Dự án Xuất sắc nhất tại Infinity 2023-2024.', descEn: 'Reached the Top 5 Best Projects at Infinity 2023-2024.', link:'https://www.facebook.com/photo.php?fbid=388413496908109&set=a.380190804397045&type=3'   },
    { level: 'Cấp trường', titleVi: 'Giải Nhì Cuộc thi Stempetition 2024-2025', titleEn: 'Second Prize in Stempetition 2024-2025', metaVi: 'THPT FPT Cần Thơ • 2024', metaEn: 'FPT High School Can Tho • 2024', descVi: 'Đoạt giải Nhì Cuộc thi Stempetition Cấp trường.', descEn: 'Won Second Prize in the School-level Stempetition.', link:'https://www.facebook.com/share/18WZ12PeMA/'   },
    { level: 'Cấp trường', titleVi: 'Giải Ba Cuộc thi FSchooler\'s Tips 2024', titleEn: 'Third Prize in FSchooler\'s Tips 2024', metaVi: 'THPT FPT Cần Thơ • 2024', metaEn: 'FPT High School Can Tho • 2024', descVi: 'Đoạt giải Ba Cuộc thi FSchooler\'s Tips Cấp trường.', descEn: 'Won Third Prize in the School-level FSchooler\'s Tips Competition.', link:'https://www.facebook.com/thpt.fptcantho/posts/pfbid025LqoniJ7NRcqgSTZyMrNNBYNeoSeeyU5BJvCWuh1JGBpCQCZS7zxmE8huKFvTdtml'   },
    { level: 'Cấp trường', titleVi: 'Giải Tiềm năng Cuộc thi Sáng tạo Robot FPT', titleEn: 'Potential Prize in FPT Robot Creation', metaVi: 'THPT FPT Cần Thơ • 2024', metaEn: 'FPT High School Can Tho • 2024', descVi: 'Đoạt giải Tiềm năng Cuộc thi Sáng tạo Robot Cấp trường.', descEn: 'Won the Potential Prize in the School-level Robot Creation Competition.', link:'https://www.facebook.com/photo.php?fbid=447055514637754&set=a.165200976156544&type=3'   },
    { level: 'Cấp trường', titleVi: 'Dự án có thành tích Xuất sắc tại KHKT', titleEn: 'Excellent Project at Science & Engineering Fair', metaVi: 'THPT FPT Cần Thơ • 2024', metaEn: 'FPT High School Can Tho • 2024', descVi: 'Dự án có thành tích Xuất sắc tại KHKT Cấp trường.', descEn: 'Achieved Excellent Project status at the School-level Science and Engineering Fair.', link:'https://www.facebook.com/share/1DffWvUtkM/'   },
    { level: 'Cấp Thành phố', titleVi: 'Giải Nhì Cuộc thi Khoa học Kỹ thuật', titleEn: 'Second Prize in Science & Engineering Fair', metaVi: 'Thành phố Cần Thơ • 2024', metaEn: 'Can Tho City • 2024', descVi: 'Đoạt giải Nhì Cuộc thi KHKT cấp Thành phố.', descEn: 'Won Second Prize in the City-level Science and Engineering Fair.', link:'https://www.facebook.com/share/1CyFisiPT9/'   },
    { level: 'Cấp trường', titleVi: 'Ngày hội Địa lí Đa quốc gia mùa 2', titleEn: 'Multinational Geography Festival Season 2', metaVi: 'THPT FPT Cần Thơ • 2024', metaEn: 'FPT High School Can Tho • 2024', descVi: 'Đoạt Giải Infographic Ấn tượng.', descEn: 'Won the Impressive Infographic Award.', link:'https://www.facebook.com/share/1CypHBod2J/' },
    { level: 'Cấp trường', titleVi: 'Bài viết được đăng tải trên Tập san kiến đọc', titleEn: 'Article published in "Kien Doc" Journal', metaVi: 'THPT FPT Cần Thơ • 2024', metaEn: 'FPT High School Can Tho • 2024', descVi: 'Bài viết được đăng tải trên Tập san kiến đọc 2024.', descEn: 'Article selected and published in the 2024 "Kien Doc" Journal.', link:'https://cantho-school.fpt.edu.vn/tu-hoc-quan-trong-nhu-the-nao-voi-f-schoolers'   },
    { level: 'Cấp trường', titleVi: 'Đoạt giải Nhất kỳ thi HSG Cấp trường', titleEn: 'First Prize in School-level Excellent Student Exam', metaVi: 'THPT FPT Cần Thơ • 2025', metaEn: 'FPT High School Can Tho • 2025', descVi: 'Đoạt giải Nhất kỳ thi chọn HSG môn Địa lý Cấp trường.', descEn: 'Won First Prize in the School-level Geography Excellent Student Competition.', link:'https://www.facebook.com/share/18wBod3h2M/'   },
    { level: 'Cấp Thành phố', titleVi: 'Tham gia kỳ thi Chọn HSG Cấp Thành phố', titleEn: 'Participated in City-level Excellent Student Exam', metaVi: 'Thành phố Cần Thơ • 2025', metaEn: 'Can Tho City • 2025', descVi: 'Tham gia kỳ thi Chọn HSG môn Địa lý cấp Thành phố.', descEn: 'Competed in the City-level Geography Excellent Student Competition.', link:'https://www.facebook.com/share/p/1H5PPphqJV/'   },
    { level: 'Cấp Quốc gia', titleVi: 'Tham gia kỳ thi Olympic Truyền thống 30/04', titleEn: 'Participated in Traditional 30/04 Olympic', metaVi: 'Khu vực Miền Nam • 2025', metaEn: 'Southern Region • 2025', descVi: 'Tham gia kỳ thi Olympic Truyền thống 30/04 tại TP HCM.', descEn: 'Competed in the Traditional 30/04 Olympic Competition in Ho Chi Minh City.', link:'https://www.facebook.com/share/p/1R8jvFcg6R/'   },
    { level: 'Cấp trường', titleVi: 'Top 1 Địa lý - Tiếp sức mùa thi 2025', titleEn: 'Top 1 in Geography - Exam Season Relay 2025', metaVi: 'THPT FPT Cần Thơ • 2025', metaEn: 'FPT High School Can Tho • 2025', descVi: 'Đoạt Top 1 môn Địa lý tại Tiếp sức mùa thi 2025.', descEn: 'Achieved Top 1 in Geography at the Exam Season Relay 2025.', link:'https://www.facebook.com/share/1HB41kAzXK/'   },
    { level: 'Cấp trường', titleVi: 'Cá nhân hoạt động CLB nổi bật HK2', titleEn: 'Outstanding Club Member of Semester 2', metaVi: 'THPT FPT Cần Thơ • 2025', metaEn: 'FPT High School Can Tho • 2025', descVi: 'Cá nhân hoạt động nổi bật HK2 (CLB F-Photography).', descEn: 'Recognized as an Outstanding Member in Semester 2 (F-Photography Club).', link:'https://www.facebook.com/photo.php?fbid=696463473030289&set=a.165200976156544&type=3'   },
    { level: 'Cấp trường', titleVi: 'Đạt danh hiệu Học sinh 3 tốt Cấp trường', titleEn: 'Achieved "Student of 3 Merits" Title', metaVi: 'THPT FPT Cần Thơ • 2025', metaEn: 'FPT High School Can Tho • 2025', descVi: 'Đạt danh hiệu Học sinh 3 tốt Cấp trường 2025.', descEn: 'Awarded the School-level "Student of 3 Merits" Title in 2025.', link:'https://www.facebook.com/share/1E6CPkRYHT/'  },
    { level: 'Cấp trường', titleVi: 'Đạt danh hiệu Talented Student Cấp trường', titleEn: 'Achieved "Talented Student" Title', metaVi: 'THPT FPT Cần Thơ • 2025', metaEn: 'FPT High School Can Tho • 2025', descVi: 'Đạt danh hiệu Talented Student Cấp trường 2025.', descEn: 'Awarded the School-level "Talented Student" Title in 2025.', link:'https://www.facebook.com/share/1CpppKyDrZ/'  },
    { level: 'Cấp trường', titleVi: 'Đoạt giải Ba Cuộc thi ảnh CTM 2025', titleEn: 'Third Prize in CTM Photo Contest 2025', metaVi: 'THPT FPT Cần Thơ • 2025', metaEn: 'FPT High School Can Tho • 2025', descVi: 'Đoạt giải Ba Cuộc thi ảnh Catch The Moment 2025.', descEn: 'Won Third Prize in the Catch The Moment 2025 Photo Contest.', link:'https://www.facebook.com/share/p/1PKQqWkeRW/'  },
    { level: 'Cấp Thành phố', titleVi: 'Tham gia kỳ thi chọn HSG Dự thi Quốc Gia', titleEn: 'Participated in National Excellent Student Team Selection', metaVi: 'Thành phố Cần Thơ • 2025', metaEn: 'Can Tho City • 2025', descVi: 'Tham gia kỳ thi chọn HSG Dự thi cấp Quốc gia.', descEn: 'Participated in the selection exam for the National Excellent Student Team.', link:'https://giaoducthoidai.vn/hon-650-thi-sinh-can-tho-tranh-tai-chon-doi-tuyen-hs-gioi-thpt-du-thi-quoc-gia-post745159.html'  },
    { level: 'Cấp trường', titleVi: 'Câu lạc bộ hoạt động Xuất sắc Tháng 7', titleEn: 'Outstanding Club of July', metaVi: 'THPT FPT Cần Thơ • 2025', metaEn: 'FPT High School Can Tho • 2025', descVi: 'Đạt danh hiệu Câu lạc bộ Xuất sắc Tháng 7.', descEn: 'Awarded the Outstanding Club Title for July.', link:'https://www.facebook.com/share/p/1CXb2FbGyF/' },
    { level: 'Cấp Quốc gia', titleVi: 'Top Dự án được đăng tải trên báo Thanh Niên', titleEn: 'Top Projects featured on Thanh Nien Newspaper', metaVi: 'Cấp Quốc gia • 2025', metaEn: 'National Level • 2025', descVi: 'Top 63 Dự án tại Cuộc thi phim ngắn Vietnamese 2025.', descEn: 'Placed in Top 63 Projects at the Vietnamese Short Film Competition 2025.', link:'https://thanhnien.vn/ap-luc-hoc-duong-phim-ngan-vietnamese-2025-185250704101123674.htm'  },
    { level: 'Cấp trường', titleVi: 'Câu lạc bộ hoạt động Xuất sắc HK 1', titleEn: 'Outstanding Club of Semester 1', metaVi: 'THPT FPT Cần Thơ • 2026', metaEn: 'FPT High School Can Tho • 2026', descVi: 'Đạt danh hiệu Câu lạc bộ Xuất sắc Học kỳ 1.', descEn: 'Awarded the Outstanding Club Title for Semester 1.', link:'https://www.facebook.com/share/p/1bCm9g118k/'  },
    { level: 'Cấp trường', titleVi: 'Giải Nhì Phiên toà giả định 2025-2026', titleEn: 'Second Prize in Mock Trial 2025-2026', metaVi: 'THPT FPT Cần Thơ • 2026', metaEn: 'FPT High School Can Tho • 2026', descVi: 'Đoạt Giải Nhì Phiên toà giả định 2025-2026.', descEn: 'Won Second Prize in the Mock Trial 2025-2026.', link:'https://mientay.giadinhonline.vn/phien-toa-gia-dinh-mua-4-hoc-tro-thpt-fpt-can-tho-lon-len-cung-phap-luat-d16979.html'  },
    { level: 'Cấp Thành phố', titleVi: 'Giải Khuyến khích Kỳ thi Học sinh giỏi', titleEn: 'Consolation Prize in Excellent Student Competition', metaVi: 'Thành phố Cần Thơ • 2026', metaEn: 'Can Tho City • 2026', descVi: 'Đoạt giải Khuyến khích kỳ thi HSG Địa lý Cấp thành phố.', descEn: 'Won Consolation Prize in the City-level Geography Excellent Student Competition.', link:'https://www.facebook.com/share/1B7uLPRzms/' },
    { level: 'Cấp Quốc gia', titleVi: 'Giải Triển vọng Cuộc thi AI Young Guru', titleEn: 'Promising Award in AI Young Guru Competition', metaVi: 'Cấp Quốc gia • 2026', metaEn: 'National Level • 2026', descVi: 'Đoạt giải Triển vọng (Top 30 Quốc gia) AI Young Guru.', descEn: 'Won the Promising Award (Top 30 Nationwide) in AI Young Guru.', link:'https://www.facebook.com/share/1JGwAJnA86/' },
    { level: 'Cấp trường', titleVi: 'Cá nhân hoạt động CLB Xuất sắc', titleEn: 'Outstanding Club Member', metaVi: 'THPT FPT Cần Thơ • 2026', metaEn: 'FPT High School Can Tho • 2026', descVi: 'Cá nhân hoạt động CLB Xuất sắc năm học 2025-2026.', descEn: 'Recognized as an Outstanding Club Member for the 2025-2026 academic year.', link: 'https://www.facebook.com/share/14aX8NjkZgi/' },
    { level: 'Cấp trường', titleVi: 'Câu lạc bộ Truyền thông Xuất sắc', titleEn: 'Outstanding Media Club', metaVi: 'THPT FPT Cần Thơ • 2026', metaEn: 'FPT High School Can Tho • 2026', descVi: 'Đạt danh hiệu CLB Truyền thông Xuất sắc 2025-2026.', descEn: 'Awarded the Outstanding Media Club Title for the 2025-2026 academic year.', link: 'https://www.facebook.com/share/17PE1aFHop/' },
    { level: 'Cấp trường', titleVi: 'Câu lạc bộ Xuất sắc năm học 2025-2026', titleEn: 'Outstanding Club of the 2025-2026 Academic Year', metaVi: 'THPT FPT Cần Thơ • 2026', metaEn: 'FPT High School Can Tho • 2026', descVi: 'Đạt danh hiệu CLB Xuất sắc năm học 2025-2026.', descEn: 'Awarded the Outstanding Club Title for the 2025-2026 academic year.', link: 'https://www.facebook.com/share/17aWfv4WJC/' },
    { level: 'Cấp trường', titleVi: 'Đạt danh hiệu Học sinh 3 tốt Cấp trường', titleEn: 'Achieved "Student of 3 Merits" Title" Title', metaVi: 'THPT FPT Cần Thơ • 2026', metaEn: 'FPT High School Can Tho • 2026', descVi: 'Đạt danh hiệu Học sinh 3 tốt Cấp trường 2026.', descEn: 'Awarded the School-level "Student of 3 Merits" Title in 2026.', link: 'https://www.facebook.com/share/1CkreparF1/' },
    { level: 'Cấp trường', titleVi: 'Đạt danh hiệu Talented Student Cấp trường', titleEn: 'Achieved "Talented Student" Title', metaVi: 'THPT FPT Cần Thơ • 2026', metaEn: 'FPT High School Can Tho • 2026', descVi: 'Đạt danh hiệu Talented Student Cấp trường 2026.', descEn: 'Awarded the School-level "Talented Student" Title in 2026.', link: 'https://www.facebook.com/share/1ENsu2uCbZ/' },
    { level: 'Cấp trường', titleVi: 'Đạt danh hiệu Student GEA Cấp trường', titleEn: 'Student Gaining Excellent Achievement', metaVi: 'THPT FPT Cần Thơ • 2026', metaEn: 'FPT High School Can Tho • 2026', descVi: 'Đạt danh hiệu Student Gaining Excellent Achievement 2026.', descEn: 'Awarded the School-level "Student Gaining Excellent Achievement" Title in 2026.', link: 'https://www.facebook.com/share/1EM3f5dwdx/' },
  ];

  const filteredAchievements = activeAchieveFilter === 'ALL' 
    ? achievementsData 
    : achievementsData.filter(a => a.level === activeAchieveFilter);

  // Framer Motion staggered animations configuration
  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: isMobile ? 0.45 : 0.75, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const timelineVariants = {
    hidden: { opacity: 0, x: isMobile ? -20 : -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: isMobile ? 0.45 : 0.7, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <>
      {/* 0. BLUEPRINT CUSTOM CURSOR */}
      <BlueprintCursor />

      {/* 1. INTERACTIVE CONSTELLATION BACKDROP */}
      <ParticleCanvas />

      {/* 1. MOUSE & SCROLL DYNAMIC MORPH BLOBS */}
      <motion.div className="blob-container" style={{ x: blobX, y: blobY }}>
        <motion.div className="blob blob-1" style={{ y: blobScrollY1 }}></motion.div>
        <motion.div className="blob blob-2" style={{ y: blobScrollY2 }}></motion.div>
        <motion.div className="blob blob-3" style={{ y: blobScrollY3 }}></motion.div>
      </motion.div>

      {/* 2. DYNAMIC SHUTTER GSAP-LIKE LOADER */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div 
            className="loader-wrapper"
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ 
              y: "-100%", 
              transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] } 
            }}
          >
            <motion.h1 
              className="loader-text"
              initial={{ letterSpacing: "50px", filter: "blur(20px)", opacity: 0, scale: 1.4 }}
              animate={{ 
                letterSpacing: ["50px", "12px", "10px", "12px"],
                filter: ["blur(20px)", "blur(0px)", "blur(0px)", "blur(0px)"],
                opacity: [0, 1, 1, 1],
                scale: [1.4, 1, 1.05, 1],
                textShadow: [
                  "0 0 100px rgba(229, 57, 53, 0)",
                  "0 0 15px rgba(229, 57, 53, 0.6)",
                  "4px 1px 0px rgba(229, 57, 53, 0.85), -4px -1px 0px rgba(0, 255, 255, 0.85)", // Glitch slam
                  "0 0 20px rgba(229, 57, 53, 0.6)"
                ]
              }}
              transition={{ duration: 2.2, ease: [0.19, 1, 0.22, 1] }}
            >
              TRÍ NHÂN
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>



      <header className={isScrolled ? 'scrolled' : ''}>
        <div 
          className="logo" 
          style={{ position: 'relative', zIndex: 1001 }}
          onMouseEnter={handleMouseEnterInteractive}
          onMouseLeave={handleMouseLeaveInteractive}
        >
          TRÍ NHÂN<span>.</span>
        </div>
        
        <button 
          className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-links menu-center ${isMobileMenuOpen ? 'open' : ''}`}>
          <a 
            href="#home" 
            className={activeSection === 'home' ? 'active' : ''} 
            onClick={(e) => handleNavClick(e, 'home')}
            onMouseEnter={handleMouseEnterInteractive}
            onMouseLeave={handleMouseLeaveInteractive}
          >
            {t.navHome}
          </a>
          <a 
            href="#timeline" 
            className={activeSection === 'timeline' ? 'active' : ''} 
            onClick={(e) => handleNavClick(e, 'timeline')}
            onMouseEnter={handleMouseEnterInteractive}
            onMouseLeave={handleMouseLeaveInteractive}
          >
            {t.navEdu}
          </a>
          <a 
            href="#achievements" 
            className={activeSection === 'achievements' ? 'active' : ''} 
            onClick={(e) => handleNavClick(e, 'achievements')}
            onMouseEnter={handleMouseEnterInteractive}
            onMouseLeave={handleMouseLeaveInteractive}
          >
            {t.navAward}
          </a>
          <a 
            href="#projects" 
            className={activeSection === 'projects' ? 'active' : ''} 
            onClick={(e) => handleNavClick(e, 'projects')}
            onMouseEnter={handleMouseEnterInteractive}
            onMouseLeave={handleMouseLeaveInteractive}
          >
            {t.navProj}
          </a>
          <a 
            href="#contact" 
            className={activeSection === 'contact' ? 'active' : ''} 
            onClick={(e) => handleNavClick(e, 'contact')}
            onMouseEnter={handleMouseEnterInteractive}
            onMouseLeave={handleMouseLeaveInteractive}
          >
            {t.navContact}
          </a>
        </nav>
        
        <div className="nav-links lang-switch" style={{ position: 'relative', zIndex: 1001 }}>
          <a 
            href="#vi" 
            className={lang === 'vi' ? 'active' : ''} 
            onClick={(e) => { e.preventDefault(); setLang('vi'); }}
            onMouseEnter={handleMouseEnterInteractive}
            onMouseLeave={handleMouseLeaveInteractive}
          >
            VN
          </a> 
          <a 
            href="#en" 
            className={lang === 'en' ? 'active' : ''} 
            onClick={(e) => { e.preventDefault(); setLang('en'); }}
            onMouseEnter={handleMouseEnterInteractive}
            onMouseLeave={handleMouseLeaveInteractive}
          >
            EN
          </a>
        </div>
      </header>

      <main>
        {/* 1. HERO SECTION */}
        <section id="home" className="hero-split">
          <motion.div className="section-bg-num sec-1-num" style={{ y: bgNumY1 }}>01</motion.div>
          <div className="hero-text">
            <motion.span 
              className="sub-title"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {t.heroSub}
            </motion.span>
            
            <h1 className="main-title">
              <CharReveal key={`line1-${lang}`} text={t.heroTitleLine1} delay={0.9} trigger="animate" /> <br />
              <span className="italic-red">
                <CharReveal key={`line2-${lang}`} text={t.heroTitleLine2} delay={1.2} trigger="animate" />
              </span>
            </h1>

            <motion.p 
              className="text-desc" 
              style={{ maxWidth: '650px', marginTop: '25px', marginBottom: '35px', fontSize: '1.15rem' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              {t.heroDesc}
            </motion.p>

            <motion.div 
              className="btn-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              <a 
                href="#projects" 
                className="btn btn-primary"
                onClick={(e) => handleNavClick(e, 'projects')}
                onMouseEnter={handleMouseEnterInteractive}
                onMouseLeave={handleMouseLeaveInteractive}
              >
                {t.btnView}
              </a>
              <a 
                href="#contact" 
                className="btn btn-outline"
                onClick={(e) => handleNavClick(e, 'contact')}
                onMouseEnter={handleMouseEnterInteractive}
                onMouseLeave={handleMouseLeaveInteractive}
              >
                {t.btnConnect}
              </a>
            </motion.div>
          </div>

          <div className="hero-media">
            <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
              <motion.div 
                className="media-card"
                onMouseEnter={handleMouseEnterInteractive}
                onMouseLeave={handleMouseLeaveInteractive}
                style={{ y: heroImageParallax }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <img src="/images/hero.jpg" alt="Profile Hero" />
              </motion.div>

              <motion.div 
                className="floating-badge badge-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                <div className="badge-icon"><i className="fas fa-bolt"></i></div>
                <div className="badge-text">
                  <span className="badge-num">20+</span>
                  <span className="badge-label">
                    {lang === 'vi' ? 'DỰ ÁN & SỰ KIỆN' : 'PROJECTS & EVENTS'}
                  </span>
                </div>
              </motion.div>

              <motion.div 
                className="floating-badge badge-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.7 }}
              >
                <div className="badge-icon"><i className="fas fa-award"></i></div>
                <div className="badge-text">
                  <span className="badge-num">30+</span>
                  <span className="badge-label">
                    {lang === 'vi' ? 'THÀNH TÍCH' : 'ACHIEVEMENTS'}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 2. TIMELINE SECTION */}
        <section id="timeline">
          <motion.div className="section-bg-num sec-2-num" style={{ y: bgNumY2 }}>02</motion.div>
          <div className="grid-2">
            <motion.div 
              className="timeline-col"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              <motion.h3 className="col-title" variants={timelineVariants}>{t.timelineEdu}</motion.h3>
              
              <motion.div className="timeline-item" variants={timelineVariants}>
                <div className="timeline-num">1</div>
                <div className="timeline-content">
                  <h4>
                    <a 
                      href="https://vietmycantho.edu.vn" 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ color: 'inherit', textDecoration: 'none' }} 
                      onMouseEnter={handleMouseEnterInteractive}
                      onMouseLeave={handleMouseLeaveInteractive}
                    >
                      {lang === 'vi' ? 'Trung học Cơ sở' : 'Middle School'} <i className="fas fa-link" style={{ fontSize: '0.9rem', marginLeft: '5px', opacity: 0.7 }}></i>
                    </a>
                  </h4>
                  <span className="timeline-meta">
                    {lang === 'vi' ? 'Trường Phổ thông Việt Mỹ • 8/2019 - 6/2023' : 'Viet My Secondary School • 2019 - 2023'}
                  </span>
                  <p className="text-desc">
                    {lang === 'vi' ? 'Đạt danh hiệu học sinh giỏi 4 năm liên tiếp, tốt nghiệp THCS xếp loại Giỏi, hạnh kiểm Tốt. Đạt nhiều giải thưởng trong các cuộc thi.' : 'Graduated with High Distinction, achieved Excellent Student title for 4 consecutive years, and maintained Excellent conduct. Won multiple awards in various competitions.'}
                  </p>
                </div>
              </motion.div>

              <motion.div className="timeline-item" variants={timelineVariants}>
                <div className="timeline-num">2</div>
                <div className="timeline-content">
                  <h4>
                    <a 
                      href="https://cantho-school.fpt.edu.vn" 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ color: 'inherit', textDecoration: 'none' }} 
                      onMouseEnter={handleMouseEnterInteractive}
                      onMouseLeave={handleMouseLeaveInteractive}
                    >
                      {lang === 'vi' ? 'Trung học Phổ thông' : 'High School'} <i className="fas fa-link" style={{ fontSize: '0.9rem', marginLeft: '5px', opacity: 0.7 }}></i>
                    </a>
                  </h4>
                  <span className="timeline-meta">
                    {lang === 'vi' ? 'Trường THPT FPT Cần Thơ • 8/2023 - 6/2026' : 'FPT High School Can Tho • 2023 - 2026'}
                  </span>
                  <p className="text-desc">
                    {lang === 'vi' ? 'Đạt danh hiệu học sinh giỏi 3 năm liên tiếp, tốt nghiệp THPT xếp loại Tốt, hạnh kiểm Tốt. Đạt nhiều giải thưởng trong các cuộc thi.' : 'Achieved Excellent Student title for 3 consecutive years, graduated with High Distinction, and maintained Excellent conduct. Won multiple awards in various competitions.'}
                  </p>
                </div>
              </motion.div>

              <motion.div className="timeline-item" variants={timelineVariants}>
                <div className="timeline-num">3</div>
                <div className="timeline-content">
                  <h4>
                    <a 
                      href="https://www.vlu.edu.vn" 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ color: 'inherit', textDecoration: 'none' }} 
                      onMouseEnter={handleMouseEnterInteractive}
                      onMouseLeave={handleMouseLeaveInteractive}
                    >
                      {lang === 'vi' ? 'Truyền thông Đa phương tiện' : 'Multimedia Communications Major'} <i className="fas fa-link" style={{ fontSize: '0.9rem', marginLeft: '5px', opacity: 0.7 }}></i>
                    </a>
                  </h4>
                  <span className="timeline-meta">
                    {lang === 'vi' ? 'Trường Đại Học Văn Lang • 2026 -  Nay' : 'FPT High School Can Tho • 2026 - Present'}
                  </span>
                  <p className="text-desc">
                    {lang === 'vi' ? 'Học bổng Tài Năng VLU 2026' : 'Awarded the VLU Talent Scholarship 2026'}
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="timeline-col"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              <motion.h3 className="col-title" variants={timelineVariants}>{t.timelineExp}</motion.h3>
              
              <motion.div className="timeline-item" variants={timelineVariants}>
                <div className="timeline-num">1</div>
                <div className="timeline-content">
                  <h4>
                    <a 
                      href="https://www.facebook.com/KNProduction1" 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ color: 'inherit', textDecoration: 'none' }} 
                      onMouseEnter={handleMouseEnterInteractive}
                      onMouseLeave={handleMouseLeaveInteractive}
                    >
                      {lang === 'vi' ? 'Sáng lập và phát triển' : 'Founder & Developer'} <i className="fas fa-link" style={{ fontSize: '0.9rem', marginLeft: '5px', opacity: 0.7 }}></i>
                    </a>
                  </h4>
                  <span className="timeline-meta">
                    {lang === 'vi' ? 'KN Production • 3/2024 - Nay' : 'KN Production • 3/2024 - Present'}
                  </span>
                  <p className="text-desc">
                    {lang === 'vi' ? 'Quản lý truyền thông và nội dung Fanpage, thiết kế ấn phẩm và lên kịch bản cho các dự án truyền thông.' : 'Responsible for content and communication strategy on the Fanpage, creating visuals, and scripting multimedia projects.'}
                  </p>
                </div>
              </motion.div>

              <motion.div className="timeline-item" variants={timelineVariants}>
                <div className="timeline-num">2</div>
                <div className="timeline-content">
                  <h4>
                    <a 
                      href="https://fphotography.club" 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ color: 'inherit', textDecoration: 'none' }} 
                      onMouseEnter={handleMouseEnterInteractive}
                      onMouseLeave={handleMouseLeaveInteractive}
                    >
                      {lang === 'vi' ? 'Phó Chủ nhiệm và Đồng sáng lập' : 'Vice President & Co-founder'} <i className="fas fa-link" style={{ fontSize: '0.9rem', marginLeft: '5px', opacity: 0.7 }}></i>
                    </a>
                  </h4>
                  <span className="timeline-meta">
                    {lang === 'vi' ? 'CLB Nhiếp ảnh F-Photography • 3/2024 - 4/2026' : 'F-Photography Club • 3/2024 - 4/2026'}
                  </span>
                  <p className="text-desc">
                    {lang === 'vi' ? 'Tham gia quản lý CLB. Tổ chức thiết kế ấn phẩm truyền thông và lên kế hoạch cho các dự án thuộc Câu lạc bộ.' : 'Co-managed club operations. Led media content creation and planned various creative club events.'}
                  </p>
                </div>
              </motion.div>

              <motion.div className="timeline-item" variants={timelineVariants}>
                <div className="timeline-num">3</div>
                <div className="timeline-content">
                  <h4>
                    <a 
                      href="https://hopvan.info.vn" 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ color: 'inherit', textDecoration: 'none' }} 
                      onMouseEnter={handleMouseEnterInteractive}
                      onMouseLeave={handleMouseLeaveInteractive}
                    >
                      Visual & Web Developer <i className="fas fa-link" style={{ fontSize: '0.9rem', marginLeft: '5px', opacity: 0.7 }}></i>
                    </a>
                  </h4>
                  <span className="timeline-meta">
                    {lang === 'vi' ? 'Dự án HopVan • 1/2026 - Nay' : 'HopVan Project • 1/2026 - Present'}
                  </span>
                  <p className="text-desc">
                    {lang === 'vi' ? 'Phụ trách thiết kế, lên ý tưởng truyền thông, lập trình và phát triển hệ thống cho website HopVan.' : 'Handled UI/UX designs, media conceptualization, programming, and system architecture for the HopVan website.'}
                  </p>
                </div>
              </motion.div>

              <motion.div className="timeline-item" variants={timelineVariants}>
                <div className="timeline-num">4</div>
                <div className="timeline-content">
                  <h4>
                    <a 
                      href="https://aigeo.info.vn" 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ color: 'inherit', textDecoration: 'none' }} 
                      onMouseEnter={handleMouseEnterInteractive}
                      onMouseLeave={handleMouseLeaveInteractive}
                    >
                      Front-end Engineer <i className="fas fa-link" style={{ fontSize: '0.9rem', marginLeft: '5px', opacity: 0.7 }}></i>
                    </a>
                  </h4>
                  <span className="timeline-meta">
                    {lang === 'vi' ? 'Dự án AIGEO • 6/2026 - Nay' : 'AIGEO Project • 6/2026 - Present'}
                  </span>
                  <p className="text-desc">
                    {lang === 'vi' ? 'Phụ trách thiết kế, lên ý tưởng truyền thông, phát triển giao diện và tối ưu kỹ thuật cho hệ thống.' : 'Managed UI design, marketing direction, front-end development, and technical optimizations for the platform.'}
                  </p>
                </div>
              </motion.div>

              <motion.div className="timeline-item" variants={timelineVariants}>
                <div className="timeline-num">5</div>
                <div className="timeline-content">
                  <h4>
                    <a 
                      href="https://www.facebook.com/dialithaygeo" 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ color: 'inherit', textDecoration: 'none' }} 
                      onMouseEnter={handleMouseEnterInteractive}
                      onMouseLeave={handleMouseLeaveInteractive}
                    >
                      Admin <i className="fas fa-link" style={{ fontSize: '0.9rem', marginLeft: '5px', opacity: 0.7 }}></i>
                    </a>
                  </h4>
                  <span className="timeline-meta">
                    {lang === 'vi' ? 'ĐỊA LÍ THẦY GEO • 7/2026 - Nay' : 'DIA LI THAY GEO • 7/2026 - Present'}
                  </span>
                  <p className="text-desc">
                    {lang === 'vi' ? 'Phụ trách thiết kế các ấn phẩm, lên ý tưởng truyền thông và quản lý các bài đăng trên Fanpage và kênh Tiktok ĐỊA LÍ THẦY GEO.' : 'Responsible for designing visual materials, developing communication concepts, and managing posts on the "DIA LI THAY GEO" Fanpage and TikTok channel.'}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 3. ACHIEVEMENTS SECTION */}
        <section id="achievements">
          <motion.div className="section-bg-num sec-3-num" style={{ y: bgNumY3 }}>03</motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px', marginBottom: '40px' }}>
             <div className="title-wrapper">
               <span className="sub-title">{t.achieveSub}</span>
               <h2 className="section-title" style={{ marginBottom: 0 }}>
                 <CharReveal key={`ach-title-${lang}`} text={t.achieveTitle1} /> <span className="italic-red">{t.achieveTitle2}</span>
               </h2>
             </div>
          </div>

          <div className="achieve-accordion-container">
            {/* 01. MIDDLE & HIGH SCHOOL SECTION */}
            <div className={`accordion-item ${isSchoolExpanded ? 'expanded' : ''}`}>
              <div className="accordion-tab">
                <i className="far fa-folder-open" style={{ fontSize: '0.7rem' }}></i>
                <span className="tab-meta">SYS.ACHV_01</span>
              </div>
              <div className="accordion-corner tl"></div>
              <div className="accordion-corner tr"></div>
              <div className="accordion-corner bl"></div>
              <div className="accordion-corner br"></div>
              <div className="achieve-top-accent"></div>

              <button 
                className={`accordion-header ${isSchoolExpanded ? 'expanded' : ''}`}
                onClick={() => setIsSchoolExpanded(!isSchoolExpanded)}
                onMouseEnter={handleMouseEnterInteractive}
                onMouseLeave={handleMouseLeaveInteractive}
              >
                <div className="accordion-header-left">
                  <span className="accordion-num">//01</span>
                  <span className="accordion-title">
                    {lang === 'vi' ? 'Trung học Cơ sở & Trung học Phổ thông' : 'Middle & High School'}
                  </span>
                </div>
                <div className="accordion-header-right">
                  <div className="status-indicator">
                    <span className={`status-dot ${isSchoolExpanded ? 'online' : 'offline'}`}></span>
                    <span>{isSchoolExpanded ? 'ACTIVE' : 'STANDBY'}</span>
                  </div>
                  <div className="accordion-badge">
                    <i className="far fa-calendar-alt" style={{ marginRight: '6px', fontSize: '0.75rem' }}></i>
                    <span className="badge-text">2019 - 2026</span>
                  </div>
                  <span className="accordion-status">
                    {isSchoolExpanded ? '[-] COLLAPSE' : '[+] EXPAND'}
                  </span>
                  <i className={`fas fa-chevron-down accordion-arrow ${isSchoolExpanded ? 'rotated' : ''}`}></i>
                </div>
              </button>
              
              <AnimatePresence initial={false}>
                {isSchoolExpanded && (
                  <motion.div
                    key="school-content"
                    className="accordion-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="accordion-content-inner">
                      {/* Filter category buttons inside the school panel */}
                      <div 
                        className="filter-container" 
                        onMouseEnter={handleMouseEnterInteractive} 
                        onMouseLeave={handleMouseLeaveInteractive} 
                        style={{ margin: '0 0 30px 0' }}
                      >
                        <button className={`filter-btn ${activeAchieveFilter === 'ALL' ? 'active' : ''}`} onClick={() => setActiveAchieveFilter('ALL')}>{t.filterAll}</button>
                        <button className={`filter-btn ${activeAchieveFilter === 'Cấp trường' ? 'active' : ''}`} onClick={() => setActiveAchieveFilter('Cấp trường')}>{t.filterSchool}</button>
                        <button className={`filter-btn ${activeAchieveFilter === 'Cấp Quận' ? 'active' : ''}`} onClick={() => setActiveAchieveFilter('Cấp Quận')}>{t.filterDistrict}</button>
                        <button className={`filter-btn ${activeAchieveFilter === 'Cấp Thành phố' ? 'active' : ''}`} onClick={() => setActiveAchieveFilter('Cấp Thành phố')}>{t.filterCity}</button>
                        <button className={`filter-btn ${activeAchieveFilter === 'Cấp Quốc gia' ? 'active' : ''}`} onClick={() => setActiveAchieveFilter('Cấp Quốc gia')}>{t.filterNational}</button>
                      </div>

                      <motion.div 
                        key={`${activeAchieveFilter}-${lang}`}
                        className="grid-2"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                      >
                        {filteredAchievements.map((achieve) => {
                          const hasLink = !!achieve.link;
                          const levelBadges = {
                            'Cấp Quốc gia': { text: lang === 'vi' ? 'CẤP QUỐC GIA' : 'NATIONAL' },
                            'Cấp Thành phố': { text: lang === 'vi' ? 'CẤP THÀNH PHỐ' : 'CITY' },
                            'Cấp Quận': { text: lang === 'vi' ? 'CẤP QUẬN' : 'DISTRICT' },
                            'Cấp trường': { text: lang === 'vi' ? 'CẤP TRƯỜNG' : 'SCHOOL' }
                          };
                          const levelBadge = levelBadges[achieve.level] || { text: achieve.level };

                          return (
                            <motion.div 
                              key={achieve.titleVi} 
                              className="glow-card achieve-card"
                              onClick={() => hasLink && window.open(achieve.link, '_blank')}
                              onMouseEnter={(e) => {
                                handleCardMouseMove(e);
                                if (hasLink) handleMouseEnterInteractive(e);
                              }} 
                              onMouseLeave={(e) => {
                                handleCardMouseLeave(e);
                                if (hasLink) handleMouseLeaveInteractive();
                              }}
                              onMouseMove={handleCardMouseMove}
                              variants={cardVariants}
                              style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                            >
                              <div className="achieve-top-accent"></div>
                              <div className="achieve-bg-watermark">{levelBadge.text}</div>
                              
                              <div className="achieve-icon" style={{ transform: "translateZ(30px)" }}>
                                <i className={{
                                  'Cấp Quốc gia': 'fas fa-trophy',
                                  'Cấp Thành phố': 'fas fa-medal',
                                  'Cấp Quận': 'fas fa-ribbon',
                                  'Cấp trường': 'fas fa-award'
                                }[achieve.level] || 'fas fa-award'}></i>
                              </div>
                              
                              <div className="achieve-info" style={{ transform: "translateZ(20px)" }}>
                                <h4>
                                  {lang === 'vi' ? achieve.titleVi : achieve.titleEn}
                                  {hasLink && <i className="fas fa-external-link-alt" style={{ marginLeft: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}></i>}
                                </h4>
                                <span className="achieve-meta">{lang === 'vi' ? achieve.metaVi : achieve.metaEn}</span>
                                <p className="text-desc">{lang === 'vi' ? achieve.descVi : achieve.descEn}</p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 02. UNIVERSITY SECTION */}
            <div className={`accordion-item ${isUniversityExpanded ? 'expanded' : ''}`}>
              <div className="accordion-tab">
                <i className="far fa-folder" style={{ fontSize: '0.7rem' }}></i>
                <span className="tab-meta">SYS.ACHV_02</span>
              </div>
              <div className="accordion-corner tl"></div>
              <div className="accordion-corner tr"></div>
              <div className="accordion-corner bl"></div>
              <div className="accordion-corner br"></div>
              <div className="achieve-top-accent"></div>

              <button 
                className={`accordion-header ${isUniversityExpanded ? 'expanded' : ''}`}
                onClick={() => setIsUniversityExpanded(!isUniversityExpanded)}
                onMouseEnter={handleMouseEnterInteractive}
                onMouseLeave={handleMouseLeaveInteractive}
              >
                <div className="accordion-header-left">
                  <span className="accordion-num">//02</span>
                  <span className="accordion-title">
                    {lang === 'vi' ? 'Đại học' : 'University'}
                  </span>
                </div>
                <div className="accordion-header-right">
                  <div className="status-indicator">
                    <span className={`status-dot ${isUniversityExpanded ? 'online' : 'offline'}`}></span>
                    <span>{isUniversityExpanded ? 'ACTIVE' : 'STANDBY'}</span>
                  </div>
                  <div className="accordion-badge" style={{ borderColor: 'rgba(255, 255, 255, 0.15)', background: 'rgba(255, 255, 255, 0.03)', color: 'var(--text-muted)' }}>
                    <i className="far fa-calendar-alt" style={{ marginRight: '6px', fontSize: '0.75rem' }}></i>
                    <span className="badge-text">{lang === 'vi' ? '2026 - NAY' : '2026 - PRESENT'}</span>
                  </div>
                  <span className="accordion-status">
                    {isUniversityExpanded ? '[-] COLLAPSE' : '[+] EXPAND'}
                  </span>
                  <i className={`fas fa-chevron-down accordion-arrow ${isUniversityExpanded ? 'rotated' : ''}`}></i>
                </div>
              </button>
              
              <AnimatePresence initial={false}>
                {isUniversityExpanded && (
                  <motion.div
                    key="university-content"
                    className="accordion-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="accordion-content-inner">
                      <div className="empty-state-container">
                        <i className="fas fa-graduation-cap" style={{ fontSize: '2.2rem', color: 'rgba(229, 57, 53, 0.35)', marginBottom: '15px' }}></i>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: "'Courier New', Courier, monospace", margin: 0 }}>
                          {lang === 'vi' 
                            ? '[//SYSTEM.INFO: CHƯA CÓ DỮ LIỆU THÀNH TÍCH BẬC ĐẠI HỌC]' 
                            : '[//SYSTEM.INFO: NO UNIVERSITY ACHIEVEMENTS RECORDED YET]'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 4. PROJECTS SECTION */}
        <section id="projects">
          <motion.div className="section-bg-num sec-4-num" style={{ y: bgNumY4 }}>04</motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px', marginBottom: '40px' }}>
             <div className="title-wrapper">
               <span className="sub-title">{t.projSub}</span>
               <h2 className="section-title" style={{ marginBottom: 0 }}>
                 <CharReveal key={`proj-title-${lang}`} text={t.projTitle1} /><span className="italic-red">{t.projTitle2}</span>
               </h2>
             </div>
          </div>

          <div className="achieve-accordion-container">
            {/* 01. MIDDLE & HIGH SCHOOL SECTION */}
            <div className={`accordion-item ${isProjSchoolExpanded ? 'expanded' : ''}`}>
              <div className="accordion-tab">
                <i className="far fa-folder-open" style={{ fontSize: '0.7rem' }}></i>
                <span className="tab-meta">SYS.PROJ_01</span>
              </div>
              <div className="accordion-corner tl"></div>
              <div className="accordion-corner tr"></div>
              <div className="accordion-corner bl"></div>
              <div className="accordion-corner br"></div>
              <div className="achieve-top-accent"></div>

              <button 
                className={`accordion-header ${isProjSchoolExpanded ? 'expanded' : ''}`}
                onClick={() => setIsProjSchoolExpanded(!isProjSchoolExpanded)}
                onMouseEnter={handleMouseEnterInteractive}
                onMouseLeave={handleMouseLeaveInteractive}
              >
                <div className="accordion-header-left">
                  <span className="accordion-num">//01</span>
                  <span className="accordion-title">
                    {lang === 'vi' ? 'Trung học Phổ thông' : 'High School'}
                  </span>
                </div>
                <div className="accordion-header-right">
                  <div className="status-indicator">
                    <span className={`status-dot ${isProjSchoolExpanded ? 'online' : 'offline'}`}></span>
                    <span>{isProjSchoolExpanded ? 'ACTIVE' : 'STANDBY'}</span>
                  </div>
                  <div className="accordion-badge">
                    <i className="far fa-calendar-alt" style={{ marginRight: '6px', fontSize: '0.75rem' }}></i>
                    <span className="badge-text">2023 - 2026</span>
                  </div>
                  <span className="accordion-status">
                    {isProjSchoolExpanded ? '[-] COLLAPSE' : '[+] EXPAND'}
                  </span>
                  <i className={`fas fa-chevron-down accordion-arrow ${isProjSchoolExpanded ? 'rotated' : ''}`}></i>
                </div>
              </button>
              
              <AnimatePresence initial={false}>
                {isProjSchoolExpanded && (
                  <motion.div
                    key="proj-school-content"
                    className="accordion-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="accordion-content-inner">
                      {/* Filter category buttons inside the school panel */}
                      <div 
                        className="filter-container" 
                        onMouseEnter={handleMouseEnterInteractive} 
                        onMouseLeave={handleMouseLeaveInteractive} 
                        style={{ margin: '0 0 30px 0' }}
                      >
                        <button className={`filter-btn ${activeFilter === 'ALL' ? 'active' : ''}`} onClick={() => setActiveFilter('ALL')}>{t.filterAll}</button>
                        <button className={`filter-btn ${activeFilter === 'VIDEO' ? 'active' : ''}`} onClick={() => setActiveFilter('VIDEO')}>{t.filterVideo}</button>
                        <button className={`filter-btn ${activeFilter === 'THIẾT KẾ' ? 'active' : ''}`} onClick={() => setActiveFilter('THIẾT KẾ')}>{t.filterDesign}</button>
                        <button className={`filter-btn ${activeFilter === 'SỰ KIỆN' ? 'active' : ''}`} onClick={() => setActiveFilter('SỰ KIỆN')}>{t.filterEvent}</button>
                        <button className={`filter-btn ${activeFilter === 'DỰ ÁN' ? 'active' : ''}`} onClick={() => setActiveFilter('DỰ ÁN')}>{t.navProj}</button>
                      </div>

                      <motion.div 
                        key={`${activeFilter}-${lang}`}
                        className="project-grid"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                      >
                        {filteredProjects.map((proj) => {
              const categoryBadges = {
                'VIDEO': { icon: 'fas fa-video', text: 'VIDEO' },
                'THIẾT KẾ': { icon: 'fas fa-palette', text: lang === 'vi' ? 'THIẾT KẾ' : 'DESIGN' },
                'SỰ KIỆN': { icon: 'fas fa-calendar-alt', text: lang === 'vi' ? 'SỰ KIỆN' : 'EVENT' },
                'DỰ ÁN': { icon: 'fas fa-code', text: lang === 'vi' ? 'DỰ ÁN' : 'CODE' }
              };
              const badge = categoryBadges[proj.category] || { icon: 'fas fa-folder', text: proj.category };

              return (
                <motion.div 
                  key={proj.title} 
                  className="glow-card project-showcase-card"
                  onMouseEnter={(e) => {
                    handleCardMouseMove(e);
                    if (proj.category === 'DỰ ÁN' || proj.category === 'SỰ KIỆN') {
                      setHoveredProject(proj.title);
                    }
                  }}
                  onMouseLeave={(e) => {
                    handleCardMouseLeave(e);
                    if (proj.category === 'DỰ ÁN' || proj.category === 'SỰ KIỆN') {
                      setHoveredProject(null);
                    }
                  }}
                  onMouseMove={handleCardMouseMove}
                  variants={cardVariants}
                  style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                >
                  {/* Category Top Accent */}
                  <div className="card-top-accent"></div>

                  {/* Category Background Watermark Icon */}
                  <div className="card-watermark-icon">
                    <i className={badge.icon}></i>
                  </div>

                  {/* Category Corner Badge */}
                  <div className="project-category-badge" style={{ transform: "translateZ(25px)" }}>
                    <i className={badge.icon}></i>
                    <span>{badge.text}</span>
                  </div>

                  {/* Category Blueprint Decors */}
                  {proj.category === 'THIẾT KẾ' && (
                    <div className="design-crop-marks">
                      <div className="crop-mark crop-top-left"></div>
                      <div className="crop-mark crop-top-right"></div>
                      <div className="crop-mark crop-bottom-left"></div>
                      <div className="crop-mark crop-bottom-right"></div>
                    </div>
                  )}

                  {proj.category === 'SỰ KIỆN' && (
                    <div className="event-crosshairs">
                      <div className="event-crosshair cross-top-left">+</div>
                      <div className="event-crosshair cross-top-right">+</div>
                      <div className="event-crosshair cross-bottom-left">+</div>
                      <div className="event-crosshair cross-bottom-right">+</div>
                    </div>
                  )}

                  <div className="project-card-inner" style={{ transform: "translateZ(20px)" }}>
                    <div className="project-header">
                      <img src={proj.logo} alt="Project Logo" className="project-logo" loading="lazy" />
                      <div className="project-title-group">
                        <span className="project-role">
                          {proj.role}
                          {proj.category === 'VIDEO' && <span className="rec-badge">REC</span>}
                          {proj.category === 'THIẾT KẾ' && <span className="canvas-badge">[2.5D VECTOR]</span>}
                          {proj.category === 'SỰ KIỆN' && <span className="location-badge">[//LAT_10.25:LNG_105.7]</span>}
                          {proj.category === 'DỰ ÁN' && <span className="compiler-badge">[//SYS.EXEC_SUCCESS]</span>}
                        </span>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                          <h3 style={{ margin: 0 }}>{proj.title}</h3>
                          {proj.link && (
                            <a 
                              href={proj.link} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="project-link-icon"
                              onMouseEnter={handleMouseEnterInteractive} 
                              onMouseLeave={handleMouseLeaveInteractive}
                              title="Xem dự án thực tế"
                            >
                              <i className="fas fa-external-link-alt"></i>
                            </a>
                          )}
                        </div>

                        <p className="text-desc">{proj.desc}</p>
                        <div className="project-tags">
                          {proj.category === 'VIDEO' && (
                            <>
                              <span className="tag">{lang === 'vi' ? 'EDIT VIDEO' : 'EDIT VIDEO'}</span>
                              <span className="tag">{lang === 'vi' ? 'SÁNG TẠO' : 'CREATIVE'}</span>
                            </>
                          )}
                          {proj.category === 'THIẾT KẾ' && (
                            <>
                              <span className="tag">{lang === 'vi' ? 'THIẾT KẾ' : 'DESIGN'}</span>
                              <span className="tag">{lang === 'vi' ? 'SÁNG TẠO' : 'CREATIVE'}</span>
                            </>
                          )}
                          {proj.category === 'SỰ KIỆN' && (
                            <>
                              <span className="tag">{lang === 'vi' ? 'SỰ KIỆN' : 'EVENT'}</span>
                              <span className="tag">{lang === 'vi' ? 'HOẠT ĐỘNG' : 'ACTIVITY'}</span>
                            </>
                          )}
                          {proj.category === 'DỰ ÁN' && (
                            <>
                              <span className="tag">{lang === 'vi' ? 'DỰ ÁN' : 'PROJECT'}</span>
                              <span className="tag">{lang === 'vi' ? 'LẬP TRÌNH' : 'CODING'}</span>
                              <span className="tag">WEBSITE</span>
                            </>
                          )}
                        </div>

                        {/* Instructional Action Link */}
                        <div className="project-action-link" style={{ transform: "translateZ(25px)" }}>
                          {proj.category === 'VIDEO' && (
                            <span><i className="fas fa-play-circle"></i> {lang === 'vi' ? 'Nhấp để xem phim' : 'Click to watch video'}</span>
                          )}
                          {proj.category === 'THIẾT KẾ' && (
                            <span><i className="fas fa-search-plus"></i> {lang === 'vi' ? 'Nhấp để xem ảnh lớn' : 'Click to enlarge graphic'}</span>
                          )}
                          {proj.category === 'SỰ KIỆN' && (
                            <span><i className="fas fa-images"></i> {lang === 'vi' ? 'Nhấp để xem album sự kiện' : 'Click to view event album'}</span>
                          )}
                          {proj.category === 'DỰ ÁN' && (
                            <span>
                              {proj.link ? (
                                <a href={proj.link} target="_blank" rel="noreferrer" onMouseEnter={handleMouseEnterInteractive} onMouseLeave={handleMouseLeaveInteractive}>
                                  <i className="fas fa-globe"></i> {lang === 'vi' ? 'Ghé thăm Website trực tuyến' : 'Visit Live Website'} <i className="fas fa-external-link-alt" style={{ fontSize: '0.75rem', marginLeft: '3px' }}></i>
                                </a>
                              ) : (
                                <span><i className="fas fa-laptop-code"></i> {lang === 'vi' ? 'Nhấp để xem chi tiết dự án' : 'Click to view project details'}</span>
                              )}
                            </span>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>

                  <div 
                    className="project-gallery" 
                    style={{ transform: "translateZ(30px)" }}
                    onMouseEnter={handleMouseEnterInteractive} 
                    onMouseLeave={handleMouseLeaveInteractive}
                  >
                    <div 
                      className={`gallery-main-container ${
                        proj.category === 'VIDEO' ? 'video-blueprint-container' :
                        proj.category === 'THIẾT KẾ' ? 'design-blueprint-container' :
                        proj.category === 'SỰ KIỆN' ? 'event-blueprint-container' :
                        proj.category === 'DỰ ÁN' ? 'code-blueprint-container' : ''
                      }`}
                      onMouseMove={proj.category === 'THIẾT KẾ' ? (e) => handleCanvasMouseMove(e, proj.title) : undefined}
                    >
                      {/* 1. VIDEO Blueprint decoration */}
                      {proj.category === 'VIDEO' && !activeVideos[proj.title] && (
                        <>
                          <div className="film-sprockets film-sprockets-top"></div>
                          <div className="film-sprockets film-sprockets-bottom"></div>
                          <div className="scrub-timeline">
                            <div className="timeline-controls">
                              <i className="fas fa-backward"></i>
                              <i className="fas fa-play" style={{ margin: '0 5px' }}></i>
                              <i className="fas fa-forward"></i>
                            </div>
                            <div className="timeline-bar">
                              <div className="timeline-progress"></div>
                              <div className="timeline-playhead"></div>
                            </div>
                            <div className="timeline-time">00:03:15 / 00:05:00</div>
                          </div>
                        </>
                      )}

                      {/* 2. DESIGN Blueprint decoration */}
                      {proj.category === 'THIẾT KẾ' && (
                        <>
                          <div className="ruler-x"></div>
                          <div className="ruler-y"></div>
                          <div className="design-toolbar">
                            <div className="design-tool-btn active" title="Select (V)"><i className="fas fa-mouse-pointer"></i></div>
                            <div className="design-tool-btn" title="Hand (H)"><i className="fas fa-hand-paper"></i></div>
                            <div className="design-tool-btn" title="Pen (P)"><i className="fas fa-pen-nib"></i></div>
                            <div className="design-tool-btn" title="Slice (C)"><i className="fas fa-crop-alt"></i></div>
                            <div className="design-tool-btn" title="Paint (B)"><i className="fas fa-paint-brush"></i></div>
                          </div>
                          <div className="design-specs-box">
                            <div>W: 1920px H: 1080px</div>
                            <div>LAYER: VECTOR_PATH</div>
                            <div>OPACITY: 100%</div>
                            <div style={{ color: '#ffffff', fontWeight: 'bold', marginTop: '2px' }}>
                              <span id={`coords-${proj.title.replace(/[^a-zA-Z0-9]/g, '-')}`}>X: 0px Y: 0px</span>
                            </div>
                          </div>
                        </>
                      )}

                      {/* 3. EVENT Blueprint decoration */}
                      {proj.category === 'SỰ KIỆN' && renderEventStub(proj.title)}

                      {/* 4. CODE Blueprint decoration */}
                      {proj.category === 'DỰ ÁN' && (
                        <>
                          <div className="ide-titlebar">
                            <div className="window-dots">
                              <span className="window-dot window-dot-close"></span>
                              <span className="window-dot window-dot-min"></span>
                              <span className="window-dot window-dot-max"></span>
                            </div>
                            <span className="ide-filename">App.jsx - my-portfolio</span>
                          </div>
                          <div className="ide-sidebar">
                            <div className="sidebar-title">WORKSPACE</div>
                            <div className="file-item active"><i className="fab fa-react" style={{ color: '#61dafb' }}></i> App.jsx</div>
                            <div className="file-item"><i className="fab fa-css3-alt" style={{ color: '#264de4' }}></i> App.css</div>
                            <div className="file-item"><i className="fab fa-js-square" style={{ color: '#f7df1e' }}></i> main.jsx</div>
                          </div>
                          <div className="terminal-console">
                            <div className="terminal-header">CONSOLE TERMINAL</div>
                            <div className="terminal-body">
                              {renderTerminalLogs(proj.title)}
                            </div>
                          </div>
                        </>
                      )}

                      {/* The actual image / video component */}
                      {proj.mainVideo ? (
                        <div className="gallery-main fb-video-wrapper">
                          {!activeVideos[proj.title] ? (
                            <div 
                              className="custom-video-thumbnail"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveVideos(prev => ({ ...prev, [proj.title]: true }));
                              }}
                              onMouseEnter={handleMouseEnterInteractive} 
                              onMouseLeave={handleMouseLeaveInteractive}
                            >
                              <img src={proj.mainImg} alt="Video Thumbnail" loading="lazy" />
                              <div className="play-button-overlay">
                                <i className="fas fa-play"></i>
                              </div>
                            </div>
                          ) : (
                            <iframe 
                              src={`${proj.mainVideo}&autoplay=1`}
                              style={{ border: 'none', overflow: 'hidden' }} 
                              scrolling="no" 
                              frameBorder="0" 
                              loading="lazy"
                              allowFullScreen={true} 
                              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            ></iframe>
                          )}
                        </div>
                      ) : (
                        <img 
                          src={proj.mainImg} 
                          alt="Main Visual" 
                          className="gallery-main" 
                          onClick={() => openPopup(proj, proj.mainImg)} 
                          loading="lazy"
                        />
                      )}
                    </div>
                    
                    {proj.images.map((img, i) => (
                      <img 
                        key={i} 
                        src={img} 
                        alt="Mini Gallery" 
                        onClick={() => openPopup(proj, img)} 
                        loading="lazy"
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 02. UNIVERSITY SECTION */}
            <div className={`accordion-item ${isProjUniversityExpanded ? 'expanded' : ''}`}>
              <div className="accordion-tab">
                <i className="far fa-folder" style={{ fontSize: '0.7rem' }}></i>
                <span className="tab-meta">SYS.PROJ_02</span>
              </div>
              <div className="accordion-corner tl"></div>
              <div className="accordion-corner tr"></div>
              <div className="accordion-corner bl"></div>
              <div className="accordion-corner br"></div>
              <div className="achieve-top-accent"></div>

              <button 
                className={`accordion-header ${isProjUniversityExpanded ? 'expanded' : ''}`}
                onClick={() => setIsProjUniversityExpanded(!isProjUniversityExpanded)}
                onMouseEnter={handleMouseEnterInteractive}
                onMouseLeave={handleMouseLeaveInteractive}
              >
                <div className="accordion-header-left">
                  <span className="accordion-num">//02</span>
                  <span className="accordion-title">
                    {lang === 'vi' ? 'Đại học' : 'University'}
                  </span>
                </div>
                <div className="accordion-header-right">
                  <div className="status-indicator">
                    <span className={`status-dot ${isProjUniversityExpanded ? 'online' : 'offline'}`}></span>
                    <span>{isProjUniversityExpanded ? 'ACTIVE' : 'STANDBY'}</span>
                  </div>
                  <div className="accordion-badge" style={{ borderColor: 'rgba(255, 255, 255, 0.15)', background: 'rgba(255, 255, 255, 0.03)', color: 'var(--text-muted)' }}>
                    <i className="far fa-calendar-alt" style={{ marginRight: '6px', fontSize: '0.75rem' }}></i>
                    <span className="badge-text">{lang === 'vi' ? '2026 - NAY' : '2026 - PRESENT'}</span>
                  </div>
                  <span className="accordion-status">
                    {isProjUniversityExpanded ? '[-] COLLAPSE' : '[+] EXPAND'}
                  </span>
                  <i className={`fas fa-chevron-down accordion-arrow ${isProjUniversityExpanded ? 'rotated' : ''}`}></i>
                </div>
              </button>
              
              <AnimatePresence initial={false}>
                {isProjUniversityExpanded && (
                  <motion.div
                    key="proj-university-content"
                    className="accordion-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="accordion-content-inner">
                      <div className="empty-state-container">
                        <i className="fas fa-graduation-cap" style={{ fontSize: '2.2rem', color: 'rgba(229, 57, 53, 0.35)', marginBottom: '15px' }}></i>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: "'Courier New', Courier, monospace", margin: 0 }}>
                          {lang === 'vi' 
                            ? '[//SYSTEM.INFO: CHƯA CÓ DỮ LIỆU DỰ ÁN BẬC ĐẠI HỌC]' 
                            : '[//SYSTEM.INFO: NO UNIVERSITY PROJECTS RECORDED YET]'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 5. CONTACT SECTION */}
        <section id="contact">
          <motion.div className="section-bg-num sec-5-num" style={{ y: bgNumY5 }}>05</motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div className="title-wrapper">
              <span className="sub-title">{t.contactSub}</span>
              <h2 className="section-title" style={{ marginBottom: '15px' }}>
                <CharReveal key={`con-title-${lang}`} text={t.contactTitle1} /> <span className="italic-red">{t.contactTitle2}</span> {t.contactTitle3}
              </h2>
              <p className="text-desc" style={{ maxWidth: '600px' }}>{t.contactDesc}</p>
            </div>
            
            <motion.div 
              className="contact-links-group"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.a 
                href="https://www.facebook.com/tris.nhaan" 
                target="_blank" 
                rel="noreferrer" 
                className="contact-btn" 
                onMouseEnter={handleMouseEnterInteractive} 
                onMouseLeave={handleMouseLeaveInteractive}
                variants={cardVariants}
              >
                <div className="contact-btn-icon"><i className="fab fa-facebook-f"></i></div>
                <div className="contact-btn-content">
                  <span className="contact-btn-label">FACEBOOK</span>
                  <span className="contact-btn-value">Nguyễn Trí Nhân</span>
                </div>
              </motion.a>

              <motion.a 
                href="https://www.instagram.com/n.trisnhaan/" 
                target="_blank" 
                rel="noreferrer" 
                className="contact-btn" 
                onMouseEnter={handleMouseEnterInteractive} 
                onMouseLeave={handleMouseLeaveInteractive}
                variants={cardVariants}
              >
                <div className="contact-btn-icon"><i className="fab fa-instagram"></i></div>
                <div className="contact-btn-content">
                  <span className="contact-btn-label">INSTAGRAM</span>
                  <span className="contact-btn-value">@n.trisnhaan</span>
                </div>
              </motion.a>

              <motion.a 
                href="https://www.tiktok.com/@ng_tri_nhan" 
                target="_blank" 
                rel="noreferrer" 
                className="contact-btn" 
                onMouseEnter={handleMouseEnterInteractive} 
                onMouseLeave={handleMouseLeaveInteractive}
                variants={cardVariants}
              >
                <div className="contact-btn-icon"><i className="fab fa-tiktok"></i></div>
                <div className="contact-btn-content">
                  <span className="contact-btn-label">TIKTOK</span>
                  <span className="contact-btn-value">@ng_tri_nhan</span>
                </div>
              </motion.a>

              <motion.a 
                href="https://www.behance.net/trnhnnguyn2" 
                target="_blank" 
                rel="noreferrer" 
                className="contact-btn" 
                onMouseEnter={handleMouseEnterInteractive} 
                onMouseLeave={handleMouseLeaveInteractive}
                variants={cardVariants}
              >
                <div className="contact-btn-icon"><i className="fab fa-behance"></i></div>
                <div className="contact-btn-content">
                  <span className="contact-btn-label">BEHANCE</span>
                  <span className="contact-btn-value">Nguyễn Trí Nhân</span>
                </div>
              </motion.a>

              <motion.a 
                href="tel:+84335810259" 
                className="contact-btn" 
                onMouseEnter={handleMouseEnterInteractive} 
                onMouseLeave={handleMouseLeaveInteractive}
                variants={cardVariants}
              >
                <div className="contact-btn-icon"><i className="fas fa-phone"></i></div>
                <div className="contact-btn-content">
                  <span className="contact-btn-label">{t.footerPhone}</span>
                  <span className="contact-btn-value">0335 810 259</span>
                </div>
              </motion.a>

              <motion.a 
                href="mailto:ntrinhan712@gmail.com" 
                className="contact-btn" 
                onMouseEnter={handleMouseEnterInteractive} 
                onMouseLeave={handleMouseLeaveInteractive}
                variants={cardVariants}
              >
                <div className="contact-btn-icon"><i className="fas fa-envelope"></i></div>
                <div className="contact-btn-content">
                  <span className="contact-btn-label">EMAIL</span>
                  <span className="contact-btn-value">ntrinhan712@gmail.com</span>
                </div>
              </motion.a>
            </motion.div>
          </div>
        </section>
      </main>

      {/* 6. FOOTER */}
      <footer style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        flexWrap: 'wrap', 
        gap: '40px',
        padding: '60px 5%', 
        borderTop: '1px solid var(--border-color)', 
        marginTop: '50px', 
        maxWidth: '1400px', 
        marginLeft: 'auto', 
        marginRight: 'auto' 
      }}>
        <div style={{ flex: '1 1 250px' }}>
          <div className="footer-logo">TRÍ NHÂN<span>.</span></div>
          <p>© 2026 TRÍ NHÂN PORTFOLIO.</p>
        </div>
        
        <div style={{ flex: '2 1 500px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '30px' }}>
          <div>
            <p style={{ color: 'var(--primary-color)', fontWeight: 700, marginBottom: '15px' }}>{t.footerNav}</p>
            <div className="footer-nav">
              <a href="#timeline" onClick={(e) => handleNavClick(e, 'timeline')} onMouseEnter={handleMouseEnterInteractive} onMouseLeave={handleMouseLeaveInteractive}>{t.navEdu}</a>
              <a href="#achievements" onClick={(e) => handleNavClick(e, 'achievements')} onMouseEnter={handleMouseEnterInteractive} onMouseLeave={handleMouseLeaveInteractive}>{t.navAward}</a>
              <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')} onMouseEnter={handleMouseEnterInteractive} onMouseLeave={handleMouseLeaveInteractive}>{t.navProj}</a>
              <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} onMouseEnter={handleMouseEnterInteractive} onMouseLeave={handleMouseLeaveInteractive}>{t.navContact}</a>
            </div>
          </div>
          
          <div>
            <p style={{ color: 'var(--primary-color)', fontWeight: 700, marginBottom: '15px' }}>{t.footerConnect}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '5px' }}>EMAIL</p>
            <p style={{ fontWeight: 700, marginBottom: '15px', color: 'white' }}>ntrinhan712@gmail.com</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '5px' }}>{t.footerPhone}</p>
            <p style={{ fontWeight: 700, marginBottom: '20px', color: 'white' }}>0335 810 259</p>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '10px' }}>{t.footerSocial}</p>
            <div className="footer-nav" style={{ flexDirection: 'row', gap: '20px' }}>
              <a href="https://www.facebook.com/tris.nhaan" target="_blank" rel="noreferrer" onMouseEnter={handleMouseEnterInteractive} onMouseLeave={handleMouseLeaveInteractive}>FACEBOOK</a>
              <a href="https://www.instagram.com/n.trisnhaan/" target="_blank" rel="noreferrer" onMouseEnter={handleMouseEnterInteractive} onMouseLeave={handleMouseLeaveInteractive}>INSTAGRAM</a>
              <a href="https://www.tiktok.com/@ng_tri_nhan" target="_blank" rel="noreferrer" onMouseEnter={handleMouseEnterInteractive} onMouseLeave={handleMouseLeaveInteractive}>TIKTOK</a>
              <a href="https://www.behance.net/trnhnnguyn2" target="_blank" rel="noreferrer" onMouseEnter={handleMouseEnterInteractive} onMouseLeave={handleMouseLeaveInteractive}>BEHANCE</a>
            </div>
          </div>
        </div>

        <div className="go-top-wrapper" style={{ flex: '1 1 150px', display: 'flex', alignItems: 'flex-end' }}>
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 'auto' }}>
             <motion.button 
               className="go-top" 
               onClick={scrollToTop} 
               onMouseEnter={handleMouseEnterInteractive} 
               onMouseLeave={handleMouseLeaveInteractive}
               whileHover={{ y: -5 }}
               whileTap={{ scale: 0.9 }}
             >
               ↑
             </motion.button>
             <span className="go-top-text">{t.goTop}</span>
           </div>
        </div>
      </footer>

      {/* POPUP LIGHTBOX IMAGE WITH FRAMER MOTION TRANSITIONS */}
      <AnimatePresence>
        {popupData.isOpen && (
          <motion.div 
            className="image-modal active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
          >
            <motion.button 
              className="close-modal" 
              onClick={closePopup}
              whileHover={{ scale: 1.15, color: "var(--primary-color)" }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={handleMouseEnterInteractive}
              onMouseLeave={handleMouseLeaveInteractive}
            >
              &times;
            </motion.button>
            
            {popupData.gallery.length > 1 && (
              <>
                <motion.button 
                  className="nav-btn prev-btn" 
                  onClick={prevImage}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={handleMouseEnterInteractive}
                  onMouseLeave={handleMouseLeaveInteractive}
                >
                  <i className="fas fa-chevron-left"></i>
                </motion.button>
                <motion.button 
                  className="nav-btn next-btn" 
                  onClick={nextImage}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={handleMouseEnterInteractive}
                  onMouseLeave={handleMouseLeaveInteractive}
                >
                  <i className="fas fa-chevron-right"></i>
                </motion.button>
              </>
            )}

            <motion.img 
              key={popupData.currentIndex} // forces animate-in when switching images
              src={popupData.gallery[popupData.currentIndex]} 
              alt="Enlarged Visual" 
              onClick={(e) => e.stopPropagation()} 
              initial={{ scale: 0.92, opacity: 0, rotateZ: -1 }}
              animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;