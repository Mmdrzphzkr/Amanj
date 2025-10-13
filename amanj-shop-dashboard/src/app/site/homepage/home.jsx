"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchProducts } from "../../../redux/slices/productslice";
import Header from "../header/header";
import MainSlider from "../../modules/main-slider/main-slider";

const HomePage = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <main className="container">
      <Header />
      <MainSlider />
      <section className="flex gap-8 flex-wrap justify-center">
        <div className="flex-1 min-w-[300px] bg-[#f9f9f9] p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Featured Products</h2>
          <p>Discover our best-selling items handpicked just for you.</p>
        </div>
        <div className="flex-1 min-w-[300px] bg-[#f9f9f9] p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Latest Offers</h2>
          <p>Check out the latest deals and discounts available now.</p>
        </div>
      </section>
      <footer className="text-center mt-12 text-gray-600">
        &copy; {new Date().getFullYear()} Amanj Shop. All rights reserved.
      </footer>
    </main>
  );
};

export default HomePage;
