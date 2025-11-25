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

    // パターン1: ワイヤーフレーム（幾何学的・クール）
    const initHeroThreejsWireframe = () => {
        const $hero = $('.uiHero_type_threejs_wireframe');
        if ($hero.length === 0) return;

        const $canvas = $hero.find('.uiHero__canvas');
        if ($canvas.length === 0) return;

        const canvas = $canvas[0];
        const width = $hero.width();
        const height = $hero.height();

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // ワイヤーフレームオブジェクト
        const torusGeometry = new THREE.TorusGeometry(1.5, 0.5, 16, 100);
        const torusMaterial = new THREE.MeshBasicMaterial({
            color: 0x00a8ff,
            wireframe: true,
        });
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        scene.add(torus);

        const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
        const boxMaterial = new THREE.MeshBasicMaterial({
            color: 0x0097e6,
            wireframe: true,
        });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.set(3, 0, -2);
        scene.add(box);

        const octahedronGeometry = new THREE.OctahedronGeometry(1.2);
        const octahedronMaterial = new THREE.MeshBasicMaterial({
            color: 0x487eb0,
            wireframe: true,
        });
        const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
        octahedron.position.set(-3, 0, -2);
        scene.add(octahedron);

        let frame = 0;
        const animate = () => {
            requestAnimationFrame(animate);
            frame += 0.01;

            torus.rotation.x += 0.01;
            torus.rotation.y += 0.02;
            box.rotation.x -= 0.01;
            box.rotation.y += 0.015;
            octahedron.rotation.x += 0.015;
            octahedron.rotation.z += 0.01;

            camera.position.x = Math.sin(frame * 0.3) * 0.5;
            camera.position.y = Math.cos(frame * 0.2) * 0.3;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

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
        animate();
    };

    // パターン2: 流れるパーティクル（エレガント・流動的）
    const initHeroThreejsFlow = () => {
        const $hero = $('.uiHero_type_threejs_flow');
        if ($hero.length === 0) return;

        const $canvas = $hero.find('.uiHero__canvas');
        if ($canvas.length === 0) return;

        const canvas = $canvas[0];
        const width = $hero.width();
        const height = $hero.height();

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

        const particleCount = window.innerWidth < 768 ? 800 : 1500;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 30;
            positions[i + 1] = (Math.random() - 0.5) * 30;
            positions[i + 2] = (Math.random() - 0.5) * 30;

            const color = new THREE.Color();
            const hue = Math.random() * 0.2 + 0.7; // 紫系
            const saturation = Math.random() * 0.4 + 0.6;
            const lightness = Math.random() * 0.3 + 0.5;
            color.setHSL(hue, saturation, lightness);

            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;

            velocities[i] = (Math.random() - 0.5) * 0.02;
            velocities[i + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i + 2] = (Math.random() - 0.5) * 0.02;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: window.innerWidth < 768 ? 0.08 : 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        let frame = 0;
        const animate = () => {
            requestAnimationFrame(animate);
            frame += 0.005;

            const positions = particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += velocities[i] + Math.sin(frame + positions[i + 1] * 0.1) * 0.01;
                positions[i + 1] += velocities[i + 1] + Math.cos(frame + positions[i] * 0.1) * 0.01;
                positions[i + 2] += velocities[i + 2] + Math.sin(frame * 0.5 + positions[i] * 0.05) * 0.005;

                if (Math.abs(positions[i]) > 15) positions[i] = (Math.random() - 0.5) * 30;
                if (Math.abs(positions[i + 1]) > 15) positions[i + 1] = (Math.random() - 0.5) * 30;
                if (Math.abs(positions[i + 2]) > 15) positions[i + 2] = (Math.random() - 0.5) * 30;
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;

            camera.position.x = Math.sin(frame * 0.3) * 0.4;
            camera.position.y = Math.cos(frame * 0.4) * 0.3;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

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
        animate();
    };

    // パターン3: グリッド/ネオン（サイバー・モダン）
    const initHeroThreejsGrid = () => {
        const $hero = $('.uiHero_type_threejs_grid');
        if ($hero.length === 0) return;

        const $canvas = $hero.find('.uiHero__canvas');
        if ($canvas.length === 0) return;

        const canvas = $canvas[0];
        const width = $hero.width();
        const height = $hero.height();

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 0, 10);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // グリッドヘルパー
        const gridHelper = new THREE.GridHelper(20, 20, 0x00ffff, 0x00ffff);
        scene.add(gridHelper);

        // ネオンライン
        const lineGeometry = new THREE.BufferGeometry();
        const lineCount = 50;
        const linePositions = new Float32Array(lineCount * 6);

        for (let i = 0; i < lineCount; i++) {
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 20;
            const z = (Math.random() - 0.5) * 20;

            linePositions[i * 6] = x;
            linePositions[i * 6 + 1] = y;
            linePositions[i * 6 + 2] = z;
            linePositions[i * 6 + 3] = x + (Math.random() - 0.5) * 5;
            linePositions[i * 6 + 4] = y + (Math.random() - 0.5) * 5;
            linePositions[i * 6 + 5] = z + (Math.random() - 0.5) * 5;
        }

        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0.6,
        });

        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);

        // パーティクル
        const particleCount = window.innerWidth < 768 ? 300 : 600;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 20;
            positions[i + 1] = (Math.random() - 0.5) * 20;
            positions[i + 2] = (Math.random() - 0.5) * 20;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0x00ffff,
            size: window.innerWidth < 768 ? 0.1 : 0.2,
            transparent: true,
            opacity: 0.8,
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        let frame = 0;
        const animate = () => {
            requestAnimationFrame(animate);
            frame += 0.01;

            lines.rotation.y += 0.002;
            lines.rotation.x += 0.001;

            const positions = particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += Math.sin(frame + positions[i + 1] * 0.1) * 0.02;
                positions[i + 1] += Math.cos(frame + positions[i] * 0.1) * 0.02;
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;

            camera.position.x = Math.sin(frame * 0.2) * 1;
            camera.position.y = Math.cos(frame * 0.15) * 0.5;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

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
        animate();
    };

    // パターン4: オーガニック形状（有機的・柔らかい）
    const initHeroThreejsOrganic = () => {
        const $hero = $('.uiHero_type_threejs_organic');
        if ($hero.length === 0) return;

        const $canvas = $hero.find('.uiHero__canvas');
        if ($canvas.length === 0) return;

        const canvas = $canvas[0];
        const width = $hero.width();
        const height = $hero.height();

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 6;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // 柔らかい形状（球体を変形）
        const geometry = new THREE.SphereGeometry(1.5, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: 0xff6b6b,
            metalness: 0.2,
            roughness: 0.8,
            transparent: true,
            opacity: 0.7,
        });

        const spheres = [];
        for (let i = 0; i < 5; i++) {
            const sphere = new THREE.Mesh(geometry, material.clone());
            sphere.position.set(
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4
            );
            sphere.scale.set(
                0.6 + Math.random() * 0.4,
                0.6 + Math.random() * 0.4,
                0.6 + Math.random() * 0.4
            );
            sphere.material.color.setHSL(0.05 + Math.random() * 0.1, 0.7, 0.6);
            spheres.push(sphere);
            scene.add(sphere);
        }

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffaa88, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        let frame = 0;
        const animate = () => {
            requestAnimationFrame(animate);
            frame += 0.008;

            spheres.forEach((sphere, index) => {
                sphere.rotation.x += 0.005 + index * 0.001;
                sphere.rotation.y += 0.008 + index * 0.001;
                sphere.position.y += Math.sin(frame + index) * 0.01;
                sphere.position.x += Math.cos(frame * 0.5 + index) * 0.005;
            });

            camera.position.x = Math.sin(frame * 0.3) * 0.5;
            camera.position.y = Math.cos(frame * 0.4) * 0.3;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

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
        animate();
    };

    // パターン5: 光のビーム（ドラマチック・明るい）
    const initHeroThreejsBeam = () => {
        const $hero = $('.uiHero_type_threejs_beam');
        if ($hero.length === 0) return;

        const $canvas = $hero.find('.uiHero__canvas');
        if ($canvas.length === 0) return;

        const canvas = $canvas[0];
        const width = $hero.width();
        const height = $hero.height();

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // 光のビーム（円柱）
        const beamGeometry = new THREE.CylinderGeometry(0.1, 0.3, 15, 8);
        const beamMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.6,
        });

        const beams = [];
        for (let i = 0; i < 8; i++) {
            const beam = new THREE.Mesh(beamGeometry, beamMaterial.clone());
            const angle = (i / 8) * Math.PI * 2;
            beam.position.set(Math.cos(angle) * 3, Math.sin(angle) * 3, 0);
            beam.rotation.z = angle + Math.PI / 2;
            beam.material.color.setHSL(0.1 + Math.random() * 0.1, 0.5, 0.9);
            beams.push(beam);
            scene.add(beam);
        }

        // 中央の光
        const centerLight = new THREE.PointLight(0xffffff, 2, 50);
        centerLight.position.set(0, 0, 0);
        scene.add(centerLight);

        let frame = 0;
        const animate = () => {
            requestAnimationFrame(animate);
            frame += 0.015;

            beams.forEach((beam, index) => {
                beam.rotation.z += 0.01;
                beam.position.x = Math.cos(frame + (index / 8) * Math.PI * 2) * 3;
                beam.position.y = Math.sin(frame + (index / 8) * Math.PI * 2) * 3;
                beam.material.opacity = 0.4 + Math.sin(frame * 2 + index) * 0.3;
            });

            camera.position.x = Math.sin(frame * 0.2) * 1;
            camera.position.y = Math.cos(frame * 0.25) * 0.5;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

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
        animate();
    };

    // パターン6: 幾何学パターン（ミニマル・クリーン）
    const initHeroThreejsGeometric = () => {
        const $hero = $('.uiHero_type_threejs_geometric');
        if ($hero.length === 0) return;

        const $canvas = $hero.find('.uiHero__canvas');
        if ($canvas.length === 0) return;

        const canvas = $canvas[0];
        const width = $hero.width();
        const height = $hero.height();

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 7;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // シンプルな幾何学形状
        const cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const cubeMaterial = new THREE.MeshBasicMaterial({
            color: 0x333333,
            transparent: true,
            opacity: 0.8,
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(-2, 1, 0);
        scene.add(cube);

        const cylinderGeometry = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
        const cylinderMaterial = new THREE.MeshBasicMaterial({
            color: 0x555555,
            transparent: true,
            opacity: 0.8,
        });
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.position.set(2, -1, 0);
        scene.add(cylinder);

        const coneGeometry = new THREE.ConeGeometry(1, 2, 32);
        const coneMaterial = new THREE.MeshBasicMaterial({
            color: 0x444444,
            transparent: true,
            opacity: 0.8,
        });
        const cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.position.set(0, 0, -2);
        scene.add(cone);

        let frame = 0;
        const animate = () => {
            requestAnimationFrame(animate);
            frame += 0.008;

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            cylinder.rotation.x -= 0.008;
            cylinder.rotation.z += 0.01;
            cone.rotation.y += 0.012;

            camera.position.x = Math.sin(frame * 0.2) * 0.3;
            camera.position.y = Math.cos(frame * 0.15) * 0.2;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

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
        animate();
    };

    // パターン7: ヘアサロン向け - 髪の流れ（流れるリボンエフェクト）
    const initHeroThreejsHairFlow = () => {
        const $hero = $('.uiHero_type_threejs_hairFlow');
        if ($hero.length === 0) return;

        const $canvas = $hero.find('.uiHero__canvas');
        if ($canvas.length === 0) return;

        const canvas = $canvas[0];
        const width = $hero.width();
        const height = $hero.height();

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 6;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // 髪の流れを表現するリボン状のメッシュ
        const ribbonCount = window.innerWidth < 768 ? 8 : 15;
        const ribbons = [];

        for (let i = 0; i < ribbonCount; i++) {
            const ribbonGeometry = new THREE.BufferGeometry();
            const segments = 50;
            const positions = new Float32Array(segments * 3);
            const colors = new Float32Array(segments * 3);

            const baseX = (Math.random() - 0.5) * 15;
            const baseY = (Math.random() - 0.5) * 10;
            const baseZ = (Math.random() - 0.5) * 8;

            for (let j = 0; j < segments; j++) {
                const t = j / segments;
                const waveX = Math.sin(t * Math.PI * 2 + i) * 2;
                const waveY = Math.cos(t * Math.PI * 2 + i * 0.5) * 1.5;
                const z = baseZ + t * 5 - 2.5;

                positions[j * 3] = baseX + waveX;
                positions[j * 3 + 1] = baseY + waveY + t * 3;
                positions[j * 3 + 2] = z;

                // 髪の色（ブラウン系のグラデーション）
                const color = new THREE.Color();
                const hue = 0.08 + Math.random() * 0.05; // ブラウン系
                const saturation = 0.3 + Math.random() * 0.3;
                const lightness = 0.3 + t * 0.2 + Math.random() * 0.2;
                color.setHSL(hue, saturation, lightness);

                colors[j * 3] = color.r;
                colors[j * 3 + 1] = color.g;
                colors[j * 3 + 2] = color.b;
            }

            ribbonGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            ribbonGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const ribbonMaterial = new THREE.LineBasicMaterial({
                vertexColors: true,
                linewidth: 2,
                transparent: true,
                opacity: 0.7,
            });

            const ribbon = new THREE.Line(ribbonGeometry, ribbonMaterial);
            ribbon.userData.baseX = baseX;
            ribbon.userData.baseY = baseY;
            ribbon.userData.baseZ = baseZ;
            ribbon.userData.offset = i;
            ribbons.push(ribbon);
            scene.add(ribbon);
        }

        // 追加のパーティクル（髪の毛の質感）
        const particleCount = window.innerWidth < 768 ? 400 : 800;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 20;
            positions[i + 1] = (Math.random() - 0.5) * 15;
            positions[i + 2] = (Math.random() - 0.5) * 10;

            const color = new THREE.Color();
            const hue = 0.08 + Math.random() * 0.05;
            const saturation = 0.2 + Math.random() * 0.3;
            const lightness = 0.4 + Math.random() * 0.3;
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
            opacity: 0.6,
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        let frame = 0;
        const animate = () => {
            requestAnimationFrame(animate);
            frame += 0.008;

            // リボンのアニメーション
            ribbons.forEach((ribbon, index) => {
                const positions = ribbon.geometry.attributes.position.array;
                const segments = positions.length / 3;

                for (let j = 0; j < segments; j++) {
                    const t = j / segments;
                    const waveX = Math.sin(t * Math.PI * 2 + frame + index) * 2;
                    const waveY = Math.cos(t * Math.PI * 2 + frame * 0.5 + index * 0.5) * 1.5;
                    const z = ribbon.userData.baseZ + t * 5 - 2.5;

                    positions[j * 3] = ribbon.userData.baseX + waveX;
                    positions[j * 3 + 1] = ribbon.userData.baseY + waveY + t * 3 + Math.sin(frame + index) * 0.5;
                    positions[j * 3 + 2] = z + Math.sin(frame * 0.5 + index) * 0.3;
                }
                ribbon.geometry.attributes.position.needsUpdate = true;
            });

            // パーティクルのアニメーション
            const particlePositions = particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < particlePositions.length; i += 3) {
                particlePositions[i + 1] += Math.sin(frame + particlePositions[i] * 0.1) * 0.01;
                particlePositions[i] += Math.cos(frame * 0.5 + particlePositions[i + 1] * 0.1) * 0.005;
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;

            camera.position.x = Math.sin(frame * 0.2) * 0.4;
            camera.position.y = Math.cos(frame * 0.25) * 0.3;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

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
        animate();
    };

    // パターン8: ヘアサロン向け - ゴールドエレガンス（高級感のあるゴールドパーティクル）
    const initHeroThreejsGoldElegance = () => {
        const $hero = $('.uiHero_type_threejs_goldElegance');
        if ($hero.length === 0) return;

        const $canvas = $hero.find('.uiHero__canvas');
        if ($canvas.length === 0) return;

        const canvas = $canvas[0];
        const width = $hero.width();
        const height = $hero.height();

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 7;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // ゴールドパーティクル
        const particleCount = window.innerWidth < 768 ? 600 : 1200;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 25;
            positions[i + 1] = (Math.random() - 0.5) * 20;
            positions[i + 2] = (Math.random() - 0.5) * 15;

            // ゴールド/ピンクゴールド系の色
            const color = new THREE.Color();
            const hue = 0.1 + Math.random() * 0.05; // ゴールド系
            const saturation = 0.6 + Math.random() * 0.3;
            const lightness = 0.4 + Math.random() * 0.3;
            color.setHSL(hue, saturation, lightness);

            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;

            sizes[i / 3] = Math.random() * 0.3 + 0.1;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particleMaterial = new THREE.PointsMaterial({
            size: window.innerWidth < 768 ? 0.15 : 0.3,
            sizeAttenuation: true,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        // ゴールドの3Dオブジェクト（装飾的な球体）
        const sphereGeometry = new THREE.SphereGeometry(1.2, 32, 32);
        const goldMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0xffaa00,
            emissiveIntensity: 0.3,
        });

        const spheres = [];
        for (let i = 0; i < 4; i++) {
            const sphere = new THREE.Mesh(sphereGeometry, goldMaterial.clone());
            const angle = (i / 4) * Math.PI * 2;
            sphere.position.set(
                Math.cos(angle) * 4,
                Math.sin(angle * 0.5) * 2,
                (Math.random() - 0.5) * 3
            );
            sphere.scale.set(0.6 + Math.random() * 0.4, 0.6 + Math.random() * 0.4, 0.6 + Math.random() * 0.4);
            spheres.push(sphere);
            scene.add(sphere);
        }

        // ライティング
        const ambientLight = new THREE.AmbientLight(0xffd700, 0.4);
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffd700, 1);
        directionalLight1.position.set(5, 5, 5);
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffaa88, 0.8);
        directionalLight2.position.set(-5, 3, 5);
        scene.add(directionalLight2);

        const pointLight = new THREE.PointLight(0xffd700, 2, 50);
        pointLight.position.set(0, 0, 5);
        scene.add(pointLight);

        let frame = 0;
        const animate = () => {
            requestAnimationFrame(animate);
            frame += 0.01;

            // パーティクルのアニメーション
            const positions = particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += Math.sin(frame + positions[i + 1] * 0.05) * 0.02;
                positions[i + 1] += Math.cos(frame * 0.7 + positions[i] * 0.05) * 0.015;
                positions[i + 2] += Math.sin(frame * 0.5 + positions[i] * 0.03) * 0.01;

                // 範囲外に出たらリセット
                if (Math.abs(positions[i]) > 12.5) positions[i] = (Math.random() - 0.5) * 25;
                if (Math.abs(positions[i + 1]) > 10) positions[i + 1] = (Math.random() - 0.5) * 20;
                if (Math.abs(positions[i + 2]) > 7.5) positions[i + 2] = (Math.random() - 0.5) * 15;
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;

            // 球体のアニメーション
            spheres.forEach((sphere, index) => {
                sphere.rotation.x += 0.01 + index * 0.002;
                sphere.rotation.y += 0.015 + index * 0.003;
                sphere.position.y += Math.sin(frame + index) * 0.02;
                sphere.material.emissiveIntensity = 0.3 + Math.sin(frame * 2 + index) * 0.2;
            });

            // ライトの動き
            pointLight.position.x = Math.sin(frame) * 3;
            pointLight.position.y = Math.cos(frame * 0.7) * 2;
            directionalLight1.position.x = Math.sin(frame * 0.5) * 3;
            directionalLight1.position.y = Math.cos(frame * 0.3) * 2;

            camera.position.x = Math.sin(frame * 0.2) * 0.5;
            camera.position.y = Math.cos(frame * 0.25) * 0.4;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

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
        animate();
    };

    // パターン9: ヘアサロン向け - リラックスウェーブ（柔らかい波の動き）
    const initHeroThreejsRelaxWave = () => {
        const $hero = $('.uiHero_type_threejs_relaxWave');
        if ($hero.length === 0) return;

        const $canvas = $hero.find('.uiHero__canvas');
        if ($canvas.length === 0) return;

        const canvas = $canvas[0];
        const width = $hero.width();
        const height = $hero.height();

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // 柔らかい波を表現するメッシュ
        const waveGeometry = new THREE.PlaneGeometry(20, 20, 50, 50);
        const waveMaterial = new THREE.MeshStandardMaterial({
            color: 0xf4a5a5,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide,
            wireframe: false,
        });

        const waves = [];
        for (let i = 0; i < 3; i++) {
            const wave = new THREE.Mesh(waveGeometry.clone(), waveMaterial.clone());
            wave.rotation.x = -Math.PI / 2;
            wave.position.y = (i - 1) * 2;
            wave.position.z = i * -2;
            wave.material.color.setHSL(0.05 + i * 0.02, 0.4, 0.7);
            waves.push(wave);
            scene.add(wave);
        }

        // パーティクル（泡や光の粒）
        const particleCount = window.innerWidth < 768 ? 300 : 600;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 20;
            positions[i + 1] = Math.random() * 10 - 5;
            positions[i + 2] = (Math.random() - 0.5) * 10;

            const color = new THREE.Color();
            const hue = 0.05 + Math.random() * 0.05;
            const saturation = 0.2 + Math.random() * 0.3;
            const lightness = 0.7 + Math.random() * 0.2;
            color.setHSL(hue, saturation, lightness);

            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: window.innerWidth < 768 ? 0.2 : 0.4,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        // ライティング
        const ambientLight = new THREE.AmbientLight(0xfff5f5, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);

        let frame = 0;
        const animate = () => {
            requestAnimationFrame(animate);
            frame += 0.006;

            // 波のアニメーション
            waves.forEach((wave, index) => {
                const positions = wave.geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    const x = positions[i];
                    const z = positions[i + 2];
                    positions[i + 1] = Math.sin(
                        frame * 0.5 + x * 0.3 + z * 0.2 + index * 2
                    ) * 0.5 + Math.cos(frame * 0.3 + x * 0.2 + index) * 0.3;
                }
                wave.geometry.attributes.position.needsUpdate = true;
                wave.geometry.computeVertexNormals();
            });

            // パーティクルのアニメーション
            const particlePositions = particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < particlePositions.length; i += 3) {
                particlePositions[i + 1] += Math.sin(frame + particlePositions[i] * 0.1) * 0.01;
                particlePositions[i] += Math.cos(frame * 0.5 + particlePositions[i + 1] * 0.1) * 0.005;

                if (particlePositions[i + 1] > 5) {
                    particlePositions[i + 1] = -5;
                    particlePositions[i] = (Math.random() - 0.5) * 20;
                }
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;

            camera.position.x = Math.sin(frame * 0.15) * 0.4;
            camera.position.y = Math.cos(frame * 0.2) * 0.3;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

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
        animate();
    };

    // DOM読み込み後に初期化
    $(document).ready(function () {
        // three.jsが読み込まれるまで待機
        const checkThree = setInterval(() => {
            if (typeof THREE !== 'undefined') {
                clearInterval(checkThree);
                initHeroThreejs();
                initHeroThreejsWireframe();
                initHeroThreejsFlow();
                initHeroThreejsGrid();
                initHeroThreejsOrganic();
                initHeroThreejsBeam();
                initHeroThreejsGeometric();
                initHeroThreejsHairFlow();
                initHeroThreejsGoldElegance();
                initHeroThreejsRelaxWave();
            }
        }, 100);

        // 10秒後にタイムアウト
        setTimeout(() => {
            clearInterval(checkThree);
        }, 10000);
    });
})();

