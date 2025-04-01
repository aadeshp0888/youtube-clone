
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileHeader from "@/components/profile/ProfileHeader";
import VideoGrid from "@/components/video/VideoGrid";
import { User } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import authService from "@/services/auth.service";

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();
  const currentUser = authService.getCurrentUser();
  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch user data from an API
        // For this demo, we'll use mock data
        setTimeout(() => {
          setUser({
            id: userId || "1",
            username: "CreatorName",
            email: "creator@example.com",
            profilePicture: "https://i.pravatar.cc/150?u=creator",
            subscribers: 3756,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          setIsLoading(false);
        }, 500);

        // Check if the current user is subscribed to this channel
        // This would be a real API call in a production app
        setIsSubscribed(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, toast]);

  const handleSubscribe = () => {
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe to this channel",
      });
      return;
    }

    // Toggle subscription status
    setIsSubscribed(!isSubscribed);
    
    // Update subscriber count
    if (user) {
      setUser({
        ...user,
        subscribers: isSubscribed ? (user.subscribers || 0) - 1 : (user.subscribers || 0) + 1,
      });
    }
    
    // Show toast notification
    toast({
      title: isSubscribed ? "Unsubscribed" : "Subscribed",
      description: isSubscribed 
        ? "You have unsubscribed from this channel" 
        : "You are now subscribed to this channel",
    });
    
    // In a real app, you would make an API call to subscribe/unsubscribe
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 mt-16">
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 mt-16">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
            <p className="text-muted-foreground">
              The user profile you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-16 animate-fade-in">
        <div className="mb-8">
          <ProfileHeader
            user={user}
            isOwnProfile={isOwnProfile}
            isSubscribed={isSubscribed}
            onSubscribe={handleSubscribe}
          />
        </div>
        
        <Separator className="my-6" />
        
        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="mb-6 w-full sm:w-auto">
            <TabsTrigger value="videos" className="flex-1 sm:flex-none">Videos</TabsTrigger>
            <TabsTrigger value="playlists" className="flex-1 sm:flex-none">Playlists</TabsTrigger>
            <TabsTrigger value="about" className="flex-1 sm:flex-none">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="animate-fade-in">
            <VideoGrid userId={userId} />
          </TabsContent>
          
          <TabsContent value="playlists" className="animate-fade-in">
            <div className="text-center py-10">
              <p className="text-muted-foreground">No playlists available.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="animate-fade-in">
            <div className="max-w-2xl">
              <h2 className="text-lg font-medium mb-4">About</h2>
              <p className="text-muted-foreground mb-6">
                A passionate content creator sharing insights and tutorials about design, technology, and productivity.
                Join me on this journey of exploration and learning as we dive into various topics and discover new possibilities.
              </p>
              
              <h3 className="text-md font-medium mb-2">Stats</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-muted-foreground">Joined</p>
                  <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total views</p>
                  <p>35,429</p>
                </div>
              </div>
              
              <h3 className="text-md font-medium mb-2">Links</h3>
              <div className="space-y-1">
                <a href="#" className="text-primary hover:underline block">
                  Website
                </a>
                <a href="#" className="text-primary hover:underline block">
                  Twitter
                </a>
                <a href="#" className="text-primary hover:underline block">
                  Instagram
                </a>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
