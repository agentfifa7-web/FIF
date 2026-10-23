// Feuilles de match officielles de la Ligue de Football Professionnel (LFP),
// saison 2026-2027, transmises par la FIF : compositions (titulaires et
// remplaçants, numéros, capitaines, gardiens), entraîneurs et officiels.
// Les noms sont repris tels qu'écrits sur les feuilles (casse normalisée, sans
// ajout d'accents). Ces feuilles ne portent pas le score : les résultats
// restent ceux publiés par ailleurs (voir realLigue1Matches).

export interface OfficialSheetPlayer {
  name: string
  number?: number
  starter: boolean
  captain?: boolean
  goalkeeper?: boolean
}

export interface OfficialSheetSide {
  players: OfficialSheetPlayer[]
  coach?: string
}

export interface OfficialSheetOfficials {
  commissioner?: string
  referee: string
  assistants: string[]
  fourthOfficial?: string
}

export interface OfficialMatchSheet {
  date: string
  time?: string
  venue?: string
  home: OfficialSheetSide
  away: OfficialSheetSide
  officials?: OfficialSheetOfficials
  sheetSource: string
}

export const OFFICIAL_MATCH_SHEETS: Record<string, OfficialMatchSheet> = {
  "l2-j3-africa-sports-sc-gagnoa": {
    "date": "2026-10-17",
    "time": "18:00",
    "venue": "Stade Robert Champroux, Marcory",
    "home": {
      "players": [
        {
          "name": "Bazemo Yves",
          "number": 16,
          "starter": true,
          "goalkeeper": true
        },
        {
          "name": "N’Gouan Ruffin",
          "number": 3,
          "starter": true,
          "captain": true
        },
        {
          "name": "Affi Agnimel",
          "number": 5,
          "starter": true
        },
        {
          "name": "Coulibaly Youbah",
          "number": 12,
          "starter": true
        },
        {
          "name": "Baby Lacina",
          "number": 13,
          "starter": true
        },
        {
          "name": "Koffi N’Dah",
          "number": 14,
          "starter": true
        },
        {
          "name": "Toure Aboubacar",
          "number": 15,
          "starter": true
        },
        {
          "name": "Bamba Youssouf",
          "number": 19,
          "starter": true
        },
        {
          "name": "Konan Yao Niace",
          "number": 20,
          "starter": true
        },
        {
          "name": "Traore Mamadou",
          "number": 26,
          "starter": true
        },
        {
          "name": "Zie Yohou Boris",
          "number": 28,
          "starter": true
        },
        {
          "name": "Groguhe Patrick",
          "number": 29,
          "starter": false,
          "goalkeeper": true
        },
        {
          "name": "Legbo Yanick",
          "number": 4,
          "starter": false
        },
        {
          "name": "Diakite Flayoro",
          "number": 6,
          "starter": false
        },
        {
          "name": "Daren Ekaza",
          "number": 10,
          "starter": false
        },
        {
          "name": "Tieffing Alves",
          "number": 11,
          "starter": false
        },
        {
          "name": "Gueni Lana",
          "number": 22,
          "starter": false
        },
        {
          "name": "Zahui Joe",
          "number": 31,
          "starter": false
        },
        {
          "name": "Mae Teddy",
          "number": 25,
          "starter": false
        },
        {
          "name": "Toure Lancine",
          "number": 27,
          "starter": false
        }
      ]
    },
    "away": {
      "players": [
        {
          "name": "Djehani Yao",
          "number": 30,
          "starter": true,
          "goalkeeper": true
        },
        {
          "name": "Goua Mahan M.",
          "number": 4,
          "starter": true,
          "captain": true
        },
        {
          "name": "Diarrassouba Nabyl",
          "number": 2,
          "starter": true
        },
        {
          "name": "Zebre Yann",
          "number": 17,
          "starter": true
        },
        {
          "name": "Mansou Kouakou",
          "number": 25,
          "starter": true
        },
        {
          "name": "Lingane Issoumaila",
          "number": 42,
          "starter": true
        },
        {
          "name": "Aka Essis B.",
          "number": 5,
          "starter": true
        },
        {
          "name": "Nguessan Moise",
          "number": 10,
          "starter": true
        },
        {
          "name": "Karamoko Sinare",
          "number": 22,
          "starter": true
        },
        {
          "name": "Yao Kouame",
          "number": 20,
          "starter": true
        },
        {
          "name": "Gonazo Bi Ya T.",
          "number": 13,
          "starter": true
        },
        {
          "name": "Kouame Kouadio",
          "number": 45,
          "starter": false,
          "goalkeeper": true
        },
        {
          "name": "Bamba Obou",
          "number": 28,
          "starter": false
        },
        {
          "name": "Yaba Adjitin",
          "number": 16,
          "starter": false
        },
        {
          "name": "Kanga Samuel",
          "number": 8,
          "starter": false
        },
        {
          "name": "N’Guessan Konan",
          "number": 26,
          "starter": false
        },
        {
          "name": "Kone Souleymane",
          "number": 27,
          "starter": false
        },
        {
          "name": "Diarrassouba Abdoul",
          "number": 7,
          "starter": false
        },
        {
          "name": "Traore Ibrahim",
          "number": 77,
          "starter": false
        },
        {
          "name": "Kone Baky S.",
          "number": 29,
          "starter": false
        }
      ]
    },
    "sheetSource": "Feuille de match officielle LFP (Ligue 2, 3e journée, 17/10/2026, Stade Robert Champroux, 18h00)."
  },
  "l1-j3-co-korhogo-us-tchologo": {
    "date": "2026-10-12",
    "venue": "Stade Amadou Gon Coulibaly, Korhogo",
    "home": {
      "players": [
        {
          "name": "Mohamed Gbane",
          "number": 22,
          "starter": true,
          "goalkeeper": true
        },
        {
          "name": "Djibril Traore",
          "number": 19,
          "starter": true,
          "captain": true
        },
        {
          "name": "Kouame Kan Steven",
          "number": 18,
          "starter": true
        },
        {
          "name": "Yao Serge Eric",
          "number": 28,
          "starter": true
        },
        {
          "name": "Ibrahim Diaby",
          "number": 25,
          "starter": true
        },
        {
          "name": "Beugre Martin",
          "number": 33,
          "starter": true
        },
        {
          "name": "Adje Laurent",
          "number": 8,
          "starter": true
        },
        {
          "name": "Moustapha Ibrahim",
          "number": 2,
          "starter": true
        },
        {
          "name": "Tra Landry Voli Bi",
          "number": 17,
          "starter": true
        },
        {
          "name": "Tizie Hermann",
          "number": 20,
          "starter": true
        },
        {
          "name": "Ali Namory",
          "number": 12,
          "starter": true
        },
        {
          "name": "Abd-Laaaziz Sambaou",
          "number": 1,
          "starter": false,
          "goalkeeper": true
        },
        {
          "name": "Sitionan Abdramane",
          "number": 13,
          "starter": false
        },
        {
          "name": "Ismail Ramadan",
          "number": 27,
          "starter": false
        },
        {
          "name": "Marc Andre Michel",
          "number": 7,
          "starter": false
        },
        {
          "name": "Karl Olivier Badjo",
          "number": 15,
          "starter": false
        },
        {
          "name": "Kassinibin Adama",
          "number": 9,
          "starter": false
        },
        {
          "name": "Alassane Zeba",
          "number": 10,
          "starter": false
        },
        {
          "name": "Blaty Mohamed",
          "number": 24,
          "starter": false
        },
        {
          "name": "Ephrem Cedrick",
          "number": 29,
          "starter": false
        }
      ],
      "coach": "Dao Lacina"
    },
    "away": {
      "players": [
        {
          "name": "Moussa Traore",
          "number": 22,
          "starter": true,
          "goalkeeper": true
        },
        {
          "name": "Yao Benoit",
          "number": 2,
          "starter": true,
          "captain": true
        },
        {
          "name": "Diarra Seydou",
          "number": 3,
          "starter": true
        },
        {
          "name": "N’Guessan Fabrice",
          "number": 12,
          "starter": true
        },
        {
          "name": "Abdoul Aziz",
          "number": 6,
          "starter": true
        },
        {
          "name": "Gome Fabrice",
          "number": 3,
          "starter": true
        },
        {
          "name": "Abdoulaye Soumahoro",
          "number": 18,
          "starter": true
        },
        {
          "name": "Alou Diarra",
          "number": 8,
          "starter": true
        },
        {
          "name": "Sangare Rahim",
          "number": 27,
          "starter": true
        },
        {
          "name": "Ahouo Michel",
          "number": 11,
          "starter": true
        },
        {
          "name": "Zouhoule Elvis",
          "number": 20,
          "starter": true
        },
        {
          "name": "Arthur Gah",
          "number": 33,
          "starter": false,
          "goalkeeper": true
        },
        {
          "name": "Catana Aziz Yeo",
          "number": 15,
          "starter": false
        },
        {
          "name": "Kassoum Camara",
          "number": 7,
          "starter": false
        },
        {
          "name": "Khalil Diakite",
          "number": 26,
          "starter": false
        },
        {
          "name": "Kanga Brice",
          "number": 21,
          "starter": false
        },
        {
          "name": "Kosse Lancine",
          "number": 13,
          "starter": false
        },
        {
          "name": "Abdoul Doumbia",
          "number": 14,
          "starter": false
        },
        {
          "name": "Jean Marco Koffi",
          "number": 10,
          "starter": false
        },
        {
          "name": "Ben Hassan Tidiane",
          "number": 28,
          "starter": false
        }
      ],
      "coach": "Monkeh Zouh Sow"
    },
    "officials": {
      "commissioner": "Traore Maxime",
      "referee": "Kpan Clement",
      "assistants": [
        "N’Go Adou Hermann",
        "Ouattara Mifanakatcha"
      ],
      "fourthOfficial": "Dao Mohamed"
    },
    "sheetSource": "Feuille de match officielle LFP (Ligue 1 LONACI, 3e journée, 12/10/2026, Stade Amadou Gon Coulibaly de Korhogo)."
  },
  "l1-j2-asec-mimosas-stella-club": {
    "date": "2026-10-04",
    "time": "15:30",
    "venue": "Stade Olympique Alassane Ouattara (Ebimpé)",
    "home": {
      "players": [
        {
          "name": "Folly Ayayi Charles",
          "number": 21,
          "starter": true,
          "goalkeeper": true
        },
        {
          "name": "Maiga Koimizo Abass",
          "number": 13,
          "starter": true,
          "captain": true
        },
        {
          "name": "Atte Youssifou",
          "number": 25,
          "starter": true
        },
        {
          "name": "Ble Kouassi",
          "number": 4,
          "starter": true
        },
        {
          "name": "Zouzou Franck Carlos",
          "number": 26,
          "starter": true
        },
        {
          "name": "Yabre Mohamed Ali",
          "number": 2,
          "starter": true
        },
        {
          "name": "Sou Olivier D’Avilla",
          "number": 20,
          "starter": true
        },
        {
          "name": "Guei Semelo",
          "number": 6,
          "starter": true
        },
        {
          "name": "Gobehi Cedric",
          "number": 37,
          "starter": true
        },
        {
          "name": "Kouyate Ben Guel",
          "number": 19,
          "starter": true
        },
        {
          "name": "Bakare Kevin Ouato",
          "number": 9,
          "starter": true
        },
        {
          "name": "Zombra Ousmane",
          "number": 40,
          "starter": false,
          "goalkeeper": true
        },
        {
          "name": "Godo Othiniel",
          "number": 18,
          "starter": false
        },
        {
          "name": "Lasm Aime Guy",
          "number": 23,
          "starter": false
        },
        {
          "name": "Oulare Hibrahime",
          "number": 31,
          "starter": false
        },
        {
          "name": "Koutou Ziega",
          "number": 32,
          "starter": false
        },
        {
          "name": "Zadi Zokou Benito",
          "number": 35,
          "starter": false
        },
        {
          "name": "Gnahore Dakaud",
          "number": 36,
          "starter": false
        },
        {
          "name": "Zouzoua Josue C.",
          "number": 39,
          "starter": false
        },
        {
          "name": "Koffi Brou David",
          "number": 11,
          "starter": false
        }
      ],
      "coach": "Julien Chevalier"
    },
    "away": {
      "players": [
        {
          "name": "Yoro Zigui Christian",
          "number": 1,
          "starter": true,
          "goalkeeper": true
        },
        {
          "name": "Traore Issif",
          "number": 6,
          "starter": true
        },
        {
          "name": "Gnizako Djolo Armel",
          "number": 4,
          "starter": true
        },
        {
          "name": "Diabagate Aboubakar",
          "number": 5,
          "starter": true
        },
        {
          "name": "Conde Soriba",
          "number": 2,
          "starter": true
        },
        {
          "name": "Kone Nama Aziz",
          "number": 18,
          "starter": true
        },
        {
          "name": "Tia Sonhonty Berenger",
          "number": 19,
          "starter": true
        },
        {
          "name": "Yeo Abdramane",
          "number": 22,
          "starter": true
        },
        {
          "name": "Goh Guei Richmond",
          "number": 27,
          "starter": true
        },
        {
          "name": "Diarrassouba Drissa",
          "number": 28,
          "starter": true
        },
        {
          "name": "Kpea Yann Diessi",
          "number": 29,
          "starter": true
        },
        {
          "name": "Meite Yaya Ladio",
          "number": 16,
          "starter": false,
          "goalkeeper": true
        },
        {
          "name": "Ahyee Rayann",
          "number": 3,
          "starter": false
        },
        {
          "name": "Zorom Sirima Aziz Kevin",
          "number": 7,
          "starter": false
        },
        {
          "name": "Traore Cheick Mohamed",
          "number": 8,
          "starter": false
        },
        {
          "name": "Keita Lancine",
          "number": 10,
          "starter": false
        },
        {
          "name": "Guessou Christ Aime",
          "number": 12,
          "starter": false
        },
        {
          "name": "Kone Samba",
          "number": 14,
          "starter": false
        },
        {
          "name": "Kone Abou Beco",
          "number": 15,
          "starter": false
        },
        {
          "name": "Kone Isaac Abraham",
          "number": 21,
          "starter": false
        }
      ],
      "coach": "Rigo Gervais"
    },
    "officials": {
      "commissioner": "Gohi Marc",
      "referee": "Kpan Clement",
      "assistants": [
        "N’Goh Adou",
        "Yeo Nanga Abel"
      ],
      "fourthOfficial": "Konan Akissi Natacha"
    },
    "sheetSource": "Feuille de match officielle LFP (Ligue 1, 2e journée, 04/10/2026, Stade Alassane Ouattara d’Ebimpé, 15h30)."
  },
  "l1-j2-fc-mouna-yakro-fc": {
    "date": "2026-10-06",
    "time": "15:30",
    "venue": "Complexe sportif de Bingerville",
    "home": {
      "players": [
        {
          "name": "Camara Tidiane",
          "number": 1,
          "starter": true,
          "goalkeeper": true
        },
        {
          "name": "Amza Junior Kabre",
          "number": 20,
          "starter": true,
          "captain": true
        },
        {
          "name": "Kone Samba",
          "number": 3,
          "starter": true
        },
        {
          "name": "Fondio Adama",
          "number": 33,
          "starter": true
        },
        {
          "name": "Binate Moussa Ben H.",
          "number": 27,
          "starter": true
        },
        {
          "name": "Aka Yao Olivier Astrid",
          "number": 2,
          "starter": true
        },
        {
          "name": "Bohui Ulrich Tresor Y.",
          "number": 5,
          "starter": true
        },
        {
          "name": "Toure Ismael",
          "number": 18,
          "starter": true
        },
        {
          "name": "Aka Jean Louis David",
          "number": 14,
          "starter": true
        },
        {
          "name": "Toure Lamine",
          "number": 9,
          "starter": true
        },
        {
          "name": "Assi N’Cho Junior",
          "number": 25,
          "starter": true
        },
        {
          "name": "Tra Bi Christ Olivares",
          "number": 30,
          "starter": false,
          "goalkeeper": true
        },
        {
          "name": "Souleymane Ouattara",
          "number": 10,
          "starter": false
        },
        {
          "name": "N’Guessan Stane Dou",
          "number": 22,
          "starter": false
        },
        {
          "name": "Cisse Abdoul Razack",
          "number": 17,
          "starter": false
        },
        {
          "name": "Koffi Kouakou Jean Luc",
          "number": 19,
          "starter": false
        },
        {
          "name": "Serele Axel",
          "number": 26,
          "starter": false
        },
        {
          "name": "Diomande Abdoul",
          "number": 6,
          "starter": false
        },
        {
          "name": "Diby Bi Duvan Jean Marc",
          "number": 34,
          "starter": false
        },
        {
          "name": "Irie Bi Tra Junior",
          "number": 31,
          "starter": false
        }
      ],
      "coach": "N’Dri Koffi Romaric"
    },
    "away": {
      "players": [
        {
          "name": "Kone Zoumana",
          "number": 16,
          "starter": true,
          "goalkeeper": true
        },
        {
          "name": "N’Goran Dima",
          "number": 6,
          "starter": true,
          "captain": true
        },
        {
          "name": "Dia Wah Mickael",
          "number": 3,
          "starter": true
        },
        {
          "name": "Dione Papa",
          "number": 4,
          "starter": true
        },
        {
          "name": "Doumbia Mory",
          "number": 7,
          "starter": true
        },
        {
          "name": "Gbakagnan Jonathan",
          "number": 8,
          "starter": true
        },
        {
          "name": "Sangare Daouda",
          "number": 11,
          "starter": true
        },
        {
          "name": "Sougue Moustapha",
          "number": 12,
          "starter": true
        },
        {
          "name": "N’Guessan Elvis",
          "number": 18,
          "starter": true
        },
        {
          "name": "Diomande Jaures",
          "number": 19,
          "starter": true
        },
        {
          "name": "Kone Verrati",
          "number": 22,
          "starter": true
        },
        {
          "name": "Konate Bouba",
          "number": 1,
          "starter": false,
          "goalkeeper": true
        },
        {
          "name": "Traore Daouda",
          "number": 2,
          "starter": false
        },
        {
          "name": "Afful Seedorf",
          "number": 10,
          "starter": false
        },
        {
          "name": "Diallo Idrissa",
          "number": 13,
          "starter": false
        },
        {
          "name": "Kouassi Franck",
          "number": 20,
          "starter": false
        },
        {
          "name": "Diarrassouba Cheick",
          "number": 24,
          "starter": false
        },
        {
          "name": "Youssouf Gidami",
          "number": 26,
          "starter": false
        },
        {
          "name": "Kone Aziz",
          "number": 27,
          "starter": false
        },
        {
          "name": "De La Celle Jean",
          "number": 29,
          "starter": false
        }
      ],
      "coach": "Bruno Rohart"
    },
    "officials": {
      "commissioner": "Lohoues Essis Roger",
      "referee": "Toure Anthony P.",
      "assistants": [
        "Koutou Kassi",
        "Oussou Kouadio Thierry"
      ],
      "fourthOfficial": "Ehui Wahon Odilonne"
    },
    "sheetSource": "Feuille de match officielle LFP (Ligue 1, 2e journée, 06/10/2026, Complexe de Bingerville, 15h30)."
  },
  "l1-j3-ofc-adiake-zoman-fc": {
    "date": "2026-10-12",
    "time": "15:30",
    "venue": "CNTF de Bingerville",
    "home": {
      "players": [
        {
          "name": "Kouassi Christ Yannick",
          "number": 1,
          "starter": true,
          "goalkeeper": true
        },
        {
          "name": "Sonzai Desire Bienvenu",
          "number": 17,
          "starter": true,
          "captain": true
        },
        {
          "name": "Toure Cheick Lamzi",
          "number": 8,
          "starter": true
        },
        {
          "name": "Ekua Enan Saman Jean C.",
          "number": 12,
          "starter": true
        },
        {
          "name": "Diabate Ben Siriki",
          "number": 6,
          "starter": true
        },
        {
          "name": "Ouattara Inza Ramzy",
          "number": 20,
          "starter": true
        },
        {
          "name": "Koffi Kouassi Christ Bazo",
          "number": 10,
          "starter": true
        },
        {
          "name": "Solou Narcisse Christ R.",
          "number": 27,
          "starter": true
        },
        {
          "name": "Ouattara Bourahima",
          "number": 24,
          "starter": true
        },
        {
          "name": "Dousse Kodjo",
          "number": 22,
          "starter": true
        },
        {
          "name": "Amontchi Tanon Andre",
          "number": 15,
          "starter": true
        },
        {
          "name": "Koko Paul Navas Malvine",
          "number": 23,
          "starter": false,
          "goalkeeper": true
        },
        {
          "name": "Gompou Anselme Romaric",
          "number": 25,
          "starter": false
        },
        {
          "name": "Paha Fabrice Junior",
          "number": 14,
          "starter": false
        },
        {
          "name": "Sangare Ibrahim Khalil",
          "number": 18,
          "starter": false
        },
        {
          "name": "Traore Sory",
          "number": 11,
          "starter": false
        },
        {
          "name": "Msalhi Abdel Aziz",
          "number": 19,
          "starter": false
        },
        {
          "name": "Bolagbenti Arouna",
          "number": 28,
          "starter": false
        }
      ],
      "coach": "Kore Fred Arnaud"
    },
    "away": {
      "players": [
        {
          "name": "Seydou Alison B.",
          "number": 40,
          "starter": true,
          "goalkeeper": true
        },
        {
          "name": "Hamed Marius A",
          "number": 4,
          "starter": true,
          "captain": true
        },
        {
          "name": "Kouassi Yves N’Dri",
          "number": 22,
          "starter": true
        },
        {
          "name": "Gaoussou Dosso",
          "number": 13,
          "starter": true
        },
        {
          "name": "Mohamed Sangare",
          "number": 31,
          "starter": true
        },
        {
          "name": "Droundje Yeregbe Joel",
          "number": 27,
          "starter": true
        },
        {
          "name": "Phamien Chris Blao",
          "number": 6,
          "starter": true
        },
        {
          "name": "Romuald Carlos Koffi Sodji",
          "number": 29,
          "starter": true
        },
        {
          "name": "Tre Degrange Akowanou",
          "number": 19,
          "starter": true
        },
        {
          "name": "Songui Marc Arsene Glao",
          "number": 3,
          "starter": true
        },
        {
          "name": "Abdel Kader Diomande",
          "number": 20,
          "starter": true
        },
        {
          "name": "Mamadou Sylla",
          "number": 30,
          "starter": false,
          "goalkeeper": true
        },
        {
          "name": "Djollo Brice Gogo",
          "number": 14,
          "starter": false
        },
        {
          "name": "Vamoussa Bamba",
          "number": 18,
          "starter": false
        },
        {
          "name": "Mohamed Gueu",
          "number": 9,
          "starter": false
        },
        {
          "name": "Thierno Mamadou",
          "number": 2,
          "starter": false
        },
        {
          "name": "Ahmed Traore",
          "number": 16,
          "starter": false
        },
        {
          "name": "Madou Ange Junior",
          "number": 28,
          "starter": false
        },
        {
          "name": "Bi Boti Herve Evan",
          "number": 10,
          "starter": false
        },
        {
          "name": "Israel Jean Fidele",
          "number": 11,
          "starter": false
        }
      ],
      "coach": "Desire Djike"
    },
    "officials": {
      "commissioner": "Diakite Brahima",
      "referee": "Biro Kouassi",
      "assistants": [
        "Yeo Nanga Abel",
        "Kouko Enock"
      ],
      "fourthOfficial": "Kone Guy Serge"
    },
    "sheetSource": "Feuille de match officielle LFP (Ligue 1, 3e journée, 12/10/2026, CNTF de Bingerville, 15h30)."
  }
}
