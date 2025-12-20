
import React, { useRef } from 'react';
import { Result } from '../types';
import { Download, Share2, Award, CheckCircle2, XCircle, Home } from 'lucide-react';
import Swal from 'sweetalert2';

interface ResultCertificateProps {
  result: Result;
  onClose: () => void;
}

const ResultCertificate: React.FC<ResultCertificateProps> = ({ result, onClose }) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadAsImage = async () => {
    if (!certificateRef.current) return;
    try {
      const canvas = await (window as any).html2canvas(certificateRef.current, {
        backgroundColor: '#020617',
        scale: 2
      });
      const link = document.createElement('a');
      link.download = `Certificate_${result.studentName}_${result.roll}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      Swal.fire('Downloaded!', 'Your certificate has been saved.', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Could not generate image.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center justify-center animate-in fade-in duration-700">
      <div className="max-w-5xl w-full flex flex-col lg:flex-row gap-8 items-center">
        
        {/* Certificate Section */}
        <div ref={certificateRef} className="flex-1 glass-panel p-2 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-50"></div>
          
          <div className="relative z-10 p-12 lg:p-20 certificate-border bg-slate-950 m-2 rounded-[1.5rem] flex flex-col items-center text-center">
            <Award className={`w-24 h-24 mb-8 ${result.passed ? 'text-cyan-400' : 'text-red-400 opacity-20'}`} />
            
            <h1 className="text-sm font-bold tracking-[0.5em] text-cyan-500 uppercase mb-4">Official Certificate of Achievement</h1>
            <p className="text-slate-400 text-lg mb-12">This acknowledges that</p>
            
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 border-b-2 border-slate-800 pb-4 px-10">
              {result.studentName}
            </h2>
            
            <div className="max-w-2xl text-slate-300 leading-relaxed mb-12">
              Successfully completed the online proficiency examination in <span className="text-cyan-400 font-bold">{result.subject}</span> with a total score of 
              <span className="text-white text-2xl font-bold ml-2">{result.score}/{result.total}</span>. 
              {result.passed ? ' We commend your dedication and excellence.' : ' Keep practicing to improve your score.'}
            </div>

            <div className="grid grid-cols-2 gap-20 mt-12 w-full max-w-lg">
              <div className="border-t border-slate-800 pt-4">
                <p className="font-mono text-white text-lg">{result.date}</p>
                <p className="text-xs uppercase text-slate-500 font-bold tracking-widest mt-1">Date Issued</p>
              </div>
              <div className="border-t border-slate-800 pt-4">
                <p className="font-mono text-white text-lg">{result.roll}</p>
                <p className="text-xs uppercase text-slate-500 font-bold tracking-widest mt-1">Reg ID</p>
              </div>
            </div>

            <div className="absolute bottom-12 right-12 opacity-10">
               <Award size={160} />
            </div>
          </div>
        </div>

        {/* Sidebar Info & Actions */}
        <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
          <div className="glass-panel p-8 rounded-3xl border-slate-800">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${result.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {result.passed ? <CheckCircle2 /> : <XCircle />}
              </div>
              <div>
                <h3 className="font-bold text-xl">{result.passed ? 'Passed' : 'Not Passed'}</h3>
                <p className="text-sm text-slate-500">Official Result</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-slate-800">
                <span className="text-slate-500">Correct</span>
                <span className="font-bold text-emerald-400">{result.score}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-800">
                <span className="text-slate-500">Wrong</span>
                <span className="font-bold text-red-400">{result.wrong}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-slate-500">Accuracy</span>
                <span className="font-bold text-cyan-400">{Math.round((result.score/result.total)*100)}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={downloadAsImage}
              className="w-full flex items-center justify-center gap-3 bg-white text-slate-950 font-bold py-5 rounded-3xl hover:bg-slate-200 transition-all shadow-xl shadow-white/5"
            >
              <Download size={20} />
              Save as Image
            </button>
            <button 
              onClick={() => Swal.fire('Shared!', 'Link copied to clipboard.', 'success')}
              className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white font-bold py-5 rounded-3xl border border-slate-800 hover:bg-slate-800 transition-all"
            >
              <Share2 size={20} />
              Share Online
            </button>
            <button 
              onClick={onClose}
              className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-400 font-bold py-5 rounded-3xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
            >
              <Home size={20} />
              Exit Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCertificate;
