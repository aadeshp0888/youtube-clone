
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { VideoUploadData } from "@/types";
import videoService from "@/services/video.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Image, FileVideo, VideoIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

const VideoUpload: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [thumbnailType, setThumbnailType] = useState<"auto" | "manual">("auto");
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["video/mp4", "video/webm", "video/ogg"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid video file (MP4, WebM, Ogg)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (limit to 100MB for example)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a video smaller than 100MB",
        variant: "destructive",
      });
      return;
    }

    setVideoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setVideoPreview(objectUrl);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid image file (JPEG, PNG, WebP)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (limit to 5MB for example)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    setThumbnailType("manual");
  };

  const generateThumbnail = () => {
    if (!videoRef.current || !videoPreview) return;
    
    const video = videoRef.current;
    video.currentTime = currentTime;
    
    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          if (thumbnailPreview) {
            URL.revokeObjectURL(thumbnailPreview);
          }
          
          const file = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
          setThumbnailFile(file);
          setThumbnailPreview(URL.createObjectURL(file));
          setThumbnailType("auto");
          
          toast({
            title: "Thumbnail generated",
            description: "Thumbnail has been created from the video frame",
          });
        }
      }, "image/jpeg", 0.95);
      
      video.onseeked = null;
    };
  };

  const handleTimeUpdate = (values: number[]) => {
    if (videoRef.current && values.length > 0) {
      const video = videoRef.current;
      const duration = video.duration || 0;
      const newTime = (values[0] / 100) * duration;
      setCurrentTime(newTime);
      video.currentTime = newTime;
    }
  };

  const clearVideo = () => {
    setVideoFile(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
    setThumbnailType("manual");
    if (thumbnailType === "auto") {
      clearThumbnail();
    }
  };

  const clearThumbnail = () => {
    setThumbnailFile(null);
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
      setThumbnailPreview(null);
    }
  };

  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 100) progress = 100;
      setUploadProgress(Math.floor(progress));
      
      if (progress === 100) {
        clearInterval(interval);
      }
    }, 500);
    
    return () => clearInterval(interval);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !videoFile || !thumbnailFile) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields and upload both video and thumbnail",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    const progressCleanup = simulateProgress();
    
    try {
      const uploadData: VideoUploadData = {
        title,
        description,
        videoFile,
        thumbnailFile,
      };
      
      const uploadedVideo = await videoService.uploadVideo(uploadData);
      
      // Clear form and progress
      setTitle("");
      setDescription("");
      clearVideo();
      clearThumbnail();
      setUploadProgress(0);
      
      toast({
        title: "Video uploaded successfully",
        description: "Your video has been uploaded and will be processed shortly",
      });
      
      // Redirect to the video page
      navigate(`/watch/${uploadedVideo.id}`);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      progressCleanup();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-3">
        <label className="block text-sm font-medium">
          Video Title <span className="text-destructive">*</span>
        </label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a descriptive title for your video"
          maxLength={100}
          required
          disabled={isUploading}
        />
        <div className="text-xs text-muted-foreground text-right">
          {title.length}/100
        </div>
      </div>
      
      <div className="space-y-3">
        <label className="block text-sm font-medium">
          Description <span className="text-destructive">*</span>
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell viewers about your video"
          rows={4}
          required
          disabled={isUploading}
        />
      </div>
      
      <div className="border rounded-lg p-4 bg-muted/20">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <FileVideo className="h-5 w-5" />
          Video Upload
        </h3>
        
        {!videoFile ? (
          <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:bg-muted/5 transition-colors">
            <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop your video or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              MP4, WebM or Ogg. Max 100MB.
            </p>
            <Input
              type="file"
              accept="video/mp4,video/webm,video/ogg"
              onChange={handleVideoChange}
              className="hidden"
              id="video-upload"
              disabled={isUploading}
            />
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => document.getElementById("video-upload")?.click()}
              disabled={isUploading}
            >
              Select Video
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border">
              {videoPreview && (
                <video 
                  ref={videoRef}
                  src={videoPreview} 
                  className="w-full aspect-video object-contain bg-black" 
                  controls
                />
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white"
                onClick={clearVideo}
                disabled={isUploading}
              >
                <X size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="border rounded-lg p-4 bg-muted/20">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Image className="h-5 w-5" />
          Thumbnail
        </h3>
        
        {videoFile && (
          <div className="mb-4 space-y-3">
            <h4 className="text-sm font-medium">Generate from video</h4>
            
            <div className="px-2">
              <Slider
                defaultValue={[0]}
                max={100}
                step={1}
                onValueChange={handleTimeUpdate}
                disabled={!videoPreview || isUploading}
              />
            </div>
            
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={generateThumbnail}
                disabled={!videoPreview || isUploading}
                className="flex items-center gap-2"
              >
                <VideoIcon className="h-4 w-4" />
                Generate Thumbnail from Current Frame
              </Button>
            </div>
          </div>
        )}
        
        <div className="pt-2">
          <h4 className="text-sm font-medium mb-3">Or upload custom thumbnail</h4>
          
          {!thumbnailFile ? (
            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:bg-muted/5 transition-colors">
              <Image className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Upload a thumbnail image
              </p>
              <p className="text-xs text-muted-foreground">
                JPEG, PNG or WebP. Max 5MB.
              </p>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleThumbnailChange}
                className="hidden"
                id="thumbnail-upload"
                disabled={isUploading}
              />
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => document.getElementById("thumbnail-upload")?.click()}
                disabled={isUploading}
              >
                Select Thumbnail
              </Button>
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden border">
              {thumbnailPreview && (
                <img 
                  src={thumbnailPreview} 
                  alt="Thumbnail preview" 
                  className="w-full aspect-video object-cover" 
                />
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="bg-black/60 hover:bg-black/80 text-white"
                  onClick={clearThumbnail}
                  disabled={isUploading}
                >
                  <X size={16} />
                </Button>
              </div>
              <div className="absolute bottom-2 right-2">
                <span className="bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {thumbnailType === "auto" ? "Auto-generated" : "Custom"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {isUploading && (
        <div className="space-y-2">
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {uploadProgress < 100 ? "Uploading..." : "Processing..."} {uploadProgress}%
          </p>
        </div>
      )}
      
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={isUploading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!title || !description || !videoFile || !thumbnailFile || isUploading}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? "Uploading..." : "Upload Video"}
        </Button>
      </div>
    </form>
  );
};

export default VideoUpload;
