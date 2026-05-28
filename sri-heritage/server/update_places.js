const mongoose = require('mongoose');
const Place = require('./models/Place');
require('dotenv').config();

const placesData = [
  {
    name: 'Sigiriya',
    description: '<p><strong>Sigiriya</strong>, or Lion Rock, is an ancient rock fortress located in the northern Matale District near the town of Dambulla in the Central Province, Sri Lanka.</p><p>Rising nearly 200 meters above the surrounding jungle, this massive column of rock is one of Sri Lanka\'s most dramatic geological formations. Built by King Kasyapa (477 – 495 CE) as his new capital, it is renowned for its advanced urban planning, ancient frescoes, and the deeply polished <em>Mirror Wall</em>.</p><ul><li>Features one of the oldest landscaped gardens in the world.</li><li>Famous for the <em>Sigiriya Frescoes</em> depicting celestial maidens.</li><li>The summit holds the ruins of the royal palace.</li></ul>',
    historicalSignificance: '<p>Sigiriya represents a masterpiece of ancient urban planning, architecture, and art. It was a short-lived but highly sophisticated royal capital. After Kasyapa\'s death, it was transformed into a Buddhist monastery until the 14th century, showcasing the dynamic political and religious shifts in ancient Sri Lanka.</p>',
    visitingHours: '6:30 AM - 5:30 PM (Last entry at 5:00 PM)',
    entryFee: 'LKR 100 for Locals / $30 for Foreigners',
    timeline: [
      { year: '477 AD', event: 'King Kasyapa murders his father and flees to Sigiriya to build his impregnable fortress.' },
      { year: '495 AD', event: 'Kasyapa is defeated by his brother Moggallana; Sigiriya is handed over to Buddhist monks.' },
      { year: '1831', event: 'Rediscovered by British army major Jonathan Forbes.' },
      { year: '1982', event: 'Declared a UNESCO World Heritage Site.' }
    ],
    historicalPeriod: 'Anuradhapura Period'
  },
  {
    name: 'Anuradhapura',
    description: '<p><strong>Anuradhapura</strong> is one of the ancient capitals of Sri Lanka, famous for its well-preserved ruins of ancient Sri Lankan civilization.</p><p>Serving as the capital for over a millennium, it was the center of Theravada Buddhism and ancient political power. The sprawling city is dotted with massive bell-shaped stupas, ancient reservoirs (wewas), and beautifully carved stone monuments.</p>',
    historicalSignificance: '<p>It is the spiritual and historical heart of Sri Lanka. As the first established capital, it oversaw the introduction of Buddhism to the island. It houses the <strong>Jaya Sri Maha Bodhi</strong>, a sapling of the historical Bodhi tree under which the Buddha attained enlightenment.</p>',
    visitingHours: 'Open 24 hours (Museums: 8:00 AM - 5:00 PM)',
    entryFee: 'Free for Locals / $25 for Foreigners',
    timeline: [
      { year: '377 BC', event: 'Founded and established as the capital by King Pandukabhaya.' },
      { year: '250 BC', event: 'Buddhism is introduced by Arahant Mahinda.' },
      { year: '288 BC', event: 'The sacred Jaya Sri Maha Bodhi tree is planted.' },
      { year: '993 AD', event: 'City is abandoned following the invasion by the Chola Empire.' }
    ],
    historicalPeriod: 'Anuradhapura Period'
  },
  {
    name: 'Polonnaruwa',
    description: '<p><strong>Polonnaruwa</strong> is the second most ancient of Sri Lanka\'s kingdoms, taking over after the fall of Anuradhapura.</p><p>It features monumental ruins of the fabulous garden-city created by Parakramabahu I in the 12th century. The site includes monumental stupas, palaces, and the stunning <em>Gal Vihara</em>—a group of four colossal Buddha statues carved from a single granite boulder.</p>',
    historicalSignificance: '<p>Polonnaruwa represents the medieval golden age of Sri Lanka. Under King Parakramabahu I, the island saw an unprecedented era of agricultural prosperity, symbolized by the massive <strong>Parakrama Samudra</strong> (Sea of Parakrama) reservoir.</p>',
    visitingHours: '7:30 AM - 6:00 PM',
    entryFee: 'LKR 50 for Locals / $25 for Foreigners',
    timeline: [
      { year: '1070 AD', event: 'King Vijayabahu I drives out the Cholas and establishes Polonnaruwa as capital.' },
      { year: '1153 AD', event: 'Golden age begins under King Parakramabahu I.' },
      { year: '1215 AD', event: 'Kalinga Magha invades, leading to the kingdom\'s catastrophic decline.' }
    ],
    historicalPeriod: 'Polonnaruwa Period'
  },
  {
    name: 'Temple of the Tooth',
    description: '<p>The <strong>Temple of the Sacred Tooth Relic</strong> (Sri Dalada Maligawa) is a Buddhist temple in the city of Kandy.</p><p>Located in the royal palace complex of the former Kingdom of Kandy, it houses the relic of the tooth of the Buddha. The architecture features striking golden roofs, intricate wood carvings, and beautiful wall paintings representing Kandyan art.</p>',
    historicalSignificance: '<p>The tooth relic has historically played a crucial role in local politics, as it was believed that whoever held the relic held the divine right to rule the country. It remains the most sacred site for Buddhists globally.</p>',
    visitingHours: '5:30 AM - 8:00 PM',
    entryFee: 'Free for Locals / LKR 2000 for Foreigners',
    timeline: [
      { year: '1595', event: 'Relic brought to Kandy by King Vimaladharmasuriya I.' },
      { year: '1687', event: 'Current temple structure vastly expanded by King Vira Narendra Sinha.' },
      { year: '1988', event: 'Recognized as a UNESCO World Heritage site.' }
    ],
    historicalPeriod: 'Kandyan Period'
  },
  {
    name: 'Dambulla Cave Temple',
    description: '<p>Also known as the <strong>Golden Temple of Dambulla</strong>, this is the largest and best-preserved cave temple complex in Sri Lanka.</p><p>The rock towers 160 meters over the surrounding plains. The complex consists of five main caves containing statues and paintings related to Gautama Buddha and his life. There are a total of 153 Buddha statues, three statues of Sri Lankan kings, and four statues of gods and goddesses.</p>',
    historicalSignificance: '<p>The caves served as a refuge for King Valagamba during a 14-year exile. Upon reclaiming his throne, he converted the caves into a magnificent temple out of gratitude. The ceiling murals date back over 2,000 years, preserving ancient Sinhalese artistry.</p>',
    visitingHours: '7:00 AM - 7:00 PM (Ticket counter closes at 5:00 PM)',
    entryFee: 'Free for Locals / LKR 2000 for Foreigners',
    timeline: [
      { year: '1st C BC', event: 'King Valagamba seeks refuge and later converts caves into a temple.' },
      { year: '1190 AD', event: 'King Nissanka Malla gilds 73 statues.' },
      { year: '18th C', event: 'Extensive restoration by the Kandyan Kings.' }
    ],
    historicalPeriod: 'Anuradhapura Period'
  },
  {
    name: 'Galle Fort',
    description: '<p><strong>Galle Fort</strong> is an extraordinary historical and architectural monument located on the southwest coast of Sri Lanka.</p><p>Originally built by the Portuguese in 1588, it was extensively fortified by the Dutch during the 17th century. Today, its cobblestone streets are lined with Dutch-colonial buildings, boutique shops, and vibrant cafes, making it a living museum.</p>',
    historicalSignificance: '<p>Galle Fort is an outstanding example of an urban ensemble that illustrates the seamless integration of European architectural styles and South Asian traditions. It survived the 2004 tsunami largely intact, a testament to its robust Dutch engineering.</p>',
    visitingHours: 'Open 24 hours (Shops typically 9:00 AM - 8:00 PM)',
    entryFee: 'Free Entry',
    timeline: [
      { year: '1588', event: 'Initially built as a small stockade by the Portuguese.' },
      { year: '1649', event: 'Captured and heavily fortified by the Dutch East India Company.' },
      { year: '1796', event: 'Peacefully handed over to the British.' }
    ],
    historicalPeriod: 'Colonial Period'
  },
  {
    name: 'Yapahuwa',
    description: '<p><strong>Yapahuwa</strong> is a massive rock fortress and palace situated in the North Western Province.</p><p>Rising abruptly from the plains, this 90-meter high rock boulder was built to be a military stronghold against Dravidian invasions. Its most famous feature is the incredibly steep and intricately carved ornamental stone staircase leading up to the tooth relic shrine.</p>',
    historicalSignificance: '<p>It served as the temporary capital of Sri Lanka in the late 13th century. King Bhuvanekabahu I transferred the sacred tooth relic here for safekeeping after the fall of Polonnaruwa.</p>',
    visitingHours: '8:00 AM - 5:00 PM',
    entryFee: 'LKR 50 for Locals / $3 for Foreigners',
    timeline: [
      { year: '1273', event: 'King Bhuvanekabahu I establishes Yapahuwa as the capital.' },
      { year: '1284', event: 'The fortress falls to the Pandya invaders and is subsequently abandoned.' }
    ],
    historicalPeriod: 'Transitional Period'
  },
  {
    name: 'Ritigala',
    description: '<p><strong>Ritigala</strong> is an ancient Buddhist monastery hidden deep within a strict nature reserve.</p><p>Unlike the elaborate stupas of Anuradhapura, the ruins at Ritigala are austere and simple, belonging to the ascetic <em>Pansukulika</em> (rag-robe) monks. The site features beautiful stone-paved paths, ancient stone bridges, and monastic bathing pools surrounded by unique microclimate flora.</p>',
    historicalSignificance: '<p>It is one of the few places showcasing the extreme ascetic branch of ancient Sri Lankan Buddhism. The mountain itself is steeped in mythology, believed to be a chunk of the Himalayas dropped by the monkey god Hanuman.</p>',
    visitingHours: '7:00 AM - 4:00 PM',
    entryFee: 'LKR 50 for Locals / $3 for Foreigners',
    timeline: [
      { year: '3rd C BC', event: 'First monastic settlements established.' },
      { year: '9th C AD', event: 'Significantly expanded by King Sena I for the Pansukulika monks.' }
    ],
    historicalPeriod: 'Anuradhapura Period'
  },
  {
    name: 'Adam\'s Peak',
    description: '<p><strong>Adam\'s Peak</strong> (Sri Pada) is a towering, 2,243-meter conical mountain in the central highlands.</p><p>The mountain is famous for the <em>Sri Pada</em> (sacred footprint), a 1.8-meter rock formation near the summit. The grueling night climb to reach the peak before dawn is a rite of passage for many, rewarded by a stunning triangular shadow cast by the mountain at sunrise.</p>',
    historicalSignificance: '<p>It is uniquely revered by multiple major religions: Buddhists believe it is the footprint of the Buddha, Hindus attribute it to Shiva, while Muslims and Christians believe it is the footprint of Adam or St. Thomas.</p>',
    visitingHours: 'Best climbed during Pilgrimage Season (December to May) starting at 2:00 AM.',
    entryFee: 'Free Entry',
    timeline: [
      { year: '1st C BC', event: 'Recognized as the footprint of the Buddha.' },
      { year: '14th C', event: 'Visited and documented by the famous Moroccan explorer Ibn Battuta.' }
    ],
    historicalPeriod: 'Prehistoric'
  },
  {
    name: 'Ruwanwelisaya',
    description: '<p>The <strong>Ruwanwelisaya</strong> is a majestic, hemispherical stupa located in Anuradhapura.</p><p>Gleaming white against the sky, it was one of the tallest monuments in the ancient world, standing at 103 meters (338 feet) originally. It is surrounded by an imposing wall adorned with hundreds of carved elephants that seemingly support the structure.</p>',
    historicalSignificance: '<p>Built by King Dutugemunu after his monumental victory unifying Sri Lanka, it is considered the most sacred of the ancient stupas as it is believed to enshrine a significant portion of the Buddha\'s relics.</p>',
    visitingHours: 'Open 24 hours',
    entryFee: 'Included in Anuradhapura City Ticket',
    timeline: [
      { year: '140 BC', event: 'Construction commenced by King Dutugemunu.' },
      { year: '137 BC', event: 'Completed by King Saddhatissa after Dutugemunu\'s death.' },
      { year: '1940', event: 'Major modern restoration completed, culminating in the crowning of the pinnacle.' }
    ],
    historicalPeriod: 'Anuradhapura Period'
  },
  {
    name: 'Kelaniya Raja Maha Vihara',
    description: '<p>The <strong>Kelaniya Temple</strong> is a deeply venerated Buddhist temple located on the banks of the Kelani River near Colombo.</p><p>The temple is renowned for its magnificent, intricate sculptures and its modern murals by native artist Solias Mendis, which depict the history of Buddhism in Sri Lanka rather than just the life of the Buddha.</p>',
    historicalSignificance: '<p>According to the Mahavamsa, the Buddha visited Kelaniya on his third and final visit to Sri Lanka, eight years after his enlightenment. This makes it one of the holiest sites for Sri Lankan Buddhists.</p>',
    visitingHours: 'Open 24 hours',
    entryFee: 'Free Entry',
    timeline: [
      { year: '500 BC', event: 'Believed to be the date of the Buddha\'s visit.' },
      { year: '1510', event: 'Destroyed by the Portuguese.' },
      { year: '1927', event: 'Major restoration funded by Helena Wijewardana, featuring art by Solias Mendis.' }
    ],
    historicalPeriod: 'Transitional Period'
  },
  {
    name: 'Nallur Kandaswamy Kovil',
    description: '<p><strong>Nallur Kandaswamy Kovil</strong> is one of the most prominent Hindu temples in Sri Lanka, located in Jaffna.</p><p>Dedicated to Lord Murugan, the temple is characterized by its grand, golden gopuram (tower), vast courtyards, and strict adherence to traditional Hindu rituals. During its annual festival, thousands of devotees gather in a massive, vibrant display of faith.</p>',
    historicalSignificance: '<p>The temple is the socio-cultural heart of Sri Lankan Tamil Hinduism. Though the original structure was destroyed by colonial powers, its resilience represents the endurance of Hindu culture in the north.</p>',
    visitingHours: '4:30 AM - 5:00 PM (Dress codes apply)',
    entryFee: 'Free Entry',
    timeline: [
      { year: '948 AD', event: 'Original temple built by Bhuvanekabahu I\'s chief minister.' },
      { year: '1624', event: 'Destroyed by the Portuguese.' },
      { year: '1749', event: 'Current temple structure built during the Dutch period.' }
    ],
    historicalPeriod: 'Transitional Period'
  },
  {
    name: 'Jami Ul-Alfar Mosque',
    description: '<p>The <strong>Jami Ul-Alfar Mosque</strong>, popularly known as the Red Mosque, is a historic mosque in Colombo.</p><p>Its striking candy-striped red and white exterior, towering minarets, and unique hybrid architecture (blending Indo-Islamic, Gothic, and Neoclassical styles) make it an iconic architectural marvel in the bustling streets of Pettah.</p>',
    historicalSignificance: '<p>Built by the thriving Indian Muslim merchant community of Pettah, it served as a reliable landmark for sailors approaching Colombo port in the early 20th century due to its vivid colors.</p>',
    visitingHours: 'Open to visitors outside of prayer times.',
    entryFee: 'Free Entry',
    timeline: [
      { year: '1908', event: 'Construction commenced.' },
      { year: '1909', event: 'Completed by architect Habibu Labbe Saibu Labbe.' }
    ],
    historicalPeriod: 'Colonial Period'
  },
  {
    name: 'Mihintale',
    description: '<p><strong>Mihintale</strong> is a mountain peak near Anuradhapura, marked by ancient rock stairways and stupas.</p><p>To reach the summit, pilgrims climb an iconic stairway of 1,840 granite steps shaded by frangipani trees. The summit contains the Ambasthala Dagoba and provides sweeping, panoramic views of the surrounding plains.</p>',
    historicalSignificance: '<p>Mihintale is universally recognized as the cradle of Buddhism in Sri Lanka. It is the site where the Buddhist monk Mahinda famously encountered King Devanampiyatissa in 247 BC, leading to the island\'s mass conversion to Buddhism.</p>',
    visitingHours: '6:00 AM - 6:00 PM',
    entryFee: 'LKR 50 for Locals / $5 for Foreigners',
    timeline: [
      { year: '247 BC', event: 'Arrival of Arahant Mahinda; Buddhism introduced to Sri Lanka.' },
      { year: '1st C AD', event: 'Development of ancient hospitals and monastic complexes on the hill.' }
    ],
    historicalPeriod: 'Anuradhapura Period'
  },
  {
    name: 'Aukana Buddha Statue',
    description: '<p>The <strong>Aukana Buddha</strong> is a colossal standing statue of the Buddha carved directly out of a solid granite rock face.</p><p>Standing exactly 12 meters (39 feet) tall, the statue is renowned for the precision of its carving, particularly the meticulously draped robes that appear almost translucent. The Buddha is depicted in the <em>Asisa Mudra</em> (gesture of blessing).</p>',
    historicalSignificance: '<p>It is considered one of the finest examples of ancient Sri Lankan stone sculpture, perfectly combining spiritual serenity with monumental scale. It was carved during the reign of King Dhatusena.</p>',
    visitingHours: '7:00 AM - 5:30 PM',
    entryFee: 'LKR 50 for Locals / $5 for Foreigners',
    timeline: [
      { year: '5th C AD', event: 'Statue carved under the patronage of King Dhatusena.' }
    ],
    historicalPeriod: 'Anuradhapura Period'
  },
  {
    name: 'Koneswaram Temple',
    description: '<p><strong>Koneswaram Temple</strong> (Thirukonamalai Konesar Temple) is a classical-medieval Hindu temple complex perched atop Swami Rock in Trincomalee.</p><p>Overlooking the breathtaking natural harbor of Trincomalee and the Indian Ocean, the temple is surrounded by dramatic cliffs. It features vibrant Dravidian architecture and is dedicated to Lord Shiva.</p>',
    historicalSignificance: '<p>It is one of the <em>Pancha Ishwarams</em> (five major coastal shrines to Shiva) in Sri Lanka. Historically known as the "Temple of a Thousand Pillars," it was one of the richest temples in Asia before colonial destruction.</p>',
    visitingHours: '6:00 AM - 1:00 PM / 4:00 PM - 7:00 PM',
    entryFee: 'Free Entry',
    timeline: [
      { year: '400 BC', event: 'Early settlement and worship noted in ancient literature.' },
      { year: '1622', event: 'Original grand temple destroyed and pushed into the sea by the Portuguese.' },
      { year: '1952', event: 'Temple ruins recovered from the sea floor; modern temple rebuilt.' }
    ],
    historicalPeriod: 'Prehistoric'
  },
  {
    name: 'Kataragama Temple',
    description: '<p><strong>Ruhunu Maha Kataragama Devalaya</strong> is a sprawling religious complex situated in the deep south.</p><p>Unlike heavily adorned temples, the main shrine is unpretentious, lacking elaborate statues. Worship relies on deep faith and mystery. During the annual Esala festival, the complex comes alive with fire-walkers, dancers, and intense acts of devotion.</p>',
    historicalSignificance: '<p>Kataragama is one of the rarest religious sites in the world where Buddhists, Hindus, Muslims, and the indigenous Vedda people all come together in peace to worship the deity Skanda-Murukan.</p>',
    visitingHours: 'Open during specific Pooja times (typically 4:30 AM, 10:30 AM, 6:30 PM).',
    entryFee: 'Free Entry',
    timeline: [
      { year: '2nd C BC', event: 'Early origins of the shrine linked to King Dutugemunu\'s vow.' }
    ],
    historicalPeriod: 'Anuradhapura Period'
  },
  {
    name: 'Colombo National Museum',
    description: '<p>The <strong>National Museum of Colombo</strong> is the premier cultural institution in Sri Lanka, housed in a magnificent white colonial-era building.</p><p>The museum holds an expansive collection covering the island\'s natural and cultural history. Its pristine halls display prehistoric artifacts, ancient bronzes, demon masks, and exquisite royal regalia.</p>',
    historicalSignificance: '<p>The museum preserves the ultimate symbols of Sri Lanka\'s pre-colonial sovereignty, most notably the glittering golden crown and majestic throne of the last Kings of Kandy.</p>',
    visitingHours: '9:00 AM - 5:00 PM (Closed on public holidays)',
    entryFee: 'LKR 100 for Locals / LKR 1000 for Foreigners',
    timeline: [
      { year: '1877', event: 'Museum established by British Governor Sir William Henry Gregory.' },
      { year: '1982', event: 'Important royal artifacts repatriated from the British monarchy.' }
    ],
    historicalPeriod: 'Colonial Period'
  },
  {
    name: 'Independence Memorial Hall',
    description: '<p><strong>Independence Memorial Hall</strong> is a sweeping national monument situated in Independence Square, Colombo.</p><p>Its architecture heavily borrows from the royal audience hall (Magul Maduwa) of the Kingdom of Kandy, featuring towering concrete pillars decorated with traditional Sinhalese motifs and guarded by rows of stone lions.</p>',
    historicalSignificance: '<p>The hall was built to commemorate the exact location where the ceremony marking Sri Lanka\'s independence from British colonial rule took place in 1948, symbolizing the rebirth of a sovereign nation.</p>',
    visitingHours: 'Open 24 hours (Museum underneath: 9:00 AM - 5:00 PM)',
    entryFee: 'Free Entry',
    timeline: [
      { year: '1948', event: 'Ceylon gains independence from British Rule.' },
      { year: '1953', event: 'Construction of the memorial hall completed.' }
    ],
    historicalPeriod: 'Modern Era'
  },
  {
    name: 'St. Anthony\'s Shrine, Kochchikade',
    description: '<p><strong>St. Anthony\'s Shrine</strong> is a Roman Catholic church located in Kochchikade, Colombo.</p><p>The church facade boasts striking classical architecture. Inside, it houses a small piece of the incorrupt tongue of St. Anthony of Padua. On Tuesdays, the church overflows with devotees seeking miracles.</p>',
    historicalSignificance: '<p>Originating as a tiny mud shrine built secretly by a priest during the Dutch persecution of Catholics, it grew into one of the country\'s most revered sites, visited by people of all faiths seeking blessings.</p>',
    visitingHours: 'Open 24 hours',
    entryFee: 'Free Entry',
    timeline: [
      { year: '1740', event: 'Fr. Antonio builds a small secret mud shrine.' },
      { year: '1834', event: 'A larger, official church structure is built.' },
      { year: '2019', event: 'Tragically attacked during the Easter Sunday bombings, later fully restored.' }
    ],
    historicalPeriod: 'Colonial Period'
  }
];

const updatePlaces = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lionlanka');
    console.log('Connected to MongoDB.');

    for (let place of placesData) {
      const updated = await Place.findOneAndUpdate(
        { name: place.name },
        { 
          $set: {
            description: place.description,
            historicalSignificance: place.historicalSignificance,
            visitingHours: place.visitingHours,
            entryFee: place.entryFee,
            timeline: place.timeline,
            historicalPeriod: place.historicalPeriod
          }
        },
        { new: true } // Don't upsert, just update if exists
      );

      if (updated) {
        console.log(`Updated: ${place.name}`);
      } else {
        console.log(`Place not found in DB: ${place.name}`);
      }
    }

    console.log('Finished updating places.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updatePlaces();
