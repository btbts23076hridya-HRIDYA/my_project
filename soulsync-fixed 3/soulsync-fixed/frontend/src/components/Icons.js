export const HomeIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? '#7c3aed' : 'none'} stroke={active ? '#7c3aed' : '#c4b5fd'} strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);
export const TalkIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? '#7c3aed' : 'none'} stroke={active ? '#7c3aed' : '#c4b5fd'} strokeWidth="2">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
export const JournalIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? '#7c3aed' : 'none'} stroke={active ? '#7c3aed' : '#c4b5fd'} strokeWidth="2">
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
  </svg>
);
