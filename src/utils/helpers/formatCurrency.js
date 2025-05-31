/**
 * Format a number as Vietnamese currency (VND)
 * @param {number} amount - The amount to format
 * @returns {string} The formatted amount with VND currency symbol
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "0 VNĐ";

  // Ensure the amount is treated as a number
  const numAmount = Number(amount);

  // Format the number with thousand separators
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
};

/**
 * Format a number as US Dollars (USD)
 * @param {number} amount - The amount to format
 * @returns {string} The formatted amount with USD currency symbol
 */
export const formatUSD = (amount) => {
  if (!amount && amount !== 0) return "$0.00";

  // Ensure the amount is treated as a number
  const numAmount = Number(amount);

  // Format the number as USD
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
};
