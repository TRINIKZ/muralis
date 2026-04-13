/**
 * Fundo procedural estilo Musgrave/fBm (inspirado em ruído fractal do Blender).
 * WebGL fullscreen; respeita prefers-reduced-motion.
 */
(function () {
	const canvas = document.getElementById("bg-canvas");
	if (!canvas) return;

	const gl =
		canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" }) ||
		canvas.getContext("experimental-webgl");

	if (!gl) {
		return;
	}

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	const vertSrc = `
		attribute vec2 a_pos;
		varying vec2 v_uv;
		void main() {
			v_uv = a_pos * 0.5 + 0.5;
			gl_Position = vec4(a_pos, 0.0, 1.0);
		}
	`;

	const fragSrc = `
		precision mediump float;
		varying vec2 v_uv;
		uniform float u_time;
		uniform vec2 u_resolution;
		uniform float u_buscar;
		uniform float u_excluir;
		uniform float u_salvar;

		float hash(vec2 p) {
			return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
		}

		float noise(vec2 p) {
			vec2 i = floor(p);
			vec2 f = fract(p);
			f = f * f * (3.0 - 2.0 * f);
			float a = hash(i);
			float b = hash(i + vec2(1.0, 0.0));
			float c = hash(i + vec2(0.0, 1.0));
			float d = hash(i + vec2(1.0, 1.0));
			return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
		}

		/* fBm — base do visual "Musgrave" (octaves + lacunarity) */
		float fbm(vec2 p) {
			float v = 0.0;
			float a = 0.52;
			float lac = 2.15;
			vec2 shift = vec2(100.0);
			for (int i = 0; i < 6; i++) {
				v += a * noise(p);
				p = p * lac + shift;
				a *= 0.48;
			}
			return v;
		}

		float musgraveRidge(vec2 p, float t) {
			float s = 0.0;
			float w = 0.55;
			float f = 1.0;
			for (int i = 0; i < 5; i++) {
				float n = noise(p * f + t * 0.15);
				n = 1.0 - abs(n * 2.0 - 1.0);
				s += w * n * n;
				f *= 2.05;
				w *= 0.5;
			}
			return s;
		}

		void main() {
			vec2 uv = v_uv;
			float lineIndex = floor(uv.y * 42.0);
			float lineNoise = noise(vec2(lineIndex, floor(u_time * 18.0)));
			float glitchBand = step(0.6, lineNoise);
			float lineShift = (lineNoise - 0.5) * 0.055;
			uv.x += lineShift * u_excluir * glitchBand;

			float coarseBlock = noise(vec2(floor(uv.y * 12.0), floor(u_time * 9.0)));
			uv.x += (coarseBlock - 0.5) * 0.018 * u_excluir;

			float aspect = max(u_resolution.x / u_resolution.y, 0.5);
			vec2 p = vec2(uv.x * aspect, uv.y) * 2.8;

			vec2 drift = vec2(u_time * 0.022, u_time * 0.018);
			vec2 swirl = vec2(sin(u_time * 0.07), cos(u_time * 0.05)) * 0.12;

			float m1 = fbm(p + drift + swirl);
			float m2 = fbm(p * 1.65 - drift.yx + vec2(17.3, 9.1));
			float ridge = musgraveRidge(p * 0.2 + drift * 0.65, u_time * 3.08);

			float n = mix(m1 * 0.65 + m2 * 0.35, ridge, 0.38);
			n = pow(clamp(n, 0.0, 1.0), 1.5);

			vec3 deepB = vec3(0.059, 0.078, 0.098);
			vec3 midB = vec3(0.082, 0.137, 0.220);
			vec3 accB = vec3(0.12, 0.20, 0.32);
			vec3 deepSearch = vec3(0.068, 0.088, 0.108);
			vec3 midSearch = vec3(0.095, 0.155, 0.245);
			vec3 accSearch = vec3(0.16, 0.25, 0.39);
			vec3 deepG = vec3(0.03, 0.08, 0.06);
			vec3 midG = vec3(0.05, 0.22, 0.14);
			vec3 accG = vec3(0.12, 0.42, 0.22);
			vec3 deepR = vec3(0.10, 0.03, 0.04);
			vec3 midR = vec3(0.24, 0.06, 0.08);
			vec3 accR = vec3(0.42, 0.10, 0.12);

			float buscarPulse = u_buscar;

			vec3 deep = mix(deepB, deepSearch, buscarPulse);
			vec3 mid = mix(midB, midSearch, buscarPulse);
			vec3 accent = mix(accB, accSearch, buscarPulse);

			deep = mix(deep, deepG, u_salvar);
			mid = mix(mid, midG, u_salvar);
			accent = mix(accent, accG, u_salvar);

			deep = mix(deep, deepR, u_excluir);
			mid = mix(mid, midR, u_excluir);
			accent = mix(accent, accR, u_excluir);
			vec3 col = mix(deep, mid, n);
			col = mix(col, accent, n * n * 0.45);

			float bugFlicker = 0.9 + 0.1 * noise(vec2(floor(u_time * 28.0), floor(uv.y * 80.0)));
			float scanline = 0.96 - 0.08 * step(0.7, noise(vec2(floor(uv.y * 120.0), floor(u_time * 22.0))));
			float bugDark = bugFlicker * scanline;
			col *= mix(1.0, bugDark * 0.92, u_excluir);

			float vig = 1.0 - length(uv - 0.5) * 1.15;
			vig = clamp(vig, 0.0, 1.0);
			col *= 0.88 + 0.12 * vig;

			float dangerVignette = 1.0 - length(uv - 0.5) * 1.55;
			dangerVignette = clamp(dangerVignette, 0.0, 1.0);
			col *= mix(1.0, 0.84 + 0.16 * dangerVignette, u_excluir);

			gl_FragColor = vec4(col, 1.0);
		}
	`;

	function compile(type, src) {
		const sh = gl.createShader(type);
		gl.shaderSource(sh, src);
		gl.compileShader(sh);
		if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
			console.warn("musgrave-bg shader:", gl.getShaderInfoLog(sh));
			gl.deleteShader(sh);
			return null;
		}
		return sh;
	}

	const vs = compile(gl.VERTEX_SHADER, vertSrc);
	const fs = compile(gl.FRAGMENT_SHADER, fragSrc);
	if (!vs || !fs) return;

	const prog = gl.createProgram();
	gl.attachShader(prog, vs);
	gl.attachShader(prog, fs);
	gl.linkProgram(prog);
	if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
		console.warn("musgrave-bg program:", gl.getProgramInfoLog(prog));
		return;
	}

	const buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

	const aPos = gl.getAttribLocation(prog, "a_pos");
	const uTime = gl.getUniformLocation(prog, "u_time");
	const uRes = gl.getUniformLocation(prog, "u_resolution");
	const uBuscar = gl.getUniformLocation(prog, "u_buscar");
	const uExcluir = gl.getUniformLocation(prog, "u_excluir");
	const uSalvar = gl.getUniformLocation(prog, "u_salvar");

	let start = performance.now();
	let fixedTime = 0;
	let buscarPulseStart = -1;
	let targetExcluir = 0;
	let mixExcluir = 0;
	let targetSalvar = 0;
	let mixSalvar = 0;

	function triggerBuscarPulse() {
		buscarPulseStart = performance.now();
	}

	function isBuscarControl(el) {
		return el && el.closest && el.closest("#btnBuscar, #btnIrClientes");
	}

	function isExcluirControl(el) {
		return el && el.closest && el.closest(".btn-danger");
	}

	function isSalvarControl(el) {
		return el && el.closest && el.closest('button[type="submit"], input[type="submit"]');
	}

	document.addEventListener(
		"mouseover",
		function (e) {
			if (isBuscarControl(e.target)) triggerBuscarPulse();
			if (isExcluirControl(e.target)) targetExcluir = 1;
			if (isSalvarControl(e.target)) targetSalvar = 1;
		},
		true,
	);
	document.addEventListener(
		"mouseout",
		function (e) {
			if (!isExcluirControl(e.target)) return;
			const rel = e.relatedTarget;
			if (!rel || !isExcluirControl(rel)) {
				targetExcluir = 0;
				triggerBuscarPulse();
			}
		},
		true,
	);
	document.addEventListener(
		"mouseout",
		function (e) {
			if (!isSalvarControl(e.target)) return;
			const rel = e.relatedTarget;
			if (!rel || !isSalvarControl(rel)) targetSalvar = 0;
		},
		true,
	);

	function resize() {
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const w = Math.floor(window.innerWidth * dpr);
		const h = Math.floor(window.innerHeight * dpr);
		if (canvas.width !== w || canvas.height !== h) {
			canvas.width = w;
			canvas.height = h;
		}
		gl.viewport(0, 0, canvas.width, canvas.height);
	}

	function frame() {
		resize();
		const t = reduceMotion ? fixedTime : (performance.now() - start) * 0.001;
		let pulseBuscar = 0;
		if (buscarPulseStart >= 0) {
			const pulseDuration = 600.0;
			const pulseProgress = Math.min((performance.now() - buscarPulseStart) / pulseDuration, 1);
			pulseBuscar = Math.sin(pulseProgress * Math.PI);
			if (pulseProgress >= 1) buscarPulseStart = -1;
		}

		mixExcluir += (targetExcluir - mixExcluir) * 0.14;
		mixSalvar += (targetSalvar - mixSalvar) * 0.14;
		if (Math.abs(targetExcluir - mixExcluir) < 0.002) mixExcluir = targetExcluir;
		if (Math.abs(targetSalvar - mixSalvar) < 0.002) mixSalvar = targetSalvar;

		gl.useProgram(prog);
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.enableVertexAttribArray(aPos);
		gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
		gl.uniform1f(uTime, t);
		gl.uniform2f(uRes, canvas.width, canvas.height);
		gl.uniform1f(uBuscar, pulseBuscar * (1.0 - mixSalvar) * (1.0 - mixExcluir));
		gl.uniform1f(uExcluir, mixExcluir);
		gl.uniform1f(uSalvar, mixSalvar * (1.0 - mixExcluir));
		gl.drawArrays(gl.TRIANGLES, 0, 6);

		const animaTempo = !reduceMotion;
		const animaCor =
			pulseBuscar > 0.001 ||
			Math.abs(targetExcluir - mixExcluir) > 0.001 ||
			Math.abs(targetSalvar - mixSalvar) > 0.001;
		if (animaTempo || animaCor) {
			requestAnimationFrame(frame);
		}
	}

	window.addEventListener("resize", function () {
		resize();
		requestAnimationFrame(frame);
	});

	if (reduceMotion) {
		/** Com tempo congelado, o loop só roda ao mover o mix de cor — força frame no hover. */
		document.addEventListener(
			"mouseover",
			function (e) {
				if (isBuscarControl(e.target) || isExcluirControl(e.target) || isSalvarControl(e.target)) {
					requestAnimationFrame(frame);
				}
			},
			true,
		);
		document.addEventListener(
			"mouseout",
			function (e) {
				if (isBuscarControl(e.target) || isExcluirControl(e.target) || isSalvarControl(e.target)) {
					requestAnimationFrame(frame);
				}
			},
			true,
		);
	}

	resize();
	frame();
})();
