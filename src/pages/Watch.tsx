
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, MessageSquare, Share2, Flag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VideoPlayer from "@/components/ui/video-player";
import { Video, Comment } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import VideoGrid from "@/components/video/VideoGrid";
import videoService from "@/services/video.service";
import authService from "@/services/auth.service";

const formatViews = (views: number): string => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K views`;
  }
  return `${views} views`;
};

const Watch: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const fetchVideoData = async () => {
      setIsLoading(true);
      try {
        if (videoId) {
          // Fetch video data
          const videoData = await videoService.getVideoById(videoId);
          if (videoData) {
            setVideo(videoData);
            
            // Fetch comments
            const commentData = await videoService.getComments(videoId);
            setComments(commentData);
            
            // Fetch related videos
            const allVideos = await videoService.getVideos();
            const filtered = allVideos.filter(v => v.id !== videoId).slice(0, 5);
            setRelatedVideos(filtered);
          }
        }
      } catch (error) {
        console.error("Error fetching video data:", error);
        toast({
          title: "Error",
          description: "Failed to load video. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId, toast]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      return;
    }
    
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to comment on videos",
      });
      return;
    }
    
    setIsCommentLoading(true);
    try {
      const newComment = await videoService.addComment(videoId!, commentText);
      setComments(prevComments => [newComment, ...prevComments]);
      setCommentText("");
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCommentLoading(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like videos",
      });
      return;
    }
    
    try {
      await videoService.likeVideo(videoId!);
      setIsLiked(!isLiked);
      
      // Update video like count
      if (video) {
        setVideo({
          ...video,
          likes: isLiked ? video.likes - 1 : video.likes + 1,
        });
      }
    } catch (error) {
      console.error("Error liking video:", error);
      toast({
        title: "Error",
        description: "Failed to like the video. Please try again.",
        variant: "destructive",
      });
    }
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

  if (!video) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 mt-16">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Video Not Found</h1>
            <p className="text-muted-foreground">
              The video you're looking for doesn't exist or has been removed.
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <VideoPlayer
              src={video.videoUrl}
              poster={video.thumbnail}
              className="w-full rounded-lg aspect-video"
            />
            
            {/* Video Info */}
            <div className="space-y-3">
              <h1 className="text-xl sm:text-2xl font-bold">{video.title}</h1>
              
              <div className="flex flex-wrap items-center text-sm text-muted-foreground">
                <span>{formatViews(video.views)}</span>
                <span className="mx-1">•</span>
                <span>
                  {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-2">
                  <Link to={`/profile/${video.userId}`}>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={video.user?.profilePicture} alt={video.user?.username} />
                      <AvatarFallback>
                        {video.user?.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  
                  <div>
                    <Link
                      to={`/profile/${video.userId}`}
                      className="font-medium hover:underline"
                    >
                      {video.user?.username}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      {video.user?.subscribers?.toLocaleString()} subscribers
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    size="sm"
                    onClick={handleLike}
                    className="gap-1"
                  >
                    <ThumbsUp size={16} />
                    <span>{video.likes}</span>
                  </Button>
                  
                  <Button variant="outline" size="sm" className="gap-1">
                    <Share2 size={16} />
                    <span>Share</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="#comments">
                      <MessageSquare size={16} className="mr-1" />
                      <span>{comments.length}</span>
                    </Link>
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="whitespace-pre-line">{video.description}</p>
              </div>
            </div>
            
            {/* Comments */}
            <div id="comments" className="space-y-4">
              <h2 className="text-lg font-semibold">{comments.length} Comments</h2>
              
              {/* Add Comment */}
              <form onSubmit={handleCommentSubmit} className="flex gap-4">
                {currentUser ? (
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={currentUser.profilePicture} alt={currentUser.username} />
                    <AvatarFallback>
                      {currentUser.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                )}
                
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder={currentUser ? "Add a comment..." : "Please sign in to comment"}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={!currentUser || isCommentLoading}
                    className="resize-none min-h-[80px] h-20"
                  />
                  
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCommentText("")}
                      disabled={!commentText || isCommentLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!commentText || !currentUser || isCommentLoading}
                    >
                      {isCommentLoading ? "Posting..." : "Comment"}
                    </Button>
                  </div>
                </div>
              </form>
              
              {/* Comment List */}
              <div className="space-y-4 mt-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={comment.user?.profilePicture} alt={comment.user?.username} />
                        <AvatarFallback>
                          {comment.user?.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/profile/${comment.userId}`}
                            className="font-medium text-sm hover:underline"
                          >
                            {comment.user?.username}
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        
                        <p className="mt-1 text-sm whitespace-pre-line">{comment.content}</p>
                        
                        <div className="flex items-center gap-4 mt-2">
                          <Button variant="ghost" size="sm" className="h-auto p-0">
                            <ThumbsUp size={14} className="mr-1" />
                            <span className="text-xs">Like</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-auto p-0">
                            <Flag size={14} className="mr-1" />
                            <span className="text-xs">Report</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Related Videos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Related Videos</h3>
            <div className="space-y-4">
              {relatedVideos.map((relatedVideo) => (
                <Link
                  key={relatedVideo.id}
                  to={`/watch/${relatedVideo.id}`}
                  className="flex gap-2 hover-scale"
                >
                  <div className="relative aspect-video w-40 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                    <img
                      src={relatedVideo.thumbnail}
                      alt={relatedVideo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 text-xs bg-black/70 text-white px-1 rounded">
                      {Math.floor(relatedVideo.duration / 60)}:
                      {String(relatedVideo.duration % 60).padStart(2, "0")}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-2">{relatedVideo.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {relatedVideo.user?.username}
                    </p>
                    <div className="flex text-xs text-muted-foreground mt-1">
                      <span>{formatViews(relatedVideo.views)}</span>
                      <span className="mx-1">•</span>
                      <span>
                        {formatDistanceToNow(new Date(relatedVideo.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Watch;
