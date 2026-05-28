const mongoose = require('mongoose');
const Place = require('./models/Place');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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
    
    // Find places with description length < 2000 chars (the old descriptions were ~500 chars)
    const places = await Place.find({});
    const placesToUpdate = places.filter(p => p.description && p.description.length < 2000);
    
    console.log(`Found ${placesToUpdate.length} places left to generate.`);
    
    for (let place of placesToUpdate) {
      console.log(`Generating for ${place.name}...`);
      const newDescription = await generateDescription(place.name);
      
      if (newDescription) {
        place.description = newDescription;
        await place.save();
        console.log(`✔ Updated ${place.name} successfully.`);
      } else {
        console.log(`✖ Failed again.`);
      }
      
      // Delay to respect RPM limit
      await new Promise(resolve => setTimeout(resolve, 8000));
    }
    
    console.log('Finished updating missing places!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
