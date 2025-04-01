
import React, { useState, useEffect } from "react";
import VideoCard from "@/components/ui/video-card";
import { Video } from "@/types";
import videoService from "@/services/video.service";

interface VideoGridProps {
  userId?: string;
  limit?: number;
  className?: string;
}

const VideoGrid: React.FC<VideoGridProps> = ({
  userId,
  limit,
  className = "",
}) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        let fetchedVideos: Video[];
        
        if (userId) {
          fetchedVideos = await videoService.getVideosByUser(userId);
        } else {
          fetchedVideos = await videoService.getVideos();
        }
        
        if (limit) {
          fetchedVideos = fetchedVideos.slice(0, limit);
        }
        
        setVideos(fetchedVideos);
        setError(null);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [userId, limit]);

  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: limit || 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-video rounded-lg skeleton-loading"></div>
            <div className="flex space-x-3">
              <div className="h-9 w-9 rounded-full skeleton-loading"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 rounded skeleton-loading"></div>
                <div className="h-4 w-1/2 rounded skeleton-loading"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No videos found.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};

export default VideoGrid;
