
import React from "react";
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  isSubscribed?: boolean;
  onSubscribe?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isOwnProfile,
  isSubscribed = false,
  onSubscribe,
}) => {
  return (
    <div className="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-y-0 md:space-x-6">
      <Avatar className="h-24 w-24 md:h-28 md:w-28">
        <AvatarImage src={user.profilePicture} alt={user.username} />
        <AvatarFallback className="text-2xl">
          {user.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-2xl font-bold">{user.username}</h1>
        
        <div className="text-sm text-muted-foreground mt-1 space-x-2">
          <span>{user.subscribers?.toLocaleString() || 0} subscribers</span>
        </div>
        
        <p className="mt-4 text-sm line-clamp-3 max-w-2xl">
          A passionate content creator sharing insights and tutorials about design, technology, and productivity.
        </p>
      </div>
      
      <div className="flex-shrink-0">
        {!isOwnProfile && (
          <Button
            variant={isSubscribed ? "outline" : "default"}
            className="transition-all duration-300"
            onClick={onSubscribe}
          >
            {isSubscribed ? (
              <>
                <BellOff size={16} className="mr-2" />
                Subscribed
              </>
            ) : (
              <>
                <Bell size={16} className="mr-2" />
                Subscribe
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
