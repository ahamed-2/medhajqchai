
import React, { useState, useEffect, useCallback } from 'react';
import { Question, Result } from '../types';
import { Clock, AlertCircle, Maximize2, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';

interface ExamHallProps {
  subject: string;
  questions: Question[];
  onFinish: (result: Result) => void;
}

const ExamHall: React.FC<ExamHallProps> = ({ subject, questions, onFinish }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState((questions[0]?.duration || 25) * 60);
  const [isFinished, setIsFinished] = useState(false);
  const [studentInfo, setStudentInfo] = useState({ name: '', roll: '' });
  const [cheatAttempts, setCheatAttempts] = useState(0);

  // Fullscreen effect
  const enterFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Anti-cheat
    const handleVisibility = () => {
      if (document.hidden && !isFinished) {
        setCheatAttempts(prev => {
          const next = prev + 1;
          if (next === 1) Swal.fire('Warning!', 'Tab switching is strictly prohibited. Final warning.', 'warning');
          if (next >= 2) {
            Swal.fire('Exam Terminated', 'Violation of rules. Submitting automatically.', 'error');
            finishExam();
          }
          return next;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isFinished]);

  const finishExam = () => setIsFinished(true);

  const handleSubmit = () => {
    if (!studentInfo.name || !studentInfo.roll) {
      Swal.fire('Wait!', 'Please enter your name and roll number.', 'warning');
      return;
    }

    let score = 0;
    let wrong = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) score++;
      else if (answers[q.id]) wrong++;
    });

    const passed = (score / questions.length) >= 0.4;
    const result: Result = {
      id: Date.now().toString(),
      studentName: studentInfo.name,
      roll: studentInfo.roll,
      subject,
      score,
      total: questions.length,
      wrong,
      date: new Date().toLocaleDateString(),
      passed
    };
    onFinish(result);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / ((questions[0]?.duration || 25) * 60)) * 100;

  if (isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
        <div className="glass-panel p-10 rounded-3xl max-w-md w-full text-center space-y-6 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/50">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold">Exam Completed</h2>
          <p className="text-slate-400">Great job! Finalize your submission details to see your results.</p>
          <div className="space-y-4 text-left">
            <div>
              <label className="text-sm font-medium text-slate-400 mb-1 block">Full Name</label>
              <input 
                className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl"
                placeholder="Ex: Ahamed Rahim"
                value={studentInfo.name}
                onChange={e => setStudentInfo({...studentInfo, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400 mb-1 block">Roll Number</label>
              <input 
                className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl font-mono"
                placeholder="Ex: 102938"
                value={studentInfo.roll}
                onChange={e => setStudentInfo({...studentInfo, roll: e.target.value})}
              />
            </div>
          </div>
          <button 
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold py-4 rounded-2xl shadow-xl shadow-cyan-500/20 active:scale-95 transition-all"
          >
            Submit Exam
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-12 relative flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Maximize2 className="text-slate-950 cursor-pointer" onClick={enterFullscreen} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{subject}</h2>
            <p className="text-slate-500 text-sm">Question {currentIdx + 1} of {questions.length}</p>
          </div>
        </div>

        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
              strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * progress) / 100}
              className={`transition-all duration-1000 ${timeLeft < 60 ? 'text-red-500' : 'text-cyan-500'}`} />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={`text-xl font-bold font-mono ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              {minutes}:{seconds < 10 ? '0'+seconds : seconds}
            </span>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full">
        <div className="glass-panel p-8 lg:p-12 rounded-[40px] shadow-2xl space-y-8 animate-in slide-in-from-right-10 duration-500">
          <h3 className="text-2xl lg:text-4xl font-semibold leading-tight">{q.text}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {q.options.map((opt, i) => (
              <button 
                key={opt}
                onClick={() => setAnswers({...answers, [q.id]: opt})}
                className={`p-6 rounded-[28px] text-left border-2 transition-all flex items-center gap-4 group ${
                  answers[q.id] === opt 
                    ? 'bg-cyan-500/10 border-cyan-500 shadow-lg shadow-cyan-500/10' 
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all ${
                  answers[q.id] === opt ? 'bg-cyan-500 border-cyan-500 text-slate-950' : 'border-slate-700 group-hover:border-slate-500 text-slate-500'
                }`}>
                  {String.fromCharCode(65+i)}
                </div>
                <span className="font-medium text-lg">{opt}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-12">
          <button 
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(prev => prev - 1)}
            className="px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 font-bold disabled:opacity-30 hover:bg-slate-800 transition-all"
          >
            Previous
          </button>
          
          {currentIdx === questions.length - 1 ? (
            <button 
              onClick={finishExam}
              className="px-10 py-4 rounded-2xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20"
            >
              Finish Exam
            </button>
          ) : (
            <button 
              onClick={() => setCurrentIdx(prev => prev + 1)}
              className="px-10 py-4 rounded-2xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/20"
            >
              Next Question
            </button>
          )}
        </div>
      </div>

      {cheatAttempts > 0 && (
        <div className="fixed bottom-6 left-6 flex items-center gap-3 px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full animate-bounce">
          <AlertCircle size={18} />
          <span className="text-sm font-bold uppercase tracking-widest">Rules Violation Detected</span>
        </div>
      )}
    </div>
  );
};

export default ExamHall;
