//! vert
#version 300 es

in vec3 aPosition;

out vec3 fColor;

//uniform vec4 uColor;
//uniform mat4 modelViewMatrix;
//uniform mat4 projectionMatrix;

void main()
{
	fColor = vec3(aPosition.xy * 0.5 + 0.5, 1.0);
	gl_Position = vec4(aPosition, 1.0);
}

//! frag
#version 300 es
precision highp float;

in vec3 fColor;
out vec4 outColor;

void main()
{
	outColor = vec4(fColor, 1);
}