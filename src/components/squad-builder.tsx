"use client";

import { useEffect, useMemo, useState } from "react";
import {
  defaultSquadState,
  operators,
  specializations,
  squadPresets,
  weapons,
  type SquadSlot,
  type SquadState,
} from "../content/squad-data";
import { encodeSquadState, decodeSquadState, evaluateSquad } from "../lib/squad-builder";

const storageKey = "zero-company-squad:v1";
const operatorBySlug = new Map(operators.map((entry) => [entry.slug, entry]));
const specializationBySlug = new Map(specializations.map((entry) => [entry.slug, entry]));
const weaponBySlug = new Map(weapons.map((entry) => [entry.slug, entry]));
const standardSpecializations = specializations.filter((entry) => entry.availability === "standard");

function cloneState(state: SquadState): SquadState {
  return { mode: state.mode, slots: state.slots.map((slot) => ({ ...slot })) };
}

function allowedSpecializations(operatorSlug: string) {
  const operator = operatorBySlug.get(operatorSlug);
  if (operator?.lockedSpecializationSlug) {
    return specializations.filter((entry) => entry.slug === operator.lockedSpecializationSlug);
  }
  return standardSpecializations;
}

function readStoredSquad(): SquadState | undefined {
  try {
    const sharedCode = new URL(window.location.href).searchParams.get("s");
    if (sharedCode) return decodeSquadState(sharedCode);
    const storedCode = window.localStorage.getItem(storageKey);
    return storedCode ? decodeSquadState(storedCode) : undefined;
  } catch {
    return undefined;
  }
}

export function SquadBuilder() {
  const [state, setState] = useState<SquadState>(() => cloneState(defaultSquadState));
  const [feedback, setFeedback] = useState("Source-backed rules loaded. Nothing is uploaded.");
  const evaluation = useMemo(() => evaluateSquad(state), [state]);
  const shareCode = useMemo(() => encodeSquadState(state), [state]);

  useEffect(() => {
    const stored = readStoredSquad();
    if (!stored) return;
    const hasSharedState = new URL(window.location.href).searchParams.has("s");
    const frame = window.requestAnimationFrame(() => {
      setState(cloneState(stored));
      setFeedback(hasSharedState
        ? "Shared squad loaded from this link."
        : "Saved squad restored from this browser.");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const updateSlot = (index: number, patch: Partial<SquadSlot>) => {
    setState((current) => {
      const slots = current.slots.map((slot, slotIndex) => (
        slotIndex === index ? { ...slot, ...patch } : slot
      ));
      return { ...current, slots };
    });
  };

  const changeOperator = (index: number, operatorSlug: string) => {
    const options = allowedSpecializations(operatorSlug);
    const currentSlot = state.slots[index];
    const nextSpecialization = options.some((entry) => entry.slug === currentSlot.specializationSlug)
      ? currentSlot.specializationSlug
      : options[0].slug;
    updateSlot(index, { operatorSlug, specializationSlug: nextSpecialization });
    setFeedback("Readout updated from the selected Operator and legal Specializations.");
  };

  const loadPreset = (presetSlug: string) => {
    const preset = squadPresets.find((entry) => entry.slug === presetSlug);
    if (!preset) return;
    setState(cloneState(preset.state));
    setFeedback(`${preset.name} loaded. Treat it as a starting point, not a solved meta.`);
  };

  const saveSquad = () => {
    try {
      window.localStorage.setItem(storageKey, shareCode);
      setFeedback("Squad saved in this browser. No account or upload was used.");
    } catch {
      setFeedback("This browser blocked local saving. The share code still works.");
    }
  };

  const copyShareLink = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("s", shareCode);
    try {
      await navigator.clipboard.writeText(url.toString());
      setFeedback("Share link copied. It opens this exact four-slot squad.");
    } catch {
      setFeedback("Clipboard access is unavailable. Copy the share code shown below.");
    }
  };

  return (
    <div aria-label="Four-slot squad plan" className="squad-builder">
      <div className="squad-builder__command">
        <div>
          <span className="card-eyebrow">Planner · local only</span>
          <h3>Four-slot squad plan</h3>
          <p>Choose the squad you can actually field, then inspect conflicts and missing jobs before copying a build.</p>
        </div>
        <fieldset className="squad-builder__mode">
          <legend>Mission mode</legend>
          {(["story", "skirmish"] as const).map((mode) => (
            <label key={mode}>
              <input
                checked={state.mode === mode}
                name="squad-mode"
                onChange={() => setState((current) => ({ ...current, mode }))}
                type="radio"
              />
              <span>{mode}</span>
            </label>
          ))}
        </fieldset>
      </div>

      <div className="squad-builder__presets" aria-label="Curated squad presets">
        {squadPresets.map((preset) => (
          <button className="button-chip button-chip--subtle" key={preset.slug} onClick={() => loadPreset(preset.slug)} type="button">
            <strong>{preset.name}</strong>
            <span>{preset.summary}</span>
          </button>
        ))}
      </div>

      <div className="squad-builder__slots">
        {state.slots.map((slot, index) => {
          const specializationOptions = allowedSpecializations(slot.operatorSlug);
          const selectedSpecialization = specializationBySlug.get(slot.specializationSlug);
          return (
            <fieldset className="squad-slot" data-squad-slot={index + 1} key={index}>
              <legend><span>{String(index + 1).padStart(2, "0")}</span> Bay {index + 1}</legend>
              <label>
                <span>Operator</span>
                <select aria-label={`Operator ${index + 1}`} onChange={(event) => changeOperator(index, event.target.value)} value={slot.operatorSlug}>
                  {operators.map((operator) => <option key={operator.slug} value={operator.slug}>{operator.name}</option>)}
                </select>
              </label>
              <label>
                <span>Specialization</span>
                <select
                  aria-label={`Specialization ${index + 1}`}
                  disabled={specializationOptions.length === 1}
                  onChange={(event) => updateSlot(index, { specializationSlug: event.target.value })}
                  value={slot.specializationSlug}
                >
                  {specializationOptions.map((entry) => <option key={entry.slug} value={entry.slug}>{entry.name}</option>)}
                </select>
              </label>
              <label>
                <span>Weapon</span>
                <select aria-label={`Weapon ${index + 1}`} onChange={(event) => updateSlot(index, { weaponSlug: event.target.value })} value={slot.weaponSlug}>
                  {weapons.map((weapon) => <option key={weapon.slug} value={weapon.slug}>{weapon.name}</option>)}
                </select>
              </label>
              <div className="squad-slot__summary">
                <span>{operatorBySlug.get(slot.operatorSlug)?.summary}</span>
                <strong>{selectedSpecialization?.roles.join(" · ")}</strong>
                <small>{weaponBySlug.get(slot.weaponSlug)?.summary}</small>
              </div>
            </fieldset>
          );
        })}
      </div>

      <div className="squad-builder__readout">
        <section className="squad-readout" aria-labelledby="squad-findings-title">
          <div className="squad-readout__head">
            <div>
              <span className="card-eyebrow">Rules first</span>
              <h3 id="squad-findings-title">Findings</h3>
            </div>
            <span>{evaluation.findings.length} active</span>
          </div>
          <div className="squad-findings">
            {evaluation.findings.map((finding) => (
              <article className={`squad-finding squad-finding--${finding.severity}`} key={finding.id}>
                <div><span>{finding.evidence}</span><strong>{finding.title}</strong></div>
                <p>{finding.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="squad-readout" aria-labelledby="squad-dimensions-title">
          <div className="squad-readout__head">
            <div>
              <span className="card-eyebrow">No overall score</span>
              <h3 id="squad-dimensions-title">Seven-dimension readout</h3>
            </div>
          </div>
          <div className="squad-dimensions">
            {evaluation.dimensions.map((dimension) => (
              <div className="squad-dimension" data-status={dimension.status} key={dimension.id}>
                <div><strong>{dimension.label}</strong><span>{dimension.status}</span></div>
                <p>{dimension.reason}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="squad-builder__share">
        <div>
          <span className="card-eyebrow">Portable plan</span>
          <label htmlFor="squad-share-code">Squad share code</label>
          <input id="squad-share-code" readOnly value={shareCode} />
          <p aria-live="polite">{feedback}</p>
        </div>
        <div className="squad-builder__actions">
          <button className="button-chip button-chip--primary" onClick={copyShareLink} type="button">Copy share link</button>
          <button className="button-chip button-chip--ghost" onClick={saveSquad} type="button">Save in browser</button>
          <button
            className="button-chip button-chip--subtle"
            onClick={() => {
              setState(cloneState(defaultSquadState));
              setFeedback("Balanced first-run preset restored.");
            }}
            type="button"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
