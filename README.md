# Pizza Dough Master Calculator

A premium, offline-first Progressive Web Application (PWA) designed for professional and home bakers to calculate pizza dough formulations using baker's percentages. 

This application requires zero infrastructure, has no external database dependencies, and operates 100% offline.

---

## Key Features

1. **Baker's Percentages & Grams**: Shows exact ingredient weights in grams alongside their baker's percentages (where total flour is always 100%).
2. **Hydration Control**: Adjustable hydration levels (from 40% to 100%) to target different styles of dough.
3. **Flexible Yeast Selection & Conversions**:
   - Supports **Instant Dry Yeast (IDY)**, **Active Dry Yeast (ADY)**, and **Fresh Yeast (Compressed)**.
   - Includes a real-time **Yeast Equivalents** helper displaying the converted amount for all three types.
   - **Yeast Prediction Engine**: Can automatically calculate yeast percentage based on desired **fermentation time** (2 to 72 hours) and **ambient temperature** ($3^\circ\text{C}$ to $35^\circ\text{C}$ / $37^\circ\text{F}$ to $95^\circ\text{F}$).
4. **Sourdough Starter Compensation**:
   - Built-in support for **Sourdough Starter (Levain)** at 100% hydration.
   - Automatically recalculates and reduces the added flour and water measurements in the mix to account for the flour/water present in the starter.
5. **Style Presets**: An interactive list of presets representing famous pizza styles (Neapolitan, New York, Detroit/Sicilian, Chicago Deep Dish) that animate sliders to their historical parameters upon activation.
6. **Formulations Manager**:
   - Save custom recipes directly to `localStorage` with name descriptors.
   - Load, view, and delete saved formulations offline.
7. **PWA Installation & Offline Support**:
   - Works fully offline using a local Service Worker (`sw.js`).
   - Custom installation prompts inside the header when running in supported environments.

---

## Technical Highlights & Mathematical Model

### Standard Baker's Percentages
For standard yeasts (IDY, ADY, Fresh), all ingredients are calculated relative to the total flour weight $F$:
* $\text{Total Flour } (F) = 100\%$
* $\text{Water} = F \times \frac{\text{Hydration}\%}{100}$
* $\text{Yeast} = F \times \frac{\text{Yeast}\%}{100}$
* $\text{Salt} = F \times \frac{\text{Salt}\%}{100}$
* $\text{Oil} = F \times \frac{\text{Oil}\%}{100}$
* $\text{Sugar} = F \times \frac{\text{Sugar}\%}{100}$

Given a desired total weight $W$ (computed as number of balls $\times$ ball weight), the flour weight $F$ is solved as:
$$F = \frac{W}{1 + \frac{\text{Hydration} + \text{Yeast} + \text{Salt} + \text{Oil} + \text{Sugar}}{100}}$$

### Yeast Prediction Engine Formulas
Yeast activity accelerates exponentially with temperature. The application uses curve-fitted functions derived from empirical research on fermentation speed to solve for the necessary yeast percentage ($Y$):

* **Instant Dry Yeast (IDY)**:
  $$Y_{\text{IDY}} = \frac{4.8}{t \times 2.55^{T/10}}$$
  where $t$ is the fermentation time in hours, and $T$ is the temperature in Celsius.
* **Active Dry Yeast (ADY)**:
  $$Y_{\text{ADY}} = Y_{\text{IDY}} \times 1.5$$
* **Fresh Yeast**:
  $$Y_{\text{Fresh}} = Y_{\text{IDY}} \times 3.0$$
* **Sourdough Starter (100% Hydration)**:
  $$Y_{\text{Sourdough}} = \frac{1250}{t \times 2.55^{T/10}}$$

Temperatures provided in Fahrenheit ($T_{\text{F}}$) are normalized to Celsius ($T_{\text{C}}$) before calculation:
$$T_{\text{C}} = (T_{\text{F}} - 32) \times \frac{5}{9}$$

### Sourdough Compensation Model
When Sourdough Starter is selected, it acts as both a levelling agent and an addition of flour and water (assuming $100\%$ hydration starter: $50\%$ flour, $50\%$ water).

To maintain the exact hydration ratio requested by the user, the application recalculates the actual flour and water to add to the mixing bowl:
1. The total flour weight $F$ is first computed based only on the dry ingredients, salt, oil, and sugar:
   $$F = \frac{W}{1 + \frac{\text{Hydration} + \text{Salt} + \text{Oil} + \text{Sugar}}{100}}$$
2. The starter weight is calculated using the user-specified percentage ($Y\%$):
   $$\text{Starter Weight} = F \times \frac{Y}{100}$$
3. The flour and water contributions inside the starter are subtracted:
   $$\text{Starter Flour} = \text{Starter Water} = \frac{\text{Starter Weight}}{2}$$
4. The remaining ingredients to mix are outputted:
   $$\text{Added Flour} = F - \text{Starter Flour}$$
   $$\text{Added Water} = \left(F \times \frac{\text{Hydration}}{100}\right) - \text{Starter Water}$$

This prevents the sourdough starter from accidentally increasing the dough's total hydration, resulting in perfect dough consistency every time.

---

## Project Structure

```bash
pizza-dough-calculator/
├── index.html        # Main interface markup & layout
├── index.css         # Glassmorphism design system styles
├── app.js            # Input binding & formula math calculations
├── sw.js             # PWA Service Worker caching static assets
├── manifest.json     # PWA deployment file
├── icon.svg          # Pizza slice vector launcher icon
└── README.md         # Documentation (this file)
```

---

## Running Locally

To run the application locally:

1. Open your terminal in the directory.
2. Spin up a basic web server. For example, using Python:
   ```bash
   python3 -m http.server 8080
   ```
3. Open your browser and navigate to `http://localhost:8080`.
4. To test the PWA features (such as installation and offline caching), access the developer console (`F12`), head to the **Application** tab, and toggle **Offline** in the Service Workers menu.
