export const paths = {
  home: '/',
  login: '/login',
  register: '/register',
  privacy: '/privacy',
  terms: '/terms',
  communities: '/communities',
  community: (slug: string) => `/communities/${slug}`,
  communityPattern: '/communities/:slug',
  announcement: (slug: string, id: string) =>
    `/communities/${slug}/announcements/${id}`,
  announcementPattern: '/communities/:slug/announcements/:id',
  event: (slug: string, id: string) => `/communities/${slug}/events/${id}`,
  eventPattern: '/communities/:slug/events/:id',
} as const
