import { useState, useEffect, useRef } from "react";
import { createSession, sendMessage, resetSession } from "../../services/api";
import ChatMessage from "./ChatMessage";

const ChatWindow = ({ onClose }) => {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState("initial");
  const [inputType, setInputType] = useState("text");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => { scrollToBottom(); }, [messages, isLoading, result]);

  useEffect(() => { initSession(); }, []);

  useEffect(() => {
    if (inputType === "text" || inputType === "number") {
      inputRef.current?.focus();
    }
  }, [inputType, stage]);

  const initSession = async () => {
    try {
      const data = await createSession();
      setSessionId(data.session_id);
    } catch (err) {
      console.error("Failed to create session:", err);
    }
  };

  const addMessage = (sender, text, extra = {}) => {
    setMessages((prev) => [...prev, { sender, text, ...extra }]);
  };

  const handleSend = async (customInput) => {
    const text = customInput || input;
    if (!text.trim() || !sessionId || isLoading) return;

    setShowWelcome(false);
    addMessage("user", text);
    setInput("");
    setIsLoading(true);

    try {
      const data = await sendMessage(sessionId, text);
      setIsLoading(false);
      setStage(data.stage);
      setInputType(data.input_type || "text");

      if (data.stage === "result" && data.result) {
        setResult(data.result);
        if (data.message) addMessage("bot", data.message);
        return;
      }

      if (data.message) {
        addMessage("bot", data.message, {
          is_emergency: data.is_emergency,
          detected_symptoms: data.detected_symptoms,
        });
      }

      if (data.followup_question) {
        setTimeout(() => {
          addMessage("bot", data.followup_question, {
            isFollowup: true,
            questionProgress: data.question_progress,
          });
          scrollToBottom();
        }, 400);
      }
    } catch (err) {
      setIsLoading(false);
      addMessage("bot", "Sorry, something went wrong. Please try again.");
    }
  };

  const handleReset = async () => {
    try {
      if (sessionId) await resetSession(sessionId);
      setMessages([]);
      setStage("initial");
      setInputType("text");
      setShowWelcome(true);
      setResult(null);
      setIsLoading(false);
      await initSession();
    } catch (err) {
      console.error("Reset error:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getPlaceholder = () => {
    if (stage === "duration") return "Enter number of days (e.g., 3)";
    if (stage === "age") return "Enter your age (e.g., 25)";
    if (stage === "result") return "Type new symptoms to start over...";
    return "Describe your symptoms...";
  };

  return (
    <div className="w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 
                    flex flex-col overflow-hidden animate-scaleIn">
      {/* Header */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white">
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg">🏥</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold">MediCheck AI</div>
          <div className="text-xs opacity-80 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-200 animate-pulseDot" />
            Medical Symptom Analyzer
          </div>
        </div>
        <button onClick={handleReset} className="px-2.5 py-1 rounded-full text-xs bg-white/15 hover:bg-white/25 transition-all cursor-pointer">
          ↻ New
        </button>
        <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all cursor-pointer text-sm">
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-2 bg-gray-50">
        {showWelcome && messages.length === 0 && (
          <div className="text-center py-6 px-3 animate-fadeInUp">
            <span className="text-4xl block mb-3 animate-floatY">🩺</span>
            <h3 className="text-sm font-bold text-gray-800 mb-1">Welcome to MediCheck AI</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Describe your symptoms and I'll help identify possible conditions.
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {["I have fever and headache", "I feel nauseous", "I have a bad cough"].map((text) => (
                <button key={text} onClick={() => { setInput(text); handleSend(text); }}
                  className="px-3 py-1.5 rounded-full text-xs bg-emerald-50 border border-emerald-200 text-emerald-700
                             hover:bg-emerald-100 transition-all cursor-pointer">
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2.5 animate-fadeInUp">
            <div className="w-8 h-8 rounded-lg bg-green-100 border border-green-200 flex items-center justify-center text-sm">🤖</div>
            <div className="flex gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm bg-white border border-gray-200">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-dot1" />
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-dot2" />
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-dot3" />
            </div>
          </div>
        )}

        {/* Result Card */}
        {result && <ResultCard result={result} />}

        <div ref={messagesEndRef} />
      </div>

      {/* Yes/No Buttons */}
      {inputType === "yesno" && !isLoading && stage === "followup" && (
        <div className="flex gap-2 px-3 py-2 shrink-0 bg-white border-t border-gray-100">
          <button onClick={() => handleSend("Yes")}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer
                       bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100 transition-all">
            ✓ Yes
          </button>
          <button onClick={() => handleSend("No")}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer
                       bg-red-50 border border-red-300 text-red-600 hover:bg-red-100 transition-all">
            ✕ No
          </button>
        </div>
      )}

      {/* New Consultation after result */}
      {stage === "result" && result && (
        <div className="px-3 py-2 shrink-0 bg-white border-t border-gray-100">
          <button onClick={handleReset}
            className="w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer
                       bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100 transition-all">
            🔄 Start New Consultation
          </button>
        </div>
      )}

      {/* Text Input */}
      {inputType !== "yesno" && stage !== "result" && (
        <div className="shrink-0 px-3 py-2.5 border-t border-gray-100 bg-white">
          <div className="flex gap-2 items-center">
            <input
              ref={inputRef}
              type={inputType === "number" ? "number" : "text"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={getPlaceholder()}
              disabled={isLoading}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm text-gray-800
                         placeholder-gray-400 outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-full shrink-0 text-white cursor-pointer flex items-center justify-center
                         bg-gradient-to-br from-emerald-500 to-green-600 shadow-md
                         hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <div className="shrink-0 text-center px-3 py-1.5 text-[10px] text-gray-400 bg-white">
        ⚕️ AI tool for informational purposes only. Consult a healthcare professional.
      </div>
    </div>
  );
};

/* ─── Result Card ── */
function ResultCard({ result }) {
  const risk = result.risk_level || "low";
  const icon = risk === "high" ? "🚨" : risk === "moderate" ? "⚡" : "✅";

  const riskColors = {
    high: { bg: "bg-red-50 border-red-200", badge: "bg-red-100 text-red-700", warning: "bg-red-50 border-red-200 text-red-600" },
    moderate: { bg: "bg-amber-50 border-amber-200", badge: "bg-amber-100 text-amber-700", warning: "bg-amber-50 border-amber-200 text-amber-600" },
    low: { bg: "bg-emerald-50 border-emerald-200", badge: "bg-emerald-100 text-emerald-700", warning: "bg-emerald-50 border-emerald-200 text-emerald-600" },
  };

  const colors = riskColors[risk] || riskColors.low;

  return (
    <div className="flex gap-2 max-w-[95%] self-start animate-slideUp">
      <div className="w-8 h-8 rounded-lg bg-green-100 border border-green-200 flex items-center justify-center text-sm shrink-0 mt-0.5">🤖</div>
      <div className="rounded-xl border border-gray-200 overflow-hidden flex-1 min-w-0 bg-white shadow-sm">
        <div className={`px-4 py-3 flex items-center gap-3 border-b ${colors.bg}`}>
          <span className="text-xl">{icon}</span>
          <div className="min-w-0">
            <div className="text-sm font-bold text-gray-800 truncate">{result.possible_disease}</div>
            <div className="text-xs text-gray-500 mt-0.5">
              Confidence: {result.confidence} •{" "}
              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${colors.badge}`}>
                {risk} risk
              </span>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 space-y-3">
          <div className={`p-2.5 rounded-lg text-xs font-medium leading-relaxed border ${colors.warning}`}>
            {result.warning}
          </div>
          {result.detected_symptoms?.length > 0 && (
            <div>
              <div className="text-xs font-bold text-gray-500 mb-1.5">🔍 Symptoms</div>
              <div className="flex flex-wrap gap-1">
                {result.detected_symptoms.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 border border-emerald-200 text-emerald-700">{s}</span>
                ))}
              </div>
            </div>
          )}
          {result.precautions?.length > 0 && (
            <div>
              <div className="text-xs font-bold text-gray-500 mb-1">⚠️ Precautions</div>
              <ul className="text-xs text-gray-600 space-y-0.5 pl-4 list-disc">{result.precautions.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
          )}
          {result.home_remedies?.length > 0 && (
            <div>
              <div className="text-xs font-bold text-gray-500 mb-1">🌿 Remedies</div>
              <ul className="text-xs text-gray-600 space-y-0.5 pl-4 list-disc">{result.home_remedies.map((r, i) => <li key={i}>{r}</li>)}</ul>
            </div>
          )}
          {result.medicines?.length > 0 && (
            <div>
              <div className="text-xs font-bold text-gray-500 mb-1">💊 Medicines</div>
              <ul className="text-xs text-gray-600 space-y-0.5 pl-4 list-disc">{result.medicines.map((m, i) => <li key={i}>{typeof m === "string" ? m : m.name}</li>)}</ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
