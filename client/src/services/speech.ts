// Speech-to-Text (STT) and Text-to-Speech (TTS) integration using standard Web Speech API with safety fallbacks

export class SpeechService {
  private recognition: any = null;
  private isSTTSupported = false;
  private isTTSSupported = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.isSTTSupported = true;
      }

      if ('speechSynthesis' in window) {
        this.isTTSSupported = true;
      }
    }
  }

  public getStatus() {
    return {
      sttSupported: this.isSTTSupported,
      ttsSupported: this.isTTSSupported,
    };
  }

  /**
   * Start listening to candidate speech
   */
  public startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError('Speech Recognition is not supported in this browser. Please use standard text input.');
      return;
    }

    try {
      this.recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const combined = final || interim;
        onResult(combined, !!final);
      };

      this.recognition.onerror = (event: any) => {
        console.warn('[SpeechService] STT Error:', event.error);
        if (event.error === 'not-allowed') {
          onError('Microphone permission was denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'no-speech') {
          // Normal silence, ignore
        } else {
          onError(`Speech recognition notice: ${event.error}`);
        }
      };

      this.recognition.onend = () => {
        onEnd();
      };

      this.recognition.start();
    } catch (err: any) {
      console.warn('[SpeechService] Recognition start error:', err);
    }
  }

  /**
   * Stop listening
   */
  public stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
  }

  /**
   * Speak interviewer question aloud
   */
  public speak(text: string, onStart?: () => void, onEnd?: () => void) {
    if (!this.isTTSSupported) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.02;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      // Pick a natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel')) && v.lang.startsWith('en')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      if (onStart) utterance.onstart = onStart;
      if (onEnd) utterance.onend = onEnd;
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[SpeechService] TTS speak error:', err);
      if (onEnd) onEnd();
    }
  }

  public cancelSpeech() {
    if (this.isTTSSupported) {
      window.speechSynthesis.cancel();
    }
  }
}

export const speechService = new SpeechService();
