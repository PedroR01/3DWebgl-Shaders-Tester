uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

// In Three.js, the modelViewMatrix and projectionMatrix are fundamental transformation matrices used in the rendering pipeline to determine how 3D objects are displayed on a 2D screen.

// The modelViewMatrix is a combination of two separate conceptual matrices: the model matrix and the view matrix. It transforms an object's local coordinates into "eye" or "camera" coordinates

// The projectionMatrix defines how the 3D scene, now in camera space (after the model-view transformation), is projected onto the 2D viewing surface (the screen)

void main(){
        vPosition = position;
        vNormal = normal;
        vUv = uv;

        //MVP
        // vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        // vec4 projectedPosition = projectionMatrix * modelViewPosition;
        // gl_Position = projectedPosition;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(sin(position.z/4.0) + position.x, sin(position.z*4.0) + position.y, sin(position.y/4.0) + position.z, 1.0);
}
