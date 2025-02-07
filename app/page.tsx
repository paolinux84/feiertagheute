"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Location {
  latitude: number;
  longitude: number;
}

interface HolidayData {
  isHoliday: boolean;
  region: string;
}

export default function Home() {
  const [location, setLocation] = useState<Location | null>(null);
  const [holiday, setHoliday] = useState<HolidayData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          try {
            const response = await fetch(`/api/check-holiday?lat=${latitude}&lon=${longitude}`);
            if (!response.ok) throw new Error("Fehler beim Abrufen der Daten");
            const data: HolidayData = await response.json();
            setHoliday(data);
          } catch (error) {
            console.error("Fehler bei der API-Anfrage", error);
            setError("Daten konnten nicht geladen werden.");
          }
          setLoading(false);
        },
        (error) => {
          console.error("Fehler bei der Standortermittlung", error);
          setError("Standortermittlung fehlgeschlagen.");
          setLoading(false);
        }
      );
    } else {
      setError("Standortermittlung wird nicht unterstützt.");
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-700 to-purple-900 text-white p-6">
      <h1 className="text-5xl font-extrabold shadow-lg p-6 rounded-lg bg-black bg-opacity-60">Feiertag Heute</h1>
      
      {loading ? (
        <p className="text-lg mt-4 animate-pulse">Laden...</p>
      ) : error ? (
        <p className="text-lg mt-4 text-red-400">{error}</p>
      ) : holiday ? (
        <p className="text-2xl mt-6 font-semibold bg-white bg-opacity-20 p-6 rounded-lg shadow-md">
          {holiday.isHoliday ? `🎉 Heute ist ein Feiertag in ${holiday.region}!` : `❌ Heute ist kein Feiertag in ${holiday.region}.`}
          {holiday.isHoliday ? <Image src="/holiday.jpg" alt="Feiertag Bild" width={500} height={300} className="rounded-lg mt-6 shadow-md" /> :
           <Image src="/work.jpg" alt="Arbeitstag Bild" width={500} height={300} className="rounded-lg mt-6 shadow-md" /> }
        </p>
      ) : (
        <p className="text-lg mt-4">Feiertagsinformationen konnten nicht ermittelt werden.</p>
      )}
    </div>
  );
}
