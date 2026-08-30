type TierRow = {
  tier: "S" | "A" | "B" | "C" | "D";
  label: string;
  items: string[];
};

type ClassTierBoardProps = {
  rows?: TierRow[];
  footnote?: string;
};

const defaultRows: TierRow[] = [
  {
    tier: "S",
    label: "Broad squad value",
    items: ["Scoundrel", "Scout", "Medic"],
  },
  {
    tier: "A",
    label: "Reliable tempo",
    items: ["Gunslinger", "Soldier", "Assault"],
  },
  {
    tier: "B",
    label: "Mission-dependent payoff",
    items: ["Heavy", "Sharpshooter"],
  },
];

const tierColorClass: Record<TierRow["tier"], string> = {
  S: "var(--tier-s)",
  A: "var(--tier-a)",
  B: "var(--tier-b)",
  C: "var(--tier-c)",
  D: "var(--tier-d)",
};

export function ClassTierBoard({
  rows = defaultRows,
  footnote = "Default rows mirror the launch community synthesis in the registry until a richer tier-row data model exists.",
}: ClassTierBoardProps) {
  return (
    <div className="tier-board">
      {rows.map((row) => (
        <div className="tier-board__row" key={row.tier}>
          <div
            className="tier-board__badge"
            style={{ backgroundColor: tierColorClass[row.tier] }}
          >
            {row.tier}
          </div>
          <div className="tier-board__body">
            <p className="tier-board__label">{row.label}</p>
            <div className="tier-board__items">
              {row.items.map((item) => (
                <div className="tier-board__chip" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      <p className="tier-board__footnote">{footnote}</p>
    </div>
  );
}
