
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VideoGrid from "@/components/video/VideoGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-16 animate-fade-in">
        <Tabs defaultValue="all" className="w-full mb-8">
          <div className={`sticky top-16 pt-4 pb-2 z-10 bg-background transition-shadow ${
            isScrolled ? "shadow-sm" : ""
          }`}>
            <TabsList className="w-full justify-start overflow-x-auto py-1">
              <TabsTrigger value="all" className="rounded-full">All</TabsTrigger>
              <TabsTrigger value="design" className="rounded-full">Design</TabsTrigger>
              <TabsTrigger value="technology" className="rounded-full">Technology</TabsTrigger>
              <TabsTrigger value="programming" className="rounded-full">Programming</TabsTrigger>
              <TabsTrigger value="music" className="rounded-full">Music</TabsTrigger>
              <TabsTrigger value="photography" className="rounded-full">Photography</TabsTrigger>
              <TabsTrigger value="gaming" className="rounded-full">Gaming</TabsTrigger>
              <TabsTrigger value="education" className="rounded-full">Education</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-6">
            <VideoGrid />
          </TabsContent>
          
          <TabsContent value="design" className="mt-6">
            <VideoGrid limit={3} />
          </TabsContent>
          
          <TabsContent value="technology" className="mt-6">
            <VideoGrid limit={2} />
          </TabsContent>
          
          <TabsContent value="programming" className="mt-6">
            <VideoGrid limit={4} />
          </TabsContent>
          
          <TabsContent value="music" className="mt-6">
            <VideoGrid limit={2} />
          </TabsContent>
          
          <TabsContent value="photography" className="mt-6">
            <VideoGrid limit={3} />
          </TabsContent>
          
          <TabsContent value="gaming" className="mt-6">
            <VideoGrid limit={2} />
          </TabsContent>
          
          <TabsContent value="education" className="mt-6">
            <VideoGrid limit={4} />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
