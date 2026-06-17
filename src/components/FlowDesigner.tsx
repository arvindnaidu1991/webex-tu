/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CCBlock, CCBlockType } from '../types';
import { Play, Plus, Trash2, ArrowRight, Settings, PhoneIncoming, AlertCircle, Eye, Info } from 'lucide-react';

export default function FlowDesigner() {
  const [blocks, setBlocks] = useState<CCBlock[]>([
    {
      id: 'b1',
      type: 'start',
      title: 'Call Trigger',
      x: 30,
      y: 50,
      config: { nextBlockId: 'b2' }
    },
    {
      id: 'b2',
      type: 'schedule',
      title: 'Business Hours check',
      x: 180,
      y: 50,
      config: {
        scheduleName: 'Mon-Fri 9-5 Standard',
        openBlockId: 'b3',
        closedBlockId: 'b5'
      }
    },
    {
      id: 'b3',
      type: 'http_data_dip',
      title: 'CRM Data-Dip',
      x: 340,
      y: 50,
      config: {
        url: 'https://api.crm.com/v1/customer-priority',
        method: 'GET',
        nextBlockId: 'b4',
        errorBlockId: 'b4'
      }
    },
    {
      id: 'b4',
      type: 'queue_contact',
      title: 'Sales priority queue',
      x: 500,
      y: 50,
      config: {
        queueName: 'Gold_Escalation_Queue',
        errorBlockId: 'b6'
      }
    },
    {
      id: 'b5',
      type: 'play_audio',
      title: 'Play Closed message',
      x: 340,
      y: 190,
      config: {
        audioFile: 'OffHoursPrompt.wav',
        nextBlockId: 'b6'
      }
    },
    {
      id: 'b6',
      type: 'disconnect',
      title: 'Disconnect Session',
      x: 660,
      y: 120,
      config: {}
    }
  ]);

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>('b2');
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [activeSimIndex, setActiveSimIndex] = useState<number>(-1);
  const [isSimulating, setIsSimulating] = useState(false);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  const handleUpdateConfig = (field: string, value: string) => {
    if (!selectedBlockId) return;
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id === selectedBlockId) {
          return {
            ...b,
            config: {
              ...b.config,
              [field]: value
            }
          };
        }
        return b;
      })
    );
  };

  const handleAddBlock = (type: CCBlockType) => {
    const newId = `b_${Date.now()}`;
    let title = '';
    let defaultConfig = {};

    switch (type) {
      case 'schedule':
        title = 'Business Schedule';
        defaultConfig = { scheduleName: 'Custom Hours', openBlockId: 'b6', closedBlockId: 'b6' };
        break;
      case 'play_audio':
        title = 'Play Audio Prompt';
        defaultConfig = { audioFile: 'GenericAudio.wav', nextBlockId: 'b6' };
        break;
      case 'queue_contact':
        title = 'ACD Agent Queue';
        defaultConfig = { queueName: 'General_Support_Queue', errorBlockId: 'b6' };
        break;
      case 'http_data_dip':
        title = 'CRM DB Dip';
        defaultConfig = { url: 'https://api.crm.com/user', method: 'GET', nextBlockId: 'b6', errorBlockId: 'b6' };
        break;
      case 'set_variable':
        title = 'Assign Priority Value';
        defaultConfig = { variableName: 'UserTier', variableValue: 'Silver', nextBlockId: 'b6' };
        break;
      case 'disconnect':
        title = 'Disconnect Session';
        defaultConfig = {};
        break;
    }

    const newBlock: CCBlock = {
      id: newId,
      type,
      title,
      x: 400,
      y: 100,
      config: defaultConfig
    };

    setBlocks((prev) => [...prev, newBlock]);
    setSelectedBlockId(newId);
  };

  const handleDeleteBlock = (id: string) => {
    if (id === 'b1') return; // Cannot delete start block
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId('b1');
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationLogs([]);
    setActiveSimIndex(0);

    const logs: string[] = [
      '⚡ [SIP Trigger] Call session identified at Webex Contact Center DID Entry Point mapping.',
      '🔍 [Schedule Check] Evaluating business calendar: "Mon-Fri 9-5 Standard"... Matches current active system working hours (OPEN path triggered).',
      '💬 [HTTP REST Dip] Requesting customer level details for Caller ID 312-555-0199 via HTTPS endpoints...',
      '📥 [Data Parsed] CRM database returned client tier level: "Gold VIP". Saving variables.',
      '🎧 [SBR Queuing] Forwarding customer to "Gold_Escalation_Queue". System music on hold triggered.',
      '🎉 [Agent Linked] Idle agent identified matching highest Language-English skill level. Connection completed.'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logs.length) {
        setSimulationLogs((prev) => [...prev, logs[currentStep]]);
        setActiveSimIndex(currentStep);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 1500);
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6" id="flow-designer-viewport">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-150 pb-4 mb-6">
        <div>
          <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase">Interactive Sandbox Workspace</span>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1">Webex Contact Center Flow Designer</h1>
          <p className="text-slate-600 text-sm mt-1">
            Build and test IVR, Schedule checking and database CRM lookup routes.
          </p>
        </div>
        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="mt-3 md:mt-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center transition"
        >
          <Play className="w-4 h-4 mr-1.5" /> Simulate Routing Logic
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Side: Blocks Toolbox */}
        <div className="xl:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Flow Block Elements
          </h3>
          <div className="grid grid-cols-2 gap-2 bg-gray-50 border border-gray-200 p-3 rounded-xl">
            <button
              onClick={() => handleAddBlock('schedule')}
              className="bg-white border border-gray-200 hover:border-blue-500 text-slate-700 hover:text-blue-600 flex flex-col items-center justify-center p-3 rounded-xl transition text-center shadow-sm"
            >
              <Info className="w-5 h-5 mb-1.5 text-blue-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Schedule</span>
            </button>
            <button
              onClick={() => handleAddBlock('play_audio')}
              className="bg-white border border-gray-200 hover:border-blue-500 text-slate-700 hover:text-blue-600 flex flex-col items-center justify-center p-3 rounded-xl transition text-center shadow-sm"
            >
              <Settings className="w-5 h-5 mb-1.5 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Audio Prompt</span>
            </button>
            <button
              onClick={() => handleAddBlock('http_data_dip')}
              className="bg-white border border-gray-200 hover:border-blue-500 text-slate-700 hover:text-blue-600 flex flex-col items-center justify-center p-3 rounded-xl transition text-center shadow-sm"
            >
              <Plus className="w-5 h-5 mb-1.5 text-teal-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">CRM Data-Dip</span>
            </button>
            <button
              onClick={() => handleAddBlock('queue_contact')}
              className="bg-white border border-gray-200 hover:border-blue-500 text-slate-700 hover:text-blue-600 flex flex-col items-center justify-center p-3 rounded-xl transition text-center shadow-sm"
            >
              <ArrowRight className="w-5 h-5 mb-1.5 text-purple-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">ACD Queue</span>
            </button>
          </div>

          {/* Active Block Configurator */}
          {selectedBlock ? (
            <div className="border border-gray-200 rounded-xl p-4 space-y-4 bg-gray-50">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="text-xs font-bold text-slate-800 uppercase flex items-center">
                  <Settings className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                  Element Parameters
                </span>
                {selectedBlock.id !== 'b1' && (
                  <button
                    onClick={() => handleDeleteBlock(selectedBlock.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Title</label>
                  <input
                    type="text"
                    value={selectedBlock.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBlocks((prev) =>
                        prev.map((b) => (b.id === selectedBlockId ? { ...b, title: val } : b))
                      );
                    }}
                    className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm"
                  />
                </div>

                {selectedBlock.type === 'schedule' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Calendar Schedule ID</label>
                    <input
                      type="text"
                      value={selectedBlock.config.scheduleName || ''}
                      onChange={(e) => handleUpdateConfig('scheduleName', e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm"
                    />
                  </div>
                )}

                {selectedBlock.type === 'play_audio' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Audio Prompt WAV File</label>
                    <input
                      type="text"
                      value={selectedBlock.config.audioFile || ''}
                      onChange={(e) => handleUpdateConfig('audioFile', e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm"
                    />
                  </div>
                )}

                {selectedBlock.type === 'queue_contact' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Target Skill Queue</label>
                    <input
                      type="text"
                      value={selectedBlock.config.queueName || ''}
                      onChange={(e) => handleUpdateConfig('queueName', e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm"
                    />
                  </div>
                )}

                {selectedBlock.type === 'http_data_dip' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Database API Endpoint URL</label>
                      <input
                        type="text"
                        value={selectedBlock.config.url || ''}
                        onChange={(e) => handleUpdateConfig('url', e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Request Method</label>
                      <select
                        value={selectedBlock.config.method || 'GET'}
                        onChange={(e) => handleUpdateConfig('method', e.target.value as any)}
                        className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm"
                      >
                        <option value="GET">GET (Query Records)</option>
                        <option value="POST">POST (Update Records)</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 text-center py-6 text-xs text-slate-400 rounded-xl">
              Click any element on the canvas to configure parameters.
            </div>
          )}
        </div>

        {/* Center & Right Flow Visual Workspace */}
        <div className="xl:col-span-3 space-y-4">
          <div className="bg-gray-50/50 rounded-xl p-6 min-h-[350px] border border-gray-200 relative overflow-x-auto flex flex-col justify-between">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 block uppercase absolute left-4 top-4">
              Flow Design Canvas
            </span>

            {/* Blocks Row Layout */}
            <div className="flex flex-wrap items-center justify-start gap-3 md:gap-4 my-auto py-10 relative">
              {blocks.map((block, idx) => {
                const isCurrentActive =
                  isSimulating &&
                  ((idx === 0 && activeSimIndex === 0) ||
                    (idx === 1 && activeSimIndex === 1) ||
                    (idx === 2 && activeSimIndex >= 2 && activeSimIndex <= 3) ||
                    (idx === 3 && activeSimIndex >= 4) ||
                    (idx === 4 && activeSimIndex === -2)); // inactive for standard test path

                return (
                  <React.Fragment key={block.id}>
                    <button
                      onClick={() => setSelectedBlockId(block.id)}
                      className={`min-w-[130px] border px-4 py-4 rounded-xl text-left font-sans transition-all shadow-sm relative focus:outline-none ${
                        selectedBlockId === block.id
                          ? 'bg-blue-50 border-blue-450 ring-2 ring-blue-500/10 text-slate-900'
                          : isCurrentActive
                          ? 'bg-blue-600 border-blue-600 ring-4 ring-blue-500/20 text-white animate-pulse'
                          : 'bg-white hover:bg-gray-50 border-gray-200 text-slate-800'
                      }`}
                    >
                      <span className={`text-[9px] font-bold block mb-1 uppercase tracking-wider ${isCurrentActive ? 'text-blue-100' : 'text-blue-600'}`}>
                        {block.type}
                      </span>
                      <h4 className="text-xs font-bold truncate">{block.title}</h4>

                      {/* Config Preview under block */}
                      <p className={`text-[9px] mt-1.5 truncate border-t pt-1.5 ${isCurrentActive ? 'text-blue-100 border-blue-500' : 'text-slate-400 border-gray-100'}`}>
                        {block.type === 'schedule' && (block.config.scheduleName || 'No config')}
                        {block.type === 'play_audio' && (block.config.audioFile || 'No config')}
                        {block.type === 'queue_contact' && (block.config.queueName || 'No config')}
                        {block.type === 'http_data_dip' && 'HTTPS API Target'}
                        {block.type === 'start' && 'Entry DID Match'}
                        {block.type === 'disconnect' && 'Standard Terminate'}
                      </p>
                    </button>

                    {idx < blocks.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-gray-400 shrink-0 mx-0.5" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Quick Status Legend */}
            <div className="flex gap-4 border-t border-gray-200 pt-4 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              <span className="flex items-center"><PhoneIncoming className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Start Caller DNIS</span>
              <span className="flex items-center"><Settings className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Evaluates Criteria</span>
              <span className="flex items-center"><AlertCircle className="w-3.5 h-3.5 mr-1.5 text-purple-500" /> Target Destinations</span>
            </div>
          </div>

          {/* Simulation Output Logger */}
          {simulationLogs.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center mb-1.5">
                <Eye className="w-4 h-4 mr-1.5 text-blue-600" />
                Live Routing Simulator logs:
              </h4>
              <div className="font-mono text-xs text-slate-600 space-y-1 bg-gray-50 p-3 border border-gray-150 rounded-lg max-h-[140px] overflow-y-auto">
                {simulationLogs.map((log, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-blue-600 font-bold shrink-0">{`[${(index + 1).toString().padStart(2, '0')}]`}</span>
                    <p className="text-slate-700">{log}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
