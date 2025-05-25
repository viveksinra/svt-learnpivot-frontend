// Utility functions for mock test reports

// Function to calculate standardized score
export const calculateStandardizedScore = (mathScore, englishScore, totalFactor = 3.5, englishFactor = 1.1) => {
  return (mathScore * totalFactor) + (englishScore * englishFactor * totalFactor);
};

// Function to get status color based on score and thresholds
export const getStatusColor = (score, thresholds) => {
  if (!thresholds) return { color: '#757575', label: 'N/A', background: '#f5f5f5' };
  
  if (score >= thresholds.safe) return { color: '#2e7d32', label: 'Safe', background: '#e8f5e9' };
  if (score >= thresholds.borderline) return { color: '#ed6c02', label: 'Borderline', background: '#fff3e0' };
  return { color: '#d32f2f', label: 'Concern', background: '#ffebee' };
};

// Function to get selection chance based on standardized score and threshold
export const getSelectionChance = (standardizedScore, threshold) => {
  if (!threshold) return 'N/A';
  if (standardizedScore >= threshold.safe) return 'Safe';
  if (standardizedScore >= threshold.borderline) return 'Borderline';
  return 'Concern';
};

// Function to get performance grade based on boundaries
export const getPerformanceGrade = (score, subject, performanceBoundaries) => {
  if (!performanceBoundaries) return { label: 'N/A', color: '#757575' };
  
  // Handle Total Score differently
  if (subject.toLowerCase().includes('total')) {
    // For total score, combine math and english boundaries
    const mathBoundaries = performanceBoundaries.math;
    const englishBoundaries = performanceBoundaries.english;
    
    if (!mathBoundaries || !englishBoundaries) return { label: 'N/A', color: '#757575' };
    
    // Create combined boundaries for total score
    const totalExcellent = mathBoundaries.excellent + englishBoundaries.excellent;
    const totalGood = mathBoundaries.good + englishBoundaries.good;
    const totalAverage = mathBoundaries.average + englishBoundaries.average;
    
    if (score >= totalExcellent) return { label: 'Excellent', color: '#2e7d32' };
    if (score >= totalGood) return { label: 'Good', color: '#1976d2' };
    if (score >= totalAverage) return { label: 'Average', color: '#ed6c02' };
    return { label: 'Concern', color: '#d32f2f' };
  }
  
  // Handle individual subjects
  let subjectKey;
  if (subject.toLowerCase().includes('mathematics') || subject.toLowerCase().includes('math')) {
    subjectKey = 'math';
  } else if (subject.toLowerCase().includes('english')) {
    subjectKey = 'english';
  } else {
    return { label: 'N/A', color: '#757575' };
  }
  
  const boundaries = performanceBoundaries[subjectKey];
  
  if (!boundaries) return { label: 'N/A', color: '#757575' };
  
  if (score >= boundaries.excellent) return { label: 'Excellent', color: '#2e7d32' };
  if (score >= boundaries.good) return { label: 'Good', color: '#1976d2' };
  if (score >= boundaries.average) return { label: 'Average', color: '#ed6c02' };
  return { label: 'Concern', color: '#d32f2f' };
};

// Function to get rank color based on rank and total
export const getRankColor = (rank, total) => {
  const percentage = (rank / total) * 100;
  if (percentage <= 10) return '#4caf50'; // Top 10% - Green
  if (percentage <= 25) return '#2196f3'; // Top 25% - Blue
  if (percentage <= 50) return '#ff9800'; // Top 50% - Orange
  return '#f44336'; // Bottom 50% - Red
};

// Function to format school name
export const formatSchoolName = (school) => {
  // Special case for abbreviations
  if (school.toUpperCase() === 'KEGS') return 'KEGS';
  
  // Convert camelCase to Title Case (e.g., "westcliff" -> "Westcliff")
  return school.charAt(0).toUpperCase() + 
         school.slice(1).replace(/([A-Z])/g, ' $1');
};

// Function to evaluate school selection chances based on standardized score and thresholds
export const evaluateSchoolChances = (report) => {
  if (!report) return {};

  // Calculate standardized score instead of total score
  const standardizedScore = calculateStandardizedScore(
    report.childScore?.mathsScore || 0,
    report.childScore?.englishScore || 0,
    report.totalFactor || 3.5,
    report.englishFactor || 1.1
  );
  
  // Determine which thresholds to use based on gender
  const isGirl = report.childScore?.childGender === 'Girl';
  const thresholds = isGirl ? report.girlsScoreThresholds : report.boysScoreThresholds;
  
  if (!thresholds) return {};

  // For each school, determine the chance level for both inside and outside
  const chances = {};
  const schoolKeys = Object.keys(thresholds || {});
  
  schoolKeys.forEach(school => {
    // Create an entry for the school with both inside and outside chances
    chances[school] = { 
      inside: evaluateChanceLevel(standardizedScore, thresholds[school]?.inside),
      outside: evaluateChanceLevel(standardizedScore, thresholds[school]?.outside)
    };
  });
  
  return chances;
};

// Helper function to evaluate chance level based on standardized score and thresholds
export const evaluateChanceLevel = (standardizedScore, thresholds) => {
  if (!thresholds) return null;
  
  if (standardizedScore >= thresholds.safe) {
    return { 
      level: 'safe', 
      label: 'High Chance', 
      color: '#4caf50',
      threshold: thresholds.safe 
    };
  } else if (standardizedScore >= thresholds.borderline) {
    return { 
      level: 'borderline', 
      label: 'Borderline', 
      color: '#ff9800',
      threshold: thresholds.borderline 
    };
  } else {
    return { 
      level: 'concern', 
      label: 'Needs Improvement', 
      color: '#f44336',
      threshold: thresholds.borderline // Show borderline threshold as target
    };
  }
}; 