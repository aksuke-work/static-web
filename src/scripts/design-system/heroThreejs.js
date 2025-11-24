/**
 * three.jsヒーローエリア
 * パーティクル、3Dオブジェクト、波などのエフェクトを実装
 */

(function () {
    'use strict';

    // three.jsが読み込まれているかチェック
    if (typeof THREE === 'undefined') {
        console.warn('THREE.js is not loaded');
        return;
    }

    const initHeroThreejs = () => {
        const $hero = $('.uiHero_type_threejs');
        if ($hero.length === 0) return;

        const $canvas = $hero.find('.uiHero__canvas');
        if ($canvas.length === 0) return;

        const canvas = $canvas[0];
        const width = $hero.width();
        const height = $hero.height();

        // シーン、カメラ、レンダラーの設定
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // パーティクルシステム
        const particleCount = window.innerWidth < 768 ? 500 : 1000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 20;
            positions[i + 1] = (Math.random() - 0.5) * 20;
            positions[i + 2] = (Math.random() - 0.5) * 20;

            // サロンのデザインに合う色（暖色系）
            const color = new THREE.Color();
            const hue = Math.random() * 0.1 + 0.05; // オレンジ系
            const saturation = Math.random() * 0.3 + 0.5;
            const lightness = Math.random() * 0.3 + 0.6;
            color.setHSL(hue, saturation, lightness);

            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: window.innerWidth < 768 ? 0.05 : 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        // 幾何学的な3Dオブジェクト（球体）
        const geometry = new THREE.IcosahedronGeometry(1, 1);
        const material = new THREE.MeshStandardMaterial({
            color: 0xd4a574,
            metalness: 0.3,
            roughness: 0.4,
            transparent: true,
            opacity: 0.6,
        });

        const sphere1 = new THREE.Mesh(geometry, material);
        sphere1.position.set(-3, 1, -2);
        sphere1.scale.set(0.8, 0.8, 0.8);
        scene.add(sphere1);

        const sphere2 = new THREE.Mesh(geometry, material);
        sphere2.position.set(3, -1, -3);
        sphere2.scale.set(0.6, 0.6, 0.6);
        scene.add(sphere2);

        // ライティング
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xd4a574, 1, 100);
        pointLight.position.set(0, 0, 5);
        scene.add(pointLight);

        // 波のような動き（パーティクル用）
        const waveAmplitude = 2;
        const waveFrequency = 0.01;

        // アニメーションループ
        let frame = 0;
        const animate = () => {
            requestAnimationFrame(animate);
            frame += 0.01;

            // パーティクルのアニメーション
            const positions = particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(frame + positions[i] * waveFrequency) * 0.01;
                positions[i] += Math.cos(frame + positions[i + 1] * waveFrequency) * 0.005;

                // 範囲外に出たらリセット
                if (Math.abs(positions[i]) > 10) {
                    positions[i] = (Math.random() - 0.5) * 20;
                }
                if (Math.abs(positions[i + 1]) > 10) {
                    positions[i + 1] = (Math.random() - 0.5) * 20;
                }
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;

            // 球体の回転
            sphere1.rotation.x += 0.005;
            sphere1.rotation.y += 0.01;
            sphere2.rotation.x -= 0.005;
            sphere2.rotation.y -= 0.01;

            // カメラの微細な動き
            camera.position.x = Math.sin(frame * 0.5) * 0.3;
            camera.position.y = Math.cos(frame * 0.3) * 0.2;
            camera.lookAt(scene.position);

            // ポイントライトの動き
            pointLight.position.x = Math.sin(frame) * 2;
            pointLight.position.y = Math.cos(frame * 0.7) * 2;

            renderer.render(scene, camera);
        };

        // リサイズ処理
        let resizeTimer;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newWidth = $hero.width();
                const newHeight = $hero.height();

                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();

                renderer.setSize(newWidth, newHeight);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            }, 100);
        };

        $(window).on('resize', handleResize);

        // アニメーション開始
        animate();

        // クリーンアップ関数（必要に応じて）
        return () => {
            $(window).off('resize', handleResize);
            renderer.dispose();
            particles.dispose();
            material.dispose();
            particleMaterial.dispose();
        };
    };

    // DOM読み込み後に初期化
    $(document).ready(function () {
        // three.jsが読み込まれるまで待機
        const checkThree = setInterval(() => {
            if (typeof THREE !== 'undefined') {
                clearInterval(checkThree);
                initHeroThreejs();
            }
        }, 100);

        // 10秒後にタイムアウト
        setTimeout(() => {
            clearInterval(checkThree);
        }, 10000);
    });
})();

