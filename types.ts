
export enum View {
  Home = 'Home',
  AdminLogin = 'AdminLogin',
  StudentLogin = 'StudentLogin',
  AdminDashboard = 'AdminDashboard',
  StudentDashboard = 'StudentDashboard',
  ExamHall = 'ExamHall',
  Result = 'Result',
  DevInfo = 'DevInfo'
}

export enum AdminTab {
  Overview = 'Overview',
  Questions = 'Questions',
  Results = 'Results',
  Settings = 'Settings'
}

export interface Question {
  id: string;
  subject: string;
  text: string;
  options: string[];
  correct: string;
  duration: number; // in minutes
}

export interface Result {
  id: string;
  studentName: string;
  roll: string;
  subject: string;
  score: number;
  total: number;
  wrong: number;
  date: string;
  passed: boolean;
}

export interface UserAnswer {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
}
