const ChatIcon = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 
                 shadow-[0_4px_20px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_30px_rgba(16,185,129,0.5)]
                 flex items-center justify-center text-white text-2xl
                 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer
                 border-2 border-emerald-400/30"
      title="Medical Assistant"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <path d="M12 7v4M10 9h4" />
      </svg>
    </button>
  );
};

export default ChatIcon;
