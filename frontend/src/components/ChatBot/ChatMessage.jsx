const ChatMessage = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div className={`flex gap-2.5 max-w-[88%] animate-fadeInUp ${isUser ? "self-end flex-row-reverse" : "self-start"}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 mt-0.5
        ${isUser
          ? "bg-emerald-100 border border-emerald-200 text-emerald-600"
          : "bg-green-100 border border-green-200 text-green-600"
        }`}
      >
        {isUser ? "👤" : "🤖"}
      </div>

      {/* Bubble */}
      <div>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isUser
            ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-tr-sm shadow-md"
            : "bg-white border border-gray-200 text-gray-700 rounded-tl-sm shadow-sm"
          }
          ${message.isFollowup ? "bg-green-50 border border-green-200 rounded-tl-sm" : ""}`}
        >
          {message.isFollowup ? (
            <>
              <div className="text-sm font-medium text-gray-800">{message.text}</div>
              {message.questionProgress && (
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <span>Question {message.questionProgress.current} of {message.questionProgress.total}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all"
                      style={{ width: `${(message.questionProgress.current / message.questionProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            message.text
          )}

          {message.is_emergency && (
            <div className="mt-2.5 p-3 rounded-lg text-xs text-red-600 leading-relaxed bg-red-50 border border-red-200">
              🚨 Emergency symptoms detected. Please seek immediate medical attention!
            </div>
          )}
        </div>

        {/* Detected symptoms */}
        {message.detected_symptoms && message.detected_symptoms.length > 0 && !isUser && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {message.detected_symptoms.map((s, j) => (
              <span key={j} className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-700">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
