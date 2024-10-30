export function calculateAverageConfidence(obj: any) {
  const confidences: number[] = [];

  function extractConfidences(obj: any) {
    for (const key in obj) {
      if (key === 'confidence' && typeof obj[key] === 'number') {
        if (obj[key] !== 0) confidences.push(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        extractConfidences(obj[key]);
      }
    }
  }

  extractConfidences(obj);

  const sum = confidences.reduce((acc, val) => acc + val, 0);
  const average = confidences.length ? sum / confidences.length : 0;
  return Math.floor(average * 100);
}