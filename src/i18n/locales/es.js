export default {
    common: {
      title: 'Calculadora de alcohol',
      calculate: 'Calcular',
      results: 'Resultados',
      error: 'Por favor, rellena todos los campos',
      totalVolume: 'Volumen total',
      finalStrength: 'Graduación final',
      requiredSugar: 'Azúcar necesario',
      requiredWater: 'Agua necesaria',
      requiredAlcohol: 'Alcohol necesario'
    },
    calculators: {
      volume: {
        title: 'Calculadora de volumen',
        description: 'Calcula el volumen final y la graduación de tu solución según los ingredientes',
        inputs: {
          sugar: 'Azúcar (g)',
          sugarHelper: '1g de azúcar equivale a 0.63ml',
          water: 'Agua (g)',
          waterHelper: '1g de agua equivale a 1ml',
          alcohol: 'Alcohol (g)',
          alcoholVol: 'Vol de alcohol (%)',
          alcoholHelper: 'A una temperatura de 20°C'
        }
      },
      waterSugar: {
        title: 'Calculadora agua/azúcar',
        description: 'Calcula la cantidad necesaria de agua y azúcar según el alcohol',
        inputs: {
          alcohol: 'Alcohol (g)',
          alcoholVol: 'Vol de alcohol (%)',
          desiredStrength: 'Graduación deseada (%)',
          ratio: 'Proporción azúcar/agua'
        }
      },
      ingredients: {
        title: 'Calculadora de ingredientes',
        description: 'Calcula todos los ingredientes según el volumen final deseado',
        inputs: {
          volume: 'Volumen total (ml)',
          desiredStrength: 'Graduación deseada (%)',
          alcoholVol: 'Vol de alcohol (%)',
          ratio: 'Proporción azúcar/agua'
        }
      }
    }
  };