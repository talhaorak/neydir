uniform float time;
uniform vec2 resolution;
uniform float frame;
uniform vec2 mouse;
varying vec2 vUv;
void main() {
    vec2 p = (2.0 * gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);
    vec3 col = 0.5 + 0.5 * cos(time + p.xyx + vec3(0, 2, 4));
    gl_FragColor = vec4(col, 1.0);
}
