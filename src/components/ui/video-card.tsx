
import React from "react";
import { Link } from "react-router-dom";
import { Video } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface VideoCardProps {
  video: Video;
  className?: string;
}

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const formatViews = (views: number): string => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
};

const VideoCard: React.FC<VideoCardProps> = ({ video, className = "" }) => {
  return (
    <div className={`group hover-scale ${className}`}>
      <Link to={`/watch/${video.id}`} className="block">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 text-xs font-medium bg-black/70 text-white rounded">
            {formatDuration(video.duration)}
          </div>
        </div>
      </Link>
      
      <div className="flex mt-3 space-x-3">
        <Link 
          to={`/profile/${video.userId}`} 
          className="flex-shrink-0"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={video.user?.profilePicture} alt={video.user?.username} />
            <AvatarFallback>{video.user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        
        <div className="flex-1 min-w-0">
          <Link to={`/watch/${video.id}`} className="block">
            <h3 className="font-medium text-base line-clamp-2 text-balance">
              {video.title}
            </h3>
          </Link>
          
          <Link 
            to={`/profile/${video.userId}`} 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-1 block"
          >
            {video.user?.username}
          </Link>
          
          <div className="text-xs text-muted-foreground mt-1 flex items-center">
            <span>{formatViews(video.views)} views</span>
            <span className="mx-1">•</span>
            <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
