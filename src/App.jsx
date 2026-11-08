import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Settings as SettingsIcon, Undo2, RotateCcw, Share2, X, Trophy, Search, Send,
  CalendarDays, Users, KeyRound, Copy, Shuffle, Clapperboard, Play, Eye, EyeOff, Film, Ticket, LogOut,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Default TMDB key baked in at build time (set VITE_TMDB_KEY in Vercel). Players can still override it in Settings.
const ENV_KEY = import.meta.env.VITE_TMDB_KEY || "";

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

const CAMEO_RE = /uncredited|cameo|special appearance|guest appearance|archive footage|\bhimself\b|\bherself\b|\bself\b/i;
const NOISE_RE = /awards?\b|filmfare|iifa|zee cine|ceremony|red carpet/i;
const badGenre = (g) => (g || []).some((x) => x === 99 || x === 10767 || x === 10763 || x === 10764);
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
    const res = await fetch(url.toString(), bearer ? { headers: { Authorization: "Bearer " + key, accept: "application/json" } } : undefined);
    if (!res.ok) throw new Error("TMDB " + res.status);
    const j = await res.json(); cache.set(ck, j); return j;
  };
  const img = (p) => (p ? "https://image.tmdb.org/t/p/w185" + p : null);
  const mv = (r) => ({ id: "t" + r.id, title: r.title || r.original_title || "Untitled", year: (r.release_date || "").slice(0, 4) || "—", poster: img(r.poster_path), src: "tmdb" });
  const ac = (r) => ({ id: "t" + r.id, name: r.name, photo: img(r.profile_path), src: "tmdb" });
  const personCredits = async (aid) => (await get(`/person/${aid.slice(1)}/movie_credits`)).cast || [];
  const api = {
    kind: "tmdb",
    verify: () => get("/configuration"),
    async searchActors(q) {
      const j = await get("/search/person", { query: q, include_adult: "false" });
      return (j.results || []).filter((r) => r.known_for_department === "Acting").slice(0, 8).map(ac);
    },
    async searchMovies(q) {
      const j = await get("/search/movie", { query: q, include_adult: "false" });
      return (j.results || []).filter((r) => !badGenre(r.genre_ids)).slice(0, 8).map(mv);
    },
    async moviesOf(aid, cameos) {
      const l = await personCredits(aid);
      return l.filter((r) => r.release_date && !badGenre(r.genre_ids) && !NOISE_RE.test(r.title || "") && (cameos || !CAMEO_RE.test(r.character || "")))
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 40).map(mv);
    },
    async castOf(mid, cameos) {
      const j = await get(`/movie/${mid.slice(1)}/credits`);
      return (j.cast || []).filter((r) => r.known_for_department === "Acting" && (cameos || !CAMEO_RE.test(r.character || ""))).slice(0, 50).map(ac);
    },
    async credit(aid, mid) {
      const l = await personCredits(aid); const r = l.find((x) => "t" + x.id === mid);
      if (!r || badGenre(r.genre_ids) || NOISE_RE.test(r.title || "")) return "no";
      return CAMEO_RE.test(r.character || "") ? "cameo" : "yes";
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
const packNode = (n) => (n.type === "movie"
  ? { type: "movie", id: n.id, title: n.title, year: n.year, src: n.src, ...(n.src === "tmdb" ? { poster: n.poster || null } : {}) }
  : { type: "actor", id: n.id, name: n.name, src: n.src, ...(n.src === "tmdb" ? { photo: n.photo || null } : {}) });
const unpackNode = (n) => (n.src === "local" && (n.type === "movie" ? MOVIES[n.id] : ACTORS[n.id])
  ? { type: n.type, ...(n.type === "movie" ? localMovie(n.id) : localActor(n.id)) }
  : n);
const sigOf = (chain, won) => chain.map((n) => n.type + n.id).join(">") + (won ? "!" : "");
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

function ScoreCard({ card, meId, wins, onNext, onRoom, onClose }) {
  const medals = ["🥇", "🥈", "🥉"];
  const w = card.rows[0];
  const plural = (n) => `${n} movie${n === 1 ? "" : "s"}`;
  const tally = Object.values(wins).sort((a, b) => b.n - a.n);
  return (
    <div className="absolute inset-0 flex items-center justify-center px-3" style={{ background: "rgba(42,14,44,.78)", zIndex: 45 }}>
      <PopCard className="relative w-full overflow-y-auto" style={{ maxHeight: "92%", animation: "rise .5s ease-out" }}>
        <Scallop color={C.pink} size={18} />
        <div className="px-4 pt-3 pb-4">
          <button onClick={onClose} aria-label="Close scorecard" className="absolute rounded-full flex items-center justify-center" style={{ top: 16, right: 14, width: 34, height: 34, background: C.cream, border: `2px solid ${C.purple}` }}><X size={18} color={C.purple} /></button>
          <div className="text-center" style={{ ...markStyle(5), fontSize: 28 }}>SCORECARD</div>
          <div className="mt-3 text-center" style={{ fontFamily: DISPLAY, fontSize: 16, color: C.purple, lineHeight: 1.2 }}>
            {card.tie ? `Tie on ${plural(w.movies)}! ${w.name} finished first.` : `${w.name} wins with the lowest link: ${plural(w.movies)}!`}
          </div>
          <div className="mt-3 space-y-2">
            {card.rows.map((p, i) => (
              <BoardLine key={p.id} me={p.id === meId} lead={medals[i] || "🎞️"} title={`${p.name}${p.id === meId ? " (you)" : ""}: ${plural(p.movies)}`}
                sub={i === 0 ? (card.tie ? "First to finish" : "Lowest link") : p.movies === w.movies ? "Same link, finished later" : `${p.movies - w.movies} extra movie${p.movies - w.movies === 1 ? "" : "s"}`} />
            ))}
          </div>
          {tally.length > 0 && (
            <div className="mt-3 rounded-xl px-3 py-2 font-bold" style={{ background: C.teal, color: C.cream, border: `2px solid ${C.purple}`, fontSize: 13 }}>
              Session wins: {tally.map((t) => `${t.name} ${t.n}`).join(", ")}
            </div>
          )}
          <button onClick={onNext} className="mt-4 w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ ...btn(C.pink), fontSize: 15 }}><Play size={18} /> Next challenge</button>
          <button onClick={onRoom} className="mt-3 w-full rounded-xl py-2" style={{ ...btn(C.cream, C.purple), fontSize: 13 }}>Back to room</button>
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
        <div className="flex items-start gap-1 px-3 pb-2">
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

function ChainCard({ node, index }) {
  const isMovie = node.type === "movie";
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ background: C.cream, border: `3px solid ${C.purple}`, boxShadow: `inset 0 0 0 2px ${C.cream}, inset 0 0 0 4px ${C.teal}`, animation: index > 0 ? "lock 1.1s ease-out" : "rise .5s ease-out" }}>
      {isMovie ? <Poster item={node} w={54} /> : <Portrait item={node} size={60} />}
      <div className="min-w-0 flex-1">
        <div style={{ fontFamily: DISPLAY, fontSize: 15, lineHeight: 1.15, color: C.purple }}>{isMovie ? node.title : node.name}</div>
        {isMovie && <div className="font-bold" style={{ color: C.teal, fontSize: 14 }}>{node.year}</div>}
        {index === 0 && <span className="inline-block mt-1 rounded-full px-2 font-bold" style={{ background: C.pink, color: C.cream, fontSize: 11 }}>Starts here</span>}
      </div>
      {isMovie ? <Film size={20} color={C.teal} /> : <Clapperboard size={20} color={C.pink} />}
    </div>
  );
}
function FilmChain({ chain }) {
  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: C.film, border: `3px solid ${C.purple}`, boxShadow: `4px 5px 0 ${C.purple}` }}>
      <div className="absolute inset-y-0 left-0" style={{ width: 16, ...sprV }} />
      <div className="absolute inset-y-0 right-0" style={{ width: 16, ...sprV }} />
      <div className="relative" style={{ padding: "12px 24px" }}>
        {chain.map((n, i) => (
          <React.Fragment key={n.type + n.id}>
            {i > 0 && <div className="flex justify-center py-1"><Reel size={22} spin color={C.marigold} /></div>}
            <ChainCard node={n} index={i} />
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
        const r = type === "movie" ? await api.searchMovies(q) : await api.searchActors(q);
        if (my === seq.current) { setItems(r); setLoading(false); }
      } catch (e) { if (my === seq.current) { setLoading(false); onFail(); } }
    }, 250);
    return () => clearTimeout(t);
  }, [q, hints, type, api]);

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
                {hints ? "No valid options match that spelling." : `Nothing in the reel matches “${q}”. ${api.kind === "local" ? "Add a TMDB key in Settings to search every film." : ""}`}
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

function WinModal({ game, optimal, onShare, onAgain, onMenu, onClose, board, meId, onNext }) {
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
      <PopCard className="relative w-full overflow-y-auto" style={{ maxHeight: "92%", animation: "rise .5s ease-out" }}>
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
          {onNext && <button onClick={onNext} className="mt-3 w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ ...btn(C.teal), fontSize: 15 }}>Next Challenge ➔</button>}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button onClick={onAgain} className="rounded-xl py-2" style={{ ...btn(C.teal), fontSize: 13 }}>Play again</button>
            <button onClick={onMenu} className="rounded-xl py-2" style={{ ...btn(C.cream, C.purple), fontSize: 13 }}>{game.room ? "Back to room" : "More challenges"}</button>
          </div>
        </div>
      </PopCard>
    </div>
  );
}

/* ───────────────────────── 6. MAIN APP ───────────────────────── */

export default function App() {
  const [tab, setTab] = useState("daily");
  const [cameos, setCameosS] = useState(() => store.get("fsl:cameos") === "1");
  const [hints, setHintsS] = useState(() => store.get("fsl:hints") === "1");
  const [apiKey, setApiKey] = useState(() => store.get("fsl:key") || ENV_KEY);
  const [tmdbState, setTmdbState] = useState(ENV_KEY && !store.get("fsl:key") ? "ok" : "idle");
  const [drawer, setDrawer] = useState(false);
  const [draft, setDraft] = useState(() => store.get("fsl:key") || "");
  const [showKey, setShowKey] = useState(false);
  const [game, setGame] = useState(null);
  const [winOpen, setWinOpen] = useState(false);
  const [optimal, setOptimal] = useState(null);
  const [toast, setToast] = useState(null);
  const [launching, setLaunching] = useState(false);
  const [pickA, setPickA] = useState(null);
  const [pickB, setPickB] = useState(null);
  const [slot, setSlot] = useState("a");
  const [cq, setCq] = useState("");
  const [cres, setCres] = useState([]);
  const [link, setLink] = useState("");
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
  const [coopOrder, setCoopOrder] = useState([]);
  const [scorecard, setScorecard] = useState(null);
  const [wins, setWins] = useState({});
  const gameRef = useRef(null);
  const coopVer = useRef(0);
  const coopSig = useRef("");
  const shownRound = useRef(0);

  const setCameos = (v) => { setCameosS(v); store.set("fsl:cameos", v ? "1" : "0"); };
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
      if (!a || !b) { notify("That star isn’t in the built-in reel. Add a TMDB key in Settings."); return; }
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
    try { r = isMovie ? await api.credit(last.id, item.id) : await api.credit(item.id, last.id); } catch (e) { failApi(); return { ok: false, msg: "Couldn’t check that one. Try again!" }; }
    const aName = isMovie ? last.name : item.name, mName = isMovie ? item.title : last.title;
    if (r === "cameo" && !cameos) return { ok: false, msg: `Aha! ${aName} only had a cameo in “${mName}”. Switch on Include Cameos in Settings to count it.` };
    if (r === "no") return { ok: false, msg: OOPS[hash(aName + mName) % OOPS.length](aName, mName) };
    const node = { type: isMovie ? "movie" : "actor", ...item };
    const done = !isMovie && item.id === game.b.id;
    return { ok: true, commit: () => setGame((g) => (g ? { ...g, chain: [...g.chain, node], won: done } : g)) };
  };
  const undo = () => setGame((g) => (g && g.chain.length > 1 ? { ...g, chain: g.chain.slice(0, -1), won: false } : g));
  const reset = () => setGame((g) => (g ? { ...g, chain: [g.chain[0]], won: false } : g));

  const shareResult = async () => {
    const movies = game.chain.filter((n) => n.type === "movie").length;
    const line = game.chain.map((n) => (n.type === "movie" ? `🎬 ${n.title}` : `🎭 ${n.name}`)).join(" ➜ ");
    const text = `🎞️ Filmy Sneaky Link 🎬\n${game.a.name} ➜ ${game.b.name}\nLinked in ${movies} movie${movies === 1 ? "" : "s"}${optimal && optimal.movies ? ` (shortest: ${optimal.movies})` : ""}!\n\n${line}\n\nCan you beat it? ${challengeUrl(game.a, game.b, cameos, hints)}`;
    notify((await copyText(text)) ? "Copied! Paste it into your chat 🎬" : "Couldn’t copy. Select and copy manually.");
  };
  const sendChallenge = async () => {
    if (!pickA || !pickB) { notify("Pick a start and a target star first."); return; }
    setRoomBusy(true);
    let code;
    try {
      if (room) { code = room.code; await startRound("custom", pickA, pickB, "coop"); }
      else {
        code = await makeCode();
        if (!code) { notify("Couldn’t make a room. Try again."); return; }
        const ok = await autoRoom(code, pickA, pickB, { cameos, hints }, rname.trim() || store.get("fsl:name") || "Player 1");
        if (!ok) return;
      }
    } finally { setRoomBusy(false); }
    const url = `${challengeUrl(pickA, pickB, cameos, hints)}&room=${code}`; setLink(url);
    notify((await copyText(url)) ? "Link copied! Your co-op board is open. Your friend joins from the link." : "Link ready below. Copy it manually.");
  };
  const saveKey = async (raw) => {
    const k = raw.trim();
    if (!k) { store.del("fsl:key"); setApiKey(ENV_KEY); setTmdbState(ENV_KEY ? "ok" : "idle"); notify(ENV_KEY ? "Your key was removed. Using the app’s default TMDB key." : "TMDB key removed. Back to the built-in reel."); return; }
    store.set("fsl:key", k); setApiKey(k); setTmdbState("checking");
    try { await getTmdb(k).verify(); setTmdbState("ok"); notify("TMDB connected. Every film is in play!"); } catch (e) { setTmdbState("fail"); notify("Couldn’t reach TMDB with that key. Using the built-in reel."); }
  };

  // ── Multiplayer rooms
  const writeMe = async (patch, code) => {
    const c = code || (room && room.code);
    if (!c) return;
    myRec.current = { ...(myRec.current || { id: pid.current, name: rname.trim() || "Player", round: 0, movies: 0, done: false, doneAt: 0 }), ...patch, ping: Date.now() };
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
    return { meta, players };
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
  const createRoom = async () => {
    const name = rname.trim();
    if (!name) { notify("Add your name first."); return; }
    setRoomBusy(true);
    try {
      const code = await makeCode();
      if (!code) { notify("Couldn’t make a room. Try again."); return; }
      const meta = { code, host: pid.current, hostName: name, round: 0, created: Date.now() };
      if (!(await kv.set("room:" + code, meta))) { notify("Couldn’t save the room. Try again."); return; }
      store.set("fsl:name", name); myRec.current = null; seenRound.current = 0;
      setRoom({ code }); setRoomData({ meta, players: [] });
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
      store.set("fsl:name", name); myRec.current = null; seenRound.current = d.meta.round || 0;
      setRoom({ code }); setRoomData(d);
      await writeMe({ name, joined: Date.now() }, code);
      notify(`Welcome to room ${code}!`);
    } finally { setRoomBusy(false); }
  };
  const leaveRoom = async () => {
    if (!room) return;
    await kv.del(`rp:${room.code}:${pid.current}`);
    setGame((g) => (g && g.room ? { ...g, room: null } : g));
    setRoom(null); setRoomData(null); myRec.current = null;
    setCoopOrder([]); setScorecard(null); setWins({}); shownRound.current = 0;
  };
  const startRound = async (kind, aIn, bIn, modeIn) => {
    if (!room) return;
    const mode = modeIn || roomMode;
    let aObj, bObj;
    try { aObj = await resolveFor(aIn); bObj = await resolveFor(bIn); } catch (e) { failApi(); return; }
    if (!aObj || !bObj) { notify("That star isn’t in the built-in reel. Add a TMDB key in Settings."); return; }
    const cur = await fetchRoom(room.code);
    const base = (cur && cur.meta) || (roomData && roomData.meta) || { code: room.code };
    const ref = (x) => ({ id: x.id, name: x.name, src: x.src });
    const meta = { ...base, round: (base.round || 0) + 1, kind, mode, a: ref(aObj), b: ref(bObj), cameos, hints, startedBy: rname.trim() || "Someone", startedById: pid.current, startedAt: Date.now() };
    const startNode = { type: "actor", ...aObj };
    if (mode === "coop") {
      const order = [pid.current, ...livePlayers((cur && cur.players) || []).map((p) => p.id).filter((id) => id !== pid.current)];
      coopVer.current = 1; coopSig.current = sigOf([startNode], false); setCoopOrder(order);
      await kv.set("rc:" + room.code, { round: meta.round, ver: 1, order, chain: [packNode(startNode)], won: false, by: pid.current });
    }
    await kv.set("room:" + room.code, meta);
    seenRound.current = meta.round;
    setRoomData((d) => (d ? { ...d, meta } : d));
    await launch(aObj, bObj, { cameos, hints }, { code: room.code, round: meta.round, mode });
  };
  const joinRound = async () => {
    const m = roomData && roomData.meta;
    if (!m || !m.a) return;
    const info = { code: room.code, round: m.round, mode: m.mode || "race" };
    if (info.mode === "coop") {
      const c = await kv.get("rc:" + room.code);
      if (c && c.round === m.round) {
        let order = c.order || []; let ver = c.ver;
        if (!order.includes(pid.current)) { order = [...order, pid.current]; ver = c.ver + 1; await kv.set("rc:" + room.code, { ...c, order, ver }); }
        const chain = c.chain.map(unpackNode);
        coopVer.current = ver; coopSig.current = sigOf(chain, c.won); setCoopOrder(order);
        info.init = { chain, won: !!c.won };
      }
    }
    launch(roomActor(m.a), roomActor(m.b), { cameos: !!m.cameos, hints: !!m.hints }, info);
  };
  useEffect(() => {
    if (!room) return undefined;
    let live = true;
    const tick = async () => {
      const d = await fetchRoom(room.code);
      if (!live || !d) return;
      setRoomData(d);
      const g = gameRef.current;
      if (d.meta.mode === "coop" && g && g.room && g.room.mode === "coop" && g.room.code === room.code && g.room.round === d.meta.round) {
        const c = d.coop !== undefined ? d.coop : await kv.get("rc:" + room.code);
        if (!live) return;
        if (c && c.round === g.room.round && c.ver > coopVer.current) {
          const ch = c.chain.map(unpackNode);
          coopVer.current = c.ver; coopSig.current = sigOf(ch, c.won); setCoopOrder(c.order || []);
          setGame((cur) => (cur && cur.room && cur.room.round === c.round ? { ...cur, chain: ch, won: !!c.won } : cur));
        }
      }
      if ((d.meta.round || 0) > seenRound.current) {
        seenRound.current = d.meta.round;
        if (d.meta.startedById !== pid.current) notify(`${d.meta.startedBy} started a match! Open Rooms to join the race.`);
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
  const joinBoard = async (code, m) => {
    if (!m || !m.a) return;
    const info = { code, round: m.round, mode: m.mode || "race" };
    if (info.mode === "coop") {
      const c = await kv.get("rc:" + code);
      if (c && c.round === m.round) {
        let order = c.order || []; let ver = c.ver;
        if (!order.includes(pid.current)) { order = [...order, pid.current]; ver = c.ver + 1; await kv.set("rc:" + code, { ...c, order, ver }); }
        const chain = c.chain.map(unpackNode);
        coopVer.current = ver; coopSig.current = sigOf(chain, c.won); setCoopOrder(order);
        info.init = { chain, won: !!c.won };
      }
    }
    await launch(roomActor(m.a), roomActor(m.b), { cameos: !!m.cameos, hints: !!m.hints }, info);
  };
  // Used by "Send Sneaky Link Challenge" and by friends opening that link:
  // joins the room if it exists, otherwise creates it as a Custom Co-op room for the given pair.
  const autoRoom = async (code, A, B, rules, name) => {
    setRoomBusy(true);
    try {
      store.set("fsl:name", name); setRname(name); myRec.current = null; setWins({}); shownRound.current = 0;
      const d = await fetchRoom(code);
      if (d && d.meta.round > 0 && d.meta.a) {
        seenRound.current = d.meta.round;
        setRoom({ code }); setRoomData(d);
        await writeMe({ name, joined: Date.now() }, code);
        await joinBoard(code, d.meta);
        notify(`Joined room ${code}. The shared board is ready!`);
        return true;
      }
      let aO, bO;
      try { aO = await resolveFor(A); bO = await resolveFor(B); } catch (e) { failApi(); return false; }
      if (!aO || !bO) { notify("That star isn’t in the built-in reel. Add a TMDB key in Settings."); return false; }
      const ref = (x) => ({ id: x.id, name: x.name, src: x.src });
      const meta = {
        ...(d ? d.meta : { code, host: pid.current, hostName: name, created: Date.now() }),
        round: ((d && d.meta.round) || 0) + 1, kind: "custom", mode: "coop", a: ref(aO), b: ref(bO),
        cameos: !!rules.cameos, hints: !!rules.hints, startedBy: name, startedById: pid.current, startedAt: Date.now(),
      };
      const startNode = { type: "actor", ...aO }; const order = [pid.current];
      await kv.set("rc:" + code, { round: meta.round, ver: 1, order, chain: [packNode(startNode)], won: false, by: pid.current });
      await kv.set("room:" + code, meta);
      coopVer.current = 1; coopSig.current = sigOf([startNode], false); setCoopOrder(order);
      seenRound.current = meta.round;
      setRoom({ code }); setRoomData({ meta, players: [] });
      await writeMe({ name, joined: Date.now() }, code);
      await launch(aO, bO, { cameos: !!rules.cameos, hints: !!rules.hints }, { code, round: meta.round, mode: "coop" });
      return true;
    } finally { setRoomBusy(false); }
  };
  const gameRound = game && game.room ? game.room.round : 0;
  useEffect(() => {
    if (!game || !game.room || !room || game.room.code !== room.code) return;
    const mv = game.chain.filter((n) => n.type === "movie").length;
    writeMe({ round: game.room.round, movies: mv, done: !!game.won, doneAt: game.won ? Date.now() : 0 });
  }, [gameRound, chainLen, won]);
  const rmeta = roomData ? roomData.meta : null;
  const inMatch = !!(game && game.room && room && rmeta && game.room.code === room.code && game.room.round === rmeta.round);
  const board = useMemo(() => {
    if (!roomData) return null;
    const ps = roomData.players;
    const newest = Math.max(0, ...ps.map((p) => p.ping || 0));
    const live = ps.filter((p) => newest - (p.ping || 0) < 45000);
    const r = roomData.meta.round || 0;
    const racers = live.filter((p) => r > 0 && p.round === r);
    return {
      r, count: live.length,
      fin: racers.filter((p) => p.done).sort((a, b) => a.doneAt - b.doneAt),
      run: racers.filter((p) => !p.done).sort((a, b) => b.movies - a.movies),
      idle: live.filter((p) => !(r > 0 && p.round === r)),
    };
  }, [roomData]);

  // ── Co-op turns, shared-board writes, race scorecard
  gameRef.current = game;
  const coopMode = !!(game && game.room && game.room.mode === "coop");
  const livePids = useMemo(() => new Set(roomData ? livePlayers(roomData.players).map((p) => p.id) : []), [roomData]);
  const turnId = coopMode && coopOrder.length ? coopOrder[(chainLen - 1) % coopOrder.length] : null;
  const myTurn = !coopMode || !turnId || turnId === pid.current || !livePids.has(turnId);
  const turnP = roomData && turnId ? roomData.players.find((p) => p.id === turnId) : null;
  const turnName = turnP ? turnP.name : "your teammate";
  const teamPlayers = useMemo(() => {
    if (!roomData) return [];
    const idx = (id) => { const i = coopOrder.indexOf(id); return i < 0 ? 99 : i; };
    return livePlayers(roomData.players).sort((a, b) => idx(a.id) - idx(b.id));
  }, [roomData, coopOrder]);

  useEffect(() => {
    if (!game || !game.room || game.room.mode !== "coop" || !room) return;
    const sig = sigOf(game.chain, game.won);
    if (sig === coopSig.current) return;
    const ver = coopVer.current + 1;
    coopVer.current = ver; coopSig.current = sig;
    kv.set("rc:" + room.code, { round: game.room.round, ver, order: coopOrder, chain: game.chain.map(packNode), won: !!game.won, by: pid.current });
  }, [chainLen, won, gameRound]);

  useEffect(() => {
    if (!board || !rmeta || rmeta.mode === "coop" || board.r === 0) return;
    if (board.run.length > 0 || board.fin.length + board.run.length < 2) return;
    if (shownRound.current === board.r) return;
    if (!board.fin.some((p) => p.id === pid.current)) return;
    shownRound.current = board.r;
    const rows = [...board.fin].sort((a, b) => a.movies - b.movies || a.doneAt - b.doneAt);
    const tie = rows.length > 1 && rows[0].movies === rows[1].movies;
    setWins((w) => ({ ...w, [rows[0].id]: { name: rows[0].name, n: ((w[rows[0].id] || {}).n || 0) + 1 } }));
    setScorecard({ round: board.r, rows, tie });
    setWinOpen(false);
  }, [board]);
  useEffect(() => { if (scorecard && rmeta && (rmeta.round || 0) > scorecard.round) setScorecard(null); }, [rmeta && rmeta.round]);
  const nextDaily = () => {
    if (!game || !game.daily) return;
    const i = ladder.findIndex((r) => r.a === game.daily.a && r.b === game.daily.b);
    const row = ladder[(i + 1) % ladder.length];
    setWinOpen(false);
    launch(localActor(row.a), localActor(row.b), null, null, { a: row.a, b: row.b });
  };
  const nextChallenge = () => {
    const m = rmeta; if (!m) return;
    const idx = m.a && m.b ? ladder.findIndex((r) => r.a === m.a.id && r.b === m.b.id) : -1;
    const row = ladder[(idx + 1) % ladder.length];
    setScorecard(null);
    startRound("daily", localActor(row.a), localActor(row.b), m.mode || "race");
  };

  // Custom-mode actor search
  useEffect(() => {
    if (cq.trim().length < 2) { setCres([]); return undefined; }
    let live = true;
    const t = setTimeout(async () => { try { const r = await api.searchActors(cq); if (live) setCres(r); } catch (e) { if (live) failApi(); } }, 250);
    return () => { live = false; clearTimeout(t); };
  }, [cq, api]);
  const fillSlot = (a) => {
    if (slot === "a") { setPickA(a); if (!pickB) setSlot("b"); } else { setPickB(a); if (!pickA) setSlot("a"); }
    setCq(""); setCres([]); setLink("");
  };
  const shuffle = () => {
    const i = Math.floor(Math.random() * STARS.length); let j = Math.floor(Math.random() * STARS.length); if (j === i) j = (j + 1) % STARS.length;
    setPickA(localActor(STARS[i])); setPickB(localActor(STARS[j])); setLink("");
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
  const status = apiKey ? ({ ok: "Live TMDB", fail: "Key saved, TMDB unreachable", checking: "Checking key…", idle: "Key saved" }[tmdbState]) : "Built-in reel";

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

  const Slot = ({ k, val }) => (
    <button onClick={() => setSlot(k)} className="flex-1 rounded-2xl flex flex-col items-center py-3 px-2" style={{ background: C.cream, border: `3px solid ${slot === k ? C.pink : C.purple}`, boxShadow: slot === k ? `0 0 0 3px ${C.marigold}, 3px 4px 0 3px ${C.purple}` : `3px 4px 0 ${C.purple}` }}>
      {val ? <Portrait item={val} size={62} ring={k === "a" ? C.marigold : C.pink} ring2={k === "a" ? C.teal : C.marigold} /> : <div className="flex items-center justify-center rounded-full" style={{ width: 62, height: 62, border: `3px dashed ${C.purple}` }}><Reel size={30} color={C.cream} fill={C.teal} /></div>}
      <div className="mt-2 font-bold text-center" style={{ fontSize: 13, color: C.ink, lineHeight: 1.15, minHeight: 30 }}>{val ? val.name : k === "a" ? "Pick the start" : "Pick the target"}</div>
    </button>
  );

  const tabs = [["daily", "Daily", CalendarDays], ["custom", "Custom", Users], ["rooms", "Rooms", Ticket]];

  return (
    <div className="fsl w-full flex justify-center" style={{ background: C.ink, minHeight: "100dvh" }}>
      <style>{CSS}</style>
      <div className="relative w-full max-w-md overflow-hidden flex flex-col" style={{ height: "100dvh", background: GRAD, fontFamily: BODY, color: C.ink }}>
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ backgroundImage: RAYS }} />

        {/* top nav */}
        <div className="relative z-30 flex items-center justify-between px-4" style={{ paddingTop: "max(env(safe-area-inset-top), 10px)", paddingBottom: 8 }}>
          <div className="flex items-center gap-3">
            <Reel size={42} spin color={C.marigold} />
            <div>
              <div style={{ ...markStyle(6), fontSize: 27 }}>FILMY</div>
              <div style={{ ...markStyle(4), fontSize: 16, marginTop: 3 }}>SNEAKY LINK</div>
            </div>
          </div>
          <button onClick={() => { setDraft(store.get("fsl:key") || ""); setDrawer(true); }} aria-label="Open settings" className="rounded-full flex items-center justify-center" style={{ width: 46, height: 46, background: C.cream, border: `3px solid ${C.purple}`, boxShadow: `inset 0 0 0 2px ${C.cream}, inset 0 0 0 4px ${C.teal}, 2px 3px 0 ${C.purple}` }}>
            <SettingsIcon size={22} color={C.purple} />
          </button>
        </div>

        <main className="relative z-10 flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}>
          {tab !== "play" && game && (
            <div className="px-3 pt-2">
              <button onClick={() => setTab("play")} className="w-full rounded-xl py-2 px-3 flex items-center justify-center gap-2" style={{ ...btn(C.purple), fontSize: 13 }}>
                <Clapperboard size={16} className="shrink-0" /> {game.won ? "See your finished link" : `Resume ${game.a.name} to ${game.b.name}`}
              </button>
            </div>
          )}

          {/* DAILY */}
          {tab === "daily" && (
            <div className="px-3 pb-6 pt-2">
              <PopCard tone={C.purple} ring={C.marigold} className="overflow-hidden" style={{ boxShadow: `inset 0 0 0 3px ${C.purple}, inset 0 0 0 5px ${C.marigold}, 4px 5px 0 ${C.film}` }}>
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
              <div className="space-y-3">{ladder.map((row, i) => <ChallengeRow key={row.a + row.b} row={row} i={i} />)}</div>
              <p className="mt-4 px-1" style={{ fontSize: 12, color: C.film, fontWeight: 700 }}>Par is the shortest chain in the built-in reel, with cameos {cameos ? "counted" : "excluded"}.</p>
            </div>
          )}

          {/* CUSTOM */}
          {tab === "custom" && (
            <div className="px-3 pb-6 pt-2">
              <PopCard className="p-3">
                <div className="flex items-center justify-between">
                  <div style={{ fontFamily: DISPLAY, fontSize: 17, color: C.purple }}>Play with friends</div>
                  <button onClick={shuffle} aria-label="Random pair" className="rounded-full flex items-center justify-center" style={{ width: 38, height: 38, ...btn(C.teal) }}><Shuffle size={17} /></button>
                </div>
                <div className="mt-3 flex items-stretch gap-2"><Slot k="a" val={pickA} /><div className="flex items-center"><Reel size={26} spin color={C.marigold} /></div><Slot k="b" val={pickB} /></div>
                <div className="mt-3 flex items-center gap-2 rounded-xl px-3" style={{ background: "#fff", border: `3px solid ${C.teal}`, height: 50 }}>
                  <Search size={19} color={C.teal} />
                  <input value={cq} onChange={(e) => setCq(e.target.value)} placeholder={slot === "a" ? "Search the starting actor…" : "Search the target actor…"} className="flex-1 min-w-0 bg-transparent outline-none font-bold" style={{ fontSize: 16, color: C.ink }} autoComplete="off" spellCheck={false} />
                </div>
                {cres.length > 0 && <div className="mt-2 rounded-xl overflow-y-auto" style={{ maxHeight: 280, background: C.cream, border: `2px solid ${C.purple}` }}>{cres.map((a) => <Row key={a.id} item={a} type="actor" onClick={() => fillSlot(a)} />)}</div>}
                {cq.trim().length >= 2 && cres.length === 0 && <div className="mt-2" style={{ fontSize: 13 }}>No matches yet. {api.kind === "local" ? "Add a TMDB key in Settings to search every actor." : ""}</div>}
                <div className="mt-3 flex flex-wrap gap-2">
                  {STARS.slice(0, 14).map((id) => (
                    <button key={id} onClick={() => fillSlot(localActor(id))} className="rounded-full px-3 py-1 font-bold" style={{ background: C.cream, color: C.purple, border: `2px solid ${C.purple}`, fontSize: 12 }}>{ACTORS[id].name.split(" ")[0]}</button>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  <button onClick={() => pickA && pickB ? launch(pickA, pickB) : notify("Pick a start and a target star first.")} disabled={launching} className="rounded-xl py-3 flex items-center justify-center gap-2" style={{ ...btn(C.teal), fontSize: 15 }}><Play size={18} /> Play this pair</button>
                  <button onClick={sendChallenge} className="rounded-xl py-3 flex items-center justify-center gap-2" style={{ ...btn(C.pink), fontSize: 15 }}><Send size={18} /> Send Sneaky Link Challenge</button>
                  {room && <button onClick={() => (pickA && pickB ? startRound("custom", pickA, pickB) : notify("Pick a start and a target star first."))} disabled={launching} className="rounded-xl py-3 flex items-center justify-center gap-2" style={{ ...btn(C.purple), fontSize: 15 }}><Ticket size={18} /> Start {roomMode === "coop" ? "co-op" : "race"} in room {room.code}</button>}
                </div>
                <div className="mt-2" style={{ fontSize: 12, color: C.ink }}>Sending opens a private co-op room for this pair. Your friend lands on the shared board straight from the link. Rules: cameos {cameos ? "on" : "off"}, hints {hints ? "on" : "off"}.</div>
                {link && (
                  <div className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "#fff", border: `2px dashed ${C.purple}` }}>
                    <div className="flex-1 min-w-0 break-all" style={{ fontSize: 11, color: C.teal, fontWeight: 700 }}>{link}</div>
                    <button onClick={async () => notify((await copyText(link)) ? "Link copied!" : "Couldn’t copy.")} aria-label="Copy link"><Copy size={18} color={C.purple} /></button>
                  </div>
                )}
              </PopCard>
            </div>
          )}

          {/* ROOMS */}
          {tab === "rooms" && (
            <div className="px-3 pb-6 pt-2 space-y-4">
              {!room ? (
                <PopCard className="overflow-hidden">
                  <Scallop color={C.pink} size={18} />
                  <div className="px-4 pt-2 pb-4">
                    <div style={{ fontFamily: DISPLAY, fontSize: 18, color: C.purple }}>Multiplayer rooms</div>
                    <div className="mt-1" style={{ fontSize: 14, lineHeight: 1.25 }}>Race your friends to link the same two stars. Fewest movies wins the bragging rights.</div>
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
                      <div className="mt-2 font-bold" style={{ fontSize: 13, color: C.teal }}>{board ? board.count : 1} player{board && board.count !== 1 ? "s" : ""} in the room. Share this code!</div>
                      <div className="mt-3 flex gap-2 justify-center">
                        <button onClick={async () => notify((await copyText(`🎞️ Join my Filmy Sneaky Link room! Code: ${room.code}\n${baseUrl()}?room=${room.code}`)) ? "Invite copied. Paste it in your chat!" : "Couldn’t copy.")} className="rounded-xl px-4 py-2 flex items-center gap-2" style={{ ...btn(C.teal), fontSize: 13 }}><Copy size={16} /> Copy invite</button>
                        <button onClick={leaveRoom} className="rounded-xl px-4 py-2 flex items-center gap-2" style={{ ...btn(C.cream, C.purple), fontSize: 13 }}><LogOut size={16} /> Leave</button>
                      </div>
                    </div>
                  </PopCard>

                  {rmeta && rmeta.round > 0 && rmeta.a && (
                    <PopCard className="p-3 text-center" tone={C.cream}>
                      <div style={{ fontFamily: DISPLAY, fontSize: 16, color: C.purple }}>Match {rmeta.round} is on! {rmeta.mode === "coop" ? "Co-op" : "Race"}</div>
                      <div className="mt-2 flex items-center justify-center gap-3">
                        <Portrait item={roomActor(rmeta.a)} size={56} />
                        <Reel size={24} spin color={C.marigold} />
                        <Portrait item={roomActor(rmeta.b)} size={56} ring={C.pink} ring2={C.marigold} />
                      </div>
                      <div className="mt-2 font-bold" style={{ fontSize: 14, lineHeight: 1.2 }}>{rmeta.a.name} to {rmeta.b.name}</div>
                      <div style={{ fontSize: 12, color: C.teal, fontWeight: 700 }}>Started by {rmeta.startedBy}. Cameos {rmeta.cameos ? "on" : "off"}, hints {rmeta.hints ? "on" : "off"}.</div>
                      {inMatch ? (
                        <button onClick={() => setTab("play")} className="mt-3 rounded-xl px-5 py-2" style={{ ...btn(C.teal), fontSize: 14 }}>{rmeta.mode === "coop" ? "Back to the shared board" : "Back to my chain"}</button>
                      ) : (
                        <button onClick={joinRound} disabled={launching} className="mt-3 rounded-xl px-5 py-2 inline-flex items-center gap-2" style={{ ...btn(C.pink), fontSize: 14 }}><Play size={16} /> {rmeta.mode === "coop" ? "Join the board" : "Join the race"}</button>
                      )}
                    </PopCard>
                  )}

                  <PopCard className="p-3">
                    <div style={{ fontFamily: DISPLAY, fontSize: 16, color: C.purple }}>Start a showdown</div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {[["coop", "Play together", "One shared board. Take turns."], ["race", "Head-to-head", "Private boards. Lowest link wins."]].map(([k, t, d]) => (
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
                        <div className="mt-2 flex items-stretch gap-2"><Slot k="a" val={pickA} /><div className="flex items-center"><Reel size={22} spin color={C.marigold} /></div><Slot k="b" val={pickB} /></div>
                        <div className="mt-2 flex items-center gap-2 rounded-xl px-3" style={{ background: "#fff", border: `3px solid ${C.teal}`, height: 48 }}>
                          <Search size={18} color={C.teal} />
                          <input value={cq} onChange={(e) => setCq(e.target.value)} placeholder={slot === "a" ? "Search the starting actor…" : "Search the target actor…"} className="flex-1 min-w-0 bg-transparent outline-none font-bold" style={{ fontSize: 16, color: C.ink }} autoComplete="off" spellCheck={false} />
                        </div>
                        {cres.length > 0 && <div className="mt-2 rounded-xl overflow-y-auto" style={{ maxHeight: 240, background: C.cream, border: `2px solid ${C.purple}` }}>{cres.map((a) => <Row key={a.id} item={a} type="actor" onClick={() => fillSlot(a)} />)}</div>}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {STARS.slice(0, 10).map((id) => (
                            <button key={id} onClick={() => fillSlot(localActor(id))} className="rounded-full px-3 py-1 font-bold" style={{ background: C.cream, color: C.purple, border: `2px solid ${C.purple}`, fontSize: 12 }}>{ACTORS[id].name.split(" ")[0]}</button>
                          ))}
                        </div>
                        <button onClick={() => (pickA && pickB ? startRound("custom", pickA, pickB) : notify("Pick a start and a target star first."))} disabled={launching} className="mt-3 w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ ...btn(C.purple), fontSize: 14 }}><Users size={17} /> Start custom {roomMode === "coop" ? "co-op" : "race"}</button>
                      </div>
                    </div>
                    <div className="mt-2" style={{ fontSize: 12 }}>The match uses your Settings: cameos {cameos ? "on" : "off"}, hints {hints ? "on" : "off"}. Everyone who joins plays by the same rules.</div>
                  </PopCard>

                  {rmeta && rmeta.mode === "coop" && rmeta.round > 0 ? (
                    <PopCard className="p-3">
                      <div style={{ fontFamily: DISPLAY, fontSize: 16, color: C.purple }}>Team chain</div>
                      <div className="mt-2 space-y-2">
                        {teamPlayers.map((p) => (
                          <BoardLine key={p.id} me={p.id === pid.current} lead={coopMode && p.id === turnId ? "🎬" : "🍿"} title={`${p.name}${p.id === pid.current ? " (you)" : ""}`}
                            sub={!coopMode ? "Join the board to play together" : p.id === turnId ? "Up next" : "Waiting for their turn"} />
                        ))}
                      </div>
                      {coopMode && <div className="mt-2 font-bold" style={{ fontSize: 13, color: C.teal }}>{movieCount} movie{movieCount === 1 ? "" : "s"} on the shared chain so far.</div>}
                    </PopCard>
                  ) : (
                    <PopCard className="p-3"><Scoreboard board={board} meId={pid.current} /></PopCard>
                  )}
                </>
              )}
            </div>
          )}

          {/* PLAY */}
          {tab === "play" && !game && (
            <div className="px-3 pt-4 pb-6">
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
                <div className="flex flex-wrap gap-2 mb-3">
                  {[...(game.room ? [`Room ${game.room.code}`, game.room.mode === "coop" ? "Co-op" : "Race"] : []), `Cameos ${cameos ? "on" : "off"}`, `Hints ${hints ? "on" : "off"}`, status].map((t) => <span key={t} className="rounded-full px-3 font-bold" style={{ background: C.teal, color: C.cream, fontSize: 11, border: `2px solid ${C.purple}` }}>{t}</span>)}
                </div>
                <FilmChain chain={game.chain} />
                {!game.won && (
                  <div className="mt-3">
                    {myTurn ? (
                      <>
                        {coopMode && <div className="mb-2 text-center"><span className="rounded-full px-3 py-1 font-bold" style={{ background: C.pink, color: C.cream, border: `2px solid ${C.purple}`, fontSize: 13 }}>Your turn!</span></div>}
                        <StepInput key={game.chain.length} type={game.chain.length % 2 === 1 ? "movie" : "actor"} prev={game.chain[game.chain.length - 1]} api={api} hints={hints} cameos={cameos} used={used} onPick={attempt} onFail={failApi} />
                      </>
                    ) : (
                      <PopCard className="p-4 text-center">
                        <div className="flex justify-center"><Reel size={44} spin color={C.marigold} /></div>
                        <div className="mt-2" style={{ fontFamily: DISPLAY, fontSize: 15, color: C.purple }}>Waiting for {turnName}…</div>
                        <div className="mt-1" style={{ fontSize: 13 }}>Their pick lands on this board the moment they lock it in.</div>
                      </PopCard>
                    )}
                  </div>
                )}
                {game.won && (
                  <PopCard className="mt-3 p-3 text-center">
                    <div style={{ fontFamily: DISPLAY, fontSize: 15, color: C.purple }}>Link complete!</div>
                    <button onClick={() => setWinOpen(true)} className="mt-2 rounded-xl px-4 py-2 inline-flex items-center gap-2" style={{ ...btn(C.pink), fontSize: 13 }}><Trophy size={16} /> Show results</button>
                  </PopCard>
                )}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button onClick={undo} disabled={game.chain.length < 2} className="rounded-xl py-3 flex items-center justify-center gap-2" style={{ ...btn(C.cream, C.purple), fontSize: 13, opacity: game.chain.length < 2 ? 0.5 : 1 }}><Undo2 size={16} /> Undo last step</button>
                  <button onClick={reset} disabled={game.chain.length < 2} className="rounded-xl py-3 flex items-center justify-center gap-2" style={{ ...btn(C.cream, C.purple), fontSize: 13, opacity: game.chain.length < 2 ? 0.5 : 1 }}><RotateCcw size={16} /> Reset chain</button>
                </div>
                {game.daily && !game.room && (
                  <button onClick={nextDaily} disabled={launching} className="mt-3 w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ ...btn(C.teal), fontSize: 14 }}>Next Challenge ➔</button>
                )}
                <div ref={endRef} style={{ height: 1 }} />
              </div>
            </div>
          )}
        </main>

        {/* tab bar */}
        <nav className="relative z-30 flex gap-2 px-3 pt-2" style={{ background: C.cream, borderTop: `3px solid ${C.purple}`, boxShadow: `0 -3px 0 ${C.marigold}`, paddingBottom: "max(env(safe-area-inset-bottom), 8px)" }}>
          {tabs.map(([k, l, Icon]) => (
            <button key={k} onClick={() => setTab(k)} aria-current={tab === k ? "page" : undefined} className="flex-1 flex flex-col items-center rounded-xl py-1" style={{ background: tab === k ? C.pink : "transparent", color: tab === k ? C.cream : C.purple }}>
              <Icon size={22} /><span className="font-bold" style={{ fontSize: 12 }}>{l}</span>
            </button>
          ))}
        </nav>

        {/* settings drawer */}
        <div className="absolute inset-0 z-50" style={{ pointerEvents: drawer ? "auto" : "none" }}>
          <div onClick={() => setDrawer(false)} className="absolute inset-0" style={{ background: "rgba(42,14,44,.62)", opacity: drawer ? 1 : 0, transition: "opacity .3s" }} />
          <aside className="absolute top-0 bottom-0 right-0 overflow-y-auto" style={{ width: "90%", maxWidth: 380, background: C.cream, borderLeft: `4px solid ${C.purple}`, boxShadow: `-4px 0 0 ${C.marigold}`, transform: drawer ? "translateX(0)" : "translateX(105%)", transition: "transform .3s ease", paddingTop: "max(env(safe-area-inset-top), 12px)" }} aria-hidden={!drawer}>
            <div className="flex items-center justify-between px-4 pb-2">
              <div style={{ fontFamily: DISPLAY, fontSize: 22, color: C.purple }}>Settings</div>
              <button onClick={() => setDrawer(false)} aria-label="Close settings" className="rounded-full flex items-center justify-center" style={{ width: 38, height: 38, border: `3px solid ${C.purple}`, background: C.cream }}><X size={18} color={C.purple} /></button>
            </div>
            <Scallop color={C.pink} flip size={16} />
            <div className="px-4 pb-8">
              <Toggle on={cameos} onChange={setCameos} label="Include cameos" desc="Off: uncredited, cameo, special or guest appearances, archive footage and himself/herself credits don’t count, and the shortest-link solver follows the same rule. Documentaries, talk shows and award shows are always out. On: every credited feature-film appearance counts." />
              <div style={{ borderTop: `2px dashed ${C.purple}55` }} />
              <Toggle on={hints} onChange={setHints} label="Dropdown hints" desc="Off: type 3+ letters for spelling help; green or red shows only after you pick. On: tap a box to see the valid movies or co-stars straight away." />
              <div style={{ borderTop: `2px dashed ${C.purple}55` }} />
              <div className="py-3">
                <div className="flex items-center gap-2" style={{ fontFamily: DISPLAY, fontSize: 15, color: C.purple }}><KeyRound size={18} /> TMDB API key</div>
                <div className="mt-1" style={{ fontSize: 13, lineHeight: 1.25 }}>{ENV_KEY ? "This app already comes with a TMDB key, so every film and actor is searchable. Paste your own here only if you want to override it. It stays on this device." : "Paste your TMDB Read Access Token or API key to search every film and actor with real posters. It stays on this device."}</div>
                <div className="mt-2 flex items-center gap-2 rounded-xl px-3" style={{ background: "#fff", border: `3px solid ${C.teal}`, height: 48 }}>
                  <input value={draft} onChange={(e) => setDraft(e.target.value)} type={showKey ? "text" : "password"} placeholder="Paste token or key" className="flex-1 min-w-0 bg-transparent outline-none font-bold" style={{ fontSize: 15, color: C.ink }} autoComplete="off" spellCheck={false} />
                  <button onClick={() => setShowKey(!showKey)} aria-label={showKey ? "Hide key" : "Show key"}>{showKey ? <EyeOff size={18} color={C.teal} /> : <Eye size={18} color={C.teal} />}</button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <button onClick={() => saveKey(draft)} className="rounded-xl py-2" style={{ ...btn(C.teal), fontSize: 13 }}>Save key</button>
                  <button onClick={() => { setDraft(""); saveKey(""); }} className="rounded-xl py-2" style={{ ...btn(C.cream, C.purple), fontSize: 13 }}>Clear</button>
                </div>
                <div className="mt-3 flex items-center gap-2 font-bold" style={{ fontSize: 13, color: tmdbState === "fail" ? C.crimson : C.teal }}>
                  {tmdbState === "checking" ? <Reel size={18} spin color={C.marigold} /> : <Film size={16} />} Source: {status}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {winOpen && game && game.won && (
          <WinModal game={game} optimal={optimal} onShare={shareResult} onClose={() => setWinOpen(false)} onAgain={() => { reset(); setWinOpen(false); }} onMenu={() => { setWinOpen(false); setTab(game.room ? "rooms" : "daily"); }} board={game.room && game.room.mode !== "coop" ? board : null} meId={pid.current} onNext={game.daily && !game.room ? nextDaily : null} />
        )}
        {scorecard && (
          <ScoreCard card={scorecard} meId={pid.current} wins={wins} onNext={nextChallenge} onRoom={() => { setScorecard(null); setTab("rooms"); }} onClose={() => setScorecard(null)} />
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
