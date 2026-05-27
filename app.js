/* ==========================================================================
   Pizza Dough Master - Calculator Logic & PWA Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE ---
  let currentPreset = 'neapolitan';
  let savedRecipes = [];
  let isAutoYeast = false;
  let tempUnit = 'C'; // 'C' or 'F'
  let currentTheme = 'system';

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

  // --- INITIALIZATION ---
  initApp();

  function initApp() {
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

  function calculateYeastPercentage(time, tempC, type) {
    // standard IDY formula: Y = 4.8 / (t * 2.55^(T/10))
    // Sourdough formula: Y = 1250 / (t * 2.55^(T/10))
    const base = 2.55;
    const rate = Math.pow(base, tempC / 10);
    
    if (type === 'sourdough') {
      const val = 1250 / (time * rate);
      // clamp sourdough starter between 5% and 40%
      return Math.min(Math.max(val, 5.0), 40.0);
    } else {
      const idyVal = 4.8 / (time * rate);
      let val = idyVal;
      if (type === 'ady') val = idyVal * 1.5;
      if (type === 'fresh') val = idyVal * 3.0;
      // clamp dry/fresh yeast between 0.01% and 3.0%
      return Math.min(Math.max(val, 0.01), 3.0);
    }
  }

  function calculateFermentationTime(yeastPercent, tempC, type) {
    const base = 2.55;
    const rate = Math.pow(base, tempC / 10);
    
    if (type === 'sourdough') {
      const val = 1250 / (yeastPercent * rate);
      // clamp time between 2 and 72 hours
      return Math.min(Math.max(val, 2.0), 72.0);
    } else {
      let k = 4.8;
      if (type === 'ady') k = 4.8 * 1.5;
      if (type === 'fresh') k = 4.8 * 3.0;
      const val = k / (yeastPercent * rate);
      // clamp time between 2 and 72 hours
      return Math.min(Math.max(val, 2.0), 72.0);
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
