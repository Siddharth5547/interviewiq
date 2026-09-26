import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api.js';
import { speechService } from '../services/speech.js';
import { Interview, QuestionItem } from '../types/index.js';
import {
  Send,
  Mic,
  MicOff,
  PhoneOff,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface InterviewRoomPageProps {
  interview: Interview;
  onComplete: (completedInterview: Interview) => void;
  onExit: () => void;
}

export const InterviewRoomPage: React.FC<InterviewRoomPageProps> = ({
  interview: initialInterview,
  onComplete,
  onExit,
}) => {
  const [interview, setInterview] = useState<Interview>(initialInterview);
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [speechNotice, setSpeechNotice] = useState('');
  const [aiState, setAiState] = useState<'Speaking' | 'Listening' | 'Processing' | 'Waiting'>('Speaking');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const currentQuestion: QuestionItem | undefined =
    interview.questionList[interview.currentQuestionIndex];

  // Auto-scroll transcript
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [interview.conversation]);

  // Handle conversational TTS for new question
  useEffect(() => {
    const interviewerMsgs = interview.conversation.filter((m) => m.sender === 'interviewer');
    const latestInterviewerMsg = interviewerMsgs[interviewerMsgs.length - 1];
    const lineToSpeak = latestInterviewerMsg?.spokenText || currentQuestion?.question;

    if (lineToSpeak && !voiceMuted) {
      setAiState('Speaking');
      speechService.speak(
        lineToSpeak,
        () => setAiState('Speaking'),
        () => {
          setAiState('Waiting');
          if (interview.mode === 'Voice') {
            startVoiceRecording();
          }
        }
      );
    } else {
      setAiState('Waiting');
    }

    return () => {
      speechService.cancelSpeech();
      speechService.stopListening();
    };
  }, [interview.currentQuestionIndex]);

  const handleInterrupt = () => {
    speechService.cancelSpeech();
    setAiState('Listening');
    startVoiceRecording();
  };

  const startVoiceRecording = () => {
    setIsListening(true);
    setAiState('Listening');
    setSpeechNotice('');

    speechService.startListening(
      (transcript) => {
        setAnswerText(transcript);
      },
      (error) => {
        setSpeechNotice(error);
        setIsListening(false);
        setAiState('Waiting');
      },
      () => {
        setIsListening(false);
        if (aiState === 'Listening') setAiState('Waiting');
      }
    );
  };

  const stopVoiceRecording = () => {
    speechService.stopListening();
    setIsListening(false);
    setAiState('Waiting');
  };

  const toggleMic = () => {
    if (isListening) {
      stopVoiceRecording();
    } else {
      if (aiState === 'Speaking') {
        speechService.cancelSpeech();
      }
      startVoiceRecording();
    }
  };

  const handleSendAnswer = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!answerText.trim() || isSubmitting) return;

    if (isListening) {
      stopVoiceRecording();
    }

    setIsSubmitting(true);
    setAiState('Processing');
    setSpeechNotice('');

    try {
      const interviewId = interview._id || interview.id || '';
      const res = await api.submitAnswer(interviewId, answerText.trim());

      if (res.data.success) {
        setInterview(res.data.interview);
        setAnswerText('');

        if (res.data.isComplete) {
          onComplete(res.data.interview);
        }
      }
    } catch (err: any) {
      setSpeechNotice(err.response?.data?.error || 'Failed to submit response.');
      setAiState('Waiting');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndEarly = async () => {
    if (window.confirm('Finish the interview session and view your diagnostic report now?')) {
      speechService.cancelSpeech();
      speechService.stopListening();
      try {
        const interviewId = interview._id || interview.id || '';
        const res = await api.finishInterviewEarly(interviewId);
        if (res.data.success) {
          onComplete(res.data.interview);
        }
      } catch (err) {
        onExit();
      }
    }
  };

  const progressPercent = Math.min(
    100,
    Math.round(((interview.currentQuestionIndex + 1) / Math.max(interview.questionList.length, 1)) * 100)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Top Immersive Progress Header */}
      <div className="bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] p-6 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold text-[#344E41] font-display">
              Question {interview.currentQuestionIndex + 1} of {interview.questionList.length}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E5EEDC] text-[#344E41] font-bold">
              {interview.difficulty}
            </span>
            <span className="text-xs text-[#6B756D] hidden sm:inline">
              Topic: <strong>{currentQuestion?.topic || 'Architecture'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setVoiceMuted(!voiceMuted)}
              title={voiceMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-2 rounded-full border border-[rgba(52,78,65,0.12)] hover:bg-[#F4F7F1] text-[#6B756D]"
            >
              {voiceMuted ? <VolumeX className="w-4 h-4 text-status-danger" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={handleEndEarly}
              className="px-4 py-1.5 rounded-full border border-[rgba(198,69,69,0.3)] text-[#C64545] text-xs font-bold hover:bg-red-50 transition-colors flex items-center gap-1.5"
            >
              <PhoneOff className="w-3.5 h-3.5" /> End & Review
            </button>
          </div>
        </div>

        {/* Large Progress Bar */}
        <div className="w-full bg-[#E5EEDC] h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-[#6B8E5A] h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 2. Center Stage: AI Interviewer Visual & Audio Waveform */}
      <div className="p-8 sm:p-12 bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] shadow-premium flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
        {/* Soft Sage Halo Glow */}
        <div className="absolute inset-0 bg-radial-gradient from-[#E5EEDC]/40 via-transparent to-transparent pointer-events-none" />

        {/* Abstract Human-like Avatar with Animated Ring */}
        <div className="relative">
          {aiState === 'Speaking' && (
            <span className="absolute -inset-3 rounded-full bg-[#6B8E5A]/25 blur-md animate-ping" />
          )}
          {aiState === 'Listening' && (
            <span className="absolute -inset-3 rounded-full bg-[#4A7C59]/25 blur-md animate-pulse" />
          )}

          <div className="relative w-24 h-24 rounded-full bg-[#344E41] text-white flex items-center justify-center shadow-premium border-4 border-white">
            <span className="text-3xl font-extrabold font-display">IQ</span>
          </div>
        </div>

        <div className="space-y-0.5">
          <h3 className="text-lg font-bold text-[#1F2A22] font-display">Dr. Sarah Vance</h3>
          <p className="text-xs text-[#6B756D]">Senior Engineering Staff Interviewer</p>
        </div>

        {/* Dynamic Activity Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold bg-[#E5EEDC] text-[#344E41] border border-[rgba(52,78,65,0.08)]">
          {aiState === 'Speaking' && 'AI Speaking...'}
          {aiState === 'Listening' && 'Listening to your response...'}
          {aiState === 'Processing' && 'Analyzing response depth...'}
          {aiState === 'Waiting' && 'Your Turn to Answer'}
        </div>

        {/* Subtle Waveform Animation */}
        <div className="flex items-center gap-1.5 h-6 pt-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((idx) => {
            const isWave = aiState === 'Speaking' || aiState === 'Listening';
            return (
              <div
                key={idx}
                className={`w-1 rounded-full bg-[#6B8E5A] ${isWave ? `animate-soundwave-${(idx % 5) + 1}` : 'h-2'}`}
                style={{ height: isWave ? undefined : '6px' }}
              />
            );
          })}
        </div>
      </div>

      {/* 3. Below: Large Question Text Display */}
      {currentQuestion && (
        <div className="p-8 bg-white rounded-3xl border-2 border-[#6B8E5A]/30 shadow-soft space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E5A]">
            Current Interview Question
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F2A22] leading-relaxed font-display">
            {currentQuestion.question}
          </h2>
          <p className="text-xs text-[#6B756D]">
            <strong>Context:</strong> {currentQuestion.reason}
          </p>
        </div>
      )}

      {/* 4. Conversation History Transcript */}
      <div
        ref={chatScrollRef}
        className="max-h-72 overflow-y-auto p-6 bg-[#F4F7F1] rounded-3xl border border-[rgba(52,78,65,0.08)] space-y-4"
      >
        <span className="text-xs font-bold text-[#6B756D] uppercase tracking-wider block">Session Dialogue</span>
        {interview.conversation.map((msg) => {
          const isInterviewer = msg.sender === 'interviewer';
          return (
            <div
              key={msg.id}
              className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[90%] ${
                isInterviewer
                  ? 'bg-white text-[#1F2A22] border border-[rgba(52,78,65,0.08)] shadow-2xs mr-auto'
                  : 'bg-[#344E41] text-white ml-auto'
              }`}
            >
              <span className="font-bold block text-[11px] mb-1 opacity-75">
                {isInterviewer ? 'Interviewer' : 'You'}
              </span>
              <p>{msg.text}</p>
            </div>
          );
        })}
      </div>

      {/* 5. Answer Area: Large text input, large mic button, submit button */}
      <div className="p-6 bg-white rounded-3xl border border-[rgba(52,78,65,0.12)] shadow-premium space-y-4">
        {speechNotice && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{speechNotice}</span>
          </div>
        )}

        <form onSubmit={handleSendAnswer} className="space-y-4">
          <textarea
            rows={4}
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendAnswer();
              }
            }}
            placeholder={
              isListening
                ? 'Listening to your microphone... speak clearly...'
                : 'Type your answer with technical specificity (Press Enter to submit)...'
            }
            className="w-full text-sm p-4 rounded-2xl border border-[rgba(52,78,65,0.15)] outline-none focus:ring-2 focus:ring-[#6B8E5A] bg-[#F4F7F1]/30 leading-relaxed resize-none"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMic}
                className={`px-5 py-3 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                  isListening
                    ? 'bg-[#C64545] text-white animate-pulse shadow-md'
                    : 'bg-[#E5EEDC] text-[#344E41] hover:bg-[#D4E2C5]'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isListening ? 'Stop Recording' : 'Voice Input'}</span>
              </button>

              {aiState === 'Speaking' && (
                <button
                  type="button"
                  onClick={handleInterrupt}
                  className="px-4 py-3 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-200 transition-colors inline-flex items-center gap-1.5"
                >
                  Interrupt AI
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !answerText.trim()}
              className="px-8 py-3.5 rounded-full bg-[#344E41] text-white text-xs font-bold hover:bg-[#4B6B5B] transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit Answer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
