const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const prompt = "A majestic ancient temple in Sri Lanka at sunset";
    console.log(`Prompt: "${prompt}"\n`);

    console.log("Testing Step 1: Validation with gemini-3.5-flash...");
    const validationModel = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
    const validationPrompt = `You are a strict validator for a Sri Lankan history and heritage platform.
Does the following prompt describe a historic, ancient, heritage, or culturally significant concept suitable for a Sri Lankan history site?
If the prompt is about modern technology, modern vehicles, sci-fi, non-historic events, or anything clearly unrelated to history, reply with exactly 'NO'.
Otherwise, reply with exactly 'YES'.

Prompt to validate: "${prompt}"`;

    const validationResult = await validationModel.generateContent(validationPrompt);
    console.log("Validation Result:", validationResult.response.text().trim());
    
    console.log("\nTesting Step 2: Image Generation with gemini-3.1-flash-image...");
    const imageModel = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-image' });
    const imageResult = await imageModel.generateContent(prompt);
    
    const output = imageResult.response.text();
    console.log("Image Generation output length:", output.length);
    console.log("Image Generation output preview:", output.substring(0, 100) + "...");
    
  } catch(err) {
    console.error("Test failed:", err.message);
    if(err.status) console.error("Status:", err.status);
  }
}
test();
