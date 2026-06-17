/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TroubleScenario, SIPMessage } from '../types';
import { ShieldAlert, Activity, CheckCircle, HelpCircle, RefreshCcw, Wifi, Award, AlertTriangle, Eye } from 'lucide-react';

export default function Troubleshooter() {
  const scenarios: TroubleScenario[] = [
    {
      id: 'sc1',
      title: 'Trunk Fails with SIP 403 Forbidden Registration Alerts',
      difficulty: 'Expert',
      symptoms: 'A local gateway in Chicago is systematically blocked from completing its trunk registration with the Webex cloud PoPs. Trunk status inside Control Hub is "Offline".',
      metrics: {
        latency: 0,
        jitter: 0,
        packetLoss: 0,
        hasIssue: true,
        issueDescription: 'SIP Registrar Handshake failed'
      },
      sipMessages: [
        { from: 'CUBE-LGW', to: 'WEBEX-REGISTRAR', label: 'REGISTER', timestamp: '10:00:01.104', details: 'REGISTER sip:us-east.webex.com SIP/2.0\nVia: SIP/2.0/TLS 10.1.1.1:5061\nFrom: <sip:+13125550199@us-east.webex.com>\nTo: <sip:+13125550199@us-east.webex.com>\nCall-ID: reg-102928373-chicago\nCSeq: 101 REGISTER\nContact: <sip:+13125550199@10.1.1.1:5061;transport=tls>' },
        { from: 'WEBEX-REGISTRAR', to: 'CUBE-LGW', label: 'SIP/2.0 401 Unauthorized', timestamp: '10:00:01.320', details: 'SIP/2.0 401 Unauthorized\nVia: SIP/2.0/TLS 10.1.1.1:5061\nFrom: <sip:+13125550199@us-east.webex.com>\nTo: <sip:+13125550199@us-east.webex.com>\nCall-ID: reg-102928373-chicago\nCSeq: 101 REGISTER\nWWW-Authenticate: Digest realm="us-east.webex.com",nonce="abc-123"' },
        { from: 'CUBE-LGW', to: 'WEBEX-REGISTRAR', label: 'REGISTER (With Digest)', timestamp: '10:00:01.402', details: 'REGISTER sip:us-east.webex.com SIP/2.0\nVia: SIP/2.0/TLS 10.1.1.1:5061\nFrom: <sip:+13125550199@us-east.webex.com>\nTo: <sip:+13125550199@us-east.webex.com>\nCall-ID: reg-102928373-chicago\nCSeq: 102 REGISTER\nAuthorization: Digest username="+13125550199", realm="us-east.webex.com", nonce="abc-123", response="f332d183f..."' },
        { from: 'WEBEX-REGISTRAR', to: 'CUBE-LGW', label: 'SIP/2.0 403 Forbidden', timestamp: '10:00:01.611', details: 'SIP/2.0 403 Forbidden\nVia: SIP/2.0/TLS 10.1.1.1:5061\nFrom: <sip:+13125550199@us-east.webex.com>\nTo: <sip:+13125550199@us-east.webex.com>\nCall-ID: reg-102928373-chicago\nReason: Certificate Expired or Trust Chain Missing' }
      ],
      questions: {
        correctId: 'opt1_3',
        options: [
          { id: 'opt1_1', text: 'Increase the SIP Register expires timeout inside CUBE to 3600 seconds.', isCorrect: false, feedback: 'Timeout adjustments do not solve encryption handshakes blocked due to credential validation errors.' },
          { id: 'opt1_2', text: 'The router public IP is blocked. Raise a firewall request to open standard SIP UDP 5060.', isCorrect: false, feedback: 'Webex requires encrypted SIP-over-TLS (TCP 5061). Opening standard UDP 5060 is a dynamic security risk and does not solve authentication errors.' },
          { id: 'opt1_3', text: 'Verify router time synch and re-import root certificates trustpoint chain on CUBE (e.g. DigiCert/QuoVadis).', isCorrect: true, feedback: 'Exactly! TLS validation systematically drops authentication handshakes if the Router system clock deviates from certificate expirations, or if the root intermediate trustpoint chain lacks validity.' }
        ]
      }
    },
    {
      id: 'sc2',
      title: 'Active Voice Sessions Drop Systematically at 30 Seconds Index',
      difficulty: 'Expert',
      symptoms: 'Outbound and inbound calling paths establish perfectly with normal bi-directional audio. However, precisely at the index of 30 seconds of active conversation, the dial tone drops systematically.',
      metrics: {
        latency: 42,
        jitter: 4,
        packetLoss: 0,
        hasIssue: false,
        issueDescription: 'Traffic performance is pristine. Drops are signaling related.'
      },
      sipMessages: [
        { from: 'CUBE-LGW', to: 'WEBEX-CLOUD', label: 'INVITE (with G.711)', timestamp: '11:15:00.120', details: 'INVITE sip:+13125550123@webex.com SIP/2.0\nVia: SIP/2.0/TLS CUBE:5061\nFrom: <sip:+13125550199@us-east.webex.com>\nTo: <sip:+13125550123@webex.com>\nContent-Type: application/sdp\n\n(SDP Payload: G.711ulaw audio codec streams offered)' },
        { from: 'WEBEX-CLOUD', to: 'CUBE-LGW', label: 'SIP/2.0 200 OK', timestamp: '11:15:01.050', details: 'SIP/2.0 200 OK\nVia: SIP/2.0/TLS CUBE:5061\nContent-Type: application/sdp\n\n(SDP Payload: G.711 negotiated successfully)' },
        { from: 'CUBE-LGW', to: 'WEBEX-CLOUD', label: 'ACK (Never acknowledged by firewall)', timestamp: '11:15:01.090', details: 'ACK sip:+13125550123@webex.com SIP/2.0\nVia: SIP/2.0/TLS CUBE:5061\nCall-ID: call-8373364-chi' },
        { from: 'WEBEX-CLOUD', to: 'CUBE-LGW', label: 'SIP/2.0 BYE (Timeout waiting ACK)', timestamp: '11:15:31.092', details: 'BYE sip:+13125550199@CUBE:5061 SIP/2.0\nReason: ACK timeout (Never received by Webex after 30 seconds wait)' }
      ],
      questions: {
        correctId: 'opt2_2',
        options: [
          { id: 'opt2_1', text: 'Re-configure audio bindings. Change CUBE codec from G.711 to G.722 wideband.', isCorrect: false, feedback: 'Changing the codec is a media level action. The drop is a system signaling (session setup) timeout.' },
          { id: 'opt2_2', text: 'Disable SIP Inspection (SIP ALG) feature inside the Cisco ASA/Firepower edge firewall config.', isCorrect: true, feedback: 'Spot on! Firewalls containing SIP inspection filters dynamically monitor port fields. They modify transport headers in ACK packets incorrectly, which prevents Webex Cloud from recognizing CUBEs ACK payload, causing session BYE tear-down timeouts.' },
          { id: 'opt2_3', text: 'Run local command "shutdown" then "no shutdown" on the PRI trunk voice port T1 cards.', isCorrect: false, feedback: 'Bypassing voice ports is irrelevant since calls are actively linking and communicating prior to dropping.' }
        ]
      }
    },
    {
      id: 'sc3',
      title: 'Critical Robotic Jitter Alerting at Chicago HQ Office',
      difficulty: 'Intermediate',
      symptoms: 'A critical cohort of board-room employees report robotic voice quality, mechanical crackling sounds, and words failing to transmit during outbound Webex meetings.',
      metrics: {
        latency: 285,
        jitter: 82,
        packetLoss: 4.8,
        hasIssue: true,
        issueDescription: 'Quality thresholds breached. Critical Jitter & Packet loss.'
      },
      sipMessages: [
        { from: 'CUBE-LGW', to: 'WEBEX-MEDIAPOOL', label: 'RTP stream (G.711)', timestamp: '14:20:00.100', details: 'Real-time Transport Protocol\nPayload Type: G.711 PCMU\nSequence Number: 1042\nStream Source: 10.12.50.11' },
         { from: 'WEBEX-MEDIAPOOL', to: 'CUBE-LGW', label: 'RTCP receiver report', timestamp: '14:20:02.100', details: 'Real-time Transport Control Protocol\nJitter Alert: 82 milliseconds\nPacket Loss: 4.8% (out of sequence packets)' }
      ],
      questions: {
        correctId: 'opt3_1',
        options: [
          { id: 'opt3_1', text: 'Implement QoS (Quality of Service) mapping voice traffic to DSCP EF class-maps, and apply WAN egress policing.', isCorrect: true, feedback: 'Correct! Priortizing voice streams over computer workloads using DiffServ DSCP EF (Decimal value 46) ensures router interfaces queue audio packets first during high internet traffic congestion.' },
          { id: 'opt3_2', text: 'Bypass local dns. Map all regional CUBE dial-peers directly to raw Webex IP addresses.', isCorrect: false, feedback: 'DNS resolution controls session location mapping, it has zero impact on stream delivery drops inside local routes.' },
          { id: 'opt3_3', text: 'Re-install Webex Directory Connector on domain member server.', isCorrect: false, feedback: 'The Directory Connector handles identity registrations (user names and OUs), it is not located on physical media routing paths.' }
        ]
      }
    }
  ];

  const [activeScenId, setActiveScenId] = useState<string>('sc1');
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [scorePoints, setScorePoints] = useState<number>(0);
  const [visitedScens, setVisitedScens] = useState<string[]>([]);
  const [showSipMessageText, setShowSipMessageText] = useState<string | null>(null);

  const activeScenario = scenarios.find((s) => s.id === activeScenId) || scenarios[0];
  const isCorrectAnswer = selectedOptId === activeScenario.questions.correctId;

  const handleSelectOption = (optId: string) => {
    setSelectedOptId(optId);
    if (optId === activeScenario.questions.correctId && !visitedScens.includes(activeScenario.id)) {
      setScorePoints((prev) => prev + 100);
      setVisitedScens((prev) => [...prev, activeScenario.id]);
    }
  };

  const handleNextScenario = () => {
    setSelectedOptId(null);
    setShowSipMessageText(null);
    const currIdx = scenarios.findIndex((s) => s.id === activeScenId);
    if (currIdx < scenarios.length - 1) {
      setActiveScenId(scenarios[currIdx + 1].id);
    } else {
      setActiveScenId(scenarios[0].id);
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6" id="troubleshooting-workspace">
      {/* Top Banner Status bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-150 pb-4 mb-6">
        <div>
          <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase">Field Engineering Operations</span>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1">CUBE & Webex Signaling Field Lab</h1>
          <p className="text-slate-600 text-sm mt-1">
            Analyze packet captures, monitor diagnostic SLA targets, and troubleshoot real network outages.
          </p>
        </div>
        <div className="mt-3 md:mt-0 flex items-center bg-blue-50/50 border border-blue-200 text-blue-900 px-4 py-2.5 rounded-xl font-semibold text-sm shrink-0">
          <Award className="w-4.5 h-4.5 mr-2 text-blue-600" />
          <span>SLA Resolving Points: <strong className="text-blue-900">{scorePoints} EXP</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left/Middle Column Case details */}
        <div className="xl:col-span-2 space-y-6">
          <div className="border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm bg-gray-50/50">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                activeScenario.difficulty === 'Expert' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {activeScenario.difficulty} Class
              </span>
              <span className="text-xs font-semibold text-slate-400">Case Ticket #{activeScenario.id.toUpperCase()}</span>
            </div>

            <h2 className="text-lg font-bold text-slate-800 tracking-tight">{activeScenario.title}</h2>
            <p className="text-slate-600 text-sm leading-relaxed text-justify">{activeScenario.symptoms}</p>

            {/* Performance telemetry panel */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-white border border-gray-200 p-3 rounded-lg text-center shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Round-Trip Latency</span>
                <span className={`text-lg font-bold block mt-1 ${activeScenario.metrics.latency > 150 ? 'text-red-500' : 'text-slate-700'}`}>
                  {activeScenario.metrics.latency === 0 ? 'N/A' : `${activeScenario.metrics.latency} ms`}
                </span>
                <span className="text-[9px] text-slate-400 block mt-1">SLA Target &lt; 150ms</span>
              </div>
              <div className="bg-white border border-gray-200 p-3 rounded-lg text-center shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Jitter Standard</span>
                <span className={`text-lg font-bold block mt-1 ${activeScenario.metrics.jitter > 30 ? 'text-red-500' : 'text-slate-700'}`}>
                  {activeScenario.metrics.jitter === 0 ? 'N/A' : `${activeScenario.metrics.jitter} ms`}
                </span>
                <span className="text-[9px] text-slate-400 block mt-1">SLA Target &lt; 30ms</span>
              </div>
              <div className="bg-white border border-gray-200 p-3 rounded-lg text-center shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Packet Loss Rate</span>
                <span className={`text-lg font-bold block mt-1 ${activeScenario.metrics.packetLoss > 1.5 ? 'text-red-500' : 'text-slate-700'}`}>
                  {activeScenario.metrics.packetLoss === 0 ? '0.0%' : `${activeScenario.metrics.packetLoss}%`}
                </span>
                <span className="text-[9px] text-slate-400 block mt-1">SLA Target &lt; 1.0%</span>
              </div>
            </div>
          </div>

          {/* Practice Challenge & Multiple choices */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
              <HelpCircle className="w-4 h-4 mr-1.5 text-blue-600" />
              Diagnostic Decisions
            </h3>
            <p className="text-xs text-slate-500 italic">Select the corresponding correction action to restore voice paths to operational state:</p>
            
            <div className="space-y-3">
              {activeScenario.questions.options.map((opt) => {
                const isSelected = selectedOptId === opt.id;
                const isOptCorrect = opt.isCorrect;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full text-left p-3.5 border rounded-xl text-xs font-semibold leading-relaxed transition-all flex items-start gap-3 ${
                      isSelected
                        ? isOptCorrect
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-400/10'
                          : 'bg-red-50 border-red-400 text-red-900 ring-2 ring-red-400/10'
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-250 text-slate-750'
                    }`}
                  >
                    <span className="h-5 w-5 shrink-0 bg-white border border-gray-300 rounded-full flex items-center justify-center font-bold text-[10px] text-slate-600 select-none">
                      {isSelected ? (isOptCorrect ? '✓' : '✗') : '?'}
                    </span>
                    <div className="space-y-1 my-auto">
                      <p>{opt.text}</p>
                      {isSelected && (
                        <p className={`text-[11px] font-normal italic mt-1.5 leading-normal block text-justify ${isOptCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                          {opt.feedback}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedOptId && (
              <div className="flex justify-end pt-2 border-t border-gray-100">
                <button
                  onClick={handleNextScenario}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow transition"
                >
                  Retrieve Next Ticket
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Column: Dynamic SIP Ladder capture */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white min-h-[420px] flex flex-col justify-between shadow-md">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4 flex items-center">
                <Activity className="w-3.5 h-3.5 mr-1.5 text-blue-450" />
                SIP Signaling Protocol Ladder
              </span>

              {/* Ladder Visual List */}
              <div className="space-y-4 my-6 select-none">
                {activeScenario.sipMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    onClick={() => setShowSipMessageText(msg.details)}
                    className="group cursor-pointer border border-transparent hover:border-slate-800 p-1.5 rounded-lg hover:bg-slate-850 transition"
                  >
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono mb-1.5">
                      <span>{msg.from} → {msg.to}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    {/* The Visual Line Arrow */}
                    <div className="relative border-b border-dashed border-slate-800 my-1 py-1 flex items-center justify-center">
                      <span className="text-[10px] font-bold py-0.5 px-2 bg-slate-850 text-blue-400 rounded-full border border-slate-705 group-hover:bg-slate-700 transition">
                        {msg.label}
                      </span>
                      <span className="absolute right-0 top-[10px] border-solid border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-slate-700 group-hover:border-l-slate-500"></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Micro Details popover */}
            {showSipMessageText ? (
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2 mt-4 animate-fade-in animate-duration-200">
                <div className="flex items-center justify-between border-b border-slate-850 pb-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400 flex items-center">
                    <Eye className="w-3.5 h-3.5 mr-1" /> Raw SIP Header content
                  </span>
                  <button
                    onClick={() => setShowSipMessageText(null)}
                    className="text-[9px] text-slate-500 hover:text-slate-300"
                  >
                    Close
                  </button>
                </div>
                <pre className="font-mono text-[9.5px] leading-relaxed text-slate-300 overflow-x-auto whitespace-pre">
                  {showSipMessageText}
                </pre>
              </div>
            ) : (
              <span className="text-[10px] text-slate-500 italic text-center py-2 block">
                💡 Click any message line inside the diagram ladder to read the raw SIP/RTCP network headers.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
