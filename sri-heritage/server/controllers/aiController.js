const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateArticleImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    // Step 1: Strict Validation using gemini-3.5-flash
    const validationModel = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
    const validationPrompt = `You are a strict validator for a Sri Lankan history and heritage platform.
Does the following prompt describe a historic, ancient, heritage, or culturally significant concept suitable for a Sri Lankan history site?
If the prompt is about modern technology, modern vehicles, sci-fi, non-historic events, or anything clearly unrelated to history, reply with exactly 'NO'.
Otherwise, reply with exactly 'YES'.

Prompt to validate: "${prompt}"`;

    const validationResult = await validationModel.generateContent(validationPrompt);
    const validationText = validationResult.response.text().trim().toUpperCase();

    if (validationText.includes('NO')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Prompt rejected: Image generation is strictly restricted to historic and heritage-related concepts.' 
      });
    }

    // Step 2: Generate Image using gemini-3.1-flash-image
    const imageModel = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-image' });
    
    // We try generateContent since it's the supported method
    const imageResult = await imageModel.generateContent(prompt);
    
    // The model might return a markdown string with image URL, or base64. Let's send the text back.
    const output = imageResult.response.text();

    res.status(200).json({
      success: true,
      data: output,
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
