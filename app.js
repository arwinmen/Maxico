import { exercises, routines } from "./data.js";

const STORAGE = {
  history: "mm2.history.v1",
  profile: "mm2.profile.v1"
};

const muscles = [
  ["pecho", "Pecho"], ["espalda", "Espalda"], ["hombros", "Hombros"], ["biceps", "Bíceps"],
  ["triceps", "Tríceps"], ["core", "Core"], ["piernas", "Piernas"], ["gluteos", "Glúteos"]
];

const state = {
  route: "home",
  filter: "todos",
  learnTopic: "fundamentos",
  session: null,
  deferredInstall: null
};

const main = document.querySelector("#main");
const modalRoot = document.querySelector("#modalRoot");
const toast = document.querySelector("#toast");

const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

function muscleArt(group, label = group) {
  const color = "var(--acid)";
  const active = (part) => group === part ? color : "#ffffff";
  return `<svg viewBox="0 0 180 220" role="img" aria-label="Ilustración de ${label}">
    <g fill="none" stroke="#0a0a0a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="90" cy="31" r="20" fill="#fff"/>
      <path d="M77 53 Q90 62 103 53 L119 78 111 129 69 129 61 78Z" fill="${["pecho","espalda","core"].includes(group) ? active(group) : "#fff"}"/>
      <path d="M62 78 38 111 26 91M118 78l24 33 12-20" fill="none"/>
      <path d="M70 128 58 190 78 212M110 128l12 62-20 22"/>
      <path d="M72 68q18-11 36 0" stroke="${group === "pecho" ? color : "#0a0a0a"}" stroke-width="12"/>
      <path d="M64 78 46 102M116 78l18 24" stroke="${group === "hombros" ? color : "#0a0a0a"}" stroke-width="13"/>
      <path d="M45 102 32 100M135 102l13-2" stroke="${["biceps","triceps"].includes(group) ? color : "#0a0a0a"}" stroke-width="12"/>
      <path d="M76 91h28M78 106h24" stroke="${group === "core" ? color : "#0a0a0a"}" stroke-width="9"/>
      <path d="M70 140 61 185M110 140l9 45" stroke="${group === "piernas" ? color : "#0a0a0a"}" stroke-width="14"/>
      <path d="M73 127q17 14 34 0" stroke="${group === "gluteos" ? color : "#0a0a0a"}" stroke-width="12"/>
      ${group === "espalda" ? '<path d="M72 72q18 26 36 0M76 92l28 25" stroke="var(--acid)" stroke-width="12"/>' : ""}
    </g>
    <path d="M22 45h26M35 32v26" stroke="#0a0a0a" stroke-width="3"/>
  </svg>`;
}

function movementArt(kind, label) {
  const poses = {
    push: `<path d="M28 178h215"/><circle cx="72" cy="105" r="16"/><path d="m87 113 69 29 56 4M101 121l-25 38m70-21-4 38"/>`,
    pull: `<path d="M35 35h190M52 35v178m156-178v178"/><circle cx="130" cy="78" r="16"/><path d="M130 95v58m-2-50L87 57m45 46 36-46m-38 96-28 52m30-52 28 52"/>`,
    row: `<path d="M24 62h70M38 62v148"/><circle cx="148" cy="100" r="16"/><path d="m132 111-58 29 89 31m-31-52-58 21m88 31 45 27"/>`,
    squat: `<circle cx="129" cy="55" r="16"/><path d="m127 72-18 60 55 7m-55-7-39 24 30 48m64-65 23 62M117 94l-48-4m53 5 43-17"/>`,
    lunge: `<circle cx="124" cy="50" r="16"/><path d="m123 67-3 67m0 0-55 24-38 35m93-59 50 14 48 51M120 89 73 111m49-22 45 22"/>`,
    bridge: `<path d="M22 186h215"/><circle cx="52" cy="146" r="16"/><path d="m68 150 69-52 50 48m-50-48 44-22m6 70 26 39M70 151l-28 35"/>`,
    hinge: `<path d="M211 68v137m-18-97h36M188 205h46"/><circle cx="105" cy="68" r="16"/><path d="m119 77 52 55-48 38m48-38 20 43m-68-5-38 35m38-35 25 35M89 83l-21 57"/>`,
    core: `<path d="M22 186h215"/><circle cx="52" cy="135" r="16"/><path d="m68 140 59 23 80-26M83 146l22-50m22 67 51 34"/>`,
    plank: `<path d="M22 186h215"/><circle cx="70" cy="115" r="16"/><path d="m86 122 70 26 66 30M97 130l-31 47m90-29-9 30"/>`,
    rope: `<circle cx="130" cy="55" r="16"/><path d="M130 72v72m0-43-47 35m47-35 48 35m-48 8-31 60m31-60 31 60"/><path d="M82 135C11 74 22 211 99 203m80-68c69-61 59 76-18 68"/>`,
    pike: `<path d="M22 186h215"/><circle cx="62" cy="144" r="16"/><path d="m78 150 32-71 100 100M78 150l-30 33m62-104 15 105"/>`,
    dip: `<path d="M28 120h95m63 0h47M45 120v90m169-90v90"/><circle cx="153" cy="53" r="16"/><path d="m153 70-5 72m2-38-51 16m52-16 52 16m-55 22-30 63m30-63 29 63"/>`,
    calf: `<path d="M36 199h190"/><circle cx="126" cy="45" r="16"/><path d="m126 62 1 74m0 0-25 64m25-64 32 64M126 82l-44 40m45-40 38 38"/>`
  };
  return `<svg viewBox="0 0 260 230" role="img" aria-label="Ilustración de ${label}"><g fill="#fff" stroke="#0a0a0a" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">${poses[kind] || poses.push}</g><path d="M17 28h42M38 8v41" stroke="#0a0a0a" stroke-width="4"/><path d="M207 34l28 8-20 22" fill="none" stroke="#0a0a0a" stroke-width="4"/></svg>`;
}

function heroArt() {
  return `<svg viewBox="0 0 300 300" aria-hidden="true"><g fill="#fff" stroke="#0a0a0a" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"><path d="M38 44h225M60 44v244m180-244v244"/><circle cx="150" cy="104" r="25"/><path d="M150 130v83m0-59-60-72m60 72 59-72m-59 131-42 76m42-76 42 76"/></g><path d="m48 233 38-18-8 28" fill="#0a0a0a"/></svg>`;
}

function renderHome() {
  const history = load(STORAGE.history, []);
  const installed = window.matchMedia("(display-mode: standalone)").matches;
  return `<section class="hero">
    <div class="hero-copy"><p class="eyebrow">Calistenia urbana</p><h1>Tu cuerpo.<br><span class="highlight">Tu terreno.</span></h1><p class="lede">Elige un grupo muscular y encuentra una rutina que sí cabe en tu día.</p></div>
    <div class="hero-art">${heroArt()}<span class="hero-tag">MM2 / ${history.length} sesiones</span></div>
  </section>
  ${installed ? "" : `<section class="install-card" id="androidInstallCard"><div class="install-icon">MM2</div><div><strong>Llévala a tu Android</strong><p>Instala MM2 desde Chrome y úsala como cualquier otra app, incluso sin conexión.</p></div><button class="button dark" data-install>Instalar</button></section>`}
  <section><div class="section-head"><div><p class="eyebrow">Mapa de entrenamiento</p><h2>¿Qué movemos hoy?</h2></div><p>Toca una zona. Te llevamos directo a rutinas que la trabajan.</p></div>
    <div class="muscle-grid">${muscles.map(([id, name], i) => {
      const count = routines.filter(r => r.focus.includes(id)).length;
      return `<button class="muscle-card" data-muscle="${id}"><span class="number">0${i + 1} / ZONA</span>${muscleArt(id, name)}<h3 class="muscle-name">${name}</h3><span class="count">${count || 1} RUTINAS →</span></button>`;
    }).join("")}</div>
  </section>
  <section><div class="section-head"><div><p class="eyebrow">Selección MM2</p><h2>Arranca sin pensarlo de más</h2></div></div>
    <div class="routine-grid">${routines.slice(0, 3).map(routineCard).join("")}</div>
  </section>`;
}

function routineCard(r) {
  return `<article class="routine-card ${r.featured ? "featured" : ""}">
    <div class="meta"><span class="pill">${r.level}</span><span class="pill">${r.minutes} min</span></div>
    <h3>${r.name}</h3><p>${r.description}</p>
    <button class="button ${r.featured ? "" : "secondary"}" data-routine="${r.id}">Ver rutina →</button>
  </article>`;
}

function renderRoutines() {
  const options = [["todos", "Todas"], ...muscles];
  const visible = state.filter === "todos" ? routines : routines.filter(r => r.focus.includes(state.filter));
  return `<p class="eyebrow">Rutinas fijas</p><h1>Entrena con<br>un <span class="highlight">plan.</span></h1>
    <div class="filter-row" aria-label="Filtrar rutinas">${options.map(([id, name]) => `<button class="filter ${state.filter === id ? "active" : ""}" data-filter="${id}">${name}</button>`).join("")}</div>
    <div class="routine-grid">${visible.length ? visible.map(routineCard).join("") : '<div class="empty"><h3>Estamos construyendo esta zona</h3><p>Prueba otra selección.</p></div>'}</div>`;
}

const learnContent = {
  fundamentos: `<h2>Entrenar bien antes de entrenar más</h2><p>La calistenia usa el cuerpo como resistencia, pero sigue los mismos principios básicos de cualquier entrenamiento de fuerza: técnica controlada, una dificultad adecuada, recuperación y progresión gradual.</p><div class="callout">La consistencia supera a la complejidad. No necesitas fallar en cada serie ni cambiar de rutina cada semana.</div><h2>Los seis patrones</h2><p>Una programación de cuerpo completo debe combinar empuje, jalón, sentadilla o desplante, bisagra de cadera, estabilidad del tronco y trabajo cardiovascular. Las dominadas y los fondos son valiosos, pero no sustituyen el entrenamiento de piernas y cadena posterior.</p><h2>Esfuerzo</h2><p>Termina la mayoría de las series sintiendo que todavía podrías completar aproximadamente dos o tres repeticiones con buena técnica. Si la postura se pierde antes, la variante es demasiado difícil o la serie ya terminó.</p><h2>Progresar</h2><ol><li>Mejora primero el control y el rango cómodo.</li><li>Aumenta repeticiones dentro del rango indicado.</li><li>Añade una serie solo cuando recuperes bien.</li><li>Después elige una variante más difícil o una carga ligeramente mayor.</li></ol>`,
  tecnica: `<h2>Una repetición que cuenta</h2><p>La técnica no es una pose idéntica para todos. Las proporciones corporales cambian la apariencia del movimiento, pero las articulaciones deben permanecer estables, la carga controlada y el rango libre de dolor.</p><h2>Dominadas</h2><p>Comienza desde una suspensión activa, evita que los hombros se eleven sin control y lleva el torso hacia la barra sin convertir cada repetición en un balanceo. Usa bandas, apoyo de pies o negativas si todavía no completas repeticiones limpias.</p><h2>Fondos</h2><p>Desciende solamente hasta donde el hombro permanezca cómodo y estable. Una mayor profundidad no siempre representa una mejor repetición. La asistencia con pies o banda permite practicar el patrón.</p><h2>Peso muerto</h2><p>Debe tratarse como una habilidad técnica. Mantén la carga cerca, crea tensión antes de despegarla y mueve cadera y rodillas de forma coordinada. Si no tienes experiencia, aprende presencialmente con una persona cualificada antes de entrenar pesado.</p><div class="callout">Dolor agudo, mareo, debilidad repentina o dolor en el pecho no son señales de esfuerzo productivo: detén la sesión.</div>`,
  nutricion: `<h2>Comer para sostener el entrenamiento</h2><p>MM2 no utiliza dietas extremas. Una alimentación sostenible se construye con variedad, porciones acordes al apetito y actividad, alimentos accesibles y suficiente energía para entrenar y recuperarse.</p><h2>Un plato sencillo</h2><p>Combina verduras o fruta, una fuente de proteína, cereales o tubérculos y una cantidad moderada de grasas. Frijoles con arroz y verduras, tortillas con huevo y nopales, yogur natural con avena y fruta, o pescado con papa y ensalada son ejemplos prácticos; no son menús obligatorios.</p><h2>Antes y después</h2><p>Antes de entrenar, prioriza algo que toleres bien. Después, una comida normal con proteína y carbohidratos suele ser suficiente para la mayoría de las personas recreativas. Los suplementos no reemplazan una alimentación variada.</p><h2>Hidratación exterior</h2><p>Lleva agua, busca horarios más frescos y reduce la sesión si el calor es intenso. No esperes a sentirte muy sediento. Si aparece mareo o debilidad, detente y ve a un lugar fresco.</p>`,
  fuentes: `<h2>Respaldo y criterios editoriales</h2><p>Cada ficha de MM2 debe registrar su fuente, fecha de revisión y responsable editorial. Las marcas, videos y entrenadores pueden ayudar a explicar movimientos, pero las decisiones generales se contrastan con guías y revisiones de instituciones reconocidas.</p><h2>Fuentes base</h2><ul><li><a href="https://acsm.org/resistance-training-guidelines-update-2026/" target="_blank" rel="noreferrer">ACSM — Guías de entrenamiento de resistencia 2026</a></li><li><a href="https://www.who.int/news-room/fact-sheets/detail/physical-activity" target="_blank" rel="noreferrer">OMS — Actividad física</a></li><li><a href="https://www.acefitness.org/resources/everyone/exercise-library/body-part/" target="_blank" rel="noreferrer">ACE — Biblioteca de ejercicios</a></li><li><a href="https://www.gob.mx/cms/uploads/attachment/file/138258/NOM-043-servicios-basicos-salud-educacion-alimentaria.pdf" target="_blank" rel="noreferrer">México — NOM-043 de orientación alimentaria</a></li><li><a href="https://eparmedx.com/" target="_blank" rel="noreferrer">PAR-Q+ — Evaluación previa a la actividad física</a></li><li><a href="https://www.cdc.gov/heat-health/risk-factors/heat-and-athletes.html" target="_blank" rel="noreferrer">CDC — Ejercicio y calor</a></li></ul><div class="callout">Esta aplicación ofrece orientación educativa para adultos sanos. No diagnostica lesiones ni sustituye atención médica, nutricional o entrenamiento presencial.</div>`
};

function renderLearn() {
  const topics = [["fundamentos", "Fundamentos"], ["tecnica", "Técnica"], ["nutricion", "Nutrición"], ["fuentes", "Fuentes"]];
  return `<p class="eyebrow">Respaldo MM2</p><h1>Entiende el<br><span class="highlight">porqué.</span></h1><div class="learn-layout"><aside class="learn-index">${topics.map(([id, name]) => `<button class="${state.learnTopic === id ? "active" : ""}" data-topic="${id}">${name}</button>`).join("")}</aside><article class="article">${learnContent[state.learnTopic]}</article></div>`;
}

function renderHistory() {
  const history = load(STORAGE.history, []);
  const total = history.reduce((sum, item) => sum + item.minutes, 0);
  return `<p class="eyebrow">Registro local</p><h1>Tu <span class="highlight">rastro.</span></h1><p class="lede">${history.length} sesiones · ${total} minutos acumulados en este dispositivo.</p><div class="section-head"><h2>Sesiones recientes</h2>${history.length ? '<button class="button ghost" id="clearHistory">Borrar</button>' : ""}</div>
    <div class="history-list">${history.length ? history.map(item => { const d = new Date(item.completedAt); return `<article class="history-card"><div class="history-date"><strong>${d.getDate()}</strong>${d.toLocaleDateString("es-MX", { month: "short" })}</div><div><h3>${item.name}</h3><p>${item.completedExercises} ejercicios · ${item.minutes} min · dificultad ${item.effort}/5</p></div><span class="history-score">✓</span></article>`; }).join("") : '<div class="empty"><h2>Aún no hay huellas</h2><p>Completa tu primera rutina y aparecerá aquí.</p><button class="button" data-nav="routines">Explorar rutinas</button></div>'}</div>`;
}

function renderProfile() {
  const p = load(STORAGE.profile, { name: "Arwin", goal: "fuerza", level: "principiante", days: "3", minutes: "30", equipment: ["barra", "paralelas", "cuerda"], pain: "" });
  const equipment = ["barra", "paralelas", "cuerda", "bandas", "pesas"];
  return `<p class="eyebrow">Perfil local</p><h1>Tu punto<br>de <span class="highlight">partida.</span></h1><form id="profileForm" class="profile-grid"><section class="panel"><h2>Objetivo y tiempo</h2><div class="field"><label for="name">Nombre</label><input id="name" name="name" value="${escapeHtml(p.name)}" required /></div><div class="field"><label for="goal">Objetivo principal</label><select id="goal" name="goal"><option value="fuerza" ${p.goal === "fuerza" ? "selected" : ""}>Fuerza</option><option value="musculo" ${p.goal === "musculo" ? "selected" : ""}>Ganar músculo</option><option value="condicion" ${p.goal === "condicion" ? "selected" : ""}>Condición</option><option value="habito" ${p.goal === "habito" ? "selected" : ""}>Crear hábito</option></select></div><div class="field"><label for="level">Experiencia</label><select id="level" name="level"><option value="principiante" ${p.level === "principiante" ? "selected" : ""}>Principiante</option><option value="intermedio" ${p.level === "intermedio" ? "selected" : ""}>Intermedio</option><option value="avanzado" ${p.level === "avanzado" ? "selected" : ""}>Avanzado</option></select></div><div class="field"><label for="days">Días por semana</label><input id="days" name="days" type="number" min="1" max="6" value="${p.days}" /></div><div class="field"><label for="minutes">Minutos por sesión</label><input id="minutes" name="minutes" type="number" min="10" max="120" step="5" value="${p.minutes}" /></div></section><section class="panel"><h2>Equipo y seguridad</h2><div class="field"><label>Equipo disponible</label><div class="toggle-group">${equipment.map(e => `<label><input type="checkbox" name="equipment" value="${e}" ${p.equipment.includes(e) ? "checked" : ""}><span>${e}</span></label>`).join("")}</div></div><div class="field"><label for="pain">¿Alguna molestia o limitación actual?</label><input id="pain" name="pain" value="${escapeHtml(p.pain)}" placeholder="Ej. hombro derecho" /></div><p class="danger-note">Si tienes dolor de pecho, mareo, pérdida de conciencia, una lesión reciente o una enfermedad no controlada, consulta a un profesional antes de aumentar tu actividad. MM2 no sustituye una evaluación médica.</p><button class="button full" type="submit">Guardar perfil</button></section></form>`;
}

function escapeHtml(text = "") {
  const el = document.createElement("div");
  el.textContent = text;
  return el.innerHTML;
}

function showRoutine(id) {
  const r = routines.find(x => x.id === id);
  if (!r) return;
  modalRoot.innerHTML = `<div class="modal-backdrop" role="presentation"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="routineTitle"><header class="modal-head"><h2 id="routineTitle">${r.name}</h2><button class="close" data-close aria-label="Cerrar">×</button></header><div class="modal-body"><div class="meta"><span class="pill">${r.level}</span> <span class="pill">${r.minutes} min</span></div><p class="lede">${r.description}</p><div class="exercise-list">${r.exerciseIds.map((id, i) => { const e = exercises[id]; return `<div class="exercise-row"><span class="exercise-index">${i + 1}</span><span><strong>${e.name}</strong><small>${capitalize(e.muscle)}</small></span><span>${e.dose}</span></div>`; }).join("")}</div><p class="danger-note">Trabaja dentro de un rango sin dolor. La rutina presupone que eres un adulto sano y que las instalaciones son estables.</p><button class="button full" data-start="${r.id}">Comenzar rutina →</button></div></section></div>`;
  modalRoot.querySelector("[data-close]").focus();
}

async function requestInstall() {
  if (state.deferredInstall) {
    state.deferredInstall.prompt();
    const choice = await state.deferredInstall.userChoice;
    if (choice.outcome === "accepted") showToast("MM2 se está instalando.");
    state.deferredInstall = null;
    document.querySelector("#installButton").hidden = true;
    document.querySelector("#androidInstallCard")?.remove();
    return;
  }
  modalRoot.innerHTML = `<div class="modal-backdrop" role="presentation"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="installTitle"><header class="modal-head"><h2 id="installTitle">Instalar en Android</h2><button class="close" data-close aria-label="Cerrar">×</button></header><div class="modal-body install-steps"><span>01</span><p>Abre el sitio publicado en <strong>Chrome para Android</strong>.</p><span>02</span><p>Toca el menú de tres puntos <strong>⋮</strong>.</p><span>03</span><p>Elige <strong>Instalar aplicación</strong> o <strong>Agregar a pantalla principal</strong>.</p><span>04</span><p>Confirma. MM2 aparecerá en tu pantalla como una app independiente.</p></div></section></div>`;
}

function startSession(id) {
  const routine = routines.find(r => r.id === id);
  if (!routine) return;
  state.session = { routine, index: 0, startedAt: Date.now() };
  modalRoot.innerHTML = "";
  state.route = "session";
  render();
}

function renderSession() {
  const s = state.session;
  if (!s) { state.route = "routines"; return renderRoutines(); }
  const exercise = exercises[s.routine.exerciseIds[s.index]];
  const pct = ((s.index + 1) / s.routine.exerciseIds.length) * 100;
  return `<section class="session"><div class="session-progress" aria-label="Progreso"><span style="width:${pct}%"></span></div><div class="exercise-stage"><div class="exercise-visual">${movementArt(exercise.kind, exercise.name)}</div><div class="exercise-copy"><span class="step-count">EJERCICIO ${s.index + 1} / ${s.routine.exerciseIds.length}</span><h1>${exercise.name}</h1><span class="pill">${exercise.dose}</span><ul class="cue-list">${exercise.cues.map(c => `<li>${c}</li>`).join("")}</ul><div class="session-controls"><button class="button ghost" id="quitSession">Salir</button><button class="button" id="nextExercise">${s.index === s.routine.exerciseIds.length - 1 ? "Terminar" : "Siguiente →"}</button></div></div></div></section>`;
}

function finishSession() {
  const s = state.session;
  const effort = Number(prompt("¿Qué tan difícil se sintió? 1 = fácil, 5 = muy difícil", "3")) || 3;
  const elapsed = Math.max(1, Math.round((Date.now() - s.startedAt) / 60000));
  const history = load(STORAGE.history, []);
  history.unshift({ id: crypto.randomUUID(), routineId: s.routine.id, name: s.routine.name, completedAt: new Date().toISOString(), completedExercises: s.routine.exerciseIds.length, minutes: Math.min(s.routine.minutes, elapsed), effort: Math.min(5, Math.max(1, effort)) });
  save(STORAGE.history, history.slice(0, 50));
  state.session = null;
  state.route = "history";
  showToast("Sesión guardada. Buen trabajo.");
  render();
}

function capitalize(value) { return value.charAt(0).toUpperCase() + value.slice(1); }
function showToast(message) { toast.textContent = message; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 2300); }

function render() {
  const screens = { home: renderHome, routines: renderRoutines, learn: renderLearn, history: renderHistory, profile: renderProfile, session: renderSession };
  main.innerHTML = (screens[state.route] || renderHome)();
  document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.nav === state.route));
  document.querySelector(".bottom-nav").hidden = state.route === "session";
  main.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-nav]");
  if (nav) { state.route = nav.dataset.nav; modalRoot.innerHTML = ""; render(); return; }
  const muscle = event.target.closest("[data-muscle]");
  if (muscle) { state.filter = muscle.dataset.muscle; state.route = "routines"; render(); return; }
  const filter = event.target.closest("[data-filter]");
  if (filter) { state.filter = filter.dataset.filter; render(); return; }
  const routine = event.target.closest("[data-routine]");
  if (routine) { showRoutine(routine.dataset.routine); return; }
  const start = event.target.closest("[data-start]");
  if (start) { startSession(start.dataset.start); return; }
  if (event.target.closest("[data-close]") || (event.target.classList.contains("modal-backdrop"))) { modalRoot.innerHTML = ""; return; }
  const topic = event.target.closest("[data-topic]");
  if (topic) { state.learnTopic = topic.dataset.topic; render(); return; }
  if (event.target.closest("#nextExercise")) {
    if (state.session.index < state.session.routine.exerciseIds.length - 1) { state.session.index += 1; render(); }
    else finishSession();
  }
  if (event.target.closest("#quitSession")) {
    if (confirm("¿Salir sin guardar esta sesión?")) { state.session = null; state.route = "routines"; render(); }
  }
  if (event.target.closest("#clearHistory")) {
    if (confirm("¿Borrar el historial guardado en este dispositivo?")) { save(STORAGE.history, []); render(); }
  }
  if (event.target.closest("[data-install]")) requestInstall();
});

document.addEventListener("submit", (event) => {
  if (event.target.id !== "profileForm") return;
  event.preventDefault();
  const data = new FormData(event.target);
  save(STORAGE.profile, { name: data.get("name"), goal: data.get("goal"), level: data.get("level"), days: data.get("days"), minutes: data.get("minutes"), equipment: data.getAll("equipment"), pain: data.get("pain") });
  document.querySelector(".avatar").textContent = (data.get("name") || "M").charAt(0).toUpperCase();
  showToast("Perfil guardado en tu dispositivo.");
});

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault(); state.deferredInstall = event; document.querySelector("#installButton").hidden = false;
});
document.querySelector("#installButton").addEventListener("click", async () => {
  requestInstall();
});
function updateOnlineState() { document.querySelector("#offlineBadge").hidden = navigator.onLine; }
window.addEventListener("online", updateOnlineState); window.addEventListener("offline", updateOnlineState); updateOnlineState();
if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("./sw.js");

const profile = load(STORAGE.profile, null);
if (profile?.name) document.querySelector(".avatar").textContent = profile.name.charAt(0).toUpperCase();
render();
