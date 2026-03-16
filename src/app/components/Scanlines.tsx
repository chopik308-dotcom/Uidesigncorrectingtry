export function Scanlines() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            rgba(233, 233, 228, 0.03) 0px,
            rgba(233, 233, 228, 0.03) 1px,
            transparent 1px,
            transparent 2px
          )`,
        }}
      />
    </div>
  );
}
