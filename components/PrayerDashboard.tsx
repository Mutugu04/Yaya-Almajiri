import React, { useEffect, useState } from 'react';
import { getPrayerTimes, getQiblaDirection } from '../services/externalApiService';
import { PrayerTimesData, QiblaData } from '../types';

export const PrayerDashboard: React.FC = () => {
  const [prayerData, setPrayerData] = useState<PrayerTimesData | null>(null);
  const [qibla, setQibla] = useState<QiblaData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [heading, setHeading] = useState<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser.");
        setLoading(false);
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
            const [pData, qData] = await Promise.all([
                getPrayerTimes(latitude, longitude),
                getQiblaDirection(latitude, longitude)
            ]);
            setPrayerData(pData);
            setQibla(qData);
        } catch (e) {
            setError("Failed to fetch data.");
        } finally {
            setLoading(false);
        }
    }, (err) => {
        setError("Unable to retrieve your location. Please enable location services.");
        setLoading(false);
    });
  }, []);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // webkitCompassHeading for iOS, alpha for Android (simplified)
      const compass = (event as any).webkitCompassHeading || Math.abs((event.alpha || 0) - 360);
      setHeading(compass);
    };

    // Check if DeviceOrientationEvent is available
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const requestCompassPermission = async () => {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          try {
              const response = await (DeviceOrientationEvent as any).requestPermission();
              if (response === 'granted') {
                  // Listener is already attached in useEffect, it should start working
                  alert("Compass permission granted.");
              } else {
                  alert("Permission denied.");
              }
          } catch (e) {
              console.error(e);
          }
      } else {
          alert("Your device does not require specific permission or does not support this API.");
      }
  };

  if (loading) {
      return (
          <div className="flex justify-center items-center h-64 text-moroccan-teal">
              <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
          </div>
      );
  }

  if (error) {
      return (
          <div className="p-8 text-center bg-white/80 rounded-xl shadow-lg border-l-4 border-red-500 max-w-2xl mx-auto mt-10">
              <h3 className="text-xl font-bold text-red-600 mb-2">Location Error</h3>
              <p className="text-gray-700">{error}</p>
          </div>
      );
  }

  // Calculate needle rotation: Qibla Angle relative to North - Device Heading
  // If heading is null (desktop), just show Qibla Angle relative to North.
  const needleRotation = heading !== null && qibla 
    ? qibla.direction - heading 
    : (qibla?.direction || 0);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 p-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-moroccan-teal to-teal-800 rounded-2xl shadow-xl p-6 md:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end">
                <div>
                    <h2 className="text-3xl font-arabic font-bold mb-1">Prayer Times</h2>
                    <p className="opacity-90 font-serif text-sm md:text-base">{prayerData?.date.readable} • {prayerData?.date.hijri.date} {prayerData?.date.hijri.month.en}</p>
                </div>
                <div className="mt-4 md:mt-0 inline-flex items-center bg-white/20 px-3 py-1 rounded-full text-xs md:text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {prayerData?.meta.timezone}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Times Grid */}
            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-moroccan-gold/20 p-6">
                <h3 className="text-lg font-bold text-moroccan-dark mb-4 border-b border-gray-100 pb-2">Daily Schedule</h3>
                <div className="space-y-3">
                    {[
                        { name: 'Fajr', time: prayerData?.timings.Fajr, icon: '🌅' },
                        { name: 'Sunrise', time: prayerData?.timings.Sunrise, icon: '☀️' },
                        { name: 'Dhuhr', time: prayerData?.timings.Dhuhr, icon: '🕛' },
                        { name: 'Asr', time: prayerData?.timings.Asr, icon: '🌤️' },
                        { name: 'Maghrib', time: prayerData?.timings.Maghrib, icon: '🌇' },
                        { name: 'Isha', time: prayerData?.timings.Isha, icon: '🌙' },
                    ].map((prayer) => (
                        <div key={prayer.name} className="flex justify-between items-center p-2 hover:bg-moroccan-sand/20 rounded-lg transition-colors group">
                            <div className="flex items-center space-x-3">
                                <span className="text-xl">{prayer.icon}</span>
                                <span className="font-semibold text-moroccan-dark text-base">{prayer.name}</span>
                            </div>
                            <span className="font-mono text-lg text-moroccan-teal font-bold bg-gray-50 px-2 py-0.5 rounded border border-gray-100 group-hover:border-moroccan-gold/30">
                                {prayer.time?.split(' ')[0]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Qibla Compass */}
            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-moroccan-gold/20 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                 <h3 className="text-lg font-bold text-moroccan-dark mb-1 relative z-10">Qibla Direction</h3>
                 <p className="text-gray-500 text-xs mb-6 relative z-10">{heading !== null ? "Live Compass Mode" : "Static Direction (North Up)"}</p>
                 
                 <div className="relative w-48 h-48 rounded-full border-4 border-gray-200 flex items-center justify-center bg-gray-50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] z-10">
                     {/* Compass Rose */}
                     <div className="absolute inset-0 rounded-full flex items-center justify-center">
                        <span className="absolute top-2 text-xs font-bold text-gray-400">N</span>
                        <span className="absolute bottom-2 text-xs font-bold text-gray-400">S</span>
                        <span className="absolute left-2 text-xs font-bold text-gray-400">W</span>
                        <span className="absolute right-2 text-xs font-bold text-gray-400">E</span>
                     </div>
                     
                     {/* Static Needle Container - Rotates based on heading + Qibla offset */}
                     <div 
                        className="absolute w-full h-full rounded-full transition-transform duration-500 ease-out"
                        style={{ transform: `rotate(${needleRotation}deg)` }}
                     >
                        <div className="w-1.5 h-20 bg-gradient-to-t from-transparent to-red-600 rounded-full absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                             <div className="w-3 h-3 bg-red-600 rounded-full -mt-1 shadow-lg"></div>
                        </div>
                         {/* Kaaba Icon at end of needle */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 -translate-y-full">
                            <div className="w-6 h-6 bg-black border border-gold rounded-sm shadow-md"></div>
                        </div>
                     </div>
                     
                     <div className="w-3 h-3 bg-moroccan-dark rounded-full z-20 border-2 border-white shadow"></div>
                 </div>
                 
                 <div className="mt-6 text-2xl font-bold text-moroccan-teal font-mono relative z-10">
                     {Math.round(qibla?.direction || 0)}°
                     <span className="text-xs text-gray-400 block font-sans font-normal mt-1">from True North</span>
                 </div>

                 {heading === null && (
                    <button onClick={requestCompassPermission} className="mt-4 text-xs text-moroccan-teal underline z-10 relative">
                        Enable Live Compass (Mobile)
                    </button>
                 )}
                 
                 {/* Decorative BG */}
                 <div className="absolute -bottom-10 -right-10 text-9xl text-moroccan-gold/5 font-arabic pointer-events-none z-0">
                     قبلة
                 </div>
            </div>
        </div>
    </div>
  );
};