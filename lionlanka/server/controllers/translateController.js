const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const translateText = async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    
    if (!text || !targetLanguage) {
      return res.status(400).json({ success: false, message: 'Text and targetLanguage are required' });
    }

    const prompt = `Translate the following HTML content into ${targetLanguage}. 
    CRITICAL INSTRUCTIONS:
    1. Preserve all HTML tags, structure, and attributes exactly as they are.
    2. Only translate the human-readable text inside the tags.
    3. Do not add any markdown formatting like \`\`\`html or \`\`\` to the output. Just return the raw HTML string.
    4. Keep the tone descriptive and historical.
    
    Content to translate:
    ${text}`;

    const result = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });
    
    let translatedText = '';
    if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        translatedText = result.candidates[0].content.parts[0].text;
    } else {
        throw new Error("No text returned from Gemini API");
    }
    
    // Clean up any markdown blocks if the model accidentally included them
    translatedText = translatedText.replace(/^```html\n?/, '').replace(/^```\n?/, '').replace(/```$/, '');
    
    res.status(200).json({
      success: true,
      translatedText: translatedText.trim()
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ success: false, message: 'Failed to translate content' });
  }
};

module.exports = {
  translateText
};
