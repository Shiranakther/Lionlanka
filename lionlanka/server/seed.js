require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Article = require('./models/Article');
const Place = require('./models/Place');
const Chat = require('./models/Chat');
const SavedItem = require('./models/SavedItem');
const SiteConfig = require('./models/SiteConfig');

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lionlanka');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany();
    await Article.deleteMany();
    await Place.deleteMany();
    await Chat.deleteMany();
    await SavedItem.deleteMany();
    await SiteConfig.deleteMany();

    console.log('Creating admin user...');
    const adminUser = await User.create({
      name: 'Admin',
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('Creating places...');
    const places = [
      {
        name: 'Sigiriya',
        description: 'An ancient rock fortress and palace ruin situated in the central Matale District of Sri Lanka. Built by King Kasyapa (477 – 495 CE), it is renowned for its ancient frescoes, the Mirror Wall, and the Lion Gate.',
        historicalSignificance: 'Capital and fortress of King Kasyapa. A masterpiece of ancient urban planning, architecture, and art.',
        location: { province: 'Central Province', coordinates: { lat: 7.957, lng: 80.7603 } },
        category: 'Ancient City',
        images: ['https://images.unsplash.com/photo-1588522906803-c0032e6ee547?w=800&q=80'],
        timeline: [
          { year: '477 AD', event: 'King Kasyapa builds the fortress and palace.' },
          { year: '495 AD', event: 'Kasyapa is defeated; Sigiriya becomes a Buddhist monastery.' },
          { year: '1831', event: 'Discovered by British army major Jonathan Forbes.' }
        ]
      },
      {
        name: 'Anuradhapura',
        description: 'One of the ancient capitals of Sri Lanka, famous for its well-preserved ruins of ancient Sri Lankan civilization. It was the center of Theravada Buddhism for many centuries.',
        historicalSignificance: 'First ancient capital of Sri Lanka, home to the sacred Jaya Sri Maha Bodhi and magnificent stupas like Ruwanwelisaya.',
        location: { province: 'North Central Province', coordinates: { lat: 8.3114, lng: 80.4037 } },
        category: 'Ancient City',
        images: ['https://images.unsplash.com/photo-1625736467333-875fba189a01?w=800&q=80'],
        timeline: [
          { year: '377 BC', event: 'Founded by King Pandukabhaya.' },
          { year: '250 BC', event: 'Buddhism introduced to Sri Lanka.' },
          { year: '993 AD', event: 'City abandoned after Chola invasion.' }
        ]
      },
      {
        name: 'Polonnaruwa',
        description: 'The second most ancient of Sri Lanka\'s kingdoms. It features monumental ruins of the fabulous garden-city created by Parakramabahu I in the 12th century.',
        historicalSignificance: 'Capital after the fall of Anuradhapura. Known for exceptional irrigation systems and the Gal Vihara rock sculptures.',
        location: { province: 'North Central Province', coordinates: { lat: 7.9403, lng: 81.0188 } },
        category: 'Ancient City',
        images: ['https://images.unsplash.com/photo-1598425251662-790f9b6b7979?w=800&q=80'],
        timeline: [
          { year: '1070 AD', event: 'King Vijayabahu I establishes Polonnaruwa as capital.' },
          { year: '1153 AD', event: 'Golden age under King Parakramabahu I.' },
          { year: '1215 AD', event: 'Kalinga Magha invades, leading to the kingdom\'s decline.' }
        ]
      },
      {
        name: 'Temple of the Tooth',
        description: 'Sri Dalada Maligawa, or the Temple of the Sacred Tooth Relic, is a Buddhist temple in the city of Kandy, Sri Lanka. It is located in the royal palace complex of the former Kingdom of Kandy, which houses the relic of the tooth of the Buddha.',
        historicalSignificance: 'Houses the most important Buddhist relic in Sri Lanka. The relic has played an important role in local politics since ancient times.',
        location: { province: 'Central Province', coordinates: { lat: 7.2936, lng: 80.6413 } },
        category: 'Temple',
        images: ['https://images.unsplash.com/photo-1598285516766-3d7110f0322d?w=800&q=80'],
        timeline: [
          { year: '1595', event: 'Relic brought to Kandy by King Vimaladharmasuriya I.' },
          { year: '1815', event: 'Kandyan Convention signed, ending the kingdom.' }
        ]
      },
      {
        name: 'Dambulla Cave Temple',
        description: 'Also known as the Golden Temple of Dambulla, it is a World Heritage Site (1991) in Sri Lanka, situated in the central part of the country. It is the largest and best-preserved cave temple complex in Sri Lanka.',
        historicalSignificance: 'Contains ancient Buddhist murals and statues dating back to the 1st century BC.',
        location: { province: 'Central Province', coordinates: { lat: 7.8567, lng: 80.6496 } },
        category: 'Temple',
        images: ['https://images.unsplash.com/photo-1627993077309-84724cb1c34a?w=800&q=80'],
        timeline: [
          { year: '1st C BC', event: 'King Valagamba seeks refuge and converts caves into a temple.' },
          { year: '1190 AD', event: 'King Nissanka Malla gilds 73 statues.' }
        ]
      },
      {
        name: 'Galle Fort',
        description: 'Galle Fort, in the Bay of Galle on the south west coast of Sri Lanka, was built first in 1588 by the Portuguese, then extensively fortified by the Dutch during the 17th century.',
        historicalSignificance: 'An outstanding example of an urban ensemble which illustrates the interaction of European architecture and South Asian traditions.',
        location: { province: 'Southern Province', coordinates: { lat: 6.0261, lng: 80.2170 } },
        category: 'Fortress',
        images: ['https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80'],
        timeline: [
          { year: '1588', event: 'Initially built by the Portuguese.' },
          { year: '1649', event: 'Fortified by the Dutch.' },
          { year: '1796', event: 'Taken over by the British.' }
        ]
      },
      {
        name: 'Yapahuwa',
        description: 'Yapahuwa is a rock fortress and palace situated in the North Western Province of Sri Lanka. It served as the capital of Sri Lanka in the latter part of the 13th century.',
        historicalSignificance: 'Served as a temporary capital and housed the sacred tooth relic after the fall of Polonnaruwa.',
        location: { province: 'North Western Province', coordinates: { lat: 7.7667, lng: 80.3000 } },
        category: 'Fortress',
        images: ['https://images.unsplash.com/photo-1550974868-f99a804f5e71?w=800&q=80'],
        timeline: [
          { year: '1273', event: 'King Bhuvanekabahu I establishes capital.' },
          { year: '1284', event: 'Abandoned after Pandya invasion.' }
        ]
      },
      {
        name: 'Ritigala',
        description: 'Ritigala is an ancient Buddhist monastery and mountain in Sri Lanka. The ruins and rock inscriptions of the monastery date back to 1st century BCE.',
        historicalSignificance: 'A strict nature reserve housing unique flora and ancient monastic ruins of the Pansukulika monks.',
        location: { province: 'North Central Province', coordinates: { lat: 8.1167, lng: 80.6500 } },
        category: 'Ancient City',
        images: ['https://images.unsplash.com/photo-1582647509711-c8aa8a8b54b6?w=800&q=80'],
        timeline: [
          { year: '3rd C BC', event: 'Early monastic settlements.' },
          { year: '9th C AD', event: 'Developed by King Sena I.' }
        ]
      },
      {
        name: 'Adam\'s Peak',
        description: 'Adam\'s Peak is a 2,243 m (7,359 ft) tall conical mountain located in central Sri Lanka. It is well known for the Sri Pada, i.e., "sacred footprint", a 1.8 m rock formation near the summit.',
        historicalSignificance: 'A sacred pilgrimage site for Buddhists, Hindus, Muslims, and Christians alike for centuries.',
        location: { province: 'Central Province', coordinates: { lat: 6.8096, lng: 80.4994 } },
        category: 'Natural Heritage',
        images: ['https://images.unsplash.com/photo-1579975096649-e7631ce581aa?w=800&q=80'],
        timeline: [
          { year: '1st C BC', event: 'Believed footprint of Buddha.' },
          { year: '14th C', event: 'Described by Ibn Battuta.' }
        ]
      },
      {
        name: 'Ruwanwelisaya',
        description: 'The Ruwanwelisaya is a stupa, a hemispherical structure containing relics, in Sri Lanka, considered sacred to many Buddhists all over the world.',
        historicalSignificance: 'One of the tallest ancient monuments in the world, built by King Dutugemunu.',
        location: { province: 'North Central Province', coordinates: { lat: 8.3500, lng: 80.3967 } },
        category: 'Temple',
        images: ['https://images.unsplash.com/photo-1605330368142-b6d3a95d13b4?w=800&q=80'],
        timeline: [
          { year: '140 BC', event: 'Construction started by King Dutugemunu.' }
        ]
      },
      {
        name: 'Kelaniya Raja Maha Vihara',
        description: 'Kelaniya Raja Maha Vihara is a Buddhist temple in Kelaniya, Sri Lanka, known for its history and its beautiful paintings by Solias Mendis.',
        historicalSignificance: 'Hallowed by the third visit of the Buddha to Sri Lanka.',
        location: { province: 'Western Province', coordinates: { lat: 6.9536, lng: 79.9160 } },
        category: 'Temple',
        images: ['https://images.unsplash.com/photo-1563851508658-0051e51bbf39?w=800&q=80'],
        timeline: [
          { year: '500 BC', event: 'Believed visit of Buddha.' },
          { year: '1927', event: 'Restoration and new paintings by Solias Mendis.' }
        ]
      },
      {
        name: 'Nallur Kandaswamy Kovil',
        description: 'Nallur Kandaswamy Kovil is one of the most significant Hindu temples in the Jaffna District of Northern Province, Sri Lanka.',
        historicalSignificance: 'A prominent center of Sri Lankan Tamil Hinduism, originally built in 948 AD.',
        location: { province: 'Northern Province', coordinates: { lat: 9.6738, lng: 80.0305 } },
        category: 'Temple',
        images: ['https://images.unsplash.com/photo-1627993077678-0130a103dcb2?w=800&q=80'],
        timeline: [
          { year: '948 AD', event: 'Original temple built.' },
          { year: '1749', event: 'Current temple structure built.' }
        ]
      },
      {
        name: 'Jami Ul-Alfar Mosque',
        description: 'The Jami Ul-Alfar Mosque (Red Mosque) is a historic mosque in Colombo, Sri Lanka. It is known for its distinctive red and white candy-striped architecture.',
        historicalSignificance: 'A landmark and a vital place of worship for the Muslim community since 1909.',
        location: { province: 'Western Province', coordinates: { lat: 6.9404, lng: 79.8510 } },
        category: 'Temple',
        images: ['https://images.unsplash.com/photo-1587635334289-53e34ddf466b?w=800&q=80'],
        timeline: [
          { year: '1909', event: 'Mosque completed by Habibu Labbe Saibu Labbe.' }
        ]
      },
      {
        name: 'Mihintale',
        description: 'Mihintale is a mountain peak near Anuradhapura in Sri Lanka. It is believed by Sri Lankans to be the site of a meeting between the Buddhist monk Mahinda and King Devanampiyatissa.',
        historicalSignificance: 'The cradle of Buddhism in Sri Lanka.',
        location: { province: 'North Central Province', coordinates: { lat: 8.3514, lng: 80.5173 } },
        category: 'Ancient City',
        images: ['https://images.unsplash.com/photo-1594966624911-c96570bbef60?w=800&q=80'],
        timeline: [
          { year: '247 BC', event: 'Arrival of Mahinda and introduction of Buddhism.' }
        ]
      },
      {
        name: 'Aukana Buddha Statue',
        description: 'The Aukana Buddha statue is a standing statue of the Buddha near Kekirawa in North Central Sri Lanka. It is carved out of a large granite rock face during the 5th century.',
        historicalSignificance: 'A masterpiece of ancient Sri Lankan sculpture, standing 12 meters tall.',
        location: { province: 'North Central Province', coordinates: { lat: 8.0136, lng: 80.5186 } },
        category: 'Ancient City',
        images: ['https://images.unsplash.com/photo-1627993077759-450f78d91c5e?w=800&q=80'],
        timeline: [
          { year: '5th C AD', event: 'Statue carved during reign of King Dhatusena.' }
        ]
      },
      {
        name: 'Koneswaram Temple',
        description: 'Koneswaram Temple of Trincomalee or Thirukonamalai Konesar Temple is a classical-medieval Hindu temple complex in Trincomalee, a Hindu religious pilgrimage centre in Eastern Province, Sri Lanka.',
        historicalSignificance: 'One of the Pancha Ishwarams (five abodes of Shiva) in Sri Lanka.',
        location: { province: 'Eastern Province', coordinates: { lat: 8.5833, lng: 81.2333 } },
        category: 'Temple',
        images: ['https://images.unsplash.com/photo-1626019556157-b2eb2b6c166d?w=800&q=80'],
        timeline: [
          { year: '400 BC', event: 'Early settlement and worship.' },
          { year: '1622', event: 'Destroyed by the Portuguese.' }
        ]
      },
      {
        name: 'Kataragama Temple',
        description: 'Ruhunu Maha Kataragama Devalaya is a Hindu and Buddhist temple complex dedicated to Skanda-Murukan also known as Kataragamadevio.',
        historicalSignificance: 'A rare temple visited by Buddhists, Hindus, Muslims, and indigenous Vedda people.',
        location: { province: 'Uva Province', coordinates: { lat: 6.4167, lng: 81.3333 } },
        category: 'Temple',
        images: ['https://images.unsplash.com/photo-1604724217154-184cf4e7235a?w=800&q=80'],
        timeline: [
          { year: '2nd C BC', event: 'Early origins of the shrine.' }
        ]
      },
      {
        name: 'Colombo National Museum',
        description: 'The National Museum of Colombo, also known as the Sri Lanka National Museum, is one of two museums in Colombo. It is the largest museum in Sri Lanka.',
        historicalSignificance: 'Houses significant collections of Sri Lankan historical artifacts, including the crown and throne of the Kandyan monarchs.',
        location: { province: 'Western Province', coordinates: { lat: 6.9103, lng: 79.8617 } },
        category: 'Museum',
        images: ['https://images.unsplash.com/photo-1574068468668-a05a11f871da?w=800&q=80'],
        timeline: [
          { year: '1877', event: 'Museum established by Sir William Henry Gregory.' }
        ]
      },
      {
        name: 'Independence Memorial Hall',
        description: 'Independence Memorial Hall is a national monument in Sri Lanka built for commemoration of the independence of Sri Lanka from British rule.',
        historicalSignificance: 'Marks the restoration of full governing responsibility to a Ceylonese-elected legislature.',
        location: { province: 'Western Province', coordinates: { lat: 6.9044, lng: 79.8672 } },
        category: 'Colonial',
        images: ['https://images.unsplash.com/photo-1610427924716-11f81cfbc80e?w=800&q=80'],
        timeline: [
          { year: '1948', event: 'Independence from British Rule.' },
          { year: '1953', event: 'Construction of the hall completed.' }
        ]
      },
      {
        name: 'St. Anthony\'s Shrine, Kochchikade',
        description: 'St. Anthony\'s Shrine is a Roman Catholic church in the Archdiocese of Colombo in Sri Lanka. The church is dedicated to St. Anthony of Padua.',
        historicalSignificance: 'A prominent pilgrimage site revered by Catholics and non-Catholics alike.',
        location: { province: 'Western Province', coordinates: { lat: 6.9458, lng: 79.8530 } },
        category: 'Temple',
        images: ['https://images.unsplash.com/photo-1594966624911-c96570bbef60?w=800&q=80'],
        timeline: [
          { year: '1834', event: 'Original small chapel built.' }
        ]
      }
    ];
    for (const place of places) {
      await Place.create(place);
    }

    console.log('Creating articles...');
    const articles = [
      {
        title: 'The Legend of Prince Vijaya',
        content: '<p>The Mahavamsa, the Great Chronicle of Sri Lanka, begins the history of the island with the arrival of Prince Vijaya and his 700 followers. Exiled from his homeland in northern India, Vijaya landed on the shores of Sri Lanka, supposedly on the exact day of the Buddha\'s parinirvana.</p><p>According to legend, he encountered Kuveni, a Yakkha (local demon/spirit) princess, who helped him conquer the island. Their union, however, was brief, as Vijaya later sought a royal bride from India to consecrate his kingship, leading to Kuveni\'s tragic demise and a curse that lingered over the kingdom.</p>',
        excerpt: 'The mythical origins of Sri Lanka with the arrival of exiled Prince Vijaya and his encounter with the Yakkha princess Kuveni.',
        category: 'Mythology',
        historicalPeriod: 'Prehistoric',
        tags: ['Vijaya', 'Kuveni', 'Origin', 'Myth'],
        author: adminUser._id,
        status: 'published'
      },
      {
        title: 'King Dutugemunu: The Unifier',
        content: '<p>King Dutugemunu (161 BC – 137 BC) is arguably the most celebrated hero in Sri Lankan history. Born in the southern principality of Ruhuna, he vowed to reclaim the sacred city of Anuradhapura from the Chola invader King Elara.</p><h3>The Epic Battle</h3><p>His campaign was both religious and patriotic, marching with an army of monks and ten giant warriors. The climactic battle saw Dutugemunu defeat Elara in single combat on elephants. Known for his chivalry, Dutugemunu ordered a monument built for his fallen rival.</p><p>Post-war, he focused on monumental Buddhist architecture, initiating the construction of the magnificent Ruwanwelisaya, though he passed away before its completion.</p>',
        excerpt: 'The epic tale of King Dutugemunu, who unified Sri Lanka by defeating King Elara, and his massive contributions to Buddhist architecture.',
        category: 'Kings & Rulers',
        historicalPeriod: 'Anuradhapura Period',
        tags: ['Dutugemunu', 'Elara', 'Ruwanwelisaya', 'Anuradhapura'],
        author: adminUser._id,
        status: 'published'
      },
      {
        title: 'The Arrival of Buddhism in Sri Lanka',
        content: '<p>In the 3rd century BC (around 250 BC), the trajectory of Sri Lankan history was forever altered by the arrival of Buddhism. Emperor Ashoka of India sent his son, the monk Mahinda, to introduce the teachings of the Buddha to King Devanampiya Tissa.</p><p>The momentous encounter took place at Mihintale, near Anuradhapura. The king, out hunting, was tested by Mahinda with a series of riddles to assess his intelligence before delivering the first sermon.</p><p>This event sparked a rapid cultural and spiritual transformation, leading to the establishment of the Bhikkhu order, the arrival of the sacred Bo sapling (Jaya Sri Maha Bodhi), and the shaping of Sinhala civilization around Theravada Buddhist principles.</p>',
        excerpt: 'How the monk Mahinda introduced Buddhism to King Devanampiya Tissa at Mihintale, forever changing the culture of Sri Lanka.',
        category: 'Buddhism & Religion',
        historicalPeriod: 'Anuradhapura Period',
        tags: ['Buddhism', 'Mahinda', 'Devanampiya Tissa', 'Mihintale'],
        author: adminUser._id,
        status: 'published'
      },
      {
        title: 'Rise and Fall of the Kandyan Kingdom',
        content: '<p>The Kingdom of Kandy emerged in the late 15th century as a powerful independent state in the central highlands. Protected by rugged mountains and dense forests, it successfully resisted multiple colonial invasions by the Portuguese and Dutch.</p><h3>The Final Stronghold</h3><p>Kandy became the last bastion of Sinhalese independence and Buddhist culture. The kings adopted guerrilla warfare tactics to repel foreign armies. The kingdom reached its cultural zenith under kings like Kirti Sri Rajasinha, who revived Buddhism and the Dalada Perahera.</p><p>However, internal dissent and British military prowess eventually led to its downfall. In 1815, the Kandyan Convention was signed by traitorous nobles, ceding the kingdom to the British Crown and ending over 2,000 years of Sinhalese monarchy.</p>',
        excerpt: 'The story of Sri Lanka\'s last independent kingdom, its resilience against colonial powers, and its tragic betrayal in 1815.',
        category: 'Ancient History',
        historicalPeriod: 'Kandyan Period',
        tags: ['Kandy', 'British', 'Portuguese', 'Dutch', 'Monarchy'],
        author: adminUser._id,
        status: 'published'
      },
      {
        title: 'Sri Lanka Under Colonial Rule',
        content: '<p>Sri Lanka\'s strategic location in the Indian Ocean made it a prime target for European powers. The colonial era began in 1505 with the accidental arrival of the Portuguese, who sought control over the lucrative cinnamon trade.</p><p>The Dutch arrived in the 17th century, ousting the Portuguese and establishing a monopoly on trade while introducing Roman-Dutch law and building formidable forts, such as the one in Galle.</p><p>The British took control of the coastal areas in 1796 and eventually the entire island in 1815. They transformed the landscape and economy by introducing vast coffee, and later tea, plantations, forever altering the demographic and social structure of Ceylon before independence in 1948.</p>',
        excerpt: 'An overview of the Portuguese, Dutch, and British colonial periods and their lasting impact on Sri Lankan society and economy.',
        category: 'Colonial Era',
        historicalPeriod: 'Colonial Period',
        tags: ['Colonialism', 'Portuguese', 'Dutch', 'British', 'Tea'],
        author: adminUser._id,
        status: 'published'
      },
      {
        title: 'Ancient Irrigation Marvels of Lanka',
        content: '<p>The dry zone of Sri Lanka, encompassing the ancient capitals of Anuradhapura and Polonnaruwa, receives little rainfall for much of the year. To sustain large populations and agriculture, ancient kings developed one of the most sophisticated irrigation systems in the ancient world.</p><h3>Engineering Brilliance</h3><p>Massive reservoirs (wewas) like the Kala Wewa, Minneriya, and Parakrama Samudra were constructed using advanced engineering principles. They built intricate canal systems featuring the "Bisokotuwa" (valve pit), an ingenious invention that regulated water pressure outflow, which modern engineers still marvel at today.</p><p>King Parakramabahu I famously decreed: "Not even a single drop of water that comes from the rain must flow into the ocean without being made useful to man," summarizing the hydraulic civilization\'s ethos.</p>',
        excerpt: 'Exploring the advanced hydraulic engineering of ancient Sri Lanka, from massive reservoirs to the ingenious Bisokotuwa valve pits.',
        category: 'Architecture',
        historicalPeriod: 'Anuradhapura Period',
        tags: ['Irrigation', 'Engineering', 'Wewa', 'Parakramabahu'],
        author: adminUser._id,
        status: 'published'
      }
    ];
    for (const article of articles) {
      await Article.create(article);
    }

    console.log('Creating SiteConfig...');
    const allPlaces = await Place.find({});
    await SiteConfig.create({
      heroTitle: "Discover Sri Lanka's",
      heroSubtitle: "Ancient Heritage",
      chatbotPromoTitle: "Talk to our AI Guide",
      chatbotPromoSubtitle: "Learn about the history and heritage instantly",
      newsletterTitle: "Subscribe to our Newsletter",
      newsletterSubtitle: "Get the latest historical discoveries",
      heroStats: [
        { label: 'Years of History', value: '2500', icon: 'BookOpen' },
        { label: 'Historical Sites', value: '400', icon: 'Compass' },
        { label: 'Ancient Temples', value: '180', icon: 'Landmark' },
        { label: 'Artifacts Discovered', value: '2000', icon: 'MapPin' }
      ],
      timelineEvents: [
        { year: '543 BC', title: 'Arrival of Prince Vijaya', description: 'Prince Vijaya and his followers arrive in Sri Lanka, marking the traditional beginning of Sinhalese history.' },
        { year: '250 BC', title: 'Buddhism Introduced', description: 'Mahinda Thera introduces Buddhism to King Devanampiyatissa at Mihintale.' },
        { year: '1st C BC', title: 'Anuradhapura Golden Age', description: 'The peak of the Anuradhapura Kingdom with monumental stupas and advanced irrigation.' },
        { year: '5th C AD', title: 'Sigiriya Built', description: 'King Kasyapa constructs his fortress and palace on the Lion Rock.' },
        { year: '11th C', title: 'Polonnaruwa Era', description: 'Polonnaruwa becomes the capital, seeing a renaissance in art and architecture.' },
        { year: '1815', title: 'Fall of Kandy', description: 'The Kandyan Kingdom falls to the British, ending over 2,000 years of Sinhalese monarchy.' }
      ],
      featuredPlaces: allPlaces.map(p => p._id).slice(0, 5)
    });

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
