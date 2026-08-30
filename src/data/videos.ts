/**
  * Real films from the Pixels by Santosh Vemula YouTube catalogue.
  * Titles and runtimes were read from YouTube; thumbnails come from i.ytimg.com.
  */

export type Film = {
  /** YouTube video id, or the Drive file id when source is 'drive'. */
  id: string
  title: string
  tags: string[]
  seconds: number | null
  /** Drive-hosted films thumbnail and embed differently. Defaults to YouTube. */
  source?: 'youtube' | 'drive'
}

export const films: Film[] = [
  { id: 'iKSRc_Ld2fQ', title: 'Kaitlyn and Aaron Wedding', tags: ['Wedding'], seconds: 3302 },
  { id: '6WmkbXM5sVQ', title: 'Navya Seemantham Ceremony 4K', tags: ['Seemantham'], seconds: 444 },
  { id: '-eZpbxxDUP8', title: 'Subhash and Priya Housewarming Ceremony 4k', tags: ['Housewarming'], seconds: 260 },
  { id: 'Qs5RUXw5Um0', title: 'Journey of Senthilkumar & Lakshmi 4K', tags: ['Story'], seconds: 265 },
  { id: 'BE_eudUXX4k', title: 'Dr Whitbeck Wedding', tags: ['Wedding'], seconds: 661 },
  { id: 'M_1plzVqOvQ', title: 'Ravi and Pooja House Warming Ceremony 4K', tags: ['Housewarming'], seconds: 217 },
  { id: 'EvmQ51Znblc', title: "Theju's Seemantham", tags: ['Seemantham'], seconds: 161 },
  { id: 'dMYd77GS_dI', title: 'Senthil Kumar + Lakshmi Shashtipoorthy 4K', tags: ['Ceremony'], seconds: 352 },
  // Hosted on Drive rather than YouTube; runtime is not exposed there.
  { id: '1TYINtjVHRM9JyBBWCoa4bhwGo1LuHLOi', title: 'Hasini 16th Birthday 4K', tags: ['Birthday'], seconds: null, source: 'drive' },
  { id: 'Bk7i-m04Gqg', title: 'Sundari Parichayam Full Song Filmed in USA [ Official ] Hamsaro | Shiva Sai Teja || Klapboard', tags: ['Music', 'Drone'], seconds: 390 },
  { id: 'tY1mA_U7kOw', title: 'Hamsaro Latest Telugu Short Film Trailer - Romantic and Heart Touching Love Story, Made in USA', tags: ['Short Film', 'Drone'], seconds: 136 },
  { id: 'T8sWmoYAwoI', title: 'UF ISA Holi Fest 2017', tags: ['Event', 'Promo'], seconds: 120 },
  { id: 'geIngdSgPzc', title: '352Creates', tags: ['Event', 'Promo'], seconds: 335 },
  { id: 'u3b0KpzpzPQ', title: 'For 13 Years, She has Held on to One Goal. Now, She\'s Achieving It. | #MyDailyDrive (Ep. 2)', tags: ['Bryan ISD'], seconds: 205 },
  { id: 'ueSft3u1ji0', title: 'GROW WITH US in Bryan ISD', tags: ['Commercial', 'Bryan ISD'], seconds: 114 },
  { id: 'rbedeSkzQMI', title: 'Early Learning Florida Welcome', tags: ['Promo'], seconds: 78 },
  { id: 'i2VkGyv99Cw', title: 'Bryan ISD Athletics ( Saaho Bang )', tags: ['Commercial', 'Bryan ISD'], seconds: 73 },
  { id: '0C7DFmvHK5I', title: 'Best on Key West', tags: ['Commercial'], seconds: 17 },
  { id: 'X7wzGJ9BirI', title: '#MyDailyDrive (Ep.1): Veronica Verango, Bryan High Cross Country', tags: ['Story', 'Bryan ISD'], seconds: 169 },
  { id: 'IdmBXK_KyD8', title: 'Meet Bryan ISD: Lanora Ramirez', tags: ['Story', 'Bryan ISD'], seconds: 310 },
  { id: 'kdMERcDUQCE', title: 'I Am Bryan ISD: Evelyn Beesaw', tags: ['Story', 'Bryan ISD'], seconds: 30 },
  { id: '726IRU-I_vI', title: 'Koffee Cartel', tags: ['Commercial'], seconds: 84 },
  { id: 'MCyS_xZo0wo', title: 'Mermaids in St. Augustine', tags: ['Commercial', 'Drone'], seconds: 33 },
  { id: 'xr5-Y-miRbo', title: 'A Heartfelt Message to Educators from Merrill Green', tags: ['Bryan ISD'], seconds: 122 },
  { id: 'l_KdFksH9-I', title: 'Flipping the Tassel: The Bryan ISD Class of 2019', tags: ['Story', 'Bryan ISD'], seconds: 113 },
  { id: '54mlBHFFh74', title: 'Fine Arts', tags: ['Commercial', 'Bryan ISD'], seconds: 99 },
  { id: 'ky4och-nxDE', title: '2020 Bryan ISD District-Wide Showcase', tags: ['Event', 'Bryan ISD'], seconds: 30 },
  { id: 'QL3ciYepv6s', title: 'Bryan CTEC: The Future Workforce of the Brazos Valley & Beyond', tags: ['Promo', 'Bryan ISD'], seconds: 176 },
  { id: 'n2WZap4rViE', title: 'Bryan ISD PreK is Amazing!', tags: ['Promo', 'Bryan ISD'], seconds: 184 },
  { id: 'MtTxMuPIAhE', title: 'The New CTE Center', tags: ['Promo', 'Bryan ISD'], seconds: 42 },
  { id: 'gH6rAGyvSYU', title: 'aggieTERM - A "Game-Changing" Texas A&M/Bryan ISD Teacher Partnership', tags: ['Promo', 'Bryan ISD'], seconds: 210 },
  { id: 'Qaz1zpo0tVw', title: 'Happy Holidays from Bryan ISD, 2017-18!', tags: ['Promo', 'Bryan ISD'], seconds: 44 },
  { id: 'XiCcsW0jsLI', title: 'Artsy Abode St. Augustine Store Tour', tags: ['Commercial'], seconds: 122 },
  { id: 'BXkv5Et9iZs', title: 'Lake Alice Thank you', tags: ['Promo'], seconds: 127 },
  { id: 'VIkKaHExohY', title: 'Lab Daze Intro - University of Florida', tags: ['Commercial'], seconds: 19 },
  { id: 'IkLAMSdo_hE', title: 'Transitional age of color cinema', tags: ['Informational'], seconds: 300 },
  { id: 'QSRdFaPNYxc', title: 'Behind the Scenes', tags: ['Short Film'], seconds: 291 },
  { id: 'xvaza1EcAjw', title: 'Be Minor (Directed by Joshua Evangelista)', tags: ['Short Film'], seconds: 661 },
  { id: 'GXLjXOheN8Y', title: 'MiLady Lyrical Video || Vihari Musical || Tan Entertainers', tags: ['Music'], seconds: 217 },
  { id: '9wxYz9lFN7o', title: 'Bryan Career & Technical Education Complex', tags: ['Promo', 'Bryan ISD'], seconds: 36 },
  { id: 'GNL8pAhvb_w', title: '#WorkEthicMatters: Paige Perrone', tags: ['Story', 'Bryan ISD'], seconds: 92 },
  { id: 'QZr9wyTxWdw', title: 'Explore Academy at Ross Elementary in Bryan ISD', tags: ['Promo', 'Bryan ISD'], seconds: 30 },
  { id: 'Vi1yU7ZnIi4', title: 'Jones Elementary Teacher Sally Ryan\'s Story', tags: ['Story', 'Bryan ISD'], seconds: 130 },
  { id: 'j42Ip25VfWs', title: 'Rayburn Intermediate School Principal Justin Smith\'s Story', tags: ['Story', 'Bryan ISD'], seconds: 143 },
  { id: 'orQvQJkC5JU', title: 'Project Lead the Way at Rudder High School in Bryan ISD', tags: ['Promo', 'Bryan ISD'], seconds: 178 },
  { id: 'R1v8e__x_ls', title: 'Students Learning Cool Things: Ep. 2: Augmented Reality', tags: ['Story', 'Bryan ISD'], seconds: 52 },
  { id: '5J1WsAe5j2c', title: 'What\'s in a Teacher\'s Job Description?', tags: ['Story', 'Bryan ISD'], seconds: 507 },
  { id: 'Ocfqn1Q42G0', title: 'I Am Bryan ISD: Kane Alvarado', tags: ['Story', 'Bryan ISD'], seconds: null },
  { id: 'AMD-iGL5U9s', title: 'BB&T presents the Bryan ISD Teachers of the Month - Oct. 2017', tags: ['Story', 'Bryan ISD'], seconds: 311 },
  { id: 'NnNorOwTVqs', title: 'The Story of My Photo - Jennifer Gonzales (Ep. 1)', tags: ['Story', 'Bryan ISD'], seconds: 92 },
  { id: 'n9ouEOJ5pkY', title: 'Sandeep Application HUGE', tags: ['Story'], seconds: 60 },
]

/** The four that lead the "Watch Our Stories" strip: one per core service. */
export const featuredFilms = films.slice(0, 4)
