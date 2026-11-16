#!/usr/bin/env python3
"""Builds the HTML pages of the EH Productions site with one shared nav and footer.
Usage: python3 build.py <site-folder>"""
import re, sys, html
from pathlib import Path

SITE = Path(sys.argv[1])
BASE = 'https://ehproductions.in/'
WA = 'https://wa.me/919389080059'
YT = 'https://www.youtube.com/channel/UCWhn9Tuk_qFfp__eVmOqNBQ'
IG = 'https://www.instagram.com/ebraheemhussainproductions/'
CSP = ("default-src 'self'; script-src 'self' https://www.gstatic.com https://www.google.com; style-src 'self' 'unsafe-inline'; "
       "img-src 'self' data: https://images.unsplash.com; font-src 'self'; media-src 'self' blob:; "
       "connect-src 'self' https://firestore.googleapis.com https://*.googleapis.com https://formsubmit.co https://www.google.com; "
       "frame-src https://www.youtube-nocookie.com https://www.google.com; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests")

def head(title, desc, path, extra=''):
    return f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Security-Policy" content="{CSP}">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{html.escape(title)}</title>
  <meta name="description" content="{html.escape(desc)}">
  <meta name="theme-color" content="#0c0b0a">
  <link rel="canonical" href="{BASE}{path}">
  <link rel="icon" href="assets/img/favicon.png" type="image/png">
  <link rel="apple-touch-icon" href="assets/img/icon-192.png">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Ebraheem Hussain Productions">
  <meta property="og:title" content="{html.escape(title)}">
  <meta property="og:description" content="{html.escape(desc)}">
  <meta property="og:image" content="{BASE}assets/img/og-image.jpg">
  <meta property="og:url" content="{BASE}{path}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preload" href="assets/fonts/font-text-600.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/font-text-400.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/font-serif-700.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preconnect" href="https://images.unsplash.com">
  <link rel="stylesheet" href="css/styles.css">{extra}
</head>'''

def nav(current=''):
    cur = lambda k: ' aria-current="page"' if k == current else ''
    return f'''  <a class="skip" href="#main">Skip to content</a>
  <div class="progress" aria-hidden="true"></div>
  <header class="nav">
    <div class="announce" id="announce" hidden></div>
    <div class="wrap nav__row">
      <a class="brand" href="./" aria-label="Ebraheem Hussain Productions, home">
        <img src="assets/img/logo-mark-96.png" alt="" width="62" height="32">
        <span>Ebraheem Hussain<small>Productions</small></span>
      </a>
      <ul class="nav__links" id="nav-links">
        <li><a href="./#work">Work</a></li>
        <li><a href="catalog"{cur('catalog')}>Shop</a></li>
        <li><a href="catalog?cat=music">Music</a></li>
        <li><a href="./#about">About</a></li>
        <li><a href="./#contact">Contact</a></li>
      </ul>
      <button class="iconbtn" type="button" id="search-open" aria-expanded="false" aria-controls="searchpanel" aria-label="Search"><span data-icon="search"></span></button>
      <button class="iconbtn" type="button" data-open-quote aria-label="Open my list"><span data-icon="bag"></span><span class="badge qcount" data-n="0">0</span></button>
      <a class="btn btn--dark btn--sm nav__cta" href="./#contact">Get a quote</a>
      <button class="iconbtn nav__menu" type="button" id="menu-open" aria-label="Menu"><span data-icon="menu"></span></button>
    </div>
    <div class="searchpanel" id="searchpanel" hidden>
      <div class="wrap">
        <form action="catalog" method="get" role="search">
          <label class="searchbox"><span data-icon="search"></span><span class="sr">Search products and services</span><input id="hq" name="q" type="search" placeholder="Search signboards, visiting cards, video ads, mixing…" autocomplete="off" enterkeyhint="search"></label>
          <button class="btn btn--dark" type="submit">Search</button>
        </form>
        <ul class="suggest" id="suggest"></ul>
      </div>
    </div>
  </header>
'''

FOOTER = f'''  <footer class="foot">
    <div class="wrap">
      <div class="foot__top">
        <a class="brand brand--foot" href="./" aria-label="Ebraheem Hussain Productions, home">
          <img src="assets/img/logo-mark-96.png" alt="" width="62" height="32">
          <span>Ebraheem Hussain<small>Productions</small></span>
        </a>
        <p class="foot__line">Ads, signs, websites and music from one studio in Mathura. Courier across India.</p>
      </div>
      <div class="foot__grid">
        <div>
          <h4>Shop</h4>
          <ul>
            <li><a href="catalog?type=offline">Print and signage</a></li>
            <li><a href="catalog?cat=video">Video ads</a></li>
            <li><a href="catalog?cat=websites">Websites</a></li>
            <li><a href="catalog?cat=music">Music production</a></li>
          </ul>
        </div>
        <div>
          <h4>Studio</h4>
          <ul>
            <li><a href="./#work">Work</a></li>
            <li><a href="./#about">About</a></li>
            <li><a href="./#faq">Questions</a></li>
            <li><a href="./#contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4>Follow</h4>
          <ul>
            <li><a data-link="instagram" href="{IG}" target="_blank" rel="noopener">Instagram</a></li>
            <li><a data-link="youtube" href="{YT}" target="_blank" rel="noopener">YouTube</a></li>
            <li><a data-link="whatsapp" href="{WA}" target="_blank" rel="noopener">WhatsApp</a></li>
          </ul>
        </div>
        <div>
          <h4>Talk to us</h4>
          <ul>
            <li><a data-link="call" href="tel:+919389080059">+91 93890 80059</a></li>
            <li><a data-link="email" href="mailto:contact@ehproductions.in">contact@ehproductions.in</a></li>
            <li>Mathura, Uttar Pradesh, India</li>
          </ul>
        </div>
      </div>
      <p class="foot__mark" aria-hidden="true">Ebraheem Hussain</p>
      <div class="foot__base">
        <p>© <span class="year">2026</span> Ebraheem Hussain Productions. AI-generated visuals are labelled.</p>
        <p><a href="privacy">Privacy</a> · <a href="terms">Terms</a> · <a href="licenses">Licences</a></p>
        <p class="foot__rc">Forms are protected by reCAPTCHA. Google's <a href="https://policies.google.com/privacy" rel="noopener">Privacy Policy</a> and <a href="https://policies.google.com/terms" rel="noopener">Terms of Service</a> apply.</p>
      </div>
    </div>
  </footer>
  <a class="fab" data-link="whatsapp" href="{WA}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><span data-icon="wa"></span><span>Chat with us</span></a>
'''

def page(name, title, desc, path, main, script, current='', extra='', body_extra='', base=''):
    h = head(title, desc, path, extra)
    if base:
        h = h.replace('<meta charset="utf-8">', f'<meta charset="utf-8">\n  <base href="{base}">', 1)
    out = f'''{h}
<body class="page-{name}">
{nav(current)}
{main}

{FOOTER}{body_extra}
  <script type="module" src="js/motion.js"></script>
  <script type="module" src="js/{script}.js"></script>
</body>
</html>
'''
    (SITE / f'{name}.html').write_text(out)

# ---------------- home ----------------
# Hero: the visitor types a shop name and it appears on the lit board (js/hero.js). Below it, paper
# sections with scroll reveals (js/motion.js). The photos are Google Flow frames, labelled AI-generated.
TICK = ''.join(f'<li>{t}</li>' for t in ['Video ads', 'Shop signs', 'Websites', 'Logos', 'Flex banners', 'Visiting cards', 'Uniforms', 'Gifts', 'Music mixing', 'Apps'])
HOME = f'''  <main id="main">
    <section class="hero" id="your-sign" aria-labelledby="hero-h">
      <div class="hero__glow" aria-hidden="true"><i></i><i></i></div>
      <div class="wrap hero__grid">
        <div class="hero__copy">
          <p class="kicker hero__kicker">Signs · Video ads · Websites · Print</p>
          <h1 id="hero-h" class="show--hero hero__title"><span class="ln"><span>Your shop's name,</span></span> <span class="ln"><span>in <em>lights.</em></span></span></h1>
          <p class="hero__sub">Ebraheem Hussain Productions makes signs, video ads, websites and print for local businesses. Made in Mathura, with a fixed price before any work starts.</p>
          <div class="namer">
            <label for="shop-name">Type your shop's name and watch the board</label>
            <div class="namer__row"><input id="shop-name" type="text" maxlength="28" autocomplete="organization" enterkeyhint="done" placeholder="Sharma Sweets"></div>
            <p class="namer__note">We make the real board too. <a href="product?id=glow-sign-boards">Glow sign boards</a> start at <span data-from="glow-sign-boards">₹180 per sq ft</span>.</p>
          </div>
          <div class="hero-cta">
            <a class="btn btn--gold" href="#contact">Get a quote</a>
            <a class="btn btn--line" href="catalog">See prices</a>
          </div>
        </div>
        <figure class="hero__film" id="hero-film">
          <div class="plate" id="sign-plate">
            <img class="plate__img" src="assets/story/sign-dark.webp" alt="" width="720" height="1280" fetchpriority="high">
            <img class="plate__img plate__lit" src="assets/story/sign-lit.webp" alt="A blank sign board above a small clinic at night, switched on" width="720" height="1280">
            <div class="board" aria-hidden="true"><span class="board__name" id="board-name">Your shop</span></div>
          </div>
          <figcaption class="film__ai">AI-generated</figcaption>
        </figure>
      </div>
      <div class="ticker" aria-hidden="true"><ul>{TICK}</ul><ul>{TICK}</ul></div>
    </section>

    <section class="section" aria-labelledby="story-h">
      <div class="wrap story">
        <div data-in>
          <h2 id="story-h" class="story__lines"><span>Some businesses fill glass towers.</span> <span>Some fit in four feet.</span> <span>Every one deserves to be <i>seen.</i></span></h2>
          <p class="lede">A counter, a family name over the door, and regulars who know it by heart. We make the board on the street and the reel that gets shared.</p>
        </div>
        <div class="story__media" data-in>
          <figure class="story__photo">
            <img src="assets/story/shop.webp" alt="A small sweet shop on a busy street at night, the owner standing in the doorway under his lit sign" width="720" height="1280" loading="lazy">
            <figcaption class="film__ai">AI-generated</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section class="section section--alt" id="services" aria-labelledby="range-h">
      <div class="wrap">
        <div class="section__head" data-in>
          <div><p class="kicker">What we make</p><h2 id="range-h" class="show--lg">One studio. Five crafts.</h2></div>
          <p class="lede">Prices are average market rates we checked. You get a fixed quote before any work starts.</p>
        </div>
        <div class="bento" data-stagger>
          <a class="svc svc--a" href="catalog?cat=video">
            <span class="svc__frame"><img src="assets/story/rail-video.webp" alt="AI-generated frame: a founder filming her product on a turntable" width="720" height="1280" loading="lazy"></span>
            <span class="svc__go" data-icon="arrow"></span>
            <h3>Video ads</h3>
            <p>AI commercials, reels and product films.</p>
            <p class="svc__price" data-from="ai-generated-promotional-videos">From ₹3,000 per 15 to 30 s ad</p>
          </a>
          <a class="svc svc--b" href="catalog?cat=signage">
            <span class="svc__frame"><img src="assets/story/rail-sign.webp" alt="AI-generated frame: a lit sweet shop sign above a busy street at night" width="720" height="1280" loading="lazy"></span>
            <span class="svc__go" data-icon="arrow"></span>
            <h3>Signs</h3>
            <p>Shop boards, glow signs, 3D letters and LED.</p>
            <p class="svc__price" data-from="shop-signboards">From ₹50 per sq ft</p>
          </a>
          <a class="svc svc--c" href="catalog?cat=websites">
            <span class="svc__frame"><img src="assets/story/rail-web.webp" alt="A website we built, on a phone screen" width="720" height="1280" loading="lazy"></span>
            <span class="svc__go" data-icon="arrow"></span>
            <h3>Websites</h3>
            <p>Fast sites that bring in enquiries.</p>
            <p class="svc__price" data-from="business-websites">From ₹10,000 per website</p>
          </a>
          <a class="svc svc--d" href="catalog?cat=branding">
            <span class="svc__frame svc__frame--logo"><img src="assets/img/logo-full.jpg" alt="The Ebraheem Hussain Productions logo" width="900" height="685" loading="lazy"></span>
            <span class="svc__go" data-icon="arrow"></span>
            <h3>Branding</h3>
            <p>Logos, brand kits and campaign designs.</p>
            <p class="svc__price" data-from="logo-design">From ₹1,500 per logo</p>
          </a>
          <a class="svc svc--e" href="catalog?cat=music">
            <span class="svc__frame"><img src="assets/story/rail-music.webp" alt="AI-generated frame: a singer in headphones listening back in a studio" width="720" height="1280" loading="lazy"></span>
            <span class="svc__go" data-icon="arrow"></span>
            <h3>Music</h3>
            <p>Mixing and mastering, ready for release.</p>
            <p class="svc__price" data-from="mixing-mastering-package">From ₹6,000 per song</p>
          </a>
          <div class="bento__more">
            <p><strong>Visiting cards, flex, uniforms, gifts and apps</strong> are in the shop as well. Not sure what you need? Answer 6 quick questions and get a plan.</p>
            <div><a class="btn btn--gold" href="catalog">Open the shop</a><a class="btn btn--line" href="plan" data-open-plan>Build my plan</a></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section work" id="work" aria-labelledby="work-h">
      <div class="wrap">
        <div class="section__head" data-in>
          <div><p class="kicker">Now showing</p><h2 id="work-h" class="show--lg">Films we made.</h2></div>
          <p class="lede">Made in-house with AI video tools, editing, motion graphics and sound design.</p>
        </div>
        <div class="reels" id="work-list" data-stagger></div>
        <p class="work__links"><a class="link" data-link="youtube" href="{YT}" target="_blank" rel="noopener">YouTube <span data-icon="arrow"></span></a> <a class="link" data-link="instagram" href="{IG}" target="_blank" rel="noopener">Instagram <span data-icon="arrow"></span></a></p>
      </div>
    </section>

    <section class="section about-sec" id="about" aria-labelledby="about-h">
      <div class="wrap about">
        <div class="about__text" data-in>
          <p class="kicker">The studio</p>
          <h2 id="about-h" class="show--lg">Made in Mathura.</h2>
          <p class="lede">I'm Ebraheem Hussain. I make video ads with AI tools and finish them with editing, motion graphics and 3D, so a full commercial is ready in days.</p>
          <p>The same studio designs the posters, banners, logos and name plates that carry your brand offline, and mixes and masters music too.</p>
          <ul class="facts">
            <li><b id="fact-items" data-count>93</b><span>services with prices</span></li>
            <li><b>One studio</b><span>for print and digital</span></li>
            <li><b>All India</b><span>courier delivery</span></li>
          </ul>
        </div>
        <div class="about__card" data-in>
          <img src="assets/img/logo-full.jpg" alt="Ebraheem Hussain Productions logo" width="900" height="685" loading="lazy">
          <h3>Awards and certificates</h3>
          <ul class="awards" id="creds"></ul>
        </div>
      </div>
    </section>

    <section class="section section--alt" id="process" aria-labelledby="process-h">
      <div class="wrap">
        <div data-in><p class="kicker">Four steps</p><h2 id="process-h" class="show--md">How it works.</h2></div>
        <ol class="steps" data-stagger>
          <li><h3>Tell us the idea</h3><p>Pick something from the shop, or send a message on WhatsApp.</p></li>
          <li><h3>Get a fixed price</h3><p>Share the size, quantity and deadline. You get a concept and a fixed quote.</p></li>
          <li><h3>We make it</h3><p>Design, print, AI video, editing, code or sound, all done in-house.</p></li>
          <li><h3>Delivered</h3><p>Couriered across India or sent online. Designs and videos include two rounds of changes.</p></li>
        </ol>
      </div>
    </section>

    <section class="section" aria-labelledby="pop-h">
      <div class="wrap">
        <div class="section__head" data-in><div><p class="kicker">From the shop</p><h2 id="pop-h" class="show--md">Popular right now.</h2><p class="lede">Average prices. Your quote is fixed before we start.</p></div><a class="link" href="catalog">Open the shop <span data-icon="arrow"></span></a></div>
        <div class="rail" id="rail" data-stagger></div>
      </div>
    </section>

    <section class="section section--alt" id="reviews" aria-labelledby="reviews-h">
      <div class="wrap">
        <div class="section__head" data-in><div><p class="kicker">Reviews</p><h2 id="reviews-h" class="show--md">Worked with us?</h2><p class="lede">Tell other customers how it went. Reviews show up here after we check them.</p></div><button class="btn btn--line" type="button" id="review-open" aria-expanded="false" aria-controls="review-form">Write a review</button></div>
        <div class="reviews" id="review-list" aria-live="polite" hidden></div>
        <form class="form panel" id="review-form" hidden novalidate>
          <div class="form__row">
            <label>Your name<input name="name" required maxlength="80" autocomplete="name"></label>
            <label>Business (optional)<input name="business" maxlength="80" autocomplete="organization"></label>
          </div>
          <fieldset class="stars">
            <legend>Rating</legend>
            <label><input type="radio" name="rating" value="5" checked>5</label>
            <label><input type="radio" name="rating" value="4">4</label>
            <label><input type="radio" name="rating" value="3">3</label>
            <label><input type="radio" name="rating" value="2">2</label>
            <label><input type="radio" name="rating" value="1">1</label>
          </fieldset>
          <label>Your review<textarea name="text" required maxlength="800" rows="4"></textarea></label>
          <div class="form__foot"><button class="btn btn--gold" type="submit">Submit review</button><p class="form__msg" role="status"></p></div>
          <p class="small">Your name, business and review will be shown on this website after we approve it. See our <a href="privacy">Privacy Policy</a>.</p>
        </form>
      </div>
    </section>

    <section class="section" id="faq" aria-labelledby="faq-h">
      <div class="wrap faq-wrap">
        <div data-in><p class="kicker">Good to know</p><h2 id="faq-h" class="show--md">Questions.</h2></div>
        <div class="faq" id="faq-list" data-in></div>
      </div>
    </section>

    <section class="section close" id="contact" aria-labelledby="contact-h">
      <div class="wrap contact">
        <div data-in>
          <p class="kicker">Start here</p>
          <h2 id="contact-h" class="show--lg">Let's get <span id="close-name">your business</span> seen.</h2>
          <p class="lede">A few lines is enough. We reply within 24 hours with ideas and a fixed price.</p>
          <form class="form" id="lead-form" novalidate>
            <div class="form__row">
              <label>Your name<input name="name" required maxlength="80" autocomplete="name" placeholder="For example: Rahul Sharma"><span class="form__err" data-for="name"></span></label>
              <label>WhatsApp number<input name="phone" type="tel" inputmode="tel" required maxlength="16" autocomplete="tel" placeholder="98765 43210"><span class="form__err" data-for="phone"></span></label>
            </div>
            <div class="form__row">
              <label>Email (optional)<input name="email" type="email" inputmode="email" maxlength="80" autocomplete="email" placeholder="name@example.com"><span class="form__err" data-for="email"></span></label>
              <label>What do you need?<select name="service" id="service-select"></select></label>
            </div>
            <label>Your budget<select name="budget">
                <option value="">Not sure yet</option>
                <option>Under ₹5,000</option>
                <option>₹5,000 to ₹15,000</option>
                <option>₹15,000 to ₹50,000</option>
                <option>₹50,000 to ₹1 lakh</option>
                <option>Above ₹1 lakh</option>
              </select></label>
            <label>Project details<textarea name="message" required minlength="10" maxlength="2000" rows="5" placeholder="What do you sell, who is it for, what size or quantity, and when do you need it?"></textarea><span class="form__err" data-for="message"></span></label>
            <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
            <div class="form__foot"><button class="btn btn--gold" type="submit">Send enquiry</button><p class="form__msg" role="status"></p></div>
            <p class="small">We use these details only to reply to your enquiry. We never sell or share them. See our <a href="privacy">Privacy Policy</a>.</p>
          </form>
        </div>
        <aside class="contact__side" data-in>
          <div class="contact__card">
            <h3>Prefer WhatsApp?</h3>
            <p>Most clients start here. Send a photo, a voice note or a reference and we take it from there.</p>
            <a class="btn btn--line btn--block" data-link="whatsapp" href="{WA}" target="_blank" rel="noopener"><span data-icon="wa"></span>+91 93890 80059</a>
          </div>
          <div class="contact__card">
            <h3>Email</h3>
            <p><a data-link="email" href="mailto:contact@ehproductions.in">contact@ehproductions.in</a></p>
            <p>Mathura, Uttar Pradesh (near Delhi). Courier across India, and international delivery for big projects.</p>
          </div>
        </aside>
      </div>
    </section>
  </main>'''

PLAYER = '''
  <dialog class="player" id="player" aria-label="Video player">
    <div class="player__box" id="player-box"></div>
    <form method="dialog"><button class="btn btn--gold btn--sm player__close">Close video</button></form>
  </dialog>
  <script type="module" src="js/hero.js"></script>'''

PRELOAD = '''
  <link rel="preload" as="image" href="assets/story/sign-dark.webp" fetchpriority="high">'''

LD = '''
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"ProfessionalService","name":"Ebraheem Hussain Productions",
   "description":"AI video ads, websites, apps, branding, signage, flex banners, printing, uniforms, promotional gifts and music mixing and mastering. Courier all over India.",
   "url":"https://ehproductions.in/","image":"https://ehproductions.in/assets/img/og-image.jpg",
   "telephone":"+91 93890 80059","email":"contact@ehproductions.in",
   "address":{"@type":"PostalAddress","addressLocality":"Mathura","addressRegion":"Uttar Pradesh","addressCountry":"IN"},
   "areaServed":["IN","US","Worldwide"],
   "sameAs":["https://www.youtube.com/channel/UCWhn9Tuk_qFfp__eVmOqNBQ","https://www.instagram.com/ebraheemhussainproductions/"]}
  </script>'''

page('index', 'Ebraheem Hussain Productions | AI video ads, print, signage, websites and music',
     'AI video ads, signboards, flex banners, visiting cards, uniforms, gifts, websites, apps and music mixing and mastering. Ebraheem Hussain Productions, Mathura (near Delhi). Courier all over India.',
     '', HOME, 'main', extra=LD + PRELOAD, body_extra=PLAYER)

# ---------------- shop ----------------
CATALOG = '''  <main id="main">
    <div class="print-cover" aria-hidden="true"><img src="assets/img/logo-full.jpg" alt="" width="900" height="685"><p class="print-cover__title">Catalog &amp; prices</p><p>WhatsApp +91 93890 80059 · contact@ehproductions.in · Mathura, Uttar Pradesh</p></div>
    <div class="wrap">
      <ol class="crumbs" id="crumbs"><li><a href="./">Home</a></li><li>Shop</li></ol>
      <div class="shop-head">
        <h1 id="shop-title">Shop.</h1>
        <p class="lede" id="shop-sub">Everything we make, with prices. Add what you need to your list and send it in one WhatsApp message.</p>
        <label class="searchbox"><span data-icon="search"></span><span class="sr">Search the shop</span><input id="cq" type="search" placeholder="Search signboards, cards, video ads, mixing…" autocomplete="off" enterkeyhint="search"></label>
        <p class="small" style="margin:14px 0 0">Not sure what you need? <a class="link" href="plan" data-open-plan>Answer 6 quick questions and get a plan <span data-icon="arrow"></span></a></p>
      </div>
    </div>
    <div class="filterbar">
      <div class="wrap filterbar__row">
        <div class="seg" role="group" aria-label="Offline or online" id="group-filter">
          <button type="button" data-group="all" aria-pressed="true">All</button>
          <button type="button" data-group="offline" aria-pressed="false">Print</button>
          <button type="button" data-group="online" aria-pressed="false">Digital</button>
        </div>
        <ul class="pills" id="cat-filter" aria-label="Categories"></ul>
      </div>
    </div>
    <div class="wrap">
      <div class="toolbar">
        <p id="result-count" aria-live="polite">Loading…</p>
        <div class="toolbar__r">
          <button class="linkbtn" type="button" id="clear" hidden>Clear filters</button>
          <label class="sr" for="sort">Sort</label>
          <select id="sort"><option value="">Recommended</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="az">Name: A to Z</option></select>
          <div class="seg" role="group" aria-label="Currency" id="currency"><button type="button" data-cur="0" aria-pressed="true">₹</button><button type="button" data-cur="1" aria-pressed="false">$</button></div>
        </div>
      </div>
      <div class="pgrid" id="results"><noscript><p>Turn on JavaScript to see the shop, or message us on WhatsApp.</p></noscript></div>
      <div class="empty" id="empty" hidden>
        <h2>Nothing matches that yet.</h2>
        <p>We make a lot more than this list. Tell us what you need and we will price it for you.</p>
        <p><a class="btn btn--wa" id="empty-wa" href="https://wa.me/919389080059" target="_blank" rel="noopener">Ask on WhatsApp</a> <button class="btn btn--outline" type="button" id="empty-clear">Show everything</button></p>
      </div>
      <div class="shop-foot">
        <button class="linkbtn" type="button" id="print">Save as PDF or print</button>
        <details class="sources">
          <summary>How prices were checked</summary>
          <p class="small">Average market rates from printers, sign makers, gift suppliers, studios and agencies, checked online. Your final price depends on size, quantity and design.</p>
          <ul id="source-list"></ul>
        </details>
      </div>
    </div>
  </main>'''
page('catalog', 'Shop | Ebraheem Hussain Productions',
     'Signboards, flex banners, visiting cards, uniforms, gifts, AI video ads, logos, websites, apps and music mixing, each with a price. Courier all over India.',
     'catalog', CATALOG, 'catalog', current='catalog')

# ---------------- product ----------------
PRODUCT = '''  <main id="main">
    <div class="wrap" id="pd-root">
      <ol class="crumbs"><li><a href="./">Home</a></li><li><a href="catalog">Shop</a></li></ol>
      <p id="pd-loading" style="padding:40px 0">Loading…</p>
      <noscript><p>Turn on JavaScript to see this product, or open the <a href="catalog">shop</a>.</p></noscript>
    </div>
  </main>'''
page('product', 'Product | Ebraheem Hussain Productions', 'Product details, price and how to order from Ebraheem Hussain Productions.',
     'product', PRODUCT, 'product', current='catalog')

# ---------------- plan builder ----------------
PLAN = '''  <main id="main">
    <div class="wrap" id="plan-root">
      <p style="padding:60px 0">Loading…</p>
      <noscript><p>Turn on JavaScript to build your plan, or message us on WhatsApp.</p></noscript>
    </div>
  </main>'''
page('plan', 'Build my plan | Ebraheem Hussain Productions', 'Answer 6 quick questions and get a short plan of exactly what your business needs, with a price estimate.',
     'plan', PLAN, 'plan')

# ---------------- legal pages: keep their text, new frame ----------------
def legal(name, title, desc, fix=lambda m: m, base=''):
    src = (SITE / f'{name}.html').read_text()
    main = re.search(r'  <main id="main" class="legal">.*?</main>', src, re.S).group(0)
    for a, b in [('href="index.html#', 'href="./#'), ('href="index.html"', 'href="./"'), ('href="catalog.html', 'href="catalog'),
                 ('href="privacy.html"', 'href="privacy"'), ('href="terms.html"', 'href="terms"'), ('href="licenses.html"', 'href="licenses"'),
                 ('href="fonts-OFL.txt"', 'href="assets/fonts/fonts-OFL.txt"'), ('btn btn--ink', 'btn btn--dark')]:
        main = main.replace(a, b)
    page(name, title, desc, '' if name == '404' else name, fix(main), 'legal', base=base)

def lic_fix(m):
    m = re.sub(r'\s*<h2>Code</h2>\s*<p>The scroll story on the home page.*?</p>', '', m, flags=re.S)
    if '<h2>Product photos</h2>' in m: return m
    m = m.replace('The website design and code, the logo, the showreel, portfolio videos and their poster images are our own work.',
                  'The website design and code, the logo, the portfolio videos and their poster images are our own work.')
    m = m.replace('<h2>Fonts</h2>', '''<h2>Product photos</h2>
      <p>The product photos in the shop are sample photos from <a href="https://unsplash.com/?utm_source=ehproductions&amp;utm_medium=referral" target="_blank" rel="noopener">Unsplash</a>, used under the <a href="https://unsplash.com/license" target="_blank" rel="noopener">Unsplash License</a>. They show the kind of product, not our own finished work. Any logos or shop names that appear in them belong to their owners. Thank you to the photographers:</p>
      <ul class="credits" id="photo-credits"></ul>

      <h2>Fonts</h2>''')
    return m

legal('privacy', 'Privacy Policy | Ebraheem Hussain Productions', 'How Ebraheem Hussain Productions handles enquiry and review details.')
legal('terms', 'Terms | Ebraheem Hussain Productions', 'Terms for using the Ebraheem Hussain Productions website and ordering work.')
legal('licenses', 'Licences | Ebraheem Hussain Productions', 'Licences for the fonts, photos and services used on this website.', lic_fix)
legal('404', 'Page not found | Ebraheem Hussain Productions', 'This page is not here.', base='/')
print('built')

# ---------------- cache stamp ----------------
# Browsers keep css/js for a while. Every build adds ?v=<hash of the code> to every css/js address,
# so a visitor never gets new HTML with an old stylesheet or script.
import hashlib
def stamp():
    code = sorted(SITE.glob('js/**/*.js')) + sorted(SITE.glob('css/*.css'))
    for f in code:
        f.write_text(re.sub(r"(\.js)\?v=[0-9a-f]+(['\"])", r"\1\2", f.read_text()))
    h = hashlib.sha1(b''.join(f.read_bytes() for f in code)).hexdigest()[:8]
    for f in SITE.glob('js/**/*.js'):
        t = re.sub(r"(from\s+['\"])(\.{1,2}/[^'\"?]+\.js)(['\"])", rf"\1\2?v={h}\3", f.read_text())
        t = re.sub(r"(^import\s+['\"])(\.{1,2}/[^'\"?]+\.js)(['\"])", rf"\1\2?v={h}\3", t, flags=re.M)
        f.write_text(re.sub(r"(import\(['\"])(\.{1,2}/[^'\"?]+\.js)(['\"]\))", rf"\1\2?v={h}\3", t))
    for f in SITE.glob('*.html'):
        s = re.sub(r'href="css/([\w-]+)\.css(\?v=[0-9a-f]+)?"', rf'href="css/\1.css?v={h}"', f.read_text())
        s = re.sub(r'src="js/([\w-]+)\.js(\?v=[0-9a-f]+)?"', rf'src="js/\1.js?v={h}"', s)
        f.write_text(s)
    print('stamp', h)
stamp()
