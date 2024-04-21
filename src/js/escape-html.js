/**
 * Prevent accidental markup where text is expected
 * @function escapeHtml
 * @param  {String} text The text to be escaped
 * @return {String} The escaped text with no HTML markup
 */
export const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    // eslint-disable-next-line quotes
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (m) => map[m]);
};
