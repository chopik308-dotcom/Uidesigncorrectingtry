export interface ScreenLine {
  key: string;
  text: string;
  severity: 'info' | 'warning' | 'critical';
  animHint?: 'steady' | 'type_on' | 'blink_slow' | 'pulse_soft' | 'pulse_hard' | 'glitch_soft';
}

export interface ScreenSection {
  name: string;
  lines: ScreenLine[];
}

export interface Screen {
  id: string;
  title: string;
  sections: ScreenSection[];
}

export const screens: Screen[] = [
  {
    id: 'access-gateway',
    title: 'ZERO ROOM // ACCESS ALIGNMENT',
    sections: [
      {
        name: 'Handshake',
        lines: [
          { key: 'GREETING', text: 'WELCOME BACK TO THE LOCAL CONTEXT FIELD', severity: 'info', animHint: 'type_on' },
          { key: 'SUBTITLE', text: 'ALIGN SIGNAL. AUTHORIZE EXISTING IDENTITY OR JOIN THE SYSTEM.', severity: 'info', animHint: 'steady' },
        ],
      },
      {
        name: 'Entry',
        lines: [
          { key: 'LOGIN', text: 'ENTER ACCOUNT :: RESTORE PERSONAL CONTEXT', severity: 'critical', animHint: 'pulse_hard' },
          { key: 'JOIN', text: 'JOIN SYSTEM :: INITIALIZE NEW PERSONAL CONTEXT', severity: 'info', animHint: 'pulse_soft' },
        ],
      },
    ],
  },
  {
    id: 'raw-intake',
    title: 'DATA INTAKE // RAW CONTEXT LOADER',
    sections: [
      {
        name: 'Intake',
        lines: [
          { key: 'HEAD', text: 'DROP OR PASTE YOUR RAW CONTEXT EXPORTS', severity: 'info', animHint: 'type_on' },
          { key: 'DROPZONE', text: 'DRAG AND DROP / PASTE RAW FILES HERE', severity: 'warning', animHint: 'steady' },
          { key: 'SOURCES', text: 'SOURCES :: TELEGRAM EXPORT / WHATSAPP EXPORT / TXT ARCHIVE / NOTES', severity: 'info', animHint: 'steady' },
          { key: 'PIPELINE', text: 'PIPELINE :: CLEANUP -> FILTERING -> DISTILLATION -> VECTOR PORTRAIT', severity: 'warning', animHint: 'type_on' },
        ],
      },
    ],
  },
  {
    id: 'wake',
    title: 'ZERO ROOM // WAKE',
    sections: [
      {
        name: 'Identity',
        lines: [
          { key: 'SUBJECT_CONTEXT_ID', text: 'SUBJECT CONTEXT ID :: LOCAL-SESSION', severity: 'info', animHint: 'steady' },
          { key: 'SPACE_REVISION', text: 'SPACE REVISION :: R0', severity: 'info', animHint: 'steady' },
          { key: 'SESSION_ANCHOR', text: 'SESSION ANCHOR :: NOT SET', severity: 'warning', animHint: 'blink_slow' },
        ],
      },
      {
        name: 'System',
        lines: [
          { key: 'LINE_01', text: 'WAKE SEQUENCE ACCEPTED', severity: 'info', animHint: 'type_on' },
          { key: 'LINE_02', text: 'PRIVACY MODE :: LOCAL-FIRST', severity: 'info', animHint: 'steady' },
          { key: 'LINE_03', text: 'ACTIVE MODULES :: ZERO-ROOM / ENTOURAGE / MAP', severity: 'info', animHint: 'steady' },
          { key: 'LINE_04', text: 'CLARIFICATION QUEUE :: 2 OPEN', severity: 'warning', animHint: 'type_on' },
          { key: 'LINE_05', text: 'LAST CONSOLIDATION :: PENDING', severity: 'warning', animHint: 'steady' },
        ],
      },
      {
        name: 'Actions',
        lines: [
          { key: 'ACTION_01', text: 'OPEN SYSTEM STATUS', severity: 'info', animHint: 'pulse_soft' },
          { key: 'ACTION_02', text: 'ENTER ENTOURAGE CHANNEL', severity: 'critical', animHint: 'pulse_hard' },
        ],
      },
    ],
  },
  {
    id: 'system-status',
    title: 'ZERO ROOM // SYSTEM STATUS',
    sections: [
      {
        name: 'Metrics',
        lines: [
          { key: 'NOTES', text: 'IMPORTED NOTES :: 10', severity: 'info', animHint: 'type_on' },
          { key: 'NODES', text: 'NODE COUNT :: 42', severity: 'info', animHint: 'type_on' },
          { key: 'DET_LINKS', text: 'DETERMINISTIC LINKS :: 88', severity: 'info', animHint: 'type_on' },
          { key: 'HYP_LINKS', text: 'HYPOTHESIS LINKS :: 27', severity: 'warning', animHint: 'type_on' },
          { key: 'TENSIONS', text: 'TENSIONS :: 6', severity: 'warning', animHint: 'steady' },
          { key: 'REVISIONS', text: 'REVISION COUNT :: 4', severity: 'info', animHint: 'steady' },
          { key: 'LAST_CONSOLIDATION', text: 'LAST CONSOLIDATION :: 2026-03-16T10:15:00Z', severity: 'info', animHint: 'steady' },
        ],
      },
      {
        name: 'Actions',
        lines: [
          { key: 'ACTION_01', text: 'IMPORT NOTES', severity: 'critical', animHint: 'pulse_hard' },
          { key: 'ACTION_02', text: 'OPEN SUBJECT MAP', severity: 'info', animHint: 'pulse_soft' },
          { key: 'ACTION_03', text: 'OPEN TIMELINE', severity: 'info', animHint: 'pulse_soft' },
        ],
      },
    ],
  },
  {
    id: 'orientation',
    title: 'SESSION SHELL // ORIENTATION',
    sections: [
      {
        name: 'Anchor',
        lines: [
          { key: 'COUNTDOWN', text: '10', severity: 'critical', animHint: 'pulse_hard' },
        ],
      },
      {
        name: 'Sequence',
        lines: [
          { key: 'STEP_01', text: 'SELECT SESSION ANCHOR', severity: 'info', animHint: 'type_on' },
          { key: 'STEP_02', text: 'CHOOSE CHANNEL :: ENTOURAGE / MAP / IMPORT', severity: 'info', animHint: 'type_on' },
          { key: 'STEP_03', text: 'CONFIRM CURRENT INTENT', severity: 'warning', animHint: 'type_on' },
          { key: 'STEP_04', text: 'MARK UNRESOLVED TENSION (OPTIONAL)', severity: 'warning', animHint: 'steady' },
        ],
      },
      {
        name: 'Overlay',
        lines: [
          { key: 'INTRUSION', text: 'INTRUSION EVENT :: PERCEPTUAL LAYER ACTIVE', severity: 'warning', animHint: 'glitch_soft' },
        ],
      },
    ],
  },
  {
    id: 'session-anchor',
    title: 'SESSION ANCHOR // INPUT',
    sections: [
      {
        name: 'Primary',
        lines: [
          { key: 'LABEL', text: 'SESSION ANCHOR INPUT', severity: 'critical', animHint: 'type_on' },
          { key: 'PLACEHOLDER', text: 'conflict-of-day: duty vs exhaustion', severity: 'warning', animHint: 'steady' },
          { key: 'CTA', text: 'SUBMIT // HOLD', severity: 'critical', animHint: 'pulse_hard' },
        ],
      },
      {
        name: 'Secondary',
        lines: [
          { key: 'CHAT_LABEL', text: 'ENTOURAGE CHANNEL', severity: 'info', animHint: 'steady' },
          { key: 'CHAT_HINT', text: 'SEND ONE CONCRETE FACT TO CONTEXTUALIZE THE ANCHOR', severity: 'info', animHint: 'type_on' },
        ],
      },
    ],
  },
];
