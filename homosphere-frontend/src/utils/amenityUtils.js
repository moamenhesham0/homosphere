export const groupAmenitiesByType = (amenities) => {
  const grouped = {};
  amenities.forEach((amenity) => {
    if (!grouped[amenity.type]) {
      grouped[amenity.type] = [];
    }
    grouped[amenity.type].push(amenity);
  });
  return grouped;
};