export const paths = {
  home: '/',
  login: '/login',
  register: '/register',
  privacy: '/privacy',
  terms: '/terms',
  communities: '/communities',
  community: (slug: string) => `/communities/${slug}`,
  communityPattern: '/communities/:slug',
} as const
