import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { calculateShippingCost } from "../../../helpers/calculateShippingCost";

export const useCheckoutData = (isAuthenticated) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [paymentSettings, setPaymentSettings] = useState([]);
  const [calculatedShippingCost, setCalculatedShippingCost] = useState(0);

  const fetchJSON = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error();
    return data;
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchJSON("/api/user/addresses")
      .then((data) => {
        setAddresses(data);
        setSelectedAddress(data[0] ?? null);
      })
      .catch(() => setAddresses([]));

    fetchJSON(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/shippings`)
      .then((res) => {
        setShippingMethods(res.data);
        setSelectedShipping(res.data[0]);
      })
      .catch(() => toast.error("خطا در دریافت روش‌های ارسال"));

    fetchJSON(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/payment-settings`)
      .then((res) => setPaymentSettings(res.data))
      .catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    setCalculatedShippingCost(
      calculateShippingCost(selectedAddress, selectedShipping)
    );
  }, [selectedAddress, selectedShipping]);

  return {
    addresses,
    selectedAddress,
    setSelectedAddress,
    shippingMethods,
    selectedShipping,
    setSelectedShipping,
    paymentSettings,
    calculatedShippingCost,
  };
};
