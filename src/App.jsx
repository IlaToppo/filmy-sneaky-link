import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Undo2, RotateCcw, Share2, X, Trophy, Search, Send,
  CalendarDays, Users, Copy, Shuffle, Clapperboard, Play, Film, Ticket, LogOut,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

/* ───────────────────────── 1. BUILT-IN BOLLYWOOD DATASET ───────────────────────── */
// A leading * on a cast token marks a cameo / special / guest appearance.

const ACTOR_NAMES = {
  srk: "Shah Rukh Khan", konkona: "Konkona Sen Sharma", alia: "Alia Bhatt", ranbir: "Ranbir Kapoor",
  priyanka: "Priyanka Chopra Jonas", farhan: "Farhan Akhtar", anil: "Anil Kapoor", ranveer: "Ranveer Singh",
  anushka: "Anushka Sharma", deepika: "Deepika Padukone", aamir: "Aamir Khan", kareena: "Kareena Kapoor Khan",
  hrithik: "Hrithik Roshan",
  kunalk: "Kunal Kapoor", alizafar: "Ali Zafar", angadbedi: "Angad Bedi", adityark: "Aditya Roy Kapur",
  amitabh: "Amitabh Bachchan", nagarjuna: "Nagarjuna Akkineni", mouniroy: "Mouni Roy", anupam: "Anupam Kher",
  supriya: "Supriya Pathak", rahulkhanna: "Rahul Khanna", shefali: "Shefali Shah", rahulbose: "Rahul Bose",
  arjunrampal: "Arjun Rampal", shreyas: "Shreyas Talpade", kirron: "Kirron Kher", akshay: "Akshay Kumar",
  abhishek: "Abhishek Bachchan", salman: "Salman Khan", rani: "Rani Mukerji", kajol: "Kajol",
  rishi: "Rishi Kapoor", dimple: "Dimple Kapadia", juhi: "Juhi Chawla", ishasharvani: "Isha Sharvani",
  sanjaykapoor: "Sanjay Kapoor", abhaydeol: "Abhay Deol", katrina: "Katrina Kaif", kalki: "Kalki Koechlin",
  naseer: "Naseeruddin Shah", jaya: "Jaya Bachchan", farida: "Farida Jalal", johnny: "Johnny Lever",
  madhavan: "R. Madhavan", sharman: "Sharman Joshi", boman: "Boman Irani", omi: "Omi Vaidya",
  monasingh: "Mona Singh", kunalroykapur: "Kunal Roy Kapur", farooq: "Farooq Sheikh", madhuri: "Madhuri Dixit",
  siddhant: "Siddhant Chaturvedi", vijayraaz: "Vijay Raaz", dharmendra: "Dharmendra", shabana: "Shabana Azmi",
  vinay: "Vinay Pathak", saif: "Saif Ali Khan", akshaye: "Akshaye Khanna", preity: "Preity Zinta",
  sonali: "Sonali Kulkarni", tanvi: "Tanvi Azmi", shahid: "Shahid Kapoor", jimsarbh: "Jim Sarbh",
  richa: "Richa Chadha", sonusood: "Sonu Sood", vivaan: "Vivaan Shah", nayanthara: "Nayanthara",
  vijaysethupathi: "Vijay Sethupathi", sanya: "Sanya Malhotra", sanjaydutt: "Sanjay Dutt", john: "John Abraham",
  isha: "Isha Koppikar", purab: "Purab Kohli", prachi: "Prachi Desai", shahana: "Shahana Goswami",
  sonam: "Sonam Kapoor", divyadutta: "Divya Dutta", pavan: "Pavan Malhotra", nawaz: "Nawazuddin Siddiqui",
  sushant: "Sushant Singh Rajput", saurabh: "Saurabh Shukla", sakshi: "Sakshi Tanwar",
  fatima: "Fatima Sana Shaikh", zaira: "Zaira Wasim", ileana: "Ileana D'Cruz", vicky: "Vicky Kaushal",
  paresh: "Paresh Rawal", manisha: "Manisha Koirala", dia: "Dia Mirza", aishwarya: "Aishwarya Rai Bachchan",
  fawad: "Fawad Khan", sidharth: "Sidharth Malhotra", ratna: "Ratna Pathak Shah", rajatkapoor: "Rajat Kapoor",
  diljit: "Diljit Dosanjh", shantanu: "Shantanu Maheshwari", ajay: "Ajay Devgn", rekha: "Rekha",
  tiger: "Tiger Shroff", vaani: "Vaani Kapoor", vivek: "Vivek Oberoi", bipasha: "Bipasha Basu",
  atul: "Atul Kulkarni", sandhya: "Sandhya Mridul", shilpa: "Shilpa Shetty Kundra", kaykay: "Kay Kay Menon",
  irrfan: "Irrfan Khan", shiney: "Shiney Ahuja", kangana: "Kangana Ranaut", aahana: "Aahana Kumra",
  plabita: "Plabita Borthakur", emraan: "Emraan Hashmi", huma: "Huma Qureshi", neeraj: "Neeraj Kabi",
  sohum: "Sohum Shah", ranvirshorey: "Ranvir Shorey", mugdha: "Mugdha Godse", rajkummar: "Rajkummar Rao",
  lisa: "Lisa Haydon", vidya: "Vidya Malhotra", shilpashukla: "Shilpa Shukla", sagarika: "Sagarika Ghatge",
  archana: "Archana Puran Singh", amrish: "Amrish Puri", parmeet: "Parmeet Sethi", raveena: "Raveena Tandon",
  karisma: "Karisma Kapoor", harshaali: "Harshaali Malhotra", siddharth: "Siddharth", soha: "Soha Ali Khan",
  arjunk: "Arjun Kapoor", sara: "Sara Ali Khan", pankaj: "Pankaj Tripathi", diana: "Diana Penty",
  minissha: "Minissha Lamba", nana: "Nana Patekar", manoj: "Manoj Bajpayee", bobby: "Bobby Deol",
  rashmika: "Rashmika Mandanna", tripti: "Tripti Dimri", sridevi: "Sridevi", swara: "Swara Bhasker",
  shikha: "Shikha Talsania", kiara: "Kiara Advani", randeep: "Randeep Hooda", amitsadh: "Amit Sadh",
  uday: "Uday Chopra", jimmy: "Jimmy Shergill", jackie: "Jackie Shroff", ompuri: "Om Puri",
  amritasingh: "Amrita Singh", ronit: "Ronit Roy", revathi: "Revathi",
};

// [id, title, year, cast]
const FILMS = [
  ["dearzindagi", "Dear Zindagi", 2016, "alia srk kunalk alizafar angadbedi *adityark"],
  ["brahmastra", "Brahmastra Part One: Shiva", 2022, "ranbir alia amitabh nagarjuna mouniroy *srk"],
  ["wakeupsid", "Wake Up Sid", 2009, "ranbir konkona anupam supriya rahulkhanna"],
  ["ddd", "Dil Dhadakne Do", 2015, "anil shefali priyanka ranveer anushka farhan rahulbose"],
  ["oso", "Om Shanti Om", 2007, "srk deepika arjunrampal shreyas kirron *akshay *abhishek *salman *rani *kajol"],
  ["luckbychance", "Luck By Chance", 2009, "farhan konkona rishi dimple juhi ishasharvani sanjaykapoor *hrithik *srk *aamir *kareena *ranbir *abhishek"],
  ["znmd", "Zindagi Na Milegi Dobara", 2011, "hrithik farhan abhaydeol katrina kalki *naseer"],
  ["k3g", "Kabhi Khushi Kabhie Gham", 2001, "amitabh jaya srk kajol hrithik kareena farida johnny *rani"],
  ["threeidiots", "3 Idiots", 2009, "aamir madhavan sharman kareena boman omi monasingh"],
  ["yjhd", "Yeh Jawaani Hai Deewani", 2013, "ranbir deepika adityark kalki kunalroykapur farooq *madhuri"],
  ["gullyboy", "Gully Boy", 2019, "ranveer alia siddhant kalki vijayraaz"],
  ["rarkpk", "Rocky Aur Rani Kii Prem Kahaani", 2023, "ranveer alia dharmendra jaya shabana"],
  ["bbb", "Band Baaja Baaraat", 2010, "ranveer anushka"],
  ["rnbdj", "Rab Ne Bana Di Jodi", 2008, "srk anushka vinay"],
  ["jhms", "Jab Harry Met Sejal", 2017, "srk anushka"],
  ["zero", "Zero", 2018, "srk anushka katrina"],
  ["dch", "Dil Chahta Hai", 2001, "aamir saif akshaye preity sonali dimple"],
  ["bajirao", "Bajirao Mastani", 2015, "ranveer deepika priyanka tanvi"],
  ["padmaavat", "Padmaavat", 2018, "deepika ranveer shahid jimsarbh"],
  ["ramleela", "Goliyon Ki Raasleela Ram-Leela", 2013, "ranveer deepika supriya richa *priyanka"],
  ["chennai", "Chennai Express", 2013, "srk deepika"],
  ["hny", "Happy New Year", 2014, "srk deepika abhishek sonusood boman vivaan"],
  ["jawan", "Jawan", 2023, "srk nayanthara vijaysethupathi sanya *deepika *sanjaydutt"],
  ["pathaan", "Pathaan", 2023, "srk deepika john dimple *salman"],
  ["don", "Don", 2006, "srk priyanka arjunrampal boman isha *kareena"],
  ["khnh", "Kal Ho Naa Ho", 2003, "srk preity saif jaya"],
  ["rockon", "Rock On!!", 2008, "farhan arjunrampal purab prachi shahana"],
  ["bmb", "Bhaag Milkha Bhaag", 2013, "farhan sonam divyadutta pavan"],
  ["talaash", "Talaash", 2012, "aamir kareena rani nawaz"],
  ["pk", "PK", 2014, "aamir anushka sushant boman sanjaydutt saurabh *ranbir"],
  ["dangal", "Dangal", 2016, "aamir sakshi fatima sanya zaira"],
  ["barfi", "Barfi!", 2012, "ranbir priyanka ileana"],
  ["sanju", "Sanju", 2018, "ranbir vicky paresh anushka sonam manisha dia"],
  ["adhm", "Ae Dil Hai Mushkil", 2016, "ranbir anushka aishwarya *fawad *srk *alia"],
  ["kapoorsons", "Kapoor & Sons", 2016, "sidharth fawad alia rishi ratna rajatkapoor"],
  ["raazi", "Raazi", 2018, "alia vicky"],
  ["udtapunjab", "Udta Punjab", 2016, "shahid alia kareena diljit"],
  ["gangubai", "Gangubai Kathiawadi", 2022, "alia vijayraaz shantanu *ajay"],
  ["krrish", "Krrish", 2006, "hrithik priyanka rekha naseer"],
  ["agneepath", "Agneepath", 2012, "hrithik priyanka sanjaydutt rishi"],
  ["war", "War", 2019, "hrithik tiger vaani"],
  ["mdk", "Mujhse Dosti Karoge!", 2002, "hrithik rani kareena"],
  ["jwm", "Jab We Met", 2007, "shahid kareena"],
  ["omkara", "Omkara", 2006, "ajay saif vivek kareena konkona naseer *bipasha"],
  ["page3", "Page 3", 2005, "konkona atul sandhya boman"],
  ["metro", "Life in a... Metro", 2007, "dharmendra shilpa kaykay konkona irrfan shiney kangana sharman"],
  ["lumb", "Lipstick Under My Burkha", 2017, "konkona ratna aahana plabita"],
  ["ektdaayan", "Ek Thi Daayan", 2013, "emraan konkona huma kalki"],
  ["talvar", "Talvar", 2015, "irrfan konkona neeraj sohum"],
  ["iyer", "Mr. and Mrs. Iyer", 2002, "konkona rahulbose"],
  ["aajanachle", "Aaja Nachle", 2007, "madhuri konkona kunalk akshaye irrfan ranvirshorey"],
  ["lcmd", "Laaga Chunari Mein Daag", 2007, "rani konkona abhishek kunalk jaya anupam"],
  ["atithi", "Atithi Tum Kab Jaoge?", 2010, "ajay konkona paresh"],
  ["fashion", "Fashion", 2008, "priyanka kangana mugdha arjunrampal"],
  ["queen", "Queen", 2014, "kangana rajkummar lisa"],
  ["dilse", "Dil Se..", 1998, "srk manisha preity"],
  ["chakde", "Chak De! India", 2007, "srk vidya shilpashukla sagarika"],
  ["kkhh", "Kuch Kuch Hota Hai", 1998, "srk kajol rani anupam farida archana johnny *salman"],
  ["ddlj", "Dilwale Dulhania Le Jayenge", 1995, "srk kajol amrish anupam farida parmeet"],
  ["aaa", "Andaz Apna Apna", 1994, "aamir salman raveena karisma paresh"],
  ["bajrangi", "Bajrangi Bhaijaan", 2015, "salman kareena nawaz harshaali"],
  ["rdb", "Rang De Basanti", 2006, "aamir siddharth sharman kunalk atul soha madhavan"],
  ["gunday", "Gunday", 2014, "ranveer arjunk priyanka irrfan"],
  ["simmba", "Simmba", 2018, "ranveer sara sonusood *ajay"],
  ["eightythree", "83", 2021, "ranveer deepika pankaj"],
  ["piku", "Piku", 2015, "deepika amitabh irrfan"],
  ["cocktail", "Cocktail", 2012, "saif deepika diana"],
  ["tamasha", "Tamasha", 2015, "ranbir deepika"],
  ["baeh", "Bachna Ae Haseeno", 2008, "ranbir deepika bipasha minissha"],
  ["apkgk", "Ajab Prem Ki Ghazab Kahani", 2009, "ranbir katrina"],
  ["rajneeti", "Raajneeti", 2010, "ranbir katrina ajay arjunrampal nana manoj naseer"],
  ["animal", "Animal", 2023, "ranbir anil bobby rashmika tripti"],
  ["mrindia", "Mr. India", 1987, "anil sridevi amrish"],
  ["welcome", "Welcome", 2007, "akshay katrina anil nana paresh"],
  ["elkdtal", "Ek Ladki Ko Dekha Toh Aisa Laga", 2019, "anil sonam rajkummar juhi"],
  ["veere", "Veere Di Wedding", 2018, "kareena sonam swara shikha"],
  ["goodnewwz", "Good Newwz", 2019, "akshay kareena diljit kiara"],
  ["jthj", "Jab Tak Hai Jaan", 2012, "srk katrina anushka"],
  ["sultan", "Sultan", 2016, "salman anushka randeep amitsadh"],
  ["mohabbatein", "Mohabbatein", 2000, "amitabh srk aishwarya uday jimmy"],
  ["devdas", "Devdas", 2002, "srk aishwarya madhuri jackie kirron"],
  ["hdds", "Hum Dil De Chuke Sanam", 1999, "salman aishwarya ajay"],
  ["jodhaa", "Jodhaa Akbar", 2008, "hrithik aishwarya sonusood"],
  ["dhoom2", "Dhoom 2", 2006, "hrithik aishwarya abhishek uday bipasha"],
  ["lakshya", "Lakshya", 2004, "hrithik preity amitabh ompuri"],
  ["kmg", "Koi... Mil Gaya", 2003, "hrithik preity rekha"],
  ["bab", "Bunty Aur Babli", 2005, "abhishek rani amitabh *aishwarya"],
  ["kank", "Kabhi Alvida Naa Kehna", 2006, "srk rani abhishek preity amitabh kirron"],
  ["black", "Black", 2005, "amitabh rani"],
  ["taal", "Taal", 1999, "anil aishwarya akshaye"],
  ["jaggajasoos", "Jagga Jasoos", 2017, "ranbir katrina"],
  ["twostates", "2 States", 2014, "arjunk alia amritasingh ronit revathi"],
  ["highway", "Highway", 2014, "alia randeep"],
];

const STARS = [
  "srk", "konkona", "alia", "ranbir", "priyanka", "farhan", "anil", "ranveer", "anushka", "deepika",
  "aamir", "kareena", "hrithik", "amitabh", "kajol", "rani", "katrina", "aishwarya", "salman", "saif",
  "ajay", "akshay", "kangana", "irrfan", "vicky", "kalki", "preity", "abhishek", "madhuri", "shahid",
];

const LADDER = [
  ["srk", "konkona"], ["ranveer", "farhan"], ["ranbir", "priyanka"], ["alia", "aamir"], ["anil", "deepika"],
  ["hrithik", "anushka"], ["kareena", "ranveer"], ["aamir", "konkona"], ["priyanka", "kajol"],
  ["katrina", "rani"], ["fatima", "konkona"], ["vaani", "kangana"], ["siddhant", "tiger"],
  ["zaira", "vaani"], ["harshaali", "tripti"],
];

const ALIAS = {
  srk: "srk shahrukh sharukh king khan", priyanka: "pc priyanka chopra", kareena: "bebo kareena kapoor",
  amitabh: "big b", aishwarya: "ash", akshay: "akki", hrithik: "hrithik duggu", ranbir: "rk",
};

/* ───────────────────────── 2. THEME, HELPERS, PLACEHOLDER ART ───────────────────────── */

const C = {
  orange: "#E85D04", mango: "#F48C06", marigold: "#FAA307", teal: "#136F63", pink: "#D81159",
  purple: "#4A154B", cream: "#FFF8E7", crimson: "#C1121F", ink: "#2A0E2C", emerald: "#10B981", film: "#1d0b1f",
};
const DISPLAY = "'Bowlby One','Impact','Arial Black',sans-serif";
const BODY = "'Baloo 2','Trebuchet MS',system-ui,sans-serif";
const GRAD = "linear-gradient(180deg,#E85D04 0%,#F48C06 55%,#FAA307 100%)";
const RAYS = "repeating-conic-gradient(from 0deg at 50% 36%, rgba(255,248,231,0.17) 0deg 7deg, rgba(255,248,231,0) 7deg 15deg)";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bowlby+One&family=Baloo+2:wght@500;700;800&display=swap');
.fsl button{font-family:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}
.fsl input{font-family:inherit}
.fsl-spin{animation:fslspin 3.2s linear infinite}
@keyframes fslspin{to{transform:rotate(360deg)}}
@keyframes shakeA{0%,100%{transform:translateX(0)}15%{transform:translateX(-10px)}30%{transform:translateX(9px)}45%{transform:translateX(-7px)}60%{transform:translateX(5px)}75%{transform:translateX(-3px)}}
@keyframes shakeB{0%,100%{transform:translateX(0)}15%{transform:translateX(-10px)}30%{transform:translateX(9px)}45%{transform:translateX(-7px)}60%{transform:translateX(5px)}75%{transform:translateX(-3px)}}
@keyframes badA{0%{background-color:#C1121F}100%{background-color:#FFF8E7}}
@keyframes badB{0%{background-color:#C1121F}100%{background-color:#FFF8E7}}
@keyframes goodflash{0%{background-color:#34D399}100%{background-color:#10B981}}
@keyframes lock{0%{background-color:#10B981;transform:scale(.94)}60%{transform:scale(1.025)}100%{background-color:#FFF8E7;transform:scale(1)}}
@keyframes fall{0%{transform:translateY(-12%) rotate(0deg);opacity:1}100%{transform:translateY(112vh) rotate(720deg);opacity:.9}}
@keyframes rise{from{transform:translateY(26px) scale(.96);opacity:0}to{transform:none;opacity:1}}
@media (prefers-reduced-motion:reduce){.fsl-spin{animation:none}.fsl *{animation-duration:.01ms!important}}
.fsl-col,.fsl-narrow,.fsl-rooms{width:100%;margin-left:auto;margin-right:auto}
.fsl-grid2{display:grid;gap:.75rem}
.fsl-play{display:block}
.fsl-mid .fsl-col{max-width:42rem}
.fsl-mid .fsl-narrow,.fsl-mid .fsl-rooms,.fsl-wide .fsl-narrow{max-width:34rem}
.fsl-wide .fsl-col{max-width:60rem}
.fsl-wide .fsl-grid2{grid-template-columns:1fr 1fr;gap:1rem}
.fsl-wide .fsl-play{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:1.5rem;align-items:start}
.fsl-wide .fsl-play-b>:first-child{margin-top:0!important}
.fsl-wide .fsl-rooms{max-width:none;column-count:2;column-gap:1.25rem}
.fsl-wide .fsl-rooms>*{break-inside:avoid;margin-top:0!important;margin-bottom:1.25rem}
`;

const sprH = {
  height: 10,
  backgroundImage: `repeating-linear-gradient(90deg, transparent 0 6px, ${C.cream} 6px 18px, transparent 18px 26px)`,
  backgroundSize: "100% 6px", backgroundRepeat: "no-repeat", backgroundPosition: "center",
};
const sprV = {
  backgroundImage: `repeating-linear-gradient(180deg, transparent 0 6px, ${C.cream} 6px 20px, transparent 20px 28px)`,
  backgroundSize: "7px 100%", backgroundRepeat: "no-repeat", backgroundPosition: "center",
};
const btn = (bg, fg = C.cream) => ({
  background: bg, color: fg, border: `3px solid ${C.purple}`, boxShadow: `3px 4px 0 ${C.purple}`, fontFamily: DISPLAY,
});

// TMDB key is baked in at build time from the VITE_TMDB_KEY environment variable (set it in Vercel).
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY || "";
const mem = {};
const store = {
  get(k) { try { const v = window.localStorage.getItem(k); return v === null ? (mem[k] ?? null) : v; } catch (e) { return mem[k] ?? null; } },
  set(k, v) { mem[k] = v; try { window.localStorage.setItem(k, v); } catch (e) { /* in-memory only */ } },
  del(k) { delete mem[k]; try { window.localStorage.removeItem(k); } catch (e) { /* ignore */ } },
};

const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const PAL = [[C.pink, C.marigold], [C.teal, C.marigold], [C.purple, C.pink], [C.orange, C.purple], [C.teal, C.cream], [C.crimson, C.marigold]];
const rays = (cx, cy, n, len, fill, op) => {
  let s = "";
  for (let i = 0; i < n; i++) {
    const a1 = (i * 2 * Math.PI) / n, a2 = a1 + Math.PI / n;
    s += `<polygon points="${cx},${cy} ${(cx + len * Math.cos(a1)).toFixed(1)},${(cy + len * Math.sin(a1)).toFixed(1)} ${(cx + len * Math.cos(a2)).toFixed(1)},${(cy + len * Math.sin(a2)).toFixed(1)}" fill="${fill}" opacity="${op}"/>`;
  }
  return s;
};
const uri = (svg) => "data:image/svg+xml;utf8," + encodeURIComponent(svg);
const artCache = new Map();
function avatarUri(name) {
  const key = "a:" + name;
  if (artCache.has(key)) return artCache.get(key);
  const [a, b] = PAL[hash(name) % PAL.length];
  const ini = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const out = uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="${a}"/>${rays(60, 60, 14, 120, b, 0.35)}<circle cx="60" cy="60" r="34" fill="${C.cream}" stroke="${C.purple}" stroke-width="4"/><text x="60" y="73" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="36" fill="${a}" stroke="${C.purple}" stroke-width="1">${esc(ini)}</text></svg>`);
  artCache.set(key, out);
  return out;
}
function wrapTitle(title) {
  const lines = []; let cur = "";
  for (const w of title.split(" ")) {
    if (cur && (cur + " " + w).length > 11) { lines.push(cur); cur = w; } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 4);
}
function posterUri(title, year) {
  const key = "p:" + title + year;
  if (artCache.has(key)) return artCache.get(key);
  const [a, b] = PAL[hash(title) % PAL.length];
  const lines = wrapTitle(title);
  const fs = lines.some((l) => l.length > 9) ? 21 : 26;
  const y0 = 150 - (lines.length - 1) * fs * 0.55;
  const text = lines.map((l, i) => `<text x="100" y="${(y0 + i * fs * 1.12).toFixed(1)}" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="${fs}" fill="${C.cream}" stroke="${C.purple}" stroke-width="5" paint-order="stroke" stroke-linejoin="round">${esc(l.toUpperCase())}</text>`).join("");
  const out = uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><rect width="200" height="300" fill="${a}"/>${rays(100, 120, 18, 320, b, 0.4)}<rect x="8" y="8" width="184" height="284" fill="none" stroke="${C.cream}" stroke-width="3"/><rect x="14" y="14" width="172" height="272" fill="none" stroke="${C.purple}" stroke-width="2"/>${text}<rect x="50" y="248" width="100" height="26" rx="13" fill="${C.purple}"/><text x="100" y="267" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="17" fill="${C.marigold}">${esc(year)}</text></svg>`);
  artCache.set(key, out);
  return out;
}

/* ───────────────────────── 3. DATA LAYER: LOCAL + TMDB ───────────────────────── */

const ACTORS = {}, MOVIES = {};
Object.keys(ACTOR_NAMES).forEach((id) => { ACTORS[id] = { id, name: ACTOR_NAMES[id], films: [] }; });
FILMS.forEach(([id, title, year, cast]) => {
  const c = [];
  cast.split(" ").forEach((tok) => {
    const cameo = tok[0] === "*"; const aid = cameo ? tok.slice(1) : tok;
    if (!ACTORS[aid]) return;
    c.push({ id: aid, cameo }); ACTORS[aid].films.push({ id, cameo });
  });
  MOVIES[id] = { id, title, year, cast: c };
});
const NAME_INDEX = {};
Object.keys(ACTORS).forEach((id) => {
  const n = norm(ACTORS[id].name);
  NAME_INDEX[n] = id;
  const two = n.split(" ").slice(0, 2).join(" ");
  if (!NAME_INDEX[two]) NAME_INDEX[two] = id;
});

const localActor = (id) => ({ id, name: ACTORS[id].name, photo: avatarUri(ACTORS[id].name), src: "local" });
const localMovie = (id) => ({ id, title: MOVIES[id].title, year: MOVIES[id].year, poster: posterUri(MOVIES[id].title, MOVIES[id].year), src: "local" });
const localIdByName = (name) => NAME_INDEX[norm(name)] || NAME_INDEX[norm(name).split(" ").slice(0, 2).join(" ")] || null;
const toLocalId = (n) => (n.src === "local" ? n.id : localIdByName(n.name));

function matchScore(text, q) {
  const t = norm(text), qq = norm(q);
  if (!qq) return -1;
  const toks = qq.split(" ");
  const ok = toks.every((k) => t.includes(k)) || t.replace(/ /g, "").includes(qq.replace(/ /g, ""));
  if (!ok) return -1;
  return t.startsWith(qq) ? 2 : t.split(" ").some((w) => w.startsWith(toks[0])) ? 1 : 0;
}

const localApi = {
  kind: "local",
  async searchActors(q) {
    return Object.keys(ACTORS)
      .filter((id) => ACTORS[id].films.length)
      .map((id) => ({ id, s: matchScore(ACTORS[id].name + " " + (ALIAS[id] || ""), q) }))
      .filter((x) => x.s >= 0).sort((a, b) => b.s - a.s).slice(0, 8).map((x) => localActor(x.id));
  },
  async searchMovies(q) {
    return Object.keys(MOVIES)
      .map((id) => ({ id, s: matchScore(MOVIES[id].title + " " + id, q) }))
      .filter((x) => x.s >= 0).sort((a, b) => b.s - a.s || MOVIES[b.id].year - MOVIES[a.id].year).slice(0, 8).map((x) => localMovie(x.id));
  },
  async moviesOf(actorId, cameos) {
    const a = ACTORS[actorId]; if (!a) return [];
    return a.films.filter((f) => cameos || !f.cameo).map((f) => localMovie(f.id)).sort((x, y) => y.year - x.year);
  },
  async castOf(movieId, cameos) {
    const m = MOVIES[movieId]; if (!m) return [];
    return m.cast.filter((c) => cameos || !c.cameo).map((c) => localActor(c.id));
  },
  async credit(actorId, movieId) {
    const m = MOVIES[movieId]; const e = m && m.cast.find((c) => c.id === actorId);
    return !e ? "no" : e.cameo ? "cameo" : "yes";
  },
  async resolveActor(x) { const id = ACTORS[x.id] ? x.id : localIdByName(x.name); return id ? localActor(id) : null; },
};

// ───────── TMDB ─────────
// Nothing is filtered out. Every kind of credit TMDB returns (cast, crew, guest stars, uncredited rows)
// is merged and de-duplicated, so cameos and special appearances are always included.
const tmdbCache = {};
function getTmdb(key) {
  if (tmdbCache[key]) return tmdbCache[key];
  const bearer = key.length > 40; const cache = new Map();
  const get = async (path, params = {}) => {
    const ck = path + JSON.stringify(params);
    if (cache.has(ck)) return cache.get(ck);
    const url = new URL("https://api.themoviedb.org/3" + path);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    if (!bearer) url.searchParams.set("api_key", key);
    const opts = bearer ? { headers: { Authorization: "Bearer " + key, accept: "application/json" } } : undefined;
    let res = await fetch(url.toString(), opts);
    if (res.status === 429) { await new Promise((r) => setTimeout(r, 800)); res = await fetch(url.toString(), opts); }
    // A 404 just means "nothing there" (a removed person or film). Only real failures (bad key, outage) switch the app off TMDB.
    if (res.status === 404) { cache.set(ck, {}); return {}; }
    if (!res.ok) throw new Error("TMDB " + res.status);
    const j = await res.json(); cache.set(ck, j); return j;
  };
  const img = (p) => (p ? "https://image.tmdb.org/t/p/w185" + p : null);
  const mv = (r) => ({ id: "t" + r.id, title: r.title || r.original_title || "Untitled", year: (r.release_date || "").slice(0, 4) || "—", poster: img(r.poster_path), src: "tmdb" });
  const ac = (r) => ({ id: "t" + r.id, name: r.name, photo: img(r.profile_path), src: "tmdb" });
  const uniqBy = (arr, keyOf) => { const seen = new Set(); return arr.filter((x) => { const k = keyOf(x); if (seen.has(k)) return false; seen.add(k); return true; }); };
  // cast + guest stars + uncredited + crew, all in one list (cast first so real roles win when de-duplicating)
  const everyCredit = (j) => [...(j.cast || []), ...(j.guest_stars || []), ...(j.uncredited || []), ...(j.crew || [])];
  // Reads up to n result pages (page 1 must succeed so network problems surface; later pages are a bonus).
  const pages = async (path, query, n = 3) => {
    const first = await get(path, { query, include_adult: "false", page: "1" });
    const last = Math.min(n, first.total_pages || 1);
    const more = await Promise.all(Array.from({ length: Math.max(0, last - 1) }, (_, i) => get(path, { query, include_adult: "false", page: String(i + 2) }).catch(() => ({ results: [] }))));
    return uniqBy([first, ...more].flatMap((j) => j.results || []), (r) => r.id);
  };
  // Spelling-tolerant helpers: "Shraddha" and "Shradha" look the same once the h's and doubled letters are gone.
  const loose = (t) => norm(t).replace(/h/g, "").replace(/(.)\1+/g, "$1").replace(/ /g, "");
  const lev = (a, b) => {
    if (a === b) return 0;
    const m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  };
  // The typed query plus alternate spellings and the first/last word, so one odd spelling never hides a match.
  const queryVariants = (q) => {
    const base = String(q).trim();
    const n = norm(base);
    const toks = n.split(" ").filter(Boolean);
    const out = [base, n, n.replace(/(.)\1+/g, "$1"), n.replace(/sh/g, "s")];
    if (toks.length > 1) { out.push(toks[0]); if (toks[toks.length - 1].length >= 3) out.push(toks[toks.length - 1]); }
    return [...new Set(out.filter((x) => x && x.length >= 2))];
  };
  const rankSort = (list, scoreOf) => list.map((r, i) => ({ r, i, s: scoreOf(r) })).sort((a, b) => b.s - a.s || a.i - b.i).map((x) => x.r);
  const personScore = (q, r) => {
    const name = r.name || ""; const n = norm(name), qq = norm(q);
    let s = n === qq ? 10 : n.startsWith(qq) ? 7 : n.includes(qq) ? 6 : 0;
    const qt = qq.split(" ").filter(Boolean), nt = n.split(" ");
    s += (qt.filter((t) => nt.some((w) => w === t || w.startsWith(t) || (w.length >= 3 && t.startsWith(w)))).length / Math.max(1, qt.length)) * 4;
    const ln = loose(name), lq = loose(q);
    if (ln === lq) s += 8; else if (lq.length > 2 && ln.includes(lq)) s += 5;
    const d = lev(ln, lq);
    if (d <= 2) s += 3 - d;
    if (r.known_for_department === "Acting") s += 1;
    return s + Math.min(2, (r.popularity || 0) / 25);
  };
  const titleScore = (q, text, bonus) => {
    const t = norm(text), qq = norm(q);
    let s = t === qq ? 6 : t.startsWith(qq) ? 4 : t.includes(qq) ? 3 : 0;
    const lt = loose(text), lq = loose(q);
    if (lt === lq) s += 4; else if (lq.length > 2 && lt.includes(lq)) s += 2;
    if (lev(lt, lq) <= 2) s += 1;
    return s + bonus;
  };
  const personCredits = async (aid) => everyCredit(await get(`/person/${aid.slice(1)}/movie_credits`));
  const filmCredits = async (mid) => everyCredit(await get(`/movie/${mid.slice(1)}/credits`));
  const api = {
    kind: "tmdb",
    verify: () => get("/configuration"),
    // Searches the typed name and its alternate spellings across several pages and merges everything.
    // Results are ranked, never dropped, and people from every department are included.
    async searchActors(q) {
      const vs = queryVariants(q);
      if (!vs.length) return [];
      const [main, ...others] = await Promise.all([pages("/search/person", vs[0], 5), ...vs.slice(1).map((v) => pages("/search/person", v, 1).catch(() => []))]);
      const all = uniqBy([...main, ...others.flat()], (r) => r.id);
      return rankSort(all, (r) => personScore(q, r)).slice(0, 20).map(ac);
    },
    async searchMovies(q) {
      const vs = queryVariants(q);
      if (!vs.length) return [];
      const [main, ...others] = await Promise.all([pages("/search/movie", vs[0], 3), ...vs.slice(1).map((v) => pages("/search/movie", v, 1).catch(() => []))]);
      const all = uniqBy([...main, ...others.flat()], (r) => r.id);
      return rankSort(all, (r) => titleScore(q, r.title || r.original_title || "", r.original_language === "hi" ? 1 : 0)).slice(0, 20).map(mv);
    },
    // Every film the person is credited on (cast, crew, special appearances), unfiltered and without a size limit.
    async moviesOf(aid) {
      const l = await personCredits(aid);
      return uniqBy(l, (r) => r.id).sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).map(mv);
    },
    // Every person credited on the film (cast, crew, guest stars, uncredited), unfiltered and without a size limit.
    async castOf(mid) {
      const l = await filmCredits(mid);
      return uniqBy(l, (r) => r.id).map(ac);
    },
    // Looks in the person's credits first, then in the film's full credit list, so a credit missing from one side is still found.
    async credit(aid, mid) {
      const mine = await personCredits(aid);
      if (mine.some((x) => "t" + x.id === mid)) return "yes";
      const theirs = await filmCredits(mid);
      return theirs.some((r) => "t" + r.id === aid) ? "yes" : "no";
    },
    async resolveActor(x) {
      const r = await api.searchActors(x.name);
      return r[0] || null;
    },
  };
  tmdbCache[key] = api;
  return api;
}

function solveLocal(aId, bId, cameos) {
  if (!ACTORS[aId] || !ACTORS[bId] || aId === bId) return null;
  const prev = { [aId]: null }; const q = [aId];
  while (q.length) {
    const cur = q.shift();
    for (const f of ACTORS[cur].films) {
      if (!cameos && f.cameo) continue;
      for (const c of MOVIES[f.id].cast) {
        if (!cameos && c.cameo) continue;
        if (c.id in prev) continue;
        prev[c.id] = { from: cur, film: f.id };
        if (c.id === bId) {
          const ids = [bId]; let k = bId;
          while (prev[k]) { ids.unshift(prev[k].film); ids.unshift(prev[k].from); k = prev[k].from; }
          return { ids, films: (ids.length - 1) / 2 };
        }
        q.push(c.id);
      }
    }
  }
  return null;
}

const encodeRef = (a) => (a.src === "local" ? a.id : `${a.id}~${encodeURIComponent(a.name)}`);
const decodeRef = (r) => {
  if (/^t\d+~/.test(r)) { const [id, n] = r.split("~"); return { id, name: decodeURIComponent(n), photo: null, src: "tmdb" }; }
  return ACTORS[r] ? localActor(r) : null;
};
function challengeUrl(a, b, cameos, hints) {
  let base = "https://your-app.vercel.app/";
  try { const u = window.location.origin + window.location.pathname; if (/^https?:/.test(u)) base = u; } catch (e) { /* placeholder */ }
  return `${base}?a=${encodeURIComponent(encodeRef(a))}&b=${encodeURIComponent(encodeRef(b))}&c=${cameos ? 1 : 0}&h=${hints ? 1 : 0}`;
}
async function copyText(t) {
  try { await navigator.clipboard.writeText(t); return true; } catch (e) {
    try {
      const ta = document.createElement("textarea"); ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select(); const ok = document.execCommand("copy"); document.body.removeChild(ta); return ok;
    } catch (e2) { return false; }
  }
}
const OOPS = [
  (a, m) => `Arre! ${a} wasn’t in “${m}”, or it was just a cameo!`,
  (a, m) => `Kya baat kar rahe ho? ${a} isn’t in “${m}”!`,
  (a, m) => `Cut! Retake! ${a} never made it into “${m}”.`,
  (a, m) => `Haye! “${m}” has no ${a} in the cast. Try again, boss!`,
];

/* ───────────────────────── 4. SMALL UI PIECES ───────────────────────── */

/* ───────── MULTIPLAYER ROOM STORAGE ─────────
   Rooms use the artifact's shared storage (window.storage) when it exists. Anywhere else they
   fall back to this device's own storage, which only connects tabs on the same device.
   For real cross-device rooms on Vercel, swap the get / set / del / list methods below for a
   backend (Vercel KV, Supabase, Firebase...). Nothing else in the app needs to change. */
const ROOM_CODES = [
  "K3G1", "SHOL", "DDLJ", "KKHH", "DON1", "YJHD", "ZNMD", "OSO7", "JAWN", "PATH", "RDB6", "DILS", "DEVD", "KANK", "TAAL",
  "DANG", "PIKU", "QUEN", "BAJI", "GULY", "ANIM", "WAR1", "SANJ", "LAGA", "CHAK", "BARF", "RAAZ", "KRSH", "FANA", "ZERO",
];
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const hasShared = () => typeof window !== "undefined" && !!window.storage;

// ───────── SUPABASE (real-time rooms across phones) ─────────
// Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see README). Without them the app falls back to
// the older storage below, which only connects tabs on one device.
const SB_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const sb = SB_URL && SB_KEY ? createClient(SB_URL, SB_KEY, { realtime: { params: { eventsPerSecond: 20 } } }) : null;
const TABLE = "room_state";
// Every record belongs to a room, so one realtime filter (room=eq.CODE) covers a whole game.
const roomOf = (k) => { const m = /^(?:room|rc|rp):([A-Z0-9]{4})/.exec(k); return m ? m[1] : null; };
const kvLegacy = {
  shared: hasShared,
  async get(k) {
    if (hasShared()) { try { const r = await window.storage.get(k, true); return r && r.value ? JSON.parse(r.value) : null; } catch (e) { return null; } }
    try { const v = store.get("fsl:kv:" + k); return v ? JSON.parse(v) : null; } catch (e) { return null; }
  },
  async set(k, v) {
    const s = JSON.stringify(v);
    if (hasShared()) { try { await window.storage.set(k, s, true); return true; } catch (e) { return false; } }
    store.set("fsl:kv:" + k, s); return true;
  },
  async del(k) {
    if (hasShared()) { try { await window.storage.delete(k, true); } catch (e) { /* ignore */ } return; }
    store.del("fsl:kv:" + k);
  },
  async list(prefix) {
    if (hasShared()) { try { const r = await window.storage.list(prefix, true); return (r && r.keys) || []; } catch (e) { return []; } }
    const out = new Set(); const p = "fsl:kv:" + prefix;
    Object.keys(mem).forEach((k) => { if (k.startsWith(p)) out.add(k.slice(7)); });
    try { for (let i = 0; i < window.localStorage.length; i++) { const k = window.localStorage.key(i); if (k && k.startsWith(p)) out.add(k.slice(7)); } } catch (e) { /* ignore */ }
    return [...out];
  },
};
const kv = {
  shared: () => !!sb || hasShared(),
  async get(k) {
    if (!sb) return kvLegacy.get(k);
    const { data, error } = await sb.from(TABLE).select("value").eq("key", k).maybeSingle();
    return error || !data ? null : data.value;
  },
  async set(k, v) {
    if (!sb) return kvLegacy.set(k, v);
    const { error } = await sb.from(TABLE).upsert({ key: k, room: roomOf(k), value: v, updated_at: new Date().toISOString() }, { onConflict: "key" });
    return !error;
  },
  async del(k) {
    if (!sb) return kvLegacy.del(k);
    await sb.from(TABLE).delete().eq("key", k);
  },
  async list(prefix) {
    if (!sb) return kvLegacy.list(prefix);
    const { data } = await sb.from(TABLE).select("key").like("key", prefix + "%");
    return (data || []).map((r) => r.key);
  },
  // One round trip for everything in a room (used by fetchRoom when Supabase is on).
  async dump(code) {
    if (!sb) return null;
    const { data, error } = await sb.from(TABLE).select("key,value").eq("room", code);
    return error ? null : data || [];
  },
};
const baseUrl = () => {
  let base = "https://your-app.vercel.app/";
  try { const u = window.location.origin + window.location.pathname; if (/^https?:/.test(u)) base = u; } catch (e) { /* placeholder */ }
  return base;
};
const roomActor = (x) => (x.src === "local" && ACTORS[x.id] ? localActor(x.id) : { ...x, photo: null });
// Co-op boards sync as small records; local art is rebuilt on each device instead of being sent.
const packNode = (n) => {
  const base = n.type === "movie"
    ? { type: "movie", id: n.id, title: n.title, year: n.year, src: n.src, ...(n.src === "tmdb" ? { poster: n.poster || null } : {}) }
    : { type: "actor", id: n.id, name: n.name, src: n.src, ...(n.src === "tmdb" ? { photo: n.photo || null } : {}) };
  return n.by ? { ...base, by: n.by } : base;
};
const unpackNode = (n) => {
  const local = n.src === "local" && (n.type === "movie" ? MOVIES[n.id] : ACTORS[n.id]);
  const out = local ? { type: n.type, ...(n.type === "movie" ? localMovie(n.id) : localActor(n.id)) } : n;
  return n.by ? { ...out, by: n.by } : out;
};
const sigOf = (chain, won) => chain.map((n) => n.type + n.id).join(">") + (won ? "!" : "");
const gameIsDone = (meta, players, coop) => {
  const r = meta.round || 0;
  if (!r) return true;
  if ((meta.endedRound || 0) >= r) return true; // someone pressed End Game
  const everyone = livePlayers(players);
  if (everyone.length > 0 && everyone.every((p) => p.revealVote === r)) return true; // link revealed by all
  if (meta.mode === "coop") return !!(coop && coop.round === r && coop.won);
  const live = livePlayers(players);
  const racers = live.filter((p) => p.round === r);
  return racers.length > 0 && racers.every((p) => p.done) && live.every((p) => p.round === r);
};
const livePlayers = (ps) => {
  const newest = Math.max(0, ...ps.map((p) => p.ping || 0));
  return ps.filter((p) => newest - (p.ping || 0) < 45000);
};

function Img({ src, fallback, alt, className, style }) {
  const [bad, setBad] = useState(false);
  useEffect(() => setBad(false), [src]);
  return <img src={bad || !src ? fallback : src} alt={alt || ""} className={className} style={style} onError={() => setBad(true)} draggable={false} />;
}
function Reel({ size = 28, spin = false, color = C.cream, fill = C.purple }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={spin ? "fsl-spin" : ""} aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill={fill} stroke={color} strokeWidth="2" />
      {[0, 1, 2, 3, 4].map((i) => { const a = (i * 72 * Math.PI) / 180 - Math.PI / 2; return <circle key={i} cx={24 + 12 * Math.cos(a)} cy={24 + 12 * Math.sin(a)} r="5.5" fill={color} />; })}
      <circle cx="24" cy="24" r="4.5" fill={color} /><circle cx="24" cy="24" r="1.8" fill={fill} />
    </svg>
  );
}
const markStyle = (stroke) => ({
  fontFamily: DISPLAY, color: C.crimson, WebkitTextStroke: `${stroke}px ${C.marigold}`, paintOrder: "stroke fill",
  textShadow: `1px 1px 0 ${C.purple},2px 2px 0 ${C.purple},3px 3px 0 ${C.purple},4px 5px 0 ${C.purple},5px 8px 10px rgba(0,0,0,.35)`,
  letterSpacing: "0.02em", lineHeight: 1,
});
function Scallop({ color = C.purple, flip = false, size = 14 }) {
  return <div aria-hidden="true" style={{ height: size / 2 + 2, backgroundImage: `radial-gradient(circle at 50% ${flip ? 0 : 100}%, ${color} 0 ${size / 2 - 1}px, transparent ${size / 2}px)`, backgroundSize: `${size}px 100%`, backgroundRepeat: "repeat-x" }} />;
}
function PopCard({ children, className = "", style = {}, tone = C.cream, ring = C.purple }) {
  return <div className={`rounded-2xl ${className}`} style={{ background: tone, border: `3px solid ${ring}`, boxShadow: `inset 0 0 0 3px ${tone}, inset 0 0 0 5px ${ring}, 4px 5px 0 ${ring}`, ...style }}>{children}</div>;
}
function Portrait({ item, size = 56, ring = C.marigold, ring2 = C.teal }) {
  return (
    <div className="rounded-full shrink-0" style={{ width: size, height: size, padding: 3, background: ring, boxShadow: `0 0 0 3px ${ring2}, 2px 3px 0 3px ${C.purple}` }}>
      <Img src={item.photo} fallback={avatarUri(item.name)} alt={item.name} className="w-full h-full rounded-full object-cover" />
    </div>
  );
}
function Poster({ item, w = 48 }) {
  return (
    <div className="shrink-0 overflow-hidden rounded-md" style={{ width: w, height: Math.round(w * 1.5), border: `2px solid ${C.purple}`, boxShadow: `2px 2px 0 ${C.marigold}` }}>
      <Img src={item.poster} fallback={posterUri(item.title, item.year)} alt={item.title} className="w-full h-full object-cover" />
    </div>
  );
}
function Toggle({ on, onChange, label, desc }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex-1 min-w-0">
        <div style={{ fontFamily: DISPLAY, fontSize: 15, color: C.purple }}>{label}</div>
        <div className="mt-1" style={{ fontSize: 13, lineHeight: 1.25, color: C.ink }}>{desc}</div>
      </div>
      <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className="shrink-0 relative rounded-full" style={{ width: 54, height: 32, background: on ? C.teal : "#c9b79a", border: `3px solid ${C.purple}`, transition: "background .2s" }}>
        <span className="absolute rounded-full" style={{ top: 2, left: on ? 24 : 2, width: 22, height: 22, background: C.cream, border: `2px solid ${C.purple}`, transition: "left .2s" }} />
      </button>
    </div>
  );
}
// Picks how much to scale the whole app for this screen and which layout to use.
// Phones stay at 1x. Tablets and laptops scale up so text and buttons stay comfortable, and wide
// screens switch to two columns. "mid" = one centred column, "wide" = two columns.
function calcLayout() {
  if (typeof window === "undefined") return { s: 1, mid: false, wide: false };
  const w = window.innerWidth, h = window.innerHeight;
  const sw = w >= 1800 ? 1.6 : w >= 1400 ? 1.4 : w >= 1024 ? 1.25 : w >= 768 ? 1.2 : w >= 640 ? 1.1 : 1;
  const sh = h >= 1000 ? 1.6 : h >= 820 ? 1.3 : h >= 700 ? 1.15 : 1;
  const s = Math.min(sw, sh);
  const vw = w / s, vh = h / s;
  return { s, mid: vw >= 640 && !(vw >= 800 && vh >= 560), wide: vw >= 800 && vh >= 560 };
}
function MiniToggle({ label, aria, on, onChange }) {
  return (
    <button role="switch" aria-checked={on} aria-label={aria || label} onClick={() => onChange(!on)} className="flex items-center justify-between gap-2 rounded-full" style={{ background: C.cream, border: `2px solid ${C.purple}`, boxShadow: `2px 3px 0 ${C.purple}`, height: 28, minWidth: 116, padding: "0 3px 0 12px" }}>
      <span className="font-bold" style={{ fontSize: 12, color: C.purple }}>{label}</span>
      <span className="relative rounded-full" style={{ width: 36, height: 20, background: on ? C.teal : "#c9b79a", border: `2px solid ${C.purple}`, transition: "background .2s" }}>
        <span className="absolute rounded-full" style={{ top: 1, left: on ? 17 : 1, width: 14, height: 14, background: C.cream, border: `1.5px solid ${C.purple}`, transition: "left .2s" }} />
      </span>
    </button>
  );
}
function Row({ item, type, onClick }) {
  return (
    <button type="button" onClick={onClick} className="w-full flex items-center gap-3 px-3 py-2 text-left" style={{ minHeight: 62, borderTop: `2px dashed ${C.purple}44`, background: "transparent" }}>
      {type === "movie" ? <Poster item={item} w={40} /> : <Portrait item={item} size={44} />}
      <div className="min-w-0 flex-1">
        <div className="font-bold truncate" style={{ color: C.ink, fontSize: 16 }}>{type === "movie" ? item.title : item.name}</div>
        {type === "movie" && <div style={{ color: C.teal, fontSize: 13, fontWeight: 700 }}>{item.year}</div>}
      </div>
    </button>
  );
}

/* ───────────────────────── 5. GAME PIECES ───────────────────────── */

function AnswerScreen({ game, answer, solo, room }) {
  const plural = (n) => `${n} movie${n === 1 ? "" : "s"}`;
  return (
    <div className="absolute inset-0 flex items-center justify-center px-3" style={{ background: "rgba(42,14,44,.84)", zIndex: 44 }}>
      <PopCard className="relative w-full overflow-y-auto" style={{ maxHeight: "92%", maxWidth: 560, animation: "rise .5s ease-out" }}>
        <Scallop color={C.pink} size={18} />
        <div className="px-4 pt-3 pb-4">
          <div className="text-center" style={{ ...markStyle(5), fontSize: 26 }}>THE LINK</div>
          <div className="mt-2 text-center font-bold" style={{ fontSize: 14, color: C.purple, lineHeight: 1.2 }}>{game.a.name} to {game.b.name}</div>
          {room && <div className="mt-1 text-center font-bold" style={{ fontSize: 12, color: C.teal }}>Everyone tapped Reveal Link.</div>}
          <div className="mt-3 rounded-xl px-3 py-2 flex items-center gap-3" style={{ background: C.teal, color: C.cream, border: `2px solid ${C.purple}` }}>
            <Trophy size={26} color={C.marigold} />
            <div style={{ fontSize: 14, lineHeight: 1.25 }}>
              {answer && answer.movies ? <b>Shortest possible link: {plural(answer.movies)}</b>
                : answer && answer.unavailable ? "The shortest-link solver only knows the built-in reel, so it can’t show this pair."
                : answer && answer.none ? "No link exists between these two stars."
                : "Working out the shortest link…"}
            </div>
          </div>
          <div className="mt-3">{answer && answer.nodes ? <FilmStripRow nodes={answer.nodes} /> : null}</div>
          {solo && (
            <div className="mt-4 grid grid-cols-1 gap-3">
              <button onClick={solo.onNext} className="rounded-xl py-3 flex items-center justify-center gap-2" style={{ ...btn(C.teal), fontSize: 15 }}>Next Challenge ➔</button>
              <button onClick={solo.onMore} className="rounded-xl py-2" style={{ ...btn(C.cream, C.purple), fontSize: 14 }}>More Challenges</button>
              <button onClick={solo.onBack} className="text-center font-bold" style={{ fontSize: 12, color: C.teal }}>Back to my chain</button>
            </div>
          )}
          {room && (
            <div className="mt-4 grid grid-cols-1 gap-3">
              <button onClick={room.onNext} disabled={room.voted} className="rounded-xl py-3" style={{ ...btn(room.voted ? C.teal : C.pink), fontSize: 15, opacity: room.voted ? 0.85 : 1 }}>{room.voted ? "Ready ✓" : "Next Challenge"}</button>
              {room.text && <div className="text-center font-bold" style={{ fontSize: 13, color: C.teal }}>{room.text}</div>}
              <button onClick={room.onLobby} className="rounded-xl py-2" style={{ ...btn(C.cream, C.purple), fontSize: 14 }}>Exit Lobby</button>
            </div>
          )}
        </div>
      </PopCard>
    </div>
  );
}
function RoomButtons({ roomUI }) {
  return (
    <div className="mt-3 grid grid-cols-1 gap-3">
      <button onClick={roomUI.onNext} disabled={roomUI.voted} className="rounded-xl py-3" style={{ ...btn(roomUI.voted ? C.teal : C.pink), fontSize: 15, opacity: roomUI.voted ? 0.85 : 1 }}>{roomUI.voted ? "Ready ✓" : "Next Game"}</button>
      {roomUI.text && <div className="text-center font-bold" style={{ fontSize: 13, color: C.teal }}>{roomUI.text}</div>}
      <button onClick={roomUI.onLobby} className="rounded-xl py-2" style={{ ...btn(C.cream, C.purple), fontSize: 13 }}>Exit to Lobby</button>
    </div>
  );
}
function RaceResults({ card, game, meId, wins, roomUI, onClose }) {
  const medals = ["🥇", "🥈", "🥉"];
  const w = card.rows[0];
  const plural = (n) => `${n} movie${n === 1 ? "" : "s"}`;
  const tally = Object.values(wins).sort((a, b) => b.n - a.n);
  const chainOf = (p) => (p.id === meId && game ? game.chain : (p.chain || []).map(unpackNode));
  return (
    <div className="absolute inset-0 flex items-center justify-center px-3" style={{ background: "rgba(42,14,44,.78)", zIndex: 45 }}>
      <PopCard className="relative w-full overflow-y-auto" style={{ maxHeight: "92%", maxWidth: 560, animation: "rise .5s ease-out" }}>
        <Scallop color={C.pink} size={18} />
        <div className="px-4 pt-3 pb-4">
          <button onClick={onClose} aria-label="Close results" className="absolute rounded-full flex items-center justify-center" style={{ top: 16, right: 14, width: 34, height: 34, background: C.cream, border: `2px solid ${C.purple}` }}><X size={18} color={C.purple} /></button>
          <div className="text-center" style={{ ...markStyle(5), fontSize: 28 }}>SCORECARD</div>
          <div className="mt-3 text-center" style={{ fontFamily: DISPLAY, fontSize: 16, color: C.purple, lineHeight: 1.2 }}>
            {card.tie ? `Tie on ${plural(w.movies)}! ${w.name} finished first.` : `${w.name} wins with the lowest link: ${plural(w.movies)}!`}
          </div>
          <div className="mt-3 space-y-3">
            {card.rows.map((p, i) => (
              <div key={p.id}>
                <BoardLine me={p.id === meId} lead={medals[i] || "🎞️"} title={`${p.name}${p.id === meId ? " (you)" : ""}: ${plural(p.movies)}`}
                  sub={i === 0 ? (card.tie ? "First to finish" : "Lowest link") : p.movies === w.movies ? "Same link, finished later" : `${p.movies - w.movies} extra movie${p.movies - w.movies === 1 ? "" : "s"}`} />
                <div className="mt-2"><FilmStripRow nodes={chainOf(p)} /></div>
              </div>
            ))}
          </div>
          {tally.length > 0 && (
            <div className="mt-3 rounded-xl px-3 py-2 font-bold" style={{ background: C.teal, color: C.cream, border: `2px solid ${C.purple}`, fontSize: 13 }}>
              Session wins: {tally.map((t) => `${t.name} ${t.n}`).join(", ")}
            </div>
          )}
          <RoomButtons roomUI={roomUI} />
        </div>
      </PopCard>
    </div>
  );
}
function BoardLine({ lead, title, sub, tag, me }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ background: "#fff", border: `2px solid ${me ? C.pink : C.purple}` }}>
      <div className="shrink-0 flex items-center justify-center" style={{ width: 30, fontSize: 22 }}>{lead}</div>
      <div className="min-w-0 flex-1">
        <div className="font-bold" style={{ fontSize: 14, lineHeight: 1.2, color: C.ink }}>{title}</div>
        <div style={{ fontSize: 12, color: C.teal, fontWeight: 700 }}>{sub}</div>
      </div>
      {tag && <span className="shrink-0 rounded-full px-2 font-bold" style={{ background: C.marigold, color: C.ink, fontSize: 11 }}>{tag}</span>}
    </div>
  );
}
function Scoreboard({ board, meId }) {
  if (!board) return null;
  const medals = ["🥇", "🥈", "🥉"];
  const first = board.fin[0];
  const best = board.fin.length > 1 ? Math.min(...board.fin.map((p) => p.movies)) : null;
  const plural = (n) => `${n} movie${n === 1 ? "" : "s"}`;
  return (
    <div>
      <div style={{ fontFamily: DISPLAY, fontSize: 16, color: C.purple }}>Scoreboard</div>
      {board.r === 0 && <div className="mt-2" style={{ fontSize: 14 }}>No match yet. Start one and the finishes land here live.</div>}
      <div className="mt-2 space-y-2">
        {board.fin.map((p, i) => (
          <BoardLine key={p.id} me={p.id === meId} lead={medals[i] || "🎞️"} title={`${p.name}${p.id === meId ? " (you)" : ""} finished in ${plural(p.movies)}!`}
            sub={i === 0 ? "First to the finish" : `${Math.max(1, Math.round((p.doneAt - first.doneAt) / 1000))}s behind the leader`} tag={best !== null && p.movies === best ? "Fewest movies" : null} />
        ))}
        {board.run.map((p) => (
          <BoardLine key={p.id} me={p.id === meId} lead={<Reel size={24} spin color={C.marigold} />} title={`${p.name}${p.id === meId ? " (you)" : ""} is racing`} sub={`${plural(p.movies)} used so far`} />
        ))}
        {board.idle.map((p) => (
          <BoardLine key={p.id} me={p.id === meId} lead="🍿" title={`${p.name}${p.id === meId ? " (you)" : ""}`} sub={board.r === 0 ? "In the lobby" : "Hasn’t joined this match yet"} />
        ))}
      </div>
    </div>
  );
}

function GameHeader({ game, count }) {
  const pat = `repeating-linear-gradient(90deg, transparent 0 6px, ${C.cream} 6px 12px, transparent 12px 18px)`;
  return (
    <div className="sticky top-0 z-20">
      <div style={{ background: C.film, borderBottom: `3px solid ${C.marigold}` }}>
        <div style={sprH} />
        <div className="flex items-start gap-1 px-3 pb-2" style={{ maxWidth: "40rem", marginLeft: "auto", marginRight: "auto" }}>
          <div className="flex flex-col items-center" style={{ width: 76 }}>
            <Portrait item={game.a} size={50} />
            <div className="mt-2 text-center font-bold" style={{ color: C.cream, fontSize: 11, lineHeight: 1.1 }}>{game.a.name}</div>
          </div>
          <div className="flex-1 flex flex-col items-center" style={{ paddingTop: 6 }}>
            <div className="relative w-full flex items-center justify-center" style={{ height: 44 }}>
              <div className="absolute inset-x-0" style={{ top: 5, bottom: 5, background: "#3a2040", borderTop: `2px solid ${C.marigold}`, borderBottom: `2px solid ${C.marigold}`, backgroundImage: `${pat},${pat}`, backgroundSize: "100% 5px, 100% 5px", backgroundPosition: "top, bottom", backgroundRepeat: "no-repeat" }} />
              <div className="absolute" style={{ left: 6 }}><Reel size={20} spin color={C.marigold} /></div>
              <div className="absolute" style={{ right: 6 }}><Reel size={20} spin color={C.marigold} /></div>
              <div className="relative flex items-center justify-center rounded-full" style={{ width: 44, height: 44, background: C.pink, border: `3px solid ${C.marigold}`, boxShadow: `2px 3px 0 ${C.purple}`, fontFamily: DISPLAY, color: C.cream, fontSize: 20 }}>{count}</div>
            </div>
            <div className="mt-1 font-bold" style={{ color: C.marigold, fontSize: 11 }}>{count === 1 ? "movie used" : "movies used"}</div>
          </div>
          <div className="flex flex-col items-center" style={{ width: 76 }}>
            <Portrait item={game.b} size={50} ring={C.pink} ring2={C.marigold} />
            <div className="mt-2 text-center font-bold" style={{ color: C.cream, fontSize: 11, lineHeight: 1.1 }}>{game.b.name}</div>
          </div>
        </div>
        <div style={sprH} />
      </div>
      <Scallop color={C.film} flip />
    </div>
  );
}

function ChainCard({ node, index, meId, showBy }) {
  const isMovie = node.type === "movie";
  const mine = !!(node.by && node.by.id === meId);
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ background: C.cream, border: `3px solid ${C.purple}`, boxShadow: `inset 0 0 0 2px ${C.cream}, inset 0 0 0 4px ${C.teal}`, animation: index > 0 ? "lock 1.1s ease-out" : "rise .5s ease-out" }}>
      {isMovie ? <Poster item={node} w={54} /> : <Portrait item={node} size={60} />}
      <div className="min-w-0 flex-1">
        <div style={{ fontFamily: DISPLAY, fontSize: 15, lineHeight: 1.15, color: C.purple }}>{isMovie ? node.title : node.name}</div>
        {isMovie && <div className="font-bold" style={{ color: C.teal, fontSize: 14 }}>{node.year}</div>}
        {index === 0 && <span className="inline-block mt-1 rounded-full px-2 font-bold" style={{ background: C.pink, color: C.cream, fontSize: 11 }}>Starts here</span>}
        {showBy && node.by && index > 0 && (
          <span className="inline-block mt-1 rounded-full px-2 font-bold" style={{ background: mine ? C.teal : C.marigold, color: mine ? C.cream : C.ink, fontSize: 11 }}>{mine ? "You" : node.by.name} added {isMovie ? "movie" : "actor"}</span>
        )}
      </div>
      {isMovie ? <Film size={20} color={C.teal} /> : <Clapperboard size={20} color={C.pink} />}
    </div>
  );
}
function FilmChain({ chain, meId, showBy }) {
  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: C.film, border: `3px solid ${C.purple}`, boxShadow: `4px 5px 0 ${C.purple}` }}>
      <div className="absolute inset-y-0 left-0" style={{ width: 16, ...sprV }} />
      <div className="absolute inset-y-0 right-0" style={{ width: 16, ...sprV }} />
      <div className="relative" style={{ padding: "12px 24px" }}>
        {chain.map((n, i) => (
          <React.Fragment key={n.type + n.id}>
            {i > 0 && <div className="flex justify-center py-1"><Reel size={22} spin color={C.marigold} /></div>}
            <ChainCard node={n} index={i} meId={meId} showBy={showBy} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function StepInput({ type, prev, api, hints, cameos, used, onPick, onFail }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [fx, setFx] = useState(null);
  const seq = useRef(0);
  const label = (x) => (type === "movie" ? x.title : x.name);

  useEffect(() => {
    if (!hints) { setPool(null); return undefined; }
    let live = true; setPool(null);
    (async () => {
      try {
        const list = type === "movie" ? await api.moviesOf(prev.id, cameos) : await api.castOf(prev.id, cameos);
        if (live) setPool(list.filter((x) => !used.has(x.id)));
      } catch (e) { if (live) onFail(); }
    })();
    return () => { live = false; };
  }, [hints, type, prev.id, cameos, api]);

  useEffect(() => {
    if (hints) return undefined;
    if (q.trim().length < 3) { setItems([]); setLoading(false); return undefined; }
    const my = ++seq.current; setLoading(true);
    const t = setTimeout(async () => {
      try {
        const r = type === "movie" ? await api.searchMovies(q, cameos) : await api.searchActors(q, cameos);
        if (my === seq.current) { setItems(r); setLoading(false); }
      } catch (e) { if (my === seq.current) { setLoading(false); onFail(); } }
    }, 250);
    return () => clearTimeout(t);
  }, [q, hints, type, api, cameos]);

  const list = hints ? (pool || []).filter((x) => !q || norm(label(x)).includes(norm(q))) : items;
  const listVisible = hints ? open || q.length > 0 : q.trim().length >= 3;
  const waiting = hints ? pool === null : loading;

  const pick = async (item) => {
    if (busy) return;
    setBusy(true); setOpen(false); setQ(label(item));
    const res = await onPick(item);
    if (!res.ok) { setBusy(false); setQ(""); setFx({ kind: "bad", msg: res.msg, n: Date.now() }); return; }
    setFx({ kind: "good", n: Date.now() });
    setTimeout(res.commit, 520);
  };

  let anim;
  if (fx && fx.kind === "bad") { const p = fx.n % 2; anim = `${p ? "shakeA" : "shakeB"} .5s, ${p ? "badA" : "badB"} 1.3s`; }
  if (fx && fx.kind === "good") anim = "goodflash .45s forwards";

  return (
    <PopCard className="overflow-hidden" style={fx && fx.kind === "good" ? { background: C.emerald, animation: anim } : fx && fx.kind === "bad" ? { animation: anim } : undefined}>
      <Scallop color={C.pink} size={16} />
      <div className="px-3 pt-2 pb-3">
        <div style={{ fontFamily: DISPLAY, fontSize: 14, color: C.purple }}>
          {type === "movie" ? `Name a movie ${prev.name} acted in` : `Who else starred in ${prev.title}?`}
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-xl px-3" style={{ background: "#fff", border: `3px solid ${C.teal}`, height: 52 }}>
          <Search size={20} color={C.teal} />
          <input
            value={q} disabled={busy} onChange={(e) => { setQ(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)} onClick={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 220)}
            onKeyDown={(e) => { if (e.key === "Enter" && list[0]) pick(list[0]); }}
            placeholder={type === "movie" ? "Type a movie title…" : "Type an actor’s name…"}
            autoComplete="off" autoCorrect="off" spellCheck={false} enterKeyHint="go"
            className="flex-1 min-w-0 bg-transparent outline-none font-bold" style={{ fontSize: 16, color: C.ink }}
          />
          {waiting && <Reel size={22} spin color={C.marigold} />}
        </div>
        {fx && fx.kind === "bad" && <div className="mt-2 font-bold" style={{ color: fx.n % 2 ? C.crimson : C.crimson, fontSize: 14, lineHeight: 1.25 }} role="alert">{fx.msg}</div>}
        {!hints && q.trim().length > 0 && q.trim().length < 3 && <div className="mt-2" style={{ fontSize: 13, color: C.teal }}>Keep typing, 3 letters and the spelling helper opens.</div>}
        {listVisible && (
          <div className="mt-2 rounded-xl overflow-y-auto" style={{ maxHeight: 330, background: C.cream, border: `2px solid ${C.purple}` }}>
            {list.map((x) => <Row key={x.id} item={x} type={type} onClick={() => pick(x)} />)}
            {!waiting && list.length === 0 && (
              <div className="px-3 py-3" style={{ fontSize: 14, color: C.ink }}>
                {hints ? "No valid options match that spelling." : `Nothing in the reel matches “${q}”. ${api.kind === "local" ? "The built-in reel doesn’t have that one yet." : ""}`}
              </div>
            )}
          </div>
        )}
      </div>
    </PopCard>
  );
}

function FilmStripRow({ nodes }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: C.film, border: `2px solid ${C.purple}` }}>
      <div style={sprH} />
      <div className="flex items-stretch gap-1 overflow-x-auto px-2 py-2">
        {nodes.map((n, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div className="flex items-center shrink-0"><Reel size={16} spin color={C.marigold} /></div>}
            <div className="shrink-0 text-center" style={{ width: 88 }}>
              <div className="flex justify-center">{n.type === "movie" ? <Poster item={n} w={54} /> : <Portrait item={n} size={54} />}</div>
              <div className="mt-1 font-bold" style={{ color: C.cream, fontSize: 11, lineHeight: 1.1 }}>{n.type === "movie" ? n.title : n.name}</div>
              {n.type === "movie" && <div style={{ color: C.marigold, fontSize: 10, fontWeight: 700 }}>{n.year}</div>}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div style={sprH} />
    </div>
  );
}

function WinModal({ game, optimal, onShare, onAgain, onMenu, onClose, board, meId, onNext, roomUI }) {
  const [view, setView] = useState("you");
  const movies = game.chain.filter((n) => n.type === "movie").length;
  const pieces = useMemo(() => Array.from({ length: 18 }, (_, i) => ({ left: (i * 37) % 100, delay: (i % 6) * 0.35, dur: 3 + (i % 4), ch: ["🎬", "🎞️", "✨", "🌼", "🟧", "🟪"][i % 6] })), []);
  let verdict = "";
  if (optimal && optimal.movies) {
    if (movies === optimal.movies) verdict = "You matched the shortest possible link. Pure filmy genius!";
    else if (movies < optimal.movies) verdict = "You beat the solver! Your link is shorter than its own.";
    else verdict = `The shortest link needs ${optimal.movies}. You used ${movies - optimal.movies} extra. Rematch?`;
  }
  const nodes = view === "you" ? game.chain : optimal && optimal.nodes;
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center px-3" style={{ background: "rgba(42,14,44,.72)" }}>
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        {pieces.map((p, i) => <span key={i} className="absolute" style={{ left: `${p.left}%`, top: 0, fontSize: 22, animation: `fall ${p.dur}s linear ${p.delay}s infinite` }}>{p.ch}</span>)}
      </div>
      <PopCard className="relative w-full overflow-y-auto" style={{ maxHeight: "92%", maxWidth: 560, animation: "rise .5s ease-out" }}>
        <Scallop color={C.pink} size={18} />
        <div className="px-4 pt-3 pb-4">
          <button onClick={onClose} aria-label="Close results" className="absolute rounded-full flex items-center justify-center" style={{ top: 16, right: 14, width: 34, height: 34, background: C.cream, border: `2px solid ${C.purple}` }}><X size={18} color={C.purple} /></button>
          <div className="text-center" style={{ ...markStyle(5), fontSize: 30 }}>BLOCKBUSTER HIT!</div>
          <div className="mt-3 text-center" style={{ fontFamily: DISPLAY, fontSize: 16, color: C.purple, lineHeight: 1.2 }}>
            Paisa Vasool! Sneaky Link Found in {movies} Movie{movies === 1 ? "" : "s"}!
          </div>
          <div className="mt-3 rounded-xl px-3 py-2 flex items-center gap-3" style={{ background: C.teal, color: C.cream, border: `2px solid ${C.purple}` }}>
            <Trophy size={26} color={C.marigold} />
            <div style={{ fontSize: 14, lineHeight: 1.25 }}>
              {optimal && optimal.movies ? (<><b>Shortest possible link: {optimal.movies} movie{optimal.movies === 1 ? "" : "s"}</b> <span style={{ opacity: 0.9 }}>{verdict}</span></>)
                : optimal && optimal.unavailable ? "The shortest-link solver only knows the built-in reel, so it can’t score this pair."
                : optimal && optimal.none ? "No link exists between these two with the current cameo rules. Try turning cameos on."
                : "Working out the shortest link…"}
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {[["you", "Your link"], ["best", "Shortest link"]].map(([k, l]) => (
              <button key={k} onClick={() => setView(k)} disabled={k === "best" && !(optimal && optimal.nodes)} className="flex-1 rounded-xl py-2" style={{ ...btn(view === k ? C.pink : C.cream, view === k ? C.cream : C.purple), fontSize: 13, opacity: k === "best" && !(optimal && optimal.nodes) ? 0.45 : 1 }}>{l}</button>
            ))}
          </div>
          <div className="mt-3">{nodes ? <FilmStripRow nodes={nodes} /> : <div className="text-center py-4" style={{ fontSize: 14 }}>No shortest link to show.</div>}</div>
          {board && <div className="mt-4"><Scoreboard board={board} meId={meId} /></div>}
          <button onClick={onShare} className="mt-4 w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ ...btn(C.pink), fontSize: 15 }}><Share2 size={18} /> Share Sneaky Link</button>
          {roomUI ? <RoomButtons roomUI={roomUI} /> : (
            <>
              {onNext && <button onClick={onNext} className="mt-3 w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ ...btn(C.teal), fontSize: 15 }}>Next Challenge ➔</button>}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button onClick={onAgain} className="rounded-xl py-2" style={{ ...btn(C.teal), fontSize: 13 }}>Play again</button>
                <button onClick={onMenu} className="rounded-xl py-2" style={{ ...btn(C.cream, C.purple), fontSize: 13 }}>More challenges</button>
              </div>
            </>
          )}
        </div>
      </PopCard>
    </div>
  );
}

/* ───────────────────────── 6. MAIN APP ───────────────────────── */

export default function App() {
  const [tab, setTab] = useState("daily");
  const [layout, setLayout] = useState(calcLayout);
  useEffect(() => {
    const f = () => setLayout((o) => { const n = calcLayout(); return o.s === n.s && o.mid === n.mid && o.wide === n.wide ? o : n; });
    window.addEventListener("resize", f); window.addEventListener("orientationchange", f);
    return () => { window.removeEventListener("resize", f); window.removeEventListener("orientationchange", f); };
  }, []);
  const cameos = true; // cameos are always on
  const [hints, setHintsS] = useState(() => store.get("fsl:hints") === "1");
  const apiKey = TMDB_KEY;
  const [tmdbState, setTmdbState] = useState("idle");
  const [game, setGame] = useState(null);
  const [winOpen, setWinOpen] = useState(false);
  const [optimal, setOptimal] = useState(null);
  const [toast, setToast] = useState(null);
  const [launching, setLaunching] = useState(false);
  const [pickA, setPickA] = useState(null);
  const [pickB, setPickB] = useState(null);
  const [aText, setAText] = useState("");
  const [bText, setBText] = useState("");
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [slot, setSlot] = useState("a");
  const [cq, setCq] = useState("");
  const [cres, setCres] = useState([]);
  const [pairingHidden, setPairingHidden] = useState(0);
  const endRef = useRef(null);
  const firstKind = useRef(true);
  const toastT = useRef(null);
  const [rname, setRname] = useState(() => store.get("fsl:name") || "");
  const [joinCode, setJoinCode] = useState("");
  const [room, setRoom] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [roomBusy, setRoomBusy] = useState(false);
  const pid = useRef(null);
  if (!pid.current) pid.current = Math.random().toString(36).slice(2, 8);
  const seenRound = useRef(0);
  const myRec = useRef(null);
  const [roomMode, setRoomMode] = useState("coop");
  const [results, setResults] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [answerHidden, setAnswerHidden] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [wins, setWins] = useState({});
  const gameRef = useRef(null);
  const coopVer = useRef(0);
  const coopSig = useRef("");
  const shownRound = useRef(0);
  const endedSeen = useRef(0);
  const joinedRound = useRef(0);
  const startingRef = useRef(0);
  const doneSeen = useRef(new Set());
  const ruleStamp = useRef(0);
  const cameosRef = useRef(false);
  const hintsRef = useRef(false);

  const setCameos = () => {};
  const setHints = (v) => { setHintsS(v); store.set("fsl:hints", v ? "1" : "0"); };
  const notify = (msg) => { setToast(msg); clearTimeout(toastT.current); toastT.current = setTimeout(() => setToast(null), 3200); };

  const api = useMemo(() => (apiKey && tmdbState !== "fail" ? getTmdb(apiKey) : localApi), [apiKey, tmdbState]);
  const failApi = () => { setTmdbState("fail"); notify("TMDB isn’t responding. Switched to the built-in reel."); };

  useEffect(() => {
    if (firstKind.current) { firstKind.current = false; return; }
    if (game) { setGame(null); notify("Data source changed. Pick your challenge again."); }
  }, [api.kind]);

  const won = !!(game && game.won);
  useEffect(() => { setWinOpen(won); }, [won]);
  useEffect(() => {
    if (!game || !game.won) { setOptimal(null); return; }
    const la = toLocalId(game.a), lb = toLocalId(game.b);
    if (!la || !lb) { setOptimal({ unavailable: true }); return; }
    const sol = solveLocal(la, lb, cameos);
    if (!sol) { setOptimal({ none: true }); return; }
    setOptimal({ movies: sol.films, nodes: sol.ids.map((id, i) => (i % 2 === 0 ? { type: "actor", ...localActor(id) } : { type: "movie", ...localMovie(id) })) });
  }, [won]);

  const chainLen = game ? game.chain.length : 0;
  useEffect(() => { if (endRef.current && tab === "play") endRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [chainLen, tab]);

  const resolveFor = async (x) => (x.src === api.kind ? x : api.resolveActor(x));
  const launch = async (aObj, bObj, rules, roomInfo, daily) => {
    setLaunching(true);
    try {
      const a = await resolveFor(aObj), b = await resolveFor(bObj);
      if (!a || !b) { notify("That star isn’t in the built-in reel."); return; }
      if (a.id === b.id) { notify("Pick two different stars!"); return; }
      if (rules) { setCameos(rules.cameos); setHints(rules.hints); }
      const init = roomInfo && roomInfo.init;
      setGame({
        a, b, chain: init ? init.chain : [{ type: "actor", ...a }], won: init ? init.won : false,
        room: roomInfo ? { code: roomInfo.code, round: roomInfo.round, mode: roomInfo.mode || "race" } : null,
        daily: daily || null,
      });
      setTab("play");
    } catch (e) { failApi(); } finally { setLaunching(false); }
  };
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search); const a = p.get("a"), b = p.get("b");
      if (a && b) { const A = decodeRef(a), B = decodeRef(b); if (A && B) {
        const rules = { cameos: p.get("c") === "1", hints: p.get("h") === "1" };
        const rcode = (p.get("room") || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
        if (rcode.length === 4) autoRoom(rcode, A, B, rules, store.get("fsl:name") || "Friend"); else launch(A, B, rules);
      } }
      const rc = p.get("room");
      if (rc && !(a && b)) { setJoinCode(rc.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4)); setTab("rooms"); }
    } catch (e) { /* no params */ }
  }, []);

  const attempt = async (item) => {
    const last = game.chain[game.chain.length - 1];
    const isMovie = game.chain.length % 2 === 1;
    if (game.chain.some((n) => n.id === item.id && n.type === (isMovie ? "movie" : "actor"))) {
      return { ok: false, msg: `Already in your chain! Pick a different ${isMovie ? "movie" : "co-star"}, boss.` };
    }
    let r;
    try { r = isMovie ? await api.credit(last.id, item.id, cameos) : await api.credit(item.id, last.id, cameos); } catch (e) { failApi(); return { ok: false, msg: "Couldn’t check that one. Try again!" }; }
    const aName = isMovie ? last.name : item.name, mName = isMovie ? item.title : last.title;
    if (r === "cameo" && !cameos) return { ok: false, msg: `Aha! ${aName} only had a cameo in “${mName}”. Flip the Cameos switch at the top to count it.` };
    if (r === "no") return { ok: false, msg: OOPS[hash(aName + mName) % OOPS.length](aName, mName) };
    const coop = !!(game.room && game.room.mode === "coop");
    const myName = (myRec.current && myRec.current.name) || rname.trim() || "Player";
    const node = { type: isMovie ? "movie" : "actor", ...item, ...(coop ? { by: { id: pid.current, name: myName } } : {}) };
    const done = !isMovie && item.id === game.b.id;
    return {
      ok: true,
      commit: async () => {
        if (!coop) { setGame((g) => (g ? { ...g, chain: [...g.chain, node], won: done } : g)); return; }
        // Co-op: if your partner added a step a moment ago, take theirs and ask for the next pick.
        const code = game.room.code;
        const cur = await kv.get("rc:" + code);
        if (cur && cur.round === game.room.round && cur.ver > coopVer.current) {
          const ch = cur.chain.map(unpackNode);
          coopVer.current = cur.ver; coopSig.current = sigOf(ch, cur.won);
          setGame((g) => (g ? { ...g, chain: ch, won: !!cur.won } : g));
          notify("Your partner just added a step. Pick the next one!");
          return;
        }
        const chain = [...game.chain, node];
        const ver = coopVer.current + 1; coopVer.current = ver; coopSig.current = sigOf(chain, done);
        setGame((g) => (g ? { ...g, chain, won: done } : g));
        await kv.set("rc:" + code, { round: game.room.round, ver, chain: chain.map(packNode), won: done, by: pid.current });
      },
    };
  };
  const coopPush = async (chain, won) => {
    if (!(game && game.room && game.room.mode === "coop")) return;
    const ver = coopVer.current + 1; coopVer.current = ver; coopSig.current = sigOf(chain, won);
    await kv.set("rc:" + game.room.code, { round: game.room.round, ver, chain: chain.map(packNode), won: !!won, by: pid.current });
  };
  const undo = () => {
    if (!game || game.chain.length < 2) return;
    const chain = game.chain.slice(0, -1);
    setGame((g) => (g ? { ...g, chain, won: false } : g)); coopPush(chain, false);
  };
  const reset = () => {
    if (!game) return;
    const chain = [game.chain[0]];
    setGame((g) => (g ? { ...g, chain, won: false } : g)); coopPush(chain, false);
  };

  const shareResult = async () => {
    const movies = game.chain.filter((n) => n.type === "movie").length;
    const line = game.chain.map((n) => (n.type === "movie" ? `🎬 ${n.title}` : `🎭 ${n.name}`)).join(" ➜ ");
    const text = `🎞️ Filmy Sneaky Link 🎬\n${game.a.name} ➜ ${game.b.name}\nLinked in ${movies} movie${movies === 1 ? "" : "s"}${optimal && optimal.movies ? ` (shortest: ${optimal.movies})` : ""}!\n\n${line}\n\nCan you beat it? ${challengeUrl(game.a, game.b, cameos, hints)}`;
    notify((await copyText(text)) ? "Copied! Paste it into your chat 🎬" : "Couldn’t copy. Select and copy manually.");
  };
    // ── Multiplayer rooms
  cameosRef.current = cameos; hintsRef.current = hints;
  const writeMe = async (patch, code) => {
    const c = code || (room && room.code);
    if (!c) return;
    myRec.current = { ...(myRec.current || { id: pid.current, name: rname.trim() || "Player", round: 0, inGame: false, nextVote: 0, movies: 0, done: false, doneAt: 0 }), ...patch, ping: Date.now() };
    const rec = myRec.current;
    await kv.set(`rp:${c}:${pid.current}`, rec);
    setRoomData((d) => (d ? { ...d, players: [...d.players.filter((p) => p.id !== rec.id), rec] } : d));
  };
  const fetchRoom = async (code) => {
    const rows = await kv.dump(code);
    if (rows) {
      const by = {};
      rows.forEach((r) => { by[r.key] = r.value; });
      if (!by["room:" + code]) return null;
      return { meta: by["room:" + code], players: rows.filter((r) => r.key.startsWith(`rp:${code}:`)).map((r) => r.value), coop: by["rc:" + code] || null };
    }
    const meta = await kv.get("room:" + code);
    if (!meta) return null;
    const keys = await kv.list(`rp:${code}:`);
    const players = (await Promise.all(keys.map((k) => kv.get(k)))).filter(Boolean);
    const coop = await kv.get("rc:" + code);
    return { meta, players, coop };
  };
  const makeCode = async () => {
    const pool = [...ROOM_CODES].sort(() => Math.random() - 0.5).slice(0, 5);
    for (const c of pool) { if (!(await kv.get("room:" + c))) return c; }
    for (let i = 0; i < 8; i++) {
      const c = Array.from({ length: 4 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");
      if (!(await kv.get("room:" + c))) return c;
    }
    return null;
  };
  const resetRoomUi = () => { setResults(null); setWins({}); shownRound.current = 0; joinedRound.current = 0; startingRef.current = 0; doneSeen.current = new Set(); setShowPicker(false); };
  const createRoom = async () => {
    const name = rname.trim();
    if (!name) { notify("Add your name first."); return; }
    setRoomBusy(true);
    try {
      const code = await makeCode();
      if (!code) { notify("Couldn’t make a room. Try again."); return; }
      const meta = { code, host: pid.current, hostName: name, round: 0, created: Date.now() };
      if (!(await kv.set("room:" + code, meta))) { notify("Couldn’t save the room. Try again."); return; }
      store.set("fsl:name", name); myRec.current = null; seenRound.current = 0; resetRoomUi();
      setRoom({ code }); setRoomData({ meta, players: [], coop: null });
      await writeMe({ name, joined: Date.now() }, code);
      notify(`Room ${code} is live! Share the code.`);
    } finally { setRoomBusy(false); }
  };
  const joinRoom = async () => {
    const name = rname.trim(); const code = joinCode.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!name) { notify("Add your name first."); return; }
    if (code.length !== 4) { notify("Room codes have 4 characters."); return; }
    setRoomBusy(true);
    try {
      const d = await fetchRoom(code);
      if (!d) { notify(`No room “${code}” found.${kv.shared() ? "" : " Without Supabase set up, only rooms made on this device are visible."}`); return; }
      store.set("fsl:name", name); myRec.current = null; seenRound.current = d.meta.round || 0; resetRoomUi();
      setRoom({ code }); setRoomData(d);
      await writeMe({ name, joined: Date.now() }, code);
      notify(`Welcome to room ${code}!`);
    } finally { setRoomBusy(false); }
  };
  const leaveRoom = async () => {
    if (!room) return;
    await kv.del(`rp:${room.code}:${pid.current}`);
    setGame((g) => (g && g.room ? { ...g, room: null } : g));
    setRoom(null); setRoomData(null); myRec.current = null; resetRoomUi();
  };
  // Starts a new game for the whole room. Only one game can be live at a time.
  const startRound = async (kind, aIn, bIn, modeIn, opts = {}) => {
    if (!room) return false;
    const mode = modeIn || roomMode;
    const cur = await fetchRoom(room.code);
    const base = (cur && cur.meta) || (roomData && roomData.meta) || { code: room.code };
    if (opts.expectRound !== undefined && (base.round || 0) !== opts.expectRound) return false;
    if (!opts.force && cur && (base.round || 0) > 0 && !gameIsDone(base, cur.players, cur.coop)) {
      notify("A game is already running. Finish it or skip it first.");
      return false;
    }
    let aObj, bObj;
    try { aObj = await resolveFor(aIn); bObj = await resolveFor(bIn); } catch (e) { failApi(); return false; }
    if (!aObj || !bObj) { notify("That star isn’t in the built-in reel."); return false; }
    const ref = (x) => ({ id: x.id, name: x.name, src: x.src });
    const meta = { ...base, round: (base.round || 0) + 1, kind, mode, pending: null, a: ref(aObj), b: ref(bObj), cameos, hints, startedBy: (myRec.current && myRec.current.name) || rname.trim() || "Someone", startedById: pid.current, startedAt: Date.now() };
    const startNode = { type: "actor", ...aObj };
    const coopDoc = mode === "coop" ? { round: meta.round, ver: 1, chain: [packNode(startNode)], won: false, by: pid.current } : null;
    if (coopDoc) { coopVer.current = 1; coopSig.current = sigOf([startNode], false); await kv.set("rc:" + room.code, coopDoc); }
    await kv.set("room:" + room.code, meta);
    seenRound.current = meta.round; joinedRound.current = meta.round;
    setRoomData((d) => (d ? { ...d, meta, coop: coopDoc || d.coop } : d));
    setShowPicker(false); setResults(null);
    await launch(aObj, bObj, { cameos, hints }, { code: room.code, round: meta.round, mode });
    await writeMe({ round: meta.round, inGame: true, nextVote: 0, skip: false, movies: 0, done: false, doneAt: 0, chain: null });
    return true;
  };
  const joinBoard = async (code, m) => {
    if (!m || !m.a) return;
    const info = { code, round: m.round, mode: m.mode || "race" };
    if (info.mode === "coop") {
      const c = await kv.get("rc:" + code);
      if (c && c.round === m.round) {
        const chain = c.chain.map(unpackNode);
        coopVer.current = c.ver; coopSig.current = sigOf(chain, c.won);
        info.init = { chain, won: !!c.won };
      }
    }
    await launch(roomActor(m.a), roomActor(m.b), { cameos: !!m.cameos, hints: !!m.hints }, info);
    await writeMe({ round: m.round, inGame: true, nextVote: 0, skip: false, movies: 0, done: false, doneAt: 0, chain: null }, code);
  };
  const joinRound = () => joinBoard(room.code, rmeta);
  // Used when someone opens a shared challenge link (?a=..&b=..&room=..):
  // joins the room if it exists, otherwise creates it as a Custom Co-op room for the given pair.
  const autoRoom = async (code, A, B, rules, name) => {
    setRoomBusy(true);
    try {
      store.set("fsl:name", name); setRname(name); myRec.current = null; resetRoomUi();
      const d = await fetchRoom(code);
      if (d && d.meta.round > 0 && d.meta.a && !((d.meta.endedRound || 0) >= d.meta.round)) {
        seenRound.current = d.meta.round; joinedRound.current = d.meta.round;
        setRoom({ code }); setRoomData(d);
        await writeMe({ name, joined: Date.now() }, code);
        await joinBoard(code, d.meta);
        notify(`Joined room ${code}. The shared board is ready!`);
        return true;
      }
      let aO, bO;
      try { aO = await resolveFor(A); bO = await resolveFor(B); } catch (e) { failApi(); return false; }
      if (!aO || !bO) { notify("That star isn’t in the built-in reel."); return false; }
      const ref = (x) => ({ id: x.id, name: x.name, src: x.src });
      const meta = {
        ...(d ? d.meta : { code, host: pid.current, hostName: name, created: Date.now() }),
        round: ((d && d.meta.round) || 0) + 1, kind: "custom", mode: "coop", pending: null, a: ref(aO), b: ref(bO),
        cameos: !!rules.cameos, hints: !!rules.hints, startedBy: name, startedById: pid.current, startedAt: Date.now(),
      };
      const startNode = { type: "actor", ...aO };
      const coopDoc = { round: meta.round, ver: 1, chain: [packNode(startNode)], won: false, by: pid.current };
      await kv.set("rc:" + code, coopDoc);
      await kv.set("room:" + code, meta);
      coopVer.current = 1; coopSig.current = sigOf([startNode], false);
      seenRound.current = meta.round; joinedRound.current = meta.round;
      setRoom({ code }); setRoomData({ meta, players: [], coop: coopDoc });
      await writeMe({ name, joined: Date.now() }, code);
      await launch(aO, bO, { cameos: !!rules.cameos, hints: !!rules.hints }, { code, round: meta.round, mode: "coop" });
      await writeMe({ round: meta.round, inGame: true, nextVote: 0, skip: false, movies: 0, done: false, doneAt: 0 }, code);
      return true;
    } finally { setRoomBusy(false); }
  };
  useEffect(() => {
    if (!room) return undefined;
    let live = true;
    const tick = async () => {
      const d = await fetchRoom(room.code);
      if (!live || !d) return;
      setRoomData(d);
      // Cameo / hint switches are shared by everyone in the room once a game exists.
      if (Date.now() - ruleStamp.current > 4000 && (d.meta.round || 0) > 0) {
        if (typeof d.meta.cameos === "boolean" && d.meta.cameos !== cameosRef.current) setCameos(d.meta.cameos);
        if (typeof d.meta.hints === "boolean" && d.meta.hints !== hintsRef.current) setHints(d.meta.hints);
      }
      // Somebody pressed End Game: everyone still on that game drops back to the lobby.
      const g0 = gameRef.current;
      if ((d.meta.endedRound || 0) > 0 && g0 && g0.room && g0.room.code === room.code && g0.room.round <= d.meta.endedRound && endedSeen.current !== d.meta.endedRound) {
        endedSeen.current = d.meta.endedRound;
        if (d.meta.endedById !== pid.current) notify(`${d.meta.endedBy || "Someone"} ended the game.`);
        setGame(null); setWinOpen(false); setResults(null); setTab((t) => (t === "play" ? "rooms" : t));
        writeMe({ inGame: false });
      }
      // Race: tell me when somebody else finishes.
      if (d.meta.mode === "race") {
        livePlayers(d.players).forEach((p) => {
          const k = p.id + ":" + p.round;
          if (p.id !== pid.current && p.round === d.meta.round && p.done && !doneSeen.current.has(k)) {
            doneSeen.current.add(k);
            notify(`${p.name} finished in ${p.movies} movie${p.movies === 1 ? "" : "s"}!`);
          }
        });
      }
      // Co-op: pull in the shared board and say who added what.
      const g = gameRef.current;
      if (d.meta.mode === "coop" && g && g.room && g.room.mode === "coop" && g.room.code === room.code && g.room.round === d.meta.round) {
        const c = d.coop;
        if (c && c.round === g.room.round && c.ver > coopVer.current) {
          const ch = c.chain.map(unpackNode);
          const before = g.chain.length;
          coopVer.current = c.ver; coopSig.current = sigOf(ch, c.won);
          const last = ch[ch.length - 1];
          if (ch.length > before && last && last.by && last.by.id !== pid.current) {
            notify(`${last.by.name} added ${last.type === "movie" ? "movie" : "actor"}: ${last.type === "movie" ? last.title : last.name}`);
          }
          setGame((cur) => (cur && cur.room && cur.room.round === c.round ? { ...cur, chain: ch, won: !!c.won } : cur));
        }
      }
      if ((d.meta.round || 0) > seenRound.current) {
        seenRound.current = d.meta.round;
        const voted = myRec.current && myRec.current.nextVote > 0;
        if (d.meta.startedById !== pid.current && !voted) notify(`${d.meta.startedBy} started a ${d.meta.mode === "coop" ? "co-op" : "race"} game! Open Rooms to join.`);
      }
    };
    tick();
    let channel = null; let kickT = null;
    if (sb) {
      const kick = () => { clearTimeout(kickT); kickT = setTimeout(tick, 60); };
      channel = sb.channel("fsl-" + room.code)
        .on("postgres_changes", { event: "*", schema: "public", table: TABLE, filter: `room=eq.${room.code}` }, kick)
        .subscribe();
    }
    const poll = setInterval(tick, sb ? 8000 : 2000); // with Supabase, polling is only a safety net
    const beat = setInterval(() => writeMe({}), 12000);
    return () => { live = false; clearInterval(poll); clearInterval(beat); clearTimeout(kickT); if (channel) sb.removeChannel(channel); };
  }, [room && room.code]);

  const gameRound = game && game.room ? game.room.round : 0;
  useEffect(() => {
    if (!game || !game.room || game.room.mode !== "race" || !room || game.room.code !== room.code) return;
    const mv = game.chain.filter((n) => n.type === "movie").length;
    writeMe({ round: game.room.round, movies: mv, done: !!game.won, doneAt: game.won ? Date.now() : 0, chain: game.won ? game.chain.map(packNode) : null });
  }, [gameRound, chainLen, won]);

  // ── What the room looks like right now
  const coopMode = !!(game && game.room && game.room.mode === "coop");
  const rmeta = roomData ? roomData.meta : null;
  const round = rmeta ? rmeta.round || 0 : 0;
  const liveList = useMemo(() => (roomData ? livePlayers(roomData.players) : []), [roomData]);
  const board = useMemo(() => {
    if (!roomData) return null;
    const live = livePlayers(roomData.players);
    const r = roomData.meta.round || 0;
    const racers = live.filter((p) => r > 0 && p.round === r);
    return {
      r, count: live.length,
      fin: racers.filter((p) => p.done).sort((a, b) => a.doneAt - b.doneAt),
      run: racers.filter((p) => !p.done).sort((a, b) => b.movies - a.movies),
      idle: live.filter((p) => !(r > 0 && p.round === r)),
    };
  }, [roomData]);
  const inMatch = !!(game && game.room && room && rmeta && game.room.code === room.code && game.room.round === round);
  const gameDone = !!(roomData && round > 0 && gameIsDone(roomData.meta, roomData.players, roomData.coop));
  const activeGame = round > 0 && !gameDone;
  const endedNow = !!(rmeta && round > 0 && (rmeta.endedRound || 0) >= round);
  // Custom co-op: after a game ends or is skipped, one player at a time gives the next pairing.
  const pending = rmeta && rmeta.pending && round > 0 && rmeta.pending.forRound === round ? rmeta.pending : null;
  const pendingMine = !!(pending && pending.pickerId === pid.current);
  const showPairing = !!(pending && pairingHidden !== round);
  const meRec = liveList.find((p) => p.id === pid.current) || myRec.current;
  const iVoted = !!(meRec && round > 0 && meRec.nextVote === round);
  const voteCount = liveList.filter((p) => p.nextVote === round).length;
  const readyText = (() => {
    if (!iVoted) return "";
    const waiting = liveList.filter((p) => p.nextVote !== round);
    if (!waiting.length) return pending ? "Everyone is ready. Waiting for the next pairing…" : "Everyone is ready. Starting the next game…";
    const inLobby = waiting.filter((p) => !p.inGame);
    if (inLobby.length === waiting.length) return `${waiting.length === 1 ? "Partner is" : "Other players are"} in the lobby ${voteCount}/${liveList.length}`;
    return `Waiting for ${waiting.length === 1 ? "partner" : `${waiting.length} other players`}… ${voteCount}/${liveList.length}`;
  })();
  // Reveal Link: everyone in the room has to tap it before the shortest link is shown to all.
  const iRevealed = !!(meRec && round > 0 && meRec.revealVote === round);
  const revealCount = liveList.filter((p) => p.revealVote === round).length;
  const revealedNow = round > 0 && liveList.length > 0 && revealCount === liveList.length;
  const revealText = (() => {
    if (!iRevealed || revealedNow) return "";
    const waiting = liveList.filter((p) => p.revealVote !== round);
    if (waiting.every((p) => !p.inGame)) return `${waiting.length === 1 ? "Partner is" : "Other players are"} in the lobby ${revealCount}/${liveList.length}`;
    return `Waiting for ${waiting.length === 1 ? "partner" : `${waiting.length} other players`}… ${revealCount}/${liveList.length}`;
  })();
  // The answer screen: solo daily games open it from "Reveal Link"; rooms open it once everyone has tapped it.
  const answerOn = !!(game && ((!game.room && game.revealed) || (game.room && game.room.round === round && revealedNow)));
  useEffect(() => {
    if (!answerOn) { setAnswer(null); return; }
    const la = toLocalId(game.a), lb = toLocalId(game.b);
    if (!la || !lb) { setAnswer({ unavailable: true }); return; }
    const sol = solveLocal(la, lb, cameos);
    if (!sol) { setAnswer({ none: true }); return; }
    setAnswer({ movies: sol.films, nodes: sol.ids.map((id, i) => (i % 2 === 0 ? { type: "actor", ...localActor(id) } : { type: "movie", ...localMovie(id) })) });
  }, [answerOn, game && game.a.id, game && game.b.id]);
  const showAnswer = answerOn && !(game.room && answerHidden === round);
  const raceRows = board ? [...board.fin].sort((a, b) => a.movies - b.movies || a.doneAt - b.doneAt) : [];
  const coopMovies = roomData && roomData.coop && roomData.coop.round === round ? roomData.coop.chain.filter((n) => n.type === "movie").length : 0;
  const doneSummary = !gameDone || !rmeta ? "" : endedNow ? `${rmeta.endedBy || "Someone"} ended this game.` : revealedNow ? "The shortest link was revealed." : rmeta.mode === "coop"
    ? `Linked together in ${coopMovies} movie${coopMovies === 1 ? "" : "s"}.`
    : raceRows.length ? `${raceRows[0].name} won with ${raceRows[0].movies} movie${raceRows[0].movies === 1 ? "" : "s"}.` : "";
  const statusOf = (p) => {
    if (round > 0 && p.nextVote === round) return "Ready for the next game";
    if (round > 0 && rmeta && rmeta.mode === "race" && p.round === round && p.done) return `Finished in ${p.movies} movie${p.movies === 1 ? "" : "s"}`;
    if (round > 0 && p.round === round && p.inGame) return "In the game";
    return "In the lobby";
  };
  const statusLead = (p) => (round > 0 && p.nextVote === round ? "✅" : round > 0 && p.round === round && p.inGame ? "🎬" : "🍿");
  const partnerLines = (() => {
    if (!game || !game.room || !room) return [];
    const r = game.room.round;
    return liveList.filter((p) => p.id !== pid.current).map((p) => {
      if (game.room.mode === "coop") return `${p.name} ${p.inGame && p.round === r ? "is on the board" : "is in the lobby"}`;
      if (p.round === r && p.done) return `${p.name} finished in ${p.movies} movie${p.movies === 1 ? "" : "s"}!`;
      if (p.round === r && p.inGame) return `${p.name} is racing: ${p.movies} movie${p.movies === 1 ? "" : "s"} so far`;
      return `${p.name} is in the lobby`;
    });
  })();

  // ── Actions: ready-up, skip, lobby
  const voteNext = async () => { if (!room || !round) return; await writeMe({ nextVote: round }); };
  const revealLink = async () => {
    if (!room || !round) return;
    await writeMe({ revealVote: round });
    notify("Reveal requested. The link shows once everyone taps Reveal Link.");
  };
  const exitToLobby = async () => { setWinOpen(false); setResults(null); setAnswerHidden(round); setTab("rooms"); await writeMe({ inGame: false }); };
  const backToGame = async () => { setAnswerHidden(0); await writeMe({ inGame: true }); setTab("play"); };
  const setPicker = async (id) => {
    if (!room || !rmeta || !rmeta.pending) return;
    const nm = (liveList.find((p) => p.id === id) || {}).name || "Someone";
    const meta = { ...rmeta, pending: { ...rmeta.pending, pickerId: id, pickerName: nm } };
    setRoomData((d) => (d ? { ...d, meta } : d));
    await kv.set("room:" + room.code, meta);
  };
  const submitPairing = async () => {
    const pr = await resolvePair();
    if (!pr) return;
    const ok = await startRound("custom", pr[0], pr[1], "coop", { force: true, expectRound: round });
    if (ok) { setAText(""); setBText(""); setPickA(null); setPickB(null); }
  };
  // Ends the live game for everyone so a fresh one can start right away.
  const endGame = async () => {
    if (!room || !rmeta || !round) return;
    const who = (myRec.current && myRec.current.name) || rname.trim() || "Someone";
    const meta = { ...rmeta, endedRound: round, endedBy: who, endedById: pid.current };
    setConfirmEnd(false);
    endedSeen.current = round;
    setRoomData((d) => (d ? { ...d, meta } : d));
    setGame((g) => (g && g.room && g.room.round <= round ? null : g));
    setWinOpen(false); setResults(null);
    await kv.set("room:" + room.code, meta);
    await writeMe({ inGame: false, nextVote: 0, skip: false });
    notify("Game ended. Start a fresh one!");
  };
  const setRule = (key, val) => {
    (key === "cameos" ? setCameos : setHints)(val);
    ruleStamp.current = Date.now();
    if (room && roomData && roomData.meta) {
      const meta = { ...roomData.meta, [key]: val };
      setRoomData((d) => (d ? { ...d, meta } : d));
      kv.set("room:" + room.code, meta);
    }
  };

  gameRef.current = game;
  // When everybody is ready, the player with the lowest id starts the next game and the rest hop in.
  useEffect(() => {
    if (!room || !rmeta || !round || liveList.length === 0) return;
    if (!liveList.every((p) => p.nextVote === round)) return;
    const leader = [...liveList].sort((a, b) => (a.id < b.id ? -1 : 1))[0];
    if (leader.id !== pid.current || startingRef.current === round) return;
    startingRef.current = round;
    if (rmeta.mode === "coop" && rmeta.kind === "custom") {
      const ids = liveList.map((p) => p.id).sort();
      const nextId = ids[(ids.indexOf(rmeta.startedById) + 1) % ids.length];
      const nm = (liveList.find((p) => p.id === nextId) || {}).name || "Someone";
      const meta = { ...rmeta, pending: { forRound: round, pickerId: nextId, pickerName: nm } };
      setRoomData((d) => (d ? { ...d, meta } : d));
      kv.set("room:" + room.code, meta);
      return;
    }
    const idx = rmeta.a && rmeta.b ? ladder.findIndex((r) => r.a === rmeta.a.id && r.b === rmeta.b.id) : -1;
    const row = ladder[(idx + 1) % ladder.length];
    startRound("daily", localActor(row.a), localActor(row.b), rmeta.mode || "race", { force: true, expectRound: round });
  }, [roomData]);
  useEffect(() => {
    if (!room || !rmeta || !rmeta.a || !round) return;
    const me = myRec.current;
    if (!me || !me.nextVote || me.nextVote >= round || joinedRound.current >= round) return;
    joinedRound.current = round;
    joinBoard(room.code, rmeta);
  }, [rmeta && rmeta.round]);
  // If whoever should give the pairing has left, the room leader takes over.
  useEffect(() => {
    if (!pending || !room || liveList.some((p) => p.id === pending.pickerId)) return;
    const leader = [...liveList].sort((a, b) => (a.id < b.id ? -1 : 1))[0];
    if (leader && leader.id === pid.current) setPicker(pid.current);
  }, [roomData]);
  // Race scorecard once every racer has finished
  useEffect(() => {
    if (!board || !rmeta || rmeta.mode !== "race" || board.r === 0) return;
    if (board.fin.length === 0 || board.run.length > 0 || board.idle.length > 0) return;
    if (shownRound.current === board.r) return;
    if (!board.fin.some((p) => p.id === pid.current)) return;
    shownRound.current = board.r;
    const rows = [...board.fin].sort((a, b) => a.movies - b.movies || a.doneAt - b.doneAt);
    const tie = rows.length > 1 && rows[0].movies === rows[1].movies;
    setWins((w) => ({ ...w, [rows[0].id]: { name: rows[0].name, n: ((w[rows[0].id] || {}).n || 0) + 1 } }));
    setResults({ round: board.r, rows, tie });
    setWinOpen(false);
  }, [board]);
  useEffect(() => { if (results && round > results.round) setResults(null); }, [round]);
  useEffect(() => { setConfirmEnd(false); }, [round]);
  const nextDaily = () => {
    if (!game || !game.daily) return;
    const i = ladder.findIndex((r) => r.a === game.daily.a && r.b === game.daily.b);
    const row = ladder[(i + 1) % ladder.length];
    setWinOpen(false);
    launch(localActor(row.a), localActor(row.b), null, null, { a: row.a, b: row.b });
  };

  // Custom pair: players type actor names freely, with no suggestion lists. The closest name is
  // matched when they press Enter, leave the box, or start the game, and the portrait confirms it.
  const setText = (k, v) => {
    if (k === "a") { setAText(v); setPickA(null); } else { setBText(v); setPickB(null); }
  };
  const resolveField = async (k) => {
    const cur = k === "a" ? pickA : pickB;
    if (cur) return cur;
    const text = (k === "a" ? aText : bText).trim();
    if (text.length < 2) return null;
    try {
      const hit = (await api.searchActors(text))[0] || null;
      if (hit) { if (k === "a") { setPickA(hit); setAText(hit.name); } else { setPickB(hit); setBText(hit.name); } }
      return hit;
    } catch (e) { failApi(); return null; }
  };
  const resolvePair = async () => {
    const [A, B] = await Promise.all([resolveField("a"), resolveField("b")]);
    if (!A) { notify(aText.trim().length < 2 ? "Type the starting actor first." : `Couldn’t find “${aText.trim()}”. Check the spelling.`); return null; }
    if (!B) { notify(bText.trim().length < 2 ? "Type the target actor first." : `Couldn’t find “${bText.trim()}”. Check the spelling.`); return null; }
    if (A.id === B.id) { notify("Pick two different stars!"); return null; }
    return [A, B];
  };
  // Custom tab: tap a box, search for an actor, tap a suggestion to fill it.
  useEffect(() => {
    if (cq.trim().length < 2) { setCres([]); return undefined; }
    let live = true;
    const t = setTimeout(async () => { try { const r = await api.searchActors(cq); if (live) setCres(r); } catch (e) { if (live) failApi(); } }, 250);
    return () => { live = false; clearTimeout(t); };
  }, [cq, api]);
  const fillSlot = (a) => {
    if (slot === "a") { setPickA(a); setAText(a.name); if (!pickB) setSlot("b"); } else { setPickB(a); setBText(a.name); if (!pickA) setSlot("a"); }
    setCq(""); setCres([]);
  };
  const shuffle = () => {
    const i = Math.floor(Math.random() * STARS.length); let j = Math.floor(Math.random() * STARS.length); if (j === i) j = (j + 1) % STARS.length;
    setPickA(localActor(STARS[i])); setPickB(localActor(STARS[j])); setAText(ACTORS[STARS[i]].name); setBText(ACTORS[STARS[j]].name);
  };

  const ladder = useMemo(() => {
    const rows = LADDER.map(([a, b]) => { const s = solveLocal(a, b, cameos); const par = s ? s.films : null; return { a, b, par, diff: par !== null && par <= 2 ? "Easy" : par === 3 ? "Medium" : "Hard" }; });
    const rest = rows.slice(1).sort((x, y) => (x.par ?? 99) - (y.par ?? 99));
    return [rows[0], ...rest];
  }, [cameos]);
  const todays = ladder[Math.floor(Date.now() / 86400000) % ladder.length];
  const diffColor = { Easy: [C.teal, C.cream], Medium: [C.marigold, C.ink], Hard: [C.crimson, C.cream] };
  const used = useMemo(() => new Set(game ? game.chain.map((n) => n.id) : []), [game]);
  const movieCount = game ? game.chain.filter((n) => n.type === "movie").length : 0;

  const ChallengeRow = ({ row, i }) => {
    const A = localActor(row.a), B = localActor(row.b); const [bg, fg] = diffColor[row.diff];
    return (
      <button onClick={() => launch(A, B, null, null, { a: row.a, b: row.b })} disabled={launching} className="w-full text-left rounded-2xl flex items-center gap-2 px-3 py-2" style={{ background: C.cream, border: `3px solid ${C.purple}`, boxShadow: `3px 4px 0 ${C.purple}` }}>
        <div className="shrink-0 flex items-center justify-center rounded-full" style={{ width: 28, height: 28, background: C.pink, color: C.cream, fontFamily: DISPLAY, fontSize: 13 }}>{i + 1}</div>
        <Portrait item={A} size={38} /><Reel size={16} spin color={C.marigold} /><Portrait item={B} size={38} ring={C.pink} ring2={C.marigold} />
        <div className="min-w-0 flex-1 ml-1">
          <div className="truncate font-bold" style={{ fontSize: 13, color: C.ink, lineHeight: 1.15 }}>{A.name}</div>
          <div className="truncate font-bold" style={{ fontSize: 13, color: C.teal, lineHeight: 1.15 }}>{B.name}</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="rounded-full px-2 font-bold" style={{ background: bg, color: fg, fontSize: 11 }}>{row.diff}</div>
          <div className="mt-1 font-bold" style={{ fontSize: 12, color: C.purple }}>{row.par === null ? "No link" : `Par ${row.par}`}</div>
        </div>
      </button>
    );
  };

  const slotBox = (k) => {
    const val = k === "a" ? pickA : pickB;
    return (
      <button onClick={() => setSlot(k)} className="flex-1 rounded-2xl flex flex-col items-center py-3 px-2" style={{ background: C.cream, border: `3px solid ${slot === k ? C.pink : C.purple}`, boxShadow: slot === k ? `0 0 0 3px ${C.marigold}, 3px 4px 0 3px ${C.purple}` : `3px 4px 0 ${C.purple}` }}>
        {val
          ? <Portrait item={val} size={62} ring={k === "a" ? C.marigold : C.pink} ring2={k === "a" ? C.teal : C.marigold} />
          : <div className="flex items-center justify-center rounded-full" style={{ width: 62, height: 62, border: `3px dashed ${C.purple}` }}><Reel size={30} color={C.cream} fill={C.teal} /></div>}
        <div className="mt-2 font-bold text-center" style={{ fontSize: 13, color: C.ink, lineHeight: 1.15, minHeight: 30 }}>{val ? val.name : k === "a" ? "Pick the start" : "Pick the target"}</div>
      </button>
    );
  };
  const tabs = [["daily", "Daily", CalendarDays], ["custom", "Custom", Users], ["rooms", "Rooms", Ticket]];

  return (
    <div className="fsl" style={{ background: C.ink, width: "100%", height: "100dvh", overflow: "hidden", position: "relative" }}>
      <style>{CSS}</style>
      <div className={`relative overflow-hidden flex flex-col ${layout.wide ? "fsl-wide" : layout.mid ? "fsl-mid" : ""}`} style={{ width: `${100 / layout.s}%`, height: `${100 / layout.s}%`, transform: layout.s === 1 ? undefined : `scale(${layout.s})`, transformOrigin: "0 0", background: GRAD, fontFamily: BODY, color: C.ink }}>
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ backgroundImage: RAYS }} />

        {/* top nav */}
        <div className="relative z-30" style={{ paddingTop: "max(env(safe-area-inset-top), 10px)", paddingBottom: 8 }}>
          <div className="fsl-col flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Reel size={42} spin color={C.marigold} />
              <div>
                <div style={{ ...markStyle(6), fontSize: 27 }}>FILMY</div>
                <div style={{ ...markStyle(4), fontSize: 16, marginTop: 3 }}>SNEAKY LINK</div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
                <MiniToggle label="Hints" aria="Dropdown hints" on={hints} onChange={(v) => setRule("hints", v)} />
            </div>
          </div>
        </div>

        <main className="relative z-10 flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}>
          <div className="fsl-col">
          {tab !== "play" && game && (
            <div className="fsl-narrow px-3 pt-2">
              <button onClick={() => setTab("play")} className="w-full rounded-xl py-2 px-3 flex items-center justify-center gap-2" style={{ ...btn(C.purple), fontSize: 13 }}>
                <Clapperboard size={16} className="shrink-0" /> {game.won ? "See your finished link" : `Resume ${game.a.name} to ${game.b.name}`}
              </button>
            </div>
          )}

          {/* DAILY */}
          {tab === "daily" && (
            <div className="px-3 pb-6 pt-2">
              <PopCard tone={C.purple} ring={C.marigold} className="overflow-hidden" style={{ maxWidth: "34rem", marginLeft: "auto", marginRight: "auto", boxShadow: `inset 0 0 0 3px ${C.purple}, inset 0 0 0 5px ${C.marigold}, 4px 5px 0 ${C.film}` }}>
                <Scallop color={C.pink} size={18} />
                <div className="px-4 pt-2 pb-4 text-center">
                  <div style={{ fontFamily: DISPLAY, fontSize: 18, color: C.marigold }}>Today’s pick</div>
                  <div className="mt-3 flex items-center justify-center gap-3">
                    <Portrait item={localActor(todays.a)} size={72} />
                    <Reel size={30} spin color={C.marigold} />
                    <Portrait item={localActor(todays.b)} size={72} ring={C.pink} ring2={C.marigold} />
                  </div>
                  <div className="mt-3 font-bold" style={{ color: C.cream, fontSize: 15, lineHeight: 1.2 }}>{ACTORS[todays.a].name} to {ACTORS[todays.b].name}</div>
                  <div style={{ color: C.marigold, fontSize: 13, fontWeight: 700 }}>{todays.par === null ? "No link with these rules" : `Par ${todays.par} movie${todays.par === 1 ? "" : "s"}`}</div>
                  <button onClick={() => launch(localActor(todays.a), localActor(todays.b), null, null, { a: todays.a, b: todays.b })} disabled={launching} className="mt-3 rounded-xl px-5 py-3 inline-flex items-center gap-2" style={{ ...btn(C.pink), fontSize: 15 }}><Play size={18} /> Play today’s link</button>
                </div>
              </PopCard>
              <div className="mt-5 mb-2 px-1" style={{ ...markStyle(4), fontSize: 20, color: C.cream, WebkitTextStroke: `4px ${C.purple}`, textShadow: `2px 3px 0 ${C.purple}` }}>Challenges</div>
              <div className="fsl-grid2">{ladder.map((row, i) => <ChallengeRow key={row.a + row.b} row={row} i={i} />)}</div>
              <p className="mt-4 px-1" style={{ fontSize: 12, color: C.film, fontWeight: 700 }}>Par is the shortest chain in the built-in reel, with cameos {cameos ? "counted" : "excluded"}.</p>
            </div>
          )}

          {/* CUSTOM */}
          {tab === "custom" && (
            <div className="fsl-narrow px-3 pb-6 pt-2">
              <PopCard className="p-3">
                <div className="flex items-center justify-between">
                  <div style={{ fontFamily: DISPLAY, fontSize: 17, color: C.purple }}>Play with friends</div>
                  <button onClick={shuffle} aria-label="Random pair" className="rounded-full flex items-center justify-center" style={{ width: 38, height: 38, ...btn(C.teal) }}><Shuffle size={17} /></button>
                </div>
                <div className="mt-3 flex items-stretch gap-2">{slotBox("a")}<div className="flex items-center"><Reel size={26} spin color={C.marigold} /></div>{slotBox("b")}</div>
                <div className="mt-3 flex items-center gap-2 rounded-xl px-3" style={{ background: "#fff", border: `3px solid ${C.teal}`, height: 50 }}>
                  <Search size={19} color={C.teal} />
                  <input value={cq} onChange={(e) => setCq(e.target.value)} placeholder={slot === "a" ? "Search the starting actor…" : "Search the target actor…"} aria-label="Search actors" className="flex-1 min-w-0 bg-transparent outline-none font-bold" style={{ fontSize: 16, color: C.ink }} autoComplete="off" spellCheck={false} />
                </div>
                {cres.length > 0 && <div className="mt-2 rounded-xl overflow-y-auto" style={{ maxHeight: 280, background: C.cream, border: `2px solid ${C.purple}` }}>{cres.map((a) => <Row key={a.id} item={a} type="actor" onClick={() => fillSlot(a)} />)}</div>}
                {cq.trim().length >= 2 && cres.length === 0 && <div className="mt-2" style={{ fontSize: 13 }}>No matches yet. {api.kind === "local" ? "The built-in reel doesn’t have that actor yet." : ""}</div>}
                <div className="mt-4 grid grid-cols-1 gap-3">
                  <button onClick={async () => { const pr = await resolvePair(); if (pr) launch(pr[0], pr[1]); }} disabled={launching} className="rounded-xl py-3 flex items-center justify-center gap-2" style={{ ...btn(C.teal), fontSize: 15 }}><Play size={18} /> Play this pair</button>
                  </div>
                <div className="mt-2" style={{ fontSize: 12, color: C.ink }}>This plays on your device. For multiplayer, create a room in the Rooms tab. Cameos are always on. Hints {hints ? "on" : "off"}.</div>
              </PopCard>
            </div>
          )}

          {/* ROOMS */}
          {tab === "rooms" && (
            <div className={`${room ? "fsl-rooms" : "fsl-narrow"} px-3 pb-6 pt-2 space-y-4`}>
              {!room ? (
                <PopCard className="overflow-hidden">
                  <Scallop color={C.pink} size={18} />
                  <div className="px-4 pt-2 pb-4">
                    <div style={{ fontFamily: DISPLAY, fontSize: 18, color: C.purple }}>Multiplayer rooms</div>
                    <div className="mt-1" style={{ fontSize: 14, lineHeight: 1.25 }}>Play together on one board, or race head-to-head. One game at a time, and everyone in the room can jump in.</div>
                    <div className="mt-3 flex items-center gap-2 rounded-xl px-3" style={{ background: "#fff", border: `3px solid ${C.teal}`, height: 50 }}>
                      <Users size={19} color={C.teal} />
                      <input value={rname} onChange={(e) => setRname(e.target.value.slice(0, 16))} placeholder="Your name" className="flex-1 min-w-0 bg-transparent outline-none font-bold" style={{ fontSize: 16, color: C.ink }} autoComplete="off" spellCheck={false} />
                    </div>
                    <button onClick={createRoom} disabled={roomBusy} className="mt-3 w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ ...btn(C.pink), fontSize: 15 }}><Ticket size={18} /> Create room</button>
                    <div className="my-4 flex items-center gap-3">
                      <div className="flex-1" style={{ borderTop: `2px dashed ${C.purple}66` }} />
                      <Reel size={22} spin color={C.marigold} />
                      <div className="flex-1" style={{ borderTop: `2px dashed ${C.purple}66` }} />
                    </div>
                    <div className="flex gap-2">
                      <input value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4))} onKeyDown={(e) => { if (e.key === "Enter") joinRoom(); }} placeholder="K3G1" aria-label="Room code" className="rounded-xl outline-none min-w-0 flex-1" style={{ fontFamily: DISPLAY, fontSize: 24, letterSpacing: "0.25em", textAlign: "center", color: C.purple, background: "#fff", border: `3px solid ${C.teal}`, height: 52 }} autoComplete="off" spellCheck={false} />
                      <button onClick={joinRoom} disabled={roomBusy} className="rounded-xl px-4" style={{ ...btn(C.teal), fontSize: 15 }}>Join room</button>
                    </div>
                    {!kv.shared() && <p className="mt-3" style={{ fontSize: 12, color: C.teal, fontWeight: 700 }}>Live rooms aren’t connected yet, so rooms only link tabs on this device. Add the Supabase variables to play across phones.</p>}
                  </div>
                </PopCard>
              ) : (
                <>
                  <PopCard className="overflow-hidden">
                    <Scallop color={C.pink} size={18} />
                    <div className="px-4 pt-1 pb-4 text-center">
                      <div style={{ ...markStyle(6), fontSize: 46, letterSpacing: "0.12em" }}>{room.code}</div>
                      <div className="mt-2 font-bold" style={{ fontSize: 13, color: C.teal }}>Share this code with your co-star!</div>
                      <div className="mt-3 flex gap-2 justify-center">
                        <button onClick={async () => notify((await copyText(`🎞️ Join my Filmy Sneaky Link room! Code: ${room.code}\n${baseUrl()}?room=${room.code}`)) ? "Invite copied. Paste it in your chat!" : "Couldn’t copy.")} className="rounded-xl px-4 py-2 flex items-center gap-2" style={{ ...btn(C.teal), fontSize: 13 }}><Copy size={16} /> Copy invite</button>
                        <button onClick={leaveRoom} className="rounded-xl px-4 py-2 flex items-center gap-2" style={{ ...btn(C.cream, C.purple), fontSize: 13 }}><LogOut size={16} /> Leave</button>
                      </div>
                    </div>
                  </PopCard>

                  <PopCard className="p-3">
                    <div style={{ fontFamily: DISPLAY, fontSize: 16, color: C.purple }}>In the room</div>
                    <div className="mt-2 space-y-2">
                      {liveList.map((p) => <BoardLine key={p.id} me={p.id === pid.current} lead={statusLead(p)} title={`${p.name}${p.id === pid.current ? " (you)" : ""}`} sub={statusOf(p)} />)}
                    </div>
                  </PopCard>

                  {rmeta && round > 0 && rmeta.a && (
                    <PopCard className="p-3 text-center">
                      <div style={{ fontFamily: DISPLAY, fontSize: 16, color: C.purple }}>{endedNow ? `Game ${round} ended` : gameDone ? `Game ${round} finished` : `Game ${round} is live`}</div>
                      <div className="mt-1 font-bold" style={{ fontSize: 12, color: C.teal }}>{rmeta.mode === "coop" ? "Co-op: one shared board" : "Head-to-head race: private boards"}</div>
                      <div className="mt-2 flex items-center justify-center gap-3">
                        <Portrait item={roomActor(rmeta.a)} size={56} />
                        <Reel size={24} spin color={C.marigold} />
                        <Portrait item={roomActor(rmeta.b)} size={56} ring={C.pink} ring2={C.marigold} />
                      </div>
                      <div className="mt-2 font-bold" style={{ fontSize: 14, lineHeight: 1.2 }}>{rmeta.a.name} to {rmeta.b.name}</div>
                      <div style={{ fontSize: 12, color: C.teal, fontWeight: 700 }}>Started by {rmeta.startedBy}. Cameos {rmeta.cameos ? "on" : "off"}, hints {rmeta.hints ? "on" : "off"}.</div>
                      {gameDone && doneSummary && <div className="mt-2 font-bold" style={{ fontSize: 14, color: C.purple }}>{doneSummary}</div>}
                      {activeGame && (
                        <div className="mt-3 grid grid-cols-1 gap-2">
                          {inMatch
                            ? <button onClick={backToGame} className="rounded-xl py-2 inline-flex items-center justify-center gap-2" style={{ ...btn(C.teal), fontSize: 14 }}><Play size={16} /> Back to the game</button>
                            : <button onClick={joinRound} disabled={launching} className="rounded-xl py-2 inline-flex items-center justify-center gap-2" style={{ ...btn(C.pink), fontSize: 14 }}><Play size={16} /> Join the game</button>}
                          {confirmEnd ? (
                            <div className="grid grid-cols-2 gap-2">
                              <button onClick={endGame} className="rounded-xl py-2" style={{ ...btn(C.crimson), fontSize: 13 }}>Yes, end it</button>
                              <button onClick={() => setConfirmEnd(false)} className="rounded-xl py-2" style={{ ...btn(C.cream, C.purple), fontSize: 13 }}>Keep playing</button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmEnd(true)} className="rounded-xl py-2" style={{ ...btn(C.crimson), fontSize: 13 }}>End Game</button>
                          )}
                        </div>
                      )}
                      {gameDone && (
                        <div className="mt-3 grid grid-cols-1 gap-2">
                          {!endedNow && <button onClick={voteNext} disabled={iVoted} className="rounded-xl py-2" style={{ ...btn(iVoted ? C.teal : C.pink), fontSize: 14 }}>{iVoted ? "Ready ✓" : "Next Game"}</button>}
                          {!showPicker && !endedNow && <button onClick={() => setShowPicker(true)} className="rounded-xl py-2" style={{ ...btn(C.cream, C.purple), fontSize: 13 }}>Pick a different game</button>}
                        </div>
                      )}
                      {readyText && <div className="mt-2 font-bold" style={{ fontSize: 13, color: C.teal }}>{readyText}</div>}
                      {pending && (
                        <div className="mt-2">
                          <div className="font-bold" style={{ fontSize: 13, color: C.purple }}>{pendingMine ? "It’s your turn to give the next pairing." : `Waiting for ${pending.pickerName} to give the pairing…`}</div>
                          {pendingMine && pairingHidden === round && <button onClick={() => setPairingHidden(0)} className="mt-2 rounded-xl px-4 py-2" style={{ ...btn(C.pink), fontSize: 13 }}>Give pairing</button>}
                          {!pendingMine && <button onClick={() => setPicker(pid.current)} className="mt-2 rounded-xl px-4 py-2" style={{ ...btn(C.cream, C.purple), fontSize: 13 }}>Pick it myself</button>}
                        </div>
                      )}
                    </PopCard>
                  )}

                  {rmeta && rmeta.mode === "race" && activeGame && <PopCard className="p-3"><Scoreboard board={board} meId={pid.current} /></PopCard>}

                  {(round === 0 || endedNow || (gameDone && showPicker)) && (
                    <PopCard className="p-3">
                      <div style={{ fontFamily: DISPLAY, fontSize: 16, color: C.purple }}>Start a game</div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {[["coop", "Play together", "One shared board. Anyone can add the next step."], ["race", "Head-to-head", "Private boards. Lowest link wins."]].map(([k, t, d]) => (
                          <button key={k} onClick={() => setRoomMode(k)} aria-pressed={roomMode === k} className="rounded-xl px-2 py-2 text-left" style={{ background: roomMode === k ? C.pink : C.cream, color: roomMode === k ? C.cream : C.purple, border: `3px solid ${C.purple}`, boxShadow: roomMode === k ? `3px 4px 0 ${C.purple}` : "none" }}>
                            <div style={{ fontFamily: DISPLAY, fontSize: 14 }}>{t}</div>
                            <div style={{ fontSize: 12, lineHeight: 1.2, fontWeight: 700 }}>{d}</div>
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 grid grid-cols-1 gap-3">
                        <button onClick={() => startRound("daily", localActor(todays.a), localActor(todays.b))} disabled={launching} className="rounded-xl py-3 flex items-center justify-center gap-2" style={{ ...btn(C.pink), fontSize: 14 }}><CalendarDays size={17} /> {roomMode === "coop" ? "Co-op on today’s daily" : "Race today’s daily"}</button>
                        <div className="pt-3" style={{ borderTop: `2px dashed ${C.purple}66` }}>
                          <div style={{ fontFamily: DISPLAY, fontSize: 14, color: C.purple }}>Or choose your own stars</div>
                          <div className="mt-2 flex items-stretch gap-2">{slotBox("a")}<div className="flex items-center"><Reel size={22} spin color={C.marigold} /></div>{slotBox("b")}</div>
                          <div className="mt-2 flex items-center gap-2 rounded-xl px-3" style={{ background: "#fff", border: `3px solid ${C.teal}`, height: 48 }}>
                            <Search size={18} color={C.teal} />
                            <input value={cq} onChange={(e) => setCq(e.target.value)} placeholder={slot === "a" ? "Search the starting actor…" : "Search the target actor…"} aria-label="Search actors" className="flex-1 min-w-0 bg-transparent outline-none font-bold" style={{ fontSize: 16, color: C.ink }} autoComplete="off" spellCheck={false} />
                          </div>
                          {cres.length > 0 && <div className="mt-2 rounded-xl overflow-y-auto" style={{ maxHeight: 240, background: C.cream, border: `2px solid ${C.purple}` }}>{cres.map((a) => <Row key={a.id} item={a} type="actor" onClick={() => fillSlot(a)} />)}</div>}
                          {cq.trim().length >= 2 && cres.length === 0 && <div className="mt-2" style={{ fontSize: 13 }}>No matches yet. {api.kind === "local" ? "The built-in reel doesn’t have that actor yet." : ""}</div>}
                          <button onClick={async () => { const pr = await resolvePair(); if (pr) startRound("custom", pr[0], pr[1]); }} disabled={launching} className="mt-3 w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ ...btn(C.purple), fontSize: 14 }}><Users size={17} /> Start custom {roomMode === "coop" ? "co-op" : "race"}</button>
                        </div>
                      </div>
                      <div className="mt-2" style={{ fontSize: 12 }}>The game uses the Hints switch at the top, and cameos are always on. Everyone in the room plays by the same rules.</div>
                    </PopCard>
                  )}
                </>
              )}
            </div>
          )}

          {/* PLAY */}
          {tab === "play" && !game && (
            <div className="fsl-narrow px-3 pt-4 pb-6">
              <PopCard className="p-6 text-center">
                <div className="flex justify-center"><Reel size={64} spin color={C.marigold} /></div>
                <div className="mt-3" style={{ fontFamily: DISPLAY, fontSize: 18, color: C.purple }}>No film on the reel yet</div>
                <div className="mt-1" style={{ fontSize: 14 }}>Pick a daily challenge or build your own pair to start linking.</div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button onClick={() => setTab("daily")} className="rounded-xl py-2" style={{ ...btn(C.pink), fontSize: 13 }}>Daily</button>
                  <button onClick={() => setTab("custom")} className="rounded-xl py-2" style={{ ...btn(C.teal), fontSize: 13 }}>Custom</button>
                </div>
              </PopCard>
            </div>
          )}
          {tab === "play" && game && (
            <div>
              <GameHeader game={game} count={movieCount} />
              <div className="px-3 pt-3 pb-6">
                {partnerLines.length > 0 && (
                  <div className="mb-3 rounded-xl px-3 py-2" style={{ background: C.purple, color: C.cream, border: `2px solid ${C.marigold}` }} role="status">
                    {partnerLines.map((l) => <div key={l} className="font-bold" style={{ fontSize: 13 }}>{l}</div>)}
                  </div>
                )}
                <div className="fsl-play">
                <div><FilmChain chain={game.chain} meId={pid.current} showBy={coopMode} /></div>
                <div className="fsl-play-b">
                {!game.won && (
                  <div className="mt-3">
                    <StepInput key={game.chain.length} type={game.chain.length % 2 === 1 ? "movie" : "actor"} prev={game.chain[game.chain.length - 1]} api={api} hints={hints} cameos={cameos} used={used} onPick={attempt} onFail={failApi} />
                  </div>
                )}
                {game.won && (
                  <PopCard className="mt-3 p-3 text-center">
                    <div style={{ fontFamily: DISPLAY, fontSize: 15, color: C.purple }}>Link complete!</div>
                    <button onClick={() => setWinOpen(true)} className="mt-2 rounded-xl px-4 py-2 inline-flex items-center gap-2" style={{ ...btn(C.pink), fontSize: 13 }}><Trophy size={16} /> Show results</button>
                    {game.room && <RoomButtons roomUI={{ voted: iVoted, text: readyText, onNext: voteNext, onLobby: exitToLobby }} />}
                  </PopCard>
                )}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button onClick={undo} disabled={game.chain.length < 2} className="rounded-xl py-3 flex items-center justify-center gap-2" style={{ ...btn(C.cream, C.purple), fontSize: 13, opacity: game.chain.length < 2 ? 0.5 : 1 }}><Undo2 size={16} /> Undo last step</button>
                  <button onClick={reset} disabled={game.chain.length < 2} className="rounded-xl py-3 flex items-center justify-center gap-2" style={{ ...btn(C.cream, C.purple), fontSize: 13, opacity: game.chain.length < 2 ? 0.5 : 1 }}><RotateCcw size={16} /> Reset chain</button>
                </div>
                {game.room && !game.won && (
                  <>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <button onClick={revealLink} disabled={iRevealed} className="rounded-xl py-3" style={{ ...btn(C.teal), fontSize: 13, opacity: iRevealed ? 0.7 : 1 }}>{iRevealed ? "Link requested" : "Reveal Link"}</button>
                      <button onClick={exitToLobby} className="rounded-xl py-3" style={{ ...btn(C.purple), fontSize: 13 }}>Exit to Lobby</button>
                    </div>
                    {(revealText || readyText) && <div className="mt-2 text-center font-bold" style={{ fontSize: 13, color: C.film }}>{revealText || readyText}</div>}
                  </>
                )}
                {!game.room && game.daily && !game.won && (
                  <button onClick={() => setGame((g) => (g ? { ...g, revealed: true } : g))} className="mt-3 w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ ...btn(C.teal), fontSize: 14 }}>Reveal Link</button>
                )}
                </div>
                </div>
                <div ref={endRef} style={{ height: 1 }} />
              </div>
            </div>
          )}
          </div>
        </main>

        {/* tab bar */}
        <nav className="relative z-30 pt-2" style={{ background: C.cream, borderTop: `3px solid ${C.purple}`, boxShadow: `0 -3px 0 ${C.marigold}`, paddingBottom: "max(env(safe-area-inset-bottom), 8px)" }}>
          <div className="fsl-narrow flex gap-2 px-3">
            {tabs.map(([k, l, Icon]) => (
              <button key={k} onClick={() => setTab(k)} aria-current={tab === k ? "page" : undefined} className="flex-1 flex flex-col items-center rounded-xl py-1" style={{ background: tab === k ? C.pink : "transparent", color: tab === k ? C.cream : C.purple }}>
                <Icon size={22} /><span className="font-bold" style={{ fontSize: 12 }}>{l}</span>
              </button>
            ))}
          </div>
        </nav>

        {winOpen && game && game.won && (
          <WinModal game={game} optimal={optimal} onShare={shareResult} onClose={() => setWinOpen(false)} onAgain={() => { reset(); setWinOpen(false); }} onMenu={() => { setWinOpen(false); setTab("daily"); }} board={game.room && game.room.mode === "race" ? board : null} meId={pid.current} onNext={game.daily && !game.room ? nextDaily : null} roomUI={game.room ? { voted: iVoted, text: readyText, onNext: voteNext, onLobby: exitToLobby } : null} />
        )}
        {showAnswer && (
          <AnswerScreen game={game} answer={answer}
            solo={!game.room ? { onNext: nextDaily, onMore: () => { setGame((g) => (g ? { ...g, revealed: false } : g)); setTab("daily"); }, onBack: () => setGame((g) => (g ? { ...g, revealed: false } : g)) } : null}
            room={game.room ? { voted: iVoted, text: readyText, onNext: voteNext, onLobby: exitToLobby } : null} />
        )}
        {showPairing && (
          <div className="absolute inset-0 flex items-center justify-center px-3" style={{ background: "rgba(42,14,44,.84)", zIndex: 46 }}>
            <PopCard className="relative w-full overflow-y-auto" style={{ maxHeight: "92%", maxWidth: 560, animation: "rise .5s ease-out" }}>
              <Scallop color={C.pink} size={18} />
              <div className="px-4 pt-3 pb-4 text-center">
                {pendingMine ? (
                  <>
                    <div style={{ fontFamily: DISPLAY, fontSize: 18, color: C.purple }}>Your turn to pick!</div>
                    <div className="mt-1" style={{ fontSize: 13, lineHeight: 1.25 }}>Choose the starting and target actors for the next game. Your partner is waiting.</div>
                    <div className="mt-3 flex items-stretch gap-2">{slotBox("a")}<div className="flex items-center"><Reel size={24} spin color={C.marigold} /></div>{slotBox("b")}</div>
                    <div className="mt-3 flex items-center gap-2 rounded-xl px-3" style={{ background: "#fff", border: `3px solid ${C.teal}`, height: 50 }}>
                      <Search size={19} color={C.teal} />
                      <input value={cq} onChange={(e) => setCq(e.target.value)} placeholder={slot === "a" ? "Search the starting actor…" : "Search the target actor…"} aria-label="Search actors" className="flex-1 min-w-0 bg-transparent outline-none font-bold text-left" style={{ fontSize: 16, color: C.ink }} autoComplete="off" spellCheck={false} />
                    </div>
                    {cres.length > 0 && <div className="mt-2 rounded-xl overflow-y-auto text-left" style={{ maxHeight: 220, background: C.cream, border: `2px solid ${C.purple}` }}>{cres.map((a) => <Row key={a.id} item={a} type="actor" onClick={() => fillSlot(a)} />)}</div>}
                    {cq.trim().length >= 2 && cres.length === 0 && <div className="mt-2" style={{ fontSize: 13 }}>No matches yet. {api.kind === "local" ? "The built-in reel doesn’t have that actor yet." : ""}</div>}
                    <button onClick={submitPairing} disabled={launching} className="mt-3 w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ ...btn(C.pink), fontSize: 15 }}><Play size={18} /> Start game</button>
                    {liveList.some((p) => p.id !== pid.current) && (
                      <button onClick={() => setPicker(liveList.find((p) => p.id !== pid.current).id)} className="mt-3 w-full rounded-xl py-2" style={{ ...btn(C.cream, C.purple), fontSize: 13 }}>Let {liveList.find((p) => p.id !== pid.current).name} pick instead</button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex justify-center"><Reel size={56} spin color={C.marigold} /></div>
                    <div className="mt-3" style={{ fontFamily: DISPLAY, fontSize: 17, color: C.purple, lineHeight: 1.2 }}>Waiting for other player to give pairing…</div>
                    <div className="mt-1" style={{ fontSize: 13 }}>{pending.pickerName} is choosing the next actors. The game starts as soon as they’re set.</div>
                    <button onClick={() => setPicker(pid.current)} className="mt-3 w-full rounded-xl py-2" style={{ ...btn(C.cream, C.purple), fontSize: 13 }}>Pick it myself</button>
                  </>
                )}
                <button onClick={() => { setPairingHidden(round); setTab("rooms"); }} className="mt-3 text-center font-bold" style={{ fontSize: 12, color: C.teal }}>Back to lobby</button>
              </div>
            </PopCard>
          </div>
        )}
        {results && (
          <RaceResults card={results} game={game} meId={pid.current} wins={wins} roomUI={{ voted: iVoted, text: readyText, onNext: voteNext, onLobby: exitToLobby }} onClose={() => setResults(null)} />
        )}
        {toast && (
          <div className="absolute left-0 right-0 flex justify-center px-4 pointer-events-none" style={{ bottom: 84, zIndex: 60 }}>
            <div className="rounded-xl px-4 py-2 font-bold text-center" style={{ background: C.purple, color: C.cream, border: `2px solid ${C.marigold}`, fontSize: 13, boxShadow: `3px 4px 0 ${C.film}`, animation: "rise .3s ease-out" }} role="status">{toast}</div>
          </div>
        )}
        {launching && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(42,14,44,.45)", zIndex: 55 }}><Reel size={64} spin color={C.marigold} /></div>
        )}
      </div>
    </div>
  );
}
