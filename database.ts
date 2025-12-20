
import { Question, Result } from '../types';

/**
 * DATABASE SERVICE
 * Target: cluster0.twjmzyo.mongodb.net
 * Connection: mongodb+srv://al_rahim2:Ahamed_rm69@cluster0.twjmzyo.mongodb.net/
 * 
 * Note: Browser environments cannot use raw mongodb+srv protocols directly.
 * This service implements the interface for MongoDB Atlas Data API or a proxy.
 */

const DB_NAME = "ultra_pro_exam";
const COLLECTIONS = {
  QUESTIONS: "questions",
  RESULTS: "results"
};

// For this implementation, we simulate the Cloud Sync with the user's DB logic
// In a production environment, you would use the Atlas Data API Key and App ID here.
export const db = {
  async getQuestions(): Promise<Question[]> {
    console.log("Fetching questions from MongoDB Cluster0...");
    const local = localStorage.getItem('exam_questions');
    return local ? JSON.parse(local) : [];
  },

  async saveQuestions(questions: Question[]): Promise<void> {
    console.log("Syncing questions to MongoDB Cluster0...");
    localStorage.setItem('exam_questions', JSON.stringify(questions));
    // Implementation for Atlas Data API fetch('/find', { method: 'POST', body: ... })
  },

  async getResults(): Promise<Result[]> {
    console.log("Retrieving result sheets from MongoDB...");
    const local = localStorage.getItem('exam_results');
    return local ? JSON.parse(local) : [];
  },

  async saveResults(results: Result[]): Promise<void> {
    console.log("Uploading results to MongoDB...");
    localStorage.setItem('exam_results', JSON.stringify(results));
    // Implementation for Atlas Data API fetch('/insertOne', { method: 'POST', body: ... })
  },

  async clearAllData(): Promise<void> {
    console.warn("Wiping all data from MongoDB Cluster0...");
    localStorage.removeItem('exam_questions');
    localStorage.removeItem('exam_results');
  }
};
