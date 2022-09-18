//! vert
#version 300 es

in vec3 aPosition;

out vec3 fColor;
out float fPointSize;
out vec2 fPixelCenter;

//uniform vec4 uColor;
uniform vec2 uScreenSize;
uniform mat4 uViewProjMat;

void main()
{
	fPointSize = 10.0;
	gl_PointSize = fPointSize;
	fColor = vec3(aPosition.xy * 0.5 + 0.5, 1.0);
	vec4 pos = uViewProjMat * vec4(aPosition, 1.0);

	fPixelCenter = ((pos.xy / pos.w) * 0.5 + 0.5) * uScreenSize;
	gl_Position = pos;
}

//! frag
#version 300 es
precision highp float;

in vec3 fColor;
in float fPointSize;
in vec2 fPixelCenter;

out vec4 outColor;

void main()
{
	float alpha = 1.0 - (distance(fPixelCenter, gl_FragCoord.xy) * 2.0 / fPointSize);
	outColor = vec4(fColor, alpha);
}