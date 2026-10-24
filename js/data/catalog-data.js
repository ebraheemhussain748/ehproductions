// Catalog of everything Ebraheem Hussain Productions makes.
// Prices are AVERAGE MARKET PRICES checked online in October 2026 (sources at the bottom).
// To edit: change an item's inr: [low, high] (and usd for online work), or add a new item to ITEMS.
// unit examples: 'per sq ft', 'per piece', 'per 100 cards', 'per month'. inr: null means "price on quote".

export const NOTE = 'This is an average price and depends on your specified work.';
export const DELIVERY = 'Courier all over India. International delivery for big projects.';
export const CHECKED = 'October 2026';

export const GROUPS = [
  { id: 'offline', name: 'Offline', long: 'Print, signage and branded products' },
  { id: 'online', name: 'Online', long: 'Design, video, websites and apps' },
];

export const CATEGORIES = [
  { id: 'signage', group: 'offline', icon: 'sign', name: 'Outdoor Advertising & Signage', blurb: 'Boards, letters and banners that make your shop easy to find, day and night.' },
  { id: 'banners', group: 'offline', icon: 'banner', name: 'Banners & Flex Printing', blurb: 'Shop openings, events, rallies, birthdays and weddings.' },
  { id: 'business', group: 'offline', icon: 'card', name: 'Business Printing', blurb: 'Everything a business hands over, posts or files.' },
  { id: 'plates', group: 'offline', icon: 'plate', name: 'Signboards & Name Plates', blurb: 'Direction boards, reception signs and name plates. Glow, LED and acrylic shop boards are under Outdoor Advertising & Signage.' },
  { id: 'gifts', group: 'offline', icon: 'gift', name: 'Promotional Gifts', blurb: 'Branded gifts for schools, coaching centres, companies and event organisers.' },
  { id: 'uniforms', group: 'offline', icon: 'shirt', name: 'Uniforms & Printed Clothing', blurb: 'School and staff uniforms, campaign T-shirts, caps and event wear.' },
  { id: 'retail', group: 'offline', icon: 'food', name: 'Restaurant & Retail Advertising', blurb: 'Menus, packaging, bags, labels and counter QR stands.' },
  { id: 'social', group: 'online', icon: 'grid', name: 'Social Media Design Packs', blurb: 'Posts, stories, ads and festival posters in your brand style.' },
  { id: 'video', group: 'online', icon: 'play', name: 'Advertising Videos', blurb: 'Reels, Shorts, product ads and AI-made commercials.' },
  { id: 'music', group: 'online', icon: 'music', name: 'Music Production', blurb: 'Mixing and mastering that makes your song sound clear, loud and ready for release.' },
  { id: 'branding', group: 'online', icon: 'pen', name: 'Branding', blurb: 'Logos, brand kits, guidelines and campaign designs.' },
  { id: 'websites', group: 'online', icon: 'window', name: 'Website & Landing-Page Packages', blurb: 'Fast, mobile-first sites that bring in enquiries.' },
  { id: 'webdev', group: 'online', icon: 'code', name: 'Web Development', blurb: 'Online stores, custom sites and ongoing maintenance.' },
  { id: 'apps', group: 'online', icon: 'phone', name: 'App Development', blurb: 'Android, iOS, business, education and web apps.' },
  { id: 'digital', group: 'online', icon: 'bolt', name: 'Digital Solutions', blurb: 'Automation, AI tools, custom software and integrations.' },
];

// src: keys into SOURCES (where the average was checked)
export const ITEMS = [
  // ---------- Outdoor Advertising & Signage ----------
  { cat: 'signage', name: 'Shop signboards', what: 'Front-lit flex board on a metal frame, made to your shop width.', inr: [50, 150], unit: 'per sq ft', src: ['im-flexsign'], tip: 'Readable distance: about 1 inch of letter height for every 10 feet.' },
  { cat: 'signage', name: 'Flex boards', what: 'Printed flex for walls, shop fronts and events. Printing only, frame extra.', inr: [8, 25], unit: 'per sq ft', src: ['im-flex', 'sa'] },
  { cat: 'signage', name: 'Glow sign boards', what: 'Backlit box with a flex or acrylic face that lights up at night.', inr: [180, 500], unit: 'per sq ft', src: ['im-glow'] },
  { cat: 'signage', name: 'LED sign boards', what: 'Acrylic board with built-in LEDs for a bright, clean look.', inr: [300, 800], unit: 'per sq ft', src: ['im-led'] },
  { cat: 'signage', name: 'Acrylic signage', what: 'Cut or printed acrylic signs for shop fronts, offices and counters.', inr: [300, 800], unit: 'per sq ft', src: ['im-nameboard', 'im-led'] },
  { cat: 'signage', name: '3D letter signage', what: 'Raised letters in stainless steel, gold or rose-gold finish, or PU.', inr: [40, 120], unit: 'per inch of letter height', src: ['im-boxletters'] },
  { cat: 'signage', name: '3D LED letters', what: 'Raised acrylic letters that glow, for premium shop fronts.', inr: [140, 400], unit: 'per inch of letter height', src: ['im-boxletters', 'im-led'] },
  { cat: 'signage', name: 'ACP signage', what: 'Weatherproof aluminium composite panel board with letters or print.', inr: [400, 900], unit: 'per sq ft', src: ['im-acp'] },
  { cat: 'signage', name: 'Promotional banners', what: 'Flex or vinyl banners with eyelets for sales, launches and events.', inr: [10, 40], unit: 'per sq ft', src: ['im-flex', 'im-agra'] },
  { cat: 'signage', name: 'Standees', what: '3 × 6 ft roll-up stand with printed banner and carry bag.', inr: [1200, 2800], unit: 'per piece', src: ['im-standee', 'sa'] },
  { cat: 'signage', name: 'LED neon signs', what: 'Neon-look sign of your name, logo or slogan for walls and selfie corners.', inr: [600, 3500], unit: 'per piece', src: ['im-neon'], tip: 'Large custom neon is quoted by size.' },
  { cat: 'signage', name: 'Hoardings & billboards', what: 'Hoarding design and printing. We can also help you book the space.', inr: [10, 25], unit: 'per sq ft (printing)', src: ['im-flex', 'im-hoarding'], tip: 'Hoarding space rent is separate, often ₹15,000 to ₹1,00,000+ a month by location.' },
  { cat: 'signage', name: 'Sunboard & foam board prints', what: 'Light rigid boards for shop interiors, exhibitions and selfie frames.', inr: [30, 80], unit: 'per sq ft', src: ['im-sunboard'] },
  { cat: 'signage', name: 'One-way vision & window graphics', what: 'Printed see-through vinyl for glass: you see out, people see your ad.', inr: [20, 50], unit: 'per sq ft', src: ['im-oneway', 'im-agra'] },
  { cat: 'signage', name: 'Vehicle branding', what: 'Printed vinyl for cars, vans, e-rickshaws and delivery bikes.', inr: [25, 60], unit: 'per sq ft', src: ['im-vehicle', 'im-agra'] },
  { cat: 'signage', name: 'Complete offline campaign', what: 'Pamphlets, banners, standees and hoardings planned together for one launch.', inr: null, unit: '', src: [] },

  // ---------- Banners & Flex Printing ----------
  { cat: 'banners', name: 'Shop-opening banners', what: 'Grand opening and offer banners, designed and printed.', inr: [10, 25], unit: 'per sq ft', src: ['im-flex', 'sa'], tip: 'Design is quoted together with printing.' },
  { cat: 'banners', name: 'Political & event banners', what: 'Rally, campaign, religious and event banners, in bulk.', inr: [8, 20], unit: 'per sq ft', src: ['im-flex', 'im-agra'], tip: 'Bulk orders get the lower end of the range.' },
  { cat: 'banners', name: 'Promotional flex boards', what: 'Framed flex boards for roadside, school and coaching promotion.', inr: [50, 150], unit: 'per sq ft', src: ['im-flexsign'] },
  { cat: 'banners', name: 'Birthday & wedding backdrops', what: 'Printed fabric or flex backdrops, from 6 × 8 ft to 8 × 12 ft.', inr: [800, 6500], unit: 'per backdrop', src: ['im-backdrop'] },
  { cat: 'banners', name: 'Posters', what: 'A4 and A3 posters for walls, notice boards and shop counters.', inr: [5, 25], unit: 'per piece (100+)', src: ['im-poster'], tip: 'Large-format posters cost about ₹15 to ₹60 per sq ft.' },

  // ---------- Business Printing ----------
  { cat: 'business', name: 'Visiting cards', what: 'Matte or glossy 300 to 350 gsm, single or double sided.', inr: [300, 600], unit: 'per 100 cards', src: ['sa', 'printo'] },
  { cat: 'business', name: 'Premium visiting cards', what: 'Gold foil, spot UV, textured or transparent cards.', inr: [1500, 2000], unit: 'per 100 cards', src: ['sa'] },
  { cat: 'business', name: 'Pamphlets & leaflets', what: 'A5 or A4 flyers on 90 to 130 gsm paper.', inr: [500, 2000], unit: 'per 1,000', src: ['im-leaflet'] },
  { cat: 'business', name: 'Brochures', what: 'Bi-fold and tri-fold brochures for products and services.', inr: [5, 25], unit: 'per piece (bulk)', src: ['im-brochure'] },
  { cat: 'business', name: 'Catalogues & booklets', what: 'Product catalogues of 8 to 24 pages, stapled or bound.', inr: [25, 120], unit: 'per copy', src: ['im-brochure'] },
  { cat: 'business', name: 'Letterheads', what: 'A4 letterheads on 90 to 120 gsm bond paper.', inr: [1500, 4000], unit: 'per 1,000', src: ['im-letterhead'] },
  { cat: 'business', name: 'Bill books', what: 'GST bill books and receipt books, duplicate or triplicate.', inr: [80, 200], unit: 'per book', src: ['im-billbook'] },
  { cat: 'business', name: 'Envelopes', what: 'Printed office envelopes from DL to A4 size.', inr: [2, 8], unit: 'per piece', src: ['im-envelope'] },
  { cat: 'business', name: 'Wedding & invitation cards', what: 'From simple printed cards to boxed premium sets.', inr: [10, 150], unit: 'per card', src: ['im-wedding'] },
  { cat: 'business', name: 'ID cards & lanyards', what: 'PVC ID cards for schools, offices and events, with printed lanyards.', inr: [10, 30], unit: 'per card', src: ['im-idcard', 'im-lanyard'], tip: 'Printed lanyards add about ₹10 to ₹25 each.' },

  // ---------- Signboards & Name Plates ----------
  { cat: 'plates', name: 'Direction boards', what: 'Wayfinding signs for schools, hospitals, offices and housing societies.', inr: [150, 600], unit: 'per sq ft', src: ['im-direction'] },
  { cat: 'plates', name: 'Reception signs', what: 'Logo wall behind your front desk in acrylic, ACP or 3D letters.', inr: [3000, 15000], unit: 'per sign', src: ['im-led', 'im-boxletters'] },
  { cat: 'plates', name: 'Office & door name plates', what: 'Acrylic, steel or brass plates for cabins and doors.', inr: [300, 2000], unit: 'per piece', src: ['im-nameboard'] },
  { cat: 'plates', name: 'House name plates', what: 'Name plates for homes and gates in acrylic, steel, wood or stone.', inr: [500, 4000], unit: 'per piece', src: ['im-nameboard'] },

  // ---------- Promotional Gifts ----------
  { cat: 'gifts', name: 'Printed pens', what: 'Plastic pens with your logo, for schools, coaching and events.', inr: [4, 15], unit: 'per pen', src: ['im-pen'] },
  { cat: 'gifts', name: 'Metal pens', what: 'Engraved metal pens for corporate gifting.', inr: [35, 95], unit: 'per pen', src: ['im-pen'] },
  { cat: 'gifts', name: 'Printed mugs', what: 'Ceramic mugs with your logo or photo.', inr: [70, 200], unit: 'per mug (bulk)', src: ['im-mug', 'sa'], tip: 'A single photo mug costs more, around ₹300 to ₹550.' },
  { cat: 'gifts', name: 'Wall calendars', what: 'Single-sheet or 12-page wall calendars with your branding.', inr: [25, 100], unit: 'per piece', src: ['im-wallcal'] },
  { cat: 'gifts', name: 'Desk calendars', what: 'Table-top calendars in paper, MDF or wood.', inr: [50, 250], unit: 'per piece', src: ['im-deskcal'] },
  { cat: 'gifts', name: 'Diaries & notebooks', what: 'Logo diaries and notebooks for staff and students.', inr: [80, 300], unit: 'per piece', src: ['im-diary'] },
  { cat: 'gifts', name: 'Branded water bottles', what: 'Steel or plastic bottles printed with your logo.', inr: [100, 250], unit: 'per bottle', src: ['im-bottle'] },
  { cat: 'gifts', name: 'Printed bags', what: 'Non-woven carry bags with your print, for shops and events.', inr: [15, 50], unit: 'per bag', src: ['im-nonwoven'] },
  { cat: 'gifts', name: 'Keychains', what: 'Plastic, metal, wood or leather keychains with your logo.', inr: [8, 60], unit: 'per piece', src: ['im-keychain'] },
  { cat: 'gifts', name: 'Trophies & mementos', what: 'Acrylic awards for annual days, sports days and events.', inr: [250, 900], unit: 'per piece', src: ['im-memento'] },

  // ---------- Uniforms & Printed Clothing ----------
  { cat: 'uniforms', name: 'School uniforms', what: 'Shirt with trousers or skirt, with your school logo.', inr: [450, 800], unit: 'per set', src: ['im-school'] },
  { cat: 'uniforms', name: 'Staff uniforms', what: 'Shirts, polos and aprons for shops, hotels, clinics and offices.', inr: [300, 900], unit: 'per piece', src: ['im-corporate'] },
  { cat: 'uniforms', name: 'Promotional T-shirts', what: 'Printed round-neck or polo T-shirts for campaigns and teams.', inr: [120, 350], unit: 'per piece', src: ['im-tshirt'], tip: 'Polyester event tees in bulk can start near ₹60 to ₹120.' },
  { cat: 'uniforms', name: 'Caps', what: 'Printed or embroidered caps.', inr: [40, 150], unit: 'per piece', src: ['im-cap'] },
  { cat: 'uniforms', name: 'Hoodies & event wear', what: 'Hoodies, jackets and event clothing with your print.', inr: [450, 1250], unit: 'per piece', src: ['im-school', 'sa'] },

  // ---------- Restaurant & Retail ----------
  { cat: 'retail', name: 'Menu cards', what: 'Laminated single-sheet or folded menus.', inr: [30, 150], unit: 'per piece', src: ['im-menu'], tip: 'Booklet menus cost about ₹300 to ₹650, leather folders ₹1,100 to ₹1,500.' },
  { cat: 'retail', name: 'Takeaway packaging', what: 'Printed food, biryani and bakery boxes.', inr: [4, 20], unit: 'per box', src: ['im-foodbox'] },
  { cat: 'retail', name: 'Paper carry bags', what: 'Printed kraft or white paper bags with handles.', inr: [8, 25], unit: 'per bag', src: ['im-paperbag'] },
  { cat: 'retail', name: 'Product labels & stickers', what: 'Paper or vinyl labels for jars, bottles and packets.', inr: [500, 4000], unit: 'per 1,000 labels', src: ['im-label', 'sa'] },
  { cat: 'retail', name: 'QR code standees', what: 'Acrylic UPI, menu or Google-review QR stands for counters.', inr: [40, 150], unit: 'per piece', src: ['im-qr'], tip: 'Tap-to-review (NFC) stands cost about ₹200 to ₹650.' },

  // ---------- Social Media Design Packs ----------
  { cat: 'social', name: 'Instagram posts & story templates', what: 'Pack of 10 branded posts or stories in the right sizes.', inr: [1500, 5000], usd: [50, 400], unit: 'per pack of 10', src: ['im-social', 'manypixels'] },
  { cat: 'social', name: 'Facebook & Instagram ad creatives', what: 'Ad images built to stop the scroll, with your offer and CTA.', inr: [500, 2000], usd: [15, 60], unit: 'per creative', src: ['manypixels', 'im-social'] },
  { cat: 'social', name: 'Festival & sale posters', what: 'Diwali, Eid, Holi, Independence Day, New Year and sale posters with your brand.', inr: [300, 1000], usd: [10, 40], unit: 'per poster', src: ['im-social', 'manypixels'], tip: 'A full-year festival pack usually costs ₹4,000 to ₹7,000.' },
  { cat: 'social', name: 'Business promotion graphics', what: '12 to 20 designed posts a month, planned around your offers.', inr: [5000, 15000], usd: [250, 2000], unit: 'per month', src: ['im-social', 'manypixels'] },
  { cat: 'social', name: 'Social media management', what: 'Design plus posting and planning for your pages every month.', inr: [15000, 40000], unit: 'per month', src: ['noir'] },

  // ---------- Advertising Videos ----------
  { cat: 'video', name: 'Instagram Reels & YouTube Shorts', what: 'Edited short videos with hook, captions and music.', inr: [1500, 10000], usd: [100, 500], unit: 'per reel', src: ['irpr-video', 'videotto'] },
  { cat: 'video', name: 'Product advertisements', what: '15 to 60 second ad for one product or menu item.', inr: [5000, 40000], usd: [250, 600], unit: 'per ad', src: ['irpr-video', 'motionbox'] },
  { cat: 'video', name: 'AI-generated promotional videos', what: 'Cinematic ads made with AI video tools, no shoot needed.', inr: [3000, 20000], usd: [150, 600], unit: 'per 15 to 30 s ad', src: ['motionbox', 'novoads'] },
  { cat: 'video', name: 'Animated business promos & explainers', what: '2D or motion-graphics explainer, 30 to 60 seconds.', inr: [15000, 80000], usd: [300, 5000], unit: 'per video', src: ['irpr-explainer', 'manypixels', 'novoads'] },
  { cat: 'video', name: 'Logo reveals & motion graphics', what: 'Animated logo, titles or a short motion piece, 10 to 30 seconds.', inr: [3000, 20000], usd: [100, 300], unit: 'per piece', src: ['im-motion', 'manypixels'] },
  { cat: 'video', name: 'Music & lyric videos', what: 'Story visuals or 3D lyric animation for your song.', inr: null, unit: '', src: [] },

  // ---------- Music Production ----------
  { cat: 'music', name: 'Song mixing', what: 'Your vocals, beat and instruments balanced into one clear, full mix.', inr: [4000, 12000], usd: [100, 350], unit: 'per song', src: ['roex', 'sb-india'], tip: 'Send separate tracks (stems) as WAV files for the best result.' },
  { cat: 'music', name: 'Song mastering', what: 'Final polish and loudness for Spotify, YouTube and Instagram.', inr: [1500, 5000], usd: [40, 130], unit: 'per song', src: ['roex', 'sb-india'] },
  { cat: 'music', name: 'Mixing + mastering package', what: 'From raw tracks to a release-ready song in one order.', inr: [6000, 15000], usd: [140, 480], unit: 'per song', src: ['studiod', 'roex'] },
  { cat: 'music', name: 'EP & album mastering', what: 'Every track mastered to the same loudness and tone, so it sounds like one record.', inr: null, unit: '', src: [], tip: 'Priced by the number of tracks.' },

  // ---------- Branding ----------
  { cat: 'branding', name: 'Logo design', what: 'Logo concepts, final files in every format and colour versions.', inr: [1500, 15000], usd: [25, 300], unit: 'per logo', src: ['sprak', 'madegood'] },
  { cat: 'branding', name: 'Logo & brand kit', what: 'Logo, colours, fonts, social profile kit and stationery set.', inr: [5000, 25000], usd: [300, 2500], unit: 'per kit', src: ['sprak', 'madegood'] },
  { cat: 'branding', name: 'Business card design', what: 'Print-ready visiting card design, front and back.', inr: [300, 1500], usd: [10, 50], unit: 'per design', src: ['manypixels', 'im-social'] },
  { cat: 'branding', name: 'Brand guidelines', what: 'A short guide that keeps your logo, colours and type consistent.', inr: [10000, 40000], usd: [500, 2500], unit: 'per document', src: ['madegood', 'filecamp'] },
  { cat: 'branding', name: 'Advertising campaign designs', what: 'Posters, banners, posts and hoarding art for one launch, in one style.', inr: [8000, 50000], usd: [300, 1500], unit: 'per campaign', src: ['manypixels', 'im-social'] },

  // ---------- Website & Landing-Page Packages ----------
  { cat: 'websites', name: 'Business websites', what: '5 to 10 pages, enquiry form, WhatsApp button, mobile-first.', inr: [10000, 80000], usd: [300, 3000], unit: 'per website', src: ['hostinger', 'pce'] },
  { cat: 'websites', name: 'Product landing pages', what: 'One focused page that sells one product or offer.', inr: [5000, 40000], usd: [150, 1500], unit: 'per page', src: ['hostinger', 'pce', 'irpr-landing'] },
  { cat: 'websites', name: 'Online portfolios', what: 'Portfolio site for artists, photographers, doctors and creators.', inr: [5000, 30000], usd: [150, 1000], unit: 'per website', src: ['hostinger', 'pce'] },
  { cat: 'websites', name: 'Lead-generation pages', what: 'Landing page with enquiry form, WhatsApp button and lead database.', inr: [8000, 50000], usd: [300, 1500], unit: 'per page', src: ['hostinger', 'pce', 'irpr-landing'] },

  // ---------- Web Development ----------
  { cat: 'webdev', name: 'E-commerce websites', what: 'Online store with catalogue, cart, payments and shipping.', inr: [40000, 150000], usd: [1000, 5000], unit: 'per store', src: ['indianweb', 'hostinger', 'pce'] },
  { cat: 'webdev', name: 'Custom business websites', what: 'Dynamic sites with logins, dashboards or booking.', inr: [40000, 150000], usd: [800, 4000], unit: 'per website', src: ['hostinger', 'pce'] },
  { cat: 'webdev', name: 'Website maintenance', what: 'Updates, backups, security fixes and small changes.', inr: [1000, 10000], usd: [50, 200], unit: 'per month', src: ['upgrowth-maint', 'hostinger'] },

  // ---------- App Development ----------
  { cat: 'apps', name: 'Android apps', what: 'Android app for your business, shop or service.', inr: [150000, 800000], usd: [5000, 50000], unit: 'per app', src: ['codingclave', 'indianweb', 'ecorpit'] },
  { cat: 'apps', name: 'iOS apps', what: 'iPhone app, or one app for both iOS and Android.', inr: [200000, 800000], usd: [8000, 50000], unit: 'per app', src: ['codingclave', 'zartek', 'ecorpit'], tip: 'Apple charges $99 a year to publish; Google Play is a one-time $25.' },
  { cat: 'apps', name: 'Business management apps', what: 'Billing, stock, staff or customer management apps.', inr: [300000, 1500000], usd: [8000, 50000], unit: 'per app', src: ['codingclave', 'ecorpit'] },
  { cat: 'apps', name: 'Educational apps', what: 'Apps for schools and coaching: classes, tests and fees.', inr: [300000, 1200000], usd: [8000, 40000], unit: 'per app', src: ['codingclave', 'ecorpit'] },
  { cat: 'apps', name: 'Web apps & SaaS products', what: 'Browser-based apps and subscription software, from MVP up.', inr: [200000, 2500000], usd: [5000, 60000], unit: 'per product', src: ['codingclave', 'pce', 'promatics'] },

  // ---------- Digital Solutions ----------
  { cat: 'digital', name: 'Website + app package', what: 'Website and matching mobile app, built together.', inr: [200000, 800000], usd: [5000, 25000], unit: 'per package', src: ['codingclave', 'indianweb'] },
  { cat: 'digital', name: 'Business automation', what: 'WhatsApp auto-replies, lead routing, reminders and reports.', inr: [15000, 150000], unit: 'setup', src: ['hyperleap', 'decipher'], tip: 'WhatsApp platforms add about ₹1,000 to ₹16,500 a month.' },
  { cat: 'digital', name: 'AI-powered tools & chatbots', what: 'Chatbots and AI helpers trained on your business.', inr: [50000, 250000], unit: 'per tool', src: ['decipher', 'codingclave'] },
  { cat: 'digital', name: 'Custom software', what: 'CRM, billing or ERP made for how your business works.', inr: [300000, 1500000], unit: 'per project', src: ['codingclave'] },
  { cat: 'digital', name: 'API & system integrations', what: 'Connect payments, WhatsApp, Tally, Zoho, maps or shipping.', inr: [30000, 150000], unit: 'per integration', src: ['codingclave'] },
  { cat: 'digital', name: 'Local SEO & Google Business Profile', what: 'Get found on Google Maps and search in your city.', inr: [8000, 20000], unit: 'per month', src: ['upgrowth-seo', 'whitespark'] },
];

export const SOURCES = {
  'roex': ['RoEx Audio: mixing and mastering cost in 2026', 'https://www.roexaudio.com/blog/how-much-does-it-cost-to-mix-and-master-a-song-in-2026'],
  'sb-india': ['SoundBetter: India-based mixing engineer rates', 'https://soundbetter.com/profiles/21342-amit-yadav'],
  'studiod': ['Studio D: mixing and mastering packages (India)', 'https://studiodoffers.carrd.co/'],
  'sa': ['SA Creative catalogue (print, signage, gifts)', 'https://sacreativestore.lovable.app/catalog'],
  'printo': ['Printo: visiting card printing', 'https://printo.in/p/business-cards-india'],
  'im-flexsign': ['IndiaMART: flex sign boards', 'https://m.indiamart.com/impcat/flex-sign-board.html'],
  'im-flex': ['IndiaMART: flex printing services', 'https://m.indiamart.com/impcat/flex-printing-services.html'],
  'im-agra': ['IndiaMART: banner printing in Agra', 'https://m.indiamart.com/city/agra/banner-printing.html'],
  'im-glow': ['IndiaMART: glow sign boards', 'https://m.indiamart.com/impcat/glow-sign-board.html'],
  'im-led': ['IndiaMART: acrylic LED sign boards, Delhi', 'https://m.indiamart.com/city/delhi/acrylic-led-sign-board.html'],
  'im-boxletters': ['IndiaMART: 3D box letters', 'https://m.indiamart.com/impcat/box-letters.html'],
  'im-acp': ['IndiaMART: ACP sign boards', 'https://m.indiamart.com/impcat/acp-sign-board.html'],
  'im-standee': ['IndiaMART: banner stands and standees', 'https://m.indiamart.com/impcat/banner-stand.html'],
  'im-neon': ['IndiaMART: LED neon lights', 'https://m.indiamart.com/impcat/led-neon-light.html'],
  'im-hoarding': ['IndiaMART: hoarding advertisement', 'https://m.indiamart.com/impcat/hoarding-advertisement-service.html'],
  'im-sunboard': ['IndiaMART: sunboard printing', 'https://m.indiamart.com/impcat/sun-board-printing-service.html'],
  'im-oneway': ['IndiaMART: one-way vision film', 'https://m.indiamart.com/padamimpex/signage.html'],
  'im-vehicle': ['IndiaMART: vehicle vinyl, Lucknow', 'https://m.indiamart.com/city/lucknow/automotive-decals.html'],
  'im-backdrop': ['IndiaMART: backdrops', 'https://m.indiamart.com/impcat/backdrops.html'],
  'im-poster': ['IndiaMART: poster printing', 'https://m.indiamart.com/impcat/poster-printing.html'],
  'im-leaflet': ['IndiaMART: printed leaflets', 'https://m.indiamart.com/impcat/printed-leaflet.html'],
  'im-brochure': ['IndiaMART: brochure printing', 'https://m.indiamart.com/impcat/brochure-printing-services.html'],
  'im-letterhead': ['IndiaMART: letterhead printing', 'https://m.indiamart.com/impcat/letterhead-printing-service.html'],
  'im-billbook': ['IndiaMART: invoice and bill books', 'https://m.indiamart.com/impcat/invoice-book.html'],
  'im-envelope': ['IndiaMART: printed envelopes', 'https://m.indiamart.com/impcat/printed-envelope.html'],
  'im-wedding': ['IndiaMART: wedding cards', 'https://m.indiamart.com/impcat/wedding-cards.html'],
  'im-idcard': ['IndiaMART: PVC ID cards', 'https://m.indiamart.com/impcat/pvc-id-card.html'],
  'im-lanyard': ['IndiaMART: printed lanyards', 'https://m.indiamart.com/impcat/printed-lanyard.html'],
  'im-direction': ['IndiaMART: direction sign boards', 'https://m.indiamart.com/impcat/direction-sign-board.html'],
  'im-nameboard': ['IndiaMART: name boards and name plates', 'https://m.indiamart.com/impcat/name-board.html'],
  'im-pen': ['IndiaMART: promotional pens', 'https://m.indiamart.com/impcat/promotional-pen.html'],
  'im-mug': ['IndiaMART: promotional mugs', 'https://m.indiamart.com/impcat/promotional-mug.html'],
  'im-wallcal': ['IndiaMART: wall calendars', 'https://m.indiamart.com/impcat/wall-calendar.html'],
  'im-deskcal': ['IndiaMART: desk calendars', 'https://m.indiamart.com/impcat/desk-calendar.html'],
  'im-diary': ['IndiaMART: printed diaries', 'https://m.indiamart.com/impcat/printed-diary.html'],
  'im-bottle': ['IndiaMART: promotional bottles', 'https://m.indiamart.com/impcat/promotional-bottles.html'],
  'im-nonwoven': ['IndiaMART: printed non-woven bags', 'https://m.indiamart.com/impcat/printed-non-woven-bags.html'],
  'im-keychain': ['IndiaMART: promotional keychains', 'https://m.indiamart.com/impcat/promotional-keychain.html'],
  'im-memento': ['IndiaMART: acrylic mementos', 'https://m.indiamart.com/impcat/acrylic-memento.html'],
  'im-school': ['IndiaMART: school uniforms', 'https://m.indiamart.com/impcat/school-uniforms.html'],
  'im-corporate': ['IndiaMART: corporate uniforms', 'https://m.indiamart.com/impcat/corporate-uniform.html'],
  'im-tshirt': ['IndiaMART: promotional T-shirts', 'https://m.indiamart.com/impcat/promotional-t-shirts.html'],
  'im-cap': ['IndiaMART: promotional caps', 'https://m.indiamart.com/impcat/promotional-cap.html'],
  'im-menu': ['IndiaMART: menu card printing', 'https://m.indiamart.com/impcat/menu-card-printing-services.html'],
  'im-foodbox': ['IndiaMART: paper food boxes', 'https://m.indiamart.com/impcat/paper-food-boxes.html'],
  'im-paperbag': ['IndiaMART: customised paper bags', 'https://m.indiamart.com/impcat/customised-paper-bag.html'],
  'im-label': ['IndiaMART: label stickers', 'https://m.indiamart.com/impcat/label-sticker.html'],
  'im-qr': ['IndiaMART: QR code stands', 'https://m.indiamart.com/impcat/qr-code-stand.html'],
  'im-social': ['IndiaMART: social media design services', 'https://m.indiamart.com/impcat/social-media-design.html'],
  'im-motion': ['IndiaMART: motion graphics services', 'https://m.indiamart.com/impcat/motion-graphics-design-service.html'],
  'manypixels': ['ManyPixels: social media design cost (2026)', 'https://manypixels.co/blog/social-media-design/cost'],
  'noir': ['Noir & Blanco: social media packages in India', 'https://noirandblanco.com/social-media-marketing-packages-in-india/'],
  'irpr-video': ['IRPR: video production cost in India', 'https://irpr.agency/video-production-cost-in-india'],
  'irpr-explainer': ['IRPR: explainer video cost', 'https://irpr.agency/blog/explainer-video-cost-pune'],
  'irpr-landing': ['IRPR: landing page development cost', 'https://irpr.agency/blog/landing-page-development-cost-best-practices-conversion-optimization-2026'],
  'videotto': ['Videotto: video editing cost 2026', 'https://www.videotto.com/blog/how-much-does-video-editing-cost-global-2026'],
  'motionbox': ['Motionbox: what to charge for AI UGC ads (2026)', 'https://motionbox.io/blog/how-much-to-charge-clients-for-ai-ugc-ads'],
  'novoads': ['Novoads: video ad production cost', 'https://novoads.ai/blog/video-ad-production-cost'],
  'sprak': ['Sprak Design: logo design cost in India', 'https://www.sprakdesign.com/logo-design-cost/'],
  'madegood': ['Made Good Designs: logo cost 2026', 'https://madegooddesigns.com/how-much-does-a-logo-cost/'],
  'filecamp': ['Filecamp: brand guideline essentials', 'https://filecamp.com/blog/brand-guidelines/'],
  'hostinger': ['Hostinger India: website cost 2026', 'https://www.hostinger.com/in/tutorials/website-cost'],
  'pce': ['Project Cost Estimator: website cost 2026', 'https://projectcostestimator.com/website-cost'],
  'indianweb': ['IndianWeb: e-commerce development cost 2026', 'https://indianweb.substack.com/p/e-commerce-website-development-cost'],
  'upgrowth-maint': ['upGrowth: website maintenance cost 2026', 'https://upgrowth.in/website-maintenance-cost-in-india-and-global/'],
  'upgrowth-seo': ['upGrowth: SEO services cost in India', 'https://upgrowth.in/seo-services-cost-in-india/'],
  'whitespark': ['Whitespark: Google Business Profile guide', 'https://whitespark.ca/google-business-profile-guide/'],
  'codingclave': ['Codingclave: custom software cost in India (Oct 2026)', 'https://codingclave.com/blog/custom-software-development-cost-india'],
  'zartek': ['Zartek: app development cost in India 2026', 'https://www.zartek.in/app-development-cost-in-india-2026/'],
  'ecorpit': ['ECorpIT: app cost bands (Clutch data)', 'https://ecorpit.com/app-development-cost-in-india/'],
  'promatics': ['Promatics: SaaS development cost 2026', 'https://www.promaticsindia.com/blog/saas-development-cost-2026-complete-breakdown-for-startups-2'],
  'hyperleap': ['Hyperleap: WhatsApp chatbot pricing in India 2026', 'https://hyperleap.ai/blog/whatsapp-chatbot-pricing-india-2026'],
  'decipher': ['Decipher: AI chatbot cost in India 2026', 'https://decipherconsultancy.in/blog/how-much-does-an-ai-chatbot-cost-in-india-2026/'],
};
