import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AICompletionOptions {
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  jsonMode?: boolean;
}

export type SupportedAIProvider = 'xai' | 'openai' | 'gemini' | 'builtin';

export class AIProviderService {
  private activeProvider: SupportedAIProvider = 'builtin';
  private xaiKey: string | null = null;
  private openaiKey: string | null = null;
  private geminiClient: GoogleGenerativeAI | null = null;
  private geminiModel: any = null;
  private aiModel: string = 'grok-beta';
  private xaiCooldownUntil: number = 0;
  private openaiCooldownUntil: number = 0;
  private cache = new Map<string, { val: string; exp: number }>();

  constructor() {
    this.xaiKey = process.env.XAI_API_KEY?.trim() || null;
    this.openaiKey = process.env.OPENAI_API_KEY?.trim() || null;
    const geminiKey = process.env.GEMINI_API_KEY?.trim() || null;
    const preferredProvider = (process.env.AI_PROVIDER?.trim().toLowerCase() as SupportedAIProvider) || null;
    this.aiModel = process.env.AI_MODEL?.trim() || 'grok-beta';

    if (geminiKey) {
      try {
        this.geminiClient = new GoogleGenerativeAI(geminiKey);
        this.geminiModel = this.geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
      } catch (err) {
        console.warn('[AIProvider] Failed to initialize Gemini client:', err);
      }
    }

    // Resolve primary provider based on preference & available keys
    if (preferredProvider === 'xai' && this.xaiKey) {
      this.activeProvider = 'xai';
      console.log(`[AIProvider] Active provider: xAI Grok (model: ${this.aiModel}). Server-side key secured.`);
    } else if (preferredProvider === 'openai' && this.openaiKey) {
      this.activeProvider = 'openai';
      console.log(`[AIProvider] Active provider: OpenAI (model: ${this.aiModel}). Server-side key secured.`);
    } else if (preferredProvider === 'gemini' && this.geminiModel) {
      this.activeProvider = 'gemini';
      console.log('[AIProvider] Active provider: Google Gemini.');
    } else if (this.xaiKey) {
      this.activeProvider = 'xai';
      console.log(`[AIProvider] Active provider: xAI Grok (model: ${this.aiModel}).`);
    } else if (this.openaiKey) {
      this.activeProvider = 'openai';
      console.log(`[AIProvider] Active provider: OpenAI.`);
    } else if (this.geminiModel) {
      this.activeProvider = 'gemini';
      console.log('[AIProvider] Active provider: Google Gemini.');
    } else {
      this.activeProvider = 'builtin';
      console.log('[AIProvider] No external AI key configured; running built-in Semantic NLP & Adaptive Rubric Engine.');
    }
  }

  public getActiveProvider(): { provider: SupportedAIProvider; model: string } {
    return {
      provider: this.activeProvider,
      model: this.activeProvider === 'xai' || this.activeProvider === 'openai' ? this.aiModel : 'gemini-1.5-flash',
    };
  }

  /**
   * Sanitizes input strings against prompt injection attempts
   */
  public sanitizeInput(text: string): string {
    if (!text) return '';
    return text
      .replace(/<\/?(?:system|instruction|prompt|im_start|im_end)[^>]*>/gi, '')
      .replace(/ignore (?:all )?previous instructions/gi, '[filtered command]')
      .trim();
  }

  /**
   * Calls xAI (Grok) completions API via standard fetch
   */
  private async callXAI(systemPrompt: string | undefined, userPrompt: string, temperature: number): Promise<string | null> {
    if (!this.xaiKey) return null;
    if (Date.now() < this.xaiCooldownUntil) return null;

    const messages: Array<{ role: string; content: string }> = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: userPrompt });

    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.xaiKey}`,
        },
        body: JSON.stringify({
          model: this.aiModel || 'grok-beta',
          messages,
          temperature,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[AIProvider:xAI] Request failed with HTTP ${response.status}:`, errorText);
        // If out of credits (403), unauthorized (401), or rate limited (429), cool down for 5 mins
        if (response.status === 401 || response.status === 403 || response.status === 429) {
          this.xaiCooldownUntil = Date.now() + 5 * 60 * 1000;
        }
        return null;
      }

      const data: any = await response.json();
      return data.choices?.[0]?.message?.content || null;
    } catch (err: any) {
      console.warn('[AIProvider:xAI] Network error calling xAI:', err.message);
      this.xaiCooldownUntil = Date.now() + 60 * 1000;
      return null;
    }
  }

  /**
   * Calls OpenAI completions API via standard fetch
   */
  private async callOpenAI(systemPrompt: string | undefined, userPrompt: string, temperature: number): Promise<string | null> {
    if (!this.openaiKey) return null;
    if (Date.now() < this.openaiCooldownUntil) return null;

    const messages: Array<{ role: string; content: string }> = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: userPrompt });

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.openaiKey}`,
        },
        body: JSON.stringify({
          model: this.aiModel || 'gpt-4o-mini',
          messages,
          temperature,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[AIProvider:OpenAI] Request failed with HTTP ${response.status}:`, errorText);
        if (response.status === 401 || response.status === 403 || response.status === 429) {
          this.openaiCooldownUntil = Date.now() + 5 * 60 * 1000;
        }
        return null;
      }

      const data: any = await response.json();
      return data.choices?.[0]?.message?.content || null;
    } catch (err: any) {
      console.warn('[AIProvider:OpenAI] Network error calling OpenAI:', err.message);
      this.openaiCooldownUntil = Date.now() + 60 * 1000;
      return null;
    }
  }

  /**
   * Generates completion using configured external LLM or returns null to trigger semantic fallback
   */
  public async generateText(options: AICompletionOptions): Promise<string | null> {
    const { systemPrompt, userPrompt, temperature = 0.3 } = options;
    const cacheKey = `${systemPrompt || ''}:::${userPrompt}:::${temperature}`;

    // Cache hit check
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() < cached.exp) {
      return cached.val;
    }

    let result: string | null = null;

    if (this.activeProvider === 'xai') {
      result = await this.callXAI(systemPrompt, userPrompt, temperature);
    }

    if (!result && this.activeProvider === 'openai') {
      result = await this.callOpenAI(systemPrompt, userPrompt, temperature);
    }

    if (result) {
      if (this.cache.size > 200) this.cache.clear();
      this.cache.set(cacheKey, { val: result, exp: Date.now() + 15 * 60 * 1000 });
      return result;
    }

    if (this.geminiModel) {
      try {
        const fullPrompt = `${systemPrompt ? `SYSTEM:\n${systemPrompt}\n\n` : ''}USER:\n${userPrompt}`;
        const genResult = await this.geminiModel.generateContent({
          contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature,
          },
        });
        const text = genResult.response.text();
        if (text) {
          if (this.cache.size > 200) this.cache.clear();
          this.cache.set(cacheKey, { val: text, exp: Date.now() + 15 * 60 * 1000 });
          return text;
        }
      } catch (error: any) {
        console.warn('[AIProvider:Gemini] API call failed, falling back:', error.message);
      }
    }

    return null;
  }

  /**
   * Generates structured JSON from the model or parses fallback
   */
  public async generateJSON<T>(options: AICompletionOptions, fallbackGenerator: () => T): Promise<T> {
    const raw = await this.generateText({ ...options, jsonMode: true });
    if (!raw) {
      return fallbackGenerator();
    }

    try {
      let cleaned = raw.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      }
      return JSON.parse(cleaned) as T;
    } catch (parseErr) {
      console.warn('[AIProvider] JSON parse failed on LLM response. Using deterministic fallback generator.');
      return fallbackGenerator();
    }
  }
}

export const aiProvider = new AIProviderService();
