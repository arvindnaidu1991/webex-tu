/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChapterSection {
  title: string;
  id: string;
  content: string;
  diagramDescription?: string;
  diagramMermaid?: string;
  bullets?: string[];
  tables?: {
    headers: string[];
    rows: string[][];
  };
  cliEx?: string;
}

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  sections: ChapterSection[];
}

export type CCBlockType = 
  | 'start'
  | 'schedule'
  | 'play_audio'
  | 'queue_contact'
  | 'http_data_dip'
  | 'set_variable'
  | 'disconnect';

export interface CCBlock {
  id: string;
  type: CCBlockType;
  title: string;
  x: number;
  y: number;
  config: {
    scheduleName?: string;
    audioFile?: string;
    queueName?: string;
    url?: string;
    method?: 'GET' | 'POST';
    variableName?: string;
    variableValue?: string;
    nextBlockId?: string;
    openBlockId?: string;
    closedBlockId?: string;
    errorBlockId?: string;
  };
}

export interface SIPMessage {
  from: string;
  to: string;
  label: string;
  details: string;
  timestamp: string;
}

export interface TroubleScenario {
  id: string;
  title: string;
  symptoms: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  metrics: {
    latency: number;
    jitter: number;
    packetLoss: number;
    hasIssue: boolean;
    issueDescription: string;
  };
  sipMessages: SIPMessage[];
  questions: {
    correctId: string;
    options: {
      id: string;
      text: string;
      isCorrect: boolean;
      feedback: string;
    }[];
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}
