
import React from "react";
import { Link } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 mt-16">
        <div className="w-full max-w-md animate-fade-in">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-muted-foreground mt-2">
                Sign in to your account to continue
              </p>
            </div>
            
            <AuthForm isLogin={true} />
            
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/signup" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
