export const DAYS_OF_WEEK_IN_ORDER = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const

export const PrivateNavLinks = [
    {
      imgURL: '/assets/events.svg',
      route: '/events',
      label: 'My Events',
    },
    {
      imgURL: '/assets/schedule.svg',
      route: '/schedule',
      label: 'My Schedule',
    },
    {
      imgURL: '/assets/public.svg',
      route: '/book',
      label: 'Public Profile',
    },
  ] as const