import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Settings,
  User,
  Volume2,
  Mic,
  Shield,
  Briefcase,
  Save,
  Check,
  RotateCcw,
  Sparkles,
  Sliders,
  Bell,
} from 'lucide-react';

interface SettingsPageProps {
  onNavigate: (tab: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  const [name, setName] = useState(user?.fullName || 'Siddharth');
  const [email, setEmail] = useState(user?.email || 'siddharth@example.com');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Full Stack Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level (3-5 years)');
  const [voiceSynthesis, setVoiceSynthesis] = useState(true);
  const [speechRate, setSpeechRate] = useState('1.0x');
  const [strictZeroFabrication, setStrictZeroFabrication] = useState(true);
  const [enforceXYZStar, setEnforceXYZStar] = useState(true);
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F1] py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#344E41]/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5EEDC] text-[#344E41] text-xs font-semibold mb-3">
              <Settings className="w-3.5 h-3.5 text-[#6B8E5A]" /> Platform Preferences
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#344E41]">
              Account & Engine Settings
            </h1>
            <p className="text-sm sm:text-base text-[#6B756D] mt-2 max-w-2xl leading-relaxed">
              Configure your profile information, AI interviewer speech synthesis, and ATS strictness rules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2.5 rounded-full border border-[#344E41]/15 bg-white text-[#344E41] text-xs font-semibold hover:bg-[#F4F7F1] transition-all shadow-sm"
            >
              Dashboard
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6B8E5A] text-white text-xs font-semibold hover:bg-[#5A7A4A] transition-all shadow-sm"
            >
              {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              {saved ? 'Preferences Saved' : 'Save Changes'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Profile & Target Role */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#344E41]/10 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#344E41]/10">
              <div className="w-10 h-10 rounded-2xl bg-[#E5EEDC] text-[#344E41] flex items-center justify-center">
                <User className="w-5 h-5 text-[#6B8E5A]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#344E41]">Candidate Profile</h2>
                <p className="text-xs text-[#6B756D]">Your public identification and career target</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#344E41]">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-[#344E41]/15 bg-[#F4F7F1]/30 focus:ring-2 focus:ring-[#6B8E5A] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#344E41]">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-[#344E41]/15 bg-[#F4F7F1]/30 focus:ring-2 focus:ring-[#6B8E5A] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#344E41]">Target Job Title</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-[#344E41]/15 bg-[#F4F7F1]/30 focus:ring-2 focus:ring-[#6B8E5A] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#344E41]">Target Experience Band</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-[#344E41]/15 bg-[#F4F7F1]/30 focus:ring-2 focus:ring-[#6B8E5A] focus:outline-none"
                >
                  <option>Early Career (0-2 years)</option>
                  <option>Mid-Level (3-5 years)</option>
                  <option>Senior (5-8 years)</option>
                  <option>Staff / Principal (8+ years)</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Voice & Interview Room Controls */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#344E41]/10 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#344E41]/10">
              <div className="w-10 h-10 rounded-2xl bg-[#E5EEDC] text-[#344E41] flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-[#6B8E5A]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#344E41]">Voice & Audio Synthesis</h2>
                <p className="text-xs text-[#6B756D]">Settings for real-time speech and speech recognition</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F4F7F1]/60 border border-[#344E41]/10">
                <div className="space-y-0.5">
                  <span className="text-sm font-semibold text-[#344E41] block">
                    AI Question Speech Synthesis (TTS)
                  </span>
                  <span className="text-xs text-[#6B756D]">
                    Speaks interview questions aloud using browser Web Speech API
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setVoiceSynthesis(!voiceSynthesis)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    voiceSynthesis ? 'bg-[#6B8E5A]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      voiceSynthesis ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#344E41]">AI Speech Cadence</label>
                  <select
                    value={speechRate}
                    onChange={(e) => setSpeechRate(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-[#344E41]/15 bg-[#F4F7F1]/30 focus:ring-2 focus:ring-[#6B8E5A] focus:outline-none"
                  >
                    <option>0.9x (Deliberate & Measured)</option>
                    <option>1.0x (Natural Conversational)</option>
                    <option>1.15x (Fast Executive)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#344E41]">Default Input Mode</label>
                  <select className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-[#344E41]/15 bg-[#F4F7F1]/30 focus:ring-2 focus:ring-[#6B8E5A] focus:outline-none">
                    <option>Microphone Speech Recognition</option>
                    <option>Text Typing</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* AI Grounding & Anti-Fabrication Safeguards */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#344E41]/10 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#344E41]/10">
              <div className="w-10 h-10 rounded-2xl bg-[#E5EEDC] text-[#344E41] flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#6B8E5A]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#344E41]">AI Grounding & Anti-Fabrication Guardrails</h2>
                <p className="text-xs text-[#6B756D]">Enforces factual integrity and eliminates hallucinations</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F4F7F1]/60 border border-[#344E41]/10">
                <div className="space-y-0.5 max-w-lg">
                  <span className="text-sm font-semibold text-[#344E41] block">
                    Strict Zero-Fabrication Enforcement
                  </span>
                  <span className="text-xs text-[#6B756D]">
                    Prohibits the resume improver from generating companies, years, metrics, or technologies not grounded in user input.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStrictZeroFabrication(!strictZeroFabrication)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    strictZeroFabrication ? 'bg-[#6B8E5A]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      strictZeroFabrication ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F4F7F1]/60 border border-[#344E41]/10">
                <div className="space-y-0.5 max-w-lg">
                  <span className="text-sm font-semibold text-[#344E41] block">
                    Enforce Google XYZ STAR Formula
                  </span>
                  <span className="text-xs text-[#6B756D]">
                    Structures bullet points according to: Accomplished [X], measured by [Y], by doing [Z].
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEnforceXYZStar(!enforceXYZStar)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enforceXYZStar ? 'bg-[#6B8E5A]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enforceXYZStar ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F4F7F1]/60 border border-[#344E41]/10">
                <div className="space-y-0.5 max-w-lg">
                  <span className="text-sm font-semibold text-[#344E41] block">
                    Adaptive Follow-Up Probing
                  </span>
                  <span className="text-xs text-[#6B756D]">
                    Enables the AI interviewer to ask targeted technical follow-ups when candidates provide vague or buzzword-heavy responses.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAdaptiveDifficulty(!adaptiveDifficulty)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    adaptiveDifficulty ? 'bg-[#6B8E5A]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      adaptiveDifficulty ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between p-6 rounded-3xl bg-white border border-[#344E41]/10">
            <span className="text-xs text-[#6B756D]">
              All changes apply immediately to upcoming mock sessions and ATS scans.
            </span>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#6B8E5A] text-white text-xs font-semibold hover:bg-[#5A7A4A] transition-all shadow-sm"
            >
              {saved ? <Check className="w-4 h-4 text-emerald-200" /> : <Save className="w-4 h-4" />}
              {saved ? 'Preferences Saved' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
