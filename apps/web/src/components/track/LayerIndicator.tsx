/**
 * LayerIndicator — compact clickable stack of bars showing how many
 * layers are recorded on a track. Clicking opens the LayersDrawer.
 */
export const MAX_LAYER_INDICATOR_BARS = 4;

export const LayerIndicator = ({
  count,
  accent,
  onClick,
}: {
  count: number;
  accent: string;
  onClick: () => void;
}) => {
  if (count === 0) return null;
  return (
    <button
      onClick={onClick}
      title={`View ${count} layer${count !== 1 ? "s" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        gap: 3,
        alignItems: "center",
        padding: "5px 3px",
        background: "rgba(255,255,255,0.04)",
        borderRadius: 4,
        border: `1px solid ${accent}40`,
        marginLeft: 4,
        cursor: "pointer",
        transition: "all 0.2s ease",
        outline: "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = `${accent}18`;
        (e.currentTarget as HTMLElement).style.borderColor = `${accent}80`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background =
          "rgba(255,255,255,0.04)";
        (e.currentTarget as HTMLElement).style.borderColor = `${accent}40`;
      }}
    >
      {Array.from({ length: MAX_LAYER_INDICATOR_BARS }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 7,
            height: 2.5,
            borderRadius: 1,
            background: i <= count - 1 ? accent : "rgba(255,255,255,0.12)",
            boxShadow: i <= count - 1 ? `0 0 8px ${accent}80` : "none",
            transition: "all 0.2s ease",
          }}
        />
      ))}
      {count > MAX_LAYER_INDICATOR_BARS && (
        <span
          style={{ fontSize: 9, color: accent, fontWeight: 900, marginTop: -2 }}
        >
          +
        </span>
      )}
    </button>
  );
};
