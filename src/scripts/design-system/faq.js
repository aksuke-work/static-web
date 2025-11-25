/**
 * FAQアコーディオン機能
 * デザインシステムページのFAQセクション用
 */

(function () {
    'use strict';

    $(document).ready(function () {
        const $faqItems = $('.uiFaq__item');
        const $faqQuestions = $('.uiFaq__question');
        const $faqAnswers = $('.uiFaq__answer');

        $faqQuestions.on('click', function () {
            const $item = $(this).closest('.uiFaq__item');
            const $answer = $item.find('.uiFaq__answer');
            const $question = $item.find('.uiFaq__question');
            const isOpen = $item.hasClass('is-open');

            // すべてのFAQを閉じる
            $faqItems.removeClass('is-open');
            $faqAnswers.slideUp(300);
            $faqQuestions.removeClass('is-active');

            // クリックされたFAQが閉じていた場合のみ開く
            if (!isOpen) {
                $item.addClass('is-open');
                $answer.slideDown(300);
                $question.addClass('is-active');
            }
        });
    });
})();
