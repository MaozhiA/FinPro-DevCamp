export const CATEGORY_LIST = [
  "all",
  "insurance",
  "investments",
  "device contracts",
];

export const categorizeProduct = (product) => {
  const text = `${product.name} ${product.description}`.toLowerCase();

  if (text.includes("device contract")) return "device contracts";
  if (text.includes("insurance")) return "insurance";
  if (text.includes("investment")) return "investments";

  return "other";
};