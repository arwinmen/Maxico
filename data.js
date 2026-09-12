export const exercises = {
  pushup: { name: "Push-up", muscle: "pecho", dose: "3 × 8–12", cues: ["Manos bajo los hombros", "Cuerpo firme de cabeza a talones", "Baja con control; exhala al subir"], kind: "push" },
  incline: { name: "Push-up inclinada", muscle: "pecho", dose: "3 × 10–15", cues: ["Apoya las manos en una barra estable", "Mantén costillas y pelvis alineadas", "Acerca el pecho a la barra"], kind: "push" },
  dip: { name: "Fondos asistidos", muscle: "triceps", dose: "3 × 6–10", cues: ["Hombros lejos de las orejas", "Desciende solo en rango cómodo", "Usa pies o banda para asistir"], kind: "dip" },
  pullup: { name: "Dominada asistida", muscle: "espalda", dose: "4 × 4–8", cues: ["Inicia con hombros activos", "Lleva el pecho hacia la barra", "Evita balancearte"], kind: "pull" },
  row: { name: "Remo invertido", muscle: "espalda", dose: "3 × 8–12", cues: ["Cuerpo en una línea", "Jala la barra hacia el pecho", "Aprieta omóplatos sin encoger hombros"], kind: "row" },
  squat: { name: "Sentadilla", muscle: "piernas", dose: "3 × 12–18", cues: ["Pies firmes y rodillas acompañan a los dedos", "Desciende dentro de un rango estable", "Empuja el suelo al subir"], kind: "squat" },
  split: { name: "Split squat", muscle: "piernas", dose: "3 × 8/lado", cues: ["Separa los pies como sobre rieles", "Baja la rodilla trasera con control", "Impulsa con todo el pie delantero"], kind: "lunge" },
  bridge: { name: "Puente de glúteo", muscle: "gluteos", dose: "3 × 12–15", cues: ["Pies cerca de los glúteos", "Eleva la cadera sin arquear la espalda", "Pausa arriba y baja lento"], kind: "bridge" },
  deadlift: { name: "Peso muerto técnico", muscle: "posterior", dose: "3 × 6–8", cues: ["Barra cerca de las piernas", "Cadera atrás y columna estable", "Empuja el suelo; no jales con la espalda"], kind: "hinge" },
  hollow: { name: "Hollow hold", muscle: "core", dose: "3 × 20–30 s", cues: ["Espalda baja en contacto con el suelo", "Acorta la palanca si pierdes posición", "Respira sin soltar tensión"], kind: "core" },
  plank: { name: "Plancha", muscle: "core", dose: "3 × 25–40 s", cues: ["Codos bajo los hombros", "Glúteos y abdomen activos", "Evita hundir la cadera"], kind: "plank" },
  rope: { name: "Salto de cuerda", muscle: "cardio", dose: "6 × 45 s", cues: ["Saltos bajos y suaves", "Gira la cuerda con muñecas", "Mantén un ritmo que puedas controlar"], kind: "rope" },
  pike: { name: "Pike push-up", muscle: "hombros", dose: "3 × 6–10", cues: ["Cadera alta", "Lleva la cabeza delante de las manos", "Empuja fuerte y mantén control"], kind: "pike" },
  calf: { name: "Elevación de talón", muscle: "piernas", dose: "3 × 15–20", cues: ["Apóyate ligeramente", "Sube hasta los metatarsos", "Pausa y baja con control"], kind: "calf" }
};

export const routines = [
  { id: "starter", name: "Base de parque", level: "Principiante", minutes: 32, focus: ["pecho", "espalda", "piernas", "core"], description: "Cuerpo completo para aprender los patrones esenciales.", exerciseIds: ["incline", "row", "squat", "bridge", "plank"], featured: true },
  { id: "push", name: "Empuje limpio", level: "Intermedio", minutes: 28, focus: ["pecho", "hombros", "triceps"], description: "Control de hombros, pecho y brazos sin repeticiones sucias.", exerciseIds: ["pushup", "dip", "pike", "plank"] },
  { id: "pull", name: "Barra norte", level: "Intermedio", minutes: 34, focus: ["espalda", "biceps", "core"], description: "Tracción vertical y horizontal con el tronco estable.", exerciseIds: ["pullup", "row", "hollow", "rope"] },
  { id: "legs", name: "Piernas de concreto", level: "Todos", minutes: 30, focus: ["piernas", "gluteos", "posterior"], description: "Fuerza unilateral y cadena posterior para un cuerpo equilibrado.", exerciseIds: ["squat", "split", "bridge", "calf", "rope"] },
  { id: "deadlift", name: "Bisagra + barra", level: "Con experiencia", minutes: 38, focus: ["posterior", "espalda", "core"], description: "Calistenia complementada con peso muerto técnico y moderado.", exerciseIds: ["deadlift", "pullup", "bridge", "plank"] },
  { id: "quick", name: "Cruce exprés", level: "Todos", minutes: 18, focus: ["pecho", "piernas", "cardio"], description: "Una sesión corta para esos días con agenda apretada.", exerciseIds: ["pushup", "squat", "row", "rope"] }
];
