export default {
    common: {
      title: 'Alcohol calculator',
      calculate: 'Calculate',
      results: 'Results',
      error: 'Please fill in all fields',
      totalVolume: 'Total volume',
      finalStrength: 'Final strength',
      requiredSugar: 'Required sugar',
      requiredWater: 'Required water',
      requiredAlcohol: 'Required alcohol'
    },
    calculators: {
      volume: {
        title: 'Volume calculator',
        description: 'Calculate the final volume and strength of your solution based on ingredients',
        inputs: {
          sugar: 'Sugar (g)',
          sugarHelper: '1g of sugar equals 0.63ml',
          water: 'Water (g)',
          waterHelper: '1g of water equals 1ml',
          alcohol: 'Alcohol (g)',
          alcoholVol: 'Alcohol vol (%)',
          alcoholHelper: 'The volume is expressed at 20º Celsius'
        }
      },
      waterSugar: {
        title: 'Water/sugar calculator',
        description: 'Calculate required water and sugar amounts based on alcohol input',
        inputs: {
          alcohol: 'Alcohol (g)',
          alcoholVol: 'Alcohol vol (%)',
          desiredStrength: 'Desired strength (%)',
          ratio: 'Sugar to water ratio'
        }
      },
      ingredients: {
        title: 'Ingredients calculator',
        description: 'Calculate all ingredients based on desired final volume',
        inputs: {
          volume: 'Total volume (ml)',
          desiredStrength: 'Desired strength (%)',
          alcoholVol: 'Alcohol vol (%)',
          ratio: 'Sugar to water ratio'
        }
      }
    }
  };