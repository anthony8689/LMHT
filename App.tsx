import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Champion } from './types';

// --- DATA --- //
const championsData: Champion[] = [
  {
    name: 'Yasuo',
    title: 'Kẻ Bất Dung Thứ',
    description: 'Một kiếm sĩ Ionia đầy kiêu hãnh với khả năng điều khiển gió, trên hành trình tìm lại danh dự. Lối chơi của Yasuo là một sát thủ/đấu sĩ cận chiến với độ cơ động cực cao, đòi hỏi kỹ năng đỉnh cao để lả lướt giữa đội hình địch.',
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg',
  },
  {
    name: 'Kai\'Sa',
    title: 'Ái Nữ Hư Không',
    description: 'Trở về từ Hư Không với một bộ giáp sống, Kai\'Sa là một thợ săn siêu hạng. Cô là một xạ thủ cơ động, có khả năng ám sát mục tiêu yếu máu từ xa và gây sát thương đột biến, thích ứng với mọi tình huống.',
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Kaisa_0.jpg',
  },
  {
    name: 'Sett',
    title: 'Đại Ca',
    description: 'Vươn lên từ các đấu trường ngầm, Sett là vua của thế giới tội phạm Ionia. Sett là một đấu sĩ cận chiến cực kỳ mạnh mẽ, sẵn sàng lao vào giữa giao tranh, chịu đòn và trả lại sát thương khổng lồ.',
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Sett_0.jpg',
  },
];

// --- HELPER & UI COMPONENTS (Defined outside main App component) --- //

const FreeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18V6M7 12H5a2 2 0 00-2 2v2a2 2 0 002 2h2M17 12h2a2 2 0 012 2v2a2 2 0 01-2 2h-2" />
  </svg>
);

const UpdateIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h5M20 20v-5h-5" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 9a9 9 0 0114.13-5.22M20 15a9 9 0 01-14.13 5.22" />
  </svg>
);

const CommunityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a3.002 3.002 0 014.288 0M12 12a3 3 0 100-6 3 3 0 000 6z" />
  </svg>
);

const CTAButton: React.FC = () => (
    <a 
      href="https://dantri.com.vn/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Tải game miễn phí (mở trong tab mới)"
      className="inline-block text-center font-garamond text-xl md:text-2xl font-bold text-brand-off-white bg-brand-blue-luminous rounded-sm px-10 py-4 uppercase tracking-widest
     transform transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-125 hover:shadow-glow-blue focus:outline-none focus:ring-4 focus:ring-brand-blue-luminous/50">
      Tải Game Miễn Phí
    </a>
);

const AnimatedSection: React.FC<{ as?: React.ElementType; children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ as: Component = 'div', children, className, ...rest }) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <Component ref={ref} className={`${className} fade-in-section ${isVisible ? 'is-visible' : ''}`} {...rest}>
      {children}
    </Component>
  );
};

// --- SECTION COMPONENTS --- //

const HeroSection: React.FC = () => {
    const [imageSrc, setImageSrc] = useState("https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt4e6d457b06833777/5f7f72521731384562b77a6f/Warriors-2020-Cinematic-Still-09-Yasuo-vs-KaiSa.jpg");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setImageSrc(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const handlePaste = (event: ClipboardEvent) => {
            const items = event.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    if (blob) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            if (e.target?.result) {
                                setImageSrc(e.target.result as string);
                            }
                        };
                        reader.readAsDataURL(blob);
                        return;
                    }
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => {
            window.removeEventListener('paste', handlePaste);
        };
    }, []);
    
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-between text-center text-brand-off-white overflow-hidden py-16 bg-brand-blue-dark">
            {/* Top element: Banner Image */}
            <div className="container mx-auto px-4 w-full animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <div className="relative w-full max-w-5xl mx-auto border-2 border-brand-gold/30 rounded-lg overflow-hidden shadow-glow-gold">
                    <img
                        src={imageSrc}
                        alt="Một cảnh chiến đấu mãn nhãn giữa các tướng Liên Minh Huyền Thoại"
                        className="w-full h-auto object-cover"
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                        aria-hidden="true"
                    />
                     <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2 z-10">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-brand-gold text-brand-blue-dark font-bold py-2 px-4 rounded-md text-sm
                                       hover:bg-brand-off-white transition-colors duration-300 shadow-lg"
                            aria-label="Tải ảnh từ máy tính"
                        >
                            Tải ảnh từ máy
                        </button>
                        <p className="text-xs text-brand-off-white bg-black/60 px-2 py-1 rounded">
                            Hoặc dán ảnh (Ctrl+V)
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom element: Text content */}
            <div className="container mx-auto px-4 w-full animate-fadeIn" style={{ animationDelay: '0.5s' }}>
                <div className="max-w-3xl mx-auto">
                    <h1 className="font-garamond text-6xl md:text-7xl font-bold text-brand-off-white drop-shadow-lg">
                        League of Legends
                    </h1>
                    <p className="font-roboto text-lg md:text-xl text-brand-gray-light mt-4">
                        Khám phá đấu trường 5v5 đỉnh cao, nơi kỹ năng, chiến thuật và tinh thần đồng đội làm nên chiến thắng.
                    </p>
                    <div className="mt-8">
                        <CTAButton />
                    </div>
                </div>
            </div>
        </section>
    );
};


const CoreBenefitsSection: React.FC = () => (
  <AnimatedSection as="section" className="py-20 bg-brand-blue-dark" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/dark-metal.png')"}}>
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-12 text-center">
        <div className="flex flex-col items-center p-6 border border-brand-gold/20 rounded-lg bg-black/20">
          <div className="p-4 rounded-full bg-brand-gold/10 border-2 border-brand-gold/30 shadow-glow-gold mb-4">
            <FreeIcon className="w-12 h-12 text-brand-gold" />
          </div>
          <h3 className="font-garamond text-3xl font-bold text-brand-off-white mb-3">HOÀN TOÀN MIỄN PHÍ</h3>
          <p className="text-brand-gray-light">Chơi miễn phí, chiến thắng bằng kỹ năng. Mọi thứ bạn cần để chiến thắng đều có thể đạt được trong game mà không cần trả tiền.</p>
        </div>
        <div className="flex flex-col items-center p-6 border border-brand-gold/20 rounded-lg bg-black/20">
          <div className="p-4 rounded-full bg-brand-gold/10 border-2 border-brand-gold/30 shadow-glow-gold mb-4">
            <UpdateIcon className="w-12 h-12 text-brand-gold" />
          </div>
          <h3 className="font-garamond text-3xl font-bold text-brand-off-white mb-3">CẬP NHẬT LIÊN TỤC</h3>
          <p className="text-brand-gray-light">Một vũ trụ không ngừng mở rộng với tướng mới, sự kiện hoành tráng và trang phục độc đáo được ra mắt đều đặn.</p>
        </div>
        <div className="flex flex-col items-center p-6 border border-brand-gold/20 rounded-lg bg-black/20">
          <div className="p-4 rounded-full bg-brand-gold/10 border-2 border-brand-gold/30 shadow-glow-gold mb-4">
            <CommunityIcon className="w-12 h-12 text-brand-gold" />
          </div>
          <h3 className="font-garamond text-3xl font-bold text-brand-off-white mb-3">CỘNG ĐỒNG TOÀN CẦU</h3>
          <p className="text-brand-gray-light">Gia nhập cộng đồng hàng triệu người chơi. Tìm kiếm đồng đội và đối thủ từ khắp nơi trên thế giới.</p>
        </div>
      </div>
    </div>
  </AnimatedSection>
);

const ChampionSliderSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % championsData.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + championsData.length) % championsData.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000); // Auto-slide every 7 seconds
    return () => clearInterval(timer);
  }, [nextSlide]);
  
  return (
    <AnimatedSection as="section" className="py-20 bg-black/50 overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-garamond text-5xl md:text-6xl font-bold text-brand-off-white mb-12">Chọn Vị Tướng Của Bạn</h2>
        <div className="relative">
          <div className="overflow-hidden relative h-[600px]">
            <div className="flex transition-transform duration-700 ease-in-out h-full" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {championsData.map((champion, index) => (
                <div key={index} className="w-full flex-shrink-0 h-full">
                  <div className="grid md:grid-cols-2 gap-8 h-full items-center">
                    <div className="h-full w-full">
                       <img src={champion.imageUrl} alt={champion.name} className="object-cover object-top w-full h-full rounded-lg shadow-2xl border-2 border-brand-gold/30" />
                    </div>
                    <div className="text-left p-4">
                      <h3 className="font-garamond text-4xl font-bold text-brand-gold">{champion.name}</h3>
                      <h4 className="font-roboto text-xl text-brand-off-white mb-4">{champion.title}</h4>
                      <p className="text-brand-gray-light leading-relaxed">{champion.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={prevSlide} className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-8 text-brand-gold bg-black/50 p-3 rounded-full hover:bg-brand-gold hover:text-brand-blue-dark transition-colors duration-300 z-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={nextSlide} className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-8 text-brand-gold bg-black/50 p-3 rounded-full hover:bg-brand-gold hover:text-brand-blue-dark transition-colors duration-300 z-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </AnimatedSection>
  );
};

const TrailerSection: React.FC = () => (
  <AnimatedSection as="section" className="py-20 bg-brand-blue-dark">
    <div className="container mx-auto px-6 text-center">
      <h2 className="font-garamond text-5xl md:text-6xl font-bold text-brand-off-white mb-12">Chứng Kiến Những Trận Chiến Kinh Điển</h2>
      <div className="aspect-w-16 aspect-h-9 max-w-5xl mx-auto border-4 border-brand-gold/50 shadow-glow-gold rounded-lg overflow-hidden">
        <iframe 
          className="w-full h-full"
          src="https://www.youtube.com/embed/MOiCO3BeLM4?autoplay=0&mute=0&controls=1&playsinline=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1"
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen>
        </iframe>
      </div>
    </div>
  </AnimatedSection>
);

const FinalCTASection: React.FC = () => (
  <AnimatedSection as="section" className="relative py-24 text-center text-brand-off-white">
    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.contentstack.io/v3/assets/blt0eb2a2986b72f16c/blt4915bf3345425683/6181792fd375f15a165121a5/IONIA_environment_01.jpg')" }}></div>
    <div className="absolute inset-0 bg-brand-blue-dark/80"></div>
    <div className="relative z-10 container mx-auto px-6 flex flex-col items-center">
      <h2 className="font-garamond text-5xl md:text-6xl font-bold">Hành Trình Của Bạn Bắt Đầu Từ Đây</h2>
      <p className="max-w-2xl mt-4 text-lg text-brand-gray-light">Hàng triệu người chơi đang chờ đợi bạn trên Đấu Trường Công Lý. Tải game và khẳng định bản thân ngay hôm nay!</p>
      <div className="mt-10">
        <CTAButton />
      </div>
    </div>
  </AnimatedSection>
);

// --- MAIN APP COMPONENT --- //

export default function App() {
  return (
    <main>
      <HeroSection />
      <CoreBenefitsSection />
      <ChampionSliderSection />
      <TrailerSection />
      <FinalCTASection />
      <footer className="bg-black py-4 text-center text-brand-gray-light/50">
        <p>&copy; {new Date().getFullYear()} Riot Games, Inc. All rights reserved.</p>
      </footer>
    </main>
  );
}