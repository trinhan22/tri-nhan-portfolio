import React, { useState, useEffect, useRef } from 'react';

function App() {
  // =========================================================================
  // 1. GOM TẤT CẢ STATE LÊN ĐÂY (Khai báo 1 lần duy nhất, không trùng lặp)
  // =========================================================================
  const [loading, setLoading] = useState(true);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHoveringBtn, setIsHoveringBtn] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [activeAchieveFilter, setActiveAchieveFilter] = useState('ALL');
  const [popupData, setPopupData] = useState({ isOpen: false, gallery: [], currentIndex: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState('vi');
  const [activeVideos, setActiveVideos] = useState({});

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
      projSub: "DANH MỤC SÁNG TẠO", projTitle1: "GÓC ", projTitle2: "DỰ ÁN",
      filterAll: "TẤT CẢ", filterDesign: "THIẾT KẾ", filterEvent: "SỰ KIỆN",
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
      filterAll: "ALL", filterDesign: "DESIGN", filterEvent: "EVENTS",
      filterSchool: "SCHOOL LEVEL", filterDistrict: "DISTRICT LEVEL", filterCity: "CITY LEVEL", filterNational: "NATIONAL LEVEL",
      contactSub: "CONTACT", contactTitle1: "LET'S START", contactTitle2: "THE JOURNEY", contactTitle3: "HERE",
      contactDesc: "If you share the same interests, want to learn together, or collaborate on a project, feel free to reach out!",
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
  // Hàm tắt loading
  const handlePageLoad = () => {
    // Thêm độ trễ nhỏ (500ms) để màn hình loading hoàn thiện mượt mà trước khi ẩn
    setTimeout(() => setLoading(false), 500);
  };

  // Kiểm tra nếu trang web đã tải xong tài nguyên (images, scripts, CSS)
  if (document.readyState === 'complete') {
    handlePageLoad();
  } else {
    // Nếu chưa, lắng nghe sự kiện 'load' của trình duyệt
    window.addEventListener('load', handlePageLoad);
  }

  // Đặt một Fallback Timeout (VD: 8 giây) để an toàn
  // Tránh trường hợp mạng quá kém làm người dùng kẹt ở màn hình Loading vĩnh viễn
  const fallbackTimer = setTimeout(() => {
    setLoading(false);
  }, 8000);

  return () => {
    window.removeEventListener('load', handlePageLoad);
    clearTimeout(fallbackTimer);
  };
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
    // Không cần check if (loading) return; nữa vì DOM đã có sẵn từ đầu
    
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible'); 
        }
      });
    }, { threshold: 0.1 }); 

    // Tăng thời gian chờ lên 100ms để trình duyệt rảnh tay dựng khung trước khi quét hiệu ứng
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.fade-in-section');
      elements.forEach((el, index) => {
        el.style.transitionDelay = `${(index % 3) * 0.1}s`;
        if (observerRef.current) observerRef.current.observe(el); // Thêm check an toàn
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (observerRef.current) observerRef.current.disconnect();
    };
  
  }, [activeFilter, lang, activeAchieveFilter]); // 👈 XÓA BỎ biến 'loading' ở đây đi nhé!

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
      link: 'https://www.facebook.com/share/p/1Da7hQkz8E/',
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
      title: lang === 'vi' ? 'Dự Án HopVan - Nền tảng học và luyện thi môn Ngữ Văn' : 'HopVan Project - Literature Learning & Exam Prep Platform',
      desc: lang === 'vi' ? 'Nền tảng học và luyện thi môn Ngữ Văn.' : 'A platform dedicated to Literature learning and exam preparation.',
      mainVideo: 'https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F971032818719526%2F&show_text=false&width=560&t=0',
      link: 'https://hopvan.info.vn',
      logo: 'https://hopvan.info.vn/logo.webp',
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
      title: lang === 'vi' ? 'FPC NEWS - Trang thông tin điện tử CLB F-Photography' : 'FPC NEWS - Information Portal of F-Photography Club',
      desc: lang === 'vi' ? 'Trang thông tin điện tử của CLB F-Photography' : 'Official information portal of the F-Photography Club.',
      link: 'https://fphotography.club',
      logo: 'https://www.fphotography.club/fpcnews/logo-fn.webp',
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

  // =========================================================================
  // DỮ LIỆU THÀNH TÍCH (Đã phân loại Cấp độ)
  // =========================================================================
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
    { level: 'Cấp trường', titleVi: 'Đoạt giải Ba Cuộc thi ảnh CTM 2025', titleEn: 'Third Prize in CTM Photo Contest 2025', metaVi: 'Câu lạc bộ • 2025', metaEn: 'Club Level • 2025', descVi: 'Đoạt giải Ba Cuộc thi ảnh Catch The Moment 2025.', descEn: 'Won Third Prize in the Catch The Moment 2025 Photo Contest.', link:'https://www.facebook.com/share/p/1PKQqWkeRW/'  },
    { level: 'Cấp Thành phố', titleVi: 'Tham gia kỳ thi chọn HSG Dự thi Quốc Gia', titleEn: 'Participated in National Excellent Student Team Selection', metaVi: 'Thành phố Cần Thơ • 2025', metaEn: 'Can Tho City • 2025', descVi: 'Tham gia kỳ thi chọn HSG Dự thi cấp Quốc gia.', descEn: 'Participated in the selection exam for the National Excellent Student Team.', link:'https://giaoducthoidai.vn/hon-650-thi-sinh-can-tho-tranh-tai-chon-doi-tuyen-hs-gioi-thpt-du-thi-quoc-gia-post745159.html'  },
    { level: 'Cấp trường', titleVi: 'Câu lạc bộ hoạt động Xuất sắc Tháng 7', titleEn: 'Outstanding Club of July', metaVi: 'THPT FPT Cần Thơ • 2025', metaEn: 'FPT High School Can Tho • 2025', descVi: 'Đoạt danh hiệu Câu lạc bộ Xuất sắc Tháng 7.', descEn: 'Awarded the Outstanding Club Title for July.', link:'https://www.facebook.com/share/p/1CXb2FbGyF/' },
    { level: 'Cấp Quốc gia', titleVi: 'Top 63 Dự án được đăng trên báo Thanh Niên', titleEn: 'Top 63 Projects featured on Thanh Nien Newspaper', metaVi: 'Cấp Quốc gia • 2025', metaEn: 'National Level • 2025', descVi: 'Top 63 Dự án tại Cuộc thi phim ngắn Vietnamese 2025.', descEn: 'Placed in Top 63 Projects at the Vietnamese Short Film Competition 2025.', link:'https://thanhnien.vn/ap-luc-hoc-duong-phim-ngan-vietnamese-2025-185250704101123674.htm'  },
    { level: 'Cấp trường', titleVi: 'Câu lạc bộ hoạt động Xuất sắc HK 1', titleEn: 'Outstanding Club of Semester 1', metaVi: 'THPT FPT Cần Thơ • 2026', metaEn: 'FPT High School Can Tho • 2026', descVi: 'Đoạt danh hiệu Câu lạc bộ Xuất sắc Học kỳ 1.', descEn: 'Awarded the Outstanding Club Title for Semester 1.', link:'https://www.facebook.com/share/p/1bCm9g118k/'  },
    { level: 'Cấp trường', titleVi: 'Giải Nhì Phiên toà giả định 2025-2026', titleEn: 'Second Prize in Mock Trial 2025-2026', metaVi: 'THPT FPT Cần Thơ • 2026', metaEn: 'FPT High School Can Tho • 2026', descVi: 'Đoạt Giải Nhì Phiên toà giả định 2025-2026.', descEn: 'Won Second Prize in the Mock Trial 2025-2026.', link:'https://mientay.giadinhonline.vn/phien-toa-gia-dinh-mua-4-hoc-tro-thpt-fpt-can-tho-lon-len-cung-phap-luat-d16979.html'  },
    { level: 'Cấp Thành phố', titleVi: 'Giải Khuyến khích Kỳ thi Học sinh giỏi', titleEn: 'Consolation Prize in Excellent Student Competition', metaVi: 'Thành phố Cần Thơ • 2026', metaEn: 'Can Tho City • 2026', descVi: 'Đoạt giải Khuyến khích kỳ thi HSG Địa lý Cấp thành phố.', descEn: 'Won Consolation Prize in the City-level Geography Excellent Student Competition.', link:'https://www.facebook.com/share/1B7uLPRzms/'  },
    { level: 'Cấp Quốc gia', titleVi: 'Giải Triển vọng Cuộc thi AI Young Guru', titleEn: 'Promising Award in AI Young Guru Competition', metaVi: 'Cấp Quốc gia • 2026', metaEn: 'National Level • 2026', descVi: 'Đoạt giải Triển vọng (Top 30 Quốc gia) AI Young Guru.', descEn: 'Won the Promising Award (Top 30 Nationwide) in AI Young Guru.', link:'https://www.facebook.com/share/1JGwAJnA86/' },
  ];

  const filteredAchievements = activeAchieveFilter === 'ALL' 
    ? achievementsData 
    : achievementsData.filter(a => a.level === activeAchieveFilter);

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
                        {lang === 'vi' ? 'Đạt danh hiệu học sinh giỏi 4 năm liên tiếp, tốt nghiệp THCS xếp loại Giỏi, hạnh kiểm Tốt. Đạt nhiều giải thưởng trong các cuộc thi.' : 'Achieved Excellent Student title for 4 consecutive years, graduated with High Distinction and Excellent conduct. Won multiple awards in various competitions.'}
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
                        {lang === 'vi' ? 'Đạt danh hiệu học sinh giỏi 3 năm liên tiếp, tốt nghiệp THPT xếp loại Tốt, hạnh kiểm Tốt. Đạt nhiều giải thưởng trong các cuộc thi.' : 'Achieved Excellent Student title for 3 consecutive years, graduated with High Distinction and Excellent conduct. Won multiple awards in various competitions.'}
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
                          {lang === 'vi' ? 'Phó Chủ nhiệm / Co-founder' : 'Vice President / Co-founder'} <i className="fas fa-link" style={{ fontSize: '0.9rem', marginLeft: '5px', opacity: 0.7 }}></i>
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

            {/* 3. ACHIEVEMENTS SECTION */}
            <section id="achievements">
              
              {/* Ép xếp dọc và bám lề trái */}
              <div className="fade-in-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px', marginBottom: '40px' }}>
                 <div>
                   <span className="sub-title">{t.achieveSub}</span>
                   <h2 className="section-title" style={{ marginBottom: 0 }}>
                     {t.achieveTitle1} <span className="italic-red">{t.achieveTitle2}</span>
                   </h2>
                 </div>
                 
                 {/* Thêm marginBottom: 0 để bộ lọc không bị đẩy khoảng trống thừa */}
                 <div className="filter-container" onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)} style={{ marginBottom: 0 }}>
                   <button className={`filter-btn ${activeAchieveFilter === 'ALL' ? 'active' : ''}`} onClick={() => setActiveAchieveFilter('ALL')}>{t.filterAll}</button>
                   <button className={`filter-btn ${activeAchieveFilter === 'Cấp trường' ? 'active' : ''}`} onClick={() => setActiveAchieveFilter('Cấp trường')}>{t.filterSchool}</button>
                   <button className={`filter-btn ${activeAchieveFilter === 'Cấp Quận' ? 'active' : ''}`} onClick={() => setActiveAchieveFilter('Cấp Quận')}>{t.filterDistrict}</button>
                   <button className={`filter-btn ${activeAchieveFilter === 'Cấp Thành phố' ? 'active' : ''}`} onClick={() => setActiveAchieveFilter('Cấp Thành phố')}>{t.filterCity}</button>
                   <button className={`filter-btn ${activeAchieveFilter === 'Cấp Quốc gia' ? 'active' : ''}`} onClick={() => setActiveAchieveFilter('Cấp Quốc gia')}>{t.filterNational}</button>
                 </div>
              </div>

              {/* LƯỚI THÀNH TÍCH */}
              <div className="grid-2">
                {filteredAchievements.map((achieve, index) => {
                  
                  // Kiểm tra xem thành tích này có link hay không
                  const hasLink = !!achieve.link;

                  return (
                    <div 
                      key={index} 
                      className="glow-card achieve-card fade-in-section"
                      // 👇 1. Nếu có link -> Click vào sẽ mở tab mới
                      onClick={() => hasLink && window.open(achieve.link, '_blank')}
                      // 👇 2. Nếu có link -> Rê chuột vào vòng tròn đỏ sẽ to lên (hiệu ứng Custom Cursor)
                      onMouseEnter={() => hasLink && setIsHoveringBtn(true)} 
                      onMouseLeave={() => hasLink && setIsHoveringBtn(false)}
                    >
                      <div className="achieve-icon">
                        <i className={achieve.level === 'Cấp Quốc gia' ? 'fas fa-trophy' : 'fas fa-award'}></i>
                      </div>
                      <div className="achieve-info">
                        {/* Thêm một icon nhỏ gọn xíu xiu nếu có link cho người ta biết để bấm (Tùy chọn) */}
                        <h4>
                          {lang === 'vi' ? achieve.titleVi : achieve.titleEn}
                          {hasLink && <i className="fas fa-external-link-alt" style={{ marginLeft: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}></i>}
                        </h4>
                        <span>{lang === 'vi' ? achieve.metaVi : achieve.metaEn}</span>
                        <p className="text-desc">{lang === 'vi' ? achieve.descVi : achieve.descEn}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 4. PROJECTS SECTION */}
            <section id="projects">
              
              {/* Ép xếp dọc và bám lề trái */}
              <div className="fade-in-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px', marginBottom: '40px' }}>
                 <div>
                   <span className="sub-title">{t.projSub}</span>
                   <h2 className="section-title" style={{ marginBottom: 0 }}>
                     {t.projTitle1}<span className="italic-red">{t.projTitle2}</span>
                   </h2>
                 </div>
                 
                 {/* Thêm marginBottom: 0 */}
                 <div className="filter-container" onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)} style={{ marginBottom: 0 }}>
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
                      <img src={proj.logo} alt="Project Logo" className="project-logo" loading="lazy" />
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
                          {/* Nếu là mục THIẾT KẾ */}
                          {proj.category === 'THIẾT KẾ' && (
                            <>
                              <span className="tag">{lang === 'vi' ? 'THIẾT KẾ' : 'DESIGN'}</span>
                              <span className="tag">{lang === 'vi' ? 'SÁNG TẠO' : 'CREATIVE'}</span>
                            </>
                          )}
                          
                          {/* Nếu là mục SỰ KIỆN */}
                          {proj.category === 'SỰ KIỆN' && (
                            <>
                              <span className="tag">{lang === 'vi' ? 'SỰ KIỆN' : 'EVENT'}</span>
                              <span className="tag">{lang === 'vi' ? 'HOẠT ĐỘNG' : 'ACTIVITY'}</span>
                            </>
                          )}

                          {/* Nếu là mục DỰ ÁN (Code/Web) */}
                          {proj.category === 'DỰ ÁN' && (
                            <>
                              <span className="tag">{lang === 'vi' ? 'DỰ ÁN' : 'PROJECT'}</span>
                              <span className="tag">{lang === 'vi' ? 'LẬP TRÌNH' : 'CODING'}</span>
                              <span className="tag">WEBSITE</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Gallery ảnh */}
                    <div className="project-gallery" onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                      
                      {/* ========================================= */}
                      {/* ẢNH CHÍNH HOẶC VIDEO CHÍNH (TỐI ƯU THUMBNAIL) */}
                      {proj.mainVideo ? (
                        <div className="gallery-main fb-video-wrapper">
                          {/* Nếu video chưa được bấm Play -> Hiện Ảnh Bìa + Nút Play */}
                          {!activeVideos[proj.title] ? (
                            <div 
                              className="custom-video-thumbnail"
                              onClick={(e) => {
                                e.stopPropagation(); // Chặn lan click
                                setActiveVideos(prev => ({ ...prev, [proj.title]: true }));
                              }}
                              onMouseEnter={() => setIsHoveringBtn(true)} 
                              onMouseLeave={() => setIsHoveringBtn(false)}
                            >
                              <img src={proj.mainImg} alt="Video Thumbnail" loading="lazy" />
                              <div className="play-button-overlay">
                                <i className="fas fa-play"></i>
                              </div>
                            </div>
                          ) : (
                            /* Khi đã bấm Play -> Hiện Iframe Facebook thực sự */
                            <iframe 
                              src={`${proj.mainVideo}&autoplay=1`} /* Thêm &autoplay=1 để tự động chạy khi lật thẻ */
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                
                {/* PHẦN TITLE Ở TRÊN CÙNG (Căn trái) */}
                <div>
                  <span className="sub-title">{t.contactSub}</span>
                  {/* Tui bỏ thẻ <br/> đi để chữ trải ngang đẹp hơn trên PC */}
                  <h2 className="section-title" style={{ marginBottom: '15px' }}>
                    {t.contactTitle1} <span className="italic-red">{t.contactTitle2}</span> {t.contactTitle3}
                  </h2>
                  <p className="text-desc" style={{ maxWidth: '600px' }}>{t.contactDesc}</p>
                </div>
                
                {/* PHẦN CARD Ở DƯỚI (Trải dài Full màn hình) */}
                <div className="contact-links-group">
                  
                  {/* Nút Facebook */}
                  <a href="https://www.facebook.com/tris.nhaan" target="_blank" rel="noreferrer" className="contact-btn fade-in-section" onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                    <div className="contact-btn-icon"><i className="fab fa-facebook-f"></i></div>
                    <div className="contact-btn-content">
                      <span className="contact-btn-label">FACEBOOK</span>
                      <span className="contact-btn-value">Nguyễn Trí Nhân</span>
                    </div>
                  </a>

                  {/* Nút Instagram */}
                  <a href="https://www.instagram.com/n.trisnhaan/" target="_blank" rel="noreferrer" className="contact-btn fade-in-section" onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                    <div className="contact-btn-icon"><i className="fab fa-instagram"></i></div>
                    <div className="contact-btn-content">
                      <span className="contact-btn-label">INSTAGRAM</span>
                      <span className="contact-btn-value">@n.trisnhaan</span>
                    </div>
                  </a>

                  {/* Nút Tiktok */}
                  <a href="https://www.tiktok.com/@ng_tri_nhan" target="_blank" rel="noreferrer" className="contact-btn fade-in-section" onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                    <div className="contact-btn-icon"><i className="fab fa-tiktok"></i></div>
                    <div className="contact-btn-content">
                      <span className="contact-btn-label">TIKTOK</span>
                      <span className="contact-btn-value">@ng_tri_nhan</span>
                    </div>
                  </a>

                  {/* Nút Behance */}
                  <a href="https://www.behance.net/trnhnnguyn2" target="_blank" rel="noreferrer" className="contact-btn fade-in-section" onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                    <div className="contact-btn-icon"><i className="fab fa-behance"></i></div>
                    <div className="contact-btn-content">
                      <span className="contact-btn-label">BEHANCE</span>
                      <span className="contact-btn-value">Nguyễn Trí Nhân</span>
                    </div>
                  </a>

                  {/* Nút Số điện thoại */}
                  <a href="tel:+84335810259" className="contact-btn fade-in-section" onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                    <div className="contact-btn-icon"><i className="fas fa-phone"></i></div>
                    <div className="contact-btn-content">
                      <span className="contact-btn-label">{t.footerPhone}</span>
                      <span className="contact-btn-value">0335 810 259</span>
                    </div>
                  </a>

                  {/* Nút Email */}
                  <a href="mailto:ntrinhan712@gmail.com" className="contact-btn fade-in-section" onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                    <div className="contact-btn-icon"><i className="fas fa-envelope"></i></div>
                    <div className="contact-btn-content">
                      <span className="contact-btn-label">EMAIL</span>
                      <span className="contact-btn-value">ntrinhan712@gmail.com</span>
                    </div>
                  </a>

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
  );
}

export default App;