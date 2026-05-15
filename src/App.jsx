import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [loading, setLoading] = useState(true);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHoveringBtn, setIsHoveringBtn] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');
// Quản lý dữ liệu Popup (Có mở không? Danh sách ảnh là gì? Đang xem ảnh thứ mấy?)
  const [popupData, setPopupData] = useState({ isOpen: false, gallery: [], currentIndex: 0 });

  // Hàm mở Popup
  const openPopup = (project, clickedImgUrl) => {
    // Gom ảnh lớn và các ảnh nhỏ thành 1 mảng chung
    const fullGallery = [project.mainImg, ...project.images];
    // Tìm vị trí của ảnh vừa click
    const index = fullGallery.indexOf(clickedImgUrl);
    setPopupData({ isOpen: true, gallery: fullGallery, currentIndex: index !== -1 ? index : 0 });
  };

  // Hàm Đóng Popup
  const closePopup = () => setPopupData({ ...popupData, isOpen: false });

  // Hàm Tiến/Lùi ảnh
  const nextImage = (e) => {
    e.stopPropagation(); // Chặn click lan ra ngoài làm tắt popup
    setPopupData(prev => ({ ...prev, currentIndex: (prev.currentIndex + 1) % prev.gallery.length }));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setPopupData(prev => ({ 
      ...prev, 
      currentIndex: prev.currentIndex === 0 ? prev.gallery.length - 1 : prev.currentIndex - 1 
    }));
  };
  
  const observerRef = useRef(null);

  // Hiệu ứng Loading
  useEffect(() => {
    setTimeout(() => setLoading(false), 2200);
  }, []);

  // Tracking vị trí chuột & tính toạ độ Glow cho thẻ (Glow Card)
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });

      const glowingCards = document.querySelectorAll('.glow-card');
      glowingCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Logic Fade-in/out Scroll 2 chiều
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

    // Dùng setTimeout siêu nhỏ để đảm bảo React đã kịp vẽ các thẻ mới ra DOM
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
  }, [loading, activeFilter]); // 👉 BÍ QUYẾT LÀ Ở ĐÂY: Thêm activeFilter vào để quét lại mỗi khi đổi danh mục

  // 1. STATE LƯU TRỮ MENU ĐANG ACTIVE
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 2. LOGIC SCROLLSPY (BẮT VỊ TRÍ CUỘN CHUỘT)
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      let currentSection = 'home'; // Mặc định là trang chủ

      sections.forEach(section => {
        // Lấy khoảng cách từ top trang đến section
        const sectionTop = section.offsetTop;
        // Nếu cuộn chuột vượt qua đỉnh section (trừ đi 150px bù trừ cho cái Header)
        if (window.scrollY >= sectionTop - 150) {
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
      title: 'Social Media Post - "Giới thiệu BCN Gen 2.0"',
      desc: 'Ấn phẩm phục vụ mục đích truyền thông của CLB F-Photo.',
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
      title: 'Design lộn xộn',
      desc: 'Ấn phẩm phục vụ mục đích truyền thông của F-Photo & KN Production.',
      link: 'https://www.behance.net/gallery/244426789/SOCIAL-MEDIA-POST-KIEU-KN-PRODUCTION',
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
      title: 'ID Card Design - "ID Card CLB F-Photo"',
      desc: 'Ấn phẩm phục vụ mục đích truyền thông của CLB F-Photo.',
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
      title: 'Key Visual - "Sự Kiện Chiếu Phim Địa Đạo"',
      desc: 'Ấn phẩm phục vụ mục đích truyền thông của CLB F-Photo.',
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
      title: 'Social Media Post - "Tứ Trụ F-Photography"',
      desc: 'Ấn phẩm phục vụ mục đích truyền thông của CLB F-Photo.',
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
      title: 'Social Media Post - "Chiêu mộ thành viên F-Photo"',
      desc: 'Ấn phẩm phục vụ mục đích truyền thông của CLB F-Photo.',
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
      title: 'Social Media Post - "F-Photo Thay Áo Mới"',
      desc: 'Ấn phẩm phục vụ mục đích truyền thông của CLB F-Photo.',
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
      title: 'Magazine - "Tạp chí F-Star Phương Nghi"',
      desc: 'Ấn phẩm được lựa chọn đăng tải trên Tập san kiến đọc.',
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
      category: 'DỰ ÁN',
      role: '/ QUẢN LÝ DỰ ÁN / DEVELOPER',
      title: 'Wibey - Nền tảng xem phim trực tuyến',
      desc: 'Nền tảng xem phim trực tuyến với giao diện hiện đại.',
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
      role: '/ QUẢN LÝ DỰ ÁN / DEVELOPER',
      title: 'Dự Án HopVan - Nền tảng học và luyện thi môn Ngữ Văn',
      desc: 'Nền tảng học và luyện thi môn Ngữ Văn.',
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
      role: '/ QUẢN LÝ DỰ ÁN / DEVELOPER',
      title: 'FPC NEWS - Trang thông tin điện tử CLB F-Photography',
      desc: 'Trang thông tin điện tử của CLB F-Photography',
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
      role: '/ QUẢN LÝ DỰ ÁN / DEVELOPER',
      title: 'Wibu Pagoda - Nền tảng viếng chùa online',
      desc: 'Nền tảng viếng chùa online',
      link: 'https://wibupagoda.netlify.app',
      logo: '/images/dev-1/1.png',
      mainImg: '/images/dev-1/1.png',
      images: [
        '/images/dev-1/2.png',
        '/images/dev-1/3.png',
        '/images/dev-1/4.png',
        '/images/dev-1/5.png'
      ]
    },

    {
      category: 'SỰ KIỆN',
      role: '/ QUẢN LÝ DỰ ÁN / BAN TỔ CHỨC',
      title: 'Sự kiện chiếu phim đặc biệt - Chào mừng tết Nguyên đán 2026',
      desc: 'Chào đón xuân Bính Ngọ 2026, CLB Nhiếp ảnh F-Photography, CLB Nấu ăn F-Chef và CLB Tâm lý F-Heart lần đầu tiên "bắt tay" tổ chức buổi công chiếu phim Tết đặc biệt: “NHÀ BÀ NỮ”.',
      link: 'https://www.facebook.com/share/p/1NFeGFSmao/',
      logo: '/images/project-4/1.png',
      mainImg: '/images/project-4/1.png',
      images: [
        '/images/project-4/2.png',
        '/images/project-4/3.jpg',
        '/images/project-4/4.jpg',
        '/images/project-4/5.jpg'
      ]
    },

    {
      category: 'SỰ KIỆN',
      role: '/ QUẢN LÝ DỰ ÁN / BAN TỔ CHỨC',
      title: 'Sự kiện giao lưu CLB F-Photography & CLB Nhiếp ảnh THPT BHN',
      desc: 'Buổi giao lưu cùng CLB Nhiếp Ảnh THPT Bùi Hữu Nghĩa – một dịp đặc biệt để các bạn trẻ yêu nhiếp ảnh được gặp gỡ, học hỏi và cùng nhau chia sẻ những câu chuyện sau ống kính.',
      link: 'https://www.facebook.com/share/p/18sa5xu2Aa/',
      logo: '/images/project-3/1.png',
      mainImg: '/images/project-3/2.png',
      images: [
        '/images/project-3/1.png',
        '/images/project-3/3.png',
        '/images/project-3/4.jpg',
        '/images/project-3/5.jpg'
      ]
    },

    {
      category: 'SỰ KIỆN',
      role: '/ QUẢN LÝ DỰ ÁN / BAN TỔ CHỨC',
      title: 'Sự kiện "Photobooth cùng FSchoolers"',
      desc: 'Dự án Chạy Photoboth với sự kết hợp đặc biệt dành riêng cho các bạn học sinh THPT FPT Cần Thơ, cuộc hợp tác giữa CLB nhiếp ảnh F-Photography và Photogenic Vietnam',
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
      role: '/ QUẢN LÝ DỰ ÁN / BAN TỔ CHỨC',
      title: 'Cuộc thi ảnh Catch The Moment: Summer 2025',
      desc: '“Catch the moment: Summer 2025” là sân chơi dành riêng cho cán bộ nhân viên, giáo viên và học sinh trường THPT FPT Cần Thơ.',
      logo: '/images/project-1/1.png',
      link: 'https://www.facebook.com/share/p/1KNRQsYXUC/',
      mainImg: '/images/project-1/1.png',
      images: [
        '/images/project-1/2.png',
        '/images/project-1/3.png',
        '/images/project-1/4.png',
        '/images/project-1/5.png'
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
          <header>
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

            {/* 👉 DANH MỤC MENU (Bị ẩn trên Mobile, chỉ hiện khi click Hamburger) */}
            <nav className={`nav-links menu-center ${isMobileMenuOpen ? 'open' : ''}`} onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
              <a href="#home" className={activeSection === 'home' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>TRANG CHỦ</a>
              <a href="#timeline" className={activeSection === 'timeline' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>HỌC VẤN</a>
              <a href="#achievements" className={activeSection === 'achievements' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>THÀNH TÍCH</a>
              <a href="#projects" className={activeSection === 'projects' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>DỰ ÁN</a>
              <a href="#contact" className={activeSection === 'contact' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>LIÊN HỆ</a>
            </nav>
            
            <div className="nav-links lang-switch" style={{ position: 'relative', zIndex: 1001 }}><a href="#">VN</a> <a href="#">EN</a></div>
          </header>

          <main>
            {/* 1. HERO SECTION */}
            <section id="home" className="hero-split fade-in-section">
              <div className="hero-text">
                <span className="sub-title">PORTFOLIO</span>
                <h1 className="main-title">
                  NGUYỄN <br />
                  <span className="italic-red">TRÍ NHÂN</span>
                </h1>
                <p className="text-desc" style={{ maxWidth: '650px', marginTop: '25px', marginBottom: '35px', fontSize: '1.15rem' }}>
                  Đây là không gian cá nhân để mình lưu giữ những cột mốc học tập, các hoạt động và dự án tâm huyết.
                </p>
                <div className="btn-group" onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                  <a href="#projects" className="btn btn-primary">XEM DỰ ÁN</a>
                  <a href="#contact" className="btn btn-outline">KẾT NỐI NGAY</a>
                </div>
              </div>
              {/* BỎ style position relative ở đây */}
              <div className="hero-media">
                
                {/* 👉 THÊM THẺ NÀY: Khóa tọa độ ôm sát đúng 450px của bức ảnh */}
                <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
                  
                  <div className="media-card" onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                    <img src="/images/hero.jpg" alt="Profile Hero" />
                  </div>

                  <div className="floating-badge badge-1">
                    <div className="badge-icon"><i className="fas fa-bolt"></i></div>
                    <div className="badge-text">
                      <span className="badge-num">20+</span>
                      <span className="badge-label">DỰ ÁN & SỰ KIỆN</span>
                    </div>
                  </div>

                  <div className="floating-badge badge-2">
                    <div className="badge-icon"><i className="fas fa-award"></i></div>
                    <div className="badge-text">
                      <span className="badge-num">30+</span>
                      <span className="badge-label">THÀNH TÍCH</span>
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
                  <h3 className="col-title">HỌC VẤN</h3>
                  
                  <div className="timeline-item">
                    <div className="timeline-num">1</div>
                    <div className="timeline-content">
                      <h4>
                        {/* THAY LINK TRƯỜNG VIỆT MỸ VÀO href */}
                        <a href="https://vietmycantho.edu.vn" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                          Trung học Cơ sở <i className="fas fa-link" style={{ fontSize: '0.9rem', marginLeft: '5px', opacity: 0.7 }}></i>
                        </a>
                      </h4>
                      <span className="timeline-meta">Trường Phổ thông Việt Mỹ • 2019 - 2023</span>
                      <p className="text-desc">Đạt danh hiệu học sinh giỏi 4 năm liên tiếp, tốt nghiệp THCS loại Giỏi, hạnh kiểm Tốt. Đạt nhiều giải thưởng trong các cuộc thi.</p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-num">2</div>
                    <div className="timeline-content">
                      <h4>
                        {/* THAY LINK TRƯỜNG FPT VÀO href */}
                        <a href="https://cantho-school.fpt.edu.vn" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                          Trung học Phổ thông <i className="fas fa-link" style={{ fontSize: '0.9rem', marginLeft: '5px', opacity: 0.7 }}></i>
                        </a>
                      </h4>
                      <span className="timeline-meta">Trường THPT FPT Cần Thơ • 2023 - 2026</span>
                      <p className="text-desc">Đạt danh hiệu học sinh giỏi 3 năm liên tiếp, tốt nghiệp THPT loại Giỏi, hạnh kiểm Tốt. Đạt nhiều giải thưởng trong các cuộc thi.</p>
                    </div>
                  </div>
                </div>

                {/* --- CỘT KINH NGHIỆM --- */}
                <div className="timeline-col fade-in-section">
                  <h3 className="col-title">KINH NGHIỆM / HOẠT ĐỘNG</h3>
                  
                  <div className="timeline-item">
                    <div className="timeline-num">1</div>
                    <div className="timeline-content">
                      <h4>
                        {/* THAY LINK FANPAGE KN PRODUCTION VÀO href */}
                        <a href="https://www.facebook.com/KNProduction1" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                          Đồng sáng lập và phát triển <i className="fas fa-link" style={{ fontSize: '0.9rem', marginLeft: '5px', opacity: 0.7 }}></i>
                        </a>
                      </h4>
                      <span className="timeline-meta">KN Production • 2024 - Nay</span>
                      <p className="text-desc">Quản lý truyền thông và nội dung Fanpage, thiết kế ấn phẩm và lên kịch bản cho các dự án truyền thông.</p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-num">2</div>
                    <div className="timeline-content">
                      <h4>
                        {/* THAY LINK CLB F-PHOTO VÀO href */}
                        <a href="https://fphotography.club" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                          Chủ nhiệm / Co-founder <i className="fas fa-link" style={{ fontSize: '0.9rem', marginLeft: '5px', opacity: 0.7 }}></i>
                        </a>
                      </h4>
                      <span className="timeline-meta">CLB Nhiếp ảnh F-Photography • 2024 - 2026</span>
                      <p className="text-desc">Tham gia quản lý CLB. Tổ chức thiết kế ấn phẩm truyền thông và lên kế hoạch cho các dự án thuộc Câu lạc bộ.</p>
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
                      <span className="timeline-meta">Dự án HopVan • 2026 - Nay</span>
                      <p className="text-desc">Phụ trách thiết kế, lên ý tưởng truyền thông, lập trình và phát triển hệ thống cho website HopVan.</p>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* 3. ACHIEVEMENTS SECTION (Thành tích - Cấu trúc lưới Thẻ - Ảnh 2) */}
            <section id="achievements">
              <div className="fade-in-section" style={{ textAlign: 'center', marginBottom: '60px' }}>
                <span className="sub-title">DẤU ẤN CÁ NHÂN</span>
                <h2 className="section-title">THÀNH TÍCH <span className="italic-red">NỔI BẬT</span></h2>
              </div>
              <div className="grid-2">
                
                {/* Thành tích 1 */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Giải Công nhận Kỳ thi Học sinh giỏi</h4>
                    <span>Quận Cái Răng • 2023</span>
                    <p className="text-desc">Đoạt giải Công nhận Kỳ thi HSG môn Địa cấp Quận lớp 9.</p>
                  </div>
                </div>

                {/* Thành tích 2 */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Giải Ba Cuộc thi Khoa học Kỹ thuật</h4>
                    <span>Quận Cái Răng • 2023</span>
                    <p className="text-desc">Đoạt giải Ba Cuộc thi KHKT cấp Quận lớp 9.</p>
                  </div>
                </div>

                {/* Thành tích 3 */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Giải Nhì Cuộc thi Stempetition 2023-2024</h4>
                    <span>THPT FPT Cần Thơ • 2023</span>
                    <p className="text-desc">Đoạt giải Nhì Cuộc thi Stempetition Cấp trường.</p>
                  </div>
                </div>

                {/* Thành tích 4 */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Đội thi Ấn tượng tại Phiên toà giả định 2023</h4>
                    <span>THPT FPT Cần Thơ • 2023</span>
                    <p className="text-desc">Đoạt giải Ấn tượng Phiên toà giả định Cấp trường.</p>
                  </div>
                </div>

                {/* Thành tích 5 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Top 5 Dự án Xuất sắc nhất Infinity 2023-2024</h4>
                    <span>THPT FPT Cần Thơ • 2024</span>
                    <p className="text-desc">Lọt Top 5 Dự án Xuất sắc nhất tại Infinity 2023-2024.</p>
                  </div>
                </div>

                {/* Thành tích 6 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Giải Nhì Cuộc thi Stempetition 2024-2025</h4>
                    <span>THPT FPT Cần Thơ • 2024</span>
                    <p className="text-desc">Đoạt giải Nhì Cuộc thi Stempetition Cấp trường.</p>
                  </div>
                </div>

                {/* Thành tích 7 */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Giải Ba Cuộc thi FSchooler's Tips 2024</h4>
                    <span>THPT FPT Cần Thơ • 2024</span>
                    <p className="text-desc">Đoạt giải Ba Cuộc thi FSchooler's Tips Cấp trường.</p>
                  </div>
                </div>

                {/* Thành tích 8 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Giải Tiềm năng Cuộc thi Sáng tạo Robot FPT</h4>
                    <span>THPT FPT Cần Thơ • 2024</span>
                    <p className="text-desc">Đoạt giải Tiềm năng Cuộc thi Sáng tạo Robot Cấp trường.</p>
                  </div>
                </div>

                {/* Thành tích 9 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Dự án có thành tích Xuất sắc tại KHKT</h4>
                    <span>THPT FPT Cần Thơ • 2024</span>
                    <p className="text-desc">Dự án có thành tích Xuất sắc tại KHKT Cấp trường.</p>
                  </div>
                </div>

                {/* Thành tích 10 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Giải Nhì Cuộc thi Khoa học Kỹ thuật</h4>
                    <span>Thành phố Cần Thơ • 2024</span>
                    <p className="text-desc">Đoạt giải Nhì Cuộc thi KHKT cấp Thành phố.</p>
                  </div>
                </div>

                {/* Thành tích 11 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Ngày hội Địa lí Đa quốc gia mùa 2</h4>
                    <span>THPT FPT Cần Thơ • 2024</span>
                    <p className="text-desc">Đoạt Giải Infographic Ấn tượng.</p>
                  </div>
                </div>

                {/* Thành tích 12 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Bài viết được đăng tải trên Tập san kiến đọc</h4>
                    <span>THPT FPT Cần Thơ • 2024</span>
                    <p className="text-desc">Bài viết được đăng tải trên Tập san kiến đọc 2024.</p>
                  </div>
                </div>

                {/* Thành tích 13 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Đoạt giải Nhất kỳ thi HSG Cấp trường</h4>
                    <span>THPT FPT Cần Thơ • 2025</span>
                    <p className="text-desc">Đoạt giải Nhất kỳ thi chọn HSG môn Địa lý Cấp trường.</p>
                  </div>
                </div>

                {/* Thành tích 14 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Tham gia kỳ thi Chọn HSG Cấp Thành phố</h4>
                    <span>Thành phố Cần Thơ • 2025</span>
                    <p className="text-desc">Tham gia kỳ thi Chọn HSG môn Địa lý cấp Thành phố.</p>
                  </div>
                </div>

                {/* Thành tích 15 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Tham gia kỳ thi Olympic Truyền thống 30/04</h4>
                    <span>Khu vực Miền Nam • 2025</span>
                    <p className="text-desc">Tham gia kỳ thi Olympic Truyền thống 30/04 tại TP HCM.</p>
                  </div>
                </div>

                {/* Thành tích 16 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Top 1 Địa lý - Tiếp sức mùa thi 2025</h4>
                    <span>THPT FPT Cần Thơ • 2025</span>
                    <p className="text-desc">Đoạt Top 1 môn Địa lý tại Tiếp sức mùa thi 2025.</p>
                  </div>
                </div>

                {/* Thành tích 17 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Cá nhân hoạt động CLB nổi bật HK2</h4>
                    <span>THPT FPT Cần Thơ • 2025</span>
                    <p className="text-desc">Cá nhân hoạt động nổi bật HK2 (CLB F-Photography).</p>
                  </div>
                </div>

                {/* Thành tích 18 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Đạt danh hiệu Thanh niên khoẻ Cấp trường</h4>
                    <span>THPT FPT Cần Thơ • 2025</span>
                    <p className="text-desc">Đạt danh hiệu Thanh niên khoẻ Cấp trường 2025.</p>
                  </div>
                </div>

                {/* Thành tích 19 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Đạt danh hiệu Học sinh Ba tốt Cấp trường</h4>
                    <span>THPT FPT Cần Thơ • 2025</span>
                    <p className="text-desc">Đạt danh hiệu Học sinh Ba tốt Cấp trường 2025.</p>
                  </div>
                </div>

                {/* Thành tích 20 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Đạt danh hiệu Talented Student Cấp trường</h4>
                    <span>THPT FPT Cần Thơ • 2025</span>
                    <p className="text-desc">Đạt danh hiệu Talented Student Cấp trường 2025.</p>
                  </div>
                </div>

                {/* Thành tích 21 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Đoạt giải Ba Cuộc thi ảnh CTM 2025</h4>
                    <span>Câu lạc bộ • 2025</span>
                    <p className="text-desc">Đoạt giải Ba Cuộc thi ảnh Catch The Moment 2025.</p>
                  </div>
                </div>

                {/* Thành tích 22 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Tham gia kỳ thi chọn HSG Dự thi Quốc Gia</h4>
                    <span>Thành phố Cần Thơ • 2025</span>
                    <p className="text-desc">Tham gia kỳ thi chọn HSG Dự thi cấp Quốc gia.</p>
                  </div>
                </div>

                {/* Thành tích 23 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Câu lạc bộ hoạt động Xuất sắc Tháng 7</h4>
                    <span>THPT FPT Cần Thơ • 2025</span>
                    <p className="text-desc">Đoạt danh hiệu Câu lạc bộ Xuất sắc Tháng 7.</p>
                  </div>
                </div>

                {/* Thành tích 24 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Top 63 Dự án được đăng trên báo Thanh Niên</h4>
                    <span>Cấp Quốc gia • 2025</span>
                    <p className="text-desc">Top 63 Dự án tại Cuộc thi phim ngắn Vietnamese 2025.</p>
                  </div>
                </div>

                {/* Thành tích 25 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Câu lạc bộ hoạt động Xuất sắc HK 1</h4>
                    <span>THPT FPT Cần Thơ • 2026</span>
                    <p className="text-desc">Đoạt danh hiệu Câu lạc bộ Xuất sắc Học kỳ 1.</p>
                  </div>
                </div>

                {/* Thành tích 26 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Giải Nhì Phiên toà giả định 2025-2026</h4>
                    <span>THPT FPT Cần Thơ • 2026</span>
                    <p className="text-desc">Đoạt Giải Nhì Phiên toà giả định 2025-2026.</p>
                  </div>
                </div>

                {/* Thành tích 27 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Giải Khuyến khích Kỳ thi Học sinh giỏi</h4>
                    <span>Thành phố Cần Thơ • 2026</span>
                    <p className="text-desc">Đoạt giải Khuyến khích kỳ thi HSG Địa lý Cấp thành phố.</p>
                  </div>
                </div>

                {/* Thành tích 28 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Giải Triển vọng Cuộc thi AI Young Guru</h4>
                    <span>Cấp Quốc gia • 2026</span>
                    <p className="text-desc">Đoạt giải Triển vọng (Top 30 Quốc gia) AI Young Guru.</p>
                  </div>
                </div>

                {/* Thành tích 29 (Thêm mới) */}
                <div className="glow-card achieve-card fade-in-section">
                  <div className="achieve-icon"><i className="fas fa-award"></i></div>
                  <div className="achieve-info">
                    <h4>Đạt danh hiệu Thanh niên khoẻ Cấp trường</h4>
                    <span>THPT FPT Cần Thơ • 2026</span>
                    <p className="text-desc">Đạt danh hiệu Thanh niên khoẻ Cấp trường 2026.</p>
                  </div>
                </div>

              </div>
            </section>

            {/* 4. PROJECTS SECTION (Cấu trúc thẻ có Filter & Mini Gallery - Ảnh 3,4,5,6) */}
            <section id="projects">
              <div className="fade-in-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                 <div>
                   <span className="sub-title">DANH MỤC SÁNG TẠO</span>
                   <h2 className="section-title" style={{ marginBottom: 0 }}>GÓC <span className="italic-red">DỰ ÁN</span></h2>
                 </div>
                 <div className="filter-container" onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                   <button className={`filter-btn ${activeFilter === 'ALL' ? 'active' : ''}`} onClick={() => setActiveFilter('ALL')}>TẤT CẢ</button>
                   <button className={`filter-btn ${activeFilter === 'THIẾT KẾ' ? 'active' : ''}`} onClick={() => setActiveFilter('THIẾT KẾ')}>THIẾT KẾ</button>
                   <button className={`filter-btn ${activeFilter === 'DỰ ÁN' ? 'active' : ''}`} onClick={() => setActiveFilter('DỰ ÁN')}>DỰ ÁN</button>
                   <button className={`filter-btn ${activeFilter === 'SỰ KIỆN' ? 'active' : ''}`} onClick={() => setActiveFilter('SỰ KIỆN')}>SỰ KIỆN</button>
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
                          <span className="tag">TRUYỀN THÔNG</span>
                          <span className="tag">HOẠT ĐỘNG</span>
                        </div>
                      </div>
                    </div>

                    {/* Gallery ảnh */}
                    <div className="project-gallery" onMouseEnter={() => setIsHoveringBtn(true)} onMouseLeave={() => setIsHoveringBtn(false)}>
                      
                      {/* Ảnh lớn */}
                      <img 
                        src={proj.mainImg} 
                        alt="Main Visual" 
                        className="gallery-main" 
                        onClick={() => openPopup(proj, proj.mainImg)} 
                        loading="lazy" /* 👉 THÊM DÒNG NÀY */
                      />
                      
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
                  <span className="sub-title">LIÊN HỆ</span>
                  <h2 className="section-title">HÀNH TRÌNH <br/><span className="italic-red">BẮT ĐẦU</span> TỪ ĐÂY</h2>
                  <p className="text-desc" style={{ marginBottom: '40px' }}>Nếu bạn có chung sở thích, muốn giao lưu học hỏi hay rủ mình tham gia dự án nào đó, đừng ngại liên hệ nhé!</p>
                  
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

                {/* Phần Form giữ nguyên không đổi */}
                <div className="glow-card contact-form">
                  <form 
                    action="https://formspree.io/f/xdabvwpr"
                    method="POST"
                    onMouseEnter={() => setIsHoveringBtn(true)} 
                    onMouseLeave={() => setIsHoveringBtn(false)}
                  >
                    <div className="grid-2" style={{ gap: '20px' }}>
                      <div className="form-group">
                        <label>Họ Tên</label>
                        {/* Thêm name="name" và required */}
                        <input type="text" name="name" placeholder="Nguyễn Văn A" required />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        {/* Thêm name="email" và required */}
                        <input type="email" name="email" placeholder="example@gmail.com" required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Chủ đề liên hệ</label>
                      {/* Thêm name="subject" */}
                      <select name="subject">
                        <option value="Tán gẫu / làm quen">Tán gẫu / làm quen</option>
                        <option value="Thảo luận dự án">Thảo luận dự án</option>
                        <option value="Giao lưu học hỏi">Giao lưu học hỏi</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Lời nhắn</label>
                      {/* Thêm name="message" và required */}
                      <textarea name="message" placeholder="Nhắn lời nhắn của bạn vào đây nhe..." required></textarea>
                    </div>
                    <button type="submit" className="btn-submit">GỬI THÔNG TIN ↗</button>
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
                <p style={{ color: 'var(--primary-color)', fontWeight: 700, marginBottom: '15px' }}>ĐIỀU HƯỚNG</p>
                <div className="footer-nav">
                  <a href="#projects">DỰ ÁN</a>
                  <a href="#achievements">THÀNH TÍCH</a>
                  <a href="#timeline">HỌC VẤN</a>
                  <a href="#contact">LIÊN HỆ</a>
                </div>
              </div>
              
              <div>
                <p style={{ color: 'var(--primary-color)', fontWeight: 700, marginBottom: '15px' }}>KẾT NỐI</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '5px' }}>EMAIL</p>
                <p style={{ fontWeight: 700, marginBottom: '15px', color: 'white' }}>ntrinhan712@gmail.com</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '5px' }}>ĐIỆN THOẠI</p>
                <p style={{ fontWeight: 700, marginBottom: '20px', color: 'white' }}>0335 810 259</p>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '10px' }}>MẠNG XÃ HỘI</p>
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
                 <span className="go-top-text">Cuộn lên trên</span>
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