
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Search, Upload, Bell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import authService from "@/services/auth.service";

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/");
    window.location.reload();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b glassmorphism">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-red-500 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-sm"></div>
          </div>
          <span className="font-bold text-xl hidden sm:inline-block">ViewTube</span>
        </Link>

        {/* Search Bar - Hidden on mobile */}
        <form 
          onSubmit={handleSearch} 
          className="hidden md:flex items-center flex-1 max-w-xl mx-6"
        >
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pr-10 focus-visible:ring-offset-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full"
            >
              <Search size={18} />
            </Button>
          </div>
        </form>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {currentUser ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/upload">
                  <Upload size={20} />
                </Link>
              </Button>
              <Button variant="ghost" size="icon">
                <Bell size={20} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser.profilePicture} alt={currentUser.username} />
                      <AvatarFallback>{currentUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={`/profile/${currentUser.id}`} className="cursor-pointer w-full">
                      Your Channel
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">
                  <User size={16} className="mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-4 py-3 space-y-3 shadow-lg bg-background">
            {/* Mobile Search */}
            <form 
              onSubmit={handleSearch} 
              className="flex items-center w-full"
            >
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0 h-full"
                >
                  <Search size={18} />
                </Button>
              </div>
            </form>

            {/* Mobile Navigation */}
            {currentUser ? (
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to={`/profile/${currentUser.id}`}>
                    <User size={16} className="mr-2" />
                    Your Channel
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/upload">
                    <Upload size={16} className="mr-2" />
                    Upload Video
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
