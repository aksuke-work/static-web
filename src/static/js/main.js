
function waitForjQuery(callback) {
  if (typeof jQuery !== 'undefined') {
    callback(jQuery);
  } else {
    setTimeout(function() {
      waitForjQuery(callback);
    }, 10);
  }
}

waitForjQuery(function($) {
  'use strict';

  function normPath(p) {
    p = p || '/';
    return p.replace(/\/+$/, '') || '/';
  }
  function samePath(urlA, urlB) {
    return normPath(urlA.pathname) === normPath(urlB.pathname);
  }
  function isSameOrigin(url) {
    return url.origin === location.origin;
  }
  function resolveURL(href) {
    try {
      return new URL(href, location.href);
    } catch (e) {
      return null;
    }
  }
  function getHeaderHeight() {
    var $hdr = $('.header'); 
    return $hdr.length ? $hdr.outerHeight() : 0;
  }
  function isPC() {
    return $(window).width() > 960;
  }

  
  
  
  function disableInitialFadeinInView() {
    var wh = $(window).height();
    var st = $(window).scrollTop();
    $('.fadein').each(function () {
      var $el = $(this);
      var top = $el.offset().top;
      if (top < st + wh) {
        $el.addClass('jsActive initial-visible');
      }
    });
    requestAnimationFrame(function () {
      $('.fadein.initial-visible').each(function () {
        $(this).removeClass('initial-visible');
      });
    });
  }

  
  function smoothScrollTo($target, opts) {
    if (!$target || !$target.length) return;

    var speed = (opts && opts.speed) || 600;
    var extraOffset = (opts && opts.offset) || 0;

    var headerH = getHeaderHeight();
    var top = Math.max(0, $target.offset().top - headerH - 80 - extraOffset);

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      window.scrollTo(0, top);
    } else {
      $('html, body').stop(true).animate({ scrollTop: top }, speed, 'swing');
    }

    
    var el = $target.get(0);
    var focusable = /^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(el.tagName) || el.tabIndex >= 0;
    if (!focusable) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }

  function fireFadeinOnScroll() {
    var win = $(window);
    var wh = win.height();
    var scroll = win.scrollTop();
    $('.fadein').each(function () {
      var $t = $(this);
      var top = $t.offset().top;
      if (scroll > top - wh + 200) {
        $t.addClass('jsActive');
      }
    });
  }

  
  $(function () {
    
    disableInitialFadeinInView();

    
    var initialHash = window.location.hash;
    if (initialHash && initialHash !== '#') {
      var $t = $(initialHash);
      if ($t.length) {
        setTimeout(function () { smoothScrollTo($t, { speed: 600 }); }, 0);
      }
    }

    
    var FIX_HEADER_THRESHOLD = 1;
    function applyHeaderScrolled() {
      if ($(window).scrollTop() > FIX_HEADER_THRESHOLD) {
        $('.header').addClass('isScrolled');
      } else {
        $('.header').removeClass('isScrolled');
      }
    }
    applyHeaderScrolled();
    fireFadeinOnScroll();

    $(window).on('scroll.main', function () {
      applyHeaderScrolled();
      fireFadeinOnScroll();
    });

    
    $(window).on('resize.main', function () {
      if (!isPC()) {
        
        $('.gNav__item_type_mm').removeClass('jsActive').find('.mm').removeClass('jsActive');
        $('.gNav__item_type_mm').find('.gNav__link').removeClass('jsActive');
        $('.header__bg').removeClass('jsActive');
      }
    });

    
    $('.ham').on('click.main', function () {
      $('body').toggleClass('is__fix');
      $('.header').toggleClass('jsActive');
    });

    
    $('.toggleIcon').on('click.main', function () {
      $(this).next().slideToggle();
      $(this).toggleClass('jsActive');
    });

    
    
    
    $(document)
      .on('mouseenter.gnav', '.gNav__item_type_mm', function () {
        if (!isPC()) return;
        var $item = $(this);
        $item.addClass('jsActive');
        $item.find('.mm').addClass('jsActive');
        $item.find('.gNav__link').addClass('jsActive');
        $('.header__bg').addClass('jsActive');
      })
      .on('mouseleave.gnav', '.gNav__item_type_mm', function () {
        if (!isPC()) return;
        var $item = $(this);
        $item.removeClass('jsActive');
        $item.find('.mm').removeClass('jsActive');
        $item.find('.gNav__link').removeClass('jsActive');
        $('.header__bg').removeClass('jsActive');
      });

    
    
    
    $(document).on('click.smoothScroll', 'a:not([target]):not([download])', function (e) {
      
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      var href = $(this).attr('href');
      if (!href) return;
      if (/^(?:javascript:|mailto:|tel:)/i.test(href)) return;

      var url = resolveURL(href);
      if (!url) return;

      
      if (isSameOrigin(url) && samePath(url, location) && url.hash && url.hash !== '#') {
        var $target = $(url.hash);
        if ($target.length) {
          e.preventDefault();

          
          $('body').removeClass('is__fix');
          $('.header').removeClass('jsActive');

          smoothScrollTo($target, { speed: 600 });

          
          if (history.pushState) {
            history.pushState(null, '', url.hash);
          } else {
            location.hash = url.hash;
          }
        }
      }
    });

    
    window.addEventListener('hashchange', function () {
      var hash = window.location.hash;
      if (hash && hash !== '#') {
        var $t = $(hash);
        if ($t.length) {
          smoothScrollTo($t, { speed: 400 });
        }
      }
    });
  });

  
  
  
  (function () {
    function hideOverlay() {
      var overlay = document.getElementById('page-transition-overlay');
      if (overlay) {
        requestAnimationFrame(function () {
          overlay.classList.add('is-hidden');
          setTimeout(function () {
            if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
          }, 600);
        });
      }
    }

    
    if (document.readyState === 'complete') {
      hideOverlay();
    } else {
      window.addEventListener('load', hideOverlay);
    }

    
    document.addEventListener('click', function (e) {
      
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      var anchor = e.target.closest('a');
      if (!anchor) return;

      var href = anchor.getAttribute('href') || '';
      var target = anchor.getAttribute('target');
      var download = anchor.hasAttribute('download');

      if (!href) return;
      if (target === '_blank' || download) return;
      if (/^(?:javascript:|mailto:|tel:)/i.test(href)) return;

      var url = resolveURL(href);
      if (!url) return;

      
      if (!isSameOrigin(url)) return;

      
      var sameP = samePath(url, location);

      
      if (sameP && url.hash && url.hash !== '#') return;

      
      if (sameP && url.search === location.search && (!url.hash || url.hash === '')) return;

      
      e.preventDefault();

      
      var overlay = document.createElement('div');
      overlay.id = 'page-transition-overlay';
      overlay.className = 'page-transition-overlay is-hidden';
      document.body.appendChild(overlay);

      requestAnimationFrame(function () {
        overlay.classList.remove('is-hidden');
        document.body.classList.add('is-transitioning');
        setTimeout(function () {
          location.href = url.href;
        }, 400); 
      });
    });

    
    $(window).on('pageshow', function () {
      $('body').removeClass('fade');
    });
    $(function () {
      $('body').removeClass('fade');
    });
  })();

});
