const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testImageGen() {
  try {
    const response2 = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateImages?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: "A historic ancient temple in Sri Lanka",
        numberOfImages: 1
      })
    });
    
    const text = await response2.text();
    console.log("generateImages status:", response2.status);
    console.log("generateImages result text length:", text.length);
    console.log("generateImages result:", text.substring(0, 500));
  } catch (err) {
    console.error(err);
  }
}

testImageGen();
