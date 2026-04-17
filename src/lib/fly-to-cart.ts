export function flyToCart(sourceEl: HTMLElement | null, targetId = "cart-target") {
  if (typeof window === "undefined" || !sourceEl) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const target = document.getElementById(targetId);
  if (!target) return;

  const from = sourceEl.getBoundingClientRect();
  const to = target.getBoundingClientRect();

  const clone = sourceEl.cloneNode(true) as HTMLElement;
  clone.style.position = "fixed";
  clone.style.left = `${from.left}px`;
  clone.style.top = `${from.top}px`;
  clone.style.width = `${from.width}px`;
  clone.style.height = `${from.height}px`;
  clone.style.margin = "0";
  clone.style.pointerEvents = "none";
  clone.style.zIndex = "9999";
  clone.style.borderRadius = "50%";
  clone.style.overflow = "hidden";
  clone.style.boxShadow = "0 20px 50px rgba(0,0,0,0.25)";
  clone.style.transition = "none";
  document.body.appendChild(clone);

  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);

  const animation = clone.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.4}px, ${dy * 0.2 - 80}px) scale(0.6)`, opacity: 0.9, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.15)`, opacity: 0 },
    ],
    { duration: 700, easing: "cubic-bezier(0.5, 0, 0.75, 0)", fill: "forwards" },
  );

  animation.onfinish = () => {
    clone.remove();
    target.classList.remove("cart-bump");
    // force reflow so animation restarts
    void target.offsetWidth;
    target.classList.add("cart-bump");
    setTimeout(() => target.classList.remove("cart-bump"), 600);
  };
}
