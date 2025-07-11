export function getPrompt({
  language,
  type,
  numberOfQuestion,
}: {
  language: string;
  type: string;
  numberOfQuestion: string;
}) {
  const isEnglish = language === "english";
  const isMultipleChoice = type === "multiple-choice";

  const languageNote = isEnglish
    ? ""
    : `
- Use Thai for general words, but **keep technical terms, such as programming keywords, scientific terms, or proper nouns, in English**.
`;

  const baseInstructions = `
You are a quiz generation assistant.

Your task is to read the provided document and generate a list of exactly ${numberOfQuestion} ${
    isMultipleChoice ? "multiple-choice" : "true/false"
  } questions based on its contents.

Strict requirements:
- Format the entire response as a valid JSON array.
- Each item in the array must be an object with the following fields:
  - "text" (${isEnglish ? "string in English" : "string in Thai"})
  - ${
    isMultipleChoice
      ? `- "choices" (array of 4 unique ${
          isEnglish ? "English" : "Thai"
        } strings)`
      : `- "choices" (array with exactly ["True", "False"]${
          !isEnglish ? " in Thai" : ""
        })`
  }
  - "answer" (must be **exactly equal to one of the strings in "choices"** — no paraphrasing, rewording, or abbreviated forms)
  - "type" (must be "${type}")${languageNote}

Additional instructions:
- Ensure "answer" is **identical** to one of the "choices" values (case-sensitive, no partial matches).
- Do not invent new wording in the answer that does not appear in "choices".
- Avoid paraphrasing. Use the exact strings.

Respond only with valid JSON — no explanations or formatting outside the JSON block.

Example:
[
  {
    "text": "${
      isEnglish
        ? "What is the capital of France?"
        : "เมืองหลวงของฝรั่งเศสคืออะไร"
    }",
    "choices": ${
      isMultipleChoice
        ? isEnglish
          ? `["Paris", "London", "Berlin", "Madrid"]`
          : `["ปารีส", "ลอนดอน", "เบอร์ลิน", "มาดริด"]`
        : isEnglish
        ? `["True", "False"]`
        : `["จริง", "เท็จ"]`
    },
    "answer": ${
      isMultipleChoice
        ? isEnglish
          ? `"Paris"`
          : `"ปารีส"`
        : isEnglish
        ? `"True"`
        : `"จริง"`
    },
    "type": "${type}"
  }
]
`;

  return baseInstructions.trim();
}

export function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function isImageFile(file) {
  const acceptedImageTypes = [
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/bmp",
    "image/webp",
  ];
  return file && acceptedImageTypes.includes(file.type);
}

export function formatDateToDDMMYYYY(dateInput: string | Date): string {
  const date = new Date(dateInput);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
