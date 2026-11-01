const StaticBackground = () => (
  <div
    aria-hidden="true"
    className="fixed inset-0 -z-20 bg-bg pointer-events-none"
    style={{
      backgroundImage: [
        "radial-gradient(ellipse at 20% 10%, rgb(var(--accent) / 0.12), transparent 55%)",
        "radial-gradient(circle, rgb(var(--text) / 0.08) 1px, transparent 1px)",
      ].join(", "),
      backgroundSize: "100% 100%, 28px 28px",
    }}
  />
)

export default StaticBackground
