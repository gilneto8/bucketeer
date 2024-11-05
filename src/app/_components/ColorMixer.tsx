'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Edit2, Columns2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { rals as ralsClassic } from '@/assets/ralClassic';
import { calculateMixedColor, colorDistance, getTextColorForBackground, rgbToHex, type RalColor, type SimilarColor } from '@/utils/color';

interface Color extends RalColor {
  runtimeId: string;
  quantity: number;
}

export default function ColorMixer() {
  const [colors, setColors] = useState<Color[]>([]);
  const [compareColor, setCompareColor] = useState<RalColor>(null as unknown as RalColor);
  const [similarColors, setSimilarColors] = useState<SimilarColor[]>([]);
  const [threshold, setThreshold] = useState<number>(30);
  const [newColor, setNewColor] = useState<RalColor>(null as unknown as RalColor);
  const [newQuantity, setNewQuantity] = useState(1);
  const [resultColor, setResultColor] = useState('#000000');
  const [editingId, setEditingId] = useState<string>(null as unknown as string);

  useEffect(() => {
    calculateResultColor();
  }, [colors, editingId]);

  const addColor = () => {
    const hex = newColor.hex;
    const name = newColor.name;

    if (editingId !== null) {
      setColors(colors.map(color => (color.id === editingId ? { ...color, hex, quantity: newQuantity, name } : color)));
      setEditingId(null as unknown as string);
    } else {
      setColors([...colors, { runtimeId: Date.now().toString(), hex, quantity: newQuantity, name, id: newColor.id }]);
    }
  };

  const removeColor = (id: string) => {
    setColors(colors.filter(color => color.runtimeId !== id));
  };

  const editColor = (editingColor?: Color) => {
    if (!editingColor) {
      const index = colors.findIndex(r => r.runtimeId === editingId)!;
      const oldColor = colors.find(r => r.runtimeId === editingId)!;
      colors.splice(index, 1, { ...oldColor, hex: newColor!.hex, name: newColor!.name, quantity: newQuantity });
      setColors(colors);
      setEditingId(null as unknown as string);
    } else {
      const color = colors.find(r => r.runtimeId === editingColor.runtimeId)!;
      setNewColor(editingColor);
      setNewQuantity(color.quantity);
      setEditingId(color.runtimeId);
    }
  };

  const calculateResultColor = () => {
    if (colors.length === 0) {
      setResultColor('#000000');
      return;
    }

    // Convert colors to format expected by calculateMixedColor
    const colorMixInput = colors.map(color => ({
      hex: color.hex,
      quantity: color.quantity,
    }));

    const mixedRgb = calculateMixedColor(colorMixInput);
    const result = rgbToHex(mixedRgb.r, mixedRgb.g, mixedRgb.b);
    setResultColor(result);
    const sim = colorDistance(result).filter(dist => dist.distance <= threshold);
    setSimilarColors(sim);
  };

  const updateThreshold = (t: number) => {
    setThreshold(t);
    const sim = colorDistance(resultColor).filter(dist => dist.distance <= t);
    setSimilarColors(sim);
  };

  return (
    <div className='container mx-auto p-4 max-w-md flex flex-col items-center'>
      <div className='mb-6 w-full space-y-4'>
        <div>
          <Label htmlFor='colorPicker' className='mb-1 block font-bold'>
            Color:
          </Label>
          <div className='flex space-x-2'>
            <Select
              value={newColor}
              options={ralsClassic}
              onChangeOption={setNewColor}
              variant='outline'
              size='default'
              className='w-full p-2 border rounded'
            />
            <Input
              type='number'
              id='quantityInput'
              value={newQuantity === 0 ? '' : newQuantity}
              onChange={e => {
                const value = e.target.value;
                if (value === '' || /^[0-9]+$/.test(value)) {
                  setNewQuantity(value === '' ? 0 : Number(value));
                }
              }}
              className='w-20 h-10'
              suffix='ml'
            />
          </div>
        </div>
        <div className='flex flex-row flex-grow'>
          <Button
            variant={'default'}
            type='submit'
            className='w-full'
            disabled={!newColor}
            onClick={() => (editingId !== null ? editColor() : addColor())}
          >
            {editingId !== null ? 'Update Color' : 'Add Color'}
          </Button>
          {editingId ? (
            <Button
              variant={'default'}
              type='submit'
              className='w-28 ml-2'
              disabled={!editingId}
              onClick={() => setEditingId(null as unknown as string)}
            >
              {'Cancel'}
            </Button>
          ) : null}
        </div>
      </div>

      {colors.length ? (
        <>
          <div className='flex items-center flex-col mb-6 w-full'>
            <h2 className='text-xl font-semibold mb-2'>Added Colors</h2>
            <ul className='space-y-2 w-full max-h-64 overflow-y-scroll'>
              {colors.map(color => (
                <li key={color.runtimeId} className='flex items-center justify-between p-2 bg-white rounded'>
                  <div className='flex items-center'>
                    <div className='flex w-16 text-sm'>
                      <span className='flex text-sm font-bold'>{color.quantity} ml</span>
                    </div>
                    <Badge size='lg' style={{ backgroundColor: color.hex, color: getTextColorForBackground(color.hex) }}>
                      {color.name}
                    </Badge>
                  </div>
                  <div className='flex space-x-2'>
                    <Button variant='ghost' size='icon' onClick={() => editColor(color)}>
                      <Edit2 className='h-4 w-4' />
                    </Button>
                    <Button variant='ghost' size='icon' onClick={() => removeColor(color.runtimeId)}>
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className='mt-12 flex items-center flex-col w-full'>
            <h2 className='text-xl font-semibold mb-2'>Result Color</h2>
            <div className='flex items-center flex-col w-full'>
              {!compareColor ? (
                <>
                  <div className='w-full h-24' style={{ backgroundColor: resultColor }}></div>
                  <span className='mt-1 text-lg uppercase text-center'>{resultColor}</span>
                </>
              ) : (
                <div className='flex flex-row w-full'>
                  <div className='flex w-1/2 flex-col'>
                    <div className='h-24' style={{ backgroundColor: resultColor }}></div>
                    <span className='mt-1 text-lg uppercase text-center'>{resultColor}</span>
                  </div>
                  <div className='flex w-1/2 flex-col'>
                    <div className='h-24' style={{ backgroundColor: compareColor.hex }}></div>
                    <span className='mt-1 text-lg text-center'>{compareColor.name}</span>
                  </div>
                </div>
              )}

              <span className='mt-8 text-lg font-bold'>Similar colors</span>
              <Slider variant='outline' min={10} max={50} value={threshold} onChangeValue={updateThreshold} className='mb-6' />
              <div className='flex flex-col items-center w-full max-h-64 overflow-y-scroll'>
                {similarColors.map(sim => (
                  <div key={sim.id} className='flex flex-row'>
                    <Badge
                      key={sim.id}
                      className='mb-0.5 w-64'
                      size='lg'
                      style={{ backgroundColor: sim.hex, color: getTextColorForBackground(sim.hex) }}
                    >
                      {sim.id} - {sim.name}
                    </Badge>

                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => (compareColor === sim ? setCompareColor(null as unknown as RalColor) : setCompareColor(sim))}
                    >
                      <Columns2 className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
