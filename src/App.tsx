/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { chaptersData } from './data/chaptersData';
import ManualView from './components/ManualView';
import CLIGenerator from './components/CLIGenerator';
import FlowDesigner from './components/FlowDesigner';
import Troubleshooter from './components/Troubleshooter';
import CertificationQuiz from './components/CertificationQuiz';
import DocxGeneratorPanel from './components/DocxGeneratorPanel';

import { 
  BookOpen, 
  Terminal, 
  Workflow, 
  Gauge, 
  GraduationCap, 
  FileDown, 
  Layers, 
  Activity, 
  KeyRound, 
  Network
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'manual' | 'cli' | 'flow' | 'diagnose' | 'quiz' | 'word'>('manual');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-900" id="webex-master-companion">
      {/* Upper Navigation / Title Branding bar */}
      <header className="bg-white border-b border-gray-200 text-slate-850 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-blue-700 text-white font-bold text-lg shadow-sm shrink-0">
              W
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight text-slate-800">Webex Systems Master Portal</h1>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded uppercase border border-blue-200 shrink-0">
                  v1.1.0 • Suite
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Cisco CUBE, Webex Calling, and Contact Center Administration & Training Engine
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-3 bg-gray-50 border border-gray-200 p-1.5 rounded-lg text-xs text-slate-600 font-sans">
            <div className="flex items-center px-2.5 py-1 border-r border-gray-200">
              <Layers className="w-3.5 h-3.5 mr-1.5 text-blue-600 shrink-0" /> On-Prem / Hybrid / Cloud
            </div>
            <div className="flex items-center px-1.5">
              <Activity className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" /> Gateway SLA: Active
            </div>
          </div>
        </div>

        {/* Tab Switching Menu */}
        <div className="border-t border-gray-200 bg-gray-100/50">
          <div className="max-w-7xl mx-auto px-4 md:px-6 flex scrollbar-none overflow-x-auto">
            <nav className="flex space-x-1 py-1.5">
              <button
                onClick={() => setActiveTab('manual')}
                className={`flex items-center px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shrink-0 border ${
                  activeTab === 'manual'
                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-gray-100/50 border-transparent'
                }`}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Technical Manuals
              </button>

              <button
                onClick={() => setActiveTab('cli')}
                className={`flex items-center px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shrink-0 border ${
                  activeTab === 'cli'
                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-gray-100/50 border-transparent'
                }`}
              >
                <Terminal className="w-4 h-4 mr-2" />
                CUBE CLI Builder
              </button>

              <button
                onClick={() => setActiveTab('flow')}
                className={`flex items-center px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shrink-0 border ${
                  activeTab === 'flow'
                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-gray-100/50 border-transparent'
                }`}
              >
                <Workflow className="w-4 h-4 mr-2" />
                WxCC Flow Sandbox
              </button>

              <button
                onClick={() => setActiveTab('diagnose')}
                className={`flex items-center px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shrink-0 border ${
                  activeTab === 'diagnose'
                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-gray-100/50 border-transparent'
                }`}
              >
                <Gauge className="w-4 h-4 mr-2" />
                Diagnostics Lab
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shrink-0 border ${
                  activeTab === 'quiz'
                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-gray-100/50 border-transparent'
                }`}
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Certification Quiz
              </button>

              <button
                onClick={() => setActiveTab('word')}
                className={`flex items-center px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shrink-0 border ${
                  activeTab === 'word'
                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-gray-100/50 border-transparent'
                }`}
              >
                <FileDown className="w-4 h-4 mr-2" />
                docx Generator
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Render Box */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8">
        {activeTab === 'manual' && <ManualView chapters={chaptersData} />}
        {activeTab === 'cli' && <CLIGenerator />}
        {activeTab === 'flow' && <FlowDesigner />}
        {activeTab === 'diagnose' && <Troubleshooter />}
        {activeTab === 'quiz' && <CertificationQuiz />}
        {activeTab === 'word' && <DocxGeneratorPanel chapters={chaptersData} />}
      </main>

      {/* App Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-slate-500 text-xs text-sans mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Enterprise Voice Operations. All rights reserved. Registered trademark of Cisco systems.</p>
          <div className="flex gap-4">
            <span className="flex items-center text-slate-400 font-bold tracking-wider uppercase text-[10px]">
              <KeyRound className="w-3.5 h-3.5 mr-1.5 text-blue-600 shrink-0" /> Security: Transport-Layer Encryption (TLS/SRTP)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
