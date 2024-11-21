import moment from 'moment';

export function validateCSV(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return { isValid: false, error: 'Empty or invalid data' };
  }

  // Check required columns
  if (!data[0].hasOwnProperty('ds') || !data[0].hasOwnProperty('y')) {
    return { isValid: false, error: 'Missing required columns: ds and y' };
  }

  // Validate each row
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const date = moment(row.ds);
    const value = parseFloat(row.y);

    if (!date.isValid()) {
      return { isValid: false, error: `Invalid date format in row ${i + 1}` };
    }

    if (isNaN(value)) {
      return { isValid: false, error: `Invalid numeric value in row ${i + 1}` };
    }
  }

  return { isValid: true };
}