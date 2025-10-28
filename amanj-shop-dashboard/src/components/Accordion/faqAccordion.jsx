import React, { useEffect, useState } from "react";
import AccordionItem from "./AccordionItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchFaqAccordion } from "../../redux/slices/faqAccordionSlice";
// ساختار داده‌ها (می‌توانید این را در یک فایل جداگانه قرار دهید)
const faqData = [
  {
    id: 1,
    question: "آیا امکان خرید اقساطی یا پرداخت در چند مرحله وجود دارد؟",
    answer:
      "بله، ما امکان پرداخت اقساطی برای بعضی از دستگاه‌های پرطرفدار داریم. برای اطلاعات بیشتر در مورد شرایط و نحوه ثبت درخواست پرداخت اقساطی، لطفاً با پشتیبانی تماس بگیر یا صفحه «روش‌های پرداخت» را بررسی کن.",
  },
  {
    id: 2,
    question: "چه نوع دستگاه‌های قهوه‌ای در فروشگاه شما موجود است؟",
    answer: "پاسخ مربوط به انواع دستگاه‌های قهوه‌ای در اینجا قرار می‌گیرد.",
  },
  {
    id: 3,
    question: "دستگاه‌ها گارانتی دارند؟",
    answer: "پاسخ مربوط به گارانتی دستگاه‌ها در اینجا قرار می‌گیرد.",
  },
  {
    id: 4,
    question: "ارسال به شهر من هم دارید؟ چقدر طول می‌کشه؟",
    answer: "پاسخ مربوط به مدت زمان ارسال به شهر شما در اینجا قرار می‌گیرد.",
  },
];

const FaqAccordion = () => {
  const dispatch = useDispatch();
  const faqItems = useSelector((state) => state.faqAccordion.items);
  
  useEffect(() => {
    dispatch(fetchFaqAccordion());
  }, [dispatch]);
  // state برای نگهداری ID آیتم باز شده. اگر null باشد، همه بسته هستند.
  const [openItemId, setOpenItemId] = useState(faqData[0].id); // اولین آیتم به صورت پیش‌فرض باز است

  // تابعی برای تغییر وضعیت باز/بسته
  const handleToggle = (id) => {
    // اگر آیتم فعلی باز است، آن را ببند (null)، در غیر این صورت آن را باز کن (id)
    setOpenItemId(openItemId === id ? null : id);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      {faqItems.map((faq) => (
        <AccordionItem
          key={faq.id}
          faq={faq}
          isOpen={faq.id === openItemId} // چک می‌کند که آیا این آیتم باز است؟
          onToggle={() => handleToggle(faq.id)} // تابع تغییر وضعیت
        />
      ))}
    </div>
  );
};

export default FaqAccordion;
