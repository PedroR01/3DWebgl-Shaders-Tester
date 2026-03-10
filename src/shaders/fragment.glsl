uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main(){
    gl_FragColor = vec4(abs(sin(uTime)),vPosition.y, abs(cos(uTime)),1.0);
}
