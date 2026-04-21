/**
 * Format a number as USD currency
 * @param {number} amount
 * @returns {string} e.g. "$8.99"
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
