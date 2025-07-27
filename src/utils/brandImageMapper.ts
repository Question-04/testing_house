// Brand image mapping utility
// Maps brand names to their corresponding image files from the ticker folders

export const getBrandImage = (brandName: string, category: string): string => {
  const normalizedBrandName = brandName.toLowerCase().trim();
  
  // Category-specific brand image mappings
  const brandMappings: { [category: string]: { [brand: string]: string } } = {
    sneaker: {
      'nike': '/sneakerticker/Nike AF1.jpg',
      'air jordan': '/sneakerticker/AIr Jordan.jpg',
      'adidas': '/sneakerticker/Adidas Samba OG.jpg',
      'yeezy': '/sneakerticker/Yeezy.jpg',
      'new balance': '/sneakerticker/New Balance Men\'s 530 Sneaker.jpg',
      'on': '/sneakerticker/On Women\'s Cloudtilt Shoes, Black_Ivory Color, for Women Comfortable for Runner.jpg',
      'dunks': '/sneakerticker/Dunks.jpg',
      'sb dunks': '/sneakerticker/SB Dunks 1.jpg',
      'nike dunk': '/sneakerticker/Nike Dunk Low Retro trainers in black and white _ ASOS.jpg',
      'af1': '/sneakerticker/AF1.jpg',
      'air force': '/sneakerticker/AF1.jpg',
      'forum': '/sneakerticker/Adidas Forum Low.jpg',
      'onc': '/sneakerticker/ONC.jpg',
      'brown nike dunk': '/sneakerticker/brown nike dunk lows.jpg',
      'sb dunk': '/sneakerticker/SB dunk 2.jpg',
    },
    apparel: {
      'carhartt': '/apparelticker/Carhartt WIP.png',
      'assc': '/apparelticker/ASSC.png',
      'all saints': '/apparelticker/All saints Jacket.png',
      'fear of god': '/apparelticker/Fear of God Men.png',
      'bape': '/apparelticker/BAPE.png',
      'essentials': '/apparelticker/Essentials.png',
      'aime leon dore': '/apparelticker/aime leon dore.png',
      'bottega veneta': '/apparelticker/bottegaveneta Men.png',
      '3eleven': '/apparelticker/3eleven-27.png',
      'aimé leon dore': '/apparelticker/Aimé Leon Dore\'s SS19 Is the Ultimate Sportswear & Preppy Flex.jpg',
    },
    accessories: {
      'acne studios': '/accessoriesticker/Acne Studios - Vally Fringed Checked Knitted Scarf.jpg',
      'versace': '/accessoriesticker/Su nglasses Versace Sonnenbrille.jpg',
      'stanley': '/accessoriesticker/Stanley Tumbler.jpg',
      'nofomo': '/accessoriesticker/NOFOMO.png',
      'rhode': '/accessoriesticker/rhode phone case ribbon.jpg',
      'belt': '/accessoriesticker/Belt.jpg',
      'sunglasses': '/accessoriesticker/Sunglasses.jpg',
      'card case': '/accessoriesticker/Card Case.png',
      'cute stanley': '/accessoriesticker/Cute Stanley!!!.jpg',
    },
    watch: {
      'carl f bucherer': '/watchticker/Carl F Bucherer.png',
      'graham': '/watchticker/graham-chronofighter-.png',
      'vacheron constantin': '/watchticker/Vacheron Constantin.png',
      'glashütte': '/watchticker/Glashütte.jpg',
      'glashütte original': '/watchticker/Glashütte Original - Seventies Chronograph Panorama Date, _Golden Bay_ and _Ocean Breeze_ editions.jpg',
      'de bethune': '/watchticker/De Bethune.jpg',
      'arnold & son': '/watchticker/Arnold & Son Constant Force Tourbillon.jpg',
      'bell & ross': '/watchticker/Bell & Ross.jpg',
      'jacob & co': '/watchticker/Jacob & Co.jpg',
    },
    perfume: {
      'kilian': '/perfumeticker/Kilian Paris.png',
      'kilian paris': '/perfumeticker/Kilian Paris.png',
      'salvatore ferragamo': '/perfumeticker/Salvatore Ferragamo.png',
      'ferragamo': '/perfumeticker/Salvatore Ferragamo.png',
      'dunhill': '/perfumeticker/Dunhill.jpg',
      'coach': '/perfumeticker/Perfume Hombre Man Edt 100Ml Coach.jpg',
      'perfume': '/perfumeticker/Perfume (2).png',
      'perfumes': '/perfumeticker/perfumes.jpg',
      'perfume.png': '/perfumeticker/perfume.png',
      // Add more generic mappings for any perfume brand
      'any perfume': '/perfumeticker/Perfume (2).png',
      'fragrance': '/perfumeticker/Perfume (2).png',
      'cologne': '/perfumeticker/Perfume (2).png',
      'eau de toilette': '/perfumeticker/Perfume (2).png',
      'eau de parfum': '/perfumeticker/Perfume (2).png',
    }
  };

  // Get category mappings
  const categoryMappings = brandMappings[category] || {};
  
  // Try exact match first
  if (categoryMappings[normalizedBrandName]) {
    return categoryMappings[normalizedBrandName];
  }
  
  // Try partial matches
  for (const [mappedBrand, imagePath] of Object.entries(categoryMappings)) {
    if (normalizedBrandName.includes(mappedBrand) || mappedBrand.includes(normalizedBrandName)) {
      return imagePath;
    }
  }
  
  // If no match found, return a random image from the category folder
  const fallbackImages: { [category: string]: string[] } = {
    sneaker: [
      '/sneakerticker/Nike AF1.jpg',
      '/sneakerticker/AIr Jordan.jpg',
      '/sneakerticker/Adidas Samba OG.jpg',
      '/sneakerticker/Yeezy.jpg',
      '/sneakerticker/Dunks.jpg',
      '/sneakerticker/AF1.jpg',
    ],
    apparel: [
      '/apparelticker/Carhartt WIP.png',
      '/apparelticker/ASSC.png',
      '/apparelticker/BAPE.png',
      '/apparelticker/Essentials.png',
      '/apparelticker/aime leon dore.png',
    ],
    accessories: [
      '/accessoriesticker/Acne Studios - Vally Fringed Checked Knitted Scarf.jpg',
      '/accessoriesticker/Stanley Tumbler.jpg',
      '/accessoriesticker/NOFOMO.png',
      '/accessoriesticker/Belt.jpg',
      '/accessoriesticker/Sunglasses.jpg',
    ],
    watch: [
      '/watchticker/Carl F Bucherer.png',
      '/watchticker/Vacheron Constantin.png',
      '/watchticker/Glashütte.jpg',
      '/watchticker/Arnold & Son Constant Force Tourbillon.jpg',
      '/watchticker/Bell & Ross.jpg',
    ],
    perfume: [
      '/perfumeticker/Kilian Paris.png',
      '/perfumeticker/Salvatore Ferragamo.png',
      '/perfumeticker/Dunhill.jpg',
      '/perfumeticker/Perfume (2).png',
      '/perfumeticker/perfume.png',
      '/perfumeticker/perfumes.jpg',
    ]
  };
  
  const categoryFallbacks = fallbackImages[category] || ['/image1.jpeg'];
  const randomIndex = Math.floor(Math.random() * categoryFallbacks.length);
  return categoryFallbacks[randomIndex];
}; 