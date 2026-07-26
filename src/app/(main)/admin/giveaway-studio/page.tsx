import React from 'react';
import GiveawayStudioClient from './GiveawayStudioClient';

export const metadata = {
  title: 'Turnuva & Çekiliş Stüdyosu v2.0 - HabboZone Admin',
  description: 'Habbo turnuva eşleşme şemaları oluşturun, çekiliş yapın ve kazanan sertifikaları export edin.',
};

export default function GiveawayStudioPage() {
  return (
    <div className="space-y-6">
      <GiveawayStudioClient />
    </div>
  );
}
