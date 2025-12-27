import { toast } from "react-hot-toast";

export const useCheckoutSteps = ({
  selectedAddress,
  selectedShipping,
  paymentMethod,
  paymentSettings,
  handlePlaceOrder,
}) => {
  const handleNext = (activeStep, setActiveStep, setPaymentMethod) => {
    if (activeStep === 0 && !selectedAddress)
      return toast.error("لطفاً آدرس انتخاب کنید");

    if (activeStep === 1 && !selectedShipping)
      return toast.error("لطفاً روش ارسال انتخاب کنید");

    if (activeStep === 2 && !paymentMethod)
      return toast.error("روش پرداخت را انتخاب کنید");

    if (activeStep === 1) {
      const methods = paymentSettings
        ?.flatMap((p) => [
          p.is_online_active && "online",
          p.is_manual_active && "receipt",
        ])
        .filter(Boolean);

      const unique = [...new Set(methods)];

      if (unique.length === 1) {
        setPaymentMethod(unique[0]);
        return setActiveStep(3);
      }

      if (unique.length === 0) return toast.error("هیچ روش پرداختی فعال نیست");
    }

    activeStep < 3 ? setActiveStep((s) => s + 1) : handlePlaceOrder();
  };

  const handleBack = (activeStep, setActiveStep) => {
    setActiveStep((s) => Math.max(0, s - 1));
  };

  return { handleNext, handleBack };
};
