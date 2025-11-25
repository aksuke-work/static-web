/**
 * デザインシステムページのコードコピー機能
 * すべてのパーツを個別にコピー可能にする
 */

(function () {
    'use strict';

    $(document).ready(function () {
        // コピー可能なパーツのセレクタリスト
        const copyableSelectors = [
            // カラーパレット
            '.dsColorPalette__item',
            // タイポグラフィ
            '.dsTypography__item',
            // コンポーネント
            '.designSystem__component',
            // ボタン
            '.uiButton',
            // カード
            '.uiCard',
            // リストアイテム
            '.uiFeatureList__item',
            '.uiStepList__item',
            '.uiFaq__item',
            '.uiList__item',
            // テーブル行
            '.uiTable__row',
            // バッジ
            '.uiBadge',
            // アラート
            '.uiAlert',
            // モーダル
            '.uiModal',
            // タブ
            '.uiTabs',
            // パンくずリスト
            '.uiBreadcrumb',
            // ヘッダー
            '.uiHeader',
            '.header',
            // フッター
            '.uiFooter',
            // ヒーロー
            '.uiHero',
            // CTA
            '.uiCtaBand',
            // フォーム
            '.uiForm__row',
            // テキストリンク
            '.uiTextLink',
            // セクション
            '.uiSection',
            // グリッドアイテム
            '.uiGrid__item'
        ];

        // 大きなブロック単位のコピー機能を追加
        function addBlockCopyButtons() {
            // designSystem__componentGroup内のh3見出しとその下のコンテンツをブロックとして認識
            $('.designSystem__componentGroup').each(function () {
                const $group = $(this);
                
                // 既にブロックラッパーがある場合はスキップ
                if ($group.closest('.designSystem__blockWrapper').length > 0) {
                    return;
                }
                
                // h3見出しごとにブロックを作成
                const $headings = $group.find('> h3.uiHeading');
                
                if ($headings.length > 0) {
                    $headings.each(function (index) {
                        const $heading = $(this);
                        const $nextHeading = $headings.eq(index + 1);
                        
                        // 次の見出しまでの要素を取得
                        let $blockElements;
                        if ($nextHeading.length > 0) {
                            $blockElements = $heading.nextUntil($nextHeading);
                        } else {
                            $blockElements = $heading.nextAll();
                        }
                        
                        // 見出しとその下のコンテンツをラッパーで囲む
                        const $block = $heading.add($blockElements);
                        $block.wrapAll('<div class="designSystem__blockWrapper"></div>');
                        const $wrapper = $heading.closest('.designSystem__blockWrapper');
                        
                        // ブロック用のコピーボタンを追加
                        const $blockCopyButton = $('<button>', {
                            class: 'designSystem__blockCopyButton js-designSystem-blockCopy',
                            type: 'button',
                            'aria-label': 'ブロック全体をコピー',
                            html: '<span class="designSystem__blockCopyButtonIcon">📦</span><span class="designSystem__blockCopyButtonText">ブロックをコピー</span>'
                        });
                        
                        $wrapper.prepend($blockCopyButton);
                    });
                } else {
                    // h3見出しがない場合は、グループ全体をラッパーで囲む
                    $group.wrap('<div class="designSystem__blockWrapper"></div>');
                    const $wrapper = $group.parent();
                    
                    // ブロック用のコピーボタンを追加
                    const $blockCopyButton = $('<button>', {
                        class: 'designSystem__blockCopyButton js-designSystem-blockCopy',
                        type: 'button',
                        'aria-label': 'ブロック全体をコピー',
                        html: '<span class="designSystem__blockCopyButtonIcon">📦</span><span class="designSystem__blockCopyButtonText">ブロックをコピー</span>'
                    });
                    
                    $wrapper.prepend($blockCopyButton);
                }
            });
        }

        // 大きなブロック単位のコピー機能を初期化
        addBlockCopyButtons();

        // すべてのコピー可能なパーツを検出してラッパーを追加
        copyableSelectors.forEach(function (selector) {
            const $parts = $(selector);
            
            $parts.each(function () {
                const $part = $(this);
                
                // 既にラッパーがある場合はスキップ
                if ($part.hasClass('designSystem__partWrapper') || $part.closest('.designSystem__partWrapper').length > 0) {
                    return;
                }
                
                // デザインシステムページ内の要素のみ対象
                if ($part.closest('.designSystem').length === 0) {
                    return;
                }
                
                // 親要素が既にラッパーされている場合はスキップ
                if ($part.parent().hasClass('designSystem__partWrapper')) {
                    return;
                }
                
                // コピーボタンが既に存在する場合はスキップ
                if ($part.find('.designSystem__copyButton').length > 0) {
                    return;
                }
                
                // ラッパーで囲む
                $part.wrap('<div class="designSystem__partWrapper"></div>');
                const $wrapper = $part.parent();
                
                // 小さなパーツの場合はクラスを追加
                if ($part.hasClass('uiButton') || $part.hasClass('uiBadge') || $part.hasClass('uiTextLink')) {
                    $wrapper.addClass('designSystem__partWrapper_type_small');
                }
                
                // コピーボタンを追加
                const $copyButton = $('<button>', {
                    class: 'designSystem__copyButton js-designSystem-copy',
                    type: 'button',
                    'aria-label': 'コードをコピー',
                    html: '<span class="designSystem__copyButtonIcon">📋</span><span class="designSystem__copyButtonText">コピー</span>'
                });
                
                $wrapper.append($copyButton);
            });
        });

        // ブロックコピーボタンのクリックイベント
        $(document).on('click', '.js-designSystem-blockCopy', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            const $button = $(this);
            const $wrapper = $button.closest('.designSystem__blockWrapper');
            
            // ラッパー内のコンテンツを取得（コピーボタン以外）
            const $content = $wrapper.clone();
            $content.find('.designSystem__blockCopyButton').remove();
            $content.find('.designSystem__copyButton').remove();
            $content.find('.designSystem__partWrapper').each(function () {
                const $innerPart = $(this).children().not('.designSystem__copyButton').first();
                if ($innerPart.length > 0) {
                    $(this).replaceWith($innerPart);
                }
            });
            
            // HTMLを取得して整形
            let html = $content.html();
            
            // 基本的な整形（インデントを追加）
            html = formatHTML(html);
            
            // クリップボードにコピー
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(html).then(function () {
                    showCopySuccess($button, true);
                }).catch(function (err) {
                    console.error('コピーに失敗しました:', err);
                    fallbackCopyTextToClipboard(html, $button, true);
                });
            } else {
                fallbackCopyTextToClipboard(html, $button, true);
            }
        });

        // コピーボタンのクリックイベント
        $(document).on('click', '.js-designSystem-copy', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            const $button = $(this);
            const $wrapper = $button.closest('.designSystem__partWrapper');
            
            // ラッパー内のパーツ要素を取得（コピーボタン以外）
            const $part = $wrapper.children().not('.designSystem__copyButton').first();
            
            if ($part.length === 0) {
                return;
            }
            
            // パーツのHTMLを取得（コピーボタン自体は除外）
            const $content = $part.clone();
            $content.find('.designSystem__copyButton').remove();
            $content.find('.designSystem__partWrapper').each(function () {
                const $innerPart = $(this).children().not('.designSystem__copyButton').first();
                if ($innerPart.length > 0) {
                    $(this).replaceWith($innerPart);
                }
            });
            
            // HTMLを取得して整形
            let html = $content[0].outerHTML || $content.html();
            
            // 基本的な整形（インデントを追加）
            html = formatHTML(html);
            
            // クリップボードにコピー
            if (navigator.clipboard && navigator.clipboard.writeText) {
                // モダンブラウザ用
                navigator.clipboard.writeText(html).then(function () {
                    showCopySuccess($button);
                }).catch(function (err) {
                    console.error('コピーに失敗しました:', err);
                    fallbackCopyTextToClipboard(html, $button);
                });
            } else {
                // フォールバック
                fallbackCopyTextToClipboard(html, $button);
            }
        });

        // フォールバック用のコピー関数
        function fallbackCopyTextToClipboard(text, $button, isBlock) {
            isBlock = isBlock || false;
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showCopySuccess($button, isBlock);
                } else {
                    showCopyError($button, isBlock);
                }
            } catch (err) {
                console.error('コピーに失敗しました:', err);
                showCopyError($button, isBlock);
            }
            
            document.body.removeChild(textArea);
        }

        // コピー成功時の表示
        function showCopySuccess($button, isBlock) {
            isBlock = isBlock || false;
            
            if (isBlock) {
                const $icon = $button.find('.designSystem__blockCopyButtonIcon');
                const $text = $button.find('.designSystem__blockCopyButtonText');
                
                $button.addClass('designSystem__blockCopyButton_isCopied');
                $icon.text('✓');
                $text.text('コピーしました');
                
                showToast('ブロック全体をコピーしました');
                
                setTimeout(function () {
                    $button.removeClass('designSystem__blockCopyButton_isCopied');
                    $icon.text('📦');
                    $text.text('ブロックをコピー');
                }, 3000);
            } else {
                const $icon = $button.find('.designSystem__copyButtonIcon');
                const $text = $button.find('.designSystem__copyButtonText');
                
                $button.addClass('designSystem__copyButton_isCopied');
                $icon.text('✓');
                $text.text('コピーしました');
                
                showToast('コードをコピーしました');
                
                setTimeout(function () {
                    $button.removeClass('designSystem__copyButton_isCopied');
                    $icon.text('📋');
                    $text.text('コピー');
                }, 3000);
            }
        }

        // コピー失敗時の表示
        function showCopyError($button, isBlock) {
            isBlock = isBlock || false;
            
            if (isBlock) {
                const $text = $button.find('.designSystem__blockCopyButtonText');
                const originalText = $text.text();
                
                $text.text('コピー失敗');
                
                setTimeout(function () {
                    $text.text(originalText);
                }, 2000);
            } else {
                const $text = $button.find('.designSystem__copyButtonText');
                const originalText = $text.text();
                
                $text.text('コピー失敗');
                
                setTimeout(function () {
                    $text.text(originalText);
                }, 2000);
            }
        }

        // HTMLを整形する関数（簡易版）
        function formatHTML(html) {
            // 連続する空白を1つに
            html = html.replace(/\s+/g, ' ');
            
            // タグの前後に改行を追加
            html = html.replace(/>\s+</g, '>\n<');
            
            // インデントを追加
            let formatted = '';
            let indent = 0;
            const indentSize = 4;
            const lines = html.split('\n');
            
            lines.forEach(function (line) {
                const trimmed = line.trim();
                if (!trimmed) {
                    return;
                }
                
                // 閉じタグの場合はインデントを減らす
                if (trimmed.startsWith('</')) {
                    indent = Math.max(0, indent - 1);
                }
                
                // インデントを追加
                formatted += ' '.repeat(indent * indentSize) + trimmed + '\n';
                
                // 開始タグ（自己閉じタグでない）の場合はインデントを増やす
                if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.match(/<(img|br|hr|input|meta|link|source)/i)) {
                    indent++;
                }
            });
            
            return formatted.trim();
        }

        // トースト通知を表示
        function showToast(message) {
            // 既存のトーストを削除
            $('.designSystem__toast').remove();
            
            const $toast = $('<div>', {
                class: 'designSystem__toast',
                text: message
            });
            
            $('body').append($toast);
            
            // アニメーションで表示
            setTimeout(function () {
                $toast.addClass('designSystem__toast_isVisible');
            }, 10);
            
            // 3秒後に削除
            setTimeout(function () {
                $toast.removeClass('designSystem__toast_isVisible');
                setTimeout(function () {
                    $toast.remove();
                }, 300);
            }, 3000);
        }
    });
})();

