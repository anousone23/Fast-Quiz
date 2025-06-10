export async function createGoogleFormQuiz(
  accessToken: string,
  title: string,
  questions: { text: string; choices: string[]; answer: string }[]
) {
  // Create an empty form with only the title
  const createFormRes = await fetch("https://forms.googleapis.com/v1/forms", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      info: {
        title,
        documentTitle: title,
      },
    }),
  });

  if (!createFormRes.ok) {
    const err = await createFormRes.json();
    throw new Error(err.error?.message || "Failed to create Google Form");
  }

  const createdForm = await createFormRes.json();
  const formId = createdForm.formId;

  //   update form setting to quiz
  await updateFormToQuiz({
    accessToken,
    formId,
  });

  //   add questions to the form
  await addQuestionItem({ accessToken, formId, questions });

  return { formId };
}

async function updateFormToQuiz({
  accessToken,
  formId,
}: {
  accessToken: string;
  formId: string;
}) {
  const updateRequests = [
    {
      updateSettings: {
        settings: {
          quizSettings: {
            isQuiz: true,
          },
        },
        updateMask: "quizSettings.isQuiz",
      },
    },
  ];

  const updateSettingRes = await fetch(
    `https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: updateRequests,
      }),
    }
  );

  if (!updateSettingRes.ok) {
    const err = await updateSettingRes.json();
    throw new Error(err.error?.message || "Failed to update form setting");
  }
}

async function addQuestionItem({
  accessToken,
  formId,
  questions,
}: {
  accessToken: string;
  formId: string;
  questions: { text: string; choices: string[]; answer: string }[];
}) {
  //Add questions using batchUpdate

  const requests = questions.map((q, index) => {
    const trimmedChoices = q.choices.map((choice) => choice.trim());
    const trimmedAnswer = q.answer.trim();

    if (!trimmedChoices.includes(trimmedAnswer)) {
      throw new Error(
        `Answer "${trimmedAnswer}" not found in choices: ${trimmedChoices.join(
          ", "
        )}`
      );
    }

    return {
      createItem: {
        item: {
          title: q.text,
          questionItem: {
            question: {
              required: true,
              choiceQuestion: {
                type: "RADIO",
                options: trimmedChoices.map((choice) => ({ value: choice })),
                shuffle: false,
              },
              grading: {
                pointValue: 1,
                correctAnswers: {
                  answers: [{ value: trimmedAnswer }],
                },
              },
            },
          },
        },
        location: {
          index,
        },
      },
    };
  });

  const batchUpdateRes = await fetch(
    `https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests }),
    }
  );

  if (!batchUpdateRes.ok) {
    const err = await batchUpdateRes.json();
    throw new Error(err.error?.message || "Failed to add questions to form");
  }
}
