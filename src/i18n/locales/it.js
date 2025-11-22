export default {
    common: {
      title: 'Calcolatore di alcol',
      calculate: 'Calcola',
      results: 'Risultati',
      error: 'Compila tutti i campi',
      totalVolume: 'Volume totale',
      finalStrength: 'Gradazione finale',
      requiredSugar: 'Zucchero necessario',
      requiredWater: 'Acqua necessaria',
      requiredAlcohol: 'Alcol necessario'
    },
    calculators: {
      volume: {
        title: 'Calcolatore di volume',
        description: 'Calcola il volume finale e la gradazione della tua soluzione in base agli ingredienti',
        inputs: {
          sugar: 'Zucchero (g)',
          sugarHelper: '1g di zucchero equivale a 0.63ml',
          water: 'Acqua (g)',
          waterHelper: '1g di acqua equivale a 1ml',
          alcohol: 'Alcol (g)',
          alcoholVol: 'Vol alcol (%)',
          alcoholHelper: 'Ad una temperatura di 20°C'
        }
      },
      waterSugar: {
        title: 'Calcolatore acqua/zucchero',
        description: 'Calcola la quantità necessaria di acqua e zucchero in base all\'alcol',
        inputs: {
          alcohol: 'Alcol (g)',
          alcoholVol: 'Vol alcol (%)',
          desiredStrength: 'Gradazione desiderata (%)',
          ratio: 'Rapporto zucchero/acqua'
        }
      },
      ingredients: {
        title: 'Calcolatore ingredienti',
        description: 'Calcola tutti gli ingredienti in base al volume finale desiderato',
        inputs: {
          volume: 'Volume totale (ml)',
          desiredStrength: 'Gradazione desiderata (%)',
          alcoholVol: 'Vol alcol (%)',
          ratio: 'Rapporto zucchero/acqua'
        }
      }
    }
  };