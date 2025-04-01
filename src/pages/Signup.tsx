
import React from "react";
import { Link } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Signup: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 mt-16">
        <div className="w-full max-w-md animate-fade-in">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Create an Account</h1>
              <p className="text-muted-foreground mt-2">
                Join our community of content creators and viewers
              </p>
            </div>
            
            <AuthForm isLogin={false} />
            
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Signup;
