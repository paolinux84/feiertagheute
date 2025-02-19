"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import holidaysData from  "../holidays.json"
import Script from "next/script";

export default function Home() {
  //const [selectedRegion, setSelectedRegion] = useState(null);
  const [gdprPreferences, setGdprPreferences] = useState({ analytics: false, ads: false, accepted: false });

interface gdprPreferences{
  analytics: boolean,
   ads: boolean, 
   accepted: boolean
}


const holidays: { [key: string]: string[] } = holidaysData;

  useEffect(() => {
    const consent = localStorage.getItem("gdprPreferences");
    if (consent) setGdprPreferences(JSON.parse(consent));
  }, []);

  const updateGdpr = (prefs : gdprPreferences) => {
    localStorage.setItem("gdprPreferences", JSON.stringify(prefs));
    setGdprPreferences(prefs);
  };

  const acceptAll = () => updateGdpr({ analytics: true, ads: true, accepted: true });
  const rejectAll = () => updateGdpr({ analytics: false, ads: false, accepted: true });
  const acceptAnalytics = () => updateGdpr({ ...gdprPreferences, analytics: true, accepted: true });
  const acceptAds = () => updateGdpr({ ...gdprPreferences, ads: true, accepted: true });

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Google Analytics */}
      {gdprPreferences.analytics && (
        <>
          <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`} />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-XXXXXXXXXX');
              `,
            }}
          />
        </>
      )}

      {/* Google AdSense */}
      {gdprPreferences.ads && (
        <Script
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          data-ad-client="ca-pub-XXXXXXXXXXXXXX"
          async
        />
      )}

      {/* GDPR Banner */}
      {!gdprPreferences.accepted && (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4 text-center">
          <p>Diese Website verwendet Cookies für Google Analytics und Werbung.</p>
          <button onClick={acceptAll} className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2 mr-2">
            Alle Akzeptieren
          </button>
          <button onClick={acceptAnalytics} className="bg-green-600 text-white px-4 py-2 rounded-lg mt-2 mr-2">
            Nur Analytics Akzeptieren
          </button>
          <button onClick={acceptAds} className="bg-yellow-600 text-white px-4 py-2 rounded-lg mt-2 mr-2">
            Nur Werbung Akzeptieren
          </button>
          <button onClick={rejectAll} className="bg-red-600 text-white px-4 py-2 rounded-lg mt-2">
            Ablehnen
          </button>
        </div>
      )}

      {/* Navbar */}
      <header className="bg-blue-700 text-white py-4 px-6 text-center text-3xl font-bold shadow-md w-full">
        Feiertag Heute
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center mt-10">
        <Image src="/holiday.jpg" alt="Feiertag Bild" width={600} height={400} className="rounded-lg shadow-md" />
        <p className="text-lg mt-4 text-gray-700">Finde heraus, wo heute ein Feiertag ist!</p>
      </div>

      {/* Bundesländer Tabelle */}
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Feiertage nach Bundesland</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="border border-gray-300 p-2">Bundesland</th>
              <th className="border border-gray-300 p-2">Feiertag heute?</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(holidays).map((region) => (
              <tr key={region} className="text-center hover:bg-gray-100 cursor-pointer">
                <td className="border border-gray-300 p-2">{region}</td>
                <td className="border border-gray-300 p-2">{holidays[region].includes(new Date().toISOString().split("T")[0]) ? "🎉 Ja" : "❌ Nein"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <footer className="bg-blue-700 text-white text-center py-4 mt-10 shadow-md w-full">
        &copy; {new Date().getFullYear()} FeiertagHeute. Alle Rechte vorbehalten.
      </footer>
    </div>
  );
}
