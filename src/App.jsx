import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — replace with your actual values
// ─────────────────────────────────────────────────────────────────────────────
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzU0-oCLroiRvNzGTq5aMe683lsZn7qu_2LY7JIBOmpK0biO2_aGpiV_w8N-lImnwo/exec";
// ^ After deploying your Apps Script (see setup guide), paste the URL above.

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function today() {
  return new Date().toISOString().split("T")[0];
}
function thirtyDaysAgo() {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().split("T")[0];
}
function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponents
// ─────────────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{
        width: 38, height: 38, borderRadius: "10px",
        background: "linear-gradient(135deg, #c45e1a 0%, #e8892e 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 8px rgba(196,94,26,0.3)"
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="1.8" />
          <path d="M7 8h10M7 12h7M7 16h5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: "15px", color: "#1a1a1a", letterSpacing: "-0.3px" }}>
          Divine Silver
        </div>
        <div style={{ fontSize: "11px", color: "#888", letterSpacing: "0.3px", marginTop: "-1px" }}>
          Statement Requests
        </div>
      </div>
    </div>
  );
}

function StepBadge({ n, active, done }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "12px", fontWeight: 700,
      background: done ? "#c45e1a" : active ? "#fff3e8" : "#f5f5f5",
      color: done ? "white" : active ? "#c45e1a" : "#bbb",
      border: active ? "2px solid #c45e1a" : done ? "2px solid #c45e1a" : "2px solid #e8e8e8",
      transition: "all 0.2s",
    }}>
      {done ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : n}
    </div>
  );
}

function FieldLabel({ children, required }) {
  return (
    <label style={{
      display: "block", fontSize: "12px", fontWeight: 600,
      color: "#555", marginBottom: "6px", letterSpacing: "0.3px",
      textTransform: "uppercase"
    }}>
      {children} {required && <span style={{ color: "#c45e1a" }}>*</span>}
    </label>
  );
}

function Input({ type = "text", value, onChange, placeholder, error, ...rest }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%", boxSizing: "border-box",
        padding: "10px 13px", fontSize: "14px",
        border: `1.5px solid ${error ? "#e05252" : focused ? "#c45e1a" : "#e0e0e0"}`,
        borderRadius: "8px", outline: "none",
        background: focused ? "#fffaf6" : "white",
        color: "#1a1a1a", transition: "all 0.15s",
        boxShadow: focused ? "0 0 0 3px rgba(196,94,26,0.08)" : "none",
      }}
      {...rest}
    />
  );
}

function ErrorMsg({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ fontSize: "12px", color: "#e05252", marginTop: "5px", display: "flex", alignItems: "center", gap: "4px" }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="5" stroke="#e05252" strokeWidth="1.5" />
        <path d="M6 4v3M6 8.5v.2" stroke="#e05252" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {msg}
    </div>
  );
}

function SuccessScreen({ name, fromDate, toDate, onReset }) {
  return (
    <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
      <div style={{
        width: 64, height: 64, borderRadius: "50%", margin: "0 auto 20px",
        background: "linear-gradient(135deg, #c45e1a, #e8892e)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 8px 24px rgba(196,94,26,0.25)",
        animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)"
      }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M5 14l7 7 11-11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>
        Request submitted!
      </h2>
      <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.6, margin: "0 0 24px" }}>
        Hi {name}, your statement for<br />
        <strong style={{ color: "#c45e1a" }}>{formatDate(fromDate)} – {formatDate(toDate)}</strong><br />
        has been requested. You'll receive it at your work email shortly.
      </p>
      <div style={{
        background: "#fff8f3", border: "1px solid #f0d9c8",
        borderRadius: "10px", padding: "12px 16px",
        fontSize: "13px", color: "#9a5c2e", marginBottom: "24px",
        textAlign: "left", display: "flex", gap: "8px", alignItems: "flex-start"
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
          <circle cx="8" cy="8" r="7" stroke="#c45e1a" strokeWidth="1.5" />
          <path d="M8 5v4M8 10.5v.5" stroke="#c45e1a" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        The statement is sent directly to your registered work email by the bank portal. If you don't see it within a few minutes, check your spam folder.
      </div>
      <button
        onClick={onReset}
        style={{
          background: "none", border: "1.5px solid #e0e0e0",
          borderRadius: "8px", padding: "9px 20px",
          fontSize: "13px", color: "#666", cursor: "pointer",
          fontWeight: 500, transition: "all 0.15s"
        }}
        onMouseOver={e => { e.target.style.borderColor = "#c45e1a"; e.target.style.color = "#c45e1a"; }}
        onMouseOut={e => { e.target.style.borderColor = "#e0e0e0"; e.target.style.color = "#666"; }}
      >
        Submit another request
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(1); // 1 = details, 2 = dates, 3 = confirm
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fromDate, setFromDate] = useState(thirtyDaysAgo());
  const [toDate, setToDate] = useState(today());
  const [note, setNote] = useState("");

  const [errors, setErrors] = useState({});

  // ── Validation ─────────────────────────────────────────────────────────────
  function validateStep1() {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Work email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e = {};
    if (!fromDate) e.fromDate = "Start date is required";
    if (!toDate) e.toDate = "End date is required";
    if (fromDate && toDate && fromDate > toDate) e.toDate = "End date must be after start date";
    if (fromDate && toDate && toDate > today()) e.toDate = "End date cannot be in the future";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function nextStep() {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    setLoading(true);
    setServerError("");
    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        fromDate,
        toDate,
        note: note.trim(),
        submittedAt: new Date().toISOString(),
      };

      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.status === "ok") {
        setSubmitted(true);
      } else {
        setServerError(json.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setServerError("Could not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setName(""); setEmail(""); setNote("");
    setFromDate(thirtyDaysAgo()); setToDate(today());
    setErrors({}); setStep(1); setSubmitted(false); setServerError("");
  }

  // ── Styles ──────────────────────────────────────────────────────────────────
  const cardStyle = {
    background: "white", borderRadius: "16px",
    padding: "32px", maxWidth: "460px", width: "100%",
    boxShadow: "0 4px 40px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
  };

  const btnPrimary = {
    width: "100%", padding: "12px", borderRadius: "9px",
    background: loading ? "#e8892e" : "linear-gradient(135deg, #c45e1a 0%, #e8892e 100%)",
    color: "white", fontWeight: 700, fontSize: "14px",
    border: "none", cursor: loading ? "not-allowed" : "pointer",
    boxShadow: "0 4px 12px rgba(196,94,26,0.25)", letterSpacing: "0.2px",
    transition: "opacity 0.15s", opacity: loading ? 0.8 : 1,
  };

  const btnSecondary = {
    padding: "11px 20px", borderRadius: "9px",
    background: "none", border: "1.5px solid #e0e0e0",
    color: "#666", fontWeight: 600, fontSize: "14px",
    cursor: "pointer", transition: "all 0.15s",
  };

  const steps = ["Your details", "Date range", "Confirm"];

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
        body { margin: 0; background: #f7f3ef; min-height: 100vh; }
        @keyframes popIn {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.25s ease; }
      `}</style>

      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "24px 16px", background: "#f7f3ef",
      }}>
        {/* Header */}
        <div style={{ width: "100%", maxWidth: "460px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Logo />
          <div style={{ fontSize: "12px", color: "#aaa" }}>
            {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </div>
        </div>

        <div style={cardStyle}>
          {submitted ? (
            <SuccessScreen name={name} fromDate={fromDate} toDate={toDate} onReset={reset} />
          ) : (
            <>
              {/* Step indicators */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: "28px" }}>
                {steps.map((label, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                      <StepBadge n={i + 1} active={step === i + 1} done={step > i + 1} />
                      <span style={{
                        fontSize: "12px", fontWeight: step === i + 1 ? 600 : 400,
                        color: step === i + 1 ? "#c45e1a" : step > i + 1 ? "#888" : "#ccc",
                        whiteSpace: "nowrap"
                      }}>{label}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div style={{
                        flex: 1, height: "1.5px", margin: "0 10px",
                        background: step > i + 1 ? "#c45e1a" : "#e8e8e8",
                        transition: "background 0.3s"
                      }} />
                    )}
                  </div>
                ))}
              </div>

              {/* ── Step 1: Details ── */}
              {step === 1 && (
                <div className="fade-up">
                  <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>
                    Request a bank statement
                  </h2>
                  <p style={{ fontSize: "13px", color: "#888", margin: "0 0 24px", lineHeight: 1.5 }}>
                    The statement will be sent to your registered work email by the bank.
                  </p>

                  <div style={{ marginBottom: "16px" }}>
                    <FieldLabel required>Your full name</FieldLabel>
                    <Input
                      value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
                      placeholder="e.g. Priya Sharma"
                      error={errors.name}
                    />
                    <ErrorMsg msg={errors.name} />
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <FieldLabel required>Work email</FieldLabel>
                    <Input
                      type="email" value={email}
                      onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
                      placeholder="you@divinesilver.com"
                      error={errors.email}
                    />
                    <ErrorMsg msg={errors.email} />
                    <div style={{ fontSize: "12px", color: "#aaa", marginTop: "5px" }}>
                      Use your registered work email — the statement goes directly there.
                    </div>
                  </div>

                  <button style={btnPrimary} onClick={nextStep}>
                    Continue →
                  </button>
                </div>
              )}

              {/* ── Step 2: Dates ── */}
              {step === 2 && (
                <div className="fade-up">
                  <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>
                    Choose date range
                  </h2>
                  <p style={{ fontSize: "13px", color: "#888", margin: "0 0 24px", lineHeight: 1.5 }}>
                    Statement will cover transactions between these dates.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
                    <div>
                      <FieldLabel required>From</FieldLabel>
                      <Input
                        type="date" value={fromDate}
                        onChange={e => { setFromDate(e.target.value); setErrors(p => ({ ...p, fromDate: "" })); }}
                        max={today()} error={errors.fromDate}
                      />
                      <ErrorMsg msg={errors.fromDate} />
                    </div>
                    <div>
                      <FieldLabel required>To</FieldLabel>
                      <Input
                        type="date" value={toDate}
                        onChange={e => { setToDate(e.target.value); setErrors(p => ({ ...p, toDate: "" })); }}
                        max={today()} error={errors.toDate}
                      />
                      <ErrorMsg msg={errors.toDate} />
                    </div>
                  </div>

                  {/* Quick selects */}
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>Quick select</div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {[
                        { label: "Last 7 days", days: 7 },
                        { label: "Last 30 days", days: 30 },
                        { label: "Last 90 days", days: 90 },
                        { label: "This month", days: null },
                      ].map(({ label, days }) => (
                        <button key={label}
                          onClick={() => {
                            const t = today();
                            if (days === null) {
                              const d = new Date(); d.setDate(1);
                              setFromDate(d.toISOString().split("T")[0]);
                            } else {
                              const d = new Date(); d.setDate(d.getDate() - days);
                              setFromDate(d.toISOString().split("T")[0]);
                            }
                            setToDate(t);
                            setErrors({});
                          }}
                          style={{
                            padding: "5px 12px", borderRadius: "20px", fontSize: "12px",
                            border: "1.5px solid #e8d5c4", background: "#fff8f3",
                            color: "#c45e1a", cursor: "pointer", fontWeight: 500,
                            transition: "all 0.15s"
                          }}
                          onMouseOver={e => { e.target.style.background = "#c45e1a"; e.target.style.color = "white"; }}
                          onMouseOut={e => { e.target.style.background = "#fff8f3"; e.target.style.color = "#c45e1a"; }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <FieldLabel>Note (optional)</FieldLabel>
                    <textarea
                      value={note} onChange={e => setNote(e.target.value)}
                      placeholder="e.g. Needed for audit, loan application…"
                      rows={2}
                      style={{
                        width: "100%", boxSizing: "border-box", padding: "10px 13px",
                        fontSize: "13px", border: "1.5px solid #e0e0e0", borderRadius: "8px",
                        outline: "none", resize: "vertical", color: "#1a1a1a",
                        fontFamily: "Inter, sans-serif", lineHeight: 1.5
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button style={btnSecondary} onClick={() => setStep(1)}
                      onMouseOver={e => { e.currentTarget.style.borderColor = "#c45e1a"; e.currentTarget.style.color = "#c45e1a"; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.color = "#666"; }}
                    >← Back</button>
                    <button style={{ ...btnPrimary, flex: 1 }} onClick={nextStep}>Review request →</button>
                  </div>
                </div>
              )}

              {/* ── Step 3: Confirm ── */}
              {step === 3 && (
                <div className="fade-up">
                  <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>
                    Confirm your request
                  </h2>
                  <p style={{ fontSize: "13px", color: "#888", margin: "0 0 20px" }}>
                    Double-check the details before submitting.
                  </p>

                  {/* Summary card */}
                  <div style={{
                    background: "#f9f6f3", borderRadius: "12px", padding: "18px",
                    marginBottom: "20px", border: "1px solid #ede5dc"
                  }}>
                    {[
                      { label: "Name", value: name },
                      { label: "Email", value: email },
                      { label: "From", value: formatDate(fromDate) },
                      { label: "To", value: formatDate(toDate) },
                      ...(note ? [{ label: "Note", value: note }] : []),
                    ].map(({ label, value }) => (
                      <div key={label} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                        padding: "8px 0", borderBottom: "1px solid #ede5dc",
                      }}>
                        <span style={{ fontSize: "12px", color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3px", minWidth: "60px" }}>{label}</span>
                        <span style={{ fontSize: "14px", color: "#1a1a1a", fontWeight: 500, textAlign: "right", maxWidth: "260px", wordBreak: "break-word" }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {serverError && (
                    <div style={{
                      background: "#fff0f0", border: "1px solid #f5c6c6",
                      borderRadius: "8px", padding: "10px 14px",
                      fontSize: "13px", color: "#c0392b", marginBottom: "16px"
                    }}>
                      {serverError}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button style={btnSecondary} onClick={() => setStep(2)} disabled={loading}
                      onMouseOver={e => { e.currentTarget.style.borderColor = "#c45e1a"; e.currentTarget.style.color = "#c45e1a"; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.color = "#666"; }}
                    >← Back</button>
                    <button style={{ ...btnPrimary, flex: 1 }} onClick={handleSubmit} disabled={loading}>
                      {loading ? "Submitting…" : "Submit request"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ marginTop: "20px", fontSize: "11px", color: "#bbb", textAlign: "center" }}>
          Divine Silver Pvt Ltd · Internal tool · Requests logged for audit
        </div>
      </div>
    </>
  );
}
