"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/me"); // 👈 adjust endpoint to your API
      setUser(response.data.user);
    } catch (error) {
      console.log("Failed to load user", error);
      toast.error("Please login to view your profile.");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const onLogout = async () => {
    try {
      await axios.post("/api/logout");
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch (error) {
      console.log("logout failed", error);
      toast.error("Logout failed. Try again.");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-700 text-center"
      >
        {loading ? (
          <h1 className="text-xl text-gray-300">Loading profile...</h1>
        ) : user ? (
          <>
            <h1 className="text-3xl font-bold text-white mb-6">Your Profile</h1>
            <div className="text-left space-y-3 mb-6">
              <p className="text-gray-300">
                <span className="font-semibold text-white">Username:</span>{" "}
                {user.username}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold text-white">Email:</span>{" "}
                {user.email}
              </p>
            </div>

            <button
              onClick={onLogout}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </>
        ) : (
          <h1 className="text-xl text-red-400">No user data available</h1>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;
