// Sample product photos from Unsplash (free to use under the Unsplash License, https://unsplash.com/license).
// They show the kind of product, not our own finished work. Credits are shown on each product page and on licenses.html.
// One line per product: id=photoId~Photographer~username^nextPhoto...
const RAW = `
shop-signboards=1653223792847-fdd1edef13b0~Brice Cooper~brice_cooper18^1676917824872-83f2fa04898b~James Kirkup~james_open^1777151409209-8bdbbe478497~Adam Kring~adamkring
flex-boards=1693031630369-bd429a57f115~Geri Sakti~msgr^1503694978374-8a2fa686963a~Bank Phrom~bank_phrom^1776333089054-bfed3bd9a1f4~Valiant Lambda~valiant_lambda
glow-sign-boards=1765052336947-e3672c065803~Valentin~omikron^1772755069161-06dfa2b7354d~Jon Tyson~jontyson^1771686264285-516d070de96d~Michael Lebedew~wedebel
led-sign-boards=1587018710457-e3dbc199bab3~Susan Q Yin~syinq^1661298889141-14da83db9821~Carp Jennifer~jenjen005^1709316457778-7fdd7f84bf27~Glowplug Media~glowplug_media
acrylic-signage=1780525168294-5d19359c6ec2~Kacper Korgul~nettle161
3d-letter-signage=1762868387680-ac65a289f879~Zoshua Colah~zoshuacolah^1616037502269-72da0baf7d71~Zone Three~zonethree^1648760021569-15b7467a692b~Hermann Wittekopf - kmkb~von_muenchen
3d-led-letters=1618491311827-24c68a1aa2be~Nick Fewings~jannerboy62^1785482451791-923a3725dd13~alizy xiao~alizyxiao
acp-signage=1768225324952-07dc4e64a875~T~tanyabarrow^1564419965579-5da68ffdf3af~Candid~candid^1767491582504-3b0218c0ff82~zai Dan~danzai_ph
promotional-banners=1580828343064-fde4fc206bc6~Markus Spiske~markusspiske^1532795986-dbef1643a596~Justin Lim~justinlim^1577538928305-3807c3993047~Claudio Schwarz~purzlbaum
standees=1698581075105-924b6c70b5d6~Lalit Kumar~klalit^1711390811443-ae5a33144f7d~Jonny Gios~supergios^1766384093125-f00a4eb8a392~Kouji Tsuru~pafuxu
led-neon-signs=1605101020792-e19a3687ba7a~Anders Norrback Bornholm~osirisguitar^1570514865285-2de0d16e3efc~Jean-Karim Dangou~shotbykarim^1604829683273-f46813c02381~Олег Мороз~tengyart
hoardings-and-billboards=1635873432087-50eba4c4392d~Patrick Robert Doyle~teapowered^1699480114704-ac153307d2a0~Mykyta Kravčenko~makitrenko
sunboard-and-foam-board-prints=1761225646548-bc92fea0dc72~Ela De Pure~eladepure^1788247358858-c2e6b6941640~Declan Sun~declansun^1761195689615-9469b65dac01~Trans Russia~transrussia
one-way-vision-and-window-graphics=1774872781975-b1149a9cd24b~Haberdoedas~haberdoedas^1770580684136-db0c53a6c8a1~Etienne Girardet~etiennegirardet^1764921249608-da7042519f48~Farnaz Kohankhaki~farnaz________
vehicle-branding=1777144635373-52419b0581bf~sourmarb~sourmarb
complete-offline-campaign=1672984581706-6c1f02cd02ed~Jannet Serhan~printandproper
shop-opening-banners=1593238404535-cda7ae2fe50b~Tim Mossholder~timmossholder^1761475456154-6c5373bbd2bb~أخٌ‌في‌الله~mhrezaa^1782834185289-a45b68a3b8bd~Jugwang Son~sonjugwang
political-and-event-banners=1678320532422-6588243cae14~Anastasiia Nelen~mnelen^1509580357930-a711cf9d888d~Chris Slupski~kslupski^1678320576953-54f720140881~Anastasiia Nelen~mnelen
promotional-flex-boards=1743670476920-81ca1b70a4ba~Zoshua Colah~zoshuacolah^1787585497258-d617ccbfff76~Jake Kling~itsjakekling^1790000812138-8272af65ecd2~Ridham Supriyanto~ridhamsupriyanto
birthday-and-wedding-backdrops=1762709118823-7fe9c9afa8ff~AL Kaium~al_kaium^1785336872920-4c345ff9d897~HACA Wedding Film~hacawedding^1780303864944-737d88c789f4~Simply thrilled~simplythrilled_
posters=1563050860-87d45eaaeabb~Jonne~jiihu^1626814026160-2237a95fc5a0~Tyson Moultrie~tysonmoultrie
visiting-cards=1718670013921-2f144aba173a~Julian Tong~juliantong^1777652918682-dec5c79d1301~Vagaro~vagaro^1628891439478-c613e85af7d6~Giorgio Trovato~giorgiotrovato
premium-visiting-cards=1777652918753-d66882b15391~Vagaro~vagaro^1782857690704-c4341b240487~T. LUTZ~motiondepthfx
pamphlets-and-leaflets=1769893715447-8f12c382e49c~Lola Waligora-Thomas~lo_thms^1634833650314-ed773bcc5b23~MJH SHIKDER~mjh_shikder^1563097013-a1df1d1fd1c7~Erika Giraud~erikasayssmile
brochures=1632062549850-44a0a6eede16~pmv chamara~pmvch^1769490315625-6e669d53e698~Declan Sun~declansun
catalogues-and-booklets=1549298222-1c31e8915347~Faune Magazine~faunemag^1769490315617-364167415df8~Declan Sun~declansun
letterheads=1592471657072-8f998e2af6aa~Razvan Dumitrasconiu~dumitrasconiudesign^1520764588094-8fc067746a8e~Ana Cruz~anacruzbaeza^1505744386214-51dba16a26fc~Kelly Sikkema~kellysikkema
bill-books=1778113048525-387745cbbc6c~Testeur de CBD~testeurdecbd^1771758249853-415175dc29b9~Camilo Rueda López~kozumel^1703170815991-4737f0d0c8fd~Heather Green~heathergreengreen
envelopes=1649019489428-70f505daacd6~Valeria Reverdo~lereverdo^1648994605501-fe0a391d2653~Valeria Reverdo~lereverdo^1762427354358-b3e63aa7b308~Cht Gsml~karepesinde
wedding-and-invitation-cards=1632610992723-82d7c212f6d7~Fiona Murray-deGraaff~fionamurrayphoto^1764731080480-58b18e519bd9~Micah & Sammie Chaffin~micahandsammiechaffin^1516617442634-75371039cb3a~Annie Spratt~anniespratt
id-cards-and-lanyards=1671376354112-6de3d08b97af~jim~skill01^1769029269011-b32f787c288c~Sasun Bughdaryan~sasun1990^1783120947302-0ac75b8a9e35~Jelly Marketing~jellymarketing
direction-boards=1717654815135-b3e9894b434a~Susan Q Yin~syinq^1533073526757-2c8ca1df9f1c~Javier Allegue Barros~soymeraki^1575178598981-7cfb7717d62b~Anne Rosly~anne_rose
reception-signs=1771918521550-13c68e5d2173~Wafiq Raza~wafiqraza^1705909773284-bcbbad9a4023~mahmoud azmy~mahmoud_azmy
office-and-door-name-plates=1632858265907-961f1454ccf6~2H Media~2hmedia^1778926593800-8594d9b61553~Marcel Strauß~martzzl^1788870956654-8ad1db4d31f6~MChe Lee~mclee
house-name-plates=1748435141737-ef3b35211e34~Haberdoedas~haberdoedas^1744975705191-6d53371d88b2~Haberdoedas~haberdoedas^1786821443561-ff146a0d1b84~Phil Hearing~philhearing
printed-pens=1583485088034-697b5bc54ccd~Kiran CK~kiranck123^1585336261022-680e295ce3fe~Liviu C.~liviu_c
metal-pens=1546493918-8bcb44f37c8e~CHUTTERSNAP~chuttersnap^1589520869831-1af9ae4fd7db~Syed Hussaini~syhussaini
printed-mugs=1650959858546-d09833d5317b~Mediamodifier~mediamodifier^1514228742587-6b1558fcca3d~NordWood Themes~nordwood^1643946404043-178456b0e3f8~Bec R.~pixelcolours
wall-calendars=1543168256-4ae2229821f1~Maddi Bazzocco~maddibazzocco^1578625155481-7bc40a6481b6~Nathan Dumlao~nate_dumlao^1770250959829-de36726e99c4~LOGAN WEAVER | @LGNWVR~lgnwvr
desk-calendars=1769596722510-b92780d03424~Swello~getswello^1611988615248-5d4f0b9ac31e~Kyrie kim~kyrie3^1560420025-9453f02b4751~Behnam Norouzi~behy_studio
diaries-and-notebooks=1672256019300-9589d730bedd~Deepak Gupta~authordeepakgupta^1761322572550-967ea8c0bfd9~Clay Banks~claybanks^1598404349715-61c2b92cfed3~Lawrence Aritao~lawaritao
branded-water-bottles=1625708458528-802ec79b1ed8~quokkabottles~quokkabottle^1544003484-3cd181d17917~Karl Köhler~karlkoehler^1616118132534-381148898bb4~charlesdeluvio~charlesdeluvio
printed-bags=1574365569389-a10d488ca3fb~Brando Makes Branding~brandomakesbranding^1544816155-12df9643f363~Kelly Sikkema~kellysikkema^1780480999315-2c9b40d5085a~Caesar Akbar~caesarakbr
keychains=1727154085760-134cc942246e~Erika Löwe~erikalowe
trophies-and-mementos=1578269174936-2709b6aeb913~Giorgio Trovato~giorgiotrovato^1706374503312-7a4a4c030d2d~George Pisarevsky~impermanent
school-uniforms=1642140027867-e5983a32119c~Anjan~anjanvij^1692269725911-87697c558be1~Swastik Arora~swastikarora^1692269725836-fbd72e98883f~Swastik Arora~swastikarora
staff-uniforms=1763272594094-946e5be3ccbe~Vincent Leyva~b1snet^1790750541184-38813f22493f~Vitaly Gariev~silverkblack^1790750541233-3481ce66fbb9~Vitaly Gariev~silverkblack
promotional-t-shirts=1678872844677-d650b788709b~Alexander London~alxndr_london^1604508230015-5a54faf1fa56~Howard Bouchevereau~howardbouchevereau^1627225924765-552d49cf47ad~Bao Bao~baobao_2411
caps=1691256676359-20e5c6d4bc92~personalgraphic.com~personal_graphic^1560774358-d727658f457c~Angel Monsanto III~angelmonsanto_raw^1588850561407-ed78c282e89b~Mediamodifier~mediamodifier
hoodies-and-event-wear=1620799140188-3b2a02fd9a77~Mediamodifier~mediamodifier^1556821840-3a63f95609a7~Jannes Jacobs~jannesjacobs^1680292783974-a9a336c10366~Chris Lynch~chris_lynch_
menu-cards=1761515397001-c8e82879c4c0~Allen Y~yanahd^1731412235213-678ada5cd36b~Annie Spratt~anniespratt^1599250300435-b9693f21830d~Erik Mclean~introspectivedsgn
takeaway-packaging=1652862729869-2f4e80c1849d~Ambitious Studio* | Rick Barrett~weareambitious^1648587456176-4969b0124b12~Clair~clair_^1615887087343-6a32f45f27a4~Ambitious Studio* | Rick Barrett~weareambitious
paper-carry-bags=1616429368325-d5d7542b0ec3~Dmitry Mashkin~artcoastdesign^1760565030243-c92ed557e8da~Iuliia Pilipeichenko~pilipeichenko^1534452203293-494d7ddbf7e0~Jacek Dylag~dylu
product-labels-and-stickers=1691480208637-6ed63aac6694~personalgraphic.com~personal_graphic^1481900369621-54a7facacc6c~Amelia Bartlett~ameliabartlett^1634449277883-534da4f7c97a~pmv chamara~pmvch
qr-code-standees=1550482768-88b710a445fd~Mitya Ivanov~aka_opex^1595079676339-1534801ad6cf~Markus Winkler~markuswinkler^1571867424488-4565932edb41~David Dvořáček~dafidvor
instagram-posts-and-story-templates=1595039838779-f3780873afdd~Solen Feyissa~solenfeyissa^1622532832487-b18b9c7f23d3~Georgia de Lotz~georgiadelotz^1562147458-0c12e8d29f50~Gabrielle Henderson~gabriellefaithhenderson
facebook-and-instagram-ad-creatives=1611926653458-09294b3142bf~Adem AY~ademay^1563986768494-4dee2763ff3f~Austin Distel~austindistel^1622782914767-404fb9ab3f57~Georgia de Lotz~georgiadelotz
festival-and-sale-posters=1577083753695-e010191bacb5~Udayaditya Barua~nookscribe^1605292356183-a77d0a9c9d1d~Umesh Soni~umeshsonii^1635192592106-77a5aacbe1a3~Suchandra Roy Chowdhury~artsy_lens21
business-promotion-graphics=1724862936518-ae7fcfc052c1~Berke Citak~berctk^1759215524472-1b0686fdbd87~Swello~getswello^1683721003111-070bcc053d8b~Mariia Berezovsky~mariiaberezovsky
social-media-management=1675352161865-27816c76141a~Shutter Speed~shutter_speed_^1676276375742-9e3d10e39d45~Walls.io~walls_io^1694109010480-2f7aa9ceb339~manas rb~manas_rb
instagram-reels-and-youtube-shorts=1632094882991-3e7d693cfb6f~Taine Noble~nottainenoble^1632094623714-fbffa71c7adb~Taine Noble~nottainenoble^1632094623687-5643447fadcc~Taine Noble~nottainenoble
product-advertisements=1545242640-7c9e9cc07d23~Randy Fath~randyfath^1682078234868-412ec5566118~Onur Binay~onurbinay^1657472545027-1b62e720f41c~Marios Gkortsilas~mr_mgk
ai-generated-promotional-videos=1574717024653-61fd2cf4d44d~Peter Stumpf~peter_s^1780642213026-cf15a7676c6b~Andri Aeschlimann~andr1_aeschli^1528109966604-5a6a4a964e8d~Matthew Kwong~mattykwong1
animated-business-promos-and-explainers=1769731738826-a51acd5bddc7~Beatriz Cattel~bicattel^1532622785990-d2c36a76f5a6~Kaleidico~kaleidico^1769794370961-3cff43b1034e~Yen Vu~yenvu2410
logo-reveals-and-motion-graphics=1758073519996-6d3c63b4922c~jonakoh _~jonakoh^1669465716251-0973b3602278~vackground.com~vackground
music-and-lyric-videos=1560785219-cc81ab373cd3~Kyle Loftus~kyleloftusstudios^1632187981988-40f3cbaeef5e~Jakob Owens~jakobowens1^1723723467478-eb4667116137~Oleg Brovchenko~olegbrovchenko
logo-design=1611241893603-3c359704e0ee~Kelly Sikkema~kellysikkema^1713616147761-c126f8009c6f~Onkar Mehta~onkar_^1581464668854-0da56c32393c~Kit~kit
logo-and-brand-kit=1633533452148-a9657d2c9a5f~MK +2~mkmasdos^1763705857736-2b4f16a33758~Rochelle Lee~bestlifanna^1614036634955-ae5e90f9b9eb~Brands&People~brandsandpeople
business-card-design=1718670013988-c6e3edb92345~Julian Tong~juliantong^1599590984817-0c15f31b1fa5~THLT LCX~thlt_lcx
brand-guidelines=1654309184038-f9b689cfbdcb~2H Media~2hmedia^1654481414716-2f4ab5fe0fbe~2H Media~2hmedia
advertising-campaign-designs=1787239813767-4c348c9a2318~C~thecurlyone
business-websites=1496181133206-80ce9b88a853~Kari Shea~karishea^1525547719571-a2d4ac8945e2~Andras Vas~wasdrew^1542744095-291d1f67b221~Campaign Creators~campaign_creators
product-landing-pages=1634084462412-b54873c0a56d~Team Nocoloco~teamnocoloco^1648134859177-66e35b61e106~Team Nocoloco~teamnocoloco
online-portfolios=1467232004584-a241de8bcf5d~Lee Campbell~leecampbell^1502945015378-0e284ca1a5be~Kevin Bhagat~kevnbhagat^1507238691740-187a5b1d37b8~Ben Kolde~benkolde
lead-generation-pages=1648134859186-a05fb609f41e~Team Nocoloco~teamnocoloco^1642132652798-ae887edb9e9d~Team Nocoloco~teamnocoloco
e-commerce-websites=1768987439370-bd60d3d0b28b~V H~vhtm^1563013544-824ae1b704d3~rupixen~rupixen^1664455340023-214c33a9d0bd~Shutter Speed~shutter_speed_
custom-business-websites=1498050108023-c5249f4df085~Christopher Gower~cgower^1787839193855-766a9d729b91~Jakub Żerdzicki~jakubzerdzicki
website-maintenance=1555066931-4365d14bab8c~Arnold Francisca~clark_fransa^1607799279861-4dd421887fb3~Mohammad Rahmani~afgprogrammer^1484417894907-623942c8ee29~Emile Perron~emilep
android-apps=1592890288564-76628a30a657~Jonas Leupe~jonasleupe^1598327105666-5b89351aff97~Shiwa ID~shiwa_id^1772182137994-4158ac33bddd~Amanz~amanz
ios-apps=1511707171634-5f897ff02aa9~Rahul Chakraborty~hckmstrrahul^1510557880182-3d4d3cba35a5~Bagus Hernawan~bhaguz^1523206489230-c012c64b2b48~Neil Soni~neilsoniphotography
business-management-apps=1551288049-bebda4e38f71~Luke Chesser~lukechesser^1781246435700-afec19012b45~Ngital~ngital^1526628953301-3e589a6a8b74~Stephen Dawson~dawson2406
educational-apps=1603354350317-6f7aaa5911c5~Robo Wunderkind~robowunderkind^1604399852419-f67ee7d5f2ef~Sanjeev Mohindra~g1sanju^1585790050230-5dd28404ccb9~Daniel Romero~rmrdnl
web-apps-and-saas-products=1763718528755-4bca23f82ac3~prashant hiremath~prashantbh13^1686061592689-312bbfb5c055~1981 Digital~1981digital
website-app-package=1426024084828-5da21e13f5dc~Firmbee.com~firmbee^1759156771079-6fef5b8d66c9~Jakub Żerdzicki~jakubzerdzicki
business-automation=1787839227786-17f3149942a5~Jakub Żerdzicki~jakubzerdzicki^1759752393975-7ca7b302fcc6~Bluestonex~bluestonex_apphaus^1760952851538-17a59f691efe~Bluestonex~bluestonex_apphaus
ai-powered-tools-and-chatbots=1776797391265-01a0490d4c99~Brett Wharton~brettwharton^1662974770404-468fd9660389~kuu akura~akurakuu^1684369175833-4b445ad6bfb5~Mohamed Nohassi~coopery
custom-software=1781914476939-91a41b914899~Jeferson da Paulino~jeffersonjsp^1542831371-29b0f74f9713~Florian Olivo~florianolv
api-and-system-integrations=1695668548342-c0c1ad479aee~Kevin Ache~kevinache^1762163516269-3c143e04175c~Domaintechnik~fslfsl^1683322499436-f4383dd59f5a~Scott Rodgerson~scottrodgerson
local-seo-and-google-business-profile=1604357209793-fca5dca89f97~Tamas Tuzes-Katai~tamas_tuzeskatai^1548345680-f5475ea5df84~henry perks~hjkp^1569336415962-a4bd9f69cd83~Thomas Kinto~thomaskinto
song-mixing=1762952805560-130ccc74c3fa~Ayanangshu Biswas~ayanangshu^1618609377864-68609b857e90~James Kovin~james2k^1535406208535-1429839cfd13~Adi Goldstein~adigold1
song-mastering=1518972559570-7cc1309f3229~Dylan McLeod~son_of_media^1483000805330-4eaf0a0d82da~Sašo Tušar~sasotusar
mixing-mastering-package=1760780567530-389d8a3fba75~Soundsitive Studio~soundsitive^1598488035139-bdbb2231ce04~Caught In Joy~caught_in_joy^1531651008558-ed1740375b39~Leo Wieling~leowieling
ep-and-album-mastering=1781756547472-46813046281c~Dmitry Spravko~kaprion^1602848597941-0d3d3a2c1241~Brett Jordan~brett_jordan^1669801158950-f663cf15298c~Markus Spiske~markusspiske
`;

export const PHOTOS = {};
for (const line of RAW.trim().split('\n')) {
  const [id, list] = line.split('=');
  PHOTOS[id] = list.split('^').map(p => { const [photo, by, user] = p.split('~'); return { photo: `photo-${photo}`, by, user }; });
}

// Unsplash images are resized on their CDN: w = width in px, square crop by default.
export const img = (p, w = 600, h = w) => `https://images.unsplash.com/${p.photo}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;
export const credit = p => ({ by: p.by, href: `https://unsplash.com/@${p.user}?utm_source=ehproductions&utm_medium=referral` });
