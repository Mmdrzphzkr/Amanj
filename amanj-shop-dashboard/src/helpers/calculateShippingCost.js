export const calculateShippingCost = (address, shipping) => {
  if (!address || !shipping) return 0;

  const cityCosts = shipping.cityCosts || {};
  return cityCosts[address.city] ?? shipping.baseCost ?? 0;
};