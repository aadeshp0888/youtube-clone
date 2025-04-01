
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VideoUpload from "@/components/video/VideoUpload";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import authService from "@/services/auth.service";

const Upload: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    if (!authService.isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-16 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Upload Video</h1>
          <p className="text-muted-foreground mt-2">
            Share your content with the world
          </p>
        </div>
        
        <VideoUpload />
      </main>
      
      <Footer />
    </div>
  );
};

export default Upload;
