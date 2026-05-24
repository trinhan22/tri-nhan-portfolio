// fpc-chatbot.js - F-Photography Assistant (Auto Theme Switcher)

function initChatbot() {
    // 1. KIỂM TRA ĐƯỜNG DẪN HIỆN TẠI ĐỂ XÁC ĐỊNH THEME
    const path = window.location.pathname;
    // Nếu URL là thư mục gốc "/" hoặc "/index.html" thì bật Dark Theme
    const isHomePage = (path === '/' || path === '/index.html' || path === '');

    // ==========================================
    // 🎨 CSS DÀNH CHO TRANG CHỦ (DARK / GLASS THEME - GỌN GÀNG HƠN)
    // ==========================================
    const darkStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Roboto:wght@300;400;500&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-subtle { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(229, 57, 53, 0.4); } 70% { transform: scale(1.05); box-shadow: 0 0 0 8px rgba(229, 57, 53, 0); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(229, 57, 53, 0); } }
        
        #fpc-chat-launcher {
            position: fixed; bottom: 35px; right: 35px; width: 60px; height: 60px; /* Đã xích vào trong (35px) và tăng size nút */
            background: rgba(7, 7, 7, 0.6); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            border-radius: 50%; box-shadow: 0 6px 24px 0 rgba(0, 0, 0, 0.3);
            cursor: pointer; z-index: 9999; display: flex; align-items: center; justify-content: center;
            transition: all 0.4s ease; border: 1px solid rgba(229, 57, 53, 0.3);
            opacity: 0; visibility: hidden; transform: translateY(50px);
        }
        #fpc-chat-launcher.visible { opacity: 1; visibility: visible; transform: translateY(0); }
        #fpc-chat-launcher:hover { transform: translateY(-5px); border-color: #E53935; box-shadow: 0 0 20px rgba(229, 57, 53, 0.5); }
        #launcher-icon { color: #ffffff; font-size: 28px; transition: 0.3s; } /* Đã phóng to icon từ 22px lên 28px */
        #fpc-chat-launcher:hover #launcher-icon { animation: pulse-subtle 1.5s infinite; color: #E53935; }

        #fpc-chat-window {
            position: fixed; bottom: 103px; right: 25px; width: 340px; height: 520px; max-height: 80vh; /* Khung chat nhỏ lại từ 380x600 -> 340x520 */
            background: rgba(7, 7, 7, 0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            border-radius: 18px; box-shadow: 0 12px 40px rgba(0,0,0,0.5);
            display: flex; flex-direction: column; overflow: hidden; z-index: 99999;
            opacity: 0; transform: translateY(20px) scale(0.95); pointer-events: none;
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
            font-family: 'Roboto', sans-serif; border: 1px solid rgba(229, 57, 53, 0.15);
        }
        #fpc-chat-window.active { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }

        .chat-header {
            background: rgba(7, 7, 7, 0.85); border-bottom: 1px solid rgba(229, 57, 53, 0.2);
            padding: 14px 16px; color: white; display: flex; align-items: center; justify-content: space-between; z-index: 10;
        }
        .bot-info { display: flex; align-items: center; gap: 12px; }
        .bot-avatar-wrapper { position: relative; width: 36px; height: 36px; flex-shrink: 0; } /* Avatar gọn hơn */
        .bot-avatar {
            width: 100%; height: 100%; background: rgba(255,255,255,0.05); border-radius: 50%;
            display: flex; align-items: center; justify-content: center; border: 1px solid rgba(229, 57, 53, 0.3); overflow: hidden;
        }
        .bot-avatar img { width: 65%; height: 65%; object-fit: contain; filter: brightness(1.2); }
        .online-dot { position: absolute; bottom: 0; right: 0; width: 8px; height: 8px; background: #E53935; border: 2px solid #070707; border-radius: 50%; z-index: 2; box-shadow: 0 0 4px #E53935; }
        
        .chat-header h3 { font-family: 'Montserrat', sans-serif; font-size: 1rem; font-weight: 700; margin: 0; letter-spacing: 0.5px; }
        .chat-header p { font-size: 0.75rem; color: #a0a0a0; margin: 2px 0 0 0; }

        #chat-close-btn {
            width: 28px; height: 28px; border-radius: 50%; border: none; background: transparent; color: #a0a0a0; cursor: pointer;
            display: flex; align-items: center; justify-content: center; transition: 0.3s ease; font-size: 1rem;
        }
        #chat-close-btn:hover { color: #ffffff; transform: rotate(90deg); background: rgba(229, 57, 53, 0.2); }

        .chat-messages { flex: 1; padding: 16px; overflow-y: auto; background: transparent; display: flex; flex-direction: column; gap: 14px; }
        .chat-messages::-webkit-scrollbar { width: 5px; }
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(229, 57, 53, 0.2); border-radius: 10px; }
        .chat-messages::-webkit-scrollbar-thumb:hover { background: #E53935; }

        .msg { max-width: 85%; padding: 12px 16px; border-radius: 14px; font-size: 0.9rem; line-height: 1.5; word-wrap: break-word; animation: fadeIn 0.3s ease-out forwards; } /* Text và bong bóng chat nhỏ nhắn hơn */
        .msg-user { background: #E53935; color: #ffffff; align-self: flex-end; border-bottom-right-radius: 4px; border: 1px solid rgba(255,255,255,0.1); }
        .msg-bot { background: rgba(7, 7, 7, 0.6); color: #d0d0d0; align-self: flex-start; border-bottom-left-radius: 4px; border: 1px solid rgba(229, 57, 53, 0.1); }
        .msg-bot strong { font-weight: 600; color: #E53935; } 
        
        .quick-replies { display: flex; flex-wrap: wrap; gap: 8px; align-self: flex-start; margin-top: -4px; animation: fadeIn 0.5s ease; }
        .qr-btn {
            background: rgba(7,7,7,0.4); border: 1px solid rgba(229, 57, 53, 0.4); color: #b8b8b8;
            padding: 7px 12px; border-radius: 18px; font-size: 0.8rem; font-family: 'Roboto', sans-serif; cursor: pointer; transition: 0.3s;
        }
        .qr-btn:hover { background: #E53935; color: #ffffff; border-color: #E53935; transform: translateY(-2px); }

        .chat-input-area { padding: 12px 16px; background: rgba(7, 7, 7, 0.8); border-top: 1px solid rgba(229, 57, 53, 0.15); }
        .input-row { display: flex; gap: 10px; align-items: center; }

        #chat-input {
            flex: 1; border: 1px solid rgba(229, 57, 53, 0.3); background: rgba(0,0,0,0.4);
            padding: 12px 16px; border-radius: 25px; outline: none; font-family: 'Roboto', sans-serif; font-size: 0.9rem; color: #ffffff; transition: 0.3s;
        }
        #chat-input:focus { border-color: #E53935; background: #070707; box-shadow: 0 0 10px rgba(229, 57, 53, 0.2); }
        #chat-input::placeholder { color: rgba(255,255,255,0.4); font-size: 0.85rem; }
        
        #chat-send-btn {
            width: 40px; height: 40px; flex-shrink: 0; border-radius: 50%; /* Nút gửi nhỏ lại cho cân đối ô input */
            background: #E53935; color: #ffffff; border: none;
            display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s;
        }
        #chat-send-btn i { font-size: 0.95rem; margin-left: -2px; }
        #chat-send-btn:hover { background: #c62828; transform: scale(1.05); box-shadow: 0 0 12px rgba(229, 57, 53, 0.4); }
        #chat-send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .typing-indicator { display: flex; gap: 5px; padding: 12px 16px; background: rgba(7,7,7,0.6); border-radius: 14px; width: fit-content; border: 1px solid rgba(229, 57, 53, 0.1); align-self: flex-start; }
        .dot { width: 5px; height: 5px; background: #666; border-radius: 50%; animation: bounceDot 1.4s infinite ease-in-out; }
        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounceDot { 0%, 80%, 100% { transform: translateY(0); background: #666; } 40% { transform: translateY(-5px); background: #E53935; } }

        @media (max-width: 480px) { #fpc-chat-window { width: 90%; right: 5%; bottom: 120px; height: 70vh; } }
    `;

    // 2. NHÚNG CSS VÀO TRANG (Chọn CSS tùy thuộc URL)
    const styleSheet = document.createElement("style");
    styleSheet.innerText = isHomePage ? darkStyles : lightStyles;
    document.head.appendChild(styleSheet);

    // Load FontAwesome
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fa = document.createElement('link');
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(fa);
    }

    // 3. TỰ ĐỘNG CHỌN LOGO CHO PHÙ HỢP THEME
    const botAvatarSrc = isHomePage ? "/favicon.png" : "/favicon.png";

    // 4. TẠO HTML CHO CHATBOT
    const chatContainer = document.createElement('div');
    chatContainer.innerHTML = `
        <div id="fpc-chat-launcher" title="Chat với Trisnhaan AI">
            <i class="fas fa-comment-dots" id="launcher-icon"></i>
        </div>

        <div id="fpc-chat-window">
            <div class="chat-header">
                <div class="bot-info">
                    <div class="bot-avatar-wrapper">
                        <div class="bot-avatar">
                            <img src="${botAvatarSrc}" alt="FPC Bot" onerror="this.src='https://cdn-icons-png.flaticon.com/512/685/685655.png'">
                        </div>
                        <div class="online-dot"></div>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg m-0 leading-tight">Trisnhaan AI</h3>
                        <p class="text-xs opacity-90 m-0 font-medium">Trợ lý ảo Trisnhaan</p>
                    </div>
                </div>
                <button id="chat-close-btn" title="Đóng chat">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="chat-messages" id="chat-messages">
                <div class="msg msg-bot">
                    Chào đằng ấy! Mình là trợ lý ảo tên là <strong>Trisnhaan</strong>.<br>
                    Bạn có thắc mắc gì, Cứ hỏi mình nhé!
                </div>
                <!-- Vùng chứa các nút gợi ý -->
                <div class="quick-replies" id="quick-replies">
                    <button class="qr-btn">Trí Nhân là ai?</button>
                    <button class="qr-btn">Thành tích học tập?</button>
                    <button class="qr-btn">Những dự án đã thực hiện?</button>
                </div>
            </div>
            
            <div class="chat-input-area">
                <div class="input-row">
                    <input type="text" id="chat-input" placeholder="Nhập câu hỏi của bạn..." autocomplete="off">
                    <button id="chat-send-btn" title="Gửi"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(chatContainer);

    // 5. CÁC BIẾN & LOGIC HOẠT ĐỘNG
    const launcher = document.getElementById('fpc-chat-launcher');
    const windowEl = document.getElementById('fpc-chat-window');
    const closeBtn = document.getElementById('chat-close-btn');
    const sendBtn = document.getElementById('chat-send-btn');
    const inputEl = document.getElementById('chat-input');
    const messagesEl = document.getElementById('chat-messages');
    const quickRepliesBox = document.getElementById('quick-replies');

    // Hiện launcher khi web load xong
    setTimeout(() => { if(launcher) launcher.classList.add('visible'); }, 1000);

    // Xử lý bật/tắt cửa sổ chat
    function toggleChat() {
        if (windowEl.classList.contains('active')) {
            windowEl.classList.remove('active');
        } else {
            windowEl.classList.add('active');
            setTimeout(() => inputEl.focus(), 300);
        }
    }
    launcher.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Xử lý khi click vào câu hỏi gợi ý
    document.querySelectorAll('.qr-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            inputEl.value = this.innerText;
            quickRepliesBox.style.display = 'none';
            sendMessage();
        });
    });

    // Send Message
    async function sendMessage() {
        const text = inputEl.value.trim();
        if (!text) return;

        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        quickRepliesBox.style.display = 'none';

        appendMessage(text, 'user');
        inputEl.value = '';

        const loadingId = showLoading();

        try {
            // 🔥🔥 SYSTEM PROMPT F-PHOTOGRAPHY 🔥🔥
            const systemPrompt = `
            BẠN LÀ: Trợ lý ảo AI đại diện cho Nguyễn Trí Nhân (Trí Nhân / Trisnhaan).
            
            1. NGUYÊN TẮC XƯNG HÔ & TÍNH CÁCH:
            - Xưng hô "mình" và gọi người dùng là "bạn" hoặc "đằng ấy".
            - Giọng điệu: Thân thiện, năng động, tự tin nhưng khiêm tốn. Luôn thể hiện sự nhiệt huyết của một Gen Z đam mê công nghệ, thiết kế và nhiếp ảnh.
            - Thỉnh thoảng dùng các emoji gần gũi: 🚀, ✨, 💻, 📸, 🧡, 😉.
            
            2. THÔNG TIN CÁ NHÂN & KINH NGHIỆM LÀM VIỆC:
            - Học vấn: 
              + Trung học Cơ sở: Trường Phổ thông Việt Mỹ (2019 - 2023) - Đạt HSG 4 năm liên tiếp.
              + Trung học Phổ thông: Trường THPT FPT Cần Thơ (2023 - 2026) - Đạt HSG 3 năm liên tiếp.
            - Kinh nghiệm cốt lõi:
              + Co-founder & Developer tại KN Production (2024 - Nay): Quản lý truyền thông, thiết kế ấn phẩm và lên kịch bản dự án.
              + Co-founder / Phó Chủ nhiệm Gen 1.0 tại CLB Nhiếp ảnh F-Photography (2024 - 2026): Điều hành CLB, thiết kế ấn phẩm truyền thông, lên kế hoạch dự án.
              + Visual & Web Developer tại Dự án HopVan (https://hopvan.info.vn): Xây dựng nền tảng học & luyện thi môn Ngữ Văn.
            
            3. THÀNH TÍCH NỔI BẬT (CHỌN LỌC TỔNG HỢP):
            - Cấp Quốc Gia & Khu Vực: 
              + Giải Triển vọng Cuộc thi AI Young Guru 2026 (Top 30 Toàn quốc).
              + Top 63 Dự án Cuộc thi phim ngắn Vietnamese 2025 (đăng trên báo Thanh Niên).
              + Tham gia kỳ thi Olympic Truyền thống 30/04 Miền Nam 2025.
            - Cấp Thành Phố: 
              + Giải Khuyến khích HSG Địa lý cấp Thành phố (2026) và tham gia thi chọn Đội tuyển Quốc Gia (2025).
              + Giải Nhì Cuộc thi Khoa học Kỹ thuật (2024).
            - Cấp Trường & Câu Lạc Bộ: 
              + Đạt danh hiệu "Học sinh 3 Tốt" và "Talented Student" cấp trường (2025).
              + Giải Nhất HSG Địa lý cấp trường (2025), Top 1 Địa lý - Tiếp sức mùa thi 2025.
              + Giải Nhì Cuộc thi Stempetition 2 mùa liên tiếp (2023-2024 & 2024-2025).
              + Cá nhân hoạt động CLB nổi bật & đưa F-Photography đạt danh hiệu CLB Xuất sắc nhiều lần.
            
            4. CÁC DỰ ÁN & SỰ KIỆN ĐÃ THỰC HIỆN:
            - Mảng Thiết kế (Graphic Designer/Content): Bộ ID Card F-Photo, Tạp chí F-Star Phương Nghi (đăng trên Tập san Kiến đọc), Key Visual Sự kiện chiếu phim Địa Đạo, Thiết kế nhận diện (Thay áo mới) cho F-Photo và các ấn phẩm của KN Production.
            - Mảng Tổ chức Sự kiện (Project Manager/BTC): 
              + Chiếu phim đặc biệt "Nhà Bà Nữ" mừng Tết 2026 (kết hợp F-Chef & F-Heart).
              + Giao lưu với CLB Nhiếp ảnh THPT Bùi Hữu Nghĩa.
              + Sự kiện Photobooth cùng FSchoolers (kết hợp Photogenic Vietnam).
              + Cuộc thi ảnh Catch The Moment: Summer 2025.
            - Mảng Lập trình (Developer): FPC NEWS (Trang thông tin điện tử CLB F-Photography) và nền tảng giáo dục HopVan.

            5. THÔNG TIN LIÊN HỆ:
            - Facebook: Nguyễn Trí Nhân (https://www.facebook.com/tris.nhaan)
            - Instagram: @n.trisnhaan (https://www.instagram.com/n.trisnhaan/)
            - TikTok: @ng_tri_nhan (https://www.tiktok.com/@ng_tri_nhan)
            - Behance: Nguyễn Trí Nhân (https://www.behance.net/trnhnnguyn2)
            - Điện thoại/Zalo: 0335 810 259
            - Email: ntrinhan712@gmail.com
            
            6. QUY TẮC TRẢ LỜI CÂU HỎI CỦA NGƯỜI DÙNG:
            - Khi hỏi về kỹ năng/kinh nghiệm: Tự hào kể về sự đa năng giữa Design, Code và Quản lý sự kiện. Dẫn chứng bằng các dự án thực tế ở trên.
            - Khi hỏi về học tập: Sẵn sàng chia sẻ bí quyết cân bằng giữa việc chạy sự kiện, làm truyền thông và giữ vững điểm số, đặc biệt là kinh nghiệm thi HSG môn Địa lý.
            - Khi hỏi về CLB F-Photography: Nhắc đến vai trò là người đồng sáng lập (Co-founder) và những kỉ niệm bùng nổ cùng Gen 1.0 và Gen 2.0.
            - Khi hỏi về cách liên hệ/mạng xã hội: Cung cấp thông tin liên hệ ở mục 5 kèm theo thẻ <a> để người dùng dễ dàng click vào link.
            
            7. ĐỊNH DẠNG KỸ THUẬT:
            - BẮT BUỘC trả lời dưới dạng JSON: { "reply": "Nội dung trả lời của bạn..." }
            - Dùng các thẻ HTML (như <strong>, <br>, <em>, <a href="..." target="_blank">) bên trong chuỗi JSON để format văn bản, làm nổi bật thông tin quan trọng và chèn link các bài viết/dự án/liên hệ nếu cần thiết.
            `;

            // Gọi đến file PHP Proxy trên cPanel
            const res = await fetch('/groq_proxy.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ systemPrompt: systemPrompt, messages: text })
            });

            if(!res.ok) throw new Error("SERVER");
            const data = await res.json();
            removeLoading(loadingId);

            if (data.choices && data.choices.length > 0) {
                let raw = data.choices[0].message.content;
                try {
                    raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();
                    const json = JSON.parse(raw);
                    let reply = json.reply.replace(/\n/g, '<br>');
                    appendMessage(reply, 'bot');
                } catch(e) { appendMessage(raw, 'bot'); }
            } else {
                appendMessage("Hệ thống đang bận xíu, đằng ấy thử lại sau nha! 📸", 'bot');
            }
        } catch (error) {
            removeLoading(loadingId);
            appendMessage("Rất xin lỗi, mình đang mất kết nối máy chủ. Bạn vui lòng liên hệ qua Facebook của mình nhé! 😢", 'bot');
        } finally {
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
            inputEl.focus();
        }
    }

    function appendMessage(html, sender) {
        const div = document.createElement('div');
        div.className = `msg msg-${sender}`;
        div.innerHTML = html;
        messagesEl.appendChild(div);
        messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' });
    }

    function showLoading() {
        const id = 'loading-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = 'typing-indicator';
        div.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
        messagesEl.appendChild(div);
        messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' });
        return id;
    }

    function removeLoading(id) { const el = document.getElementById(id); if (el) el.remove(); }

    sendBtn.addEventListener('click', sendMessage);
    inputEl.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
}

document.addEventListener('DOMContentLoaded', initChatbot);