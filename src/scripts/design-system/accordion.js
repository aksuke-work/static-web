/**
 * デザインシステムページのセクションアコーディオン機能
 */

(function () {
    'use strict';

    $(document).ready(function () {
        const $sections = $('.designSystem__section');
        const $toggles = $('.js-designSystem-toggle');
        const $sectionContents = $('.designSystem__sectionContent');

        // 初期状態：すべて開いている（isOpenクラスが付いているもの）
        $sections.each(function () {
            const $section = $(this);
            if ($section.hasClass('designSystem__section_isOpen')) {
                const $icon = $section.find('.designSystem__sectionTitleIcon');
                $icon.text('−');
            }
        });

        $toggles.on('click', function () {
            const $section = $(this).closest('.designSystem__section');
            const $content = $section.find('.designSystem__sectionContent');
            const $icon = $section.find('.designSystem__sectionTitleIcon');
            const isOpen = $section.hasClass('designSystem__section_isOpen');

            if (isOpen) {
                // 閉じる
                $section.removeClass('designSystem__section_isOpen');
                $content.slideUp(300);
                $icon.text('+');
            } else {
                // 開く
                $section.addClass('designSystem__section_isOpen');
                $content.slideDown(300);
                $icon.text('−');
            }
        });
    });
})();

