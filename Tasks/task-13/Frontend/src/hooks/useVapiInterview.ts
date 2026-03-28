"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getVapi, buildAssistantConfig } from "@/lib/vapi";
import type { InterviewCategory } from "@/constants/categories";

export type CallStatus = "idle" | "connecting" | "active" | "ended";

interface TranscriptEntry {
  role: "assistant" | "user";
  text: string;
  timestamp: number;
}

export function useVapiInterview(category: InterviewCategory | undefined) {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startInterview = useCallback(async () => {
    if (!category) return;
    const vapi = getVapi();
    setStatus("connecting");
    setTranscript([]);
    setDuration(0);

    try {
      const config = buildAssistantConfig({
        category: category.id,
        systemPrompt: category.systemPrompt,
        firstMessage: category.firstMessage,
      });
      await vapi.start(config as any);
    } catch {
      setStatus("idle");
    }
  }, [category]);

  const endInterview = useCallback(() => {
    const vapi = getVapi();
    vapi.stop();
    setStatus("ended");
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const toggleMute = useCallback(() => {
    const vapi = getVapi();
    const next = !isMuted;
    vapi.setMuted(next);
    setIsMuted(next);
  }, [isMuted]);

  useEffect(() => {
    const vapi = getVapi();

    const onCallStart = () => {
      setStatus("active");
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    };

    const onCallEnd = () => {
      setStatus("ended");
      if (timerRef.current) clearInterval(timerRef.current);
    };

    const onMessage = (msg: any) => {
      if (msg.type === "transcript" && msg.transcriptType === "final") {
        setTranscript((prev) => [
          ...prev,
          { role: msg.role, text: msg.transcript, timestamp: Date.now() },
        ]);
      }
    };

    const onError = () => {
      setStatus("ended");
      if (timerRef.current) clearInterval(timerRef.current);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const structuredTranscript = (() => {
    const pairs: { question: string; answer: string }[] = [];
    for (let i = 0; i < transcript.length; i++) {
      if (transcript[i].role === "assistant") {
        const answer = transcript[i + 1]?.role === "user" ? transcript[i + 1].text : "";
        pairs.push({ question: transcript[i].text, answer });
        if (answer) i++;
      }
    }
    return pairs;
  })();

  return {
    status,
    transcript,
    structuredTranscript,
    isMuted,
    duration,
    startInterview,
    endInterview,
    toggleMute,
  };
}
