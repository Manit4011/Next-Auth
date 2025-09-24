"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";

const VerifyEmailPage = () => {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    try {
      const response = await axios.post("/api/verifyemail", {token});
      console.log("email verified", response.data);
      setVerified(true);
    } catch (error) {
      console.log("email verification failed", error);
      setError(true);
    }
  };

  useEffect(() => {
    setError(false);
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    setError(false);
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-700 text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-6">Email Verification</h1>

        {!verified && !error && (
          <p className="text-gray-400 mb-4">Verifying your email, please wait...</p>
        )}

        {verified && (
          <div>
            <h2 className="text-xl font-semibold text-green-400 mb-4">
              ✅ Email verified successfully!
            </h2>
            <p className="text-gray-300 mb-6">
              You can now log in to your account.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Go to Login
            </Link>
          </div>
        )}

        {error && (
          <div>
            <h2 className="text-xl font-semibold text-red-400 mb-4">
              ❌ Verification failed
            </h2>
            <p className="text-gray-300">
              The token may be invalid or expired. Please request a new
              verification link.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
