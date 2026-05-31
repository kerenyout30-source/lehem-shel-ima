// Stock images for bakery products from Unsplash
export const productImageMap: Record<string, string> = {
  // Challot (Breads)
  "חלות שבת קלועות":
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=500&fit=crop",
  "חלת דבש":
    "https://images.unsplash.com/photo-1585080199519-35b45e4c5786?w=500&h=500&fit=crop",

  // Breads
  "לחם מחמצת":
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=500&fit=crop",
  "לחם כפרי כוסמין":
    "https://images.unsplash.com/photo-1574986933382-e0827b5a5f6e?w=500&h=500&fit=crop",

  // Cakes
  "עוגת גבינה":
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop",
  "עוגת שוקולד פאדג'":
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop",

  // Pastries & Sweets
  "רוגלך שוקולד (10 יח')":
    "https://images.unsplash.com/photo-1599599810694-f5c0a92c5b6e?w=500&h=500&fit=crop",
  "קרואסון חמאה":
    "https://images.unsplash.com/photo-1565958011504-98d6efed579d?w=500&h=500&fit=crop",
}

export function getProductImage(productName: string): string | null {
  return productImageMap[productName] || null
}
