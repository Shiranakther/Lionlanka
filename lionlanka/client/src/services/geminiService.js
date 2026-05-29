const SYSTEM_PROMPT = `You are Lion Lanka AI, a specialized historical assistant for the LionLanka platform.
Your ONLY purpose is to answer questions about Sri Lankan history, culture, archaeology,
ancient kingdoms, kings, historical places, traditions, mythology, and heritage.

STRICT RULES:
1. ONLY answer questions related to Sri Lankan history and culture.
2. If a question is NOT about Sri Lankan history/culture/heritage, respond EXACTLY:
   'I can only help with questions about Sri Lankan history and culture. Please ask me
   about ancient kingdoms, historical places, kings, or cultural heritage of Sri Lanka.'
3. Always structure answers clearly with context: time period, historical significance.
4. Use Markdown to format your response beautifully (use bolding, headers, lists).
5. If discussing a specific historical place, output a MAP tag ONCE: [MAP: lat, lng, Place Name] (e.g., [MAP: 7.957, 80.7603, Sigiriya]).
6. If discussing MULTIPLE places, output a MAPS tag: [MAPS: lat1,lng1,Name1 | lat2,lng2,Name2].
7. If an image would greatly enhance your explanation, output an IMAGE tag with the exact Wikipedia article title for that place/topic: [IMAGE: Sigiriya] or [IMAGE: Ruwanwelisaya].
8. End EVERY response with exactly 3 related short follow-up questions the user might ask, formatted as: [FOLLOW: Question 1? | Question 2? | Question 3?]
9. Use a respectful, educational tone.
10. If asked about your identity, say you are Lion Lanka AI by LionLanka.`

export const streamFromGemini = async (userMessage, history, onChunk) => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
    onChunk('Heritage AI is not configured yet. Please add your Gemini API key to the .env file.')
    return
  }

  try {
    const formattedHistory = (history || []).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content || ' ' }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:streamGenerateContent?alt=sse&key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: [
            ...formattedHistory,
            {
              role: 'user',
              parts: [{ text: userMessage }]
            }
          ],
          generationConfig: {
            maxOutputTokens: 8192,
            temperature: 0.4,
            topP: 0.85,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      
      let boundary = buffer.indexOf('\n')
      while (boundary !== -1) {
        const line = buffer.slice(0, boundary).trim()
        buffer = buffer.slice(boundary + 1)
        
        if (line.startsWith('data: ')) {
          try {
            const dataStr = line.slice(6)
            if (dataStr !== '[DONE]') {
              const data = JSON.parse(dataStr)
              const text = data.candidates?.[0]?.content?.parts?.[0]?.text
              if (text) onChunk(text)
            }
          } catch (e) {
            // Ignore partial parse errors
          }
        }
        boundary = buffer.indexOf('\n')
      }
    }
  } catch (error) {
    console.error('Gemini API Error:', error)
    onChunk('\n\n[Error: Sorry, I encountered an issue. Please try again.]')
  }
}
