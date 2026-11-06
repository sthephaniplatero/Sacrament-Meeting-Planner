import type { SacramentMeeting } from './types';

const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: '2026-05-03',
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Jones',
    announcements: [
      'Ward temple night: May 10 at 7:00 PM',
      'Youth combined activity: Wednesday at 7:00 PM'
    ],
    openingHymn: { number: 2, title: 'The Spirit of God' },
    openingPrayer: 'Sister Williams',
    wardBusiness: [
      { description: 'Sustaining of new Primary president' }
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: 'In Remembrance of Thy Suffering' },
    speakers: [
      { name: 'Sister Brown', topic: 'Faith in Jesus Christ', type: 'speaker' },
      { name: 'Youth Choir', topic: 'I Will Walk with Jesus', type: 'musical-number' }
    ],
    closingHymn: { number: 31, title: 'O God, Our Help in Ages Past' },
    closingPrayer: 'Brother Davis'
  },
  {
    id: 2,
    date: '2026-05-10',
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Miller',
    announcements: [
      'Mother’s Day program today — thank you to the Primary children',
      'Relief Society service evening: Thursday at 6:30 PM'
    ],
    openingHymn: { number: 292, title: 'O My Father' },
    openingPrayer: 'Brother Anderson',
    wardBusiness: [
      { description: 'Release of Sunday School secretary with a vote of thanks' }
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 175, title: 'O God, the Eternal Father' },
    speakers: [
      { name: 'Sister Clark', topic: 'Charity Never Faileth', type: 'speaker' },
      { name: 'Primary Choir', topic: 'Love One Another', type: 'musical-number' },
      { name: 'Brother Taylor', topic: 'Honoring Righteous Examples', type: 'speaker' }
    ],
    closingHymn: { number: 294, title: 'Love at Home' },
    closingPrayer: 'Sister Thomas'
  },
  {
    id: 3,
    date: '2026-05-17',
    meetingType: 'testimony',
    presiding: 'Bishop Smith',
    conducting: 'Brother Jones',
    announcements: [
      'Stake Youth Camp registration closes May 22',
      'Missionary preparation class meets in Room 104 after the second hour'
    ],
    openingHymn: { number: 85, title: 'How Firm a Foundation' },
    openingPrayer: 'Sister Martinez',
    wardBusiness: [
      { description: 'Confirmation of newly baptized member' }
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 184, title: 'Upon the Cross of Calvary' },
    speakers: [],
    closingHymn: { number: 152, title: 'God Be with You Till We Meet Again' },
    closingPrayer: 'Brother White'
  },
  {
    id: 4,
    date: '2026-05-24',
    meetingType: 'stake',
    presiding: 'President Nelson (Stake President)',
    conducting: 'Bishop Smith',
    announcements: [
      'Stake Conference general session at the Stake Center at 10:00 AM'
    ],
    openingHymn: { number: 6, title: 'Redeemer of Israel' },
    openingPrayer: 'Brother Harris',
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 193, title: 'I Stand All Amazed' },
    speakers: [
      { name: 'Sister Lewis (Stake Relief Society President)', topic: 'Ministering with Love', type: 'speaker' },
      { name: 'Stake Choir', topic: 'Consider the Lilies', type: 'musical-number' },
      { name: 'President Nelson', topic: 'Strengthening Homes and Families', type: 'speaker' }
    ],
    closingHymn: { number: 89, title: 'The Lord Is My Light' },
    closingPrayer: 'Sister Young'
  },
  {
    id: 5,
    date: '2026-05-31',
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Miller',
    announcements: [
      'Fast Sunday next week (June 7)',
      'Ward picnic on Saturday, June 6 at 11:00 AM at Pioneer Park'
    ],
    openingHymn: { number: 116, title: 'Come, Follow Me' },
    openingPrayer: 'Brother Walker',
    wardBusiness: [
      { description: 'Sustaining of new Young Men advisers' }
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 196, title: 'Jesus, Once of Humble Birth' },
    speakers: [
      { name: 'Sister Hall', topic: 'The Power of Daily Scripture Study', type: 'speaker' },
      { name: 'Brother Allen & Sister Allen', topic: 'Abide with Me', type: 'musical-number' },
      { name: 'Bishop Smith', topic: 'Walking in the Covenant Path', type: 'speaker' }
    ],
    closingHymn: { number: 249, title: 'Called to Serve' },
    closingPrayer: 'Sister King'
  },
  {
    id: 6,
    date: '2026-10-04',
    meetingType: 'general',
    presiding: 'President Oaks',
    conducting: 'Bishop Smith',
    announcements: [
      'General Conference broadcasts at 10:00 AM and 2:00 PM'
    ],
    openingHymn: { number: 19, title: 'We Thank Thee, O God, for a Prophet' },
    openingPrayer: 'General Authority',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 170, title: 'God, Our Father, Hear Us Pray' },
    speakers: [],
    closingHymn: { number: 1, title: 'The Morning Breaks' },
    closingPrayer: 'General Authority'
  },
  {
    id: 7,
    date: '2026-11-01',
    meetingType: 'testimony',
    presiding: 'Bishop Smith',
    conducting: 'Brother Jones',
    announcements: [
      'Ward temple session: Friday at 6:30 PM',
      'Tithing settlement sign-ups available outside the clerk’s office'
    ],
    openingHymn: { number: 100, title: 'Nearer, My God, to Thee' },
    openingPrayer: 'Sister Adams',
    wardBusiness: [
      { description: 'Welcome of new ward members' }
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 173, title: 'While of These Emblems We Partake' },
    speakers: [],
    closingHymn: { number: 98, title: 'I Need Thee Every Hour' },
    closingPrayer: 'Brother Baker'
  }
];

export function getMeetings(date?: string | null): SacramentMeeting[] {
  if (date) return meetings.filter((m: SacramentMeeting) => m.date === date);
  return meetings;
}

export function getMeetingById(id: number): SacramentMeeting | null {
  return meetings.find((m: SacramentMeeting) => m.id === id) ?? null;
}
