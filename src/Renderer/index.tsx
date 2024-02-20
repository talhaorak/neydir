import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface IRendererProps {
    vertexShader: string;
    fragmentShader: string;
}

const defaultVertexShader = `
varying vec2 vUv;
void main()	{
    vUv = uv;
    gl_Position = vec4( position, 1.0 );
}`;

const defaultFragmentShader = `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
out vec4 fragColor;
void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    fragColor = vec4(uv, 0.5f + 0.5f * sin(u_time), 1.0f);
}
`;


export default function Renderer({ vertexShader, fragmentShader }: IRendererProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const threeObjectsRef = useRef<{
        renderer: THREE.WebGLRenderer | null,
        scene: THREE.Scene | null,
        camera: THREE.PerspectiveCamera | null,
        material: THREE.ShaderMaterial | null,
        mesh: THREE.Mesh | null,
        clock: THREE.Clock | null
    }>({
        renderer: null,
        scene: null,
        camera: null,
        material: null,
        mesh: null,
        clock: null,
    });

    useEffect(() => {

        const handleResize = () => {
            if (threeObjectsRef.current.camera && threeObjectsRef.current.renderer) {
                const { w, h } = { w: window.innerWidth, h: window.innerHeight };
                threeObjectsRef.current.camera.aspect = w / h;
                threeObjectsRef.current.camera.updateProjectionMatrix();
                threeObjectsRef.current.renderer.setSize(w, h);
                threeObjectsRef.current.material!.uniforms.resolution.value.set(w, h).multiplyScalar(window.devicePixelRatio);
            }
        };

        if (containerRef.current && !threeObjectsRef.current.renderer) {
            const { w, h } = { w: window.innerWidth, h: window.innerHeight };
            const pixRatio = window.devicePixelRatio;
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(w, h);
            renderer.setPixelRatio(pixRatio);
            containerRef.current.appendChild(renderer.domElement);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);

            const geometry = new THREE.PlaneGeometry(2, 2);
            const uniforms = {
                time: { value: 1.0 },
                resolution: { value: new THREE.Vector2(w, h).multiplyScalar(pixRatio) },
                frame: { value: 0.0 },
                mouse: { value: new THREE.Vector2() },
            };
            const material = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: vertexShader || defaultVertexShader,
                fragmentShader: fragmentShader || defaultFragmentShader,
            });
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            const clock = new THREE.Clock(true);

            threeObjectsRef.current = { renderer, scene, camera, material, mesh, clock };

            const animate = () => {
                requestAnimationFrame(animate);
                if (threeObjectsRef.current.material && threeObjectsRef.current.clock) {
                    threeObjectsRef.current.material.uniforms.time.value = threeObjectsRef.current.clock.getElapsedTime();
                    if (threeObjectsRef.current.renderer && threeObjectsRef.current.scene && threeObjectsRef.current.camera) {
                        threeObjectsRef.current.renderer.render(threeObjectsRef.current.scene, threeObjectsRef.current.camera);
                    }
                }
            };

            animate();

            renderer.domElement.addEventListener('mousemove', (event) => {
                if (threeObjectsRef.current.material) {
                    threeObjectsRef.current.material.uniforms.mouse.value.set(event.pageX, window.innerHeight - event.pageY).multiplyScalar(window.devicePixelRatio);
                }
            });
            window.addEventListener('resize', handleResize);
        }

        if (threeObjectsRef.current.material && vertexShader && fragmentShader) {
            threeObjectsRef.current.material.fragmentShader = fragmentShader;
            threeObjectsRef.current.material.vertexShader = vertexShader;
            threeObjectsRef.current.material.needsUpdate = true;
        }

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [vertexShader, fragmentShader]); // Re-run the effect if shaderCode changes

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100vh' }}></div>
    )
}