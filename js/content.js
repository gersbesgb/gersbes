/* ============================================================================
   CONTENT.JS — EDIT THIS FILE ONLY
   ============================================================================
   This is the ONLY file you need to touch to change anything on your website.
   You never have to open or edit any .html file.

   HOW TO EDIT:
   - Open this file in Notepad, VS Code, or any plain text editor.
   - Change the text between the quotes " " — never delete the quotes,
     commas ",", or curly brackets { }.
   - Save the file, then refresh your website in the browser. Done.

   Full instructions are in INSTRUCTIONS.txt in this folder.
   ========================================================================= */

window.SITE_CONTENT = {

  general: {
    siteName: "GersBes",
    tagline: "Minecraft Staff & Creative Services",
    minecraftUsername: "GersBes",
    skinImage: "assets/skin.png",
    favicon: "assets/icons/favicon.png",
    defaultTheme: "dark",
    footerText: "© 2026 GersBes. All rights reserved.",
  },

  socialLinks: [
    { label: "Discord",  url: "https://discord.gg/vdvTtSDM3P", icon: "discord" },
  ],

  servers: [
    {
      name: "BeachMC",
      address: "beachmc.net",
      icon: "assets/icons/server-example.png",
      description: "Helper — Resigned",
      link: "https://discord.gg/5pr44f8Q8m",
    },
    {
      name: "SpearMaceffa",
      address: "spearmaceffa.xyz",
      icon: "assets/icons/server-example.png",
      description: "Other, SSer — Resigned",
      link: "https://discord.gg/AD2NvGDB9",
    },
    {
      name: "Crystalled",
      address: "unreleased",
      icon: "assets/icons/server-example.png",
      description: "Moderator — Active",
      link: "https://discord.gg/6maNfdAyX9",
    },
    {
      name: "My Self",
      address: "Personal / Freelance",
      icon: "assets/icons/server-example.png",
      description: "Developer (Java), Thumbnail Maker, Top Screensharer — Active. Also on Modrinth: https://modrinth.com/user/GersBes (mods keep getting rejected).",
      link: "https://discord.gg/ptbhsBqmrr",
    },
    {
      name: "EchoSMP",
      address: "echosmp.net",
      icon: "assets/icons/server-example.png",
      description: "Jr. Moderator, SSer — Resigned",
      link: "https://discord.gg/NpHvNkgvPy",
    },
    {
      name: "BloodMoonSMP (Old RuneSMP)",
      address: "",
      icon: "assets/icons/server-example.png",
      description: "Admin, Media Manager + General Manager — Sold",
      link: "https://discord.gg/P3ukuuK429",
    },
    {
      name: "SpicySMP",
      address: "spicysmp.net",
      icon: "assets/icons/server-example.png",
      description: "Sr. Moderator — Sold",
      link: "https://discord.gg/ceUaVVzQW",
    },
    {
      name: "GersBes — Server Setup",
      address: "",
      icon: "assets/icons/server-example.png",
      description: "Owner — Active",
      link: "https://discord.gg/z56Q8T5GBz",
    },
    {
      name: "BushMC",
      address: "",
      icon: "assets/icons/server-example.png",
      description: "(Head) Manager",
      link: "https://discord.gg/tKfuGwhabZ",
    },
  ],

  home: {
    heroTitle: "GersBes",
    heroSubtitle: "Minecraft Staff, Servers & Creative Work",
    heroButtonText: "View Staffing",
    heroButtonLink: "staffing.html",
    aboutTitle: "About Me",
    aboutText: "Heya! I’m GersBes. I’m a passionate Minecraft player and coder with extensive experience in server staffing and screensharing (SSing) moderation. On the technical side, I love building complex redstone creations and traps—including custom one-shot railguns and secure stashes.",
    highlights: [
      { title: "Staffing", text: "Servers I currently staff or have staffed.", link: "staffing.html", skin: "assets/skins/skin-staffing.png", color1: "#6dffb0", color2: "#7ad9ff" },
      { title: "SSing", text: "Details about SSing services / info.", link: "ssing.html", skin: "assets/skins/skin-ssing.png", color1: "#ff6b7a", color2: "#c8264f" },
      { title: "Thumbnails & Logos", text: "Custom thumbnail and logo commissions.", link: "thumbnails.html", skin: "assets/skins/skin-thumbnails.png", color1: "#ffb84d", color2: "#e0862a" },
      { title: "Reviews", text: "What people are saying.", link: "reviews.html", skin: "assets/skins/skin-reviews.png", color1: "#b78bff", color2: "#7a5cff" },
    ],
  },

  staffing: {
    pageTitle: "Staffing",
    pageIntro: "Servers I am currently staffing, or have staffed in the past.",
    color1: "#6dffb0",
    color2: "#7ad9ff",
    experience: [
      { role: "Helper", server: "BeachMC", period: "Jan 2026 - Feb 2026", details: "First staffing role — general chat moderation and player support. Resigned." },
      { role: "Other / SSer", server: "SpearMaceffa", period: "Feb 2026 - Mar 2026", details: "Screensharing and general support. Resigned." },
      { role: "Jr. Moderator / SSer", server: "EchoSMP", period: "Mar 2026 - Apr 2026", details: "Chat moderation and screensharing duties. Resigned." },
      { role: "Sr. Moderator", server: "SpicySMP", period: "Apr 2026 - May 2026", details: "Senior moderation role handling reports and staff support. Server later sold." },
      { role: "Admin / Media Manager + General Manager", server: "BloodMoonSMP (Old RuneSMP)", period: "Apr 2026 - Jun 2026", details: "Oversaw media output and general server management. Server later sold." },
      { role: "Moderator", server: "Crystalled", period: "May 2026 - Present", details: "Active moderation on an unreleased server." },
      { role: "Owner", server: "GersBes — Server Setup", period: "Jun 2026 - Present", details: "Running my own server setup." },
      { role: "(Head) Manager", server: "BushMC", period: "Jun 2026 - Present", details: "Managing server operations." },
      { role: "Developer / Thumbnail Maker / Top Screensharer", server: "Freelance (My Self)", period: "Jan 2026 - Present", details: "Ongoing freelance Java development, thumbnail commissions, and screensharing work alongside server staffing." },
    ],
  },

  "ssing": {
    "pageTitle": "SSing",
    "pageIntro": "I specialize in deep-dive screensharing to keep gameplay fair. I utilize the CheesySS tool and run a strict, mandatory 10-step protocol on every single inspection. By checking memory strings and system directories, I don't stop until I find the truth—even if the client is injected or hidden.",
    "color1": "#ff6b7a",
    "color2": "#c8264f",
    "items": [
      {
        "title": "MeowModAnalyzer",
        "text": "MeowModAnalyzer is a analyzer that checks file size, strings and where its downloaded from to see if a mod has a injection."
      },
      {
        "title": "GersBes Download Checker",
        "text": "A powersehll script I made which checks download location which can be used if a hack client was downloaded from their own website."
      }
    ]
  },

  thumbnails: {
    pageTitle: "Thumbnail & Logo Creation",
    pageIntro: "Examples of my work are below --> They will come soon for now create a ticket in my discord to check them out!",
    color1: "#ffb84d",
    color2: "#e0862a",
    gallery: [
      { image: "assets/icons/server-example.png", caption: "Example thumbnail #1" },
      { image: "assets/icons/server-example.png", caption: "Example thumbnail #2" },
    ],
    orderButtonText: "Order one!",
    orderButtonLink: "https://discord.gg/vdvTtSDM3P",
  },

  reviews: {
    pageTitle: "Reviews",
    pageIntro: "See what people are saying over on Discord.",
    color1: "#b78bff",
    color2: "#7a5cff",
    buttonText: "Read Reviews on Discord",
    buttonLink: "https://discord.gg/vdvTtSDM3P",
  },

};
