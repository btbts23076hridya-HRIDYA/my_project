export const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;1,500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Nunito', sans-serif; background: #faf8ff; min-height: 100vh; }
  .app { max-width: 430px; margin: 0 auto; min-height: 100vh; background: #faf8ff; position: relative; overflow-x: hidden; }
  .bg-blob { position: fixed; border-radius: 50%; filter: blur(80px); opacity: 0.18; pointer-events: none; z-index: 0; }
  .bg-blob-1 { width: 300px; height: 300px; background: #c4a8ff; top: -80px; left: -80px; }
  .bg-blob-2 { width: 250px; height: 250px; background: #ffb8d9; bottom: 100px; right: -60px; }
  .bg-blob-3 { width: 200px; height: 200px; background: #a8d8ff; top: 40%; left: 30%; }
  .page { position: relative; z-index: 1; min-height: 100vh; display: flex; flex-direction: column; }
  .btn-primary { background: linear-gradient(135deg, #8b5cf6, #a855f7); color: white; border: none; border-radius: 16px; padding: 16px 24px; font-size: 1rem; font-weight: 700; font-family: 'Nunito', sans-serif; cursor: pointer; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s ease; box-shadow: 0 4px 20px rgba(139,92,246,0.35); }
  .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(139,92,246,0.45); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .btn-secondary { background: white; color: #6d28d9; border: 2px solid #e5d8ff; border-radius: 16px; padding: 14px 24px; font-size: 1rem; font-weight: 700; font-family: 'Nunito', sans-serif; cursor: pointer; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s ease; }
  .btn-secondary:hover { background: #f5f0ff; }
  .input-group { margin-bottom: 16px; }
  .input-label { font-size: 0.82rem; font-weight: 700; color: #6d28d9; margin-bottom: 6px; display: block; text-transform: uppercase; letter-spacing: 0.06em; }
  .input-field { width: 100%; padding: 14px 16px; border: 2px solid #e5d8ff; border-radius: 14px; font-size: 1rem; font-family: 'Nunito', sans-serif; color: #2d1b69; background: white; outline: none; transition: border 0.2s; }
  .input-field:focus { border-color: #8b5cf6; box-shadow: 0 0 0 4px rgba(139,92,246,0.1); }
  .input-field::placeholder { color: #c4b5fd; }
  .card { background: white; border-radius: 20px; padding: 20px; border: 2px solid #f0e8ff; cursor: pointer; transition: all 0.2s ease; }
  .card:hover { border-color: #a78bfa; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(139,92,246,0.12); }
  .card.selected { border-color: #8b5cf6; background: #f5f0ff; }
  .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: white; border-top: 1px solid #f0e8ff; display: flex; padding: 12px 0 20px; z-index: 100; }
  .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; font-size: 0.7rem; font-weight: 700; color: #c4b5fd; transition: color 0.2s; }
  .nav-item.active { color: #7c3aed; }
  .nav-item svg { width: 24px; height: 24px; }
  .back-btn { width: 40px; height: 40px; border-radius: 12px; background: white; border: 2px solid #f0e8ff; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.1rem; transition: all 0.2s; flex-shrink: 0; }
  .mood-row { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; }
  .mood-row::-webkit-scrollbar { display: none; }
  .mood-item { min-width: 68px; height: 80px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; cursor: pointer; transition: all 0.2s; border: 3px solid transparent; font-size: 0.7rem; font-weight: 700; color: #6d28d9; }
  .mood-item:hover { transform: scale(1.06); }
  .mood-item.selected { border-color: #8b5cf6; transform: scale(1.08); }
  .chat-bubble-ai { background: white; border-radius: 20px 20px 20px 4px; padding: 14px 18px; max-width: 85%; box-shadow: 0 2px 12px rgba(139,92,246,0.08); color: #2d1b69; font-size: 0.95rem; line-height: 1.6; border: 1px solid #f0e8ff; }
  .chat-bubble-user { background: linear-gradient(135deg, #8b5cf6, #a855f7); border-radius: 20px 20px 4px 20px; padding: 12px 18px; max-width: 75%; color: white; font-size: 0.95rem; line-height: 1.6; }
  .step-dots { display: flex; gap: 8px; justify-content: center; margin-top: 20px; }
  .step-dot { width: 8px; height: 8px; border-radius: 50%; background: #e5d8ff; transition: all 0.3s; }
  .step-dot.active { background: #8b5cf6; width: 24px; border-radius: 4px; }
  .avatar-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .avatar-item { aspect-ratio: 1; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; cursor: pointer; border: 3px solid transparent; transition: all 0.2s; }
  .avatar-item:hover { transform: scale(1.06); }
  .avatar-item.selected { border-color: #8b5cf6; transform: scale(1.08); box-shadow: 0 4px 16px rgba(139,92,246,0.3); }
  .tag { display: inline-flex; align-items: center; gap: 4px; background: #fff8ec; color: #d97706; border-radius: 20px; padding: 4px 12px; font-size: 0.8rem; font-weight: 700; }
  .affirmation { font-family: 'Playfair Display', serif; font-style: italic; color: #4c1d95; font-size: 1rem; line-height: 1.6; text-align: center; }
  .divider { width: 60px; height: 4px; background: linear-gradient(90deg,#8b5cf6,#a855f7); border-radius: 2px; }
  .alert { padding: 12px 16px; border-radius: 12px; font-size: 0.9rem; font-weight: 600; margin-bottom: 16px; }
  .alert-error { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }
  .alert-success { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
  .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .typing-dots span { display: inline-block; width: 8px; height: 8px; background: #c4b5fd; border-radius: 50%; margin: 0 2px; animation: bounce 1.2s infinite; }
  .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
  .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-8px); } }
  .modal-overlay { position: fixed; inset: 0; background: rgba(45,27,105,0.4); z-index: 200; display: flex; align-items: flex-end; justify-content: center; }
  .modal { background: white; border-radius: 28px 28px 0 0; padding: 28px 24px 40px; width: 100%; max-width: 430px; max-height: 90vh; overflow-y: auto; }
  .modal-handle { width: 40px; height: 4px; background: #e5d8ff; border-radius: 2px; margin: 0 auto 24px; }
`;
