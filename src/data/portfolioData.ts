// Edit this file to update all website content.
// Sections with empty arrays are hidden automatically.

export const profile = {
  name: 'Syed Saeed Al Sefat',
  tagline: 'Officer Cadet',
  taglines: {
    maritime: 'Officer Cadet',
    cyber: 'Cyber Security Specialist',
  },
  bio: 'Officer Cadet with MISC Berhad, developing professional seamanship and discipline at sea while building expertise in cyber security. I combine the structure of the maritime industry with a growing technical skillset to help protect critical digital systems.',
  // Shown in the Profile section depending on the active mode
  bios: {
    maritime:
      'Officer Cadet with MISC Berhad, developing professional seamanship and discipline at sea while building expertise in cyber security. I combine the structure of the maritime industry with a growing technical skillset to help protect critical digital systems.',
    cyber:
      'Aspiring cyber security professional pursuing a Professional Diploma in Cyber Security at Arena Web Security. I bring the discipline, attention to detail and sense of responsibility of a merchant navy cadet to protecting networks, systems and critical digital infrastructure.',
  },
  logos: {
    maritime: { src: '/images/misc-logo.png', alt: 'MISC Berhad' },
    cyber: { src: '/images/aws-logo.png', alt: 'Arena Web Security' },
  },
  profileImage: '/images/profile.png',
  profileImages: {
    maritime: '/images/profile-maritime.png',
    cyber: '/images/profile.png',
  },
  companyLogo: '/images/misc-logo.png',
  company: 'MISC Berhad',
  email: 'syedsaeedal.sefat@gmail.com',
  whatsapp: '+8801972657825',
  socials: {
    linkedin: '',
    github: '',
  },
}

export const identities = {
  maritime: {
    label: 'Merchant Navy',
    headline: 'Officer Cadet · MISC Berhad',
    description: 'Training at sea with MISC Berhad.',
  },
  cyber: {
    label: 'Cyber Security',
    headline: 'Professional Diploma',
    description: 'Arena Web Security, 2026 – 2027.',
  },
}

export const profileEducation = {
  maritime: [
    {
      degree: 'Diploma in Nautical Science (OOW)',
      institution: 'Akademi Laut Malaysia',
      years: '2025 – Present',
    },
  ],
  cyber: [
    {
      degree: 'Professional Diploma in Cyber Security',
      institution: 'Arena Web Security',
      years: '2026 – Present',
    },
  ],
}

export const academics: {
  degree: string
  institution: string
  result: string
  years: string
  url: string
  displayUrl: string
  previewImage: string
}[] = [
  {
    degree: 'Diploma in Nautical Science (OOW)',
    institution: 'Akademi Laut Malaysia',
    result: '',
    years: '2025 – Present',
    url: 'https://www.alam.edu.my',
    displayUrl: 'www.alam.edu.my',
    previewImage: '/images/site-alam.jpg',
  },
  {
    degree: 'Professional Diploma in Cyber Security',
    institution: 'Arena Web Security',
    result: '',
    years: '2026 – Present',
    url: 'https://www.arenawebsecurity.edu.bd',
    displayUrl: 'https://www.arenawebsecurity.edu.bd',
    previewImage: '/images/site-aws.jpg',
  },
  {
    degree: 'Higher Secondary Certificate (HSC)',
    institution: 'Adamjee Cantonment College',
    result: 'GPA 5.00',
    years: '2024',
    url: 'https://www.acc.edu.bd',
    displayUrl: 'www.acc.edu.bd',
    previewImage: '/images/site-acc.jpg',
  },
  {
    degree: 'Secondary School Certificate (SSC)',
    institution: 'Nirhor Cantonment Public School & College',
    result: 'GPA 5.00',
    years: '2022',
    url: 'https://www.ncpsc.edu.bd',
    displayUrl: 'www.ncpsc.edu.bd',
    previewImage: '/images/site-ncpsc.jpg',
  },
]

// Skills are hidden until you fill these in.
export const skills = {
  maritime: [] as string[],
  cyber: [] as string[],
  soft: [] as string[],
}

export const achievements: { title: string; description: string; year: string }[] = [
  {
    title: 'Gold Medal',
    description: 'Bangladesh National Taekwondo Championship',
    year: '2023',
  },
]

export const gallery: {
  src: string
  title: string
  caption: string
  /** hidden when Cyber Security mode is active */
  maritimeOnly?: boolean
}[] = [
  {
    src: '/images/gallery/polaris-visit.jpg',
    title: 'Ship Visit – MV POLARIS',
    maritimeOnly: true,
    caption: 'Onboard familiarisation during an official ship visit to MV POLARIS.',
  },
  {
    src: '/images/gallery/firefighting.jpg',
    title: 'Firefighting Training',
    maritimeOnly: true,
    caption: 'Practical firefighting and breathing apparatus training at the Akademi Laut Malaysia Smoke House.',
  },
  {
    src: '/images/gallery/semester-end.jpg',
    title: 'End of 2nd Semester',
    maritimeOnly: true,
    caption: 'Cadet cohort photograph at Akademi Laut Malaysia marking the completion of the second semester.',
  },
  {
    src: '/images/gallery/hsc-farewell.jpg',
    title: 'Goodbye Adamjee',
    caption: 'Batch photograph at Adamjee Cantonment College upon completion of the Higher Secondary Certificate.',
  },
  {
    src: '/images/gallery/band-commander.jpg',
    title: 'Band Commander',
    caption: 'Led the school band as Band Commander at Nirjhor Cantonment Public School & College.',
  },
]

export const extraCurricular: { title: string; description: string }[] = []

// HUD stats shown in the hero
export const stats = [
  { label: 'Gold Medal', value: '2023' },
  { label: 'SSC GPA', value: '5.00' },
  { label: 'HSC GPA', value: '5.00' },
]

export const navLinks = [
  { id: 'about', label: 'Profile' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'academics', label: 'Academics' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'extra', label: 'Activities' },
  { id: 'contact', label: 'Contact' },
]
