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
    function checkFadeIn() {
        $('.fadein, .salonStaff__item, .salonStyleGallery__item').each(function (index) {
            const $element = $(this);
            if (!$element.hasClass('jsActive') && !$element.hasClass('is-visible')) {
                const elementTop = $element.offset().top;
                const elementBottom = elementTop + $element.outerHeight();
                const viewportTop = $(window).scrollTop();
                const viewportBottom = viewportTop + $(window).height();
                const triggerPoint = viewportBottom - 100; // 100px手前で表示

                if (elementTop < triggerPoint) {
                    // 段階的な遅延を追加
                    setTimeout(function () {
                        $element.addClass('is-visible');
                    }, index * 50);
                }
            }
        });
    }

    // 初期表示時に表示領域内の要素を即座に表示
    setTimeout(function () {
        $('.fadein, .salonStaff__item, .salonStyleGallery__item').each(function (index) {
            const $element = $(this);
            if ($element.length && $element.offset()) {
                const elementTop = $element.offset().top;
                const viewportBottom = $(window).height() + 200; // 200px余裕を持たせる

                if (elementTop < viewportBottom && !$element.hasClass('jsActive') && !$element.hasClass('is-visible')) {
                    // 表示領域内の要素は即座に表示
                    setTimeout(function () {
                        $element.addClass('is-visible');
                    }, index * 30);
                }
            }
        });
        
        // salonConceptセクション内の要素を確実に表示（オーバーラップしているため）
        $('.salonConcept .fadein').each(function (index) {
            const $element = $(this);
            if (!$element.hasClass('jsActive') && !$element.hasClass('is-visible')) {
                setTimeout(function () {
                    $element.addClass('is-visible');
                }, index * 50);
            }
        });
    }, 100);

    // スクロール時にアニメーションをチェック
    $(window).on('scroll', function () {
        checkFadeIn();
    });

    // リサイズ時もチェック
    $(window).on('resize', function () {
        checkFadeIn();
    });
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
                setTimeout(function () {
                    $item.fadeIn(300).addClass('is-visible');
                }, index * 50);
            });
        } else {
            $('.salonStyleGallery__item').each(function (index) {
                const $item = $(this);
                setTimeout(function () {
                    $item.fadeOut(300, function () {
                        $(this).removeClass('is-visible');
                    });
                }, index * 30);
            });
            $(`.salonStyleGallery__item[data-category="${filter}"]`).each(function (index) {
                const $item = $(this);
                setTimeout(function () {
                    $item.fadeIn(300).addClass('is-visible');
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
        });

        // ギャラリーアイテムの個別アニメーション
        gsap.utils.toArray('.salonStyleGallery__item').forEach(function (item, index) {
            gsap.fromTo(
                item,
                {
                    opacity: 0,
                    scale: 0.9,
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    delay: index * 0.1,
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                    onStart: function() {
                        item.classList.add('is-visible');
                    },
                }
            );
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
