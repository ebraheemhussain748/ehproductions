// All editable content for the site lives here.
// To add a new video: add an entry to WORK (poster image goes in the same folder).

export const CONTACT = {
  whatsapp: '919389080059',
  whatsappDisplay: '+91 93890 80059',
  email: 'ebraheemhussain748@gmail.com',
  location: 'Mathura, Uttar Pradesh (near Delhi)',
  youtube: 'https://www.youtube.com/channel/UCWhn9Tuk_qFfp__eVmOqNBQ',
  instagram: 'https://www.instagram.com/ebraheemhussainproductions/',
};

// shape: 'tall' (9:16 Short) or 'wide' (16:9)
export const WORK = [
  { id: 'WGivVL_ncP0', title: 'Same burger, 3 budgets', kind: 'AI ads', shape: 'tall', poster: 'p-burger.jpg',
    note: 'One product shot three ways: phone photo, studio, and full cinematic commercial.' },
  { id: 'bmRPnHQaVVM', title: 'Bakery commercial with no camera', kind: 'AI ads', shape: 'tall', poster: 'p-bakery.jpg',
    note: 'A full product ad for a bakery, made from text prompts and edited in-house.' },
  { id: 'nbUOq4ORrf4', title: 'Quiet Avenue', kind: 'Music videos', shape: 'tall', poster: 'p-quiet-avenue.jpg',
    note: 'A 3D retrowave lyric video built shot by shot with motion graphics.' },
  { id: 'oe1k8PPNrvo', title: 'What was hidden inside', kind: 'AI stories', shape: 'tall', poster: 'p-mystery.jpg',
    note: 'Macro-detail reveal story designed for watch time.' },
  { id: 'LRDaQZ_trO8', title: 'Tu Hi Kaafi Hai', kind: 'Music videos', shape: 'wide', poster: 'p-nasheed.jpg',
    note: 'A full-length nasheed music video.' },
];

// price: [INR, USD]  (starting prices)
export const SERVICES = {
  screen: [
    { name: 'AI video ad', what: '15 to 30 second ad for Reels, Shorts or YouTube, script included', price: [2499, 39] },
    { name: 'Product commercial', what: '30 to 60 second cinematic ad for one product or menu item', price: [4999, 79] },
    { name: 'Music or lyric video', what: 'Up to 3 minutes, story visuals or 3D lyric animation', price: [5999, 99] },
    { name: 'Motion graphics and 3D', what: 'Logo reveals, explainers and animated titles, per 30 seconds', price: [3999, 59] },
    { name: 'Business website', what: 'Up to 5 pages, enquiry form, mobile-ready, free hosting set up', price: [7999, 129] },
    { name: 'Social media posts', what: 'Pack of 10 designed posts or story graphics', price: [1999, 29] },
  ],
  street: [
    { name: 'Logo and branding', what: '3 logo concepts, final files and colour guide', price: [1499, 25] },
    { name: 'Poster or flyer', what: 'Print-ready design for one poster, flyer or menu', price: [499, 9] },
    { name: 'Flex banner or hoarding', what: 'Large-format design sized for your printer', price: [699, 12] },
    { name: 'Name plate or sign board', what: 'Shop, office or home name plate design', price: [599, 10] },
    { name: 'Offline ad campaign', what: 'Pamphlets, banners and hoardings planned together for one launch', price: null },
  ],
};

export const FAQ = [
  { q: 'How long does a video ad take?', a: 'Most AI video ads are ready in 2 to 4 days after you approve the concept. Longer commercials and music videos take about a week.' },
  { q: 'Do you use AI?', a: 'Yes. We use AI video tools such as Google Flow together with editing, motion graphics, 3D and sound design. AI-generated visuals are labelled when they are published.' },
  { q: 'Can you print banners and make name plates?', a: 'We design them and can arrange printing and fabrication in Mathura and the Delhi NCR area. Printing and material costs are quoted separately.' },
  { q: 'Do you work with clients outside India?', a: 'Yes. Everything is handled online, files are delivered by link, and prices can be paid in US dollars.' },
  { q: 'How many changes can I ask for?', a: 'Every project includes two rounds of changes. You get a fixed quote before any work starts, so there are no surprises.' },
];

export const CREDENTIALS = [
  'Creative Talent Award (school)',
  'Generative AI certificate',
  'Virality School certificate',
  'Upskill certificate',
  'Outlook certificate',
];
