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

export interface IUser {
  id: string;
  name: string;
  email: string;
  image: string;
  coins: number;
  status: string;
}

export interface IPayment {
  id: string;
  userId: string;
  amount: string;
  image: string;
  status: string;
  created_at: Date;
  reject_reason: string;
}

///////////////////////////////
