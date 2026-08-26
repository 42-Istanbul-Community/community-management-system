export const paths = {
  home: '/',
  login: '/login',
  register: '/register',
  privacy: '/privacy',
  terms: '/terms',
  communities: '/communities',

  community: (slug: string) => `/communities/${slug}`,
  communityPattern: '/communities/:slug',

  communityAnnouncements: (slug: string) =>
    `/communities/${slug}/announcements`,
  communityEvents: (slug: string) => `/communities/${slug}/events`,
  communityMembers: (slug: string) => `/communities/${slug}/members`,
  communityApplications: (slug: string) => `/communities/${slug}/applications`,
  communitySettings: (slug: string) => `/communities/${slug}/settings`,

  announcement: (slug: string, id: string) =>
    `/communities/${slug}/announcements/${id}`,
  announcementPattern: '/communities/:slug/announcements/:id',
  event: (slug: string, id: string) => `/communities/${slug}/events/${id}`,
  eventPattern: '/communities/:slug/events/:id',
} as const
