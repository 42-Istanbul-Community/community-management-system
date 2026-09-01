const communitiesRoot = '/communities'
const community = (slug: string) => `${communitiesRoot}/${slug}`

export const paths = {
  home: '/',
  login: '/login',
  register: '/register',
  privacy: '/privacy',
  terms: '/terms',

  communities: {
    root: communitiesRoot,
    detail: community,
    announcements: (slug: string) => `${community(slug)}/announcements`,
    announcement: (slug: string, id: string) =>
      `${community(slug)}/announcements/${id}`,
    events: (slug: string) => `${community(slug)}/events`,
    event: (slug: string, id: string) => `${community(slug)}/events/${id}`,
    members: (slug: string) => `${community(slug)}/members`,
    applications: (slug: string) => `${community(slug)}/applications`,
    settings: (slug: string) => `${community(slug)}/settings`,
  },

  patterns: {
    community: '/communities/:slug',
    announcement: '/communities/:slug/announcements/:id',
    event: '/communities/:slug/events/:id',
  },
} as const
