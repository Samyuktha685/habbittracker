import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  X, 
  Settings, 
  Key, 
  ShieldCheck, 
  Rocket, 
  Copy, 
  Check, 
  AlertCircle, 
  ExternalLink,
  Flame,
  Globe
} from "lucide-react";

export const FirebaseConfigModal = ({ isOpen, onClose }) => {
  const { isFirebaseConfigured } = useAuth();
  const [copiedRules, setCopiedRules] = useState(false);

  // Form states for custom config input
  const [apiKey, setApiKey] = useState("");
  const [authDomain, setAuthDomain] = useState("");
  const [projectId, setProjectId] = useState("");
  const [storageBucket, setStorageBucket] = useState("");
  const [messagingSenderId, setMessagingSenderId] = useState("");
  const [appId, setAppId] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const firestoreRulesSnippet = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Restrict access to /users/{uid}/... where request.auth.uid == uid
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}`;

  const handleCopyRules = () => {
    navigator.clipboard.writeText(firestoreRulesSnippet);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2500);
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    if (!apiKey || !projectId) return;

    const newConfig = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim() || `${projectId.trim()}.appspot.com`,
      messagingSenderId: messagingSenderId.trim() || "1234567890",
      appId: appId.trim() || "1:1234567890:web:1234567890"
    };

    localStorage.setItem("habbit_tracker_firebase_config", JSON.stringify(newConfig));
    setSaveSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleClearSavedConfig = () => {
    localStorage.removeItem("habbit_tracker_firebase_config");
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Firebase Setup & Deployment Guide
              </h2>
              <p className="text-xs text-slate-400">
                Configure your Firebase Auth & Firestore backend or deploy static app
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabbed Content Sections */}
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
          
          {/* SECTION 1: Status & Step-by-Step Instructions */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 mb-3">
              <Flame className="h-4 w-4 text-amber-400" />
              <span>1. How to Enable Firebase Authentication</span>
            </h3>
            <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed">
              <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline font-semibold">Firebase Console</a> and create a new Web Project.</li>
              <li>Under <strong>Build &gt; Authentication</strong>, click <strong>Get Started</strong> and enable the <strong>Email/Password</strong> sign-in provider.</li>
              <li>Under <strong>Build &gt; Firestore Database</strong>, click <strong>Create Database</strong> in Production or Test mode.</li>
              <li>Under <strong>Project Settings &gt; General &gt; Your apps</strong>, copy your Web App Firebase SDK configuration keys.</li>
            </ol>
          </div>

          {/* SECTION 2: Firestore Security Rules */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>2. Firestore Security Rules (Per-User Isolation)</span>
              </h3>
              <button
                onClick={handleCopyRules}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-semibold hover:bg-indigo-500/30 transition"
              >
                {copiedRules ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedRules ? "Copied!" : "Copy Rules"}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Paste this in Firebase Console &gt; Firestore Database &gt; <strong>Rules</strong> to restrict each user's access strictly to their own <code className="text-indigo-300">/users/&#123;uid&#125;</code> path:
            </p>
            <pre className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto">
              {firestoreRulesSnippet}
            </pre>
          </div>

          {/* SECTION 3: Live Custom Firebase Keys Form */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 mb-2">
              <Key className="h-4 w-4 text-indigo-400" />
              <span>3. Live Firebase Credentials Input</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your Firebase Web App configuration below to connect instantly without rebuilding:
            </p>

            {saveSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center space-x-2">
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Firebase credentials saved successfully! Reloading...</span>
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">API Key</label>
                  <input
                    type="text"
                    required
                    placeholder="AIzaSy..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Project ID</label>
                  <input
                    type="text"
                    required
                    placeholder="my-habit-tracker-123"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Auth Domain (Optional)</label>
                  <input
                    type="text"
                    placeholder="my-project.firebaseapp.com"
                    value={authDomain}
                    onChange={(e) => setAuthDomain(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">App ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="1:12345:web:abcdef"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleClearSavedConfig}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold"
                >
                  Reset to Demo
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30"
                >
                  Save & Connect Firebase
                </button>
              </div>
            </form>
          </div>

          {/* SECTION 4: Deployment Guide (Vercel & Firebase Hosting) */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 mb-2">
              <Globe className="h-4 w-4 text-purple-400" />
              <span>4. Static Site Deployment Instructions</span>
            </h3>
            <div className="text-xs text-slate-300 space-y-2">
              <p>
                <strong>Vercel Deployment:</strong> Push your code to GitHub, connect to Vercel, and add environment variables (<code className="text-indigo-300">VITE_FIREBASE_API_KEY</code>, etc.).
              </p>
              <p>
                <strong>Firebase Hosting Deployment:</strong> Run <code className="text-indigo-300">npx firebase-tools login</code> then <code className="text-indigo-300">npx firebase-tools init hosting</code> and publish dist folder with <code className="text-indigo-300">npm run build &amp;&amp; npx firebase-tools deploy</code>.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
