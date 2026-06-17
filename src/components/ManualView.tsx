/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Chapter, ChapterSection } from '../types';
import { Search, BookOpen, ChevronRight, FileText, CheckCircle, Copy, Code } from 'lucide-react';

interface ManualViewProps {
  chapters: Chapter[];
}

export default function ManualView({ chapters }: ManualViewProps) {
  const [selectedChapterId, setSelectedChapterId] = useState<string>(chapters[0].id);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);

  const selectedChapter = chapters.find((c) => c.id === selectedChapterId) || chapters[0];

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSectionId(id);
    setTimeout(() => setCopiedSectionId(null), 2000);
  };

  // Basic dictionary of Webex technical terms for quick administrative lookup
  const webexGlossary = [
    { term: 'Multi-Platform Phone (MPP)', definition: 'Cisco IP Phones (e.g. 7800, 8800 series) loaded with non-CUCM firmwares native to Open SIP cloud routing services.' },
    { term: 'CUBE (Cisco Unified Border Element)', definition: 'Session Border Controller (SBC) software in Cisco routers running IOS-XE for SIP-SIP translation, media bridging, and TLS termination.' },
    { term: 'Video Mesh Node', definition: 'Local conference proxy element keeping intra-office streams within the local network while maintaining call control in the cloud.' },
    { term: 'DNIS (Dialed Number Identification Service)', definition: 'The actual DID phone number dialed by the customer to contact WxCC queues.' },
    { term: 'ANI (Automatic Number Identification)', definition: 'Caller ID representing the caller\'s phone number, used for database lookups (data-dips).' },
    { term: 'RONA (Redirect on No Answer)', definition: 'A critical agent status triggered in WxCC when an agent fails to pick up a queued call within the SLA window.' },
    { term: 'Expressway C & E', definition: 'Security boundary servers for secure firewall traversal of mobile and home office Jabber/Webex endpoints without VPN requirements.' },
    { term: 'SIP ALG (Application Layer Gateway)', definition: 'Firewall helper filters that manipulate SIP headers. MUST be disabled for Webex Call stability to prevent dropped connections.' }
  ];

  const filteredGlossary = webexGlossary.filter(
    (g) =>
      g.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="webex-manual-view">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-4 text-slate-800 shadow-sm">
        <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4 flex items-center">
          <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
          Technical Manuals
        </h3>
        
        <div className="space-y-1 mb-6">
          {chapters.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setSelectedChapterId(ch.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 flex items-center justify-between border ${
                selectedChapterId === ch.id
                  ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                  : 'text-slate-500 hover:bg-gray-50 hover:text-slate-800 border-transparent'
              }`}
            >
              <span className="truncate pr-2">{ch.title.split(':')[0]}</span>
              <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${selectedChapterId === ch.id ? 'rotate-90' : ''}`} />
            </button>
          ))}
        </div>

        {/* Administration Glossaries */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h4 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-3">
            Quick Glossaries & Terms
          </h4>
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg text-xs py-2 pl-8 pr-3 text-slate-800 focus:outline-none focus:border-blue-500"
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          </div>
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
            {filteredGlossary.map((g, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg p-2.5 hover:border-gray-200 transition">
                <span className="text-xs font-semibold text-blue-700 block mb-1">{g.term}</span>
                <p className="text-[11px] text-slate-600 leading-relaxed text-justify">{g.definition}</p>
              </div>
            ))}
            {filteredGlossary.length === 0 && (
              <span className="text-xs text-slate-500 italic block text-center py-2">No matching terms found</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Chapter Guides Reader */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
          <div className="border-b border-gray-150 pb-4 mb-6">
            <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase">Active Study Guide</span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">{selectedChapter.title}</h1>
            <p className="text-slate-550 text-sm mt-1">{selectedChapter.subtitle}</p>
          </div>

          <div className="space-y-8">
            {selectedChapter.sections.map((sec) => (
              <div key={sec.id} className="border-l-2 border-blue-600 pl-4 py-1 space-y-3">
                <h3 className="text-lg font-bold tracking-tight text-slate-800 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-blue-600" />
                  {sec.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed text-justify">{sec.content}</p>

                {/* Bullets */}
                {sec.bullets && sec.bullets.length > 0 && (
                  <ul className="space-y-1.5 pl-4">
                    {sec.bullets.map((b, i) => (
                      <li key={i} className="text-slate-700 text-sm list-disc pl-1 leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tables */}
                {sec.tables && (
                  <div className="overflow-x-auto my-3 border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-slate-50">
                        <tr>
                          {sec.tables.headers.map((h, i) => (
                            <th key={i} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {sec.tables.rows.map((rowArr, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                            {rowArr.map((cell, colIndex) => (
                              <td key={colIndex} className="px-4 py-2 text-xs text-slate-650">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* CISCO IOS CLI Snippet */}
                {sec.cliEx && (
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-200 mt-3 relative group">
                    <div className="flex items-center justify-between text-xs text-slate-450 border-b border-slate-800 pb-2 mb-2">
                      <span className="flex items-center font-mono font-medium">
                        <Code className="w-3.5 h-3.5 mr-1 text-blue-400" /> CUBE CLI Configuration (IOS-XE)
                      </span>
                      <button
                        onClick={() => handleCopyCode(sec.cliEx || '', sec.id)}
                        className="text-blue-450 hover:text-blue-300 transition-colors flex items-center bg-slate-800/80 px-2 py-1 rounded text-[11px]"
                      >
                        {copiedSectionId === sec.id ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1 text-emerald-400" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 mr-1 text-blue-400" /> Copy CLI
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed select-all text-blue-300">
                      {sec.cliEx}
                    </pre>
                  </div>
                )}

                {/* Graphical Diagrams Placeholder Info */}
                {sec.diagramMermaid && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-3 text-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      System Diagram Blueprint (Copy into Mermaid Live Editor or use inside your Docx)
                    </span>
                    <pre className="font-mono text-[11px] text-slate-600 bg-white border border-gray-200 p-2.5 rounded overflow-x-auto">
                      {sec.diagramMermaid}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
