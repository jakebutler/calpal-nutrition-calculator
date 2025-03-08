document.addEventListener('DOMContentLoaded', function() {
  // Tab switching functionality
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      this.classList.add('active');
      const tabName = this.getAttribute('data-tab');
      document.getElementById(`${tabName}-tab`).classList.add('active');
    });
  });
  
  // Protein Calculator Tab Elements
  const proteinAgeInput = document.getElementById('protein-age');
  const proteinGenderSelect = document.getElementById('protein-gender');
  const proteinHeightInput = document.getElementById('protein-height-inches');
  const proteinWeightInput = document.getElementById('protein-weight');
  const proteinLowInput = document.getElementById('protein-low');
  const proteinHighInput = document.getElementById('protein-high');
  const proteinCalculateBtn = document.getElementById('protein-calculate-btn');
  const proteinResultContainer = document.getElementById('protein-result-container');
  const proteinResultDiv = document.getElementById('protein-result');
  const proteinExplanationDiv = document.getElementById('protein-explanation');
  
  // Protein Error Elements
  const proteinAgeError = document.getElementById('protein-age-error');
  const proteinGenderError = document.getElementById('protein-gender-error');
  const proteinHeightError = document.getElementById('protein-height-error');
  const proteinWeightError = document.getElementById('protein-weight-error');
  const proteinRangeError = document.getElementById('protein-range-error');
  
  // Calories Calculator Tab Elements
  const caloriesAgeInput = document.getElementById('calories-age');
  const caloriesGenderSelect = document.getElementById('calories-gender');
  const caloriesHeightInput = document.getElementById('calories-height-inches');
  const caloriesWeightInput = document.getElementById('calories-weight');
  const activityLevelSelect = document.getElementById('activity-level');
  const proteinPercentInput = document.getElementById('protein-percent');
  const carbPercentInput = document.getElementById('carb-percent');
  const fatPercentInput = document.getElementById('fat-percent');
  const caloriesCalculateBtn = document.getElementById('calories-calculate-btn');
  const caloriesResultContainer = document.getElementById('calories-result-container');
  const dailyCaloriesSpan = document.getElementById('daily-calories');
  const proteinCaloriesSpan = document.getElementById('protein-calories');
  const carbCaloriesSpan = document.getElementById('carb-calories');
  const fatCaloriesSpan = document.getElementById('fat-calories');
  
  // Calories Error Elements
  const caloriesAgeError = document.getElementById('calories-age-error');
  const caloriesGenderError = document.getElementById('calories-gender-error');
  const caloriesHeightError = document.getElementById('calories-height-error');
  const caloriesWeightError = document.getElementById('calories-weight-error');
  const activityError = document.getElementById('activity-error');
  const macroError = document.getElementById('macro-error');
  
  // Protein Calculator Button Click Handler
  proteinCalculateBtn.addEventListener('click', function() {
    // Reset error messages
    resetProteinErrors();
    
    // Validate inputs
    if (!validateProteinInputs()) {
      return;
    }
    
    // Get input values
    const age = parseInt(proteinAgeInput.value);
    const gender = proteinGenderSelect.value;
    const heightInches = parseFloat(proteinHeightInput.value);
    const weight = parseFloat(proteinWeightInput.value);
    const proteinLowFactor = parseFloat(proteinLowInput.value);
    const proteinHighFactor = parseFloat(proteinHighInput.value);
    
    // Calculate Ideal Body Weight (IBW)
    let ibw;
    if (gender === 'male') {
      ibw = 50 + (2.3 * Math.max(0, heightInches - 60));
    } else {
      ibw = 45.5 + (2.3 * Math.max(0, heightInches - 60));
    }
    
    // Convert weights to kg
    const weightKg = weight / 2.2;
    const ibwKg = ibw;
    
    // Calculate Adjusted Body Weight (ABW)
    const abw = ibwKg + (0.4 * (weightKg - ibwKg));
    
    // Calculate protein range using user-provided factors
    const proteinLow = abw * proteinLowFactor;
    const proteinHigh = abw * proteinHighFactor;
    
    // Apply senior multiplier if age > 65
    const seniorMultiplier = age > 65 ? 1.1 : 1.0;
    const proteinLowAdjusted = Math.round(proteinLow * seniorMultiplier);
    const proteinHighAdjusted = Math.round(proteinHigh * seniorMultiplier);
    
    // Display result
    if (age > 65) {
      // Show both with and without senior multiplier
      const proteinLowRounded = Math.round(proteinLow);
      const proteinHighRounded = Math.round(proteinHigh);
      proteinResultDiv.textContent = `${proteinLowRounded}-${proteinHighRounded} grams of protein per day or ${proteinLowAdjusted}-${proteinHighAdjusted} grams of protein per day with the 1.1x senior multiplier.`;
    } else {
      proteinResultDiv.textContent = `${Math.round(proteinLow)}-${Math.round(proteinHigh)} grams of protein per day`;
    }
    
    // Create explanation
    let explanation = `Based on your weight (${weight} lbs / ${weightKg.toFixed(1)} kg), `;
    explanation += `the adjusted body weight is ${(abw * 2.2).toFixed(1)} lbs / ${abw.toFixed(1)} kg`;
    
    if (age > 65) {
      explanation += `, and a 1.1x senior multiplier has been applied.`;
    } else {
      explanation += `.`;
    }
    
    proteinExplanationDiv.textContent = explanation;
    proteinResultContainer.classList.remove('hidden');
  });
  
  // Calories Calculator Button Click Handler
  caloriesCalculateBtn.addEventListener('click', function() {
    // Reset error messages
    resetCaloriesErrors();
    
    // Validate inputs
    if (!validateCaloriesInputs()) {
      return;
    }
    
    // Get input values
    const age = parseInt(caloriesAgeInput.value);
    const gender = caloriesGenderSelect.value;
    const heightInches = parseFloat(caloriesHeightInput.value);
    const weight = parseFloat(caloriesWeightInput.value);
    const activityLevel = activityLevelSelect.value;
    const proteinPercent = parseInt(proteinPercentInput.value);
    const carbPercent = parseInt(carbPercentInput.value);
    const fatPercent = parseInt(fatPercentInput.value);
    
    // Convert height to cm and weight to kg
    const heightCm = heightInches * 2.54;
    const weightKg = weight / 2.2;
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
    } else {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
    }
    
    // Apply activity multiplier
    let activityMultiplier;
    switch (activityLevel) {
      case 'sedentary':
        activityMultiplier = 1.2;
        break;
      case 'light':
        activityMultiplier = 1.375;
        break;
      case 'moderate':
        activityMultiplier = 1.55;
        break;
      case 'active':
        activityMultiplier = 1.725;
        break;
      case 'veryactive':
        activityMultiplier = 1.9;
        break;
      default:
        activityMultiplier = 1.2;
    }
    
    // Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = Math.round(bmr * activityMultiplier);
    
    // Calculate macronutrient breakdown
    const proteinCalories = Math.round((proteinPercent / 100) * tdee);
    const carbCalories = Math.round((carbPercent / 100) * tdee);
    const fatCalories = Math.round((fatPercent / 100) * tdee);
    
    // Display results
    dailyCaloriesSpan.textContent = tdee;
    proteinCaloriesSpan.textContent = proteinCalories;
    carbCaloriesSpan.textContent = carbCalories;
    fatCaloriesSpan.textContent = fatCalories;
    
    caloriesResultContainer.classList.remove('hidden');
  });
  
  // Protein Tab Input Validation
  function validateProteinInputs() {
    let isValid = true;
    
    // Validate age
    if (!proteinAgeInput.value) {
      proteinAgeError.textContent = 'Please enter your age';
      isValid = false;
    } else if (parseInt(proteinAgeInput.value) < 1 || parseInt(proteinAgeInput.value) > 999) {
      proteinAgeError.textContent = 'Age must be between 1 and 999';
      isValid = false;
    }
    
    // Validate gender
    if (!proteinGenderSelect.value) {
      proteinGenderError.textContent = 'Please select your gender';
      isValid = false;
    }
    
    // Validate height
    if (!proteinHeightInput.value) {
      proteinHeightError.textContent = 'Please enter your height in inches';
      isValid = false;
    } else if (parseFloat(proteinHeightInput.value) < 0) {
      proteinHeightError.textContent = 'Height must be a positive number';
      isValid = false;
    }
    
    // Validate weight
    if (!proteinWeightInput.value) {
      proteinWeightError.textContent = 'Please enter your weight';
      isValid = false;
    } else if (parseFloat(proteinWeightInput.value) <= 0) {
      proteinWeightError.textContent = 'Weight must be greater than 0';
      isValid = false;
    }
    
    // Validate protein range
    if (!proteinLowInput.value || !proteinHighInput.value) {
      proteinRangeError.textContent = 'Please enter both protein range values';
      isValid = false;
    } else if (parseFloat(proteinLowInput.value) <= 0 || parseFloat(proteinHighInput.value) <= 0) {
      proteinRangeError.textContent = 'Protein values must be greater than 0';
      isValid = false;
    } else if (parseFloat(proteinLowInput.value) > parseFloat(proteinHighInput.value)) {
      proteinRangeError.textContent = 'Low value should be less than high value';
      isValid = false;
    }
    
    return isValid;
  }
  
  // Calories Tab Input Validation
  function validateCaloriesInputs() {
    let isValid = true;
    
    // Validate age
    if (!caloriesAgeInput.value) {
      caloriesAgeError.textContent = 'Please enter your age';
      isValid = false;
    } else if (parseInt(caloriesAgeInput.value) < 1 || parseInt(caloriesAgeInput.value) > 999) {
      caloriesAgeError.textContent = 'Age must be between 1 and 999';
      isValid = false;
    }
    
    // Validate gender
    if (!caloriesGenderSelect.value) {
      caloriesGenderError.textContent = 'Please select your gender';
      isValid = false;
    }
    
    // Validate height
    if (!caloriesHeightInput.value) {
      caloriesHeightError.textContent = 'Please enter your height in inches';
      isValid = false;
    } else if (parseFloat(caloriesHeightInput.value) < 0) {
      caloriesHeightError.textContent = 'Height must be a positive number';
      isValid = false;
    }
    
    // Validate weight
    if (!caloriesWeightInput.value) {
      caloriesWeightError.textContent = 'Please enter your weight';
      isValid = false;
    } else if (parseFloat(caloriesWeightInput.value) <= 0) {
      caloriesWeightError.textContent = 'Weight must be greater than 0';
      isValid = false;
    }
    
    // Validate activity level
    if (!activityLevelSelect.value) {
      activityError.textContent = 'Please select an activity level';
      isValid = false;
    }
    
    // Validate macro percentages
    const proteinPercent = parseInt(proteinPercentInput.value) || 0;
    const carbPercent = parseInt(carbPercentInput.value) || 0;
    const fatPercent = parseInt(fatPercentInput.value) || 0;
    const totalPercent = proteinPercent + carbPercent + fatPercent;
    
    if (!proteinPercentInput.value || !carbPercentInput.value || !fatPercentInput.value) {
      macroError.textContent = 'Please enter all macro percentages';
      isValid = false;
    } else if (proteinPercent < 0 || carbPercent < 0 || fatPercent < 0) {
      macroError.textContent = 'Percentages cannot be negative';
      isValid = false;
    } else if (totalPercent !== 100) {
      macroError.textContent = 'Percentages must add up to 100%';
      isValid = false;
    }
    
    return isValid;
  }
  
  // Reset error messages for protein tab
  function resetProteinErrors() {
    proteinAgeError.textContent = '';
    proteinGenderError.textContent = '';
    proteinHeightError.textContent = '';
    proteinWeightError.textContent = '';
    proteinRangeError.textContent = '';
  }
  
  // Reset error messages for calories tab
  function resetCaloriesErrors() {
    caloriesAgeError.textContent = '';
    caloriesGenderError.textContent = '';
    caloriesHeightError.textContent = '';
    caloriesWeightError.textContent = '';
    activityError.textContent = '';
    macroError.textContent = '';
  }
});
