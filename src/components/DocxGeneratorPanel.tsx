/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Chapter } from '../types';
import { generateDocxContent, downloadDocFile } from '../utils/docxExporter';
import { FileDown, CheckSquare, Square, Settings2, FileText, CheckCircle } from 'lucide-react';

interface DocxGeneratorPanelProps {
  chapters: Chapter[];
}

export default function DocxGeneratorPanel({ chapters }: DocxGeneratorPanelProps) {
  const [selectedChaptersMap, setSelectedChaptersMap] = useState<Record<string, boolean>>({
    ch1: true,
    ch2: true,
    ch3: true,
    ch4: true,
    ch5: true,
    ch6: true
  });

  const [companyName, setCompanyName] = useState('Enterprise Network Operations');
  const [authorName, setAuthorName] = useState('Lead Collaboration Systems Architect');
  const [includeCover, setIncludeCover] = useState(true);
  const [includeTOC, setIncludeTOC] = useState(true);
  const [includeCLI, setIncludeCLI] = useState(true);
  const [includeCC, setIncludeCC] = useState(true);
  const [includeChecklist, setIncludeChecklist] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const toggleChapter = (id: string) => {
    setSelectedChaptersMap((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleExport = () => {
    // Collect selected chapters
    const activeChaps = chapters.filter((ch) => selectedChaptersMap[ch.id]);

    const wordHtml = generateDocxContent(activeChaps, {
      includeTitlePage: includeCover,
      includeTOC: includeTOC,
      companyName: companyName,
      authorName: authorName,
      includeCLITemplates: includeCLI,
      inputCLI: {
        hostname: 'Chicago-CUBE-01',
        wanInterface: 'GigabitEthernet1',
        webexUri: 'us-east.webex.com',
        internalSubnet: '10.12.0.0 255.255.0.0',
        dialPattern: '+1...T'
      },
      includeCCFlowTemplate: includeCC,
      ccFlowBlocks: [
        { id: 'b1', type: 'start', title: 'Call Trigger', x: 0, y: 0, config: {} },
        { id: 'b2', type: 'schedule', title: 'Business Hours check', x: 0, y: 0, config: { scheduleName: 'Mon-Fri 9-5 Standard' } },
        { id: 'b3', type: 'http_data_dip', title: 'CRM Data-Dip', x: 0, y: 0, config: { url: 'https://api.crm.com/user', method: 'GET' } },
        { id: 'b4', type: 'queue_contact', title: 'Sales Priority Queue', x: 0, y: 0, config: { queueName: 'Gold_Escalation_Queue' } }
      ],
      includeTroubleshootingScenarios: includeChecklist
    });

    const formatFileName = `${companyName.toLowerCase().replace(/\s+/g, '_')}_webex_master_manual.doc`;
    downloadDocFile(wordHtml, formatFileName);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6" id="docx-generator-control-panel">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-150 pb-4 mb-6">
        <div>
          <span className="text-xs font-semibold text-blue-650 tracking-wider uppercase">Document Bundler Utility</span>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1">Microsoft Word Manual Exporter</h1>
          <p className="text-slate-600 text-sm mt-1">
            Re-package chapter selections, custom network parameters, and diagram blueprints into organized corporate .doc files.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Document metadata & cover settings */}
        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-405 uppercase tracking-widest flex items-center">
              <Settings2 className="w-4 h-4 mr-1.5 text-blue-600" /> Cover Page Accoutrements
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Author Name / Title</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2 border-t border-gray-200 pt-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Include structural features:</span>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCover}
                    onChange={(e) => setIncludeCover(e.target.checked)}
                    className="mr-1.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  Cover Page
                </label>
                <label className="flex items-center text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTOC}
                    onChange={(e) => setIncludeTOC(e.target.checked)}
                    className="mr-1.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  Table of Contents
                </label>
                <label className="flex items-center text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCLI}
                    onChange={(e) => setIncludeCLI(e.target.checked)}
                    className="mr-1.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  CLI Commands Annex
                </label>
                <label className="flex items-center text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCC}
                    onChange={(e) => setIncludeCC(e.target.checked)}
                    className="mr-1.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  WxCC IVR Flow Map
                </label>
                <label className="flex items-center text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeChecklist}
                    onChange={(e) => setIncludeChecklist(e.target.checked)}
                    className="mr-1.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  Troubleshoot Matrices
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accompanying Content Chapters</h3>
            <div className="space-y-2 max-h-[240px] overflow-y-auto border border-gray-150 rounded-xl p-3 scrollbar-thin bg-white">
              {chapters.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => toggleChapter(ch.id)}
                  className="w-full flex items-center justify-between text-left p-2.5 border border-gray-150 hover:bg-gray-50 rounded-lg text-xs transition bg-white"
                >
                  <div className="flex items-center gap-2.5">
                    {selectedChaptersMap[ch.id] ? (
                      <CheckSquare className="w-4 h-4 text-blue-650 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold text-slate-800">{ch.title}</span>
                      <p className="text-[10px] text-slate-400 truncate max-w-sm mt-0.5">{ch.subtitle}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action column & information block */}
        <div className="flex flex-col justify-between py-2 space-y-4">
          <div className="bg-blue-50/45 border border-blue-200 rounded-2xl p-6 text-sm text-blue-950 leading-relaxed text-justify space-y-3">
            <h4 className="font-bold uppercase tracking-wider flex items-center text-blue-900">
              <FileText className="w-4.5 h-4.5 mr-2 text-blue-600" /> Document Output Quality
            </h4>
            <p className="text-xs text-slate-650 leading-relaxed">
              This generator leverages the specialized <strong>MS-Word HTML Application Schema</strong> to compile a clean, highly structured, table-formatted layout. It incorporates corporate color guidelines, pre-compiled IOS configurations, system outline parameters, and raw block matrices.
            </p>
            <p className="text-xs text-slate-650 leading-relaxed">
              When opened in Microsoft Word or Google Docs, the manual renders as a clean print document with professional typography pairings, grey background code fences, and full grid tables, preserving all structures.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleExport}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md active:translate-y-px transition flex items-center justify-center gap-2.5"
            >
              <FileDown className="w-5 h-5 text-blue-200" />
              Build & Download Systems Manual (.doc)
            </button>

            {downloadSuccess && (
              <div className="bg-emerald-50 border border-emerald-250 rounded-xl p-3 flex items-center text-xs text-emerald-800 animate-fade-in gap-2.5 font-bold">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Success! Your custom Microsoft Word systems manual has been compiled and downloaded successfully.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
