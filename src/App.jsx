import React, { useState, useEffect, useRef } from 'react';

function App() {
  // =========================================================================
  // 1. GOM TẤT CẢ STATE LÊN ĐÂY (Khai báo 1 lần duy nhất, không trùng lặp)
  // =========================================================================
  const [loading, setLoading] = useState(true);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHoveringBtn, setIsHoveringBtn] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [popupData, setPopupData] = useState({ isOpen: false, gallery: [], currentIndex: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState('vi');

  // =========================================================================
  // 2. BỘ TỪ ĐIỂN SONG NGỮ
  // =========================================================================
  const translations = {
    vi: {
      navHome: "TRANG CHỦ", navEdu: "HỌC VẤN", navAward: "THÀNH TÍCH", navProj: "DỰ ÁN", navContact: "LIÊN HỆ",
      heroSub: "PORTFOLIO", heroTitleLine1: "NGUYỄN", heroTitleLine2: "TRÍ NHÂN",
      heroDesc: "Đây là không gian cá nhân để mình lưu giữ những cột mốc học tập, các hoạt động và dự án tâm huyết.",
      btnView: "XEM DỰ ÁN", btnConnect: "KẾT NỐI NGAY",
      timelineEdu: "HỌC VẤN", timelineExp: "KINH NGHIỆM / HOẠT ĐỘNG",
      achieveSub: "DẤU ẤN CÁ NHÂN", achieveTitle1: "THÀNH TÍCH", achieveTitle2: "NỔI BẬT",
      projTitle: "GÓC DỰ ÁN", projSub: "DANH MỤC SÁNG TẠO",
      filterAll: "TẤT CẢ", filterDesign: "THIẾT KẾ", filterEvent: "SỰ KIỆN",
      contactSub: "LIÊN HỆ", contactTitle1: "HÀNH TRÌNH", contactTitle2: "BẮT ĐẦU", contactTitle3: "TỪ ĐÂY",
      contactDesc: "Nếu bạn có chung sở thích, muốn giao lưu học hỏi hay rủ mình tham gia dự án nào đó, đừng ngại liên hệ nhé!",
      formName: "Họ Tên", formEmail: "Email", formSubject: "Chủ đề liên hệ", formMess: "Lời nhắn", btnSend: "GỬI THÔNG TIN ↗",
      footerNav: "ĐIỀU HƯỚNG", footerConnect: "KẾT NỐI", footerPhone: "ĐIỆN THOẠI", footerSocial: "MẠNG XÃ HỘI", goTop: "Cuộn lên trên"
    },
    en: {
      navHome: "HOME", navEdu: "EDUCATION", navAward: "AWARDS", navProj: "PROJECTS", navContact: "CONTACT",
      heroSub: "PORTFOLIO", heroTitleLine1: "NGUYEN", heroTitleLine2: "TRI NHAN",
      heroDesc: "A personal space where I document my academic journey, extracurricular activities, and passionate projects.",
      btnView: "VIEW WORK", btnConnect: "LET'S TALK",
      timelineEdu: "EDUCATION", timelineExp: "EXPERIENCE / ACTIVITIES",
      achieveSub: "PERSONAL MARKS", achieveTitle1: "OUTSTANDING", achieveTitle2: "ACHIEVEMENTS",
      projTitle: "PROJECT HUB", projSub: "CREATIVE FOLDER",
      filterAll: "ALL", filterDesign: "DESIGN", filterEvent: "EVENTS",
      contactSub: "CONTACT", contactTitle1: "LET'S START", contactTitle2: "THE JOURNEY", contactTitle3: "HERE",
      contactDesc: "If you share the same interests, want to learn together, or collaborate on a project, feel free to reach out!",
      formName: "Full Name", formEmail: "Email", formSubject: "Subject", formMess: "Message", btnSend: "SEND MESSAGE ↗",
      footerNav: "NAVIGATION", footerConnect: "CONNECT", footerPhone: "PHONE", footerSocial: "SOCIAL MEDIA", goTop: "Scroll to top"
    }
  };
  const t = translations[lang];

  // =========================================================================
  // 3. CÁC HÀM XỬ LÝ GIAO DIỆN (Popup, Scroll, Mouse Tracking...)
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

  const observerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2200);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      const glowingCards = document.querySelectorAll('.glow-card');
      glowingCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (loading) return;
    
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible'); 
        }
      });
    }, { threshold: 0.1 }); 

    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.fade-in-section');
      elements.forEach((el, index) => {
        el.style.transitionDelay = `${(index % 3) * 0.1}s`;
        observerRef.current.observe(el);
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loading, activeFilter, lang]); // Đã có biến lang ở đây để đổi ngôn ngữ không bị mất dự án

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      let currentSection = 'home';
      sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 150) {
          currentSection = section.getAttribute('id');
        }
      });
      setActiveSection(currentSection);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Dữ liệu dự án
  const projects = [
    {
      category: 'THIẾT KẾ',
      role: '/ GRAPHIC DESIGNER / CONTENT',
      title: lang === 'vi' ? 'Social Media Post - "Giới thiệu BCN Gen 2.0"' : 'Social Media Post - "Introducing BoD Gen 2.0"',
      desc: lang === 'vi' ? 'Ấn phẩm phục vụ mục đích truyền thông của CLB F-Photo.' : 'Media publication for F-Photography Club.',
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
      title: lang === 'vi' ? 'Design lộn xộn' : 'Messy Design',
      desc: lang === 'vi' ? 'Ấn phẩm phục vụ mục đích truyền thông của F-Photo & KN Production.' : 'Media publication for F-Photography Club & KN Production.',
      link: 'https://www.behance.net/gallery/244426789/SOCIAL-MEDIA-POST-KIEU-KN-PRODUCTION',
      logo: '/images/design-7/4.png',
      mainImg: '/images/design-7/1.png',
      images: [
        '/images/design-7/4.png',
        '/images/design-7/2.png',
        '/images/design-7/3.png',
        '/images/design-7/5.png'
      ]
    },

    {
      category: 'THIẾT KẾ',
      role: '/ GRAPHIC DESIGNER / CONTENT',
      title: lang === 'vi' ? 'ID Card Design - "ID Card CLB F-Photo"' : 'ID Card Design - "F-Photo Club ID Card"',
      desc: lang === 'vi' ? 'Ấn phẩm phục vụ mục đích truyền thông của CLB F-Photo.' : 'Media publication for F-Photography Club.',
      link: 'https://www.behance.net/gallery/240268505/ID-CARD-F-PHOTO',
      logo: '/images/design-6/1.png',
      mainImg: '/images/design-6/1.png',
      images: [
        '/images/design-6/2.png',
        '/images/design-6/3.png',
        '/images/design-6/4.png',
        '/images/design-6/5.png'
      ]
    },

    {
      category: 'THIẾT KẾ',
      role: '/ GRAPHIC DESIGNER / CONTENT',
      title: lang === 'vi' ? 'Key Visual - "Sự Kiện Chiếu Phim Địa Đạo"' : 'Key Visual - "Dia Dao Movie Screening Event"',
      desc: lang === 'vi' ? 'Ấn phẩm phục vụ mục đích truyền thông của CLB F-Photo.' : 'Media publication for F-Photography Club.',
      link: 'https://www.behance.net/gallery/239999329/KEY-VISUAL-CHIU-PHIM-MIN-PHI-DA-DO',
      logo: '/images/design-5/1.png',
      mainImg: '/images/design-5/2.png',
      images: [
        '/images/design-5/1.png',
        '/images/design-5/3.png',
        '/images/design-5/4.png',
        '/images/design-5/5.png'
      ]
    },

    {
      category: 'THIẾT KẾ',
      role: '/ GRAPHIC DESIGNER / CONTENT',
      title: lang === 'vi' ? 'Social Media Post - "Tứ Trụ F-Photography"' : 'Social Media Post - "The Four Pillars of F-Photography"',
      desc: lang === 'vi' ? 'Ấn phẩm phục vụ mục đích truyền thông của CLB F-Photo.' : 'Media publication for F-Photography Club.',
      link: 'https://www.behance.net/gallery/238147195/SOCIAL-MEDIA-POST-T-TR-F-PHOTO',
      logo: '/images/design-4/1.png',
      mainImg: '/images/design-4/2.png',
      images: [
        '/images/design-4/3.png',
        '/images/design-4/4.png',
        '/images/design-4/5.png',
        '/images/design-4/6.png'
      ]
    },

    {
      category: 'THIẾT KẾ',
      role: '/ GRAPHIC DESIGNER / CONTENT',
      title: lang === 'vi' ? 'Social Media Post - "Chiêu mộ thành viên F-Photo"' : 'Social Media Post - "F-Photo Member Recruitment"',
      desc: lang === 'vi' ? 'Ấn phẩm phục vụ mục đích truyền thông của CLB F-Photo.' : 'Media publication for F-Photography Club.',
      link: 'https://www.behance.net/gallery/236224381/SOCIAL-MEDIA-POST-F-PHOTO-CHIEU-M-THANH-VIEN',
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
      title: lang === 'vi' ? 'Social Media Post - "F-Photo Thay Áo Mới"' : 'Social Media Post - "F-Photo New Look"',
      desc: lang === 'vi' ? 'Ấn phẩm phục vụ mục đích truyền thông của CLB F-Photo.' : 'Media publication for F-Photography Club.',
      link: 'https://www.behance.net/gallery/236223287/SOCIAL-MEDIA-POST-F-PHOTO-THAY-AO-MI',
      logo: '/images/design-2/1.png',
      mainImg: '/images/design-2/2.png',
      images: [
        '/images/design-2/1.png',
        '/images/design-2/3.png',
        '/images/design-2/4.png',
        '/images/design-2/5.png'
      ]
    },

    {
      category: 'THIẾT KẾ',
      role: '/ GRAPHIC DESIGNER / CONTENT',
      title: lang === 'vi' ? 'Magazine - "Tạp chí F-Star Phương Nghi"' : 'Magazine - "F-Star Phuong Nghi Magazine"',
      desc: lang === 'vi' ? 'Ấn phẩm được lựa chọn đăng tải trên Tập san kiến đọc.' : 'Publication selected to be featured in the "Kien Doc" Journal.',
      link: 'https://www.behance.net/gallery/236216401/MAGAZINE-F-STAR-PHUONG-NGHI',
      logo: '/images/design-1/1.png',
      mainImg: '/images/design-1/1.png',
      images: [
        '/images/design-1/2.png',
        '/images/design-1/3.png',
        '/images/design-1/4.png',
        '/images/design-1/5.png'
      ]
    },

    {
      category: 'SỰ KIỆN',
      role: lang === 'vi' ? '/ QUẢN LÝ DỰ ÁN / BAN TỔ CHỨC' : '/ PROJECT MANAGER / ORGANIZING COMMITTEE',
      title: lang === 'vi' ? 'Sự kiện chiếu phim đặc biệt - Chào mừng tết Nguyên đán 2026' : 'Special Movie Screening Event - Lunar New Year 2026',
      desc: lang === 'vi' ? 'Chào đón xuân Bính Ngọ 2026, CLB Nhiếp ảnh F-Photography, CLB Nấu ăn F-Chef và CLB Tâm lý F-Heart lần đầu tiên "bắt tay" tổ chức buổi công chiếu phim Tết đặc biệt: “NHÀ BÀ NỮ”.' : 'To celebrate the Year of the Horse 2026, F-Photography Club, F-Chef Cooking Club, and F-Heart Psychology Club collaborated for the first time to host a special Lunar New Year movie screening: "NHA BA NU".',
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
      desc: lang === 'vi' ? 'Buổi giao lưu cùng CLB Nhiếp Ảnh THPT Bùi Hữu Nghĩa – một dịp đặc biệt để các bạn trẻ yêu nhiếp ảnh được gặp gỡ, học hỏi và cùng nhau chia sẻ những câu chuyện sau ống kính.' : 'An exchange session with Bui Huu Nghia High School Photography Club - a special occasion for young photography enthusiasts to meet, learn, and share stories behind the lens.',
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
      desc: lang === 'vi' ? 'Dự án Chạy Photoboth với sự kết hợp đặc biệt dành riêng cho các bạn học sinh THPT FPT Cần Thơ, cuộc hợp tác giữa CLB nhiếp ảnh F-Photography và Photogenic Vietnam' : 'A special Photobooth project dedicated to FPT Can Tho High School students, in collaboration between F-Photography Club and Photogenic Vietnam.',
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
      title: lang === 'vi' ? 'Wibey - Nền tảng xem phim trực tuyến' : 'Wibey - Online Movie Streaming Platform',
      desc: lang === 'vi' ? 'Nền tảng xem phim trực tuyến với giao diện hiện đại.' : 'Online movie streaming platform with a modern interface.',
      link: 'https://wibey.netlify.app',
      logo: '/images/dev-4/1.png',
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
      link: 'https://hopvan.info.vn',
      logo: '/images/dev-3/1.png',
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
      link: 'https://fphotography.club',
      logo: '/images/dev-2/1.png',
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
      title: lang === 'vi' ? 'Wibu Pagoda - Nền tảng viếng chùa online' : 'Wibu Pagoda - Online Temple Visiting Platform',
      desc: lang === 'vi' ? 'Nền tảng viếng chùa online' : 'A platform for visiting temples online.',
      link: 'https://wibupagoda.netlify.app',
      logo: '/images/dev-1/1.png',
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

  return (
    <>
      <div className="blob-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className={`loader-wrapper ${!loading ? 'hidden' : ''}`}>
        <h1 className="loader-text">TRÍ NHÂN</h1>
      </div>

      <div className={`custom-cursor ${isHoveringBtn ? 'hovering' : ''}`} style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}></div>

      {!loading && (
        <>
          {/* Khi isScrolled = true (đang cuộn), nó sẽ tự động thêm chữ 'scrolled' vào */}
          <header className={isScrolled ? 'scrolled' : ''}>
            <div className="logo" style={{ position: 'relative', zIndex: 1001 }}>TRÍ NHÂN<span>.</span></div>
            
            {/* 👉 NÚT HAMBURGER (Chỉ hiện trên Mobile) */}
            <button 
              className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            {/* 👉 DANH MỤC MENU */}
            <nav className={`nav-links menu-center ${isMobileMenuOpen ? 'open' : ''}`} onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
              <a href="#home" className={activeSection === 'home' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>{t.navHome}</a>
              <a href="#timeline" className={activeSection === 'timeline' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>{t.navEdu}</a>
              <a href="#achievements" className={activeSection === 'achievements' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>{t.navAward}</a>
              <a href="#projects" className={activeSection === 'projects' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>{t.navProj}</a>
              <a href="#contact" className={activeSection === 'contact' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>{t.navContact}</a>
            </nav>
            
            {/* Nút VN/EN trên PC */}
            <div className="nav-links lang-switch" style={{ position: 'relative', zIndex: 1001 }}>
              <a href="#vi" 
                 className={lang === 'vi' ? 'active' : ''} 
                 onClick={(e) => { e.preventDefault(); setLang('vi'); }}>VN</a> 
              <a href="#en" 
                 className={lang === 'en' ? 'active' : ''} 
                 onClick={(e) => { e.preventDefault(); setLang('en'); }}>EN</a>
            </div>
          </header>

          <main>
            {/* 1. HERO SECTION */}
            <section id="home" className="hero-split fade-in-section">
              <div className="hero-text">
                <span className="sub-title">{t.heroSub}</span>
                <h1 className="main-title">
                  {t.heroTitleLine1} <br />
                  <span className="italic-red">{t.heroTitleLine2}</span>
                </h1>
                <p className="text-desc" style={{ maxWidth: '650px', marginTop: '25px', marginBottom: '35px', fontSize: '1.15rem' }}>
                  {t.heroDesc}
                </p>
                <div className="btn-group" onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                  <a href="#projects" className="btn btn-primary">{t.btnView}</a>
                  <a href="#contact" className="btn btn-outline">{t.btnConnect}</a>
                </div>
              </div>
              {/* BỎ style position relative ở đây */}
              <div className="hero-media">
                
                {/* 👉 THÊM THẺ NÀY: Khóa tọa độ ôm sát đúng 450px của bức ảnh */}
                <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
                  
                  <div className="media-card" onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                    <img src="/images/hero.jpg" alt="Profile Hero" />
                  </div>

                  {/* Badge 1 */}
                  <div className="floating-badge badge-1">
                    <div className="badge-icon"><i className="fas fa-bolt"></i></div>
                    <div className="badge-text">
                      <span className="badge-num">20+</span>
                      <span className="badge-label">
                        {lang === 'vi' ? 'DỰ ÁN & SỰ KIỆN' : 'PROJECTS & EVENTS'}
                      </span>
                    </div>
                  </div>

                  {/* Badge 2 */}
                  <div className="floating-badge badge-2">
                    <div className="badge-icon"><i className="fas fa-award"></i></div>
                    <div className="badge-text">
                      <span className="badge-num">30+</span>
                      <span className="badge-label">
                        {lang === 'vi' ? 'THÀNH TÍCH' : 'ACHIEVEMENTS'}
                      </span>
                    </div>
                  </div>

                </div>
                {/* 👉 ĐÓNG THẺ KHÓA TỌA ĐỘ */}

              </div>
            </section>

            {/* 2. TIMELINE SECTION (Học vấn & Kinh nghiệm - Có link) */}
            <section id="timeline">
              <div className="grid-2">
                
                {/* --- CỘT HỌC VẤN --- */}
                <div className="timeline-col fade-in-section">
                  <h3 className="col-title">{t.timelineEdu}</h3>
                  
                  <div className="timeline-item">
                    <div className="timeline-num">1</div>
                    <div className="timeline-content">
                      <h4>
                        {/* THAY LINK TRƯỜNG VIỆT MỸ VÀO href */}
                        <a href="https://vietmycantho.edu.vn" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                          {lang === 'vi' ? 'Trung học Cơ sở' : 'Middle School'} <i className="fas fa-link" style={{ fontSize: '0.9rem', marginLeft: '5px', opacity: 0.7 }}></i>
                        </a>
                      </h4>
                      <span className="timeline-meta">
                        {lang === 'vi' ? 'Trường Phổ thông Việt Mỹ • 2019 - 2023' : 'Viet My Secondary School • 2019 - 2023'}
                      </span>
                      <p className="text-desc">
                        {lang === 'vi' ? 'Đạt danh hiệu học sinh giỏi 4 năm liên tiếp, tốt nghiệp THCS loại Giỏi, hạnh kiểm Tốt. Đạt nhiều giải thưởng trong các cuộc thi.' : 'Achieved Excellent Student title for 4 consecutive years, graduated with High Distinction and Excellent conduct. Won multiple awards in various competitions.'}
                      </p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-num">2</div>
                    <div className="timeline-content">
                      <h4>
                        {/* THAY LINK TRƯỜNG FPT VÀO href */}
                        <a href="https://cantho-school.fpt.edu.vn" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                          {lang === 'vi' ? 'Trung học Phổ thông' : 'High School'} <i className="fas fa-link" style={{ fontSize: '0.9rem', marginLeft: '5px', opacity: 0.7 }}></i>
                        </a>
                      </h4>
                      <span className="timeline-meta">
                        {lang === 'vi' ? 'Trường THPT FPT Cần Thơ • 2023 - 2026' : 'FPT High School Can Tho • 2023 - 2026'}
                      </span>
                      <p className="text-desc">
                        {lang === 'vi' ? 'Đạt danh hiệu học sinh giỏi 3 năm liên tiếp, tốt nghiệp THPT loại Giỏi, hạnh kiểm Tốt. Đạt nhiều giải thưởng trong các cuộc thi.' : 'Achieved Excellent Student title for 3 consecutive years, graduated with High Distinction and Excellent conduct. Won multiple awards in various competitions.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* --- CỘT KINH NGHIỆM --- */}
                <div className="timeline-col fade-in-section">
                  <h3 className="col-title">{t.timelineExp}</h3>
                  
                  <div className="timeline-item">
                    <div className="timeline-num">1</div>
                    <div className="timeline-content">
                      <h4>
                        {/* THAY LINK FANPAGE KN PRODUCTION VÀO href */}
                        <a href="https://www.facebook.com/KNProduction1" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                          {lang === 'vi' ? 'Đồng sáng lập và phát triển' : 'Co-founder & Developer'} <i className="fas fa-link" style={{ fontSize: '0.9rem', marginLeft: '5px', opacity: 0.7 }}></i>
                        </a>
                      </h4>
                      <span className="timeline-meta">
                        {lang === 'vi' ? 'KN Production • 2024 - Nay' : 'KN Production • 2024 - Present'}
                      </span>
                      <p className="text-desc">
                        {lang === 'vi' ? 'Quản lý truyền thông và nội dung Fanpage, thiết kế ấn phẩm và lên kịch bản cho các dự án truyền thông.' : 'Manage media and Fanpage content, design publications, and write scripts for media projects.'}
                      </p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-num">2</div>
                    <div className="timeline-content">
                      <h4>
                        {/* THAY LINK CLB F-PHOTO VÀO href */}
                        <a href="https://fphotography.club" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                          {lang === 'vi' ? 'Chủ nhiệm / Co-founder' : 'President / Co-founder'} <i className="fas fa-link" style={{ fontSize: '0.9rem', marginLeft: '5px', opacity: 0.7 }}></i>
                        </a>
                      </h4>
                      <span className="timeline-meta">
                        {lang === 'vi' ? 'CLB Nhiếp ảnh F-Photography • 2024 - 2026' : 'F-Photography Club • 2024 - 2026'}
                      </span>
                      <p className="text-desc">
                        {lang === 'vi' ? 'Tham gia quản lý CLB. Tổ chức thiết kế ấn phẩm truyền thông và lên kế hoạch cho các dự án thuộc Câu lạc bộ.' : 'Manage club operations. Oversee media design and plan projects for the Club.'}
                      </p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-num">3</div>
                    <div className="timeline-content">
                      <h4>
                        {/* THAY LINK HOPVAN VÀO href */}
                        <a href="https://hopvan.info.vn" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                          Visual & Web Developer <i className="fas fa-link" style={{ fontSize: '0.9rem', marginLeft: '5px', opacity: 0.7 }}></i>
                        </a>
                      </h4>
                      <span className="timeline-meta">
                        {lang === 'vi' ? 'Dự án HopVan • 2026 - Nay' : 'HopVan Project • 2026 - Present'}
                      </span>
                      <p className="text-desc">
                        {lang === 'vi' ? 'Phụ trách thiết kế, lên ý tưởng truyền thông, lập trình và phát triển hệ thống cho website HopVan.' : 'In charge of design, media ideation, programming, and system development for the HopVan website.'}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* 3. ACHIEVEMENTS SECTION (Thành tích - Cấu trúc lưới Thẻ - Ảnh 2) */}
            <section id="achievements">
              <div className="fade-in-section" style={{ textAlign: 'center', marginBottom: '60px' }}>
                <span className="sub-title">{t.achieveSub}</span>
                <h2 className="section-title">{t.achieveTitle1} <span className="italic-red">{t.achieveTitle2}</span></h2>
              </div>
              <div className="grid-2">
                
                {/* Thành tích 1 */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Giải Công nhận Kỳ thi Học sinh giỏi' : 'Consolation Prize in Excellent Student Competition'}</h4>
                    <span>{lang === 'vi' ? 'Quận Cái Răng • 2023' : 'Cai Rang District • 2023'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Đoạt giải Công nhận Kỳ thi HSG môn Địa cấp Quận lớp 9.' : 'Won the Consolation Prize in the District-level Geography Excellent Student Competition for 9th Grade.'}</p>
                  </div>
                </div>

                {/* Thành tích 2 */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Giải Ba Cuộc thi Khoa học Kỹ thuật' : 'Third Prize in Science & Engineering Fair'}</h4>
                    <span>{lang === 'vi' ? 'Quận Cái Răng • 2023' : 'Cai Rang District • 2023'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Đoạt giải Ba Cuộc thi KHKT cấp Quận lớp 9.' : 'Won Third Prize in the District-level Science and Engineering Fair for 9th Grade.'}</p>
                  </div>
                </div>

                {/* Thành tích 3 */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Giải Nhì Cuộc thi Stempetition 2023-2024' : 'Second Prize in Stempetition 2023-2024'}</h4>
                    <span>{lang === 'vi' ? 'THPT FPT Cần Thơ • 2023' : 'FPT High School Can Tho • 2023'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Đoạt giải Nhì Cuộc thi Stempetition Cấp trường.' : 'Won Second Prize in the School-level Stempetition.'}</p>
                  </div>
                </div>

                {/* Thành tích 4 */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Đội thi Ấn tượng tại Phiên toà giả định 2023' : 'Impressive Team in Mock Trial 2023'}</h4>
                    <span>{lang === 'vi' ? 'THPT FPT Cần Thơ • 2023' : 'FPT High School Can Tho • 2023'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Đoạt giải Ấn tượng Phiên toà giả định Cấp trường.' : 'Won the Impressive Team Award in the School-level Mock Trial.'}</p>
                  </div>
                </div>

                {/* Thành tích 5 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Top 5 Dự án Xuất sắc nhất Infinity 2023-2024' : 'Top 5 Best Projects in Infinity 2023-2024'}</h4>
                    <span>{lang === 'vi' ? 'THPT FPT Cần Thơ • 2024' : 'FPT High School Can Tho • 2024'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Lọt Top 5 Dự án Xuất sắc nhất tại Infinity 2023-2024.' : 'Reached the Top 5 Best Projects at Infinity 2023-2024.'}</p>
                  </div>
                </div>

                {/* Thành tích 6 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Giải Nhì Cuộc thi Stempetition 2024-2025' : 'Second Prize in Stempetition 2024-2025'}</h4>
                    <span>{lang === 'vi' ? 'THPT FPT Cần Thơ • 2024' : 'FPT High School Can Tho • 2024'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Đoạt giải Nhì Cuộc thi Stempetition Cấp trường.' : 'Won Second Prize in the School-level Stempetition.'}</p>
                  </div>
                </div>

                {/* Thành tích 7 */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Giải Ba Cuộc thi FSchooler\'s Tips 2024' : 'Third Prize in FSchooler\'s Tips 2024'}</h4>
                    <span>{lang === 'vi' ? 'THPT FPT Cần Thơ • 2024' : 'FPT High School Can Tho • 2024'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Đoạt giải Ba Cuộc thi FSchooler\'s Tips Cấp trường.' : 'Won Third Prize in the School-level FSchooler\'s Tips Competition.'}</p>
                  </div>
                </div>

                {/* Thành tích 8 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Giải Tiềm năng Cuộc thi Sáng tạo Robot FPT' : 'Potential Prize in FPT Robot Creation'}</h4>
                    <span>{lang === 'vi' ? 'THPT FPT Cần Thơ • 2024' : 'FPT High School Can Tho • 2024'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Đoạt giải Tiềm năng Cuộc thi Sáng tạo Robot Cấp trường.' : 'Won the Potential Prize in the School-level Robot Creation Competition.'}</p>
                  </div>
                </div>

                {/* Thành tích 9 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Dự án có thành tích Xuất sắc tại KHKT' : 'Excellent Project at Science & Engineering Fair'}</h4>
                    <span>{lang === 'vi' ? 'THPT FPT Cần Thơ • 2024' : 'FPT High School Can Tho • 2024'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Dự án có thành tích Xuất sắc tại KHKT Cấp trường.' : 'Achieved Excellent Project status at the School-level Science and Engineering Fair.'}</p>
                  </div>
                </div>

                {/* Thành tích 10 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Giải Nhì Cuộc thi Khoa học Kỹ thuật' : 'Second Prize in Science & Engineering Fair'}</h4>
                    <span>{lang === 'vi' ? 'Thành phố Cần Thơ • 2024' : 'Can Tho City • 2024'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Đoạt giải Nhì Cuộc thi KHKT cấp Thành phố.' : 'Won Second Prize in the City-level Science and Engineering Fair.'}</p>
                  </div>
                </div>

                {/* Thành tích 11 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Ngày hội Địa lí Đa quốc gia mùa 2' : 'Multinational Geography Festival Season 2'}</h4>
                    <span>{lang === 'vi' ? 'THPT FPT Cần Thơ • 2024' : 'FPT High School Can Tho • 2024'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Đoạt Giải Infographic Ấn tượng.' : 'Won the Impressive Infographic Award.'}</p>
                  </div>
                </div>

                {/* Thành tích 12 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Bài viết được đăng tải trên Tập san kiến đọc' : 'Article published in "Kien Doc" Journal'}</h4>
                    <span>{lang === 'vi' ? 'THPT FPT Cần Thơ • 2024' : 'FPT High School Can Tho • 2024'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Bài viết được đăng tải trên Tập san kiến đọc 2024.' : 'Article selected and published in the 2024 "Kien Doc" Journal.'}</p>
                  </div>
                </div>

                {/* Thành tích 13 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Đoạt giải Nhất kỳ thi HSG Cấp trường' : 'First Prize in School-level Excellent Student Exam'}</h4>
                    <span>{lang === 'vi' ? 'THPT FPT Cần Thơ • 2025' : 'FPT High School Can Tho • 2025'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Đoạt giải Nhất kỳ thi chọn HSG môn Địa lý Cấp trường.' : 'Won First Prize in the School-level Geography Excellent Student Competition.'}</p>
                  </div>
                </div>

                {/* Thành tích 14 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Tham gia kỳ thi Chọn HSG Cấp Thành phố' : 'Participated in City-level Excellent Student Exam'}</h4>
                    <span>{lang === 'vi' ? 'Thành phố Cần Thơ • 2025' : 'Can Tho City • 2025'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Tham gia kỳ thi Chọn HSG môn Địa lý cấp Thành phố.' : 'Competed in the City-level Geography Excellent Student Competition.'}</p>
                  </div>
                </div>

                {/* Thành tích 15 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Tham gia kỳ thi Olympic Truyền thống 30/04' : 'Participated in Traditional 30/04 Olympic'}</h4>
                    <span>{lang === 'vi' ? 'Khu vực Miền Nam • 2025' : 'Southern Region • 2025'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Tham gia kỳ thi Olympic Truyền thống 30/04 tại TP HCM.' : 'Competed in the Traditional 30/04 Olympic Competition in Ho Chi Minh City.'}</p>
                  </div>
                </div>

                {/* Thành tích 16 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Top 1 Địa lý - Tiếp sức mùa thi 2025' : 'Top 1 in Geography - Exam Season Relay 2025'}</h4>
                    <span>{lang === 'vi' ? 'THPT FPT Cần Thơ • 2025' : 'FPT High School Can Tho • 2025'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Đoạt Top 1 môn Địa lý tại Tiếp sức mùa thi 2025.' : 'Achieved Top 1 in Geography at the Exam Season Relay 2025.'}</p>
                  </div>
                </div>

                {/* Thành tích 17 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Cá nhân hoạt động CLB nổi bật HK2' : 'Outstanding Club Member of Semester 2'}</h4>
                    <span>{lang === 'vi' ? 'THPT FPT Cần Thơ • 2025' : 'FPT High School Can Tho • 2025'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Cá nhân hoạt động nổi bật HK2 (CLB F-Photography).' : 'Recognized as an Outstanding Member in Semester 2 (F-Photography Club).'}</p>
                  </div>
                </div>

                {/* Thành tích 18 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Đạt danh hiệu Thanh niên khoẻ Cấp trường' : 'Achieved School-level "Healthy Youth" Title'}</h4>
                    <span>{lang === 'vi' ? 'THPT FPT Cần Thơ • 2025' : 'FPT High School Can Tho • 2025'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Đạt danh hiệu Thanh niên khoẻ Cấp trường 2025.' : 'Awarded the School-level "Healthy Youth" Title in 2025.'}</p>
                  </div>
                </div>

                {/* Thành tích 19 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Đạt danh hiệu Học sinh Ba tốt Cấp trường' : 'Achieved "Student of 3 Merits" Title'}</h4>
                    <span>{lang === 'vi' ? 'THPT FPT Cần Thơ • 2025' : 'FPT High School Can Tho • 2025'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Đạt danh hiệu Học sinh Ba tốt Cấp trường 2025.' : 'Awarded the School-level "Student of 3 Merits" Title in 2025.'}</p>
                  </div>
                </div>

                {/* Thành tích 20 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Đạt danh hiệu Talented Student Cấp trường' : 'Achieved "Talented Student" Title'}</h4>
                    <span>{lang === 'vi' ? 'THPT FPT Cần Thơ • 2025' : 'FPT High School Can Tho • 2025'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Đạt danh hiệu Talented Student Cấp trường 2025.' : 'Awarded the School-level "Talented Student" Title in 2025.'}</p>
                  </div>
                </div>

                {/* Thành tích 21 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Đoạt giải Ba Cuộc thi ảnh CTM 2025' : 'Third Prize in CTM Photo Contest 2025'}</h4>
                    <span>{lang === 'vi' ? 'Câu lạc bộ • 2025' : 'Club Level • 2025'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Đoạt giải Ba Cuộc thi ảnh Catch The Moment 2025.' : 'Won Third Prize in the Catch The Moment 2025 Photo Contest.'}</p>
                  </div>
                </div>

                {/* Thành tích 22 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Tham gia kỳ thi chọn HSG Dự thi Quốc Gia' : 'Participated in National Excellent Student Team Selection'}</h4>
                    <span>{lang === 'vi' ? 'Thành phố Cần Thơ • 2025' : 'Can Tho City • 2025'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Tham gia kỳ thi chọn HSG Dự thi cấp Quốc gia.' : 'Participated in the selection exam for the National Excellent Student Team.'}</p>
                  </div>
                </div>

                {/* Thành tích 23 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Câu lạc bộ hoạt động Xuất sắc Tháng 7' : 'Outstanding Club of July'}</h4>
                    <span>{lang === 'vi' ? 'THPT FPT Cần Thơ • 2025' : 'FPT High School Can Tho • 2025'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Đoạt danh hiệu Câu lạc bộ Xuất sắc Tháng 7.' : 'Awarded the Outstanding Club Title for July.'}</p>
                  </div>
                </div>

                {/* Thành tích 24 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Top 63 Dự án được đăng trên báo Thanh Niên' : 'Top 63 Projects featured on Thanh Nien Newspaper'}</h4>
                    <span>{lang === 'vi' ? 'Cấp Quốc gia • 2025' : 'National Level • 2025'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Top 63 Dự án tại Cuộc thi phim ngắn Vietnamese 2025.' : 'Placed in Top 63 Projects at the Vietnamese Short Film Competition 2025.'}</p>
                  </div>
                </div>

                {/* Thành tích 25 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Câu lạc bộ hoạt động Xuất sắc HK 1' : 'Outstanding Club of Semester 1'}</h4>
                    <span>{lang === 'vi' ? 'THPT FPT Cần Thơ • 2026' : 'FPT High School Can Tho • 2026'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Đoạt danh hiệu Câu lạc bộ Xuất sắc Học kỳ 1.' : 'Awarded the Outstanding Club Title for Semester 1.'}</p>
                  </div>
                </div>

                {/* Thành tích 26 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Giải Nhì Phiên toà giả định 2025-2026' : 'Second Prize in Mock Trial 2025-2026'}</h4>
                    <span>{lang === 'vi' ? 'THPT FPT Cần Thơ • 2026' : 'FPT High School Can Tho • 2026'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Đoạt Giải Nhì Phiên toà giả định 2025-2026.' : 'Won Second Prize in the Mock Trial 2025-2026.'}</p>
                  </div>
                </div>

                {/* Thành tích 27 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Giải Khuyến khích Kỳ thi Học sinh giỏi' : 'Consolation Prize in Excellent Student Competition'}</h4>
                    <span>{lang === 'vi' ? 'Thành phố Cần Thơ • 2026' : 'Can Tho City • 2026'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Đoạt giải Khuyến khích kỳ thi HSG Địa lý Cấp thành phố.' : 'Won Consolation Prize in the City-level Geography Excellent Student Competition.'}</p>
                  </div>
                </div>

                {/* Thành tích 28 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Giải Triển vọng Cuộc thi AI Young Guru' : 'Promising Award in AI Young Guru Competition'}</h4>
                    <span>{lang === 'vi' ? 'Cấp Quốc gia • 2026' : 'National Level • 2026'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Đoạt giải Triển vọng (Top 30 Quốc gia) AI Young Guru.' : 'Won the Promising Award (Top 30 Nationwide) in AI Young Guru.'}</p>
                  </div>
                </div>

                {/* Thành tích 29 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>{lang === 'vi' ? 'Đạt danh hiệu Thanh niên khoẻ Cấp trường' : 'Achieved School-level "Healthy Youth" Title'}</h4>
                    <span>{lang === 'vi' ? 'THPT FPT Cần Thơ • 2026' : 'FPT High School Can Tho • 2026'}</span>
                    <p className="text-desc">{lang === 'vi' ? 'Đạt danh hiệu Thanh niên khoẻ Cấp trường 2026.' : 'Awarded the School-level "Healthy Youth" Title in 2026.'}</p>
                  </div>
                </div>

              </div>
            </section>

            {/* 4. PROJECTS SECTION (Cấu trúc thẻ có Filter & Mini Gallery - Ảnh 3,4,5,6) */}
            <section id="projects">
              <div className="fade-in-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                 <div>
                   <span className="sub-title">{t.projSub}</span>
                   <h2 className="section-title" style={{ marginBottom: 0 }}>
                     {/* Dùng toán tử ba ngôi để tách chữ đỏ cho đẹp */}
                     {lang === 'vi' ? 'GÓC ' : 'PROJECT '}
                     <span className="italic-red">{lang === 'vi' ? 'DỰ ÁN' : 'HUB'}</span>
                   </h2>
                 </div>
                 <div className="filter-container" onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                   <button className={`filter-btn ${activeFilter === 'ALL' ? 'active' : ''}`} onClick={() => setActiveFilter('ALL')}>{t.filterAll}</button>
                   <button className={`filter-btn ${activeFilter === 'THIẾT KẾ' ? 'active' : ''}`} onClick={() => setActiveFilter('THIẾT KẾ')}>{t.filterDesign}</button>
                   <button className={`filter-btn ${activeFilter === 'SỰ KIỆN' ? 'active' : ''}`} onClick={() => setActiveFilter('SỰ KIỆN')}>{t.filterEvent}</button>
                   <button className={`filter-btn ${activeFilter === 'DỰ ÁN' ? 'active' : ''}`} onClick={() => setActiveFilter('DỰ ÁN')}>{t.navProj}</button>
                 </div>
              </div>

              <div className="project-grid">
                {filteredProjects.map((proj) => (
                  <div key={proj.title} className="glow-card project-showcase-card fade-in-section">
                    
                    {/* Header dự án (Logo + Text) */}
                    <div className="project-header">
                      <img src={proj.logo} alt="Project Logo" className="project-logo" />
                      <div className="project-title-group">
                        <span className="project-role">{proj.role}</span>
                        
                        {/* Nhóm Tiêu đề & Nút Link */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                          <h3 style={{ margin: 0 }}>{proj.title}</h3>
                          
                          {/* Kiểm tra nếu dự án có link thì mới hiện Nút Icon */}
                          {proj.link && (
                            <a 
                              href={proj.link} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="project-link-icon"
                              onMouseEnter={() => setIsHoveringBtn(true)} 
                              onMouseLeave={() => setIsHoveringBtn(false)}
                              title="Xem dự án thực tế"
                            >
                              <i className="fas fa-external-link-alt"></i>
                            </a>
                          )}
                        </div>

                        <p className="text-desc">{proj.desc}</p>
                        <div className="project-tags">
                          <span className="tag">{lang === 'vi' ? 'TRUYỀN THÔNG' : 'MEDIA'}</span>
                          <span className="tag">{lang === 'vi' ? 'HOẠT ĐỘNG' : 'ACTIVITY'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Gallery ảnh */}
                    <div className="project-gallery" onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                      
                      {/* ========================================= */}
                      {/* ẢNH CHÍNH HOẶC VIDEO CHÍNH (TỰ ĐỘNG CHUYỂN ĐỔI) */}
                      {proj.mainVideo ? (
                        <div className="gallery-main fb-video-wrapper">
                          <iframe 
                            src={proj.mainVideo} 
                            style={{ border: 'none', overflow: 'hidden' }} 
                            scrolling="no" 
                            frameBorder="0" 
                            allowFullScreen={true} 
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                          ></iframe>
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
                      {/* ========================================= */}
                      
                      {/* Các ảnh nhỏ */}
                      {proj.images.map((img, i) => (
                        <img 
                          key={i} 
                          src={img} 
                          alt="Mini Gallery" 
                          onClick={() => openPopup(proj, img)} 
                          loading="lazy" /* 👉 THÊM DÒNG NÀY */
                        />
                      ))}

                    </div>

                  </div>
                ))}
              </div>
            </section>

            {/* 5. CONTACT SECTION */}
            <section id="contact" className="fade-in-section">
              <div className="grid-2">
                <div>
                  <span className="sub-title">{t.contactSub}</span>
                  <h2 className="section-title">{t.contactTitle1} <br/><span className="italic-red">{t.contactTitle2}</span> {t.contactTitle3}</h2>
                  <p className="text-desc" style={{ marginBottom: '40px' }}>{t.contactDesc}</p>
                  
                  {/* CỤM NÚT LIÊN HỆ MỚI */}
                  <div className="contact-links-group">
                    
                    {/* Nút Facebook */}
                    <a href="https://www.facebook.com/tris.nhaan" target="_blank" rel="noreferrer" className="contact-btn fade-in-section" onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                      <div className="contact-btn-icon"><i className="fab fa-facebook-f"></i></div>
                      <div className="contact-btn-content">
                        <span className="contact-btn-label">FACEBOOK</span>
                        <span className="contact-btn-value">Nguyễn Trí Nhân</span>
                      </div>
                      <i className="fas fa-arrow-right contact-btn-arrow"></i>
                    </a>

                    {/* Nút Email */}
                    <a href="mailto:ntrinhan712@gmail.com" className="contact-btn fade-in-section" onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                      <div className="contact-btn-icon"><i className="fas fa-envelope"></i></div>
                      <div className="contact-btn-content">
                        <span className="contact-btn-label">EMAIL</span>
                        <span className="contact-btn-value">ntrinhan712@gmail.com</span>
                      </div>
                      <i className="fas fa-arrow-right contact-btn-arrow"></i>
                    </a>

                  </div>
                </div>

                {/* Phần Form */}
                <div className="glow-card contact-form">
                  <form 
                    action="https://formspree.io/f/xdabvwpr"
                    method="POST"
                    onMouseEnter={() => setIsHoveringBtn(true)} 
                    onMouseLeave={() => setIsHoveringBtn(false)}
                  >
                    <div className="grid-2" style={{ gap: '20px' }}>
                      <div className="form-group">
                        <label>{t.formName}</label>
                        <input 
                          type="text" 
                          name="name" 
                          placeholder={lang === 'vi' ? 'Nguyễn Văn A' : 'John Doe'} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>{t.formEmail}</label>
                        <input 
                          type="email" 
                          name="email" 
                          placeholder="example@gmail.com" 
                          required 
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>{t.formSubject}</label>
                      <select name="subject">
                        <option value="Tán gẫu / làm quen">{lang === 'vi' ? 'Tán gẫu / làm quen' : 'Just saying Hi'}</option>
                        <option value="Thảo luận dự án">{lang === 'vi' ? 'Thảo luận dự án' : 'Project Discussion'}</option>
                        <option value="Giao lưu học hỏi">{lang === 'vi' ? 'Giao lưu học hỏi' : 'Networking & Learning'}</option>
                        <option value="Khác">{lang === 'vi' ? 'Khác' : 'Other'}</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>{t.formMess}</label>
                      <textarea 
                        name="message" 
                        placeholder={lang === 'vi' ? 'Nhắn lời nhắn của bạn vào đây nhe...' : 'Drop your message here...'} 
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn-submit">{t.btnSend}</button>
                  </form>
                </div>
              </div>
            </section>
          </main>

          {/* 6. FOOTER (Đã fix lỗi dấu ngoặc kép ở link Instagram) */}
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
            {/* Cột 1: Logo */}
            <div style={{ flex: '1 1 250px' }}>
              <div className="footer-logo">TRÍ NHÂN<span>.</span></div>
              <p>© 2026 TRÍ NHÂN PORTFOLIO.</p>
            </div>
            
            {/* Cột 2: Điều hướng & Kết nối */}
            <div style={{ flex: '2 1 500px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '30px' }}>
              <div>
                <p style={{ color: 'var(--primary-color)', fontWeight: 700, marginBottom: '15px' }}>{t.footerNav}</p>
                <div className="footer-nav">
                  {/* Tận dụng lại biến từ điển của Menu */}
                  <a href="#timeline">{t.navEdu}</a>
                  <a href="#achievements">{t.navAward}</a>
                  <a href="#projects">{t.navProj}</a>
                  <a href="#contact">{t.navContact}</a>
                </div>
              </div>
              
              <div>
                <p style={{ color: 'var(--primary-color)', fontWeight: 700, marginBottom: '15px' }}>{t.footerConnect}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '5px' }}>EMAIL</p>
                <p style={{ fontWeight: 700, marginBottom: '15px', color: 'white' }}>ntrinhan712@gmail.com</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '5px' }}>{t.footerPhone}</p>
                <p style={{ fontWeight: 700, marginBottom: '20px', color: 'white' }}>0335 810 259</p>
                
                {/* Thay chữ cứng bằng biến mạng xã hội */}
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '10px' }}>{t.footerSocial}</p>
                <div className="footer-nav" style={{ flexDirection: 'row', gap: '20px' }} onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                  <a href="https://www.facebook.com/tris.nhaan" target="_blank" rel="noreferrer">FACEBOOK</a>
                  <a href="https://www.instagram.com/n.trisnhaan/" target="_blank" rel="noreferrer">INSTAGRAM</a>
                  <a href="https://www.tiktok.com/@ng_tri_nhan" target="_blank" rel="noreferrer">TIKTOK</a>
                  <a href="https://www.behance.net/trnhnnguyn2" target="_blank" rel="noreferrer">BEHANCE</a>
                </div>
              </div>
            </div>

            {/* Cột 3: Nút cuộn lên trên */}
            <div className="go-top-wrapper" style={{ flex: '1 1 150px', display: 'flex', alignItems: 'flex-end' }}>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 'auto' }}>
                 <button className="go-top" onClick={scrollToTop} onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>↑</button>
                 <span className="go-top-text">{t.goTop}</span>
               </div>
            </div>
          </footer>

          {/* 👉 POPUP HÌNH ẢNH (CÓ NÚT NEXT/PREV) */}
          <div 
            className={`image-modal ${popupData.isOpen ? 'active' : ''}`} 
            onClick={closePopup} 
            onMouseEnter={() => setIsHoveringBtn(true)} 
            onMouseLeave={() => setIsHoveringBtn(false)}
          >
            <button className="close-modal" onClick={closePopup}>&times;</button>
            
            {/* Nếu dự án có nhiều hơn 1 ảnh thì mới hiện 2 nút mũi tên */}
            {popupData.isOpen && popupData.gallery.length > 1 && (
              <>
                <button className="nav-btn prev-btn" onClick={prevImage}>
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="nav-btn next-btn" onClick={nextImage}>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </>
            )}

            {/* Hiển thị hình ảnh theo Index hiện tại */}
            {popupData.isOpen && (
              <img 
                src={popupData.gallery[popupData.currentIndex]} 
                alt="Enlarged Visual" 
                onClick={(e) => e.stopPropagation()} 
              />
            )}
          </div>

        </>
      )}
    </>
  );
}

export default App;