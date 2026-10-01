const COLOMBO_LAT = 6.9271;
const COLOMBO_LON = 79.8612;

// WMO weather interpretation codes, the subset Open-Meteo actually returns.
const WEATHER_DESCRIPTIONS: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mostly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Foggy',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Heavy showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm',
  99: 'Thunderstorm',
};

export interface ColomboWeather {
  temperatureC: number;
  description: string;
}

/**
 * Open-Meteo needs no API key and has generous, keyless rate limits, so
 * this carries none of the fragility the two news sources do. Fails
 * silently (returns null) rather than ever affecting the rest of the page.
 */
export async function getColomboWeather(): Promise<ColomboWeather | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${COLOMBO_LAT}&longitude=${COLOMBO_LON}&current=temperature_2m,weather_code&timezone=Asia%2FColombo`;
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return null;

    const data = await res.json();
    const temperatureC = data?.current?.temperature_2m;
    const weatherCode = data?.current?.weather_code;

    if (typeof temperatureC !== 'number') return null;

    return {
      temperatureC: Math.round(temperatureC),
      description: WEATHER_DESCRIPTIONS[weatherCode] ?? 'Weather unavailable',
    };
  } catch {
    return null;
  }
}
