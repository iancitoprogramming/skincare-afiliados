import type { Answers, QuizQuestion } from "./types";

// Reconstruye respuestas válidas desde la URL (compartible / recuperable).
// Ignora valores que no existan en las opciones, para no romper con URLs manoseadas.
export function parseAnswers(params: URLSearchParams, questions: QuizQuestion[]): Answers {
  const answers: Answers = {};
  for (const q of questions) {
    const value = params.get(q.urlKey);
    if (value && q.options.some((o) => o.value === value)) {
      answers[q.urlKey] = value;
    }
  }
  return answers;
}

export function answersToQuery(answers: Answers): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(answers)) params.set(key, value);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function isComplete(answers: Answers, questions: QuizQuestion[]): boolean {
  return questions.every((q) => Boolean(answers[q.urlKey]));
}
