import React from "react";

// کامپوننت یکتا برای نمایش هر سوال
const AccordionItem = ({ faq, isOpen, onToggle }) => {
  return (
    <div className="bg-[#EDE9DE] rounded-3xl mb-4 overflow-hidden">
      {/* هدر سوال */}
      <button
        className="w-full p-6 flex justify-between items-center text-right font-medium transition-colors duration-300"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="text-lg leading-10">{faq.question}</span>

        <svg
          className={`w-[44px] h-[44px] text-[#3F3F3F] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="44" height="44" rx="22" fill="#F7F7F7" />
          <path
            d="M17 19.5L22 24.5L27 19.5"
            stroke="#3F3F3F"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      {/* محتوای پاسخ (آکاردئون باز) */}
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        {/* ارتفاع خودکار توسط grid-rows-[1fr] */}
        <div className="overflow-hidden">
          <p className="p-6 pt-0 text-base leading-7">
            {faq.answer[0].children[0].text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
