const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateArticleImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    // Step 1: Strict Validation using gemini-2.5-flash
    const validationPrompt = `You are a strict validator for a Sri Lankan history and heritage platform.
Does the following prompt describe a historic, ancient, heritage, or culturally significant concept suitable for a Sri Lankan history site?
If the prompt is about modern technology, modern vehicles, sci-fi, non-historic events, or anything clearly unrelated to history, reply with exactly 'NO'.
Otherwise, reply with exactly 'YES'.

Prompt to validate: "${prompt}"`;

    const validationResult = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: validationPrompt,
    });
    const validationText = validationResult.candidates[0].content.parts[0].text.trim().toUpperCase();

    if (validationText.includes('NO')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Prompt rejected: Image generation is strictly restricted to historic and heritage-related concepts.' 
      });
    }

    // Step 2: Generate Image using gemini-2.0-flash-preview-image-generation
    const imagePrompt = `Create a high-quality, historically accurate image of: ${prompt}. 
The image should look like a professional photograph or a detailed painting suitable for a heritage article.`;

    const imageResult = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image',
      contents: imagePrompt,
      config: {
        responseModalities: ['Text', 'Image'],
      },
    });

    // Extract image data from the response
    let imageData = null;
    let mimeType = 'image/png';

    if (imageResult.candidates && imageResult.candidates[0] && imageResult.candidates[0].content) {
      for (const part of imageResult.candidates[0].content.parts) {
        if (part.inlineData) {
          imageData = part.inlineData.data;
          mimeType = part.inlineData.mimeType || 'image/png';
          break;
        }
      }
    }

    if (!imageData) {
      return res.status(500).json({ 
        success: false, 
        message: 'Image generation did not return image data. Please try a different prompt.' 
      });
    }

    // Return base64 image as a data URI
    const dataUri = `data:${mimeType};base64,${imageData}`;

    res.status(200).json({
      success: true,
      data: dataUri,
      message: 'Image generated successfully'
    });

  } catch (error) {
    console.error('AI Image Generation Error:', error);
    // Handle specific limit errors gracefully
    if (error.message && error.message.includes('429')) {
       return res.status(429).json({ success: false, message: 'API Rate Limit exceeded or model not available on current plan.' });
    }
    res.status(500).json({ success: false, message: 'Failed to generate image', error: error.message });
  }
};

module.exports = {
  generateArticleImage
};
