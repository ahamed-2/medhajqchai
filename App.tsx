
import React, { useState, useEffect } from 'react';
import { View, Question, Result } from './types';
import Sidebar from './components/Sidebar';
import AdminDashboard from './components/AdminDashboard';
import ExamHall from './components/ExamHall';
import Home from './components/Home';
import StudentLogin from './components/StudentLogin';
import AdminLogin from './components/AdminLogin';
import ResultCertificate from './components/ResultCertificate';
import AIChatbot from './components/AIChatbot';
import { db } from './services/database';
import Swal from 'sweetalert2';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Home);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<Result | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Data from MongoDB Service
  useEffect(() => {
    const initData = async () => {
      try {
        setIsLoading(true);
        const [loadedQs, loadedResults] = await Promise.all([
          db.getQuestions(),
          db.getResults()
        ]);
        setQuestions(loadedQs);
        setResults(loadedResults);
      } catch (error) {
        console.error("Failed to fetch from DB:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  const saveQuestions = async (newQs: Question[]) => {
    setQuestions(newQs);
    await db.saveQuestions(newQs);
  };

  const saveResults = async (newResults: Result[]) => {
    setResults(newResults);
    await db.saveResults(newResults);
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to exit?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d63031',
      confirmButtonText: 'Yes, Logout'
    }).then((result) => {
      if (result.isConfirmed) {
        setCurrentView(View.Home);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-cyan-500 font-bold tracking-widest animate-pulse">CONNECTING TO MONGODB...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case View.Home:
        return <Home setView={setCurrentView} />;
      case View.AdminLogin:
        return <AdminLogin onLogin={() => setCurrentView(View.AdminDashboard)} onBack={() => setCurrentView(View.Home)} />;
      case View.StudentLogin:
        return (
          <StudentLogin 
            onLogin={(subject) => {
              setActiveSubject(subject);
              setCurrentView(View.ExamHall);
            }} 
            questions={questions}
            onBack={() => setCurrentView(View.Home)} 
          />
        );
      case View.AdminDashboard:
        return (
          <div className="flex min-h-screen">
            <Sidebar 
              currentView={currentView} 
              onLogout={handleLogout} 
            />
            <main className="flex-1 p-8 overflow-y-auto">
              <AdminDashboard 
                questions={questions} 
                setQuestions={saveQuestions} 
                results={results}
                clearData={async () => {
                   await db.clearAllData();
                   setQuestions([]);
                   setResults([]);
                   Swal.fire('Cloud Wiped!', 'MongoDB collections have been cleared.', 'success');
                }}
              />
            </main>
          </div>
        );
      case View.ExamHall:
        if (!activeSubject) return null;
        return (
          <div className="no-print">
            <ExamHall 
              subject={activeSubject} 
              questions={questions.filter(q => q.subject === activeSubject)} 
              onFinish={async (result) => {
                const newResults = [...results, result];
                await saveResults(newResults);
                setLastResult(result);
                setCurrentView(View.Result);
              }}
            />
          </div>
        );
      case View.Result:
        return lastResult ? (
          <ResultCertificate 
            result={lastResult} 
            onClose={() => setCurrentView(View.Home)} 
          />
        ) : null;
      default:
        return <Home setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen text-slate-200">
      {renderContent()}
      {currentView !== View.ExamHall && <AIChatbot />}
    </div>
  );
};

export default App;
