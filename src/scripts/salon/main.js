/**
 * サロンサイト用JavaScript
 */

$(document).ready(function () {
    // ページ読み込み時のフェードイン処理
    setTimeout(function () {
        $('body').removeClass('fade');
    }, 100);

    // ページ遷移オーバーレイの非表示
    $('.page-transition-overlay').addClass('is-hidden');
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
            $('.salonStyleGallery__item').fadeIn(300);
        } else {
            $('.salonStyleGallery__item').fadeOut(300);
            $(`.salonStyleGallery__item[data-category="${filter}"]`).fadeIn(300);
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
