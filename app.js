/* ==========================================================================
   Pizza Dough Master - Calculator Logic & PWA Controller
   ========================================================================== */

// Fermentation Table Data
const YEAST_TABLE = {
  ady: [0.004, 0.008, 0.013, 0.021, 0.032, 0.042, 0.053, 0.063, 0.074, 0.084, 0.126, 0.168, 0.21, 0.252, 0.294, 0.336, 0.42, 0.504, 0.588, 0.672, 0.756, 0.84, 0.924, 1.008, 1.092, 1.176, 1.26],
  idy: [0.003, 0.006, 0.01, 0.016, 0.024, 0.032, 0.04, 0.048, 0.056, 0.064, 0.096, 0.128, 0.16, 0.192, 0.224, 0.256, 0.32, 0.384, 0.448, 0.512, 0.576, 0.64, 0.704, 0.768, 0.832, 0.896, 0.96],
  cy: [0.01, 0.02, 0.03, 0.05, 0.075, 0.1, 0.125, 0.15, 0.175, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.6, 2.8, 3],
  grid: [
    { f: 35, c: 1.7, times: [null,null,null,null,null,null,null,null,null,null,167,136,115,101,90,82,70,61,54,49,45,42,39,37,35,33,31] },
    { f: 36, c: 2.2, times: [null,null,null,null,null,null,null,null,null,null,149,121,103,90,80,73,62,54,49,44,40,37,35,33,31,29,28] },
    { f: 37, c: 2.8, times: [null,null,null,null,null,null,null,null,null,null,133,108,92,80,72,65,55,49,43,39,36,33,31,29,28,26,25] },
    { f: 38, c: 3.3, times: [null,null,null,null,null,null,null,null,null,161,120,97,82,72,65,59,50,44,39,35,32,30,28,26,25,24,22] },
    { f: 39, c: 3.9, times: [null,null,null,null,null,null,null,null,159,145,108,87,74,65,58,53,45,39,35,32,29,27,25,24,22,21,20] },
    { f: 40, c: 4.4, times: [null,null,null,null,null,null,null,161,144,130,97,79,67,59,52,48,40,35,32,29,26,24,23,21,20,19,18] },
    { f: 41, c: 5, times: [null,null,null,null,null,null,166,145,130,118,88,71,61,53,47,43,37,32,29,26,24,22,21,19,18,17,16] },
    { f: 42, c: 5.6, times: [null,null,null,null,null,null,151,132,118,107,80,65,55,48,43,39,33,29,26,24,22,20,19,18,17,15,15] },
    { f: 43, c: 6.1, times: [null,null,null,null,null,161,137,120,107,97,72,59,50,44,39,35,30,26,24,21,20,18,17,16,15,14,14] },
    { f: 44, c: 6.7, times: [null,null,null,null,null,147,125,109,98,88,66,53,45,40,36,32,27,24,21,19,18,17,15,14,14,13,12] },
    { f: 45, c: 7.2, times: [null,null,null,null,165,134,114,100,89,81,60,49,41,36,32,29,25,22,20,18,16,15,14,13,12,12,11] },
    { f: 46, c: 7.8, times: [null,null,null,null,151,122,104,91,81,74,55,45,38,33,30,27,23,20,18,16,15,14,13,12,11,11,10] },
    { f: 47, c: 8.3, times: [null,null,null,null,138,112,95,83,74,67,50,41,35,30,27,25,21,18,16,15,14,13,12,11,10,10,9] },
    { f: 48, c: 8.9, times: [null,null,null,null,126,102,87,76,68,62,46,37,32,28,25,23,19,17,15,14,12,12,11,10,10,9,8] },
    { f: 49, c: 9.4, times: [null,null,null,156,116,94,80,70,63,57,42,34,29,26,23,21,18,15,14,12,11,11,10,9,9,8,8] },
    { f: 50, c: 10, times: [null,null,null,143,107,86,74,64,58,52,39,32,27,23,21,19,16,14,13,11,11,10,9,9,8,8,7] },
    { f: 51, c: 10.6, times: [null,null,null,132,98,80,68,59,53,48,36,29,25,22,19,18,15,13,12,11,10,9,8,8,7,7,7] },
    { f: 52, c: 11.1, times: [null,null,null,122,90,73,62,55,49,44,33,27,23,20,18,16,14,12,11,10,9,8,8,7,7,6,6] },
    { f: 53, c: 11.7, times: [null,null,163,112,84,68,58,50,45,41,30,25,21,18,16,15,13,11,10,9,8,8,7,7,6,6,6] },
    { f: 54, c: 12.2, times: [null,null,150,104,77,63,53,47,42,38,28,23,19,17,15,14,12,10,9,8,8,7,7,6,6,6,5] },
    { f: 55, c: 12.8, times: [null,null,139,96,71,58,49,43,39,35,26,21,18,16,14,13,11,9,8,8,7,7,6,6,5,5,5] },
    { f: 56, c: 13.3, times: [null,null,129,89,66,54,46,40,36,32,24,20,17,15,13,12,10,9,8,7,7,6,6,5,5,5,4] },
    { f: 57, c: 13.9, times: [null,161,120,82,61,50,42,37,33,30,22,18,15,14,12,11,9,8,7,7,6,6,5,5,5,4,4] },
    { f: 58, c: 14.4, times: [null,149,111,77,57,46,39,34,31,28,21,17,14,13,11,10,9,8,7,6,6,5,5,5,4,4,4] },
    { f: 59, c: 15, times: [null,139,103,71,53,43,37,32,29,26,19,16,13,12,10,9,8,7,6,6,5,5,4,4,4,4,3] },
    { f: 60, c: 15.6, times: [null,129,96,66,49,40,34,30,27,24,18,15,12,11,10,9,7,7,6,5,5,4,4,4,4,3,3] },
    { f: 61, c: 16.1, times: [null,120,90,62,46,37,32,28,25,22,17,14,12,10,9,8,7,6,5,5,4,4,4,3,3,3,3] },
    { f: 62, c: 16.7, times: [null,112,83,58,43,35,30,26,23,21,16,13,11,9,8,8,6,6,5,5,4,4,4,3,3,3,3] },
    { f: 63, c: 17.2, times: [null,105,78,54,40,32,28,24,22,20,15,12,10,9,8,7,6,5,5,4,4,4,3,3,3,3,3] },
    { f: 64, c: 17.8, times: [162,98,73,50,37,30,26,23,20,18,14,11,9,8,7,7,6,5,4,4,4,3,3,3,3,2,2] },
    { f: 65, c: 18.3, times: [152,92,68,47,35,28,24,21,19,17,13,10,9,8,7,6,5,5,4,4,3,3,3,3,2,2,2] },
    { f: 66, c: 18.9, times: [142,86,64,44,33,27,23,20,18,16,12,10,8,7,6,6,5,4,4,4,3,3,3,2,2,2,2] },
    { f: 67, c: 19.4, times: [133,80,60,41,31,25,21,19,17,15,11,9,8,7,6,5,4,4,4,3,3,3,2,2,2,2,2] },
    { f: 68, c: 20, times: [120,73,54,37,28,22,19,17,15,14,10,8,7,6,5,5,4,4,3,3,3,2,2,2,2,2,2] },
    { f: 69, c: 20.6, times: [109,66,49,34,25,20,17,15,14,12,9,7,6,5,5,4,4,3,3,3,2,2,2,2,2,2,1] },
    { f: 70, c: 21.1, times: [99,60,45,31,23,19,16,14,12,11,8,7,6,5,4,4,3,3,3,2,2,2,2,2,2,1,1] },
    { f: 71, c: 21.7, times: [90,55,41,28,21,17,14,13,11,10,8,6,5,5,4,3,3,3,2,2,2,2,2,2,1,1,1] },
    { f: 72, c: 22.2, times: [83,50,37,26,19,15,13,12,10,9,7,6,5,4,4,3,3,2,2,2,2,2,2,1,1,1,1] },
    { f: 73, c: 22.8, times: [76,46,34,24,18,14,12,11,9,9,7,6,5,4,4,3,3,2,2,2,2,2,1,1,1,1,1] },
    { f: 74, c: 23.3, times: [70,42,32,22,16,13,11,10,9,8,6,5,4,4,3,3,2,2,2,2,2,1,1,1,1,1,1] },
    { f: 75, c: 23.9, times: [65,39,29,20,15,12,10,9,8,7,5,4,4,3,3,3,2,2,2,2,1,1,1,1,1,1,1] },
    { f: 76, c: 24.4, times: [60,36,27,19,14,11,10,8,7,7,5,4,3,3,3,2,2,2,2,1,1,1,1,1,1,1,1] },
    { f: 77, c: 25, times: [56,34,25,17,13,10,9,8,7,6,5,4,3,3,2,2,2,2,1,1,1,1,1,1,1,1,1] },
    { f: 78, c: 25.6, times: [52,31,23,16,12,10,8,7,6,6,4,4,3,3,2,2,2,2,1,1,1,1,1,1,1,1,1] },
    { f: 79, c: 26.1, times: [48,29,22,15,11,9,8,7,6,5,4,3,3,2,2,2,2,1,1,1,1,1,1,1,1,1,1] },
    { f: 80, c: 26.7, times: [45,27,20,14,10,8,7,6,5,4,4,3,3,2,2,2,2,1,1,1,1,1,1,1,1,1,1] },
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE ---
  let currentPreset = 'neapolitan';
  let savedRecipes = [];
  let isAutoYeast = false;
  let tempUnit = 'C'; // 'C' or 'F'
  let currentTheme = 'system';

  // --- SETTINGS STATE ---
  let defaultTempUnit = localStorage.getItem('pizza_settings_temp_unit') || 'C';
  let defaultAmbientTemp = parseFloat(localStorage.getItem('pizza_settings_default_temp'));
  if (isNaN(defaultAmbientTemp)) {
    defaultAmbientTemp = defaultTempUnit === 'C' ? 20 : 68;
  }
  let settingsTempUnit = defaultTempUnit; // Editing state for Settings page

  // --- PRESETS CONFIGURATION ---
  const PRESETS = {
    neapolitan: {
      hydration: 62,
      yeastType: 'idy',
      yeast: 0.15,
      salt: 2.8,
      oil: 0,
      sugar: 0
    },
    newyork: {
      hydration: 65,
      yeastType: 'idy',
      yeast: 0.35,
      salt: 2.2,
      oil: 1.5,
      sugar: 1.5
    },
    detroit: {
      hydration: 70,
      yeastType: 'idy',
      yeast: 0.5,
      salt: 2.2,
      oil: 2.5,
      sugar: 0
    },
    deepdish: {
      hydration: 55,
      yeastType: 'idy',
      yeast: 0.5,
      salt: 1.5,
      oil: 15.0,
      sugar: 0
    }
  };

  // --- DOM ELEMENTS ---
  // Inputs & Sliders
  const ballsCountRange = document.getElementById('ballsCount');
  const ballsCountNum = document.getElementById('ballsCountNum');
  
  const ballWeightRange = document.getElementById('ballWeight');
  const ballWeightNum = document.getElementById('ballWeightNum');
  
  const hydrationRange = document.getElementById('hydration');
  const hydrationNum = document.getElementById('hydrationNum');
  
  const yeastTypeSelect = document.getElementById('yeastType');
  const yeastRange = document.getElementById('yeast');
  const yeastNum = document.getElementById('yeastNum');
  const yeastLabel = document.getElementById('yeastLabel');
  
  const saltRange = document.getElementById('salt');
  const saltNum = document.getElementById('saltNum');
  
  const oilRange = document.getElementById('oil');
  const oilNum = document.getElementById('oilNum');
  
  const sugarRange = document.getElementById('sugar');
  const sugarNum = document.getElementById('sugarNum');
  
  // Auto Yeast Prediction Controls
  const autoYeastCheck = document.getElementById('autoYeast');
  const tempTimeContainer = document.getElementById('tempTimeContainer');
  const fermentTimeRange = document.getElementById('fermentTime');
  const fermentTimeNum = document.getElementById('fermentTimeNum');
  const fermentTempRange = document.getElementById('fermentTemp');
  const fermentTempNum = document.getElementById('fermentTempNum');
  const unitBtnC = document.getElementById('unitC');
  const unitBtnF = document.getElementById('unitF');
  const tempUnitLabel = document.getElementById('tempUnitLabel');

  // Displays
  const totalWeightDisplay = document.getElementById('totalWeightDisplay');
  const doughBreakdownSummary = document.getElementById('doughBreakdownSummary');
  
  // Ingredient Cards & Values
  const flourGrams = document.getElementById('flourGrams');
  const flourSublabel = document.getElementById('flourSublabel');
  
  const waterGrams = document.getElementById('waterGrams');
  const waterSublabel = document.getElementById('waterSublabel');
  const waterPercent = document.getElementById('waterPercent');
  
  const yeastCardName = document.getElementById('yeastCardName');
  const yeastSublabel = document.getElementById('yeastSublabel');
  const yeastGrams = document.getElementById('yeastGrams');
  const yeastPercent = document.getElementById('yeastPercent');
  
  const saltGrams = document.getElementById('saltGrams');
  const saltPercent = document.getElementById('saltPercent');
  
  const oilCard = document.getElementById('oilCard');
  const oilGrams = document.getElementById('oilGrams');
  const oilPercent = document.getElementById('oilPercent');
  
  const sugarCard = document.getElementById('sugarCard');
  const sugarGrams = document.getElementById('sugarGrams');
  const sugarPercent = document.getElementById('sugarPercent');

  const fermentCard = document.getElementById('fermentCard');
  const fermentTimeDisplay = document.getElementById('fermentTimeDisplay');
  const fermentTempDisplay = document.getElementById('fermentTempDisplay');
  const fermentTypeDisplay = document.getElementById('fermentTypeDisplay');

  // Yeast Helper
  const yeastHelperCard = document.getElementById('yeastHelperCard');
  const helperIdy = document.getElementById('helperIdy');
  const helperAdy = document.getElementById('helperAdy');
  const helperFresh = document.getElementById('helperFresh');

  // Presets & Recipe Manager
  const presetButtons = document.querySelectorAll('.preset-btn');
  const recipeNameInput = document.getElementById('recipeName');
  const saveRecipeBtn = document.getElementById('saveRecipeBtn');
  const savedRecipesList = document.getElementById('savedRecipesList');
  const installBtn = document.getElementById('installBtn');
  const themeSelector = document.getElementById('themeSelector');
  const themeButtons = themeSelector.querySelectorAll('.theme-btn');

  // Settings View Elements
  const settingsToggleBtn = document.getElementById('settingsToggleBtn');
  const calculatorView = document.getElementById('calculatorView');
  const settingsView = document.getElementById('settingsView');
  const settingsUnitC = document.getElementById('settingsUnitC');
  const settingsUnitF = document.getElementById('settingsUnitF');
  const settingsDefaultTemp = document.getElementById('settingsDefaultTemp');
  const settingsDefaultTempNum = document.getElementById('settingsDefaultTempNum');
  const settingsTempUnitLabel = document.getElementById('settingsTempUnitLabel');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');

  // --- INITIALIZATION ---
  initApp();

  function initApp() {
    // Apply default settings
    applySettingsDefaults();

    // Bind all slider/number inputs
    setupSync(ballsCountRange, ballsCountNum, true);
    setupSync(ballWeightRange, ballWeightNum, true);
    setupSync(hydrationRange, hydrationNum, false);
    setupSync(yeastRange, yeastNum, false);
    setupSync(saltRange, saltNum, false);
    setupSync(oilRange, oilNum, false);
    setupSync(sugarRange, sugarNum, false);

    // Bind time & temp inputs
    setupSync(fermentTimeRange, fermentTimeNum, true);
    setupSync(fermentTempRange, fermentTempNum, false);

    // Event listeners
    yeastTypeSelect.addEventListener('change', handleYeastTypeChange);
    
    // Auto Yeast Checkbox Listener
    autoYeastCheck.addEventListener('change', handleAutoYeastToggle);

    // Temperature Unit Listeners
    unitBtnC.addEventListener('click', () => setTempUnit('C'));
    unitBtnF.addEventListener('click', () => setTempUnit('F'));
    
    // Preset buttons
    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const presetKey = btn.dataset.preset;
        applyPreset(presetKey);
      });
    });

    // Recipes Save
    saveRecipeBtn.addEventListener('click', saveCurrentRecipe);
    
    // Load recipes from storage
    loadRecipesFromStorage();

    // Settings Page Listeners
    settingsToggleBtn.addEventListener('click', toggleSettingsView);
    cancelSettingsBtn.addEventListener('click', hideSettingsView);
    settingsUnitC.addEventListener('click', () => setSettingsUnit('C'));
    settingsUnitF.addEventListener('click', () => setSettingsUnit('F'));
    saveSettingsBtn.addEventListener('click', saveSettings);
    setupSettingsSync();

    // Initial calculation
    calculateDough();

    // Initialize Theme Selector
    initThemeSelector();

    // PWA Service Worker Registration
    registerServiceWorker();
  }

  // --- AUTO YEAST & UNIT CONTROLLERS ---
  function handleAutoYeastToggle() {
    isAutoYeast = autoYeastCheck.checked;
    
    // Toggle accordion container visibility
    if (isAutoYeast) {
      tempTimeContainer.classList.remove('hidden-accordion');
      
      // Disable yeast inputs visually and interactively
      yeastRange.disabled = true;
      yeastNum.disabled = true;
      yeastRange.closest('.slider-wrapper').classList.add('disabled');
      yeastNum.closest('.number-input-wrapper').classList.add('disabled');
    } else {
      tempTimeContainer.classList.add('hidden-accordion');
      
      // Enable yeast inputs
      yeastRange.disabled = false;
      yeastNum.disabled = false;
      yeastRange.closest('.slider-wrapper').classList.remove('disabled');
      yeastNum.closest('.number-input-wrapper').classList.remove('disabled');
      
      // Reset yeast slider limits/defaults based on type
      handleYeastTypeChange();
    }
    
    detectCustomPreset();
    calculateDough();
  }

  function setTempUnit(unit) {
    if (tempUnit === unit) return;
    
    tempUnit = unit;
    
    const currentVal = parseFloat(fermentTempNum.value);
    
    if (unit === 'C') {
      unitBtnC.classList.add('active');
      unitBtnF.classList.remove('active');
      tempUnitLabel.textContent = '°C';
      
      // Convert current value F -> C
      const valC = (currentVal - 32) * 5 / 9;
      
      // Set slider range for Celsius
      fermentTempRange.min = '3';
      fermentTempRange.max = '35';
      fermentTempRange.step = '0.5';
      
      // Set values (clamped if necessary)
      const clampedVal = Math.min(Math.max(valC, 3), 35);
      fermentTempRange.value = clampedVal.toFixed(1);
      fermentTempNum.value = clampedVal.toFixed(1);
    } else {
      unitBtnF.classList.add('active');
      unitBtnC.classList.remove('active');
      tempUnitLabel.textContent = '°F';
      
      // Convert current value C -> F
      const valF = (currentVal * 9 / 5) + 32;
      
      // Set slider range for Fahrenheit
      fermentTempRange.min = '37';
      fermentTempRange.max = '95';
      fermentTempRange.step = '1';
      
      // Set values (clamped if necessary)
      const clampedVal = Math.min(Math.max(valF, 37), 95);
      fermentTempRange.value = Math.round(clampedVal);
      fermentTempNum.value = Math.round(clampedVal);
    }
    
    calculateDough();
  }

  // --- SETTINGS CONTROLLERS ---
  function applySettingsDefaults() {
    tempUnit = defaultTempUnit;
    if (tempUnit === 'C') {
      unitBtnC.classList.add('active');
      unitBtnF.classList.remove('active');
      tempUnitLabel.textContent = '°C';
      
      fermentTempRange.min = '3';
      fermentTempRange.max = '35';
      fermentTempRange.step = '0.5';
    } else {
      unitBtnF.classList.add('active');
      unitBtnC.classList.remove('active');
      tempUnitLabel.textContent = '°F';
      
      fermentTempRange.min = '37';
      fermentTempRange.max = '95';
      fermentTempRange.step = '1';
    }
    fermentTempRange.value = defaultAmbientTemp;
    fermentTempNum.value = defaultAmbientTemp;
  }

  function toggleSettingsView() {
    const isHidden = settingsView.classList.contains('hidden');
    if (isHidden) {
      // Show settings page
      settingsView.classList.remove('hidden');
      calculatorView.classList.add('hidden');
      settingsToggleBtn.classList.add('active');
      
      // Load current defaults into editing state
      settingsTempUnit = defaultTempUnit;
      
      // Sync settings unit pills
      if (settingsTempUnit === 'C') {
        settingsUnitC.classList.add('active');
        settingsUnitF.classList.remove('active');
        settingsTempUnitLabel.textContent = '°C';
        
        settingsDefaultTemp.min = '3';
        settingsDefaultTemp.max = '35';
        settingsDefaultTemp.step = '0.5';
      } else {
        settingsUnitF.classList.add('active');
        settingsUnitC.classList.remove('active');
        settingsTempUnitLabel.textContent = '°F';
        
        settingsDefaultTemp.min = '37';
        settingsDefaultTemp.max = '95';
        settingsDefaultTemp.step = '1';
      }
      
      settingsDefaultTemp.value = defaultAmbientTemp;
      settingsDefaultTempNum.value = defaultAmbientTemp;
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      hideSettingsView();
    }
  }

  function hideSettingsView() {
    settingsView.classList.add('hidden');
    calculatorView.classList.remove('hidden');
    settingsToggleBtn.classList.remove('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setSettingsUnit(unit) {
    if (settingsTempUnit === unit) return;
    
    settingsTempUnit = unit;
    
    const currentVal = parseFloat(settingsDefaultTempNum.value);
    
    if (unit === 'C') {
      settingsUnitC.classList.add('active');
      settingsUnitF.classList.remove('active');
      settingsTempUnitLabel.textContent = '°C';
      
      // Convert current value F -> C
      const valC = (currentVal - 32) * 5 / 9;
      
      // Set slider range for Celsius
      settingsDefaultTemp.min = '3';
      settingsDefaultTemp.max = '35';
      settingsDefaultTemp.step = '0.5';
      
      // Set values (clamped if necessary)
      const clampedVal = Math.min(Math.max(valC, 3), 35);
      settingsDefaultTemp.value = clampedVal.toFixed(1);
      settingsDefaultTempNum.value = clampedVal.toFixed(1);
    } else {
      settingsUnitF.classList.add('active');
      settingsUnitC.classList.remove('active');
      settingsTempUnitLabel.textContent = '°F';
      
      // Convert current value C -> F
      const valF = (currentVal * 9 / 5) + 32;
      
      // Set slider range for Fahrenheit
      settingsDefaultTemp.min = '37';
      settingsDefaultTemp.max = '95';
      settingsDefaultTemp.step = '1';
      
      // Set values (clamped if necessary)
      const clampedVal = Math.min(Math.max(valF, 37), 95);
      settingsDefaultTemp.value = Math.round(clampedVal);
      settingsDefaultTempNum.value = Math.round(clampedVal);
    }
  }

  function setupSettingsSync() {
    // Slider -> Number
    settingsDefaultTemp.addEventListener('input', () => {
      settingsDefaultTempNum.value = settingsDefaultTemp.value;
    });

    // Number -> Slider
    settingsDefaultTempNum.addEventListener('input', () => {
      let val = parseFloat(settingsDefaultTempNum.value);
      if (isNaN(val)) return;

      const min = parseFloat(settingsDefaultTemp.min);
      const max = parseFloat(settingsDefaultTemp.max);

      // Clamp values for safety
      if (val < min) val = min;
      if (val > max) val = max;

      settingsDefaultTemp.value = val;
    });

    settingsDefaultTempNum.addEventListener('blur', () => {
      let val = parseFloat(settingsDefaultTempNum.value);
      if (isNaN(val)) {
        settingsDefaultTempNum.value = settingsDefaultTemp.value;
      } else {
        const min = parseFloat(settingsDefaultTemp.min);
        const max = parseFloat(settingsDefaultTemp.max);
        if (val < min) settingsDefaultTempNum.value = min;
        if (val > max) settingsDefaultTempNum.value = max;
        settingsDefaultTemp.value = settingsDefaultTempNum.value;
      }
    });
  }

  function saveSettings() {
    const tempVal = parseFloat(settingsDefaultTempNum.value);
    if (isNaN(tempVal)) {
      alert('Please enter a valid temperature.');
      return;
    }
    
    // Save to localStorage
    localStorage.setItem('pizza_settings_temp_unit', settingsTempUnit);
    localStorage.setItem('pizza_settings_default_temp', tempVal.toString());
    
    // Update global variables
    defaultTempUnit = settingsTempUnit;
    defaultAmbientTemp = tempVal;
    
    // Apply changes to the active calculator state immediately
    if (tempUnit !== defaultTempUnit) {
      setTempUnit(defaultTempUnit);
    }
    
    // Force calculator temperature value to defaults
    fermentTempRange.value = defaultAmbientTemp;
    fermentTempNum.value = defaultAmbientTemp;
    calculateDough();
    
    // Premium visual success feedback on the save settings button
    const originalContent = saveSettingsBtn.innerHTML;
    saveSettingsBtn.innerHTML = 'Saved!';
    saveSettingsBtn.style.background = 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)';
    
    setTimeout(() => {
      saveSettingsBtn.innerHTML = originalContent;
      saveSettingsBtn.style.background = '';
      hideSettingsView();
    }, 800);
  }

  // --- SLIDER & NUMBER SYNC ---
  function setupSync(rangeInput, numInput, isInteger) {
    // Range -> Number
    rangeInput.addEventListener('input', () => {
      numInput.value = rangeInput.value;
      detectCustomPreset();
      calculateDough();
    });

    // Number -> Range
    numInput.addEventListener('input', () => {
      let val = parseFloat(numInput.value);
      if (isNaN(val)) return;

      const min = parseFloat(rangeInput.min);
      const max = parseFloat(rangeInput.max);

      // Clamp values for safety, but allow user typing freedom temporarily
      if (val < min) val = min;
      if (val > max) val = max;

      rangeInput.value = isInteger ? Math.round(val) : val;
      detectCustomPreset();
      calculateDough();
    });

    numInput.addEventListener('blur', () => {
      // Clean up empty or invalid input on blur
      let val = parseFloat(numInput.value);
      if (isNaN(val)) {
        numInput.value = rangeInput.value;
      } else {
        const min = parseFloat(numInput.min);
        const max = parseFloat(numInput.max);
        if (val < min) numInput.value = min;
        if (val > max) numInput.value = max;
        rangeInput.value = numInput.value;
      }
      calculateDough();
    });
  }

  // --- YEAST TYPE TOGGLE ACTIONS ---
  function handleYeastTypeChange() {
    const selectedType = yeastTypeSelect.value;
    
    // If auto yeast is active, we just recalculate dough (which determines the yeast %)
    if (isAutoYeast) {
      if (selectedType === 'sourdough') {
        yeastCardName.textContent = 'Sourdough Starter';
        yeastSublabel.textContent = 'Active starter (100% hydration)';
        yeastHelperCard.classList.add('hidden');
      } else {
        const yeastNames = {
          idy: 'Instant Dry Yeast (IDY)',
          ady: 'Active Dry Yeast (ADY)',
          fresh: 'Fresh Yeast (Compressed)'
        };
        yeastCardName.textContent = yeastNames[selectedType];
        yeastSublabel.textContent = 'Fermentation agent';
        yeastHelperCard.classList.remove('hidden');
      }
      calculateDough();
      return;
    }
    
    if (selectedType === 'sourdough') {
      // Adjust slider limits for Sourdough Starter (typical range: 5% - 40%)
      yeastLabel.textContent = 'Sourdough Starter';
      yeastRange.min = '5';
      yeastRange.max = '40';
      yeastRange.step = '0.5';
      yeastRange.value = '20';
      yeastNum.value = '20';
      
      // Update Yeast card labels
      yeastCardName.textContent = 'Sourdough Starter';
      yeastSublabel.textContent = 'Active starter (100% hydration)';
      
      // Hide Yeast Equivalent helper since it does not apply
      yeastHelperCard.classList.add('hidden');
    } else {
      // Adjust slider limits for Dry/Fresh Yeast (typical range: 0.01% - 3%)
      yeastLabel.textContent = 'Yeast';
      yeastRange.min = '0';
      yeastRange.max = '3';
      yeastRange.step = '0.01';
      yeastRange.value = '0.15';
      yeastNum.value = '0.15';
      
      // Update Yeast card labels
      const yeastNames = {
        idy: 'Instant Dry Yeast (IDY)',
        ady: 'Active Dry Yeast (ADY)',
        fresh: 'Fresh Yeast (Compressed)'
      };
      yeastCardName.textContent = yeastNames[selectedType];
      yeastSublabel.textContent = 'Fermentation agent';
      
      // Show Yeast Helper
      yeastHelperCard.classList.remove('hidden');
    }

    detectCustomPreset();
    calculateDough();
  }

  // --- PRESETS IMPLEMENTATION ---
  function applyPreset(presetKey) {
    const preset = PRESETS[presetKey];
    if (!preset) return;

    currentPreset = presetKey;
    
    // Highlight preset button
    presetButtons.forEach(btn => {
      if (btn.dataset.preset === presetKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Turn off auto yeast calculations for presets
    autoYeastCheck.checked = false;
    handleAutoYeastToggle();

    // Update yeast type select first to adjust slider ranges
    yeastTypeSelect.value = preset.yeastType;
    handleYeastTypeChange(); // Will set the default yeast value based on type, which we overwrite next

    // Set Slider + Inputs values
    hydrationRange.value = preset.hydration;
    hydrationNum.value = preset.hydration;

    yeastRange.value = preset.yeast;
    yeastNum.value = preset.yeast;

    saltRange.value = preset.salt;
    saltNum.value = preset.salt;

    oilRange.value = preset.oil;
    oilNum.value = preset.oil;

    sugarRange.value = preset.sugar;
    sugarNum.value = preset.sugar;

    detectCustomPreset();
    calculateDough();
  }

  function detectCustomPreset() {
    // Check if the current settings match any preset
    let matchFound = false;

    for (const [key, preset] of Object.entries(PRESETS)) {
      if (
        !isAutoYeast &&
        parseFloat(hydrationNum.value) === preset.hydration &&
        yeastTypeSelect.value === preset.yeastType &&
        parseFloat(yeastNum.value) === preset.yeast &&
        parseFloat(saltNum.value) === preset.salt &&
        parseFloat(oilNum.value) === preset.oil &&
        parseFloat(sugarNum.value) === preset.sugar
      ) {
        currentPreset = key;
        presetButtons.forEach(btn => {
          if (btn.dataset.preset === key) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
        matchFound = true;
        break;
      }
    }

    if (!matchFound) {
      currentPreset = 'custom';
      presetButtons.forEach(btn => btn.classList.remove('active'));
    }
  }

  // --- CORE DOUGH MATH ENGINE ---
  function calculateDough() {
    const N = parseInt(ballsCountNum.value) || 0;
    const B = parseFloat(ballWeightNum.value) || 0;
    
    const H = parseFloat(hydrationNum.value) || 0;
    const S = parseFloat(saltNum.value) || 0;
    const O = parseFloat(oilNum.value) || 0;
    const Su = parseFloat(sugarNum.value) || 0;
    const yeastType = yeastTypeSelect.value;
    
    // Auto Yeast calculation logic
    let Y = 0;
    let time = 24;
    let tempVal = parseFloat(fermentTempNum.value) || 20;
    let tempC = tempVal;
    if (tempUnit === 'F') {
      tempC = (tempVal - 32) * 5 / 9;
    }

    if (isAutoYeast) {
      time = parseFloat(fermentTimeNum.value) || 24;
      Y = calculateYeastPercentage(time, tempC, yeastType);
      
      // Update Yeast inputs with calculated value
      yeastRange.value = Y.toFixed(2);
      yeastNum.value = Y.toFixed(2);
    } else {
      Y = parseFloat(yeastNum.value) || 0;
      // Calculate time from yeast
      time = calculateFermentationTime(Y, tempC, yeastType);
      
      // Update fermentation time inputs to match
      const formattedTime = time < 10 ? time.toFixed(1) : Math.round(time).toString();
      fermentTimeNum.value = formattedTime;
      fermentTimeRange.value = Math.round(time);
    }

    const totalDoughWeight = N * B;
    totalWeightDisplay.textContent = totalDoughWeight.toLocaleString(undefined, { maximumFractionDigits: 1 }) + 'g';
    
    // Update total details info
    const ballText = N === 1 ? 'ball' : 'balls';
    document.querySelector('.total-details span:first-child').innerHTML = `<strong>${N}</strong> ${ballText} of <strong>${B}g</strong>`;
    doughBreakdownSummary.textContent = `Hydration: ${H}% | Salt: ${S}%`;

    if (totalDoughWeight <= 0) return;

    let flour = 0;
    let water = 0;
    let yeastWt = 0;
    let saltWt = 0;
    let oilWt = 0;
    let sugarWt = 0;
    
    let addedFlour = 0;
    let addedWater = 0;

    if (yeastType === 'sourdough') {
      // Sourdough Starter Math:
      // Total Weight W = F * (1 + H/100 + S/100 + O/100 + Su/100)
      // Starter weight is Y% of total flour. Starter is 50% flour / 50% water.
      const factor = 1 + (H / 100) + (S / 100) + (O / 100) + (Su / 100);
      flour = totalDoughWeight / factor;
      
      yeastWt = flour * (Y / 100); // Starter weight
      const starterFlour = yeastWt / 2;
      const starterWater = yeastWt / 2;

      addedFlour = flour - starterFlour;
      addedWater = (flour * (H / 100)) - starterWater;
      
      saltWt = flour * (S / 100);
      oilWt = flour * (O / 100);
      sugarWt = flour * (Su / 100);
      
      // Update UI elements for Sourdough mode adjustments
      flourSublabel.innerHTML = `Total Flour: <strong>${flour.toFixed(1)}g</strong> (Mix: <strong>${addedFlour.toFixed(1)}g</strong> flour + starter)`;
      waterSublabel.innerHTML = `Total Water: <strong>${(flour * (H / 100)).toFixed(1)}g</strong> (Mix: <strong>${addedWater.toFixed(1)}g</strong> water + starter)`;
      
      // Make sure values in grams match what needs to be measured
      flourGrams.textContent = addedFlour.toFixed(1) + 'g';
      waterGrams.textContent = addedWater.toFixed(1) + 'g';
    } else {
      // Standard Baker's Percentages Math:
      // Total Weight W = F * (1 + H/100 + Y/100 + S/100 + O/100 + Su/100)
      const factor = 1 + (H + Y + S + O + Su) / 100;
      flour = totalDoughWeight / factor;
      
      addedFlour = flour;
      water = flour * (H / 100);
      addedWater = water;
      yeastWt = flour * (Y / 100);
      saltWt = flour * (S / 100);
      oilWt = flour * (O / 100);
      sugarWt = flour * (Su / 100);

      // Restore standard labels
      flourSublabel.textContent = 'Bread Flour / Tipo 00';
      waterSublabel.textContent = 'Added water';
      
      flourGrams.textContent = flour.toFixed(1) + 'g';
      waterGrams.textContent = water.toFixed(1) + 'g';
    }

    // Common updates
    yeastGrams.textContent = yeastWt.toFixed(2) + 'g';
    yeastPercent.textContent = Y.toFixed(2) + '%';
    
    waterPercent.textContent = H.toFixed(1) + '%';
    
    saltGrams.textContent = saltWt.toFixed(1) + 'g';
    saltPercent.textContent = S.toFixed(1) + '%';

    // Oil Visibility & Values
    if (O > 0) {
      oilCard.classList.remove('hidden');
      oilGrams.textContent = oilWt.toFixed(1) + 'g';
      oilPercent.textContent = O.toFixed(1) + '%';
    } else {
      oilCard.classList.add('hidden');
    }

    // Sugar Visibility & Values
    if (Su > 0) {
      sugarCard.classList.remove('hidden');
      sugarGrams.textContent = sugarWt.toFixed(1) + 'g';
      sugarPercent.textContent = Su.toFixed(1) + '%';
    } else {
      sugarCard.classList.add('hidden');
    }

    // Update Fermentation Card
    if (fermentTimeDisplay && fermentTempDisplay && fermentTypeDisplay) {
      const formattedTime = time < 10 ? time.toFixed(1) : Math.round(time);
      fermentTimeDisplay.textContent = formattedTime + 'h';
      fermentTempDisplay.innerHTML = `Ambient Temp: <strong>${tempVal.toFixed(tempUnit === 'C' ? 1 : 0)}°${tempUnit}</strong>`;
      
      if (tempC <= 10) {
        fermentTypeDisplay.textContent = 'Cold Ferment';
      } else {
        fermentTypeDisplay.textContent = 'Room Temp';
      }
    }

    // Update Yeast Equivalents Card
    if (yeastType !== 'sourdough') {
      let idyEquivalent = 0;
      let adyEquivalent = 0;
      let freshEquivalent = 0;

      // Normalize to IDY baseline
      if (yeastType === 'idy') {
        idyEquivalent = yeastWt;
        adyEquivalent = yeastWt * 1.5;
        freshEquivalent = yeastWt * 3.0;
      } else if (yeastType === 'ady') {
        idyEquivalent = yeastWt / 1.5;
        adyEquivalent = yeastWt;
        freshEquivalent = (yeastWt / 1.5) * 3.0;
      } else if (yeastType === 'fresh') {
        idyEquivalent = yeastWt / 3.0;
        adyEquivalent = (yeastWt / 3.0) * 1.5;
        freshEquivalent = yeastWt;
      }

      helperIdy.innerHTML = `<strong>${idyEquivalent.toFixed(2)}g</strong> Instant (IDY)`;
      helperAdy.innerHTML = `<strong>${adyEquivalent.toFixed(2)}g</strong> Active (ADY)`;
      helperFresh.innerHTML = `<strong>${freshEquivalent.toFixed(2)}g</strong> Fresh Yeast`;
    }
  }

  function getFermentationPoints(tempC, type) {
    const tempF = (tempC * 9 / 5) + 32;
    // Clamp tempF to [35, 80]
    const clampedTemp = Math.min(Math.max(tempF, 35), 80);
    const f1 = Math.floor(clampedTemp);
    const f2 = Math.ceil(clampedTemp);
    
    const row1 = YEAST_TABLE.grid[f1 - 35];
    const row2 = YEAST_TABLE.grid[f2 - 35];
    
    const tableType = type === 'fresh' ? 'cy' : type;
    const percentages = YEAST_TABLE[tableType];
    
    const points = [];
    for (let j = 0; j < 27; j++) {
      const t1 = row1.times[j];
      const t2 = row2.times[j];
      
      let t = null;
      if (t1 !== null && t2 !== null) {
        if (f1 === f2) {
          t = t1;
        } else {
          t = t1 + (t2 - t1) * (clampedTemp - f1);
        }
      } else if (t1 !== null) {
        t = t1;
      } else if (t2 !== null) {
        t = t2;
      }
      
      if (t !== null) {
        points.push({ pct: percentages[j], time: t });
      }
    }
    return points;
  }

  function calculateYeastPercentage(time, tempC, type) {
    if (type === 'sourdough') {
      // Sourdough formula: Y = 1250 / (t * 2.55^(T/10))
      const base = 2.55;
      const rate = Math.pow(base, tempC / 10);
      const val = 1250 / (time * rate);
      // clamp sourdough starter between 5% and 40%
      return Math.min(Math.max(val, 5.0), 40.0);
    } else {
      const points = getFermentationPoints(tempC, type);
      if (points.length === 0) return 0.15; // default fallback
      
      // Points are sorted ascending by pct, which means descending by time
      if (time >= points[0].time) {
        return points[0].pct;
      }
      if (time <= points[points.length - 1].time) {
        return points[points.length - 1].pct;
      }
      
      for (let i = 0; i < points.length - 1; i++) {
        const pA = points[i];
        const pB = points[i + 1];
        if (time <= pA.time && time >= pB.time) {
          if (pA.time === pB.time) {
            return pA.pct;
          }
          const fraction = (time - pA.time) / (pB.time - pA.time);
          return pA.pct + fraction * (pB.pct - pA.pct);
        }
      }
      return 0.15;
    }
  }

  function calculateFermentationTime(yeastPercent, tempC, type) {
    if (type === 'sourdough') {
      const base = 2.55;
      const rate = Math.pow(base, tempC / 10);
      const val = 1250 / (yeastPercent * rate);
      // clamp time between 2 and 72 hours
      return Math.min(Math.max(val, 2.0), 72.0);
    } else {
      const points = getFermentationPoints(tempC, type);
      if (points.length === 0) return 24.0;
      
      if (yeastPercent <= points[0].pct) {
        return points[0].time;
      }
      if (yeastPercent >= points[points.length - 1].pct) {
        return points[points.length - 1].time;
      }
      
      for (let i = 0; i < points.length - 1; i++) {
        const pA = points[i];
        const pB = points[i + 1];
        if (yeastPercent >= pA.pct && yeastPercent <= pB.pct) {
          if (pA.pct === pB.pct) {
            return pA.time;
          }
          const fraction = (yeastPercent - pA.pct) / (pB.pct - pA.pct);
          return pA.time + fraction * (pB.time - pA.time);
        }
      }
      return 24.0;
    }
  }

  // --- LOCALSTORAGE RECIPES ---
  function saveCurrentRecipe() {
    const name = recipeNameInput.value.trim();
    if (!name) {
      alert('Please enter a name for the formulation before saving.');
      recipeNameInput.focus();
      return;
    }

    const recipe = {
      id: 'pizza_' + Date.now(),
      name: name,
      ballsCount: parseInt(ballsCountNum.value),
      ballWeight: parseFloat(ballWeightNum.value),
      hydration: parseFloat(hydrationNum.value),
      yeastType: yeastTypeSelect.value,
      yeast: parseFloat(yeastNum.value),
      salt: parseFloat(saltNum.value),
      oil: parseFloat(oilNum.value),
      sugar: parseFloat(sugarNum.value),
      // Auto Yeast additions
      isAutoYeast: isAutoYeast,
      fermentTime: parseFloat(fermentTimeNum.value),
      fermentTemp: parseFloat(fermentTempNum.value),
      tempUnit: tempUnit
    };

    savedRecipes.unshift(recipe);
    localStorage.setItem('pizza_recipes', JSON.stringify(savedRecipes));
    
    recipeNameInput.value = '';
    renderSavedRecipes();
    
    // Quick custom success visual effect on the save button
    const originalContent = saveRecipeBtn.innerHTML;
    saveRecipeBtn.innerHTML = 'Saved!';
    saveRecipeBtn.style.background = 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)';
    setTimeout(() => {
      saveRecipeBtn.innerHTML = originalContent;
      saveRecipeBtn.style.background = '';
    }, 1500);
  }

  function loadRecipesFromStorage() {
    const stored = localStorage.getItem('pizza_recipes');
    if (stored) {
      try {
        savedRecipes = JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored recipes', e);
        savedRecipes = [];
      }
    }
    renderSavedRecipes();
  }

  function renderSavedRecipes() {
    savedRecipesList.innerHTML = '';
    
    if (savedRecipes.length === 0) {
      savedRecipesList.innerHTML = `<div class="no-recipes-msg">No custom recipes saved yet. Formulate dough above and click "Save Recipe"!</div>`;
      return;
    }

    savedRecipes.forEach(recipe => {
      const card = document.createElement('div');
      card.className = 'recipe-item-card card';
      
      const yeastNames = {
        idy: 'IDY',
        ady: 'ADY',
        fresh: 'Fresh',
        sourdough: 'Starter'
      };

      card.innerHTML = `
        <div class="recipe-item-header">
          <span class="recipe-item-title" title="${recipe.name}">${recipe.name}</span>
          <button class="recipe-delete-btn" aria-label="Delete recipe" data-id="${recipe.id}">
            <svg class="icon" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>
          </button>
        </div>
        <div class="recipe-item-specs">
          <span class="spec-badge"><strong>${recipe.ballsCount}</strong> x <strong>${recipe.ballWeight}g</strong></span>
          <span class="spec-badge"><strong>${recipe.hydration}%</strong> Hydr</span>
          <span class="spec-badge"><strong>${recipe.yeast}%</strong> ${yeastNames[recipe.yeastType]}</span>
          <span class="spec-badge"><strong>${recipe.salt}%</strong> Salt</span>
          ${recipe.isAutoYeast ? `<span class="spec-badge">⏱️ <strong>${recipe.fermentTime}h</strong> @ <strong>${recipe.fermentTemp}°${recipe.tempUnit}</strong></span>` : ''}
          ${recipe.oil > 0 ? `<span class="spec-badge"><strong>${recipe.oil}%</strong> Oil</span>` : ''}
          ${recipe.sugar > 0 ? `<span class="spec-badge"><strong>${recipe.sugar}%</strong> Sugar</span>` : ''}
        </div>
      `;

      // Load recipe on click
      card.addEventListener('click', (e) => {
        // Prevent click if we clicked the delete button
        if (e.target.closest('.recipe-delete-btn')) return;
        loadRecipe(recipe);
      });

      // Delete recipe handler
      const deleteBtn = card.querySelector('.recipe-delete-btn');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteRecipe(recipe.id);
      });

      savedRecipesList.appendChild(card);
    });
  }

  function loadRecipe(recipe) {
    // Set Slider + Inputs values
    ballsCountRange.value = recipe.ballsCount;
    ballsCountNum.value = recipe.ballsCount;
    
    ballWeightRange.value = recipe.ballWeight;
    ballWeightNum.value = recipe.ballWeight;

    hydrationRange.value = recipe.hydration;
    hydrationNum.value = recipe.hydration;

    // Load auto yeast state
    isAutoYeast = !!recipe.isAutoYeast;
    autoYeastCheck.checked = isAutoYeast;
    
    // Sync time and temperature settings if present
    const loadedUnit = recipe.tempUnit || 'C';
    tempUnit = loadedUnit;
    if (loadedUnit === 'C') {
      unitBtnC.classList.add('active');
      unitBtnF.classList.remove('active');
      tempUnitLabel.textContent = '°C';
      fermentTempRange.min = '3';
      fermentTempRange.max = '35';
      fermentTempRange.step = '0.5';
    } else {
      unitBtnF.classList.add('active');
      unitBtnC.classList.remove('active');
      tempUnitLabel.textContent = '°F';
      fermentTempRange.min = '37';
      fermentTempRange.max = '95';
      fermentTempRange.step = '1';
    }
    
    fermentTimeNum.value = recipe.fermentTime || 24;
    fermentTimeRange.value = recipe.fermentTime || 24;
    fermentTempNum.value = recipe.fermentTemp || 20;
    fermentTempRange.value = recipe.fermentTemp || 20;

    if (recipe.isAutoYeast) {
      // Update UI classes
      tempTimeContainer.classList.remove('hidden-accordion');
      yeastRange.disabled = true;
      yeastNum.disabled = true;
      yeastRange.closest('.slider-wrapper').classList.add('disabled');
      yeastNum.closest('.number-input-wrapper').classList.add('disabled');
    } else {
      tempTimeContainer.classList.add('hidden-accordion');
      yeastRange.disabled = false;
      yeastNum.disabled = false;
      yeastRange.closest('.slider-wrapper').classList.remove('disabled');
      yeastNum.closest('.number-input-wrapper').classList.remove('disabled');
    }

    yeastTypeSelect.value = recipe.yeastType;
    // We call handleYeastTypeChange but note that since we restored state above, it should behave correctly
    handleYeastTypeChange(); 

    // Set slider/number values
    if (!isAutoYeast) {
      yeastRange.value = recipe.yeast;
      yeastNum.value = recipe.yeast;
    }

    saltRange.value = recipe.salt;
    saltNum.value = recipe.salt;

    oilRange.value = recipe.oil;
    oilNum.value = recipe.oil;

    sugarRange.value = recipe.sugar;
    sugarNum.value = recipe.sugar;

    detectCustomPreset();
    calculateDough();

    // Scroll to the top on mobile so results are visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function deleteRecipe(id) {
    savedRecipes = savedRecipes.filter(r => r.id !== id);
    localStorage.setItem('pizza_recipes', JSON.stringify(savedRecipes));
    renderSavedRecipes();
  }

  // --- THEME SELECTOR ENGINE ---
  function initThemeSelector() {
    currentTheme = localStorage.getItem('theme') || 'system';
    applyThemeAttributes(currentTheme);
    updateThemeSelectorUI();
    
    themeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        setTheme(theme);
      });
    });
    
    const systemThemeQuery = window.matchMedia('(prefers-color-scheme: light)');
    if (systemThemeQuery.addEventListener) {
      systemThemeQuery.addEventListener('change', () => {
        if (currentTheme === 'system') {
          applyThemeAttributes('system');
        }
      });
    } else if (systemThemeQuery.addListener) {
      systemThemeQuery.addListener(() => {
        if (currentTheme === 'system') {
          applyThemeAttributes('system');
        }
      });
    }
  }

  function setTheme(theme) {
    if (currentTheme === theme) return;
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    updateThemeSelectorUI();
    applyThemeAttributes(theme);
  }

  function updateThemeSelectorUI() {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }

  function applyThemeAttributes(theme) {
    let appliedTheme = theme;
    if (theme === 'system') {
      appliedTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-applied-theme', appliedTheme);
    
    const themeColorMeta = document.getElementById('pwaThemeColor');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', appliedTheme === 'light' ? '#fcf9f5' : '#140f0d');
    }
  }

  // --- SERVICE WORKER CONTROL ---
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((registration) => {
            console.log('[PWA] ServiceWorker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.error('[PWA] ServiceWorker registration failed:', error);
          });
      });
    }
  }

  // --- PWA INSTALL PROMPT HANDLING ---
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    installBtn.style.display = 'inline-flex';
  });

  installBtn.addEventListener('click', () => {
    // Hide our custom install button
    installBtn.style.display = 'none';
    if (!deferredPrompt) return;
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
      } else {
        console.log('[PWA] User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] Pizza Dough Master was installed');
    installBtn.style.display = 'none';
  });
});
