const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export const toFullDate = (str) => {
  const d = new Date(str);
  return `${String(d.getDate()).padStart(2,'0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

export const toShortDate = (str) => {
  const d = new Date(str);
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
};

export const extractYear = (str) => String(new Date(str).getFullYear());

export const formatRating = (val) => typeof val === 'number' ? val.toFixed(1) : '0.0';
