import Vapi from "@vapi-ai/web";

let vapiInstance: Vapi | null = null;

export function getVapi(): Vapi {
  if (!vapiInstance) {
    vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);

    // Suppress Vapi's internal "Meeting has ended" console.error — it's expected behavior, not an error
    const origError = console.error;
    console.error = (...args: any[]) => {
      if (typeof args[0] === "string" && args[0].includes("Meeting has ended")) return;
      if (typeof args[0] === "string" && args[0].includes("Meeting ended")) return;
      origError.apply(console, args);
    };
  }
  return vapiInstance;
}

export interface InterviewAssistantConfig {
  category: string;
  systemPrompt: string;
  firstMessage: string;
}

export function buildAssistantConfig(config: InterviewAssistantConfig) {
  return {
    model: {
      provider: "openai" as const,
      model: "gpt-4o" as const,
      messages: [{ role: "system" as const, content: config.systemPrompt }],
    },
    voice: {
      provider: "11labs" as const,
      voiceId: "21m00Tcm4TlvDq8ikWAM",
    },
    firstMessage: config.firstMessage,
    transcriber: {
      provider: "deepgram" as const,
      model: "nova-2" as const,
      language: "en-US" as const,
    },
  };
}
