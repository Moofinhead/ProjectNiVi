"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { MdArrowBackIos } from "react-icons/md";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Checkout() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Bank");

  const router = useRouter();
  const { cartItems, removeFromCart, calculateTotalPrice } = useCart();

  const processPayment = async (e) => {
    e.preventDefault();

    try {
      const total = calculateTotalPrice();
      const token = Cookies.get("token");

      const res = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          payment,
          items: cartItems,
          total: total,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Payment successful");
        
        // Clear the cart
        cartItems.forEach(item => removeFromCart(item.id));

        // Redirect to success page
        const queryString = new URLSearchParams({
          name,
          email,
          phone,
          address,
          payment,
          total,
          orderId: data.orderId,
          paymentId: data.paymentId,
        }).toString();

        router.push(`/paymentsuccess?${queryString}`);
      } else {
        toast.error("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during payment:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-6 justify-start md:px-8">
      <h1 className="text-center font-main text-2xl font-semibold lg:text-3xl">
        Checkout
      </h1>
      <p className="mb-8 text-center font-MyFont lg:mb-14">
        Provide your payment and delivery address information to finalize your order.
      </p>
      <form
        onSubmit={processPayment}
        className="my-4 md:grid md:grid-cols-2 md:gap-x-6 lg:grid-cols-5 lg:gap-x-10 font-MyFont divide-x"
      >
        {/* Billing Details Section */}
        <div className="md:col-span-1 lg:col-span-3">
          <h2 className="text-xl font-bold">Billing Details</h2>
          {/* Name Input */}
          <div className="mb-4">
            <label className="font-MyFont font-medium">
              Full Name
              <input
                placeholder="Enter Your Full Name"
                className="my-1 block w-full md:pr-10 rounded border-2 border-gray-300 bg-primary py-1 px-2 font-normal outline-skin-accent"
                type="text"
                name="fullName"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
          </div>
          {/* Email Input */}
          <div className="mb-4">
            <label className="font-MyFont font-medium">
              Email Address
              <input
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Valid Email"
                className="my-1 block w-full md:pr-10 rounded border-2 border-gray-300 bg-primary py-1 px-2 font-normal outline-skin-accent"
                type="email"
                name="email"
                required
              />
            </label>
          </div>
          {/* Phone Input */}
          <div className="mb-4">
            <label className="font-MyFont font-medium">
              Phone
              <input
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+919021457863 (or) 09932146687"
                className="my-1 block w-full md:pr-10 rounded border-2 border-gray-300 bg-primary py-1 px-2 font-normal outline-skin-accent"
                type="text"
                name="phone"
                required
              />
            </label>
          </div>
          {/* Address Input */}
          <div className="mb-4">
            <label className="font-MyFont font-medium">
              Address
              <textarea
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Sa puso mo"
                rows="4"
                className="my-1 block w-full md:pr-10 rounded border-2 border-gray-300 bg-primary py-1 px-2 font-normal outline-skin-accent"
                name="address"
                required
              ></textarea>
            </label>
          </div>
          {/* Save Info Checkbox */}
          <label className="ml-1">
            <input
              className="mr-2 scale-125 accent-skin-accent outline-skin-accent"
              type="checkbox"
              name="saveInfo"
            />
            Save this information for next time
          </label>
          {/* Order Notes */}
          <div className="my-4">
            <label className="font-MyFont font-medium">
              Order Notes (optional)
              <textarea
                rows="4"
                className="my-1 block w-full md:pr-10 rounded border-2 border-gray-300 bg-primary py-1 px-2 font-normal outline-skin-accent"
                name="orderNotes"
              ></textarea>
            </label>
          </div>
          {/* Return to Cart Link */}
          <div>
            <Link
              className="text-link hidden items-center underline decoration-dashed underline-offset-8 hover:decoration-solid md:inline-flex font-MyFont opacity-60"
              href="/"
            >
              <MdArrowBackIos />
              Return To Cart
            </Link>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="my-4 flex flex-col gap-3 rounded justify-between divide-y bg-bggray p-4 md:col-span-1 md:p-6 lg:col-span-2 lg:my-0 lg:p-8">
          <div className="flex flex-col justify-between ">
            <h2 className="text-center text-lg font-semibold">Order Summary</h2>
            {/* Coupon Code Input */}
            <span className="font-medium mt-10 mb-2">Have a Coupon code?</span>
            <div className="mt-1 flex justify-between">
              <input
                placeholder="Enter Your Coupon code"
                className="block md:pr-10 rounded border-2 border-gray-300 bg-primary py-1 font-normal outline-skin-accent mr-3 flex-1 px-2"
                type="text"
              />
              <button
                type="button"
                className="rounded z-100 bg-gray-800 px-4 py-1 text-lg font-medium tracking-widest text-primary outline-offset-2 hover:bg-opacity-80 active:bg-opacity-100"
              >
                Apply
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-between ">
            {/* Total Amount */}
            <div className="flex items-center py-6 justify-between">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-xl font-semibold">
                {calculateTotalPrice()} &#8369;
              </span>
            </div>
            {/* Payment Options */}
            <div className="flex flex-col font-MyFont gap-3 justify-center ">
              <label htmlFor="Cash" className="flex">
                <input
                  type="radio"
                  name="payment"
                  value="Cash"
                  id="Cash"
                  className="h-5 w-5 mt-2 border-2 border-black cursor-default rounded-full bg-primary shadow-[0_0_0_2px] shadow-bggray focus-within:border-2 focus-within:border-skin-accent"
                  checked={payment === "Cash"}
                  onChange={(e) => setPayment(e.target.value)}
                />
                <h1 className="ml-auto w-11/12 mt-2 text-left font-bold leading-none text-skin-dark">
                  Cash on Delivery
                </h1>
              </label>

              <label htmlFor="Bank" className="flex">
                <input
                  type="radio"
                  name="payment"
                  value="Bank"
                  id="Bank"
                  className="h-5 w-5 mt-2 border-2 border-black cursor-default rounded-full bg-primary shadow-[0_0_0_2px] shadow-bggray focus-within:border-2 focus-within:border-skin-accent"
                  checked={payment === "Bank"}
                  onChange={(e) => setPayment(e.target.value)}
                />
                <h1 className="ml-auto w-11/12 mt-2 text-left font-bold leading-none text-skin-dark">
                  Bank Transfer
                  <p className="flex text-sm font-normal py-1 font-MyFont">
                    Make your payment directly from googlepay, paytm, UPI
                  </p>
                </h1>
              </label>
            </div>

            <button
              type="submit"
              className="bg-textgray text-white w-full flex justify-center py-2 px-2 mt-2 font-MyFont text-lg font-medium md:rounded md:py-1"
            >
              <span>Place order</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
