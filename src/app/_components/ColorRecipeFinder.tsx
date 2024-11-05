import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { rals as ralsClassic } from '@/assets/ralClassic';
import {
  hexToRgb,
  rgbToHex,
  rgbToLab,
  calculateDeltaE,
  getTextColorForBackground,
  calculateMixedColor,
  type RalColor,
} from '@/utils/color';

interface Solution {
  color: RalColor;
  quantity: number;
}

export default function ColorRecipeFinder() {
  const [targetColor, setTargetColor] = useState('#000000');
  const [maxIngredients, setMaxIngredients] = useState(3);
  const [solutions, setSolutions] = useState<Solution[][]>([]);
  const [calculating, setCalculating] = useState(false);

  // Helper function to convert Solution array to format expected by calculateMixedColor
  const convertRecipeFormat = (recipe: Solution[]) => {
    return recipe.map(({ color, quantity }) => ({
      hex: color.hex,
      quantity,
    }));
  };

  const findRecipes = () => {
    setCalculating(true);
    const targetRgb = hexToRgb(targetColor);
    if (!targetRgb) return;

    const targetLab = rgbToLab(targetRgb);

    // Convert all RAL colors to LAB for calculations
    const ralLabs = ralsClassic.map(ral => ({
      color: ral,
      lab: rgbToLab(hexToRgb(ral.hex)),
    }));

    const allSolutions: Solution[][] = [];
    const twoColorSolutions: Array<{ recipe: Solution[]; difference: number }> = [];

    // Find single color solutions
    const singleColorSolutions = ralLabs
      .map(({ color, lab }) => ({
        recipe: [{ color, quantity: 100 }],
        difference: calculateDeltaE(lab, targetLab),
      }))
      .sort((a, b) => a.difference - b.difference)
      .slice(0, 5)
      .map(({ recipe }) => recipe);

    allSolutions.push(...singleColorSolutions);

    // Find 2-color combinations if allowed
    if (maxIngredients >= 2) {
      for (let i = 0; i < ralLabs.length; i++) {
        for (let j = i + 1; j < ralLabs.length; j++) {
          for (let ratio = 5; ratio <= 95; ratio += 5) {
            const recipe = [
              { color: ralLabs[i].color, quantity: ratio },
              { color: ralLabs[j].color, quantity: 100 - ratio },
            ];

            const mixedRgb = calculateMixedColor(convertRecipeFormat(recipe));
            const mixedLab = rgbToLab(mixedRgb);
            const difference = calculateDeltaE(mixedLab, targetLab);

            if (difference < 20) {
              twoColorSolutions.push({ recipe, difference });
            }
          }
        }
      }

      const bestTwoColor = twoColorSolutions
        .sort((a, b) => a.difference - b.difference)
        .slice(0, 5)
        .map(({ recipe }) => recipe);

      allSolutions.push(...bestTwoColor);
    }

    // Find 3-color combinations if allowed
    if (maxIngredients >= 3) {
      const threeColorSolutions: Array<{ recipe: Solution[]; difference: number }> = [];

      const bestPairs = twoColorSolutions.slice(0, 10);

      for (const { recipe: basePair } of bestPairs) {
        for (const { color: thirdColor } of ralLabs) {
          for (let thirdRatio = 10; thirdRatio <= 40; thirdRatio += 10) {
            const remainingRatio = 100 - thirdRatio;
            const recipe = [
              { color: basePair[0].color, quantity: (basePair[0].quantity * remainingRatio) / 100 },
              { color: basePair[1].color, quantity: (basePair[1].quantity * remainingRatio) / 100 },
              { color: thirdColor, quantity: thirdRatio },
            ];

            const mixedRgb = calculateMixedColor(convertRecipeFormat(recipe));
            const mixedLab = rgbToLab(mixedRgb);
            const difference = calculateDeltaE(mixedLab, targetLab);

            if (difference < 15) {
              threeColorSolutions.push({ recipe, difference });
            }
          }
        }
      }

      const bestThreeColor = threeColorSolutions
        .sort((a, b) => a.difference - b.difference)
        .slice(0, 3)
        .map(({ recipe }) => recipe);

      allSolutions.push(...bestThreeColor);
    }

    setSolutions(allSolutions);
    setCalculating(false);
  };

  const renderRecipe = (recipe: Solution[]) => {
    const mixedRgb = calculateMixedColor(convertRecipeFormat(recipe));
    const hexColor = rgbToHex(mixedRgb.r, mixedRgb.g, mixedRgb.b);

    return (
      <div className='border rounded p-4 mb-4 w-full' key={recipe.map(r => r.color.id).join('-')}>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex-1'>
            {recipe.map((solution, idx) => (
              <div key={idx} className='flex items-center mb-2'>
                <Badge
                  className='mr-2'
                  style={{
                    backgroundColor: solution.color.hex,
                    color: getTextColorForBackground(solution.color.hex),
                  }}
                >
                  {solution.quantity.toFixed(1)}%
                </Badge>
                <span>{solution.color.name}</span>
              </div>
            ))}
          </div>
          <div className='flex flex-col items-center space-y-2'>
            <div className='w-20 h-20 rounded border' style={{ backgroundColor: hexColor }}></div>
            <div className='w-20 h-20 rounded border' style={{ backgroundColor: targetColor }}></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='container mx-auto p-4 max-w-md'>
      <h2 className='text-2xl font-bold mb-6'>Color Recipe Finder</h2>

      <div className='space-y-4 mb-6'>
        <div>
          <Label htmlFor='colorInput'>Target Color</Label>
          <Input type='color' id='colorInput' value={targetColor} onChange={e => setTargetColor(e.target.value)} className='h-20 w-full' />
        </div>

        <div>
          <Label htmlFor='maxIngredients'>Max Number of Colors</Label>
          <Input
            type='number'
            id='maxIngredients'
            value={maxIngredients}
            onChange={e => setMaxIngredients(Number(e.target.value))}
            min={1}
            max={3}
          />
        </div>

        <Button onClick={findRecipes} disabled={calculating} className='w-full'>
          {calculating ? 'Calculating...' : 'Find Recipes'}
        </Button>
      </div>

      {solutions.length > 0 && (
        <div>
          <h2 className='text-xl font-semibold mb-4'>Possible Recipes</h2>
          {solutions.map(renderRecipe)}
        </div>
      )}
    </div>
  );
}
