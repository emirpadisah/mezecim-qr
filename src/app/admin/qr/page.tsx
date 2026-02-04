'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

export default function AdminQR() {
  const [origin] = useState(() =>
    typeof window !== 'undefined' ? window.location.origin : ''
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-[2rem] shadow-xl max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-[#8b4513] mb-2">Mezecim QR</h2>
        <p className="text-gray-500 text-sm mb-8">Müşterilerinizin menüye ulaşması için bu kodu masalara yerleştirebilirsiniz.</p>
        
        <div className="bg-[#fdf5e6] p-6 rounded-2xl inline-block mb-8">
          {origin && (
            <QRCodeSVG 
              value={origin} 
              size={200}
              fgColor="#8b4513"
              level="H"
              includeMargin={true}
            />
          )}
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => window.print()}
            className="w-full bg-[#8b4513] text-white py-3 rounded-xl font-bold hover:bg-[#6b3410] transition-colors"
          >
            QR Kodu Yazdır
          </button>
          <p className="text-[10px] text-gray-400">
            URL: {origin}
          </p>
        </div>
      </div>
    </div>
  );
}
