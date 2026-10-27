#!/usr/bin/env python3
"""Builds the HTML pages of the EH Productions site with one shared nav and footer.
Usage: python3 build.py <site-folder>"""
import re, sys, html
from pathlib import Path

SITE = Path(sys.argv[1])
BASE = 'https://ebraheemhussain748.github.io/ehproductions/'
WA = 'https://wa.me/919389080059'
YT = 'https://www.youtube.com/channel/UCWhn9Tuk_qFfp__eVmOqNBQ'
IG = 'https://www.instagram.com/ebraheemhussainproductions/'
CSP = ("default-src 'self'; script-src 'self' https://www.gstatic.com https://www.google.com; style-src 'self' 'unsafe-inline'; "
       "img-src 'self' data: https://images.unsplash.com; font-src 'self'; media-src 'self'; "
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
  <meta name="theme-color" content="#0a0a0b">
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
  <link rel="preload" href="assets/fonts/font-serif-600.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/font-text-400.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preconnect" href="https://images.unsplash.com">
  <link rel="stylesheet" href="css/styles.css">{extra}
</head>'''

def nav(current=''):
    cur = lambda k: ' aria-current="page"' if k == current else ''
    return f'''  <a class="skip" href="#main">Skip to content</a>
  <div class="announce" id="announce" hidden></div>
  <header class="nav">
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
      <p class="foot__big"><a href="./#contact">Let’s make something<br>people remember.</a></p>
      <div class="foot__grid">
        <div>
          <h4>Shop</h4>
          <ul>
            <li><a href="catalog?type=offline">Print &amp; signage</a></li>
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
            <li><a href="./#faq">FAQ</a></li>
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
            <li><a data-link="email" href="mailto:ebraheemhussain748@gmail.com">ebraheemhussain748@gmail.com</a></li>
            <li>Mathura, Uttar Pradesh, India</li>
          </ul>
        </div>
      </div>
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
  <script type="module" src="js/{script}.js"></script>
</body>
</html>
'''
    (SITE / f'{name}.html').write_text(out)

# ---------------- home ----------------
HOME = f'''  <main id="main">
    <section class="hero">
      <div class="wrap">
        <p class="kicker">Ebraheem Hussain Productions · Mathura, India</p>
        <h1>We make brands <em>impossible to ignore.</em></h1>
        <p class="lede">AI video ads, print and signage, websites and music, all from one studio. Tell us what you need and get a fixed price on WhatsApp.</p>
        <div class="hero__cta">
          <a class="btn btn--dark" href="catalog">Explore services</a>
          <a class="btn btn--outline" data-link="whatsapp" href="{WA}" target="_blank" rel="noopener"><span data-icon="wa"></span>Chat on WhatsApp</a>
          <a class="btn btn--plan" href="plan" data-open-plan><span data-icon="bolt"></span>Build my plan</a>
        </div>
        <p class="hero__note">Courier all over India · Online work delivered anywhere · Reply within 24 hours</p>
      </div>
    </section>

    <section class="section about-sec" id="about" aria-labelledby="about-h">
      <div class="wrap about">
        <div class="reveal">
          <p class="kicker">About the studio</p>
          <h2 id="about-h">Small brands deserve big-brand ads.</h2>
          <p class="lede">Cinematic video, sharp print and websites that bring in enquiries, without a film crew or a studio budget.</p>
          <p>I’m Ebraheem Hussain. I combine AI video tools with editing, motion graphics and 3D, so a full commercial can be ready in days instead of weeks. The same studio designs the posters, banners, logos and name plates that carry your brand offline, and mixes and masters music too.</p>
          <ul class="facts">
            <li><b id="fact-items">93</b><span>services with prices</span></li>
            <li><b>Print + digital</b><span>under one roof</span></li>
            <li><b>All India</b><span>courier delivery</span></li>
          </ul>
        </div>
        <div class="about__card reveal">
          <img src="assets/img/logo-full.jpg" alt="Ebraheem Hussain Productions logo" width="900" height="685" loading="lazy">
          <h3>Awards &amp; certificates</h3>
          <ul class="awards" id="creds"></ul>
        </div>
      </div>
    </section>

    <section class="section section--white" aria-labelledby="svc-h">
      <div class="wrap">
        <div class="section__head reveal">
          <div><h2 id="svc-h">One studio.<br>Everything your brand needs.</h2></div>
          <a class="link" href="catalog">See all <span id="item-total">93</span> services <span data-icon="arrow"></span></a>
        </div>
        <div class="bento" id="bento"></div>
      </div>
    </section>

    <section class="section" aria-labelledby="pop-h">
      <div class="wrap">
        <div class="section__head reveal"><div><h2 id="pop-h">Popular right now.</h2><p class="lede">Average prices, fixed quote before we start.</p></div><a class="link" href="catalog">Open the shop <span data-icon="arrow"></span></a></div>
        <div class="rail" id="rail"></div>
      </div>
    </section>

    <section class="section section--white" id="process" aria-labelledby="process-h">
      <div class="wrap">
        <div class="section__head reveal"><div><h2 id="process-h">How it works.</h2></div></div>
        <ol class="steps reveal">
          <li><h3>Tell us the idea</h3><p>Pick from the shop or just send a message on WhatsApp.</p></li>
          <li><h3>Get a fixed price</h3><p>Share size, quantity and deadline. You get a concept and a fixed quote.</p></li>
          <li><h3>We make it</h3><p>Design, print, AI video, editing, code or sound, done in-house.</p></li>
          <li><h3>Delivered</h3><p>Couriered across India or sent online, with two rounds of changes on designs and videos.</p></li>
        </ol>
      </div>
    </section>

    <section class="section showcase" id="work" aria-labelledby="work-h">
      <div class="wrap">
        <div class="section__head reveal"><div><h2 id="work-h">Our work.</h2></div><a class="link" data-link="youtube" href="{YT}" target="_blank" rel="noopener">YouTube channel <span data-icon="arrow"></span></a></div>
        <div class="showcase__frame reveal" id="work-list"></div>
      </div>
    </section>

    <section class="section section--white" id="reviews" aria-labelledby="reviews-h">
      <div class="wrap">
        <div class="section__head"><div><h2 id="reviews-h">Worked with us?</h2><p class="lede">Tell other customers how it went. Reviews appear here after we check them.</p></div><button class="btn btn--outline" type="button" id="review-open" aria-expanded="false" aria-controls="review-form">Write a review</button></div>
        <div class="reviews" id="review-list" aria-live="polite" hidden></div>
        <form class="form panel" id="review-form" hidden novalidate style="background:var(--bg)">
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
          <div class="form__foot"><button class="btn btn--dark" type="submit">Submit review</button><p class="form__msg" role="status"></p></div>
          <p class="small">Your name, business and review will be shown on this website after we approve it. See our <a href="privacy">Privacy Policy</a>.</p>
        </form>
      </div>
    </section>

    <section class="section" id="faq" aria-labelledby="faq-h">
      <div class="wrap">
        <h2 id="faq-h" class="center reveal" style="margin-bottom:28px">Questions.</h2>
        <div class="faq" id="faq-list"></div>
      </div>
    </section>

    <section class="section section--dark" id="contact" aria-labelledby="contact-h">
      <div class="wrap contact">
        <div>
          <h2 id="contact-h" style="margin-bottom:12px">Tell us about your project.</h2>
          <p class="lede" style="margin-bottom:28px">A few lines is enough. We reply within 24 hours with ideas and a fixed price.</p>
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
                <option>₹5,000 – ₹15,000</option>
                <option>₹15,000 – ₹50,000</option>
                <option>₹50,000 – ₹1 lakh</option>
                <option>Above ₹1 lakh</option>
              </select></label>
            <label>Project details<textarea name="message" required minlength="10" maxlength="2000" rows="5" placeholder="What are you selling, who is it for, size or quantity, and when do you need it?"></textarea><span class="form__err" data-for="message"></span></label>
            <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
            <div class="form__foot"><button class="btn btn--light" type="submit">Send enquiry</button><p class="form__msg" role="status"></p></div>
            <p class="small">We use these details only to reply to your enquiry. We never sell or share them. See our <a href="privacy">Privacy Policy</a>.</p>
          </form>
        </div>
        <aside class="contact__side">
          <div class="contact__card">
            <h3>Prefer WhatsApp?</h3>
            <p>Most clients start here. Send a photo, a voice note or a reference and we take it from there.</p>
            <a class="btn btn--wa btn--block" data-link="whatsapp" href="{WA}" target="_blank" rel="noopener"><span data-icon="wa"></span>+91 93890 80059</a>
          </div>
          <div class="contact__card">
            <h3>Email</h3>
            <p><a data-link="email" href="mailto:ebraheemhussain748@gmail.com">ebraheemhussain748@gmail.com</a></p>
            <p>Mathura, Uttar Pradesh (near Delhi). Courier all over India, international delivery for big projects.</p>
          </div>
        </aside>
      </div>
    </section>
  </main>'''

PLAYER = '''
  <dialog class="player" id="player" aria-label="Video player">
    <div class="player__box" id="player-box"></div>
    <form method="dialog"><button class="btn btn--light btn--sm player__close">Close video</button></form>
  </dialog>'''

LD = '''
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"ProfessionalService","name":"Ebraheem Hussain Productions",
   "description":"AI video ads, websites, apps, branding, signage, flex banners, printing, uniforms, promotional gifts and music mixing and mastering. Courier all over India.",
   "url":"https://ebraheemhussain748.github.io/ehproductions/","image":"https://ebraheemhussain748.github.io/ehproductions/assets/img/og-image.jpg",
   "telephone":"+91 93890 80059","email":"ebraheemhussain748@gmail.com",
   "address":{"@type":"PostalAddress","addressLocality":"Mathura","addressRegion":"Uttar Pradesh","addressCountry":"IN"},
   "areaServed":["IN","US","Worldwide"],
   "sameAs":["https://www.youtube.com/channel/UCWhn9Tuk_qFfp__eVmOqNBQ","https://www.instagram.com/ebraheemhussainproductions/"]}
  </script>'''

page('index', 'Ebraheem Hussain Productions | AI video ads, print, signage, websites and music',
     'AI video ads, signboards, flex banners, visiting cards, uniforms, gifts, websites, apps and music mixing and mastering. Ebraheem Hussain Productions, Mathura (near Delhi). Courier all over India.',
     '', HOME, 'main', extra=LD, body_extra=PLAYER)

# ---------------- shop ----------------
CATALOG = '''  <main id="main">
    <div class="print-cover" aria-hidden="true"><img src="assets/img/logo-full.jpg" alt="" width="900" height="685"><p class="print-cover__title">Catalog &amp; prices</p><p>WhatsApp +91 93890 80059 · ebraheemhussain748@gmail.com · Mathura, Uttar Pradesh</p></div>
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
legal('404', 'Page not found | Ebraheem Hussain Productions', 'This page is not here.', base='/ehproductions/')
print('built')

# ---------------- cache stamp ----------------
# Browsers keep css/js for a while. Every build adds ?v=<hash of the code> to every css/js address,
# so a visitor never gets new HTML with an old stylesheet or script.
import hashlib
def stamp():
    code = sorted(SITE.glob('js/**/*.js')) + [SITE / 'css/styles.css']
    for f in code:
        f.write_text(re.sub(r"(\.js)\?v=[0-9a-f]+(['\"])", r"\1\2", f.read_text()))
    h = hashlib.sha1(b''.join(f.read_bytes() for f in code)).hexdigest()[:8]
    for f in SITE.glob('js/**/*.js'):
        t = re.sub(r"(from\s+['\"])(\.{1,2}/[^'\"?]+\.js)(['\"])", rf"\1\2?v={h}\3", f.read_text())
        t = re.sub(r"(^import\s+['\"])(\.{1,2}/[^'\"?]+\.js)(['\"])", rf"\1\2?v={h}\3", t, flags=re.M)
        f.write_text(re.sub(r"(import\(['\"])(\.{1,2}/[^'\"?]+\.js)(['\"]\))", rf"\1\2?v={h}\3", t))
    for f in SITE.glob('*.html'):
        s = re.sub(r'href="css/styles\.css(\?v=[0-9a-f]+)?"', f'href="css/styles.css?v={h}"', f.read_text())
        s = re.sub(r'src="js/([\w-]+)\.js(\?v=[0-9a-f]+)?"', rf'src="js/\1.js?v={h}"', s)
        f.write_text(s)
    print('stamp', h)
stamp()
