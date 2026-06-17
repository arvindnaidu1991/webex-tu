/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chapter, CCBlock } from '../types';

export function generateDocxContent(
  selectedChapters: Chapter[],
  generatorOptions: {
    includeTitlePage: boolean;
    includeTOC: boolean;
    companyName: string;
    authorName: string;
    includeCLITemplates: boolean;
    inputCLI?: {
      hostname: string;
      wanInterface: string;
      webexUri: string;
      internalSubnet: string;
      dialPattern: string;
    };
    includeCCFlowTemplate: boolean;
    ccFlowBlocks?: CCBlock[];
    includeTroubleshootingScenarios: boolean;
  }
): string {
  const {
    includeTitlePage,
    includeTOC,
    companyName,
    authorName,
    includeCLITemplates,
    inputCLI,
    includeCCFlowTemplate,
    ccFlowBlocks,
    includeTroubleshootingScenarios
  } = generatorOptions;

  const todayStr = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let html = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' 
      xmlns:w='urn:schemas-microsoft-com:office:word' 
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>Cisco Webex Production Systems Manual</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: 8.5in 11.0in;
      margin: 1.0in 1.0in 1.0in 1.0in;
    }
    body { 
      font-family: 'Calibri', 'Arial', sans-serif; 
      line-height: 1.6; 
      color: #333333; 
    }
    .title-page {
      text-align: center;
      padding: 100px 0;
      page-break-after: always;
    }
    .title-main {
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: 28pt;
      font-weight: bold;
      color: #0b3c5d;
      margin-top: 40px;
      margin-bottom: 10px;
    }
    .subtitle {
      font-size: 16pt;
      color: #555555;
      margin-bottom: 60px;
    }
    .meta-box {
      margin-top: 150px;
      font-size: 11pt;
      color: #777777;
    }
    h1 { 
      font-family: 'Georgia', 'Times New Roman', serif; 
      color: #0b3c5d; 
      font-size: 20pt; 
      border-bottom: 2px solid #0b3c5d; 
      padding-bottom: 5px; 
      margin-top: 30pt; 
      margin-bottom: 12pt;
      page-break-before: always;
    }
    h2 { 
      font-family: 'Arial', 'Helvetica', sans-serif; 
      color: #328cc1; 
      font-size: 14pt; 
      margin-top: 18pt; 
      margin-bottom: 8pt; 
    }
    p { 
      margin-top: 0; 
      margin-bottom: 10pt; 
      font-size: 11pt; 
      text-align: justify;
    }
    ul, ol { 
      margin-top: 0; 
      margin-bottom: 10pt; 
      padding-left: 24px; 
    }
    li { 
      font-size: 11pt; 
      margin-bottom: 4px; 
    }
    table { 
      border-collapse: collapse; 
      width: 100%; 
      margin: 14pt 0; 
    }
    th { 
      background-color: #0b3c5d; 
      color: #ffffff;
      border: 1px solid #cccccc; 
      padding: 10px; 
      font-weight: bold; 
      font-family: 'Arial', sans-serif; 
      font-size: 10.5pt; 
      text-align: left; 
    }
    td { 
      border: 1px solid #cccccc; 
      padding: 9px; 
      font-family: 'Calibri', sans-serif; 
      font-size: 10.5pt; 
    }
    pre, code.cli { 
      background-color: #f4f4f4; 
      border-left: 4px solid #328cc1; 
      padding: 12px; 
      font-family: 'Consolas', 'Courier New', monospace; 
      font-size: 9.5pt; 
      margin: 14pt 0; 
      white-space: pre-wrap; 
      word-break: break-all;
    }
    .diagram-card {
      background-color: #f0f7f9;
      border: 1px dashed #328cc1;
      padding: 15px;
      margin: 12pt 0;
      border-radius: 4px;
    }
    .diagram-caption {
      font-weight: bold;
      color: #0b3c5d;
      font-size: 10pt;
      margin-bottom: 6px;
      font-family: 'Arial', sans-serif;
    }
    .diagram-description {
      font-style: italic;
      color: #555555;
      font-size: 9.5pt;
    }
    .toc-section {
      page-break-after: always;
      margin-bottom: 30px;
    }
    .toc-title {
      font-family: 'Georgia', serif;
      font-size: 18pt;
      color: #0b3c5d;
      margin-bottom: 15px;
      border-bottom: 1px solid #cccccc;
      padding-bottom: 4px;
    }
    .toc-link {
      font-size: 11pt;
      margin-bottom: 6px;
      color: #333333;
    }
  </style>
</head>
<body>
`;

  // 1. Title Page
  if (includeTitlePage) {
    html += `
    <div class="title-page">
      <div style="font-size: 11pt; letter-spacing: 2px; text-transform: uppercase; color: #777777; margin-top: 50px;">Cisco Collaboration Reference Library</div>
      <div class="title-main">WEBEX MASTER SYSTEMS &<br/>ADMINISTRATION PORTFOLIO</div>
      <div style="width: 80px; height: 3px; background-color: #328cc1; margin: 20px auto;"></div>
      <div class="subtitle">Complete Technical Guide for Calling, Contact Center, and Enterprise Deployments</div>
      
      <div class="meta-box">
        <p><strong>Prepared for:</strong> ${companyName || 'Lead Enterprise Network Operations'}</p>
        <p><strong>Author:</strong> ${authorName || 'Lead Enterprise Voice Architect'}</p>
        <p><strong>Date of Publication:</strong> ${todayStr}</p>
        <p><strong>Environment Coverage:</strong> Multi-Tenant Cloud, On-Premises CUCM, Hybrid Gateway Solutions</p>
      </div>
    </div>
    `;
  }

  // 2. Table of Contents
  if (includeTOC) {
    html += `
    <div class="toc-section">
      <div class="toc-title">Table of Chapters and Technical Sections</div>
      <p style="font-style: italic; color: #666666; margin-bottom: 15px;">The following outline presents the complete structured reference guides included inside this production workbook:</p>
    `;
    
    let chapIndex = 1;
    selectedChapters.forEach((ch) => {
      html += `<div class="toc-link"><strong>Chapter ${chapIndex}: ${ch.title}</strong></div>`;
      ch.sections.forEach((sec) => {
        html += `<div class="toc-link" style="padding-left: 20px;">— ${sec.title}</div>`;
      });
      chapIndex++;
    });

    if (includeCLITemplates) {
      html += `<div class="toc-link"><strong>Technical Annex A: Custom CUBE Local Gateway (LGW) CLI Configuration Template</strong></div>`;
    }
    if (includeCCFlowTemplate) {
      html += `<div class="toc-link"><strong>Technical Annex B: Webex Contact Center (WxCC) Custom Routing Logic Flow Chart</strong></div>`;
    }
    if (includeTroubleshootingScenarios) {
      html += `<div class="toc-link"><strong>Technical Annex C: Production Voice Quality Metrics and Troubleshooting Procedures</strong></div>`;
    }

    html += `</div>`;
  }

  // 3. Chapters
  selectedChapters.forEach((ch) => {
    html += `<h1>${ch.title}</h1>`;
    html += `<p style="font-size: 11.5pt; font-style: italic; color: #555555; margin-bottom: 18pt;">${ch.subtitle}</p>`;

    ch.sections.forEach((sec) => {
      html += `<h2>${sec.title}</h2>`;
      html += `<p>${sec.content}</p>`;

      if (sec.bullets && sec.bullets.length > 0) {
        html += `<ul>`;
        sec.bullets.forEach((b) => {
          html += `<li>${b}</li>`;
        });
        html += `</ul>`;
      }

      if (sec.tables) {
        html += `<table><thead><tr>`;
        sec.tables.headers.forEach((h) => {
          html += `<th>${h}</th>`;
        });
        html += `</tr></thead><tbody>`;
        sec.tables.rows.forEach((row) => {
          html += `<tr>`;
          row.forEach((cell) => {
            html += `<td>${cell}</td>`;
          });
          html += `</tr>`;
        });
        html += `</tbody></table>`;
      }

      if (sec.cliEx) {
        html += `<div style="font-family: Arial, sans-serif; font-size: 9.5pt; font-weight: bold; color: #555555; margin-top: 10px;">IOS-XE CLI Reference Commands:</div>`;
        html += `<pre>${sec.cliEx}</pre>`;
      }

      if (sec.diagramMermaid) {
        html += `
        <div class="diagram-card">
          <div class="diagram-caption">System Network Flow Diagram:</div>
          <div class="diagram-description">
            <p style="font-style: italic; font-size: 10pt; color: #444444; margin-bottom: 4px;">For visual documentation (Recreate using Microsoft Visio or Draw.io based on this core path):</p>
            <pre style="background: #ffffff; border: 1px solid #dddddd; padding: 6px; font-size: 8.5pt;">${sec.diagramMermaid}</pre>
          </div>
        </div>
        `;
      }
    });
  });

  // 4. Custom CLI Annex
  if (includeCLITemplates && inputCLI) {
    const { hostname, wanInterface, webexUri, internalSubnet, dialPattern } = inputCLI;
    html += `
    <h1>Technical Annex A: Custom CUBE Local Gateway (LGW) CLI Configuration</h1>
    <p>This section outlines the custom production configuration generated dynamically for your enterprise network topologies. Ensure you verify IP bindings and route tables prior to terminal deployment.</p>
    
    <h2>Device Hostname: ${hostname || 'Chicago-CUBE-01'}</h2>
    <p>Use the following IOS-XE configuration payload to establish the Secure SIP-over-TLS Trunk bridge with the Cisco Webex Calling cloud PoPs:</p>
    
    <pre>
! #########################################################
! Enterprise Gateway Configuration for Webex Calling Trunking
! Generated on: ${todayStr}
! #########################################################
hostname ${hostname || 'Chicago-CUBE-01'}
!
ip routing
!
ntp server 129.6.15.28 prefer
!
voice service voip
 ip address trusted list
  ipv4 0.0.0.0 0.0.0.0  ! Adjust this in production to bind with designated Webex subnet boundaries
 allow-connections sip to sip
 sip
  bind control source-interface ${wanInterface || 'GigabitEthernet1'}
  bind media source-interface ${wanInterface || 'GigabitEthernet1'}
  header-passing
  error-passthru
  registrar server
!
crypto pki trustpoint WX-CLOUD-TRUST
 enrollment terminal
 fqdn ${hostname || 'Chicago-CUBE-01'}.company.com
 subject-name CN=${hostname || 'Chicago-CUBE-01'}.company.com, O=Enterprise
 revocation-check none
 rsakeypair CUBE-KEY 2048
!
! Outbound Voice Path Mapping
dial-peer voice 100 voip
 description OUTBOUND_TO_WEBEX_PSTN
 destination-pattern ${dialPattern || '+1...T'}
 session protocol sipv2
 session target dns:${webexUri || 'us-east.webex.com'}
 session transport tcp tls
 voice-class sip options-keepalive
 dtmf-relay rtp-nte
 codec g711ulaw
 no vad
!
! Local Inbound Routing Map
dial-peer voice 200 voip
 description INBOUND_FROM_LAN
 incoming called-number .T
 session protocol sipv2
 voice-class sip options-keepalive
 dtmf-relay rtp-nte
 codec g711ulaw
    </pre>
    `;
  }

  // 5. Custom CC Flow Annex
  if (includeCCFlowTemplate && ccFlowBlocks) {
    html += `
    <h1>Technical Annex B: Webex Contact Center (WxCC) Custom Routing Logic</h1>
    <p>This technical outline serves as the structural schema dictionary representing your interactive voice response (IVR) flows. Recreate these parameters inside the Webex Contact Center graphical script editor.</p>
    
    <table>
      <thead>
        <tr>
          <th>Block ID</th>
          <th>Flow Activity Class</th>
          <th>Configured Activity Details & Variables</th>
        </tr>
      </thead>
      <tbody>
    `;

    ccFlowBlocks.forEach((b) => {
      let details = '';
      if (b.type === 'schedule') {
        details = `Evaluates business schedule "${b.config.scheduleName || 'Mon-Fri 9-5'}". Branch to: OPEN -> ${b.config.openBlockId || 'Next Block'}, CLOSED -> ${b.config.closedBlockId || 'Hangup'}`;
      } else if (b.type === 'play_audio') {
        details = `Plays voice prompt: "${b.config.audioFile || 'welcome.wav'}". Points output to: ${b.config.nextBlockId || 'End'}`;
      } else if (b.type === 'queue_contact') {
        details = `Forwards callers to ACD cluster queue: "${b.config.queueName || 'Sales_Queue'}". Error routing goes to: ${b.config.errorBlockId || 'Hangup'}`;
      } else if (b.type === 'http_data_dip') {
        details = `Executes raw API callback web-hook to CRM database. Triggering HTTP ${b.config.method || 'GET'} to target url "${b.config.url || 'https://api.crm.com/client'}". Output variable parsed: CustomerLevel`;
      } else if (b.type === 'set_variable') {
        details = `Assigns contextual variable: "${b.config.variableName || 'UserPriority'}" values to "${b.config.variableValue || 'Gold'}"`;
      } else {
        details = `Initiates routine start initialization or standard voice session disconnect.`;
      }

      html += `
        <tr>
          <td><strong>${b.id.toUpperCase()}</strong></td>
          <td>${b.title} (${b.type.toUpperCase()})</td>
          <td>${details}</td>
        </tr>
      `;
    });

    html += `
      </tbody>
    </table>
    `;
  }

  // 6. Custom Troubleshooting Scenario Annex
  if (includeTroubleshootingScenarios) {
    html += `
    <h1>Technical Annex C: Production Voice Quality Metrics and Troubleshooting Procedures</h1>
    <p>Voice engineers must verify the connection environment has adequate headroom matching Cisco's enterprise standard KPIs. Use the diagnostics checklist below to check the infrastructure during performance alerts.</p>
    
    <h2>Enterprise Voice Severity Troubleshooting Checklist:</h2>
    <table>
      <thead>
        <tr>
          <th>Severity Status</th>
          <th>Symptom Verified</th>
          <th>Probable Cause Identified</th>
          <th>Technical Remediation Procedure</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Severity 1 - Critical</strong></td>
          <td>Total trunk failure. Calls rejected with "403 Forbidden" SIP errors.</td>
          <td>CUBE local certificates are expired or do not trust the Webex Security Authority chain.</td>
          <td>Run IOS-XE logs verify with <code>show crypto pki certificates</code>. Re-generate local CSR, upload client node configuration, and re-import Webex certificates trustpoint.</td>
        </tr>
        <tr>
          <td><strong>Severity 2 - Critical</strong></td>
          <td>Direct outbound voice calls drop precisely at the index of 30 seconds.</td>
          <td>Firewall SIP Application Layer Gateway (SIP ALG) or inspection profile is active, altering ACK response headers.</td>
          <td>Modify corporate security router policies. Run <code>no inspect sip</code> inside Cisco ASA policy definitions, or bypass local gateway inspection rules.</td>
        </tr>
        <tr>
          <td><strong>Severity 3 - Service Degraded</strong></td>
          <td>Caller reports robotic voices, audio gaps, and mechanical clicking sound.</td>
          <td>Excessive network jitter (>50ms) or drop in packet transport integrity (>3% packet loss).</td>
          <td>Identify bandwidth bottle-necks. Allocate standard Quality of Service (QoS) mappings. Run <code>priority list</code> and match DiffServ mappings to DSCP EF (Expedited Forwarding - Decimal 46) for audio streams.</td>
        </tr>
      </tbody>
    </table>
    `;
  }

  html += `
</body>
</html>
`;
  return html;
}

export function downloadDocFile(htmlContent: string, fileName: string = 'Webex_Production_Manual.doc') {
  const blob = new Blob(['\ufeff' + htmlContent], {
    type: 'application/msword;charset=utf-8'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
