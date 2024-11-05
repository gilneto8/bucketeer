'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ColorMixer from './_components/ColorMixer';
import ColorRecipeFinder from './_components/ColorRecipeFinder';

export default function Home() {
  return (
    <div className='container mx-auto p-4 max-w-4xl'>
      <h1 className='text-4xl font-bold text-center mb-8'>Bucketeer</h1>

      <Tabs defaultValue='mixer' className='w-full' variant={'cards'}>
        <TabsList className='grid w-full grid-cols-2' variant={'cards'}>
          <TabsTrigger value='mixer'>Color Mixer</TabsTrigger>
          <TabsTrigger value='finder'>Recipe Finder</TabsTrigger>
        </TabsList>

        <TabsContent value='mixer' className='mt-6' variant={'cards'}>
          <ColorMixer />
        </TabsContent>

        <TabsContent value='finder' className='mt-6' variant={'cards'}>
          <ColorRecipeFinder />
        </TabsContent>
      </Tabs>
    </div>
  );
}
