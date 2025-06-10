export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://fast-quiz-kappa.vercel.app"
    : "http://localhost:3000";
