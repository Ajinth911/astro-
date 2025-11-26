// App.jsx
import { useState } from "react";

function App() {
  const [form, setForm] = useState({
    name: "",
    date: "",
    time: "",
    place: "",
    latitude: "8.0883",    // default Kanyakumari
    longitude: "77.5385",
    timezone_offset: "5.5", // IST
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("astroai-production-d20e.up.railway.app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
          timezone_offset: parseFloat(form.timezone_offset),
        }),
      });

      if (!res.ok) {
        throw new Error("Server error. Check backend console.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const downloadChart = () => {
    if (!result?.chart_png_base64) return;
    const a = document.createElement("a");
    a.href = result.chart_png_base64;
    a.download = `${form.name || "birth-chart"}.png`;
    a.click();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#050816,#121212)",
        color: "#f5f5f5",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background:
            "radial-gradient(circle at top,#1f2937 0,#020617 45%,#020617 100%)",
          borderRadius: "18px",
          padding: "24px 24px 32px",
          boxShadow: "0 18px 45px rgba(0,0,0,0.6)",
          border: "1px solid rgba(148,163,184,0.2)",
        }}
      >
        <header style={{ marginBottom: "20px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              marginBottom: "6px",
            }}
          >
            Astrology AI – Professional Birth Chart
          </h1>
          <p style={{ color: "#cbd5f5", fontSize: "14px" }}>
            Enter birth details to generate an accurate Vedic chart, personality
            analysis, and a shareable chart image.
          </p>
        </header>

        {/* Form + Chart section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
            gap: "20px",
          }}
        >
          {/* Form */}
          <section
            style={{
              background: "rgba(15,23,42,0.9)",
              borderRadius: "14px",
              padding: "16px 16px 18px",
              border: "1px solid rgba(55,65,81,0.8)",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              Birth Details
            </h2>
            <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: 12 }}>
              Time should be as accurate as possible for correct Lagna & houses.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
              <div style={{ display: "grid", gap: "8px" }}>
                <label style={{ fontSize: "13px" }}>
                  Name
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    style={inputStyle}
                  />
                </label>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontSize: "13px" }}>
                    Date of Birth
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </label>
                  <label style={{ fontSize: "13px" }}>
                    Time of Birth
                    <input
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </label>
                </div>

                <label style={{ fontSize: "13px" }}>
                  Place of Birth
                  <input
                    name="place"
                    value={form.place}
                    onChange={handleChange}
                    placeholder="Kanyakumari, Tamil Nadu"
                    required
                    style={inputStyle}
                  />
                </label>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontSize: "12px" }}>
                    Latitude
                    <input
                      name="latitude"
                      value={form.latitude}
                      onChange={handleChange}
                      style={inputStyleSmall}
                    />
                  </label>
                  <label style={{ fontSize: "12px" }}>
                    Longitude
                    <input
                      name="longitude"
                      value={form.longitude}
                      onChange={handleChange}
                      style={inputStyleSmall}
                    />
                  </label>
                  <label style={{ fontSize: "12px" }}>
                    Timezone (hrs)
                    <input
                      name="timezone_offset"
                      value={form.timezone_offset}
                      onChange={handleChange}
                      style={inputStyleSmall}
                    />
                  </label>
                </div>
              </div>

              {error && (
                <div
                  style={{
                    marginTop: 6,
                    padding: "6px 8px",
                    fontSize: "12px",
                    borderRadius: "8px",
                    background: "rgba(239,68,68,0.1)",
                    color: "#fecaca",
                    border: "1px solid rgba(239,68,68,0.4)",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 6,
                  padding: "10px 14px",
                  borderRadius: "999px",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: loading ? "default" : "pointer",
                  background:
                    "linear-gradient(135deg,#f97316,#ec4899,#6366f1)",
                  color: "white",
                  boxShadow: "0 10px 25px rgba(59,130,246,0.3)",
                  opacity: loading ? 0.6 : 1,
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
              >
                {loading ? "Calculating chart..." : "Generate Reading"}
              </button>
            </form>
          </section>

          {/* Chart */}
          <section
            style={{
              background: "rgba(15,23,42,0.9)",
              borderRadius: "14px",
              padding: "16px",
              border: "1px solid rgba(55,65,81,0.8)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: result ? "flex-start" : "center",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "10px",
                alignSelf: "flex-start",
              }}
            >
              Birth Chart
            </h2>

            {!result && (
              <p
                style={{
                  fontSize: "13px",
                  color: "#9ca3af",
                  textAlign: "center",
                }}
              >
                Your generated South-Indian style chart image will appear here
                after you submit your birth details.
              </p>
            )}

            {result && (
              <>
                <img
                  src={result.chart_png_base64}
                  alt="Birth Chart"
                  style={{
                    maxWidth: "100%",
                    borderRadius: "10px",
                    border: "1px solid rgba(148,163,184,0.4)",
                    marginBottom: "10px",
                  }}
                />
                <button
                  onClick={downloadChart}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "999px",
                    border: "1px solid rgba(148,163,184,0.6)",
                    background: "transparent",
                    color: "#e5e7eb",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  ⬇ Download Chart PNG
                </button>

                {result.chart && (
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      marginTop: "10px",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    <strong>Lagna:</strong> {result.chart.lagna_sign}{" "}
                    &nbsp;•&nbsp; <strong>Moon:</strong>{" "}
                    {result.chart.moon_sign}
                  </p>
                )}
              </>
            )}
          </section>
        </div>

        {/* Report section */}
        {result && (
          <section
            style={{
              marginTop: "24px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            <ReportCard title="Personality" text={result.report.personality} />
            <ReportCard title="Career" text={result.report.career} />
            <ReportCard
              title="Relationships"
              text={result.report.relationships}
            />
            <ReportCard title="Health" text={result.report.health} />
          </section>
        )}

        {result && (
          <p
            style={{
              marginTop: "18px",
              fontSize: "11px",
              color: "#6b7280",
              lineHeight: 1.5,
            }}
          >
            {result.report.disclaimer}
          </p>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: "4px",
  padding: "8px 10px",
  borderRadius: "10px",
  border: "1px solid rgba(75,85,99,0.9)",
  backgroundColor: "rgba(15,23,42,0.9)",
  color: "#e5e7eb",
  fontSize: "13px",
};

const inputStyleSmall = {
  ...inputStyle,
  fontSize: "12px",
  padding: "6px 8px",
};

function ReportCard({ title, text }) {
  return (
    <div
      style={{
        background: "rgba(15,23,42,0.9)",
        borderRadius: "14px",
        padding: "14px 14px 16px",
        border: "1px solid rgba(55,65,81,0.9)",
        fontSize: "13px",
        lineHeight: 1.6,
      }}
    >
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 600,
          marginBottom: "6px",
          color: "#e5e7eb",
        }}
      >
        {title}
      </h3>
      <p style={{ whiteSpace: "pre-wrap", color: "#d1d5db" }}>{text}</p>
    </div>
  );
}

export default App;

