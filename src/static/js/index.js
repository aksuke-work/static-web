const topMv__list_type_01 = new Swiper('.topMv__list_type_01', {
  loop: true,
  slidesPerView: 1,
  effect: 'fade',
  speed: 1000,
  autoplay: { delay: 3000, disableOnInteraction: false, waitForTransition: true },
  pagination: {
    el: '.topMv__pagination_type_02', 
    clickable: true,
    renderBullet: (i, cls) => `<span class="${cls}">${String(i+1).padStart(2,'0')}</span>`
  },
});

const topMv__list_type_02 = new Swiper('.topMv__list_type_02', {
  loop: true,
  slidesPerView: 1,
  effect: 'fade',
  speed: 1000,
  autoplay: false,          
  allowTouchMove: false,    
  pagination: false,        
});
try { topMv__list_type_02.slideToLoop(topMv__list_type_01.realIndex, 0); } catch(e){}


(function timedOffsetSync(leader, follower, OFFSET_MS = 900){
  if (!leader || !follower) return;

  const bar1 = leader.el.querySelector('.topMv__loadingBar');
  const bar2 = follower.el.querySelector('.topMv__loadingBar');
  if (!bar1 || !bar2) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) { bar1.style.display = 'none'; bar2.style.display = 'none'; return; }

  const mq = window.matchMedia('(max-width: 768px)');
  const isH = () => mq.matches;

  const setT = (bar, v) => { bar.style.transform = isH() ? `translateX(${v}%)` : `translateY(${v}%)`; };
  const resetBar = (bar) => { bar.style.animation = 'none'; bar.style.opacity = '1'; setT(bar, -100); };
  const fillBar  = (bar) => { bar.style.animation = 'none'; bar.style.opacity = '1'; setT(bar,  0);  };

  const delay = (leader.params.autoplay && leader.params.autoplay.delay) || 3000;
  const spd2  = follower.params.speed || 1000;

  let freeze1 = false;
  let freeze2 = false;
  let leaderEndAt = performance.now();
  let followTimer = null;
  const clearFollowTimer = () => { if (followTimer) { clearTimeout(followTimer); followTimer = null; } };

  
  resetBar(bar1); resetBar(bar2);

  
  leader.on('slideChangeTransitionStart', () => {
    freeze1 = true; fillBar(bar1);
    clearFollowTimer();
    followTimer = setTimeout(() => {
      follower.slideToLoop(leader.realIndex, spd2); 
    }, Math.max(0, OFFSET_MS));
  });

  
  leader.on('slideChangeTransitionEnd', () => {
    leaderEndAt = performance.now(); 
    resetBar(bar1);
    freeze1 = false;
  });

  
  follower.on('slideChangeTransitionStart', () => { freeze2 = true;  fillBar(bar2); });
  follower.on('slideChangeTransitionEnd',   () => { resetBar(bar2); freeze2 = false; });

  
  let rafId = null;
  const tick = () => {
    const now = performance.now();

    
    if (!freeze1) {
      const p1 = Math.max(0, Math.min(1, (now - leaderEndAt) / delay));
      setT(bar1, -100 + p1 * 100);
    }

    
    if (!freeze2) {
      const p2 = Math.max(0, Math.min(1, ((now - leaderEndAt) - OFFSET_MS) / delay));
      setT(bar2, -100 + p2 * 100);
    }

    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);

  
  const onMQ = () => {
    if (freeze1) fillBar(bar1); else resetBar(bar1);
    if (freeze2) fillBar(bar2); else resetBar(bar2);
  };
  if (mq.addEventListener) mq.addEventListener('change', onMQ);
  else mq.addListener(onMQ);

  
  const cleanup = () => {
    clearFollowTimer();
    if (rafId) cancelAnimationFrame(rafId);
    if (mq.removeEventListener) mq.removeEventListener('change', onMQ);
    else if (mq.removeListener) mq.removeListener(onMQ);
  };
  leader.on('destroy', cleanup);
  follower.on('destroy', cleanup);
})(topMv__list_type_01, topMv__list_type_02, /* OFFSET_MS */ 900);

function initBrandsGalleryPair(mainSelector, subSelector) {
  const main = new Swiper(mainSelector, {
    loop: false,
    rewind: true,
    slidesPerView: 1,
    spaceBetween: 10,
    centeredSlides: true,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    speed: 1000,
    autoplay: { delay: 3000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    on: {
      init: function () {
        const swiper = this;
        const slides = swiper.slides;
        const active = slides[swiper.activeIndex];
        if (active) active.classList.add('is-entering');
        setTimeout(function () {
          if (active) active.classList.remove('is-entering');
        }, 1200);
        slides.forEach(function (el) {
          el.classList.remove('is-zooming');
        });
        if (active) {
          var total =
            (swiper.params.autoplay && swiper.params.autoplay.delay
              ? swiper.params.autoplay.delay
              : 3000) + (swiper.params.speed || 0);
          active.style.setProperty('--brands-zoom-duration', total + 'ms');
          active.classList.add('is-zooming');
        }
      },
      slideChangeTransitionStart: function () {
        const swiper = this;
        const slides = swiper.slides;
        const active = slides[swiper.activeIndex];
        const prev = slides[swiper.previousIndex];
        if (prev) prev.classList.remove('is-entering');
        if (prev) prev.classList.add('is-leaving');
        if (active) active.classList.remove('is-leaving');
        if (active) active.classList.add('is-entering');
        if (active) {
          var total =
            (swiper.params.autoplay && swiper.params.autoplay.delay
              ? swiper.params.autoplay.delay
              : 3000) + (swiper.params.speed || 0);
          active.style.setProperty('--brands-zoom-duration', total + 'ms');
          active.classList.add('is-zooming');
        }
      },
      slideChangeTransitionEnd: function () {
        const swiper = this;
        const slides = swiper.slides;
        slides.forEach(function (el) {
          el.classList.remove('is-entering');
          el.classList.remove('is-leaving');
        });
        slides.forEach(function (el, idx) {
          if (idx !== swiper.activeIndex) el.classList.remove('is-zooming');
        });
      },
    },
  });

  const sub = new Swiper(subSelector, {
    loop: false,
    rewind: true,
    slidesPerView: 1,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    speed: 1000,
    autoplay: false,
  });

  try {
    main.controller.control = sub;
    sub.controller.control = main;
    if (typeof sub.slideToLoop === 'function' && typeof main.realIndex === 'number') {
      sub.slideToLoop(main.realIndex, 0, false);
    }

    const getZoomDurationMs = () => {
      const d =
        main.params.autoplay && main.params.autoplay.delay ? main.params.autoplay.delay : 3000;
      const s = main.params.speed || 0;
      return d + s;
    };
    const setSubZoomForIndex = idx => {
      const slides = sub.slides;
      const el = slides && slides[idx];
      if (!el) return;
      el.style.setProperty('--brands-zoom-duration', getZoomDurationMs() + 'ms');
      el.classList.add('is-zooming');
    };
    const clearSubZoomExcept = activeIdx => {
      const slides = sub.slides;
      slides.forEach(function (el, i) {
        if (i !== activeIdx) el.classList.remove('is-zooming');
      });
    };

    setSubZoomForIndex(main.activeIndex);
    clearSubZoomExcept(main.activeIndex);
    main.on('slideChangeTransitionStart', function () {
      setSubZoomForIndex(main.activeIndex);
    });
    main.on('slideChangeTransitionEnd', function () {
      clearSubZoomExcept(main.activeIndex);
    });
  } catch (e) {}

  sub.on('tap', function () {
    const i = this.clickedIndex;
    if (i == null) return;
    main.slideTo(i);
  });

  return { main, sub };
}
initBrandsGalleryPair('.topBrands__galleryMainSwiper_type_01', '.topBrands__gallerySub_type_01');
initBrandsGalleryPair('.topBrands__galleryMainSwiper_type_02', '.topBrands__gallerySub_type_02');

// const topStoryBgSwiper = new Swiper('.topStory__bg', {
//   loop: true,
//   slidesPerView: 1,
//   spaceBetween: 10,
//   centeredSlides: true,
//   effect: 'fade',
//   speed: 1000,
//   autoplay: {
//     delay: 3000,
//     disableOnInteraction: false,
//   },
// });


// (function () {
//   if (!window.gsap || !window.ScrollTrigger) return;
//   const wrap = document.querySelector('.topStory__bg');
//   if (!wrap) return;
//   const imgs = wrap.querySelectorAll('.topStory__bgItemImg');
//   if (!imgs.length) return;

//   imgs.forEach(function (img) {
//     img.style.setProperty('--story-img-scale', 1);
//   });

//   ScrollTrigger.create({
//     trigger: wrap,
//     start: 'top bottom',
//     end: 'bottom top',
//     scrub: true,
//     onUpdate: self => {
//       const isNarrow = window.innerWidth <= 1260;
//       const min = isNarrow ? 0.95 : 0.9; 
//       const max = 1.0; 
//       const s = max - (max - min) * self.progress;
//       imgs.forEach(function (img) {
//         img.style.setProperty('--story-img-scale', s);
//       });
//     },
//   });
// })();




// (function () {
//   const wrap = document.querySelector('.topStory__bgWrap');
//   if (!wrap) return;

//   let ticking = false;
//   const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
//   function update() {
//     const rect = wrap.getBoundingClientRect();
//     const vh = window.innerHeight || document.documentElement.clientHeight;
//     const total = vh + rect.height;
//     const seen = clamp(vh - rect.top, 0, total);
//     const progress = total > 0 ? seen / total : 0;
//     const maxClip = 5; 
//     const clip = (maxClip * progress).toFixed(2) + '%';
//     wrap.style.setProperty('--story-clip', clip);
//   }
//   function onScrollOrResize() {
//     if (ticking) return;
//     ticking = true;
//     requestAnimationFrame(function () {
//       update();
//       ticking = false;
//     });
//   }
//   window.addEventListener('scroll', onScrollOrResize, { passive: true });
//   window.addEventListener('resize', onScrollOrResize);
//   update();
// })();

let topRecruitSwiper = null;

function duplicateToSixIfNeeded() {
  const list = document.querySelector('.topRecruit__galleryList');
  const slides = Array.from(list.querySelectorAll('.topRecruit__galleryItem'));
  if (slides.length === 3) {
    
    slides.forEach(s => list.appendChild(s.cloneNode(true)));
  }
}

function initTopRecruitSwiper() {
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    duplicateToSixIfNeeded(); 

    if (!topRecruitSwiper) {
      topRecruitSwiper = new Swiper('.topRecruit__gallery', {
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 10,
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
      });

      requestAnimationFrame(() => {
        topRecruitSwiper.update();
        topRecruitSwiper.slideToLoop(1, 0, false);
      });
    }
  } else {
    // PCの時はSwiperを完全に無効化
    if (topRecruitSwiper) {
      topRecruitSwiper.destroy(true, true);
      topRecruitSwiper = null;
    }
    
    // PCの時はSwiperのクラスを削除してスタイルを無効化
    const gallery = document.querySelector('.topRecruit__gallery');
    if (gallery) {
      gallery.classList.remove('swiper');
      gallery.classList.add('pc-gallery');
    }
    
    const galleryItems = document.querySelectorAll('.topRecruit__galleryItem');
    galleryItems.forEach(item => {
      item.classList.remove('swiper-slide');
    });
  }
}

initTopRecruitSwiper();
let _t;
window.addEventListener('resize', () => {
  clearTimeout(_t);
  _t = setTimeout(initTopRecruitSwiper, 120);
});

(function () {
  
  function waitForGSAP() {
    return new Promise((resolve) => {
      if (window.gsap && window.ScrollTrigger) {
        resolve();
      } else {
        const checkInterval = setInterval(() => {
          if (window.gsap && window.ScrollTrigger) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      }
    });
  }

  async function initTopRecruitParallax() {
    await waitForGSAP();
    // 769px 以上のみ実行（768px 以下は何もしない）
    if (window.matchMedia('(max-width: 768px)').matches) {
      return;
    }
    
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector('.topRecruit');
    if (!section) {
      console.log('topRecruit section not found');
      return;
    }

    const items = section.querySelectorAll('.topRecruit__galleryItem');
    if (!items.length) {
      console.log('topRecruit gallery items not found');
      return;
    }

    console.log('topRecruit parallax initialized with', items.length, 'items');

    
    const isNarrow = () => window.innerWidth <= 960;
    const base = () => (isNarrow() ? 3.5 : 7); 
    const factors = [-1, 0.8, -0.6];
    
    // 最初の画像の移動量を80pxに制限
    const maxFirstImageMovement = 80; 

    
    function setupParallax() {
      
      ScrollTrigger.getAll()
        .filter(st => st.vars && st.vars.id && String(st.vars.id).startsWith('recruit-parallax-'))
        .forEach(st => st.kill());

      items.forEach((item, i) => {
        let amt = base() * factors[i % factors.length];
        
        // 最初のアイテム（i === 0）の移動量を80pxに制限
        if (i === 0) {
          const itemHeight = item.offsetHeight;
          const maxPercent = (maxFirstImageMovement / itemHeight) * 100;
          amt = Math.min(amt, maxPercent);
        }
        
        // 2番目のアイテム（i === 1）は動かさない
        if (i === 1) {
          amt = 0; // 動かさない（トリガーはそのままでも無影響）
        }
        
        gsap.set(item, { force3D: true, willChange: 'transform' });
        
        // 画像がビューポート中央に来たタイミングで開始
        const scrollTriggerConfig = {
          id: 'recruit-parallax-' + i,
          trigger: item,
          start: 'center center',
          end: 'bottom top',
          scrub: true,
        };
        
        // 1枚目/3枚目は2枚目が中央に来たタイミングで同期開始
        if (i === 0 || i === 2) {
          scrollTriggerConfig.trigger = items[1] || section;
        }
        
        // 1番目/3番目のアイテムは早めに最大値に達するようにendを調整（開始から+160pxで完了）
        if (i === 0 || i === 2) {
          scrollTriggerConfig.end = '+=160';
        }
        
        // 1つ目のアイテムは下スクロールで下方向に0→80px
        if (i === 0) {
          gsap.fromTo(
            item,
            { y: 0 },
            {
              y: 80,
              ease: 'none',
              scrollTrigger: scrollTriggerConfig,
            }
          );
        } else if (i === 2) {
          // 3つ目のアイテムは下スクロールで上方向に0→-80px（2つ目と最終位置を揃える）
          gsap.fromTo(
            item,
            { y: 0 },
            {
              y: -80,
              ease: 'none',
              scrollTrigger: scrollTriggerConfig,
            }
          );
        } else {
          gsap.fromTo(
            item,
            { yPercent: -amt },
            {
              yPercent: amt,
              ease: 'none',
              scrollTrigger: scrollTriggerConfig,
            }
          );
        }
      });
    }

    setupParallax();
    
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setupParallax();
      }, 150);
    });
  }

  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTopRecruitParallax);
  } else {
    initTopRecruitParallax();
  }
})();

// (() => {
//   const pinWrap = document.querySelector('.topAbout__galleryPin'); 
//   const center = document.querySelector('.topAbout__galleryItem_num_03'); 
//   if (!pinWrap || !center) return;
//   if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

//   gsap.registerPlugin(ScrollTrigger);

  
//   const FILL_MARGIN = 1.03; 
//   const SCALE_CAP = 6.0;   
//   const EXTRA_ZOOM_MULTIPLIER = 1.5; 

  
//   const getViewportSize = () => {
//     const vw = (window.visualViewport && window.visualViewport.width) || window.innerWidth;
//     const vh = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
//     return { vw, vh };
//   };

  
//   const getFillAdjust = () => {
//     const { vw } = getViewportSize();
//     return vw <= 960 ? 5.9 : 1.08; 
//   };

  
//   const getCenterBiasY = () => {
//     const { vw, vh } = getViewportSize();
    
//     return vw <= 960 ? 0 : vh * 0.06; 
//   };

  
//   const applyPinClip = on => {
//     if (on) {
//       if (!pinWrap.dataset._saved) {
//         pinWrap.dataset._saved = JSON.stringify({
//           overflow: pinWrap.style.overflow || '',
//           height: pinWrap.style.height || '',
//         });
//       }
//       pinWrap.style.overflow = 'hidden';
//       pinWrap.style.height = '120vh';
//     } else {
//       const saved = pinWrap.dataset._saved ? JSON.parse(pinWrap.dataset._saved) : null;
//       pinWrap.style.overflow = saved ? saved.overflow : '';
//       pinWrap.style.height = saved ? saved.height : '';
//       delete pinWrap.dataset._saved;
//     }
//   };

  
//   const getInitialRadius = () => getComputedStyle(center).borderRadius || '0px';

  
//   const computeTargetScale = () => {
//     const prev = center.style.transform;
//     center.style.transform = 'none';
//     const r = center.getBoundingClientRect();
//     center.style.transform = prev;

//     const { vw, vh } = getViewportSize();
//     const cover = Math.max(vw / r.width, vh / r.height);
//     const s = cover * FILL_MARGIN * getFillAdjust() * EXTRA_ZOOM_MULTIPLIER;
//     return Math.max(1, Math.min(s, SCALE_CAP));
//   };

  
//   const computeOffsets = scale => {
//     const prev = center.style.transform;
//     center.style.transform = 'none';
//     const r = center.getBoundingClientRect();
//     center.style.transform = prev;

//     const ex = r.left + r.width / 2; 
//     const ey = r.top + r.height / 2;
//     const { vw, vh } = getViewportSize();
//     const vx = vw / 2; 
//     const vy = vh / 2 + getCenterBiasY(); 

    
//     return { x: vx - ex, y: vy - ey };
//   };

  
//   const computeBottomAlignDeltaY = scale => {
//     const prev = center.style.transform;
//     center.style.transform = 'none';
//     const r = center.getBoundingClientRect();
//     center.style.transform = prev;

//     const { vh } = getViewportSize();
//     const scaledH = r.height * scale;
    
    
//     const delta = (scaledH - vh) / 2;
//     return -delta; 
//   };

  
//   const getExtraBottomHidePx = () => {
//     const { vw, vh } = getViewportSize();
    
    
//     const ratio = vw <= 960 ? 0.20 : 0.45; 
//     return vh * ratio;
//   };

//   const build = () => {
    
//     ScrollTrigger.getAll().forEach(st => {
//       if (st.vars && (st.vars.trigger === pinWrap || st.vars.pin === pinWrap)) st.kill(true);
//     });

//     gsap.set(center, { transformOrigin: '50% 50%', willChange: 'transform' });

//     const initRadius = getInitialRadius();

//     const tl = gsap.timeline({
//       scrollTrigger: {
//         trigger: pinWrap,
//         pin: true, 
//         start: 'top top',
//         end: () => '+=' + Math.max(innerHeight * 1.8, 1000),
//         scrub: 1,
//         anticipatePin: 1,
//         invalidateOnRefresh: true, 
//         onToggle: self => applyPinClip(self.isActive),
//       },
//       defaults: { ease: 'none', force3D: true },
//     });

    
    
//     tl.set(center, { scale: 1, x: 0, y: 0, borderRadius: initRadius }, 0);
//     tl.to(
//       center,
//       {
//         x: () => computeOffsets(window.__galleryTargetScale || computeTargetScale()).x,
//         y: () => computeOffsets(window.__galleryTargetScale || computeTargetScale()).y,
//         duration: 0.35, 
//       },
//       0
//     );

    
//     tl.to(
//       center,
//       {
//         scale: () => {
//           const s = computeTargetScale();
//           window.__galleryTargetScale = s;
//           return s;
//         },
//         borderRadius: '0px',
//         duration: 0.65,
//       },
//       '>'
//     );

    
//     tl.to(
//       center,
//       {
//         y: () => {
//           const s = window.__galleryTargetScale || computeTargetScale();
//           return computeBottomAlignDeltaY(s) + computeOffsets(s).y + getExtraBottomHidePx(); 
//         },
//         duration: 0.2,
//       },
//       '>'
//     );

    
//     tl.to(
//       '.topBrands_type_01',
//       {
//         marginTop: 0,
//         duration: 0.1,
//         ease: 'none',
//       },
//       '>'
//     );
//   };

//   build();
//   addEventListener('resize', () => {
//     build();
//     ScrollTrigger.refresh();
//   });
//   addEventListener('orientationchange', () => {
//     build();
//     ScrollTrigger.refresh();
//   });
// })();

gsap.registerPlugin(ScrollTrigger);

const buildTopAboutGalleryTimeline = (cfg) => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".topAbout__gallery",
      start: cfg.start,
      end: cfg.end,
      scrub: cfg.scrub,
      pin: cfg.pin,
      pinSpacing: cfg.pinSpacing,
      anticipatePin: cfg.anticipatePin,
      // markers: cfg.markers === true,
      onUpdate: (self) => {
        const el = document.querySelector(".topAbout__galleryInner");
        if (!el) return;
        if (self.progress === 1) {
          el.classList.add("is-scaled");
        } else {
          el.classList.remove("is-scaled");
        }
      }
    }
  });

  // 拡大終了比率（0〜1）。指定なしは 1（従来どおり最後まで拡大）
  const scalePart = typeof cfg.stopAt === "number" ? Math.max(0, Math.min(1, cfg.stopAt)) : 1;

  tl.fromTo(
    ".topAbout__galleryInner",
    { scale: 1 },
    {
      scale: cfg.scale,
      y: typeof cfg.y === "function" ? cfg.y() : cfg.y,
      ease: cfg.ease,
      duration: scalePart
    }
  );

  // 後半は変化なしでスクラブを消化（ピンは維持）
  if (scalePart < 1) {
    tl.to(
      ".topAbout__galleryInner",
      { duration: 1 - scalePart }
    );
  }

  return tl;
};

ScrollTrigger.matchMedia({
  "(min-width: 961px)": function () {
    buildTopAboutGalleryTimeline({
      start: "top+=" + (window.innerHeight * 0.4) + " center",
      end: "+=16%",
      scrub: 1.2,
      pin: true,
      pinSpacing: false,
      anticipatePin: 1,
      scale: 2.1,
      y: () => window.innerHeight * 0.283,
      stopAt: 1,
      ease: "power2.out"
    });
  },

  "(min-width: 769px) and (max-width: 960px)": function () {
    // タブレット相当（769〜960px）
    buildTopAboutGalleryTimeline({
      start: "top+=" + (window.innerHeight * 0.22) + " center",
      end: "+=70%",
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      scale: 2,
      y: () => window.innerHeight * -0.25,
      ease: "power2.out"
    });
  },

  "(max-width: 768px)": function () {
    buildTopAboutGalleryTimeline({
      // start: "top+=" + (window.innerHeight * 0.30) + " top+=180", // 下で固定
      start: "top+=" + (window.innerHeight * 0.30) + " center",
      end: "+=40%",                    // 余白が残るならさらに短縮
      // endTrigger: ".topBrands",     // 基準を次セクションにしたい場合はこちらも使用
      // end: "top top+=20",
      scrub: 0.9,
      pin: true,
      anticipatePin: 1,
      scale: 2,
      y: () => window.innerWidth * 0.29,
      ease: "power2.out"
    });
  }
});

(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  const PRM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const getAmountPx = () => {
    const base = 80; // PCでの移動量基準
    return PRM ? Math.round(base * 0.5) : base;
  };

  const setupDesktopParallax = () => {
    const texts = document.querySelectorAll('.topBrands__texts');
    const subs = document.querySelectorAll('.topBrands__gallerySub');

    texts.forEach((el, i) => {
      gsap.set(el, { willChange: 'transform', force3D: true });
      gsap.fromTo(
        el,
        { y: 0 },
        {
          y: () => getAmountPx(), // 下方向へ
          ease: 'none',
          scrollTrigger: {
            id: 'brands-texts-' + i,
            trigger: el,
            start: 'top 90%',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          }
        }
      );
    });

    subs.forEach((el, i) => {
      gsap.set(el, { willChange: 'transform', force3D: true });
      gsap.fromTo(
        el,
        { y: 0 },
        {
          y: () => -getAmountPx(), // 上方向へ
          ease: 'none',
          scrollTrigger: {
            id: 'brands-sub-' + i,
            trigger: el,
            start: 'top 90%',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          }
        }
      );
    });
  };

  const killBrandsParallax = () => {
    ScrollTrigger.getAll().forEach((st) => {
      const id = st && st.vars && st.vars.id;
      if (id && (String(id).startsWith('brands-texts-') || String(id).startsWith('brands-sub-'))) {
        st.kill();
      }
    });
    document.querySelectorAll('.topBrands__texts, .topBrands__gallerySub').forEach((el) => {
      gsap.set(el, { clearProps: 'transform' });
    });
  };

  ScrollTrigger.matchMedia({
    '(min-width: 961px)': function () {
      setupDesktopParallax();
    },
    '(max-width: 960px)': function () {
      killBrandsParallax();
    }
  });
})();

addEventListener("load", () => {
  ScrollTrigger.refresh();
});

