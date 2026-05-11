/**
 * @claude-flow/mcp - Sampling (Server-Initiated LLM)
 *
 * MCP 2025-11-25 compliant sampling for server-initiated LLM calls
 */

import { EventEmitter } from 'events';
import type {
  SamplingMessage,
  ModelPreferences,
  CreateMessageRequest,
  CreateMessageResult,
  PromptContent,
  ILogger,
} from './types.js';

/**
 * External LLM provider interface
 */
export interface LLMProvider {
  name: string;
  createMessage(request: CreateMessageRequest): Promise<CreateMessageResult>;
  isAvailable(): Promise<boolean>;
}

/**
 * Sampling configuration
 */
export interface SamplingConfig {
  /** Default model preferences */
  defaultModelPreferences?: ModelPreferences;
  /** Maximum tokens for any request */
  maxTokensLimit?: number;
  /** Default temperature */
  defaultTemperature?: number;
  /** Timeout for LLM calls (ms) */
  timeout?: number;
  /** Enable request logging */
  enableLogging?: boolean;
}

/**
 * Sampling request context
 */
export interface SamplingContext {
  sessionId: string;
  serverId?: string;
  metadata?: Record<string, unknown>;
}

const DEFAULT_CONFIG: Required<SamplingConfig> = {
  defaultModelPreferences: {
    intelligencePriority: 0.5,
    speedPriority: 0.3,
    costPriority: 0.2,
  },
  maxTokensLimit: 4096,
  defaultTemperature: 0.7,
  timeout: 30000,
  enableLogging: true,
};

export class SamplingManager extends EventEmitter {
  private readonly config: Required<SamplingConfig>;
  private providers: Map<string, LLMProvider> = new Map();
  private defaultProvider?: string;
  private requestCount = 0;
  private totalTokens = 0;

  constructor(
    private readonly logger: ILogger,
    config: Partial<SamplingConfig> = {}
  ) {
    super();
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Register an LLM provider
   */
  registerProvider(provider: LLMProvider, isDefault: boolean = false): void {
    this.providers.set(provider.name, provider);
    if (isDefault || !this.defaultProvider) {
      this.defaultProvider = provider.name;
    }
    this.logger.info('LLM provider registered', { name: provider.name, isDefault });
    this.emit('provider:registered', { name: provider.name });
  }

  /**
   * Unregister a provider
   */
  unregisterProvider(name: string): boolean {
    const removed = this.providers.delete(name);
    if (removed && this.defaultProvider === name) {
      this.defaultProvider = this.providers.keys().next().value;
    }
    return removed;
  }

  /**
   * Create a message (sampling/createMessage)
   */
  async createMessage(
    request: CreateMessageRequest,
    context?: SamplingContext
  ): Promise<CreateMessageResult> {
    const startTime = Date.now();
    this.requestCount++;

    // Validate request
    this.validateRequest(request);

    // Select provider
    const provider = this.selectProvider(request.modelPreferences);
    if (!provider) {
      throw new Error('No LLM provider available');
    }

    // Apply defaults
    const fullRequest = this.applyDefaults(request);

    if (this.config.enableLogging) {
      this.logger.debug('Sampling request', {
        provider: provider.name,
        messageCount: request.messages.length,
        maxTokens: fullRequest.maxTokens,
        sessionId: context?.sessionId,
      });
    }

    this.emit('sampling:start', { provider: provider.name, context });

    try {
      // Call provider with timeout
      const result = await this.callWithTimeout(
        provider.createMessage(fullRequest),
        this.config.timeout
      );

      const duration = Date.now() - startTime;

      if (this.config.enableLogging) {
        this.logger.info('Sampling complete', {
          provider: provider.name,
          duration: `${duration}ms`,
          stopReason: result.stopReason,
        });
      }

      this.emit('sampling:complete', {
        provider: provider.name,
        duration,
        result,
        context,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.logger.error('Sampling failed', {
        provider: provider.name,
        duration: `${duration}ms`,
        error,
      });

      this.emit('sampling:error', {
        provider: provider.name,
        duration,
        error,
        context,
      });

      throw error;
    }
  }

  /**
   * Check if sampling is available
   */
  async isAvailable(): Promise<boolean> {
    if (this.providers.size === 0) {
      return false;
    }

    for (const provider of this.providers.values()) {
      if (await provider.isAvailable()) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get available providers
   */
  getProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Get stats
   */
  getStats(): {
    requestCount: number;
    totalTokens: number;
    providerCount: number;
    defaultProvider?: string;
  } {
    return {
      requestCount: this.requestCount,
      totalTokens: this.totalTokens,
      providerCount: this.providers.size,
      defaultProvider: this.defaultProvider,
    };
  }

  /**
   * Validate sampling request
   */
  private validateRequest(request: CreateMessageRequest): void {
    if (!request.messages || request.messages.length === 0) {
      throw new Error('Messages are required');
    }

    if (request.maxTokens > this.config.maxTokensLimit) {
      throw new Error(`maxTokens exceeds limit of ${this.config.maxTokensLimit}`);
    }

    if (request.temperature !== undefined && (request.temperature < 0 || request.temperature > 2)) {
      throw new Error('Temperature must be between 0 and 2');
    }
  }

  /**
   * Select provider based on preferences
   */
  private selectProvider(preferences?: ModelPreferences): LLMProvider | undefined {
    // If hints provided, try to find matching provider
    if (preferences?.hints) {
      for (const hint of preferences.hints) {
        if (hint.name && this.providers.has(hint.name)) {
          return this.providers.get(hint.name);
        }
      }
    }

    // Use default provider
    if (this.defaultProvider) {
      return this.providers.get(this.defaultProvider);
    }

    // Return first available
    return this.providers.values().next().value;
  }

  /**
   * Apply default values to request
   */
  private applyDefaults(request: CreateMessageRequest): CreateMessageRequest {
    return {
      ...request,
      modelPreferences: request.modelPreferences || this.config.defaultModelPreferences,
      temperature: request.temperature ?? this.config.defaultTemperature,
      maxTokens: Math.min(request.maxTokens, this.config.maxTokensLimit),
    };
  }

  /**
   * Call with timeout
   */
  private async callWithTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        setTimeout(() => reject(new Error('Sampling timeout')), timeout);
      }),
    ]);
  }
}

export function createSamplingManager(
  logger: ILogger,
  config?: Partial<SamplingConfig>
): SamplingManager {
  return new SamplingManager(logger, config);
}

/**
 * Create a mock LLM provider for testing
 */
export function createMockProvider(name: string = 'mock'): LLMProvider {
  return {
    name,
    async createMessage(request: CreateMessageRequest): Promise<CreateMessageResult> {
      // Mock provider response delay
      await new Promise((r) => setTimeout(r, 100));

      return {
        role: 'assistant',
        content: {
          type: 'text',
          text: `Mock response to: ${JSON.stringify(request.messages[0]?.content)}`,
        },
        model: `${name}-model`,
        stopReason: 'endTurn',
      };
    },
    async isAvailable(): Promise<boolean> {
      return true;
    },
  };
}

/**
 * Create an Anthropic provider (requires API key)
 */
export function createAnthropicProvider(apiKey: string): LLMProvider {
  return {
    name: 'anthropic',
    async createMessage(request: CreateMessageRequest): Promise<CreateMessageResult> {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: request.maxTokens,
          temperature: request.temperature,
          system: request.systemPrompt,
          messages: request.messages.map((m) => ({
            role: m.role,
            content: m.content.type === 'text' ? (m.content as any).text : m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const data = await response.json() as any;

      return {
        role: 'assistant',
        content: {
          type: 'text',
          text: data.content[0]?.text || '',
        },
        model: data.model,
        stopReason: data.stop_reason === 'end_turn' ? 'endTurn' : 'maxTokens',
      };
    },
    async isAvailable(): Promise<boolean> {
      return !!apiKey;
    },
  };
}

/**
 * Create an OpenAI (GPT) provider (requires API key)
 * Supports gpt-4o, gpt-4-turbo, gpt-3.5-turbo and any OpenAI-compatible endpoint.
 */
export function createOpenAIProvider(
  apiKey: string,
  options: { baseUrl?: string; model?: string } = {},
): LLMProvider {
  const baseUrl = options.baseUrl || 'https://api.openai.com/v1';
  const defaultModel = options.model || 'gpt-4o-mini';
  return {
    name: 'openai',
    async createMessage(request: CreateMessageRequest): Promise<CreateMessageResult> {
      const messages: Array<{ role: string; content: string }> = [];
      if (request.systemPrompt) {
        messages.push({ role: 'system', content: request.systemPrompt });
      }
      for (const m of request.messages) {
        const text = m.content.type === 'text' ? (m.content as any).text : JSON.stringify(m.content);
        messages.push({ role: m.role === 'assistant' ? 'assistant' : 'user', content: text });
      }
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: defaultModel,
          max_tokens: request.maxTokens,
          temperature: request.temperature,
          messages,
        }),
      });
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }
      const data = (await response.json()) as any;
      const choice = data.choices?.[0];
      return {
        role: 'assistant',
        content: {
          type: 'text',
          text: choice?.message?.content || '',
        },
        model: data.model,
        stopReason: choice?.finish_reason === 'stop' ? 'endTurn' : 'maxTokens',
      };
    },
    async isAvailable(): Promise<boolean> {
      return !!apiKey;
    },
  };
}

/**
 * Create a Google Gemini provider (requires API key)
 */
export function createGeminiProvider(
  apiKey: string,
  options: { model?: string } = {},
): LLMProvider {
  const defaultModel = options.model || 'gemini-1.5-flash';
  return {
    name: 'gemini',
    async createMessage(request: CreateMessageRequest): Promise<CreateMessageResult> {
      const contents = request.messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [
          {
            text:
              m.content.type === 'text' ? (m.content as any).text : JSON.stringify(m.content),
          },
        ],
      }));
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${defaultModel}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: request.systemPrompt
            ? { parts: [{ text: request.systemPrompt }] }
            : undefined,
          contents,
          generationConfig: {
            maxOutputTokens: request.maxTokens,
            temperature: request.temperature,
          },
        }),
      });
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }
      const data = (await response.json()) as any;
      const candidate = data.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text || '';
      return {
        role: 'assistant',
        content: { type: 'text', text },
        model: defaultModel,
        stopReason: candidate?.finishReason === 'STOP' ? 'endTurn' : 'maxTokens',
      };
    },
    async isAvailable(): Promise<boolean> {
      return !!apiKey;
    },
  };
}

/**
 * Create an OpenClaw gateway provider (delegates to a local OpenClaw router endpoint)
 * Useful when running Ruflo inside an OpenClaw managed environment that already has
 * configured providers/credentials.
 */
export function createOpenClawProvider(
  options: { baseUrl?: string; token?: string; model?: string } = {},
): LLMProvider {
  const baseUrl = options.baseUrl || process.env.OPENCLAW_GATEWAY_URL || 'http://127.0.0.1:7890';
  const token = options.token || process.env.OPENCLAW_GATEWAY_TOKEN || '';
  const defaultModel = options.model || process.env.OPENCLAW_MODEL || 'gpt/gpt-5.5';
  return {
    name: 'openclaw',
    async createMessage(request: CreateMessageRequest): Promise<CreateMessageResult> {
      const response = await fetch(`${baseUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          model: defaultModel,
          max_tokens: request.maxTokens,
          temperature: request.temperature,
          system: request.systemPrompt,
          messages: request.messages,
        }),
      });
      if (!response.ok) {
        throw new Error(`OpenClaw gateway error: ${response.status}`);
      }
      const data = (await response.json()) as any;
      return {
        role: 'assistant',
        content: {
          type: 'text',
          text: data.content?.[0]?.text || data.text || '',
        },
        model: data.model || defaultModel,
        stopReason: data.stop_reason === 'end_turn' ? 'endTurn' : 'maxTokens',
      };
    },
    async isAvailable(): Promise<boolean> {
      try {
        const res = await fetch(`${baseUrl}/health`, { method: 'GET' });
        return res.ok;
      } catch {
        return false;
      }
    },
  };
}

/**
 * Auto-detect providers from environment variables.
 * Order: OPENCLAW_GATEWAY_TOKEN > ANTHROPIC_API_KEY > OPENAI_API_KEY > GEMINI_API_KEY
 * Returns array of providers in registration order; the first is treated as default.
 */
export function createProvidersFromEnv(): LLMProvider[] {
  const providers: LLMProvider[] = [];
  if (process.env.OPENCLAW_GATEWAY_TOKEN || process.env.OPENCLAW_GATEWAY_URL) {
    providers.push(createOpenClawProvider());
  }
  if (process.env.ANTHROPIC_API_KEY) {
    providers.push(createAnthropicProvider(process.env.ANTHROPIC_API_KEY));
  }
  if (process.env.OPENAI_API_KEY) {
    providers.push(
      createOpenAIProvider(process.env.OPENAI_API_KEY, {
        baseUrl: process.env.OPENAI_BASE_URL,
        model: process.env.OPENAI_MODEL,
      }),
    );
  }
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
    providers.push(
      createGeminiProvider(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY!, {
        model: process.env.GEMINI_MODEL,
      }),
    );
  }
  return providers;
}
