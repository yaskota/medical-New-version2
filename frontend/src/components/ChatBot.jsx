import { useState, useEffect, useRef } from "react";
import { createSession, sendMessage, resetSession } from "../services/api";

function ChatBot() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState("initial");
  const [inputType, setInputType] = useState("text");
  const [isLoading, setIsLoading] = useState(false);
  const [questionProgress, setQuestionProgress] = useState(null);
  const [detectedSymptoms, setDetectedSymptoms] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [result, setResult] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, result]);

  // Initialize session on mount
  useEffect(() => {
    initSession();
  }, []);

  const initSession = async () => {
    try {
      const data = await createSession();
      setSessionId(data.session_id);
    } catch (err) {
      console.error("Failed to create session:", err);
    }
  };

  // Focus input when stage changes
  useEffect(() => {
    if (inputType === "text" || inputType === "number") {
      inputRef.current?.focus();
    }
  }, [inputType, stage]);

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

      if (data.detected_symptoms) {
        setDetectedSymptoms(data.detected_symptoms);
      }

      if (data.confirmed_symptoms) {
        setDetectedSymptoms(data.confirmed_symptoms);
      }

      if (data.question_progress) {
        setQuestionProgress(data.question_progress);
      }

      if (data.stage === "result" && data.result) {
        setResult(data.result);
        if (data.message) {
          addMessage("bot", data.message);
        }
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
      console.error("Chat error:", err);
      addMessage("bot", "Sorry, something went wrong. Please try again.");
    }
  };

  const handleYesNo = (answer) => {
    handleSend(answer);
  };

  const handleReset = async () => {
    try {
      if (sessionId) {
        await resetSession(sessionId);
      }
      setMessages([]);
      setStage("initial");
      setInputType("text");
      setDetectedSymptoms([]);
      setQuestionProgress(null);
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

  const handleSuggestionClick = (text) => {
    setInput(text);
    handleSend(text);
  };

  const getPlaceholder = () => {
    if (stage === "duration") return "Enter number of days (e.g., 3)";
    if (stage === "age") return "Enter your age (e.g., 25)";
    if (stage === "result") return "Type a new symptom to start over...";
    return "Describe your symptoms...";
  };

  /* ══════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════ */
  return (
    /* Full-screen wrapper — fills 100 % of the viewport */
    <div className="h-full w-full flex items-center justify-center p-3 sm:p-5 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute inset-0 opacity-40"
           style={{
             background:
               "radial-gradient(circle at 30% 20%, rgba(99,102,241,0.09) 0%, transparent 55%)," +
               "radial-gradient(circle at 70% 80%, rgba(20,184,166,0.07) 0%, transparent 55%)",
           }}
      />

      {/* ─── Chat Card ─────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[520px] h-full max-h-[760px] sm:h-[92vh]
                       flex flex-col rounded-none sm:rounded-2xl overflow-hidden
                       bg-[#1a1f35] border border-indigo-500/15
                       shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_80px_rgba(99,102,241,0.08)]
                       animate-scaleIn">

        {/* ── Header ──────────────────────────────────────── */}
        <div className="shrink-0 flex items-center gap-3.5 px-5 py-4
                       bg-gradient-to-br from-indigo-500/15 to-violet-500/10
                       border-b border-indigo-500/15 backdrop-blur-xl">
          {/* Icon */}
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px]
                         bg-gradient-to-br from-indigo-500 to-violet-500
                         shadow-[0_4px_16px_rgba(99,102,241,0.35)]">
            🏥
          </div>
          {/* Title */}
          <div className="flex-1 min-w-0">
            <div className="text-base font-bold text-slate-100 tracking-tight">MediCheck AI</div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
              <span className="inline-block w-[7px] h-[7px] rounded-full bg-emerald-500 animate-pulseDot" />
              Medical Symptom Analyzer
            </div>
          </div>
          {/* Reset button */}
          <button onClick={handleReset}
                  className="px-3.5 py-1.5 rounded-full text-[11px] font-medium
                             bg-white/5 border border-white/10 text-slate-400
                             hover:bg-rose-500/15 hover:border-rose-500/30 hover:text-rose-400
                             transition-all cursor-pointer">
            ↻ New
          </button>
        </div>

        {/* ── Messages ────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-2">

          {/* Welcome Screen */}
          {showWelcome && messages.length === 0 && (
            <div className="text-center py-8 px-4 animate-fadeInUp">
              <span className="text-5xl block mb-4 animate-floatY">🩺</span>
              <h2 className="text-lg font-bold text-slate-100 mb-2">Welcome to MediCheck AI</h2>
              <p className="text-[13px] text-slate-400 leading-relaxed max-w-xs mx-auto mb-6">
                I'm your medical triage assistant. Describe your symptoms and I'll
                help narrow down possible conditions with personalized advice.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "I have fever and headache",
                  "I feel acidity",
                  "I have a bad cough",
                  "I feel dizzy and nauseous",
                ].map((text) => (
                  <button key={text}
                          onClick={() => handleSuggestionClick(text)}
                          className="px-3.5 py-2 rounded-full text-xs
                                     bg-white/[0.04] border border-white/[0.08] text-slate-400
                                     hover:bg-indigo-500/10 hover:border-indigo-500/20 hover:text-indigo-300
                                     transition-all cursor-pointer">
                    {text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message list */}
          {messages.map((msg, i) => (
            <div key={i}
                 className={`flex gap-2.5 max-w-[88%] animate-fadeInUp
                             ${msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
              {/* Avatar */}
              <div className={`w-[30px] h-[30px] rounded-lg flex items-center justify-center text-sm shrink-0 mt-0.5
                               ${msg.sender === "bot"
                                 ? "bg-gradient-to-br from-indigo-500/20 to-violet-500/15 border border-indigo-500/20"
                                 : "bg-gradient-to-br from-teal-500/20 to-teal-400/15 border border-teal-500/20"}`}>
                {msg.sender === "bot" ? "🤖" : "👤"}
              </div>

              {/* Bubble */}
              <div>
                <div className={`px-4 py-3 rounded-2xl text-[13.5px] leading-relaxed
                                 ${msg.sender === "bot"
                                   ? "bg-white/[0.04] border border-white/[0.06] text-slate-200 rounded-tl-sm"
                                   : "bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-tr-sm shadow-[0_4px_16px_rgba(99,102,241,0.3)]"}
                                 ${msg.isFollowup
                                   ? "bg-gradient-to-br from-indigo-500/[0.08] to-violet-500/[0.05] border border-indigo-500/15 rounded-tl-sm"
                                   : ""}`}>

                  {msg.isFollowup ? (
                    <>
                      <div className="text-sm font-medium text-slate-100">{msg.text}</div>
                      {msg.questionProgress && (
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                          <span>Question {msg.questionProgress.current} of {msg.questionProgress.total}</span>
                          <div className="flex-1 h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all"
                                 style={{ width: `${(msg.questionProgress.current / msg.questionProgress.total) * 100}%` }} />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    msg.text
                  )}

                  {msg.is_emergency && (
                    <div className="mt-2.5 p-3 rounded-lg text-xs text-rose-400 leading-relaxed
                                    bg-rose-500/10 border border-rose-500/20 animate-scaleIn">
                      🚨 Emergency symptoms detected. Please seek immediate
                      medical attention while we continue the assessment.
                    </div>
                  )}
                </div>

                {/* Detected symptom tags */}
                {msg.detected_symptoms && msg.detected_symptoms.length > 0 && msg.sender === "bot" && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.detected_symptoms.map((s, j) => (
                      <span key={j}
                            className="px-2.5 py-1 rounded-full text-[11px] font-medium animate-scaleIn
                                       bg-indigo-500/10 border border-indigo-500/15 text-indigo-300">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex items-center gap-2.5 animate-fadeInUp">
              <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-sm
                             bg-gradient-to-br from-indigo-500/20 to-violet-500/15 border border-indigo-500/20">
                🤖
              </div>
              <div className="flex gap-1 px-4 py-3 rounded-2xl rounded-tl-sm
                             bg-white/[0.04] border border-white/[0.06]">
                <div className="w-[7px] h-[7px] rounded-full bg-indigo-400 animate-dot1" />
                <div className="w-[7px] h-[7px] rounded-full bg-indigo-400 animate-dot2" />
                <div className="w-[7px] h-[7px] rounded-full bg-indigo-400 animate-dot3" />
              </div>
            </div>
          )}

          {/* Result Card */}
          {result && <ResultCard result={result} />}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Yes / No Buttons ────────────────────────────── */}
        {inputType === "yesno" && !isLoading && stage === "followup" && (
          <div className="flex gap-3 px-4 py-3 shrink-0 animate-slideUp">
            <button onClick={() => handleYesNo("Yes")}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer
                               flex items-center justify-center gap-1.5
                               bg-emerald-500/15 border border-emerald-500/25 text-emerald-400
                               hover:bg-emerald-500/25 hover:border-emerald-500/40
                               hover:shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:-translate-y-px
                               active:translate-y-0 active:scale-[0.97] transition-all">
              ✓ Yes
            </button>
            <button onClick={() => handleYesNo("No")}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer
                               flex items-center justify-center gap-1.5
                               bg-rose-500/10 border border-rose-500/20 text-rose-400
                               hover:bg-rose-500/20 hover:border-rose-500/35
                               hover:shadow-[0_4px_20px_rgba(244,63,94,0.25)] hover:-translate-y-px
                               active:translate-y-0 active:scale-[0.97] transition-all">
              ✕ No
            </button>
          </div>
        )}

        {/* New Chat after result */}
        {stage === "result" && result && (
          <div className="px-4 py-3 shrink-0 animate-slideUp">
            <button onClick={handleReset}
                    className="w-full py-3 rounded-xl text-[13px] font-semibold cursor-pointer
                               flex items-center justify-center gap-2
                               bg-indigo-500/10 border border-indigo-500/20 text-indigo-300
                               hover:bg-indigo-500/20 hover:border-indigo-500/35
                               hover:shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:-translate-y-px
                               transition-all">
              🔄 Start New Consultation
            </button>
          </div>
        )}

        {/* ── Text / Number Input ─────────────────────────── */}
        {inputType !== "yesno" && stage !== "result" && (
          <div className="shrink-0 px-4 py-3.5 border-t border-white/[0.06] bg-black/15">
            <div className="flex gap-2.5 items-center">
              <input ref={inputRef}
                     type={inputType === "number" ? "number" : "text"}
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     onKeyDown={handleKeyPress}
                     placeholder={getPlaceholder()}
                     disabled={isLoading}
                     className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-full
                                px-5 py-3 text-[13.5px] text-slate-100 placeholder-slate-500
                                outline-none transition-all
                                focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.25)]" />
              <button onClick={() => handleSend()}
                      disabled={!input.trim() || isLoading}
                      className="w-[42px] h-[42px] rounded-full shrink-0 text-lg text-white cursor-pointer
                                 flex items-center justify-center
                                 bg-gradient-to-br from-indigo-500 to-violet-500
                                 shadow-[0_4px_16px_rgba(99,102,241,0.35)]
                                 hover:scale-105 hover:shadow-[0_6px_24px_rgba(99,102,241,0.4)]
                                 active:scale-95
                                 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100
                                 transition-all">
                ➤
              </button>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="shrink-0 text-center px-4 py-2 text-[9.5px] text-slate-500 leading-snug">
          ⚕️ This is an AI-based tool for informational purposes only. Always
          consult a qualified healthcare professional for medical advice.
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Result Card Component
   ═══════════════════════════════════════════════════════════ */
function ResultCard({ result }) {
  const risk = result.risk_level || "low";
  const icon = risk === "high" ? "🚨" : risk === "moderate" ? "⚡" : "✅";

  // Tailwind color maps
  const headerBg = {
    high:     "bg-rose-500/15 border-b border-rose-500/15",
    moderate: "bg-amber-500/15 border-b border-amber-500/15",
    low:      "bg-emerald-500/15 border-b border-emerald-500/15",
  }[risk];

  const iconBg = {
    high: "bg-rose-500/20", moderate: "bg-amber-500/20", low: "bg-emerald-500/20",
  }[risk];

  const warningStyle = {
    high:     "bg-rose-500/10 border-rose-500/20 text-rose-400",
    moderate: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    low:      "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  }[risk];

  const badgeStyle = {
    high: "bg-rose-500/20 text-rose-400",
    moderate: "bg-amber-500/20 text-amber-400",
    low: "bg-emerald-500/20 text-emerald-400",
  }[risk];

  const bulletColor = {
    precautions: "bg-amber-500",
    remedies:    "bg-teal-500",
    medicines:   "bg-indigo-400",
    other:       "bg-slate-500",
  };

  const titleColor = {
    precautions: "text-amber-400",
    remedies:    "text-teal-400",
    medicines:   "text-indigo-300",
    other:       "text-slate-400",
  };

  const ListSection = ({ title, emoji, items, category }) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-4 last:mb-0">
        <div className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${titleColor[category]}`}>
          {emoji} {title}
        </div>
        <ul className="list-none p-0">
          {items.map((item, i) => (
            <li key={i}
                className="py-1.5 pl-5 relative text-[12.5px] leading-relaxed text-slate-400
                           border-b border-white/[0.04] last:border-b-0">
              <span className={`absolute left-0 top-[11px] w-1.5 h-1.5 rounded-full ${bulletColor[category]}`} />
              {typeof item === "string" ? item : (
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-200">{item.name}</span>
                  <span className="text-[11px] text-slate-500">{item.confidence} • {item.risk}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="flex gap-2.5 max-w-[95%] self-start animate-slideUp">
      {/* Avatar */}
      <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-sm shrink-0 mt-0.5
                     bg-gradient-to-br from-indigo-500/20 to-violet-500/15 border border-indigo-500/20">
        🤖
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-indigo-500/15 overflow-hidden flex-1 min-w-0">
        {/* Disease header */}
        <div className={`px-5 py-4 flex items-center gap-3 ${headerBg}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${iconBg}`}>
            {icon}
          </div>
          <div className="min-w-0">
            <div className="text-base font-bold text-slate-100 truncate">{result.possible_disease}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Confidence: {result.confidence}{" "}•{" "}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${badgeStyle}`}>
                {risk} risk
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 bg-[#1a1f35]">
          {/* Warning banner */}
          <div className={`p-3 rounded-lg text-[12.5px] font-medium leading-relaxed mb-4 border ${warningStyle}`}>
            {result.warning}
          </div>

          {/* Confirmed Symptoms */}
          {result.detected_symptoms && result.detected_symptoms.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 text-slate-400">
                🔍 Confirmed Symptoms
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.detected_symptoms.map((s, i) => (
                  <span key={i}
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium
                                   bg-indigo-500/10 border border-indigo-500/15 text-indigo-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Risk Factors */}
          {result.risk_factors && result.risk_factors.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 text-slate-400">
                📊 Risk Analysis
              </div>
              <div>
                {result.risk_factors.map((f, i) => (
                  <div key={i} className="text-[11.5px] text-slate-500 py-0.5 pl-3.5 relative">
                    <span className="absolute left-0 font-bold text-slate-500">›</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          <ListSection title="Precautions"        emoji="⚠️"  items={result.precautions}   category="precautions" />
          <ListSection title="Home Remedies"       emoji="🌿"  items={result.home_remedies} category="remedies" />
          <ListSection title="Suggested Medicines" emoji="💊"  items={result.medicines}     category="medicines" />
          <ListSection title="Other Possibilities" emoji="🔬"  items={result.other_possible_diseases} category="other" />

          {/* Patient Info */}
          {result.patient_info && (
            <div className="mb-0">
              <div className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 text-slate-400">
                👤 Patient Info
              </div>
              <div>
                <div className="text-[11.5px] text-slate-500 py-0.5 pl-3.5 relative">
                  <span className="absolute left-0 font-bold text-slate-500">›</span>
                  Age: {result.patient_info.age} years
                </div>
                <div className="text-[11.5px] text-slate-500 py-0.5 pl-3.5 relative">
                  <span className="absolute left-0 font-bold text-slate-500">›</span>
                  Duration: {result.patient_info.duration_days} day(s)
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
