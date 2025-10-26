"use client";

import { useMemo, useState } from "react";

type PatternMode = "repeat" | "wave" | "grid";

const PATTERN_LABELS: Record<PatternMode, string> = {
  repeat: "Infinite Repeat",
  wave: "Sine Wave",
  grid: "Grid Burst"
};

const MAX_VARIATIONS = 12;

export default function Home() {
  const [seed, setSeed] = useState("asdf");
  const [mode, setMode] = useState<PatternMode>("repeat");
  const [variations, setVariations] = useState(6);
  const [uppercase, setUppercase] = useState(false);
  const [mirror, setMirror] = useState(true);

  const palette = useMemo(() => {
    const base = seed.trim() || "asdf";
    const normalized = uppercase ? base.toUpperCase() : base.toLowerCase();
    const mirrorComponent = mirror ? normalized.split("").reverse().join("") : "";
    return Array.from({ length: variations }, (_, idx) => {
      const intensity = (idx + 1) / variations;
      const gradientShift = Math.round(180 * intensity);
      const display = `${normalized}${mirrorComponent}`.repeat(idx % 3 === 0 ? 2 : 1);
      return {
        key: `${mode}-${idx}`,
        hue: (gradientShift * 2) % 360,
        intensity,
        display: transformDisplay(display, mode, idx)
      };
    });
  }, [mirror, mode, seed, uppercase, variations]);

  return (
    <main>
      <section className="hero">
        <div className="hero__badge">asdf</div>
        <h1>Shape shifting the humble “asdf” into expressive patterns</h1>
        <p>
          Experiment with symmetry, rhythm, and motion inspired by the classic keyboard warmup.
          Tweak the controls and watch the typography evolve instantly.
        </p>
      </section>

      <section className="panel">
        <header className="panel__header">
          <h2>Pattern controls</h2>
          <p>Fine tune the output to discover fresh textures and looping motifs.</p>
        </header>

        <div className="controls">
          <label className="field">
            <span>Seed phrase</span>
            <input
              value={seed}
              onChange={(event) => setSeed(event.target.value)}
              placeholder="asdf"
              maxLength={16}
            />
          </label>

          <label className="field">
            <span>Variations ({variations})</span>
            <input
              type="range"
              min={3}
              max={MAX_VARIATIONS}
              step={1}
              value={variations}
              onChange={(event) => setVariations(Number(event.target.value))}
            />
          </label>

          <div className="toggle-group">
            <Toggle label="Uppercase" active={uppercase} onToggle={() => setUppercase(!uppercase)} />
            <Toggle label="Mirror" active={mirror} onToggle={() => setMirror(!mirror)} />
          </div>

          <fieldset className="mode-selector">
            <legend>Mode</legend>
            <div className="mode-selector__grid">
              {Object.entries(PATTERN_LABELS).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`mode-tile${mode === value ? " mode-tile--active" : ""}`}
                  onClick={() => setMode(value as PatternMode)}
                >
                  <span>{label}</span>
                  <small>{previewCaption(value as PatternMode)}</small>
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      <section className="gallery">
        {palette.map((entry, idx) => (
          <article
            key={entry.key}
            className="card"
            style={
              {
                "--card-hue": `${entry.hue}`,
                "--card-alpha": `${0.3 + entry.intensity * 0.7}`
              } as React.CSSProperties
            }
          >
            <header>
              <span className="card__title">
                {PATTERN_LABELS[mode]} #{idx + 1}
              </span>
              <span className="card__meta">{seed || "asdf"}</span>
            </header>
            <pre aria-label={`Pattern ${idx + 1}`}>{entry.display}</pre>
          </article>
        ))}
      </section>
    </main>
  );
}

function Toggle({
  label,
  active,
  onToggle
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className={`toggle${active ? " toggle--active" : ""}`}
      onClick={onToggle}
      aria-pressed={active}
    >
      <span className="toggle__dot" />
      {label}
    </button>
  );
}

function transformDisplay(template: string, mode: PatternMode, idx: number) {
  const characters = template.split("");
  if (mode === "repeat") {
    return characters.join(" ");
  }
  if (mode === "wave") {
    const amplitude = Math.max(1, (idx % 4) + 1);
    return characters
      .map((char, index) => `${" ".repeat((Math.sin(index / amplitude) + 1) * amplitude)}${char}`)
      .join("\n");
  }
  if (mode === "grid") {
    const size = Math.min(4 + idx, 12);
    const block = characters.slice(0, size);
    const rows = [];
    for (let row = 0; row < size; row += 1) {
      rows.push(block.map((char, column) => (column % 2 === row % 2 ? char.toUpperCase() : char)).join(" "));
    }
    return rows.join("\n");
  }
  return template;
}

function previewCaption(mode: PatternMode) {
  switch (mode) {
    case "repeat":
      return "Steady rhythm & spacing";
    case "wave":
      return "Curved vertical motion";
    case "grid":
      return "Layered checkerboard pulse";
    default:
      return "";
  }
}
