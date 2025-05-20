export interface IGeneratedQuestions {
  text: string;
  choices: string[];
  type: string;
  answer: string;
}

export interface IPdf {
  id: string;
  user_id: string;
  name: string;
}

export interface IQuestion {
  id: string;
  pdf_id: string;
  text: string;
  type: "multiple-choice" | "true-false";
  answer: string;
}

export interface IChoice {
  id: string;
  question_id: string;
  text: string;
}

///////////////////////////////
