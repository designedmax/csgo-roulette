interface Skin {
  id: string;
  name: string;
  price: number;
  image: string;
}

export async function getAvailableSkins(maxPrice: number = 100): Promise<Skin[]> {
  try {
    const response = await fetch(`https://market.csgo.com/api/v2/items?key=${process.env.MARKET_CSGO_API_KEY}&price_to=${maxPrice}`);
    const data = await response.json();
    
    if (data.success) {
      return data.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image
      }));
    }
    
    throw new Error('Failed to fetch skins');
  } catch (error) {
    console.error('Error fetching skins:', error);
    return [];
  }
}

export async function reserveSkin(skinId: string): Promise<boolean> {
  try {
    const response = await fetch(`https://market.csgo.com/api/v2/reserve?key=${process.env.MARKET_CSGO_API_KEY}&id=${skinId}`);
    const data = await response.json();
    
    return data.success;
  } catch (error) {
    console.error('Error reserving skin:', error);
    return false;
  }
}

export async function getRandomSkin(maxPrice: number = 100): Promise<Skin | null> {
  const skins = await getAvailableSkins(maxPrice);
  if (skins.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * skins.length);
  return skins[randomIndex];
} 