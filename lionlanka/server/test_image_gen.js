const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testImageGen() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:predict?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt: "A historic ancient temple in Sri Lanka" }],
        parameters: { sampleCount: 1 }
      })
    });
    
    if (!response.ok) {
        const errText = await response.text();
        console.error("Predict failed:", errText);
        
        // Try generateImages
        const response2 = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateImages?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: "A historic ancient temple in Sri Lanka",
            numberOfImages: 1
          })
        });
        const errText2 = await response2.text();
        console.log("generateImages result:", errText2);
    } else {
        const data = await response.json();
        console.log("Predict success:", Object.keys(data));
    }
  } catch (err) {
    console.error(err);
  }
}

testImageGen();
