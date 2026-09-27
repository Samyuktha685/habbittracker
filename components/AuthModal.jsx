import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Eye, 
  EyeOff,
  KeyRound,
  ShieldCheck,
  Info
} from "lucide-react";

export const AuthModal = ({ onOpenSetupModal }) => {
  const { signup, login, resetPassword, authError, setAuthError, isFirebaseConfigured } = useAuth();

  // Mode: "login" | "signup" | "forgot"
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [validationError, setValidationError] = useState("");

  const clearForm = () => {
    setAuthError("");
    setValidationError("");
    setResetSent(false);
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    clearForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearForm();

    if (!email || !email.includes("@")) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    if (mode === "forgot") {
      setLoading(true);
      try {
        await resetPassword(email);
        setResetSent(true);
      } catch (err) {
        // Handled in context
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password) {
      setValidationError("Please enter a password.");
      return;
    }

    if (mode === "signup") {
      if (password.length < 6) {
        setValidationError("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setValidationError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        await signup(email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl">
        
        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30 mb-4 flex items-center justify-center">
            <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="h-7 w-7 text-indigo-400" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            {mode === "login" && "Welcome Back"}
            {mode === "signup" && "Create Your Account"}
            {mode === "forgot" && "Reset Password"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === "login" && "Sign in to access your personal 100-day habit tracker"}
            {mode === "signup" && "Start your 100-day journey with isolated private data"}
            {mode === "forgot" && "Enter your email to receive a password reset link"}
          </p>
        </div>

        {/* Mode Selector Tabs (Login vs Signup) */}
        {mode !== "forgot" && (
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => handleModeSwitch("login")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === "login"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch("signup")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === "signup"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Demo Mode Notification Badge if Firebase Not Yet Configured */}
        {!isFirebaseConfigured && (
          <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start space-x-2.5">
            <Info className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-[11px] text-amber-200">
              <span className="font-semibold text-amber-300">Demo Auth Active:</span> You can sign up/in instantly with any email to test! Or{" "}
              <button 
                onClick={onOpenSetupModal} 
                className="underline hover:text-white font-medium text-amber-300"
              >
                connect your Firebase project
              </button>.
            </div>
          </div>
        )}

        {/* Error Alert Box */}
        {(authError || validationError) && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-2.5 text-xs text-red-300 animate-fadeIn">
            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
            <span>{validationError || authError}</span>
          </div>
        )}

        {/* Success Message for Reset Password */}
        {mode === "forgot" && resetSent && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start space-x-2.5 text-xs text-emerald-300">
            <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>Password reset email sent! Check your inbox for further instructions.</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Password Input (for Login & Signup) */}
          {mode !== "forgot" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("forgot")}
                    className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Confirm Password Input (Signup Mode Only) */}
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {mode === "login" && "Sign In to Dashboard"}
                  {mode === "signup" && "Create Free Account"}
                  {mode === "forgot" && "Send Reset Link"}
                </span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Back Link for Forgot Password */}
        {mode === "forgot" && (
          <div className="mt-6 text-center">
            <button
              onClick={() => handleModeSwitch("login")}
              className="text-xs font-medium text-slate-400 hover:text-indigo-400 transition"
            >
              ← Back to Sign In
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
