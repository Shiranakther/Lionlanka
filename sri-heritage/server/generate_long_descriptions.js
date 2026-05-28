const mongoose = require('mongoose');
const Place = require('./models/Place');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Using gemini-pro for text generation
const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

async function generateDescription(placeName) {
  const prompt = `Write a highly detailed, deeply engaging historical and architectural description for the Sri Lankan heritage site: ${placeName}.
  
  CRITICAL RULES:
  1. The description MUST be at least 550 words long. Dive deep into the history, folklore, architectural layout, and cultural significance to reach this length.
  2. Use well-separated paragraphs wrapped in HTML <p> tags.
  3. You may use <strong> or <em> tags for emphasis, and <ul>/<li> for lists if relevant.
  4. DO NOT use ANY em dashes or en dashes anywhere in the text. Use commas, semicolons, or parentheses instead.
  5. DO NOT include a title or main header (like <h1>). Just return the raw HTML content.
  6. DO NOT use markdown code blocks like \`\`\`html. Return ONLY the raw HTML string.
  
  Write the content now:`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/^```html\n?/, '').replace(/^```\n?/, '').replace(/```$/, '');
    return text.trim();
  } catch (err) {
    console.error(`Failed for ${placeName}:`, err.message);
    return null;
  }
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lionlanka');
    console.log('Connected to MongoDB.');
    
    const places = await Place.find({});
    console.log(`Found ${places.length} places. Starting generation...`);
    
    for (let place of places) {
      console.log(`Generating 500+ word description for ${place.name}...`);
      const newDescription = await generateDescription(place.name);
      
      if (newDescription) {
        place.description = newDescription;
        await place.save();
        console.log(`✔ Updated ${place.name} successfully.`);
      } else {
        console.log(`✖ Skipped ${place.name} due to error.`);
      }
      
      // Sleep for 2 seconds to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('Finished updating all places!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
