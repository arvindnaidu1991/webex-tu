/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, FileCode, CheckCircle2, RefreshCw, AlertTriangle } from 'lucide-react';

export default function CLIGenerator() {
  const [hostname, setHostname] = useState('Chicago-CUBE-01');
  const [wanInterface, setWanInterface] = useState('GigabitEthernet1');
  const [webexUri, setWebexUri] = useState('us-east.webex.com');
  const [internalSubnet, setInternalSubnet] = useState('10.12.0.0 255.255.0.0');
  const [dialPattern, setDialPattern] = useState('+1...T');
  const [isCopied, setIsCopied] = useState(false);

  const generatedConfig = `! #########################################################
! Cisco IOS-XE CUBE Local Gateway (LGW) Configuration
! Optimized for Webex Calling Secure Trunks
! Generated: ${new Date().toLocaleDateString()}
! #########################################################
hostname ${hostname}
!
ip routing
!
! Synchronize clocks to prevent TLS handshake failure
ntp server 129.6.15.28 prefer
!
! Define Voice Service VoIP features
voice service voip
 ip address trusted list
  ipv4 ${internalSubnet.split(' ')[0]} ${internalSubnet.split(' ')[1] || '255.255.255.0'}
  ipv4 135.182.0.0 255.255.0.0      ! Webex IP Boundary
  ipv4 139.177.64.0 255.255.192.0   ! Webex IP Boundary
 allow-connections sip to sip
 sip
  bind control source-interface ${wanInterface}
  bind media source-interface ${wanInterface}
  header-passing
  error-passthru
  registrar server
!
! Establish Cryptographic Security & Certificates
crypto pki trustpoint WX-CLOUD-TRUST
 enrollment terminal
 fqdn ${hostname.toLowerCase()}.company.com
 subject-name CN=${hostname.toLowerCase()}.company.com, O=Enterprise
 revocation-check none
 rsakeypair WX-KEY-PAIR 2048
!
! Outbound Voice Trunk Rule pointing to Webex
dial-peer voice 100 voip
 description OUTGOING_TO_WEBEX_PSTN
 destination-pattern ${dialPattern}
 session protocol sipv2
 session target dns:${webexUri}
 session transport tcp tls
 voice-class sip options-keepalive
 dtmf-relay rtp-nte
 codec g711ulaw
 no vad
!
! Inbound VoIP Calls Rule from the Local Site
dial-peer voice 200 voip
 description INBOUND_FROM_LOCAL_LAN
 incoming called-number .T
 session protocol sipv2
 voice-class sip options-keepalive
 dtmf-relay rtp-nte
 codec g711ulaw
!`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedConfig);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const downloadConfigFile = () => {
    const blob = new Blob([generatedConfig], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${hostname}_webex_calling.cfg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setHostname('Chicago-CUBE-01');
    setWanInterface('GigabitEthernet1');
    setWebexUri('us-east.webex.com');
    setInternalSubnet('10.12.0.0 255.255.0.0');
    setDialPattern('+1...T');
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6" id="cli-configurator">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-150 pb-4 mb-6">
        <div>
          <span className="text-xs font-semibold text-blue-650 tracking-wider uppercase">Interactive CUBE Utility</span>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1">CUBE IOS-XE CLI Configurator</h1>
          <p className="text-slate-600 text-sm mt-1">
            Build production-ready Cisco Unified Border Element Local Gateway configurations.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 border border-gray-200 text-slate-700 bg-gray-50 hover:bg-gray-100 text-xs font-semibold rounded-lg transition-colors flex items-center"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Input Parameters Box */}
        <div className="xl:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Gateway Attributes
          </h3>
          <div className="space-y-3 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div>
              <label className="block text-xs font-semibold text-slate-705 mb-1">
                Router Hostname
              </label>
              <input
                type="text"
                value={hostname}
                onChange={(e) => setHostname(e.target.value)}
                className="w-full text-xs font-semibold text-slate-800 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition shadow-sm"
                placeholder="e.g. Chicago-CUBE-1"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-705 mb-1">
                WAN Bind Interface
              </label>
              <input
                type="text"
                value={wanInterface}
                onChange={(e) => setWanInterface(e.target.value)}
                className="w-full text-xs font-semibold text-slate-800 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition shadow-sm"
                placeholder="e.g. GigabitEthernet1"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-705 mb-1">
                Webex Calling Regional SIP URI
              </label>
              <select
                value={webexUri}
                onChange={(e) => setWebexUri(e.target.value)}
                className="w-full text-xs font-semibold text-slate-800 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition shadow-sm"
              >
                <option value="us-east.webex.com">US East (us-east.webex.com)</option>
                <option value="us-west.webex.com">US West (us-west.webex.com)</option>
                <option value="eu-central.webex.com">EU Central (eu-central.webex.com)</option>
                <option value="ap-east.webex.com">Asia Pacific (ap-east.webex.com)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-705 mb-1">
                Enterprise Internal Subnet Mask
              </label>
              <input
                type="text"
                value={internalSubnet}
                onChange={(e) => setInternalSubnet(e.target.value)}
                className="w-full text-xs font-semibold text-slate-800 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition shadow-sm"
                placeholder="e.g. 10.12.0.0 255.255.0.0"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-705 mb-1">
                PSTN Route Match Pattern
              </label>
              <input
                type="text"
                value={dialPattern}
                onChange={(e) => setDialPattern(e.target.value)}
                className="w-full text-xs font-semibold text-slate-800 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition shadow-sm"
                placeholder="e.g. +1...T"
              />
            </div>
          </div>

          <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4">
            <h4 className="text-xs font-bold text-amber-800 uppercase flex items-center mb-1">
              <AlertTriangle className="w-4 h-4 mr-1 text-amber-600" />
              Administrative Warning
            </h4>
            <p className="text-[11px] text-amber-700 leading-normal text-justify">
              Before running certificate enrollment or configuring dial-peers, do not forget to confirm both gateway time synchronization via local NTP source and public domain accessibility (DNS resolution).
            </p>
          </div>
        </div>

        {/* Generated Config Preview */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              IOS-XE Configuration commands
            </h3>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className={`text-xs px-3 py-1.5 font-semibold rounded-lg shadow-sm border transition flex items-center ${
                  isCopied
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-white hover:bg-gray-50 text-slate-700 border-gray-200'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 mr-1.5 ${isCopied ? 'text-emerald-600' : 'text-slate-400'}`} />
                {isCopied ? 'Copied' : 'Copy Commands'}
              </button>
              <button
                onClick={downloadConfigFile}
                className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-1.5 rounded-lg shadow-sm font-sans flex items-center transition"
              >
                <Download className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> Download .cfg
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 shadow-md text-slate-100 rounded-xl p-4 font-mono text-xs max-h-[500px] overflow-y-auto scrollbar-thin">
            <div className="flex items-center gap-2 mb-3 bg-slate-850 border-b border-slate-800 pb-3 font-semibold text-blue-450">
              <FileCode className="w-4 h-4 text-blue-500" />
              <span>{hostname}_webex_calling.cfg</span>
            </div>
            <pre className="whitespace-pre overflow-x-auto text-slate-200 pr-2 leading-relaxed">
              {generatedConfig}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
