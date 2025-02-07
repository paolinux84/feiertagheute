import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import holidays from "@/holidays.json";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "Ungültige Anfrage: Koordinaten fehlen." }, { status: 400 });
  }

  try {
    const region = await getLandFromCoordinates(lat, lon);
    const isHoliday = checkHoliday(region);
    return NextResponse.json({ isHoliday, region });
  } catch (error) {
    console.error("Fehler bei der Feiertagsprüfung", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

async function getLandFromCoordinates(latitude: string, longitude: string): Promise<string> {
  const apiKey = "32ec2004ae824a78a942b661394f16b0";
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&language=de&pretty=1`;

  try {
    const response = await axios.get(url);
    const components = response.data.results[0].components;
    return components.state || "Unbekannte Region";
  } catch (error) {
    console.error("Fehler beim Geocoding", error);
    throw new Error("Konnte Region nicht bestimmen.");
  }
}

function checkHoliday(region: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return holidays[region]?.includes(today) || false;
}
