
import { Comment, Video, VideoUploadData } from "@/types";
import authService from "./auth.service";

const API_URL = "https://api.example.com"; // Replace with your actual API URL

// Mock data for demonstration
const MOCK_VIDEOS: Video[] = [
  {
    id: "1",
    title: "Creating a Beautiful UI Design",
    description: "Learn how to create a stunning UI design with minimalist principles",
    thumbnail: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    duration: 186,
    views: 1205,
    likes: 78,
    userId: "1",
    user: {
      id: "1",
      username: "designmaster",
      email: "design@example.com",
      profilePicture: "https://i.pravatar.cc/150?u=designmaster",
      subscribers: 12500,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    title: "Advanced JavaScript Techniques",
    description: "Master the latest JavaScript features and patterns for modern web development",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    duration: 423,
    views: 2518,
    likes: 192,
    userId: "2",
    user: {
      id: "2",
      username: "jsexpert",
      email: "js@example.com",
      profilePicture: "https://i.pravatar.cc/150?u=jsexpert",
      subscribers: 45200,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    title: "Building a Video Platform in React",
    description: "Step-by-step guide to creating your own YouTube-like platform",
    thumbnail: "https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    duration: 652,
    views: 8730,
    likes: 542,
    userId: "3",
    user: {
      id: "3",
      username: "reactninja",
      email: "react@example.com",
      profilePicture: "https://i.pravatar.cc/150?u=reactninja",
      subscribers: 75800,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    title: "Minimalist Photography Tips",
    description: "Create stunning photos with minimalist composition techniques",
    thumbnail: "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    duration: 312,
    views: 6240,
    likes: 328,
    userId: "4",
    user: {
      id: "4",
      username: "photomaster",
      email: "photo@example.com",
      profilePicture: "https://i.pravatar.cc/150?u=photomaster",
      subscribers: 38600,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000), // 22 days ago
    updatedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    title: "Modern UX Design Principles",
    description: "Learn the fundamentals of creating exceptional user experiences",
    thumbnail: "https://images.unsplash.com/photo-1481487196290-c152efe083f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    duration: 548,
    views: 3850,
    likes: 274,
    userId: "5",
    user: {
      id: "5",
      username: "uxguru",
      email: "ux@example.com",
      profilePicture: "https://i.pravatar.cc/150?u=uxguru",
      subscribers: 29300,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "6",
    title: "Crafting Perfect Typography",
    description: "The complete guide to type selection and pairing for digital products",
    thumbnail: "https://images.unsplash.com/photo-1563207153-f403bf289096?ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    duration: 294,
    views: 2760,
    likes: 197,
    userId: "1",
    user: {
      id: "1",
      username: "designmaster",
      email: "design@example.com",
      profilePicture: "https://i.pravatar.cc/150?u=designmaster",
      subscribers: 12500,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
    updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
  },
];

class VideoService {
  async getVideos(): Promise<Video[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_VIDEOS);
      }, 500);
    });
  }

  async getVideoById(id: string): Promise<Video | undefined> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const video = MOCK_VIDEOS.find(v => v.id === id);
        resolve(video);
      }, 300);
    });
  }

  async getVideosByUser(userId: string): Promise<Video[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const videos = MOCK_VIDEOS.filter(v => v.userId === userId);
        resolve(videos);
      }, 300);
    });
  }

  async uploadVideo(data: VideoUploadData): Promise<Video> {
    // Simulate API call
    console.log("Uploading video:", data);

    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error("You must be logged in to upload videos");
    }

    // In a real app, this would upload the video file to a storage service
    // and then create the video record in the database
    
    // Mock successful response
    return {
      id: Math.random().toString(36).substring(2, 9),
      title: data.title,
      description: data.description,
      thumbnail: URL.createObjectURL(data.thumbnailFile),
      videoUrl: URL.createObjectURL(data.videoFile),
      duration: Math.floor(Math.random() * 600) + 60, // Random duration between 1-10 minutes
      views: 0,
      likes: 0,
      userId: user.id,
      user: user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async getComments(videoId: string): Promise<Comment[]> {
    // Mock comments
    return [
      {
        id: "1",
        content: "Great video! Really helpful content.",
        userId: "2",
        videoId,
        user: {
          id: "2",
          username: "jsexpert",
          email: "js@example.com",
          profilePicture: "https://i.pravatar.cc/150?u=jsexpert",
          subscribers: 45200,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "2",
        content: "I learned so much from this, thanks for sharing!",
        userId: "3",
        videoId,
        user: {
          id: "3",
          username: "reactninja",
          email: "react@example.com",
          profilePicture: "https://i.pravatar.cc/150?u=reactninja",
          subscribers: 75800,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];
  }

  async addComment(videoId: string, content: string): Promise<Comment> {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error("You must be logged in to comment");
    }

    // Simulate API call
    console.log("Adding comment to video", videoId, content);
    
    // Mock successful response
    return {
      id: Math.random().toString(36).substring(2, 9),
      content,
      userId: user.id,
      videoId,
      user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async likeVideo(videoId: string): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error("You must be logged in to like videos");
    }

    // Simulate API call
    console.log("Liking video", videoId);
    
    // In a real app, this would update the like count in the database
  }
}

export default new VideoService();
