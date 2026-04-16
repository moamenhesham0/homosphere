const US_STATE_TILES = [
  { code: 'AK', name: 'Alaska', row: 0, col: 0 },
  { code: 'HI', name: 'Hawaii', row: 1, col: 0 },
  { code: 'WA', name: 'Washington', row: 0, col: 2 },
  { code: 'OR', name: 'Oregon', row: 1, col: 2 },
  { code: 'CA', name: 'California', row: 2, col: 2 },
  { code: 'ID', name: 'Idaho', row: 1, col: 3 },
  { code: 'NV', name: 'Nevada', row: 2, col: 3 },
  { code: 'AZ', name: 'Arizona', row: 3, col: 3 },
  { code: 'MT', name: 'Montana', row: 0, col: 4 },
  { code: 'WY', name: 'Wyoming', row: 1, col: 4 },
  { code: 'UT', name: 'Utah', row: 2, col: 4 },
  { code: 'CO', name: 'Colorado', row: 2, col: 5 },
  { code: 'NM', name: 'New Mexico', row: 3, col: 5 },
  { code: 'ND', name: 'North Dakota', row: 0, col: 6 },
  { code: 'SD', name: 'South Dakota', row: 1, col: 6 },
  { code: 'NE', name: 'Nebraska', row: 2, col: 6 },
  { code: 'KS', name: 'Kansas', row: 3, col: 6 },
  { code: 'OK', name: 'Oklahoma', row: 4, col: 6 },
  { code: 'TX', name: 'Texas', row: 5, col: 6 },
  { code: 'MN', name: 'Minnesota', row: 0, col: 7 },
  { code: 'IA', name: 'Iowa', row: 1, col: 7 },
  { code: 'MO', name: 'Missouri', row: 2, col: 7 },
  { code: 'AR', name: 'Arkansas', row: 3, col: 7 },
  { code: 'LA', name: 'Louisiana', row: 4, col: 7 },
  { code: 'WI', name: 'Wisconsin', row: 0, col: 8 },
  { code: 'IL', name: 'Illinois', row: 1, col: 8 },
  { code: 'KY', name: 'Kentucky', row: 2, col: 9 },
  { code: 'TN', name: 'Tennessee', row: 3, col: 9 },
  { code: 'MS', name: 'Mississippi', row: 4, col: 8 },
  { code: 'AL', name: 'Alabama', row: 4, col: 9 },
  { code: 'MI', name: 'Michigan', row: 0, col: 9 },
  { code: 'IN', name: 'Indiana', row: 1, col: 9 },
  { code: 'OH', name: 'Ohio', row: 1, col: 10 },
  { code: 'WV', name: 'West Virginia', row: 2, col: 10 },
  { code: 'VA', name: 'Virginia', row: 3, col: 10 },
  { code: 'NC', name: 'North Carolina', row: 3, col: 11 },
  { code: 'SC', name: 'South Carolina', row: 4, col: 11 },
  { code: 'GA', name: 'Georgia', row: 4, col: 10 },
  { code: 'FL', name: 'Florida', row: 5, col: 11 },
  { code: 'PA', name: 'Pennsylvania', row: 1, col: 11 },
  { code: 'NY', name: 'New York', row: 0, col: 11 },
  { code: 'NJ', name: 'New Jersey', row: 1, col: 12 },
  { code: 'DE', name: 'Delaware', row: 2, col: 12 },
  { code: 'MD', name: 'Maryland', row: 2, col: 11 },
  { code: 'CT', name: 'Connecticut', row: 1, col: 13 },
  { code: 'RI', name: 'Rhode Island', row: 2, col: 13 },
  { code: 'MA', name: 'Massachusetts', row: 0, col: 13 },
  { code: 'VT', name: 'Vermont', row: 0, col: 12 },
  { code: 'NH', name: 'New Hampshire', row: 0, col: 14 },
  { code: 'ME', name: 'Maine', row: 1, col: 14 },
];

const US_STATES_BY_CODE = Object.fromEntries(US_STATE_TILES.map((state) => [state.code, state]));
const US_STATE_NAME_TO_CODE = Object.fromEntries(
  US_STATE_TILES.map((state) => [state.name.toUpperCase(), state.code]),
);

function toStateCode(value) {
  const normalized = String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/\./g, '')
    .replace(/\s+/g, ' ');

  if (!normalized) {
    return '';
  }

  if (US_STATES_BY_CODE[normalized]) {
    return normalized;
  }

  return US_STATE_NAME_TO_CODE[normalized] || '';
}

export { US_STATE_TILES, US_STATES_BY_CODE, toStateCode };

