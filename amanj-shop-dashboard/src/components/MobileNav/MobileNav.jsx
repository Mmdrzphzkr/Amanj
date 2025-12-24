import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { HomeIcon } from "lucide-react";

const MobileNav = () => {
  const totalCount = useSelector((state) => state.cart?.totalCount || 0);
  const { user, isAuthenticated } = useAuth();
  return (
    <>
      <div className="p-1.5 flex justify-evenly align-middle md:hidden fixed bottom-0 left-0 w-full h-auto z-10 backdrop-blur-md bg-[#F9F8F580] shadow-sm">
        <Link
          href={"/"}
          className="bg-[#EDE9DE] rounded-full flex justify-center align-middle p-2.5 h-full"
        >
          <HomeIcon size={20} className="text-[#3f3f3f]" />
        </Link>
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
            <span className="text-xs font-medium text-[#3F3F3F] ml-1">
              {user?.username}
            </span>
          )}
        </Link>
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
      </div>
    </>
  );
};

export default MobileNav;
