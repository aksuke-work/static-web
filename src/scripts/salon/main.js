/**
 * サロンサイト用JavaScript
 */

// ページ読み込み前から実行（即座にオーバーレイを非表示）
(function () {
    function removeOverlays() {
        if (typeof $ !== 'undefined') {
            $('body').removeClass('fade').addClass('loaded');
            $('.page-transition-overlay').addClass('is-hidden loaded');
        } else {
            // jQueryが読み込まれる前の場合
            document.body.classList.remove('fade');
            document.body.classList.add('loaded');
            const overlay = document.querySelector('.page-transition-overlay');
            if (overlay) {
                overlay.classList.add('is-hidden', 'loaded');
            }
        }
    }
    
    // 初期表示時に表示領域内のfadein要素を即座に表示
    function showVisibleFadeinElements() {
        const fadeinElements = document.querySelectorAll('.fadein, .salonStaff__item, .salonStyleGallery__item');
        const viewportHeight = window.innerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const viewportBottom = scrollTop + viewportHeight + 200; // 200px余裕を持たせる
        
        fadeinElements.forEach(function(element, index) {
            const rect = element.getBoundingClientRect();
            const elementTop = scrollTop + rect.top;
            
            if (elementTop < viewportBottom && !element.classList.contains('jsActive') && !element.classList.contains('is-visible')) {
                // 段階的な遅延を追加
                setTimeout(function() {
                    element.classList.add('is-visible');
                }, index * 30);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            removeOverlays();
            setTimeout(showVisibleFadeinElements, 100);
        });
    } else {
        removeOverlays();
        setTimeout(showVisibleFadeinElements, 100);
    }
})();

$(document).ready(function () {
    // ページ読み込み時のフェードイン処理（念のため再度実行）
    $('body').removeClass('fade').addClass('loaded');
    $('.page-transition-overlay').addClass('is-hidden loaded');

    // スクロールアニメーション（.fadein要素に.jsActiveを付与）
    // Unified FadeIn Logic
    function checkFadeIn() {
        const targets = document.querySelectorAll('.fadein, .salonStaff__item, .salonStyleGallery__item');
        const viewportBottom = window.innerHeight + window.pageYOffset + 100; // Buffer

        targets.forEach((element, index) => {
            if (element.classList.contains('is-visible')) return;

            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + window.pageYOffset;

            if (elementTop < viewportBottom) {
                // Use a slight staggered delay based on index relative to the viewport/loop
                // But keep it snappy
                setTimeout(() => {
                    element.classList.add('is-visible');
                    element.style.opacity = '1'; // Force inline style for safety
                    element.style.transform = 'translateY(0)'; // Force reset transform
                }, 100); 
            }
        });
    }

    // Run on load, scroll, and resize
    window.addEventListener('scroll', checkFadeIn);
    window.addEventListener('resize', checkFadeIn);
    
    // Initial check with a small delay to ensure layout is ready
    setTimeout(checkFadeIn, 100);
    // Failsafe: Force show everything after 3 seconds if something goes wrong
    setTimeout(() => {
        document.querySelectorAll('.fadein').forEach(el => {
            if (getComputedStyle(el).opacity === '0') {
                el.classList.add('is-visible');
                el.style.opacity = '1';
            }
        });
    }, 3000);
    // ハンバーガーメニューのトグル
    $('.js-toggle-menu').on('click', function () {
        $('.gNav').toggleClass('isActive');
        $('.header').toggleClass('isActive');
        $(this).toggleClass('isActive');
        $('body').toggleClass('isMenuOpen');
    });

    // メニューリンククリック時にメニューを閉じる
    $('.gNav__link').on('click', function () {
        if ($(window).width() <= 960) {
            $('.gNav').removeClass('isActive');
            $('.header').removeClass('isActive');
            $('.js-toggle-menu').removeClass('isActive');
            $('body').removeClass('isMenuOpen');
        }
    });

    // ギャラリーフィルター
    $('.salonStyleGallery__filterButton').on('click', function () {
        const filter = $(this).data('filter');
        $('.salonStyleGallery__filterButton').removeClass('salonStyleGallery__filterButton_type_active');
        $(this).addClass('salonStyleGallery__filterButton_type_active');

        if (filter === 'all') {
            $('.salonStyleGallery__item').each(function (index) {
                const $item = $(this);
                // Remove hidden class and add visible class with delay
                setTimeout(function () {
                    $item.css('display', 'block');
                    setTimeout(function() {
                        $item.addClass('is-visible');
                    }, 10);
                }, index * 50);
            });
        } else {
            // Hide non-matching items
            $('.salonStyleGallery__item').each(function () {
                const $item = $(this);
                const category = $item.data('category');
                if (category !== filter) {
                    $item.removeClass('is-visible');
                    setTimeout(function () {
                        $item.css('display', 'none');
                    }, 300);
                }
            });
            
            // Show matching items with delay
            $(`.salonStyleGallery__item[data-category="${filter}"]`).each(function (index) {
                const $item = $(this);
                $item.css('display', 'block');
                setTimeout(function () {
                    $item.addClass('is-visible');
                }, index * 50);
            });
        }
    });

    // スムーススクロール
    $('a[href^="#"]').on('click', function (e) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').animate(
                {
                    scrollTop: target.offset().top - 80,
                },
                500
            );
        }
    });

    // フォームバリデーション
    $('.salonReserveForm__form').on('submit', function (e) {
        let isValid = true;
        $(this)
            .find('input[required], select[required], textarea[required]')
            .each(function () {
                if (!$(this).val()) {
                    isValid = false;
                    $(this).addClass('isError');
                } else {
                    $(this).removeClass('isError');
                }
            });

        if (!isValid) {
            e.preventDefault();
            alert('必須項目を入力してください');
        }
    });

    // スクロールアニメーション（GSAP + ScrollTrigger）強化
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // フェードインアニメーション（強化）
        gsap.utils.toArray('.salonConcept, .salonPopularMenu, .salonFirstTime, .salonNews, .salonAccess').forEach(function (elem, index) {
            gsap.fromTo(
                elem,
                {
                    opacity: 0,
                    y: 80,
                    scale: 0.95,
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.2,
                    ease: 'power3.out',
                    delay: index * 0.1,
                    scrollTrigger: {
                        trigger: elem,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        });

        // メニューカードの個別アニメーション
        gsap.utils.toArray('.menuCard').forEach(function (card, index) {
            gsap.fromTo(
                card,
                {
                    opacity: 0,
                    y: 60,
                    scale: 0.9,
                    rotation: -5,
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotation: 0,
                    duration: 0.8,
                    ease: 'back.out(1.7)',
                    delay: index * 0.15,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        });

        // スタッフカードの個別アニメーション
        gsap.utils.toArray('.salonStaff__item').forEach(function (card, index) {
            // カードの位置を確認
            const cardTop = card.getBoundingClientRect().top + window.pageYOffset;
            const viewportHeight = window.innerHeight;
            const isInViewport = cardTop < (window.pageYOffset + viewportHeight);

            // 初期表示領域内の要素は即座に表示
            if (isInViewport) {
                gsap.set(card, { opacity: 1, y: 0, scale: 1 });
                card.classList.add('is-visible');
            } else {
                // 表示領域外の要素のみアニメーション
                gsap.fromTo(
                    card,
                    {
                        opacity: 0,
                        y: 30,
                        scale: 0.95,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        ease: 'power3.out',
                        delay: index * 0.1,
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            toggleActions: 'play none none reverse',
                        },
                        onStart: function() {
                            card.classList.add('is-visible');
                        },
                    }
                );
            }
        });

        // ギャラリーアイテムの個別アニメーション
        gsap.utils.toArray('.salonStyleGallery__item').forEach(function (item, index) {
            // Skip GSAP animation for gallery items, use CSS-based animation instead
            // This prevents conflicts with the filter functionality
            const observer = new IntersectionObserver(
                function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting && !item.classList.contains('is-visible')) {
                            setTimeout(function() {
                                item.classList.add('is-visible');
                            }, index * 100);
                            observer.unobserve(item);
                        }
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -100px 0px'
                }
            );
            observer.observe(item);
        });

        // パララックス効果（ヒーロー画像）
        const heroImage = document.querySelector('.salonHero__imageImg');
        if (heroImage) {
            gsap.to(heroImage, {
                y: '30%',
                ease: 'none',
                scrollTrigger: {
                    trigger: '.salonHero',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            });
        }

        // セクションタイトルのアニメーション
        gsap.utils.toArray('.sectionTitle').forEach(function (title) {
            gsap.fromTo(
                title,
                {
                    opacity: 0,
                    y: 40,
                    scale: 0.9,
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: title,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );

            // アンダーラインのアニメーション
            const underline = title.querySelector('::after');
            if (underline) {
                gsap.fromTo(
                    title,
                    {
                        '--scale-x': 0,
                    },
                    {
                        '--scale-x': 1,
                        duration: 0.8,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: title,
                            start: 'top 90%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );
            }
        });
    }
});
