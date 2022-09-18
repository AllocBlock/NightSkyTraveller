//! vert
#version 300 es

in vec3 aPosition;

uniform mat4 uViewProjMat;

void main()
{
	gl_Position = uViewProjMat * vec4(aPosition, 1.0);
}

//! frag
#version 300 es
precision highp float;

uniform vec3 uColor;

out vec4 outColor;

void main()
{
	outColor = vec4(uColor, 1.0);
}