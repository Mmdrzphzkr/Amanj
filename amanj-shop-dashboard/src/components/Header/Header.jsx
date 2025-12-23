// export default Header;
"use client";
import { fetchHeaders } from "@/redux/slices/headerSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/context/AuthContext";
import { fetchCategory } from "@/redux/slices/categorySlice";
import Link from "next/link";

const Header = () => {
  const dispatch = useDispatch();
  const headers = useSelector((state) => state.headers.items);
  const totalCount = useSelector((state) => state.cart?.totalCount || 0);
  const categories = useSelector((state) => state.categories.items);
  const status = useSelector((state) => state.categories.status);
  const { user, isAuthenticated } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchHeaders());
  }, [dispatch]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategory()); // اطمینان از بارگذاری داده‌ها
    }
  }, [status, dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = async () => {
    if (!query) return;
    const res = await fetch(`/api/search?query=${query}`);
    const data = await res.json();
    setResults(data);
  };

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  return (
    <>
      {/* --- سایدبار موبایل از سمت راست --- */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ${
          isMobileMenuOpen
            ? "bg-black/50 visible opacity-100"
            : "opacity-0 invisible"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`bg-white w-3/4 h-full p-5 overflow-y-auto transform transition-transform duration-500 fixed right-0 top-0 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">منو</h2>
            <button onClick={() => setIsMobileMenuOpen(false)}>✕</button>
          </div>

          {/* جستجو همیشه باز در بالای منو */}
          <div className="mt-6">
            <div className="flex items-center border rounded-full overflow-hidden bg-[#EDE9DE]">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="جستجو..."
                className="flex-1 px-4 py-2 outline-none bg-transparent"
              />
              <button
                onClick={handleSearch}
                className="px-3 text-gray-600 hover:text-black"
              >
                <svg
                  width="48"
                  height="49"
                  viewBox="0 0 48 49"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    y="0.817968"
                    width="48"
                    height="48"
                    rx="24"
                    fill="#EDE9DE"
                  />
                  <path
                    d="M33 33.818L27.6039 28.4219M27.6039 28.4219C28.9395 27.0858 29.7655 25.2402 29.7655 23.2016C29.7655 21.9963 29.4767 20.8584 28.9646 19.8534M27.6039 28.4219C26.2679 29.7585 24.4218 30.5853 22.3828 30.5853C18.3054 30.5853 15 27.2795 15 23.2016C15 19.1238 18.3054 15.818 22.3828 15.818C23.8008 15.818 25.1255 16.2178 26.2502 16.9109"
                    stroke="#3F3F3F"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-2 max-h-60 overflow-y-auto">
              {results.map((r) => (
                <div key={r.id} className="p-2 border-b text-sm">
                  {r.title}
                </div>
              ))}
            </div>
          </div>

          {/* آیتم‌های منو */}
          <nav className="mt-8 flex flex-col gap-4">
            <div className="text-sm text-gray-400 font-bold border-b pb-2">
              دسته‌بندی محصولات
            </div>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-gray-700 hover:text-black pr-4 border-r-2 border-transparent hover:border-[#C5A35C]"
              >
                {cat.name}
              </Link>
            ))}

            <div className="text-sm text-gray-400 font-bold border-b pb-2 mt-4">
              صفحات
            </div>
            {headers?.map((h) => (
              <Link
                key={h.id}
                href={h.url}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-gray-700 hover:text-black"
              >
                {h.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* --- هدر دسکتاپ و موبایل --- */}
      <header
        className={`flex justify-between items-center px-[15px] py-[10px] md:py-[16px] md:px-[58px] fixed top-0 left-0 right-0 z-40 transition-all duration-500 
        ${
          isScrolled
            ? "backdrop-blur-md bg-[#F9F8F580] shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="flex justify-between md:justify-start items-center gap-6 w-full">
          {/* دکمه منوی موبایل */}
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden bg-[#EDE9DE] rounded-full p-2 flex items-center justify-center border border-gray-700"
            >
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
              >
                <path
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6H20M4 12H20M4 18H20"
                />
              </svg>
            </button>
          )}

          {/* لوگو */}
          <div className="text-3xl font-bold logo__container">
            <Link href={"/"}>
              <svg
                width="102"
                height="36"
                viewBox="0 0 102 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.4415 28.2064L13.4696 24.1676H7.33591L6.5152 28.2064H0.165527L6.75278 4.64347L6.23444 2.89407H15.1542L22.3678 28.2064H14.4415ZM10.122 10.3236L8.22141 19.7617H12.4113L10.122 10.3236Z"
                  fill="black"
                />
                <path
                  d="M30.4333 28.2064H23.4573V14.2328L22.1614 13.4337V11.1227L26.8049 9.84848H30.4765V12.6346C30.5485 12.5338 30.6493 12.4042 30.7789 12.2458C30.9228 12.073 31.182 11.8067 31.5564 11.4467C31.9307 11.0867 32.3123 10.77 32.701 10.4964C33.1042 10.2228 33.5865 9.97806 34.1481 9.76209C34.724 9.53171 35.2927 9.41653 35.8543 9.41653C37.2941 9.41653 38.3956 9.6901 39.1587 10.2372C39.9218 10.7844 40.4618 11.6771 40.7785 12.9153C41.2681 12.0658 42.0168 11.2739 43.0247 10.5396C44.0469 9.79088 45.17 9.41653 46.3939 9.41653C47.7473 9.41653 48.7984 9.6541 49.5471 10.1292C50.3102 10.59 50.8646 11.3819 51.2101 12.505C51.5557 13.628 51.7285 15.2119 51.7285 17.2564V28.2064H44.7093V16.6301C44.7093 15.9966 44.5581 15.4998 44.2557 15.1399C43.9534 14.7799 43.4926 14.5999 42.8735 14.5999C42.4559 14.5999 41.8872 14.9455 41.1673 15.6366C41.2105 16.3277 41.2321 17.0765 41.2321 17.8828V28.2064H34.1049V16.6301C34.1481 15.2767 33.5721 14.5999 32.3771 14.5999C32.2907 14.5999 32.2043 14.6071 32.1179 14.6215C32.0459 14.6359 31.9739 14.6503 31.9019 14.6647C31.8443 14.6791 31.7723 14.7079 31.686 14.7511C31.614 14.7799 31.5492 14.8087 31.4916 14.8375C31.434 14.8519 31.3692 14.8879 31.2972 14.9455C31.2252 14.9887 31.1676 15.0247 31.1244 15.0535C31.0812 15.0823 31.0164 15.1327 30.93 15.2047C30.858 15.2623 30.8005 15.3055 30.7573 15.3343C30.7285 15.363 30.6709 15.4134 30.5845 15.4854C30.5125 15.543 30.4621 15.5862 30.4333 15.615V28.2064Z"
                  fill="black"
                />
                <path
                  d="M79.534 28.2064H72.5579V14.2328L71.2621 13.4337V11.1227L75.9056 9.84848H79.5771V12.6346L79.8363 12.3106C80.0091 12.0802 80.2611 11.8067 80.5922 11.4899C80.9378 11.1731 81.3194 10.8636 81.7369 10.5612C82.1545 10.2444 82.6512 9.97806 83.2271 9.76209C83.8175 9.53171 84.3934 9.41653 84.9549 9.41653C86.9275 9.41653 88.317 9.95647 89.1233 11.0363C89.944 12.1162 90.3543 13.9232 90.3543 16.4573C90.3543 16.5437 90.3543 16.6733 90.3543 16.8461C90.3399 17.0189 90.3327 17.1556 90.3327 17.2564V28.2064H83.2055V16.6301C83.2487 15.2767 82.6728 14.5999 81.4777 14.5999C81.3913 14.5999 81.305 14.6071 81.2186 14.6215C81.1466 14.6359 81.0746 14.6503 81.0026 14.6647C80.945 14.6791 80.873 14.7079 80.7866 14.7511C80.7146 14.7799 80.6498 14.8087 80.5922 14.8375C80.5346 14.8519 80.4698 14.8879 80.3979 14.9455C80.3259 14.9887 80.2683 15.0247 80.2251 15.0535C80.1819 15.0823 80.1171 15.1327 80.0307 15.2047C79.9587 15.2623 79.9011 15.3055 79.8579 15.3343C79.8291 15.363 79.7715 15.4134 79.6851 15.4854C79.6131 15.543 79.5628 15.5862 79.534 15.615V28.2064Z"
                  fill="black"
                />
                <path
                  d="M94.7649 35.6359C92.7636 35.6359 91.1438 34.8728 89.9055 33.3466L91.007 31.0141C91.6405 31.4172 92.274 31.6188 92.9076 31.6188C93.0515 31.6188 93.1739 31.59 93.2747 31.5324C93.3899 31.4892 93.5123 31.374 93.6419 31.1868C93.7715 31.0141 93.8722 30.7693 93.9442 30.4525C94.0306 30.1502 94.1026 29.7182 94.1602 29.1567C94.2178 28.6095 94.2466 27.9544 94.2466 27.1913V14.168L92.67 13.3041V10.9931L97.6374 9.84848H101.028V25.6795C101.028 28.8471 100.51 31.2948 99.4732 33.0226C98.4509 34.7648 96.8815 35.6359 94.7649 35.6359ZM97.4862 7.8615L93.9442 4.29791V3.542L97.4862 0H98.3069L102 3.542V4.29791L98.3069 7.8615H97.4862Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M63.5363 27.1588L64.1137 26.6639L64.4048 28.5562H70.3225L69.7177 26.8716V18.0814C69.7177 16.4975 69.5954 15.1945 69.3506 14.1722C69.1058 13.1355 68.6883 12.286 68.0979 11.6237C67.522 10.947 66.7661 10.4718 65.8302 10.1983C64.8943 9.91029 63.7064 9.76631 62.2666 9.76631C60.6396 9.76631 59.0414 10.0111 57.4719 10.5006C55.9025 10.9758 54.6283 11.5301 53.6492 12.1636L55.0314 15.1009C55.5786 14.8129 56.3345 14.5682 57.2992 14.3666C58.2639 14.1506 59.1925 14.0426 60.0852 14.0426C61.1219 14.0426 61.8706 14.2226 62.3314 14.5826C62.8065 14.9425 63.0441 15.5616 63.0441 16.4399V16.8287C62.5546 16.8287 62.0434 16.8503 61.5107 16.8935C60.9779 16.9367 60.3732 17.0231 59.6965 17.1527C59.0198 17.2822 58.3718 17.4478 57.7527 17.6494C57.148 17.8366 56.5432 18.103 55.9385 18.4485C55.3338 18.7797 54.8154 19.1612 54.3835 19.5932C53.9515 20.0251 53.5988 20.5579 53.3252 21.1914C53.0516 21.8105 52.9149 22.4945 52.9149 23.2432C52.9149 27.0875 54.8586 29.0097 58.7462 29.0097C59.3221 29.0097 60.2643 28.8361 60.2643 28.8361C60.2643 28.8361 61.3884 28.5303 61.7628 28.2999C62.1515 28.0695 62.5472 27.9116 62.8351 27.6812C63.1375 27.4509 63.3923 27.3316 63.5363 27.1588ZM59.6651 22.8626C59.6651 22.8626 58.509 26.1422 56.3968 25.913C55.5188 25.8178 55.1159 25.3506 55.0896 24.0956C55.0896 23.0877 56.1489 21.2434 57.4719 20.2177C58.9043 19.1072 59.921 18.9141 61.6531 18.8364C62.4432 18.801 63.3923 19.1072 63.4899 19.1072C63.4899 19.1072 62.1684 19.4946 61.5107 20.04C61.0766 20.4 60.4308 21.3725 60.4308 21.3725L59.6651 22.8626ZM59.2161 26.5314C58.1518 26.6691 56.4719 26.3884 56.4719 26.3884C56.4719 26.3884 57.6267 26.3884 58.6564 25.5041C59.2196 25.0203 59.8348 24.0121 59.8348 24.0121C59.8348 24.0121 60.4096 22.8087 60.5659 22.4818C60.976 21.6245 61.5107 20.9134 61.5107 20.9134C61.5107 20.9134 62.046 20.3013 62.4852 20.04C62.8479 19.8243 63.4178 19.6593 63.4899 19.6425C63.8967 19.5477 64.2267 19.56 64.6155 19.7822C65.1272 20.0746 65.3055 20.5171 65.3055 21.1065C65.3055 21.9356 65.029 22.4331 64.6155 23.1568C64.1619 23.9504 63.7841 24.2649 63.0861 24.9098C61.8618 26.0412 60.8289 26.3226 59.2161 26.5314Z"
                  fill="black"
                />
              </svg>
            </Link>
          </div>

          {/* منوی دسکتاپ */}
          <nav className="hidden md:flex justify-start items-center gap-6">
            {/* بخش داینامیک دسته‌بندی‌ها با حالت Dropdown */}
            <div className="relative group">
              <button className="text-[#696969] text-[18px] font-[600] flex items-center gap-1 py-4 cursor-pointer">
                دسته‌بندی‌ها
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L5 5L9 1"
                    stroke="#696969"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* زیرمنوی بازشونده */}
              <div className="absolute top-full right-0 bg-white shadow-lg rounded-xl p-4 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="block py-2 px-4 text-[#696969] hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* سایر آیتم‌های هدر که از دیتابیس می‌آیند (مقالات و غیره) */}
            {headers?.map((header) => (
              <div key={header.id}>
                <Link
                  className="text-[#696969] text-[18px] font-[600] hover:text-black transition-colors"
                  href={`${header.url}`}
                >
                  {header.name}
                </Link>
              </div>
            ))}
          </nav>
        </div>

        {/* سمت راست هدر (دسکتاپ) */}
        <div className="hidden md:flex justify-end items-center gap-4 relative">
          {/* --- آیکون سبد خرید (جدید) --- */}
          <Link
            href="/cart"
            className="relative p-2 bg-[#EDE9DE] rounded-full hover:bg-[#DED9CC] transition-all"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.29977 5H21L19 12H7.37671M20 16H8L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z"
                stroke="#3F3F3F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#EDE9DE]">
                {totalCount}
              </span>
            )}
          </Link>
          {/* جستجو با افکت باز شدن نرم */}
          <div
            className={`flex items-center border border-gray-300 rounded-full overflow-hidden transition-all duration-500 bg-[#EDE9DE] ${
              isSearchOpen ? "w-64 px-2" : "w-full justify-center"
            }`}
          >
            {isSearchOpen ? (
              <>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="جستجو..."
                  className="flex-1 bg-transparent px-2 py-3.5 outline-none text-sm"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setQuery("");
                    setIsSearchOpen(false);
                  }}
                  className="text-gray-600 hover:text-black ml-1"
                >
                  ✕
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center justify-center"
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 48 49"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    y="0.817968"
                    width="48"
                    height="48"
                    rx="24"
                    fill="#EDE9DE"
                  />
                  <path
                    d="M33 33.818L27.6039 28.4219M27.6039 28.4219C28.9395 27.0858 29.7655 25.2402 29.7655 23.2016C29.7655 21.9963 29.4767 20.8584 28.9646 19.8534M27.6039 28.4219C26.2679 29.7585 24.4218 30.5853 22.3828 30.5853C18.3054 30.5853 15 27.2795 15 23.2016C15 19.1238 18.3054 15.818 22.3828 15.818C23.8008 15.818 25.1255 16.2178 26.2502 16.9109"
                    stroke="#3F3F3F"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* سایر دکمه‌ها */}
          {/* <button className="">👤 SVG آیکون کاربر</button> */}

          <Link
            href={isAuthenticated ? "/profile" : "/login"}
            className="p-2 bg-[#EDE9DE] rounded-full hover:bg-[#DED9CC] transition-all flex items-center gap-2"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                stroke="#3F3F3F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21"
                stroke="#3F3F3F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isAuthenticated && (
              <span className="text-xs font-medium text-[#3F3F3F] ml-1 hidden lg:inline">
                {user?.username}
              </span>
            )}
          </Link>
        </div>
      </header>
    </>
  );
};

export default Header;
