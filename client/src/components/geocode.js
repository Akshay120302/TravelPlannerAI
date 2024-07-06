export const geocodeCity = async (city) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
    if (!response.ok) {
      throw new Error(`Geocoding error: ${response.status}`);
    }
    const data = await response.json();
    if (data.length === 0) {
      throw new Error(`No results found for city: ${city}`);
    }
    const { lat, lon } = data[0];
    return { lat, lon };
  };