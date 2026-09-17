const communitiesRoot = '/communities'
const community = (slug: string) => `${communitiesRoot}/${slug}`

const meRoot = '/me'
const superadminRoot = '/superadmin'

export const paths = {
  home: '/',
  login: '/login',
  register: '/register',
  exchange: '/exchange',
  privacy: '/privacy',
  terms: '/terms',

  communities: {
    root: communitiesRoot,
    detail: community,
    announcements: (slug: string) => `${community(slug)}/announcements`,
    newAnnouncement: (slug: string) =>
      `${community(slug)}/announcements/new`,
    announcement: (slug: string, id: string) =>
      `${community(slug)}/announcements/${id}`,
    events: (slug: string) => `${community(slug)}/events`,
    newEvent: (slug: string) => `${community(slug)}/events/new`,
    event: (slug: string, id: string) => `${community(slug)}/events/${id}`,
    members: (slug: string) => `${community(slug)}/members`,
    applications: (slug: string) => `${community(slug)}/applications`,
    settings: (slug: string) => `${community(slug)}/settings`,
    permissions: (slug: string) => `${community(slug)}/permissions`,

    patterns: {
      detail: `${communitiesRoot}/:slug`,
      newAnnouncement: `${communitiesRoot}/:slug/announcements/new`,
      announcement: `${communitiesRoot}/:slug/announcements/:id`,
      newEvent: `${communitiesRoot}/:slug/events/new`,
      event: `${communitiesRoot}/:slug/events/:id`,
    },

    segments: {
      announcements: 'announcements',
      events: 'events',
      members: 'members',
      applications: 'applications',
      settings: 'settings',
      permissions: 'permissions',
    },
  },

  me: {
    root: meRoot,
    edit: `${meRoot}/edit`,
    requests: `${meRoot}/requests`,
    newCommunity: `${meRoot}/communities/new`,
  },

  superadmin: {
    root: superadminRoot,
    communityRequests: `${superadminRoot}/community-requests`,
    users: `${superadminRoot}/users`,
  },
} as const
