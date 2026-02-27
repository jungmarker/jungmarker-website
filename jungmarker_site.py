"""
jungmarker.com — Nick Jungmarker Real Estate Website
Standalone Flask app on port 5002.
"""

from flask import Flask, render_template_string, request, jsonify
import os

app = Flask(__name__)

SITE_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Nick Jungmarker — Real Estate Agent | Maryland</title>
  <meta name="description" content="Nick Jungmarker is a top real estate agent in Maryland specializing in buying, selling, and investment properties. Expert local market knowledge.">

  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <script src="https://unpkg.com/three@0.150.1/build/three.min.js"></script>

  <style>
    :root {
      --navy:   #0f1b2d;
      --navy2:  #162032;
      --gold:   #c9a84c;
      --gold2:  #e8c86e;
      --white:  #ffffff;
      --off:    #f7f4ef;
      --gray:   #6b7280;
      --light:  #e5e0d8;
      --radius: 12px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    body {
      font-family: 'Inter', sans-serif;
      background: var(--white);
      color: var(--navy);
      line-height: 1.6;
    }

    /* ── NAV ── */
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 5%;
      height: 72px;
      background: rgba(15, 27, 45, 0.88);
      backdrop-filter: blur(14px);
      border-bottom: 1px solid rgba(201, 168, 76, 0.2);
    }
    .nav-logo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: var(--white); }
    .nav-logo span { color: var(--gold); }
    .nav-links { display: flex; gap: 36px; list-style: none; }
    .nav-links a { color: rgba(255,255,255,.75); text-decoration: none; font-size: 14px; font-weight: 500; letter-spacing: .3px; transition: color .2s; }
    .nav-links a:hover { color: var(--gold2); }
    .nav-cta { background: var(--gold); color: var(--navy) !important; padding: 9px 22px; border-radius: 6px; font-weight: 600 !important; transition: background .2s !important; }
    .nav-cta:hover { background: var(--gold2) !important; }
    .hamburger { display: none; cursor: pointer; flex-direction: column; gap: 5px; }
    .hamburger span { display: block; width: 24px; height: 2px; background: var(--white); border-radius: 2px; }

    /* ── HERO ── */
    #hero {
      min-height: 100vh;
      background: #050d1a;
      display: flex; align-items: center;
      padding: 120px 5% 80px;
      position: relative; overflow: hidden;
    }
    #heroCanvas {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      z-index: 0;
      display: block;
    }
    /* Dark gradient overlay so text stays readable */
    #hero::after {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(
        110deg,
        rgba(5,13,26,0.75) 0%,
        rgba(5,13,26,0.45) 55%,
        rgba(5,13,26,0.20) 100%
      );
      z-index: 1;
      pointer-events: none;
    }
    .hero-content { position: relative; z-index: 2; max-width: 640px; }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(201,168,76,.15); border: 1px solid rgba(201,168,76,.35);
      color: var(--gold2); font-size: 12px; font-weight: 600; letter-spacing: 1.5px;
      text-transform: uppercase; padding: 6px 14px; border-radius: 100px; margin-bottom: 24px;
    }
    .hero-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(40px, 5.5vw, 68px); font-weight: 700;
      color: var(--white); line-height: 1.1; margin-bottom: 24px;
    }
    .hero-title span { color: var(--gold); }
    .hero-sub { font-size: 17px; color: rgba(255,255,255,.75); line-height: 1.7; margin-bottom: 40px; max-width: 500px; }
    .hero-btns { display: flex; gap: 14px; flex-wrap: wrap; }
    .btn-primary-gold {
      background: var(--gold); color: var(--navy); border: none;
      padding: 15px 32px; border-radius: 8px; font-size: 15px; font-weight: 700;
      cursor: pointer; text-decoration: none; transition: background .2s, transform .15s;
      display: inline-flex; align-items: center; gap: 8px;
    }
    .btn-primary-gold:hover { background: var(--gold2); transform: translateY(-2px); }
    .btn-outline-white {
      background: transparent; color: var(--white); border: 1.5px solid rgba(255,255,255,.35);
      padding: 15px 32px; border-radius: 8px; font-size: 15px; font-weight: 600;
      cursor: pointer; text-decoration: none; transition: border-color .2s, background .2s;
      display: inline-flex; align-items: center; gap: 8px;
    }
    .btn-outline-white:hover { border-color: var(--gold); background: rgba(201,168,76,.08); color: var(--gold2); }

    .hero-stats {
      position: absolute; bottom: 60px; left: 5%;
      display: flex; gap: 48px; z-index: 2;
    }
    .stat-item { text-align: left; }
    .stat-num { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; color: var(--gold); line-height: 1; }
    .stat-label { font-size: 12px; color: rgba(255,255,255,.5); margin-top: 4px; letter-spacing: .5px; }

    /* Baltimore badge */
    .bmore-badge {
      position: absolute; bottom: 60px; right: 5%; z-index: 2;
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      opacity: .6;
    }
    .bmore-badge span { font-size: 11px; color: rgba(255,255,255,.5); letter-spacing: 1px; text-transform: uppercase; }
    .bmore-badge i { font-size: 22px; color: var(--gold); }

    /* ── SECTIONS ── */
    section { padding: 90px 5%; }
    .section-eyebrow { font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); margin-bottom: 12px; }
    .section-title { font-family: 'Playfair Display', serif; font-size: clamp(28px, 3.5vw, 44px); font-weight: 700; color: var(--navy); line-height: 1.2; margin-bottom: 16px; }
    .section-sub { font-size: 16px; color: var(--gray); max-width: 560px; line-height: 1.75; }
    .section-header { margin-bottom: 56px; }

    /* ── ABOUT ── */
    #about { background: var(--off); }
    .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
    .about-photo { position: relative; }
    .about-photo-frame { width: 100%; aspect-ratio: 3/4; background: linear-gradient(135deg, var(--navy) 0%, #1a3a5c 100%); border-radius: var(--radius); overflow: hidden; display: flex; align-items: center; justify-content: center; }
    .about-photo-frame i { font-size: 120px; color: rgba(201,168,76,.3); }
    .about-photo-badge { position: absolute; bottom: -20px; right: -20px; background: var(--gold); color: var(--navy); border-radius: 12px; padding: 16px 20px; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,.2); }
    .about-photo-badge strong { display: block; font-size: 28px; font-weight: 800; line-height: 1; }
    .about-photo-badge span { font-size: 11px; font-weight: 600; letter-spacing: .5px; text-transform: uppercase; }
    .about-credentials { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
    .credential-chip { display: flex; align-items: center; gap: 8px; background: var(--white); border: 1px solid var(--light); border-radius: 8px; padding: 10px 16px; font-size: 13px; font-weight: 600; color: var(--navy); }
    .credential-chip i { color: var(--gold); font-size: 15px; }

    /* ── SERVICES ── */
    .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
    .service-card { background: var(--off); border: 1px solid var(--light); border-radius: var(--radius); padding: 36px 28px; transition: box-shadow .25s, transform .25s, border-color .25s; }
    .service-card:hover { box-shadow: 0 16px 48px rgba(15,27,45,.1); transform: translateY(-4px); border-color: var(--gold); }
    .service-icon { width: 56px; height: 56px; background: linear-gradient(135deg, var(--navy), #1a3a5c); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
    .service-icon i { font-size: 24px; color: var(--gold); }
    .service-card h3 { font-size: 18px; font-weight: 700; margin-bottom: 10px; }
    .service-card p { font-size: 14px; color: var(--gray); line-height: 1.7; }

    /* ── LISTINGS ── */
    #listings { background: var(--navy); }
    #listings .section-title { color: var(--white); }
    #listings .section-sub { color: rgba(255,255,255,.55); }
    .listings-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .listing-card { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: var(--radius); overflow: hidden; transition: transform .25s, box-shadow .25s; }
    .listing-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(0,0,0,.4); }
    .listing-img { height: 200px; background: linear-gradient(135deg, #162032 0%, #1a3a5c 100%); display: flex; align-items: center; justify-content: center; position: relative; }
    .listing-img i { font-size: 48px; color: rgba(201,168,76,.3); }
    .listing-badge { position: absolute; top: 12px; left: 12px; background: var(--gold); color: var(--navy); font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: .5px; }
    .listing-body { padding: 20px; }
    .listing-price { font-size: 22px; font-weight: 800; color: var(--gold); margin-bottom: 4px; }
    .listing-address { font-size: 14px; font-weight: 600; color: var(--white); margin-bottom: 12px; }
    .listing-details { display: flex; gap: 16px; }
    .listing-detail { font-size: 13px; color: rgba(255,255,255,.5); display: flex; align-items: center; gap: 5px; }
    .listing-detail i { color: var(--gold); font-size: 13px; }
    .listings-cta { text-align: center; margin-top: 48px; }

    /* ── TESTIMONIALS ── */
    #testimonials { background: var(--off); }
    .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
    .testimonial-card { background: var(--white); border: 1px solid var(--light); border-radius: var(--radius); padding: 32px 28px; }
    .testimonial-stars { color: var(--gold); font-size: 14px; margin-bottom: 16px; letter-spacing: 2px; }
    .testimonial-text { font-size: 14px; color: var(--gray); line-height: 1.75; margin-bottom: 20px; font-style: italic; }
    .testimonial-author { display: flex; align-items: center; gap: 12px; }
    .author-avatar { width: 44px; height: 44px; background: linear-gradient(135deg, var(--navy), #1a3a5c); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .author-avatar i { color: var(--gold); font-size: 18px; }
    .author-name { font-size: 14px; font-weight: 700; color: var(--navy); }
    .author-sub { font-size: 12px; color: var(--gray); }

    /* ── CONTACT ── */
    #contact { background: var(--white); }
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: start; }
    .contact-info-items { display: flex; flex-direction: column; gap: 20px; margin-top: 32px; }
    .contact-info-item { display: flex; align-items: flex-start; gap: 16px; }
    .contact-info-icon { width: 48px; height: 48px; flex-shrink: 0; background: linear-gradient(135deg, var(--navy), #1a3a5c); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .contact-info-icon i { color: var(--gold); font-size: 20px; }
    .contact-info-label { font-size: 12px; color: var(--gray); text-transform: uppercase; letter-spacing: .5px; margin-bottom: 2px; }
    .contact-info-value { font-size: 15px; font-weight: 600; color: var(--navy); }
    .contact-form { background: var(--off); border-radius: var(--radius); padding: 40px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; color: var(--navy); margin-bottom: 8px; }
    .form-group input, .form-group select, .form-group textarea { width: 100%; background: var(--white); border: 1.5px solid var(--light); border-radius: 8px; padding: 12px 16px; font-size: 14px; color: var(--navy); font-family: 'Inter', sans-serif; transition: border-color .2s; outline: none; }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--gold); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group textarea { resize: vertical; min-height: 110px; }
    .form-submit { width: 100%; background: var(--navy); color: var(--gold); border: none; padding: 16px; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; transition: background .2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
    .form-submit:hover { background: #1a2d45; }
    #formMsg { display: none; text-align: center; font-weight: 600; margin-top: 12px; }

    /* ── FOOTER ── */
    footer { background: var(--navy); padding: 60px 5% 32px; }
    .footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
    .footer-logo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: var(--white); margin-bottom: 14px; }
    .footer-logo span { color: var(--gold); }
    .footer-desc { font-size: 13px; color: rgba(255,255,255,.45); line-height: 1.7; }
    .footer-col h4 { font-size: 13px; font-weight: 700; color: var(--white); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
    .footer-col a { display: block; font-size: 13px; color: rgba(255,255,255,.45); text-decoration: none; margin-bottom: 10px; transition: color .2s; }
    .footer-col a:hover { color: var(--gold); }
    .footer-bottom { border-top: 1px solid rgba(255,255,255,.1); padding-top: 28px; display: flex; align-items: center; justify-content: space-between; }
    .footer-copy { font-size: 12px; color: rgba(255,255,255,.35); }
    .footer-social { display: flex; gap: 14px; }
    .social-btn { width: 36px; height: 36px; background: rgba(255,255,255,.07); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,.45); text-decoration: none; font-size: 16px; transition: background .2s, color .2s; }
    .social-btn:hover { background: var(--gold); color: var(--navy); }

    /* ── RESPONSIVE ── */
    @media (max-width: 1024px) {
      .services-grid, .listings-grid { grid-template-columns: repeat(2, 1fr); }
      .about-grid, .contact-grid { grid-template-columns: 1fr; }
      .about-photo { max-width: 400px; margin: 0 auto; }
      .footer-top { grid-template-columns: 1fr 1fr; gap: 32px; }
    }
    @media (max-width: 700px) {
      .nav-links { display: none; }
      .hamburger { display: flex; }
      .services-grid, .listings-grid, .testimonials-grid { grid-template-columns: 1fr; }
      .hero-stats { gap: 24px; flex-wrap: wrap; }
      .bmore-badge { display: none; }
      .footer-top { grid-template-columns: 1fr; }
      .form-row { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <!-- ── NAV ── -->
  <nav>
    <div class="nav-logo">Nick <span>Jungmarker</span></div>
    <ul class="nav-links">
      <li><a href="#about">About</a></li>
      <li><a href="#services">Services</a></li>
      <li><a href="#listings">Listings</a></li>
      <li><a href="#testimonials">Reviews</a></li>
      <li><a href="#contact" class="nav-cta">Contact Me</a></li>
    </ul>
    <div class="hamburger" onclick="toggleMenu()">
      <span></span><span></span><span></span>
    </div>
  </nav>

  <!-- ── HERO ── -->
  <section id="hero">
    <canvas id="heroCanvas"></canvas>

    <div class="hero-content">
      <div class="hero-eyebrow">
        <i class="bi bi-geo-alt-fill"></i>
        Maryland Real Estate Expert
      </div>
      <h1 class="hero-title">
        Your Home.<br>
        Your <span>Best Deal.</span><br>
        My Promise.
      </h1>
      <p class="hero-sub">
        Whether you're buying your first home, selling for top dollar, or investing in Maryland real estate — I'll guide you through every step with honesty, expertise, and results.
      </p>
      <div class="hero-btns">
        <a href="#contact" class="btn-primary-gold">
          <i class="bi bi-calendar-check"></i> Schedule a Free Consultation
        </a>
        <a href="#listings" class="btn-outline-white">
          <i class="bi bi-houses"></i> View Listings
        </a>
      </div>
    </div>

    <div class="hero-stats">
      <div class="stat-item"><div class="stat-num">150+</div><div class="stat-label">Homes Sold</div></div>
      <div class="stat-item"><div class="stat-num">$48M</div><div class="stat-label">Sales Volume</div></div>
      <div class="stat-item"><div class="stat-num">5★</div><div class="stat-label">Average Rating</div></div>
      <div class="stat-item"><div class="stat-num">8+</div><div class="stat-label">Years Experience</div></div>
    </div>

    <div class="bmore-badge">
      <i class="bi bi-water"></i>
      <span>Inner Harbor</span>
    </div>
  </section>

  <!-- ── ABOUT ── -->
  <section id="about">
    <div class="about-grid">
      <div class="about-photo">
        <div class="about-photo-frame"><i class="bi bi-person-fill"></i></div>
        <div class="about-photo-badge"><strong>#1</strong><span>Top Producer<br>2024</span></div>
      </div>
      <div class="about-text">
        <div class="section-eyebrow">About Nick</div>
        <h2 class="section-title">Dedicated to Getting You the Best Outcome</h2>
        <p style="font-size:15px;color:var(--gray);line-height:1.8;margin-bottom:16px">
          I'm Nick Jungmarker, a licensed Maryland REALTOR® with a passion for helping families find their perfect home and sellers maximize their equity. I specialize in the greater Maryland market — from Baltimore County to Montgomery County and everywhere in between.
        </p>
        <p style="font-size:15px;color:var(--gray);line-height:1.8;margin-bottom:28px">
          My approach is simple: I treat every client like my only client. I combine deep local market knowledge, aggressive negotiation, and cutting-edge marketing to ensure you get the best possible result — whether you're buying, selling, or investing.
        </p>
        <div class="about-credentials">
          <div class="credential-chip"><i class="bi bi-patch-check-fill"></i> Licensed REALTOR®</div>
          <div class="credential-chip"><i class="bi bi-star-fill"></i> Bright MLS Certified</div>
          <div class="credential-chip"><i class="bi bi-house-heart-fill"></i> First-Time Buyer Specialist</div>
          <div class="credential-chip"><i class="bi bi-graph-up-arrow"></i> Investment Properties</div>
          <div class="credential-chip"><i class="bi bi-building"></i> Maryland Licensed</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ── SERVICES ── -->
  <section id="services">
    <div class="section-header" style="text-align:center">
      <div class="section-eyebrow">What I Offer</div>
      <h2 class="section-title" style="margin:0 auto 16px">Full-Service Real Estate<br>Done Right</h2>
      <p class="section-sub" style="margin:0 auto">From the first showing to closing day — I handle everything so you don't have to.</p>
    </div>
    <div class="services-grid">
      <div class="service-card"><div class="service-icon"><i class="bi bi-house-add-fill"></i></div><h3>Buying a Home</h3><p>I'll help you find the right home at the right price. I have access to off-market listings, FSBO properties, and the full MLS — giving you every advantage in this competitive market.</p></div>
      <div class="service-card"><div class="service-icon"><i class="bi bi-currency-dollar"></i></div><h3>Selling Your Home</h3><p>Professional photography, targeted digital marketing, open houses, and expert pricing strategy to sell your home fast and for top dollar. Average 97.8% list-to-sale ratio.</p></div>
      <div class="service-card"><div class="service-icon"><i class="bi bi-building-gear"></i></div><h3>Investment Properties</h3><p>Identify high-yield rental properties and fix-and-flip opportunities. I analyze cap rates, cash flow, and appreciation potential to help you build lasting wealth through real estate.</p></div>
      <div class="service-card"><div class="service-icon"><i class="bi bi-people-fill"></i></div><h3>First-Time Buyers</h3><p>Buying your first home is exciting — and a little overwhelming. I'll walk you through every step: pre-approval, home search, inspection, negotiation, and closing.</p></div>
      <div class="service-card"><div class="service-icon"><i class="bi bi-arrow-repeat"></i></div><h3>Relocations</h3><p>Moving to Maryland or leaving the area? I coordinate seamless moves for families and executives, handling all the logistics from neighborhood tours to closing coordination.</p></div>
      <div class="service-card"><div class="service-icon"><i class="bi bi-chat-square-dots-fill"></i></div><h3>Free Market Analysis</h3><p>Wondering what your home is worth? I'll provide a detailed Comparative Market Analysis (CMA) at no charge — with zero obligation and no pressure.</p></div>
    </div>
  </section>

  <!-- ── LISTINGS ── -->
  <section id="listings">
    <div class="section-header" style="text-align:center">
      <div class="section-eyebrow">Current Listings</div>
      <h2 class="section-title" style="color:var(--white);margin:0 auto 16px">Featured Properties</h2>
      <p class="section-sub" style="margin:0 auto">A selection of current and recent properties. Contact me for the full list.</p>
    </div>
    <div class="listings-grid">
      <div class="listing-card"><div class="listing-img"><i class="bi bi-house-fill"></i><span class="listing-badge">For Sale</span></div><div class="listing-body"><div class="listing-price">$549,000</div><div class="listing-address">4 Bed Colonial — Ellicott City, MD</div><div class="listing-details"><div class="listing-detail"><i class="bi bi-door-closed"></i> 4 Beds</div><div class="listing-detail"><i class="bi bi-droplet"></i> 2.5 Baths</div><div class="listing-detail"><i class="bi bi-grid"></i> 2,840 sqft</div></div></div></div>
      <div class="listing-card"><div class="listing-img"><i class="bi bi-house-fill"></i><span class="listing-badge">Just Listed</span></div><div class="listing-body"><div class="listing-price">$389,000</div><div class="listing-address">3 Bed Townhome — Bel Air, MD</div><div class="listing-details"><div class="listing-detail"><i class="bi bi-door-closed"></i> 3 Beds</div><div class="listing-detail"><i class="bi bi-droplet"></i> 2 Baths</div><div class="listing-detail"><i class="bi bi-grid"></i> 1,920 sqft</div></div></div></div>
      <div class="listing-card"><div class="listing-img"><i class="bi bi-house-fill"></i><span class="listing-badge" style="background:#10b981">Sold</span></div><div class="listing-body"><div class="listing-price">$672,500</div><div class="listing-address">5 Bed Estate — Lutherville, MD</div><div class="listing-details"><div class="listing-detail"><i class="bi bi-door-closed"></i> 5 Beds</div><div class="listing-detail"><i class="bi bi-droplet"></i> 3 Baths</div><div class="listing-detail"><i class="bi bi-grid"></i> 3,600 sqft</div></div></div></div>
    </div>
    <div class="listings-cta"><a href="#contact" class="btn-primary-gold"><i class="bi bi-search"></i> See All Available Properties</a></div>
  </section>

  <!-- ── TESTIMONIALS ── -->
  <section id="testimonials">
    <div class="section-header" style="text-align:center">
      <div class="section-eyebrow">Client Reviews</div>
      <h2 class="section-title" style="margin:0 auto 16px">What My Clients Say</h2>
      <p class="section-sub" style="margin:0 auto">Real results from real people.</p>
    </div>
    <div class="testimonials-grid">
      <div class="testimonial-card"><div class="testimonial-stars">★★★★★</div><p class="testimonial-text">"Nick sold our house in just 6 days — $14,000 over asking price. His marketing strategy was unlike anything we'd seen before. Professional, responsive, and genuinely cares about his clients."</p><div class="testimonial-author"><div class="author-avatar"><i class="bi bi-person-fill"></i></div><div><div class="author-name">Sarah & Mike T.</div><div class="author-sub">Sold in Towson, MD</div></div></div></div>
      <div class="testimonial-card"><div class="testimonial-stars">★★★★★</div><p class="testimonial-text">"As a first-time buyer, I was intimidated by the whole process. Nick made it seamless and stress-free. He found us a house that checked every box and negotiated $22K off the price."</p><div class="testimonial-author"><div class="author-avatar"><i class="bi bi-person-fill"></i></div><div><div class="author-name">James & Priya K.</div><div class="author-sub">Bought in Columbia, MD</div></div></div></div>
      <div class="testimonial-card"><div class="testimonial-stars">★★★★★</div><p class="testimonial-text">"We used Nick for both buying and selling. He's the most knowledgeable agent I've worked with in 20 years of real estate investing. I won't use anyone else in Maryland."</p><div class="testimonial-author"><div class="author-avatar"><i class="bi bi-person-fill"></i></div><div><div class="author-name">Robert D.</div><div class="author-sub">Investor, Baltimore County</div></div></div></div>
    </div>
  </section>

  <!-- ── CONTACT ── -->
  <section id="contact">
    <div class="contact-grid">
      <div>
        <div class="section-eyebrow">Get In Touch</div>
        <h2 class="section-title">Let's Talk About<br>Your Real Estate Goals</h2>
        <p class="section-sub">Ready to buy, sell, or just want a free home valuation? I'll get back to you within 2 hours — usually much faster.</p>
        <div class="contact-info-items">
          <div class="contact-info-item"><div class="contact-info-icon"><i class="bi bi-telephone-fill"></i></div><div><div class="contact-info-label">Phone / Text</div><div class="contact-info-value">(443) 555-0199</div></div></div>
          <div class="contact-info-item"><div class="contact-info-icon"><i class="bi bi-envelope-fill"></i></div><div><div class="contact-info-label">Email</div><div class="contact-info-value">nick@jungmarker.com</div></div></div>
          <div class="contact-info-item"><div class="contact-info-icon"><i class="bi bi-geo-alt-fill"></i></div><div><div class="contact-info-label">Service Area</div><div class="contact-info-value">Baltimore, Howard, Harford, Anne Arundel Counties</div></div></div>
          <div class="contact-info-item"><div class="contact-info-icon"><i class="bi bi-clock-fill"></i></div><div><div class="contact-info-label">Availability</div><div class="contact-info-value">7 days a week, 8am – 8pm</div></div></div>
        </div>
      </div>
      <div>
        <div class="contact-form">
          <h3 style="font-size:20px;font-weight:700;margin-bottom:24px">Send Me a Message</h3>
          <form id="contactForm" onsubmit="submitForm(event)">
            <div class="form-row">
              <div class="form-group"><label>First Name</label><input type="text" name="first_name" required placeholder="John"></div>
              <div class="form-group"><label>Last Name</label><input type="text" name="last_name" required placeholder="Smith"></div>
            </div>
            <div class="form-group"><label>Email</label><input type="email" name="email" required placeholder="you@email.com"></div>
            <div class="form-group"><label>Phone</label><input type="tel" name="phone" placeholder="(443) 555-0100"></div>
            <div class="form-group"><label>I'm Interested In</label>
              <select name="interest">
                <option value="">Select one…</option>
                <option>Buying a Home</option><option>Selling My Home</option>
                <option>Investment Properties</option><option>Free Home Valuation</option>
                <option>Relocation Services</option><option>Other</option>
              </select>
            </div>
            <div class="form-group"><label>Message</label><textarea name="message" placeholder="Tell me about your situation…"></textarea></div>
            <button type="submit" class="form-submit"><i class="bi bi-send-fill"></i> Send Message</button>
            <div id="formMsg"></div>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- ── FOOTER ── -->
  <footer>
    <div class="footer-top">
      <div>
        <div class="footer-logo">Nick <span>Jungmarker</span></div>
        <p class="footer-desc">Licensed Maryland REALTOR® dedicated to delivering exceptional results for buyers, sellers, and investors across the greater Maryland area.</p>
      </div>
      <div class="footer-col"><h4>Services</h4><a href="#services">Buying</a><a href="#services">Selling</a><a href="#services">Investing</a><a href="#services">Relocations</a><a href="#services">Free CMA</a></div>
      <div class="footer-col"><h4>Areas</h4><a href="#contact">Baltimore City</a><a href="#contact">Baltimore County</a><a href="#contact">Howard County</a><a href="#contact">Harford County</a><a href="#contact">Anne Arundel</a></div>
      <div class="footer-col"><h4>Connect</h4><a href="#contact">Contact Me</a><a href="#about">About Nick</a><a href="#testimonials">Reviews</a><a href="#listings">Listings</a></div>
    </div>
    <div class="footer-bottom">
      <div class="footer-copy">© 2025 Nick Jungmarker Real Estate. Licensed in Maryland.</div>
      <div class="footer-social">
        <a href="#" class="social-btn"><i class="bi bi-facebook"></i></a>
        <a href="#" class="social-btn"><i class="bi bi-instagram"></i></a>
        <a href="#" class="social-btn"><i class="bi bi-linkedin"></i></a>
        <a href="#" class="social-btn"><i class="bi bi-youtube"></i></a>
      </div>
    </div>
  </footer>

  <!-- ── UI SCRIPTS ── -->
  <script>
    function toggleMenu() {
      const links = document.querySelector('.nav-links');
      const open = links.style.display === 'flex';
      Object.assign(links.style, {
        display: open ? 'none' : 'flex', flexDirection: 'column',
        position: 'absolute', top: '72px', left: '0', right: '0',
        background: 'rgba(15,27,45,0.97)', padding: '20px 5%',
        gap: '20px', borderBottom: '1px solid rgba(201,168,76,0.2)'
      });
    }
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => { if (window.innerWidth <= 700) document.querySelector('.nav-links').style.display = 'none'; });
    });
    window.addEventListener('scroll', () => {
      document.querySelector('nav').style.boxShadow = window.scrollY > 20 ? '0 4px 24px rgba(0,0,0,.4)' : 'none';
    });
    function submitForm(e) {
      e.preventDefault();
      const btn = e.target.querySelector('.form-submit');
      const msg = document.getElementById('formMsg');
      btn.disabled = true;
      btn.innerHTML = '<span style="display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#c9a84c;border-radius:50%;animation:spin .6s linear infinite"></span> Sending…';
      fetch('/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(e.target))) })
        .then(r => r.json())
        .then(() => { msg.style.display = 'block'; msg.style.color = '#10b981'; msg.innerHTML = '✓ Message sent! Nick will be in touch shortly.'; e.target.reset(); btn.disabled = false; btn.innerHTML = '<i class="bi bi-send-fill"></i> Send Message'; })
        .catch(() => { msg.style.display = 'block'; msg.style.color = '#ef4444'; msg.innerHTML = '✗ Something went wrong — please call directly.'; btn.disabled = false; btn.innerHTML = '<i class="bi bi-send-fill"></i> Send Message'; });
    }
  </script>
  <style>@keyframes spin { to { transform: rotate(360deg); } }</style>

  <!-- ── THREE.JS BALTIMORE SKYLINE ── -->
  <script>
  (function initScene() {
    const canvas  = document.getElementById('heroCanvas');
    const section = document.getElementById('hero');

    function W() { return section.clientWidth; }
    function H() { return section.clientHeight; }

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(W(), H());
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;

    const scene  = new THREE.Scene();
    scene.fog    = new THREE.FogExp2(0x050d1a, 0.022);

    const camera = new THREE.PerspectiveCamera(52, W() / H(), 0.1, 300);
    camera.position.set(0, 2.5, 20);
    camera.lookAt(0, 1, 0);

    // ── LIGHTS ──────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x102040, 1.2));

    const fireLight = new THREE.PointLight(0xff6600, 4, 22);
    fireLight.position.set(0, 1, -2);
    scene.add(fireLight);

    const accentLight = new THREE.PointLight(0x3355ff, 1.2, 30);
    accentLight.position.set(-8, 6, -5);
    scene.add(accentLight);

    // ── STARS ───────────────────────────────────────────────────────────────────
    const starCount = 900;
    const starBuf = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starBuf[i*3]   = (Math.random() - 0.5) * 140;
      starBuf[i*3+1] = 2 + Math.random() * 45;
      starBuf[i*3+2] = -25 - Math.random() * 80;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starBuf, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.09, transparent: true, opacity: 0.8 })));

    // ── BALTIMORE SKYLINE ────────────────────────────────────────────────────────
    // [x, height, width, depth]  — inspired by the Inner Harbor skyline
    const BLDGS = [
      [-13,  3.0, 1.2, 1.0],
      [-11.2, 5.5, 1.6, 1.3],
      [-9.5,  8.0, 2.0, 1.6],  // Harbor Court
      [-7.5,  5.5, 1.7, 1.4],
      [-6.0, 12.0, 2.4, 1.9],  // Trade Center
      [-3.8,  7.5, 1.8, 1.5],
      [-2.0,  9.0, 2.0, 1.6],
      [ 0.2, 15.0, 2.2, 2.0],  // Legg Mason Tower (tallest)
      [ 2.6,  9.5, 2.0, 1.6],
      [ 4.5,  6.5, 1.7, 1.4],
      [ 6.2, 11.0, 2.1, 1.7],  // Mercantile Bankshares
      [ 8.3,  5.5, 1.6, 1.3],
      [10.0,  4.0, 1.4, 1.1],
      [11.6,  6.5, 1.5, 1.2],
      [13.2,  3.5, 1.2, 1.0],
    ];

    const windows = [];  // for blinking

    BLDGS.forEach(([bx, bh, bw, bd]) => {
      const geo = new THREE.BoxGeometry(bw, bh, bd);
      const mat = new THREE.MeshPhongMaterial({ color: 0x0b1726, emissive: 0x040d1a, shininess: 40 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(bx, bh / 2 - 4, -5);
      scene.add(mesh);

      // Antenna on tall buildings
      if (bh > 10) {
        const antGeo = new THREE.CylinderGeometry(0.03, 0.03, bh * 0.25, 4);
        const antMat = new THREE.MeshBasicMaterial({ color: 0x334455 });
        const ant    = new THREE.Mesh(antGeo, antMat);
        ant.position.set(bx, bh + (bh * 0.125) - 4, -5);
        scene.add(ant);

        // Blinking red beacon
        const bGeo = new THREE.SphereGeometry(0.07, 6, 6);
        const bMat = new THREE.MeshBasicMaterial({ color: 0xff2222 });
        const beacon = new THREE.Mesh(bGeo, bMat);
        beacon.position.set(bx, bh + (bh * 0.25) - 4, -5);
        beacon.userData.beacon = true;
        beacon.userData.phase  = Math.random() * Math.PI * 2;
        scene.add(beacon);
        windows.push(beacon);
      }

      // Windows
      const rows = Math.max(2, Math.floor(bh * 1.6));
      const cols = Math.max(1, Math.floor(bw * 2.2));
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() > 0.52) continue;
          const lit = Math.random() > 0.25;
          const wGeo = new THREE.PlaneGeometry(0.09, 0.13);
          const wMat = new THREE.MeshBasicMaterial({
            color: lit ? (Math.random() > 0.3 ? 0xffaa44 : 0xaad4ff) : 0x110a00,
            transparent: true, opacity: lit ? 0.92 : 0.25,
          });
          const wm = new THREE.Mesh(wGeo, wMat);
          const wx = ((c + 0.5) / cols - 0.5) * bw * 0.78;
          const wy = ((r + 0.5) / rows - 0.5) * bh * 0.88;
          wm.position.set(bx + wx, wy + bh / 2 - 4, -5 + bd / 2 + 0.025);
          wm.userData = { lit, blinkPhase: Math.random() * Math.PI * 2, blinkRate: 1 + Math.random() * 4 };
          scene.add(wm);
          windows.push(wm);
        }
      }
    });

    // ── FIRE / EMBER PARTICLES ───────────────────────────────────────────────────
    const FIRE_N = 3200;
    const fPos   = new Float32Array(FIRE_N * 3);
    const fCol   = new Float32Array(FIRE_N * 3);

    // Circular glow sprite
    const ptCv   = document.createElement('canvas');
    ptCv.width   = ptCv.height = 64;
    const ptCtx  = ptCv.getContext('2d');
    const ptGr   = ptCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    ptGr.addColorStop(0,   'rgba(255,255,255,1)');
    ptGr.addColorStop(0.25,'rgba(255,200,80,0.8)');
    ptGr.addColorStop(0.6, 'rgba(255,80,10,0.4)');
    ptGr.addColorStop(1,   'rgba(255,20,0,0)');
    ptCtx.fillStyle = ptGr;
    ptCtx.fillRect(0, 0, 64, 64);
    const ptTex = new THREE.CanvasTexture(ptCv);

    const fGeo  = new THREE.BufferGeometry();
    fGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
    fGeo.setAttribute('color',    new THREE.BufferAttribute(fCol, 3));
    const fMat = new THREE.PointsMaterial({
      size: 0.38, map: ptTex, vertexColors: true,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(fGeo, fMat));

    // Per-particle data
    const fp = [];
    for (let i = 0; i < FIRE_N; i++) {
      fp.push(mkFireP(true));
    }
    function mkFireP(scatter) {
      return {
        x: (Math.random() - 0.5) * 28,
        y: scatter ? Math.random() * 18 - 5 : -4 + Math.random(),
        z: (Math.random() - 0.5) * 5 - 5,
        vx: (Math.random() - 0.5) * 0.022,
        vy: 0.028 + Math.random() * 0.062,
        life: scatter ? Math.random() : 0,
        maxLife: 1.8 + Math.random() * 2.8,
        turb: 1.5 + Math.random() * 3.5,
      };
    }

    // ── FIREFLIES (Maryland state insect) ───────────────────────────────────────
    const FF_N   = 140;
    const ffPos  = new Float32Array(FF_N * 3);
    const ffCol  = new Float32Array(FF_N * 3);
    const ffData = [];
    for (let i = 0; i < FF_N; i++) {
      ffData.push({
        x: (Math.random() - 0.5) * 30,
        y: -1 + Math.random() * 9,
        z: (Math.random() - 0.5) * 7 - 4,
        vx: (Math.random() - 0.5) * 0.007,
        vy: (Math.random() - 0.5) * 0.004,
        phase:  Math.random() * Math.PI * 2,
        speed:  0.7 + Math.random() * 1.8,
      });
    }
    const ffGeo = new THREE.BufferGeometry();
    ffGeo.setAttribute('position', new THREE.BufferAttribute(ffPos, 3));
    ffGeo.setAttribute('color',    new THREE.BufferAttribute(ffCol, 3));
    scene.add(new THREE.Points(ffGeo, new THREE.PointsMaterial({
      size: 0.14, vertexColors: true, transparent: true,
      depthWrite: false, blending: THREE.AdditiveBlending,
    })));

    // ── HARBOR WATER ─────────────────────────────────────────────────────────────
    const wGeo = new THREE.PlaneGeometry(34, 8, 70, 24);
    const wMat = new THREE.MeshPhongMaterial({
      color: 0x091528, emissive: 0x030810,
      transparent: true, opacity: 0.78,
      shininess: 120, specular: new THREE.Color(0xff6622),
    });
    const waterMesh = new THREE.Mesh(wGeo, wMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.set(0, -4, -4);
    scene.add(waterMesh);
    const wBasePos = wGeo.attributes.position;

    // ── PURPLE HAZE (Ravens tribute) ─────────────────────────────────────────────
    const hazeGeo = new THREE.SphereGeometry(18, 12, 8);
    const hazeMat = new THREE.MeshBasicMaterial({
      color: 0x1a0033, side: THREE.BackSide,
      transparent: true, opacity: 0.18,
    });
    const haze = new THREE.Mesh(hazeGeo, hazeMat);
    haze.position.set(0, 4, -5);
    scene.add(haze);

    // ── ANIMATION ────────────────────────────────────────────────────────────────
    const clock  = new THREE.Clock();
    let   time   = 0;
    let   frame  = 0;

    function animate() {
      requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      time += dt;
      frame++;

      // Fire particles
      for (let i = 0; i < FIRE_N; i++) {
        const p = fp[i];
        p.life += dt * 0.48;
        if (p.life > p.maxLife) { Object.assign(p, mkFireP(false)); }

        p.x  += p.vx + Math.sin(time * p.turb + p.x * 0.4) * 0.009;
        p.y  += p.vy;
        p.vy *= 0.9985;

        fPos[i*3]   = p.x;
        fPos[i*3+1] = p.y;
        fPos[i*3+2] = p.z;

        const t     = p.life / p.maxLife;
        const alpha = t < 0.75 ? 1.0 : Math.max(0, (1.0 - t) / 0.25);
        if (t < 0.15) {                  // hot white core
          fCol[i*3] = alpha; fCol[i*3+1] = 0.92 * alpha; fCol[i*3+2] = 0.55 * alpha;
        } else if (t < 0.45) {           // orange
          fCol[i*3] = alpha; fCol[i*3+1] = 0.38 * alpha; fCol[i*3+2] = 0;
        } else if (t < 0.75) {           // deep orange / red
          fCol[i*3] = 0.85 * alpha; fCol[i*3+1] = 0.12 * alpha; fCol[i*3+2] = 0;
        } else {                          // fading ember
          fCol[i*3] = 0.5 * alpha; fCol[i*3+1] = 0.04 * alpha; fCol[i*3+2] = 0;
        }
      }
      fGeo.attributes.position.needsUpdate = true;
      fGeo.attributes.color.needsUpdate    = true;

      // Fireflies
      for (let i = 0; i < FF_N; i++) {
        const f = ffData[i];
        f.x += f.vx + Math.sin(time * 0.25 + f.phase) * 0.003;
        f.y += f.vy + Math.cos(time * 0.18 + f.phase * 1.7) * 0.002;
        if (f.x >  15) f.x = -15;
        if (f.x < -15) f.x =  15;
        if (f.y >   9) f.vy = -Math.abs(f.vy);
        if (f.y <  -1) f.vy =  Math.abs(f.vy);

        ffPos[i*3]   = f.x;
        ffPos[i*3+1] = f.y;
        ffPos[i*3+2] = f.z;

        const blink = Math.max(0, Math.sin(time * f.speed * 2.2 + f.phase)) ** 3;
        ffCol[i*3]   = 0.45 * blink;  // R — warm yellow-green
        ffCol[i*3+1] = blink;         // G
        ffCol[i*3+2] = 0.18 * blink;  // B
      }
      ffGeo.attributes.position.needsUpdate = true;
      ffGeo.attributes.color.needsUpdate    = true;

      // Water ripples
      for (let i = 0; i < wBasePos.count; i++) {
        const x = wBasePos.getX(i), z = wBasePos.getZ(i);
        wBasePos.setY(i,
          Math.sin(x * 0.38 + time * 0.75) * 0.065 +
          Math.cos(z * 0.55 + time * 1.05) * 0.04  +
          Math.sin(x * 0.9  + time * 1.6)  * 0.02
        );
      }
      wBasePos.needsUpdate = true;

      // Fire light flicker
      fireLight.intensity = 2.8
        + Math.sin(time * 13.7) * 0.8
        + Math.sin(time *  6.3) * 0.5
        + (Math.random() - 0.5) * 0.3;
      fireLight.color.setHSL(0.065 + Math.sin(time * 4) * 0.012, 1.0, 0.5);

      // Window & beacon blinking (every 45 frames)
      if (frame % 45 === 0) {
        windows.forEach(w => {
          if (w.userData.beacon) {
            const on = Math.sin(time * 1.8 + w.userData.phase) > 0;
            w.material.color.setHex(on ? 0xff2222 : 0x440000);
            return;
          }
          if (Math.random() < 0.04) {
            w.userData.lit = !w.userData.lit;
            const warmOrCool = Math.random() > 0.3;
            w.material.color.setHex(w.userData.lit ? (warmOrCool ? 0xffaa44 : 0xaad4ff) : 0x110a00);
            w.material.opacity = w.userData.lit ? 0.92 : 0.25;
          }
        });
      }

      // Haze pulse (Ravens purple)
      hazeMat.opacity = 0.14 + Math.sin(time * 0.4) * 0.06;

      // Subtle camera drift
      camera.position.x = Math.sin(time * 0.07) * 0.55;
      camera.position.y = 2.5 + Math.sin(time * 0.055) * 0.35;
      camera.lookAt(0, 1.2, 0);

      renderer.render(scene, camera);
    }

    animate();

    // Resize
    window.addEventListener('resize', () => {
      renderer.setSize(W(), H());
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
    });
  })();
  </script>

</body>
</html>
"""


@app.route("/")
def index():
    return render_template_string(SITE_HTML)


@app.route("/contact", methods=["POST"])
def contact():
    from datetime import datetime
    data = request.get_json(silent=True) or {}
    print(
        f"\n[{datetime.now():%Y-%m-%d %H:%M}] NEW CONTACT INQUIRY\n"
        f"  Name:     {data.get('first_name', '')} {data.get('last_name', '')}\n"
        f"  Email:    {data.get('email', '')}\n"
        f"  Phone:    {data.get('phone', '')}\n"
        f"  Interest: {data.get('interest', '')}\n"
        f"  Message:  {data.get('message', '')}\n"
    )
    return jsonify({"ok": True})


if __name__ == "__main__":
    port = int(os.environ.get("SITE_PORT", 5002))
    print(f"  * jungmarker.com site running at http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)
