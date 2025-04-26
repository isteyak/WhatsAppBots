const { format, parse, isValid, addDays } = require("date-fns");

/**
 * Parses user-provided date string into Date object
 * @param {string} dateStr - Date string (DD/MM, DD-MM, today, tomorrow, etc.)
 * @returns {Date|null} Parsed date or null if invalid
 */
function parseDate(dateStr) {
  if (!dateStr) return null;

  // Handle relative dates
  const lowerStr = dateStr.toLowerCase().trim();
  if (lowerStr === "today") return new Date();
  if (lowerStr === "tomorrow") return addDays(new Date(), 1);

  // Handle absolute dates (DD/MM or DD-MM)
  const dateFormat = /^(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?$/;
  const match = dateStr.match(dateFormat);

  if (!match) return null;

  const [, day, month, year] = match;
  const currentYear = new Date().getFullYear();
  const parsedYear = year
    ? year.length === 2
      ? 2000 + parseInt(year)
      : parseInt(year)
    : currentYear;

  try {
    const parsedDate = parse(
      `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${parsedYear}`,
      "dd/MM/yyyy",
      new Date()
    );
    return isValid(parsedDate) ? parsedDate : null;
  } catch {
    return null;
  }
}

module.exports = { parseDate };
