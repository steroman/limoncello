# 🍋 Limoncello calculator

A tiny web app to help you calculate the alc/vol proportions of limoncello (or other infused sweet liqueurs) by:

- Estimating final volume and alcoholic volume from your ingredients
- Calculating the sugar + water needed to reach a target alcoholic volume
- Calculating all ingredients needed to reach a target final volume + alcoholic volume

By using the [3 calculators available](#the-3-calculators), you can understand how much sugar, water, and alcohol you need, get realistic estimates of final volume, or retrieve the required ingredients to get a target alcoholic volume and/or batch size.

It uses a density-based model that takes into account the contraction of the solution, instead of the usual “1g = 1ml” simplification, so results are closer to what you actually bottle.

👉 Live app: [https://steroman.github.io/limoncello/](https://steroman.github.io/limoncello)

## Contents

- [The 3 calculators](#the-3-calculators)
  - [Calculator 1 – Final volume & strength from ingredients](#calculator-1--final-volume--strength-from-ingredients)
  - [Calculator 2 – Sugar & water from alcohol + target strength](#calculator-2--sugar--water-from-alcohol--target-strength)
  - [Calculator 3 – Full recipe from target volume & strength](#calculator-3--full-recipe-from-target-volume--strength)
- [How the math works](#how-the-math-works)
  - [1. Densities](#1-densities)
  - [2. Sugar–water (syrup) volume](#2-sugarwater-syrup-volume)
  - [3. Alcohol volume and ABV](#3-alcohol-volume-and-abv)
  - [4. Solving the “backwards” problems (Calculators 2 & 3)](#4-solving-the-backwards-problems-calculators-2--3)
- [How to run it](#how-to-run-it)
  - [Use the website](#use-the-website)
  - [Run locally](#run-locally)
- [Developing](#developing)git c
- [Project structure](#project-structure)
- [Limitations & assumptions](#limitations)
- [Credits and attributions](#credits-and-attributions)

## The 3 calculators

### Calculator 1 – Final volume & strength from ingredients

The first calculator allows you to get realistic estimates of final volume and ABV from the ingredients you actually used. This is useful when you've already mixed sugar, water, and alcohol—or you plan to use a fixed set of ingredients—and simply want to know what final volume and strength that mixture will produce.

It’s ideal when your recipe is ingredient-driven rather than target-driven, for example when scaling an existing batch or analyzing a traditional family recipe. It answers the question:

> “Given the grams of sugar, water, and alcohol I actually used, what final volume and ABV did I get?”

#### Calculator 1 inputs

- Sugar (g)
- Water (g)
- Alcohol (g)
- Alcohol strength (%) – e.g. 96%

#### Calculator 1 outputs

- Total final volume (ml)
- Final alcohol by volume (% ABV)

### Calculator 2 – Sugar & water from alcohol + target strength

The second calculator helps you determine how much sugar and water you need to reach a specific final ABV, based on the alcohol you already have. Choose this when you start with a fixed amount of alcohol (for example, a full bottle of 96% ethanol) and want to dilute it to a desired strength while controlling sweetness through a chosen sugar-to-water ratio.

This is perfect when your alcohol amount is fixed but your goal is hitting a particular ABV rather than a specific final volume. It answers the question:

> “I have a certain mass of alcohol at a known strength. I want to reach a specific final ABV using a chosen sugar:water ratio. How much sugar and water do I need?”

#### Calculator 2 inputs

- Alcohol (g)
- Alcohol strength (%) – e.g. 96%
- Desired final strength (% ABV) – e.g. 28%
- Sugar-to-water ratio – e.g. `1:2`, `3:5`, `13:20`, etc.

#### Calculator 2 outputs

- Required sugar (g)
- Required water (g)
- Total final volume (ml) (Realistic syrup + alcohol volume, using density-based contraction)

### Calculator 3 – Full recipe from target volume & strength

The third calculator lets you design a complete recipe by specifying the final volume and ABV you want, and it calculates the exact amounts of sugar, water, and alcohol required. Use this when you want to produce a precise batch size (e.g., exactly 1 liter of limoncello at 28% ABV) and need the calculator to work backwards to compute all the ingredient masses, including syrup contraction effects.

This is ideal when you are bottling specific quantities or standardizing production. It answers the question:

> “I want a final batch of limoncello with a specific volume and ABV. Using a chosen sugar:water ratio and a chosen alcohol strength, how much sugar, water, and alcohol do I need?”

#### Calculator 3 inputs

- Total volume (ml) – e.g. 1000 ml
- Desired final strength (% ABV) – e.g. 28%
- Alcohol strength (%) – e.g. 96%
- Sugar-to-water ratio – e.g. `1:2`, `3:5`, etc.

#### Calculator 3 outputs

- Required sugar (g)
- Required water (g)
- Required alcohol (g)
- Total final volume (ml)
(Equal to your target volume — the solver ensures this)

## How the math works

The app uses a density-based model instead of assuming that 1 g = 1 ml. At the core, everything is about converting between mass(grams) and volume(milliliters) correctly for:

- water  
- sugar–water syrup  
- ethanol–water mixtures (your alcohol)

### 1. Densities

In general:

```text
volume_ml = mass_g / density_(g/ml)
mass_g   = volume_ml * density_(g/ml)
```

The app uses several density references:

- Water: Approximated as 1.00 g/ml at 20 °C
- Alcohol (ethanol–water mixtures): A lookup table converts alcohol strength (% ABV) into density (g/L)
- Sugar–water syrup: A lookup table maps °brix (sugar % by mass) → density (g/ml)

### 2. Sugar–water (syrup) volume

Sugar dissolving in water causes volume contraction, so:

```text
syrupVolume ≠ waterVolume + sugarVolume
```

Instead, the app:

1. Computes total mass:

```text
totalMass = sugar + water
```

2. Computes °brix:

```text
brix = (sugar / totalMass) * 100
```

3. Looks up syrup density via linear interpolation.

4. Computes realistic syrup volume:

```text
syrupVolume_ml = totalMass / density
```

### 3. Alcohol volume and ABV

Given:

- `A` = alcohol mass (g)  
- `Sa` = alcohol strength (%)  

Steps:

1. Look up density (g/L).  
2. Convert to volume:

```text
alcoholVolume_ml = (A / density_g_L) * 1000
```

3. Pure ethanol volume:

```text
ethanolVolume_ml = alcoholVolume_ml * (Sa / 100)
```

4. Final ABV:

```text
ABV = (ethanolVolume_ml / totalVolume_ml) * 100
```

### 4. Solving the “backwards” problems (Calculators 2 & 3)

Calculators 2 and 3 solve inverse problems where you specify:

- target ABV  
- (sometimes) target volume  
- sugar:water ratio  

The app must solve for ingredient masses. Because syrup density is non-linear and volumes are not additive, the app uses a numerical solver (bisection) around a scale factor `k`.

#### For Calculator 2

- You give alcohol mass + desired ABV.  
- The solver finds sugar & water masses such that:

```text
finalVolume = ethanolVolume / (desiredABV/100)
```

and

```text
syrupVolume(k) + alcoholVolume = finalVolume
```

#### For Calculator 3

- You give final volume + desired ABV.  
- The solver finds sugar, water, and alcohol such that:

```text
totalVolume(k) = syrupVolume(k) + alcoholVolume(k) ≈ targetVolume
```

## How to run it

### Use the website

The app is deployed via GitHub actions to GitHub Pages:

👉 https://steroman.github.io/limoncello/

### Run locally

You must use the development server or build the project.

#### Option 1 — Development mode

1. Download the repo.
2. Run the following commands:

```bash
npm install
npm run dev
```

3. Open the URL shown in the terminal (usually `http://localhost:5173`).

#### Option 2 — Build & preview the production bundle

This generates the optimized static site and serves it locally:

```bash
npm run build
npm run preview
```

## Developing

### Requirements

- Node 16+
- npm (usually bundled with Node)
- A web browser

Install dependencies and run:

```bash
npm install
npm run dev
```

## Project structure

- `index.html` — entry point for the built app
- `src/`
  - `App.vue` — root component
  - `components/Calculator1.vue`
  - `components/Calculator2.vue`
  - `components/Calculator3.vue`
  - `utils/constants.js` — density tables and ratios
  - `utils/calculations.js` — syrup volume, alcohol volume, ABV math

## Limitations

- Densities are for 20 °C
- Assumes sugar, water, ethanol only
- Uses linear interpolation for brix density
- Reference brix values are limited to 0-60, as the sugar-to-water ratio is limited to fixed values.

## Credits and attributions

Some material used for the app comes from the following PDFs found online:

- [DENSITY OF ETHANOL STRENGTH BY VOLUME (V/V) on `Plantagea.hr` (PDF)](https://www.plantagea.hr/wp-content/uploads/2021/09/Dilution-of-ethanol.pdf)
- [Brix/Density Conversion
Tables from The Soft Drinks Companion book, retrieved from `ttngmai.wordpress.com` (PDF)](https://ttngmai.wordpress.com/wp-content/uploads/2013/10/thesoftdrinks.pdf)
