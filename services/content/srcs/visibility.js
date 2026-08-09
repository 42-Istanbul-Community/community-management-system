const MEMBERSHIP_URL = process.env.MEMBERSHIP_URL || 'http://membership:8000';

const REQUIRED_RANK = {
  all: 0,
  community_page: 0,
  member: 1,
  moderator: 2,
};

const ROLE_RANK = {
  member: 1,
  moderator: 2,
  admin: 3,
};

// Membership servisine sorar: bu kullanici bu toplulukta hangi rolde?
// Uye degilse ya da membership ulasilamiyorsa null doner.
async function getCommunityRole(communityId, userId) {
  if (!communityId || !userId) return null;
  try {
    const url = `${MEMBERSHIP_URL}/communities/${communityId}/members/${userId}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data.role || null;
  } catch (err) {
    return null;
  }
}

function canView(item, viewer) {
  if (viewer.globalRole === 'super_admin') return true;
  if (item.authorId === viewer.userId) return true;
  const need = REQUIRED_RANK[item.visibility] ?? 0;
  const have = ROLE_RANK[viewer.communityRole] ?? 0;
  return have >= need;
}

module.exports = { getCommunityRole, canView };