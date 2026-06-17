import { Chapter } from '../types';

export const chaptersData: Chapter[] = [
  {
    id: 'ch1',
    title: 'Chapter 1: Deployment Architectures',
    subtitle: 'Transitioning and Designing Solutions across Cloud, On-Premises, and Hybrid environments',
    sections: [
      {
        id: 'ch1_1',
        title: '1.1 Cloud Architecture (Webex Calling & WxCC)',
        content: 'Cisco Webex is a globally distributed, cloud-native collaboration platform operating on Cisco-managed hyperscaler points of presence (PoPs). Client end-stations, including physical Multi-Platform Phones (MPP) and the soft-client Webex App, communicate natively via secure web protocols and SIP-over-TLS directly to the cloud edge.',
        bullets: [
          'Multi-Tenant Architecture: Consolidates network, hardware, and compute infrastructure with strict logical isolation via cryptographic access control list layers.',
          'Simplified Management: Shift of maintenance overhead (patches, vulnerability fixes, database replication) fully to Cisco Cloud Ops.',
          'Geo-Redundancy: Automated route failover across multiple regional Webex data centers running active-active services.'
        ],
        tables: {
          headers: ['Parameter', 'Responsibility', 'Data Storage Location'],
          rows: [
            ['Billing & Subscriptions', 'Cisco / Partner Portal', 'Webex Identity Services'],
            ['Configuration Platform', 'Control Hub Administrator', 'Cisco Global Databases'],
            ['Edge Call Control', 'Cloud Infrastructure Service', 'Distributed Regional PoPs']
          ]
        },
        diagramMermaid: `graph TD
  App[Webex App / MPP Phone] -->|WebSockets & TLS| Cloud[Cisco Webex Global Cloud]
  Cloud -->|CCP SIP Trunk| PSTN[Public Carrier PSTN]`
      },
      {
        id: 'ch1_2',
        title: '1.2 On-Premises Unified Communications (CUCM)',
        content: 'Enterprise deployment relying on local hardware nodes for local call forwarding, session routing, and user profiles. The primary engine is the Cisco Unified Communications Manager (CUCM), running within VMware ESXi environments on high-density Cisco Unified Computing System (UCS) servers.',
        bullets: [
          'High Resiliency: Independence from public cloud availability for internally placed calls.',
          'Granular Control: Full administrative capability over codec allocation, bandwidth thresholds, and dial plan variables.',
          'Hardware Infrastructure: Integration of physical PRI/T1 TDM cards, Analog VG gateways, and local survivability modules (SRST).'
        ],
        tables: {
          headers: ['Role Node', 'Component Name', 'Primary Function'],
          rows: [
            ['Publisher', 'CUCM Pub', 'Main write/read Database, config modifications sync'],
            ['Subscriber', 'CUCM Sub', 'Call processing engine, device registration and signaling'],
            ['Database Repl', 'IDS Engine', 'Dynamic replication across CUCM nodes via SQL sync']
          ]
        },
        diagramMermaid: `graph LR
  Phone[On-Prem IP Phone] -->|SCCP/SIP| CallAgent[CUCM Cluster]
  CallAgent -->|SIP Trunk| Router[CUBE Gateway]
  Router -->|ISDN PRI / SIP Trunk| PSTN[Carrier PSTN]`
      },
      {
        id: 'ch1_3',
        title: '1.3 Hybrid Deployment & Webex Video Mesh',
        content: 'The ideal bridge architecture for enterprises migrating slowly to the cloud or requiring extreme bandwidth saving. Local enterprise services talk to Webex cloud applications using secure HTTPS connectors, while the Video Mesh node acts as a local media helper.',
        bullets: [
          'Webex Video Mesh: Local media appliance (running on ESXi node) that intercepts high-bandwidth video/audio streams. If all participants in a Webex meeting are in the local Chicago office, the media stays local, eliminating 90%+ WAN bandwidth consumption. If an external partner joins, the node handles cloud cascades dynamically.',
          'Directory Connector: Syncs Microsoft Active Directory continuously via secure LDAP queries and HTTPS export to the cloud.',
          'Hybrid Security: Establishes a local Key Management Service (KMS), meaning keys used to encrypt/decrypt messages reside fully in the enterprise cleanroom.'
        ],
        diagramMermaid: `graph TD
  subgraph On-Premises Office
    Users[Local Meeting Users] -->|Media Streams| Mesh[Cisco Video Mesh Server]
  end
  subgraph Webex Cloud
    CloudMeeting[Cloud Meeting Stage]
  end
  Mesh -->|Single Cascade Link| CloudMeeting
  Users -.->|Signaling Only| CloudMeeting`
      }
    ]
  },
  {
    id: 'ch2',
    title: 'Chapter 2: Webex Calling & Trunk Integration',
    subtitle: 'Technical Execution, Local Gateway (LGW) CLI, and Dial-Peer Architecture',
    sections: [
      {
        id: 'ch2_1',
        title: '2.1 Local Gateway (LGW) CUBE Architecture',
        content: 'For companies keeping their existing carrier SIP Trunks or ISDN lines, a Cisco router (ISR 4000 or Catalyst 8000) is deployed as a Local Gateway running Cisco Unified Border Element (CUBE) software. This performs double-sided protocol translation, SIP Header normalization, and media transcoding.',
        bullets: [
          'Session Border Control (SBC): Standard router configurations are insufficient. Active CUBE licensing (cube-red, cube-std) is required for IP-to-IP session bridging.',
          'TLS Security Mapping: Webex uses SIP-over-TLS (port 5061) with SRTP media payload. CUBE must accept TLS, decrypt it, and translate it to UDP-TCP (port 5060) or standard RTP with the local PSTN carrier.'
        ],
        cliEx: `! Enable CUBE routing & allow SIP-to-SIP calls
voice service voip
 ip address trusted list
  ipv4 135.182.0.0 255.255.0.0
  ipv4 139.177.64.0 255.255.192.0
 allow-connections sip to sip
 sip
  bind control source-interface GigabitEthernet1
  bind media source-interface GigabitEthernet1
  header-passing
  error-passthru`
      },
      {
        id: 'ch2_2',
        title: '2.2 Cryptographic Security & Root Certificates trustpoint',
        content: 'Webex will block the trunk unless the Router uses TLS handshake encryption with a trusted public CA certificate. The system clock MUST be synchronized utilizing Net Time Protocol (NTP) before generating cryptographic keys, as certificate handshakes validate system UTC time boundaries.',
        bullets: [
          'NTP Synchronization: If CUBE time deviates > 30 seconds from UTC, the SSL/TLS handshake terminates with a crypt-alert.',
          'Trustpoint Allocation: Create a dedicated PKI trustpoint for Cisco/Webex Root and Intermediate CAs, importing base64 public certificates from DigiCert or IdenTrust.'
        ],
        cliEx: `! Set NTP Server to secure internal source
ntp server 129.6.15.28 prefer
!
! Define Trustpoint to request local router certificate
crypto pki trustpoint WAN-CUBE-CERT
 enrollment terminal
 fqdn gateway.chicago.company.com
 subject-name CN=gateway.chicago.company.com, O=Enterprise
 revocation-check none
 rsakeypair CUBE-KEY 2048
!
! To apply: type 'crypto pki enroll WAN-CUBE-CERT' and copy CSR to authority.`
      },
      {
        id: 'ch2_3',
        title: '2.3 dial-peer Inbound/Outbound Logic',
        content: 'Cisco IOS-XE reads the dialed digits (or the SIP To: header URI) and matches it to a prioritized dial-peer. A clean routing design must contain separate inbound and outbound rules, assigning appropriate codecs (G.711 or G.722) and session transport layer details.',
         bullets: [
          'Session Target: Explicitly designates the DNS targets of Webex Calling Regional Addresses (e.g., Chicago, Frankfort, Tokyo).',
          'Keepalives: Ensure Options Keepalives are designated inside the outbound dial-peer to periodically query endpoint state.'
        ],
        cliEx: `! dial-peer outbound to Webex Cloud Services
dial-peer voice 4001 voip
 description OUTBOUND_TO_WEBEX_CLOUD
 destination-pattern +1[2-9]..[2-9]......
 session protocol sipv2
 session target dns:us-east.webex.com
 session transport tcp tls
 voice-class sip options-keepalive
 dtmf-relay rtp-nte
 codec g711ulaw
 no vad`
      }
    ]
  },
  {
    id: 'ch3',
    title: 'Chapter 3: Webex Contact Center (WxCC)',
    subtitle: 'Cloud IVR Systems, Skill-Based Routing, and Agent Workflows',
    sections: [
      {
        id: 'ch3_1',
        title: '3.1 Tenants, Entry Points & Routing Strategies',
        content: 'Webex Contact Center is structured horizontally across Tenants. A tenant is your distinct secure CC boundary in Cisco Cloud, consisting of all your routing parameters, integrations, and performance scripts.',
        bullets: [
          'Entry Point / DNIS: The physical public-facing DID number mapped to Call Center routing. This acts as the incoming trigger trigger.',
          'Routing Strategy: Binds the Entry Point to a custom logical workflow (Flow) on a scheduled map (Business hours schedule).',
          'Queues: Consolidates waiting contacts. Calls in a queue play music on hold and wait for an matching active agent.'
        ],
        tables: {
          headers: ['CC Concept', 'Config Level', 'Description'],
          rows: [
            ['Entry Point', 'Tenant Global', 'The entry phone number, chat link, or email inbox.'],
            ['Routing Strategy', 'Active-Schedule', 'Directs entry contacts based on calendar parameters.'],
            ['Queue Container', 'Agent-Group', 'A queue mapped to standard or specialized agent pools.']
          ]
        },
        diagramMermaid: `graph TD
  EP[Entry Point DID: 800-555-0100] -->|Strategy Match| Flow[Flow: Main Sales Strategy]
  Flow -->|Query Database| VIPCheck{Is VIP?}
  VIPCheck -->|Yes| GoldQueue[Gold Priority Queue]
  VIPCheck -->|No| StandardQueue[Standard Queue]`
      },
      {
        id: 'ch3_2',
        title: '3.2 Flow Development & Data-Dips (HTTP Integrations)',
        content: 'Advanced routing builds upon the integration of customer records during IVR. The WxCC Flow Designer features an HTTP request block that queries back-end business tools (CRMs, SQL DBs, web hooks) asynchronously.',
        bullets: [
          'Data-Dip: Initiates an HTTPS GET/POST query passing variables like caller extension or ANI (Calling Line ID).',
          'Variable Parsing: Captures JSON responses (e.g., customer account tier, outstanding invoice flag) and stores variables in the context (e.g., String value CustomerTier).',
          'Conditional Routing: Branches the call flow dynamically based on the parsed customer tier.',
          'Ensure Error handling links map out of every database transaction to fallback targets in case of lookup timeout.'
        ]
      },
      {
        id: 'ch3_3',
        title: '3.3 Skill-Based Routing (SBR) Setup',
        content: 'Classic ACD solutions route contacts to Agent Groups. SBR changes this by separating agents from direct static lists, and assigning individual skills with scoring values (1 to 10) to each agent.',
        bullets: [
          'Skills Matrix: Create skill names like "ProductKnowledge-Cloud", "Language-Spanish", or "EscalationAuthority".',
          'Agent Profiling: An Agent represents an identity. Edit an agent ID and assign skills values: Spanish = 10, Cloud = 7.',
          'Preemptive Targeting: The routing logic targets spanish callers to agents with Language-Spanish >= 8 first. If non-responsive, it degrades the target threshold value dynamically.'
        ]
      }
    ]
  },
  {
    id: 'ch4',
    title: 'Chapter 4: Hybrid Identity & Calendar Integration',
    subtitle: 'Connecting LDAP Directories and Exchange Web Services for Enterprise Platforms',
    sections: [
      {
        id: 'ch4_1',
        title: '4.1 Cisco Directory Connector Integration',
        content: 'The Directory Connector synchronizes enterprise AD structures with Webex Identity Services. This application executes read-only LDAP/LDAPS queries locally and compiles HTTPS JSON payload revisions for the Control Hub cloud database API.',
        bullets: [
          'Single Authority: AD serves as the source of truth. Creation of a user in AD generates an account; disabling the user disables Webex access.',
          'Attributes Sync: Synchronize specified attributes to format user entities (username, email, mobile, department, organization group).',
          'Required Account Permissions: The Windows service account running Directory Connector requires read permissions on target Active Directory OUs.'
        ],
        tables: {
          headers: ['Active Directory Attribute', 'Directory Connector Map', 'Webex Control Hub Entity'],
          rows: [
            ['mail (Primary)', 'Unique ID & Email', 'Username / Primary Profile Email'],
            ['givenName', 'First Name', 'User First Name'],
            ['sn', 'Last Name', 'User Last Name'],
            ['telephoneNumber', 'Business phone', 'Work Number, optional Caller ID assignment']
          ]
        },
        diagramMermaid: `graph LR
  AD[Active Directory Domain Controller] -->|LDAPS Port 636| DirCon[Cisco Directory Connector Server]
  DirCon -->|HTTPS Port 443| Cloud[Webex Control Hub ID Manager]`
      },
      {
        id: 'ch4_2',
        title: '4.2 Hybrid Calendar Integration & OBTP Logic',
        content: 'High-level conferencing leverages calendar reservation systems. Webex connects directly to Office 365, Google Workspace, or local Microsoft Exchange clusters to automatically sync room allocations.',
        bullets: [
          'Application Impersonation: Under local Exchange, a secure service account is provisioned with narrow impersonation rights to query specified calendar objects.',
          'One Button To Push (OBTP): The room system queries its local schedule. If an invitation is detected containing "@webex" or "@meet" inside the location field, the room system parses the SIP URI and displays the green "Join" button.',
          'Meeting Target parsing: @webex leverages the meeting organizers personal room URI; @meet triggers the ad-hoc space generator.'
        ]
      }
    ]
  },
  {
    id: 'ch5',
    title: 'Chapter 5: Firewall & Network Security policy',
    subtitle: 'Ports, Routing Protocols, Access Control Lists and SIP Normalization',
    sections: [
      {
        id: 'ch5_1',
        title: '5.1 Network Security Ports Matrix',
        content: 'Enterprise firewalls must allow specific egress paths for voice media and application logic of Webex engines. SIP-over-TLS ensures secure message transmission, while media paths use Secure Real-time Transport Protocol (SRTP) payloads.',
        bullets: [
          'Signaling Flow: Must permit outbound TCP 5061 (TLS) directly to Webex Calling SBC ranges.',
          'Media Routing: Must configure broad UDP boundaries (8000 to 48000) for real-time video/audio payload transmission to regional media gateways.',
          'WebSocket Connectivity: Required for cloud dashboard operations, browser agents, and client messaging (TCP 443).'
        ],
        tables: {
          headers: ['Protocol', 'Port Target', 'Source', 'Destination', 'Functional Purpose'],
          rows: [
            ['TCP', '443', 'Internal clients', 'Webex Cloud Subnets', 'HTTPS Sync, WebSockets, DLP, App UI'],
            ['TCP', '5061', 'LGW interface', 'Webex Signaling PoPs', 'SIP Call Signaling wrapped in TLS'],
            ['UDP', '8000 - 48000', 'Internal endpoints', 'Global Media Nodes', 'SRTP Audio and Video Stream Packets'],
            ['UDP', '3478', 'Internal endpoints', 'STUN Servers', 'STUN/ICE NAT Traversal & network path matching']
          ]
        }
      },
      {
        id: 'ch5_2',
        title: '5.2 Cisco ASA/Firepower ACL Implementations',
        content: 'A detailed Access Control List layout keeps enterprise connections safe, allowing only Webex certified CIDR block subnets to pass media and call setup commands.',
        bullets: [
          'CIDR Filtering: Best practice involves white-listing regional Cisco IP blocks directly.',
          'Disable SIP inspection (ALG): Standard firewalls manipulate SIP headers natively, resulting in missing parameters. Disable standard SIP analysis.'
        ],
        cliEx: `! Disable SIP Inspection inside Cisco ASA
policy-map global_policy
 class inspection_default
  no inspect sip
!
! Define Webex Calling IP Object
object network OBJ-WEBEX-CALLING-PSTN
 subnet 135.182.0.0 255.255.0.0
!
! Apply Outbound Access Rule
access-list LAN-EGRESS-POL extended permit tcp any object OBJ-WEBEX-CALLING-PSTN eq 5061`
      }
    ]
  },
  {
    id: 'ch6',
    title: 'Chapter 6: Field Engineering & Troubleshooting',
    subtitle: 'Call Quality Troubleshooting, Metric Thresholds, and CLI Diagnostics',
    sections: [
      {
        id: 'ch6_1',
        title: '6.1 Call Quality KPIs and Telemetry Targets',
        content: 'Field Voice engineers continuously analyze Call Detail Records (CDRs) and media streams to verify quality. The industry standards for voice over IP require strict metric boundaries.',
        bullets: [
          'Latency (End-to-End RTT): < 150ms. High latency leads to people talking over each other.',
          'Jitter (Variation in Packet Arrival): < 30ms. Jitter buffers on the IP Phone compensate, but excessive jitter causes audio dropouts.',
          'Packet Loss rate: < 1-2%. Since voice runs on UDP, lost packets are never retransmitted, causing robotic robotic voice or audible silence gaps.'
        ],
        tables: {
          headers: ['Metric KPI', 'Target Goal', 'Critical Threshold', 'Physical Symptoms'],
          rows: [
            ['One-way Latency', 'Under 150ms', 'Over 250ms', 'Extreme delays in conversations'],
            ['Jitter Metric', 'Under 30ms', 'Over 50ms', 'Robotic audio, mechanical crackling'],
            ['Packet Loss', 'Under 1.0%', 'Over 3.0%', 'Word fragmentation, missing syllables'],
            ['Codec Payload', 'G.722 Wideband', 'G.711 Narrowband', 'Low fidelity sound but lighter footprint']
          ]
        }
      },
      {
        id: 'ch6_2',
        title: '6.2 CUBE CLI Troubleshooting Commands',
        content: 'When an engineer is diagnosing local gateway failures, native IOS command-line parameters provide raw debugging traces, routing maps, and SIP protocol ladders on the fly.',
        bullets: [
          'Registration Verifications: Checking if the SIP trunk is fully registered with Webex Cloud Registrar.',
          'Active session analysis: Checking performance on live calling pathways at the gateway interface level.'
        ],
        cliEx: `! Command to verify SIP UA registration with cloud
Chicago-CUBE-01# show sip-ua register status
Line          Peer          SIP-regs    Reg-State
==================================================
+13125550199  101           1           Registered

! Command to analyze live active calls briefing
Chicago-CUBE-01# show call active voice brief
Total active calls: 2
Line Host-IP            Codec       Direction  State
=====================================================
0/0:23  135.182.1.20    g711ulaw    Inbound    Active
0/0:1   10.12.50.4      g711ulaw    Outbound   Active`
      }
    ]
  }
];
