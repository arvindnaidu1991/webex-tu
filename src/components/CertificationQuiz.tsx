/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { Award, CheckCircle2, ChevronRight, RefreshCw, Star, Trophy, ShieldCheck, Printer } from 'lucide-react';

export default function CertificationQuiz() {
  const questions: QuizQuestion[] = [
    {
      id: 'q1',
      question: 'Which Cisco router feature is strictly required to accomplish double-sided protocol normalization and port bindings for a local Webex Calling gateway?',
      options: [
        'An active CUBE standard or redundant session border controller (SBC) routing license.',
        'A Cisco standard access list block applied to incoming dial interfaces (ACD).',
        'Direct static BGP peer routing enabled on the main customer-edge backbone.'
      ],
      correctAnswerIndex: 0,
      explanation: 'Integrating on-premises PSTN routes with Webex Calling requires the Cisco Unified Border Element (CUBE) session license. This enables bidirectional IP-to-IP signaling and normalized header mappings on the WAN interfaces.'
    },
    {
      id: 'q2',
      question: 'A voice administrator needs to synchronize user profiles in an Active Directory OU to Webex Control Hub. How should AD attributes map to the primary username index?',
      options: [
        'The AD telephoneNumber attribute must map to Webex Global Ext.',
        'The AD mail attribute must function as the primary key mapped to Webex Username / Email.',
        'The AD givenName must map to Webex SIP Registration URI.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Establishing the Cisco Directory Connector syncs accounts utilizing user emails (AD mail field) as the unique primary user account directory lookup in Webex Control Hub.'
    },
    {
      id: 'q3',
      question: 'During field metrics diagnostics on a troublesome Webex calling path, which parameters represent target guidelines for high quality corporate audio streams?',
      options: [
        'Latency < 250ms, Jitter < 100ms, Packet Loss < 5.0%',
        'Latency < 150ms, Jitter < 30ms, Packet Loss < 1.0%',
        'Latency < 450ms, Jitter < 50ms, Packet Loss < 3.0%'
      ],
      correctAnswerIndex: 1,
      explanation: "Cisco collaboration engineering standards specify strict targets for real-time voice: one-way latency below 150ms, Jitter below 30ms, and packet loss below 1% to prevent standard dropouts."
    },
    {
      id: 'q4',
      question: 'Why must SIP Application Layer Gateway (SIP ALG) or SIP Inspection filters be disabled on corporate firewalls routing CUBE gateway calls?',
      options: [
        'SIP ALG blocks standard secure HTTPS web-socket endpoints required for chat features.',
        'SIP ALG alters the SDP and ACK response headers, leading to call termination exactly after 30 seconds due to timeout of ACK handshakes.',
        'SIP ALG disables local router certificates from parsing QuoVadis signatures.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Firewall inspection elements parse SIP messages and rewrite critical ports. This alters ACK packets from reaching Webex cloud layers, triggering a session teardown SIP BYE packet after 30 seconds.'
    },
    {
      id: 'q5',
      question: 'Inside Webex Contact Center (WxCC) SBR configurations, what is the primary structural difference between SBR and Legacy Queue configurations?',
      options: [
        'SBR requires a physical local router database connection to store agent priority lists.',
        'SBR maps contacts to specialized skills and scores on the agent profile entity rather than to a static, rigid list of agent team names.',
        'SBR disables automatic call distribution (ACD) logic whenever the schedule check evaluates closed.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Skill-Based Routing (SBR) routes customers dynamically matching caller parameters to specific skills and level parameters parsed on agent profiles rather than statically matching rigid group structures.'
    }
  ];

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [traineeName, setTraineeName] = useState('John Doe');
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = questions[currentQuestionIdx];

  const handleSelectAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswerIdx(idx);
    setIsAnswered(true);
    if (idx === currentQuestion.correctAnswerIndex) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedAnswerIdx(null);
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setIsExamCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswerIdx(null);
    setCorrectCount(0);
    setIsExamCompleted(false);
    setIsAnswered(false);
  };

  const printCertificate = () => {
    window.print();
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6" id="certification-exam-view">
      <div className="border-b border-gray-150 pb-4 mb-6">
        <span className="text-xs font-semibold text-blue-650 tracking-wider uppercase">Trainee Verification portal</span>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1">Webex Systems Administrator Certification</h1>
        <p className="text-slate-600 text-sm mt-1">
          Validate your command of architectures, CLI gateways, and Contact Center routing logic.
        </p>
      </div>

      {!isExamCompleted ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>Question {currentQuestionIdx + 1} of {questions.length}</span>
              <span>Running score: {correctCount} correct</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Text */}
          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Options List */}
          <div className="space-y-2">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedAnswerIdx === idx;
              const isCorrectOpt = idx === currentQuestion.correctAnswerIndex;
              const optionLabel = String.fromCharCode(65 + idx); // A, B, C

              let optionStyle = 'border-gray-200 bg-white hover:bg-gray-50 text-slate-700';
              if (isAnswered) {
                if (isCorrectOpt) {
                  optionStyle = 'bg-emerald-50 border-emerald-300 text-emerald-950';
                } else if (isSelected) {
                  optionStyle = 'bg-red-50 border-red-300 text-red-950';
                } else {
                  optionStyle = 'border-gray-150 bg-white opacity-60 text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 border rounded-xl text-xs font-semibold leading-relaxed flex items-center gap-4 transition-all ${optionStyle}`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border shrink-0 py-0.5 ${
                    isAnswered && isCorrectOpt ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-gray-300 bg-gray-50 text-slate-600'
                  }`}>
                    {optionLabel}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Answer explanation panel */}
          {isAnswered && (
            <div className="bg-blue-50/45 border border-blue-250 text-blue-955 text-xs p-4 rounded-xl space-y-2 leading-relaxed text-justify animate-fade-in shadow-sm">
              <p className="font-bold uppercase tracking-wider flex items-center text-blue-900">
                <CheckCircle2 className="w-4 h-4 mr-1 text-blue-600" /> Administrative Explanation:
              </p>
              <p className="text-slate-700">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Navigation Controls */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white border text-xs font-semibold rounded-lg shadow-sm flex items-center transition"
              >
                Next Question <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Completed Certification Certificate view */
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in" id="printable-certificate-container">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center space-y-4">
            <Trophy className="w-12 h-12 text-amber-500 mx-auto animate-pulse" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Lab Evaluation Completed</h2>
            <p className="text-sm text-slate-605 max-w-md mx-auto">
              You scored <strong className="text-slate-900">{correctCount} of {questions.length}</strong> correct on the master administration test. Enter your training candidate name below:
            </p>
            <div className="max-w-xs mx-auto">
              <input
                type="text"
                value={traineeName}
                onChange={(e) => setTraineeName(e.target.value)}
                className="w-full text-xs font-bold text-center border border-gray-300 rounded-lg px-3 py-2 text-slate-800 bg-white focus:outline-none focus:border-blue-500 shadow-sm"
                placeholder="Candidate Name"
              />
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleReset}
                className="px-3.5 py-2 border border-gray-200 text-slate-700 bg-white hover:bg-gray-50 text-xs font-semibold rounded-lg transition flex items-center"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Re-take Exam
              </button>
              {correctCount >= 4 && (
                <button
                  onClick={printCertificate}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow flex items-center transition"
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> Print Certificate
                </button>
              )}
            </div>
          </div>

          {/* The High-fidelity Diploma Certificate styling */}
          {correctCount >= 4 ? (
            <div className="border-4 border-slate-900 bg-white p-12 text-center rounded-lg relative overflow-hidden shadow-xl space-y-8 print:border-none print:shadow-none print:p-0">
              {/* Corner decorative lines */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-blue-50/25 border-r border-b border-gray-200 rounded-br-full opacity-60"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/25 border-l border-b border-gray-200 rounded-bl-full opacity-60"></div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[4px] text-blue-650 block">Cisco Collaboration Engineering</span>
                <h1 className="font-serif text-3xl font-bold text-slate-900 tracking-wide">CERTIFICATE OF EXCELLENCE</h1>
                <div className="w-40 h-[1.5px] bg-blue-600 mx-auto my-3"></div>
              </div>

              <p className="font-serif text-slate-500 text-sm leading-relaxed max-w-xl mx-auto italic">
                This certifies that the candidate has successfully completed the rigorous administration curriculum, and is accredited with full systems competency to configure, administer, and maintain enterprise endpoints under:
              </p>

              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Candidate Accredited</p>
                <h2 className="text-2xl font-serif font-bold text-slate-800 border-b border-gray-200 pb-1.5 max-w-sm mx-auto">{traineeName}</h2>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-bold text-blue-650 uppercase tracking-widest">Webex Certified Systems Administrator</h3>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Covering: Local Gateways (CUBE), Directory Syncs, and Webex Contact Center Operations</span>
              </div>

              <div className="flex justify-between items-end max-w-lg mx-auto pt-6 border-t border-gray-150">
                <div className="text-left font-serif">
                  <div className="border-b border-gray-200 w-32 pb-0.5 text-center text-xs italic text-slate-700">Digital Seal Verified</div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block mt-1">Verification Authority</span>
                </div>
                <Award className="w-12 h-12 text-blue-755" />
                <div className="text-right font-serif">
                  <div className="border-b border-gray-200 w-32 pb-0.5 text-center text-xs text-slate-705">{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block mt-1">Accredited Date</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center text-red-800 text-xs font-semibold">
              ⚠️ Note: You need at least <strong>4 out of 5 correct Answers</strong> to generate your administrative certificate credentials. Refresh your knowledge in the Manual section and try again!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
