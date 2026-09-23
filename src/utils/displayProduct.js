const GRADIENTS = [
  "from-rose-100 to-pink-50",
  "from-emerald-100 to-teal-50",
  "from-amber-100 to-orange-50",
  "from-purple-100 to-violet-50",
  "from-slate-100 to-gray-50",
  "from-blue-100 to-cyan-50",
  "from-teal-100 to-green-50",
  "from-orange-100 to-amber-50",
];

/** Adapts a backend ProductDto to the shape ProductCard expects. */
export function toDisplayProduct(p) {
  const idx = p.id.codePointAt(p.id.length - 1) % GRADIENTS.length;
  return {
    ...p,
    gradient: GRADIENTS[idx],
    tag: p.stock === 0 ? "Sold Out" : (p.category ?? "Featured"),
    rating: 4.8,
    reviews: 0,
  };
}
