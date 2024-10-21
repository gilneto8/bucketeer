'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Edit2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getTextColorForBackground } from '@/utils/fontColor';
import { colorDistanceWithThreshold, ralColors as rals } from '@/assets/rals';
import { hexToRgb, rgbToHex } from '@/utils/color';

interface Color {
  id: string;
  name: string;
  hex: string;
  quantity: number;
}

export default function Bucketeer() {
  const [colors, setColors] = useState<Color[]>([]);
  const [newColorCode, setNewColorCode] = useState<string>('');
  const [newQuantity, setNewQuantity] = useState(1);
  const [resultColor, setResultColor] = useState('#000000');
  const [editingId, setEditingId] = useState<string>(null as unknown as string);

  useEffect(() => {
    calculateResultColor();
  }, [colors]);

  const addColor = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(newColorCode);
    const newColor = rals.find(r => r.id === newColorCode)!;
    const hex = newColor.hex;
    const name = newColor.name;

    if (editingId !== null) {
      setColors(colors.map(color => (color.id === editingId ? { ...color, hex, quantity: newQuantity, name } : color)));
      setEditingId(null as unknown as string);
    } else {
      setColors([...colors, { id: Date.now().toString(), hex, quantity: newQuantity, name }]);
    }
  };

  const removeColor = (id: string) => {
    setColors(colors.filter(color => color.id !== id));
  };

  const editColor = (color: Color) => {
    if (editingId) {
      setEditingId(null as unknown as string);
    } else {
      const ralCode = rals.find(r => r.hex === color.hex)!;
      setNewColorCode(ralCode.id);
      setNewQuantity(color.quantity);
      setEditingId(color.id);
    }
  };

  const calculateResultColor = () => {
    if (colors.length === 0) {
      setResultColor('#000000');
      return;
    }

    let totalQuantity = 0;
    let r = 0,
      g = 0,
      b = 0;

    colors.forEach(color => {
      const rgb = hexToRgb(color.hex);
      if (rgb) {
        r += rgb.r * color.quantity;
        g += rgb.g * color.quantity;
        b += rgb.b * color.quantity;
        totalQuantity += color.quantity;
      }
    });

    r = Math.round(r / totalQuantity);
    g = Math.round(g / totalQuantity);
    b = Math.round(b / totalQuantity);

    setResultColor(rgbToHex(r, g, b));
  };

  return (
    <div className='container mx-auto p-4 max-w-md flex flex-col items-center'>
      <h1 className='text-4xl font-bold mb-12'>Bucketeer</h1>

      <form onSubmit={addColor} className='mb-6 w-full space-y-4'>
        <div>
          <Label htmlFor='colorPicker' className='mb-1 block'>
            Color:
          </Label>
          <div className='flex space-x-3'>
            <select
              id='ralColorPicker'
              value={newColorCode}
              onChange={e => setNewColorCode(e.target.value)}
              className='w-full p-2 border rounded'
            >
              <option key='empty' value={''} />
              {rals.map(r => (
                <option key={r.id} value={r.id}>
                  {r.id} - {r.name}
                </option>
              ))}
            </select>
            <Input
              type='number'
              id='quantityInput'
              value={newQuantity === 0 ? '' : newQuantity}
              onChange={e => {
                const value = e.target.value;
                // Only update the state if the value is a number or empty
                if (value === '' || /^[0-9]+$/.test(value)) {
                  setNewQuantity(value === '' ? 0 : Number(value));
                }
              }}
              className='w-20 h-10'
              suffix='ml'
            />
          </div>
        </div>
        <Button variant={'default'} type='submit' className='w-full' disabled={newColorCode === ''}>
          {editingId !== null ? 'Update Color' : 'Add Color'}
        </Button>
      </form>

      {colors.length ? (
        <>
          <div className='flex items-center flex-col mb-6 w-full'>
            <h2 className='text-xl font-semibold mb-2'>Added Colors</h2>
            <ul className='space-y-2 w-full'>
              {colors.map(color => (
                <li key={color.id} className='flex items-center justify-between p-2 bg-white rounded'>
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
                    <Button variant='ghost' size='icon' onClick={() => removeColor(color.id)}>
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className='flex items-center flex-col w-full'>
            <h2 className='text-xl font-semibold mb-2'>Result Color</h2>

            <div className='flex items-center flex-col w-full'>
              <div className='w-full h-24' style={{ backgroundColor: resultColor }}></div>
              <span className='mt-1 text-2xl uppercase'>{resultColor}</span>
              <span className='mt-4 *:mb-2 text-md'>Similar colors</span>
              {colorDistanceWithThreshold(resultColor, 50).map(ral => {
                const color = rals.find(_r => _r.id === ral.id)!;
                return (
                  <Badge className='mb-0.5' size='lg' style={{ backgroundColor: color.hex, color: getTextColorForBackground(color.hex) }}>
                    {color.id} - {color.name}
                  </Badge>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
