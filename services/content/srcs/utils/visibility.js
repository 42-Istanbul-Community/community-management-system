const MEMBERSHIP_URL = process.env.MEMBERSHIP_URL || 'http://membership:8000';

const REQUIRED_RANK = {
  all: 0,
  community_page: 0,
  member: 1,
  moderator: 2,
};

const VALID_VISIBILITY = Object.keys(REQUIRED_RANK);

const ROLE_RANK = {
  normal: 0,
  member: 1,
  moderator: 2,
  admin: 3,
};

async function getCommunityRole(communityId, userId) {
  if (!communityId || !userId) return null;
  try {
    const url = `${MEMBERSHIP_URL}/userRole/${userId}/${communityId}`;
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

function visibilityWhere(viewer) {
    const userId        = viewer.userId;
    const globalRole    = viewer.globalRole;
    const communityRole = viewer.communityRole;

    if (globalRole === 'super_admin') return {};
    const viewerRank = ROLE_RANK[communityRole] || 0;
    const allowed = Object.keys(REQUIRED_RANK).filter((v) => REQUIRED_RANK[v] <= viewerRank);
    return {
        OR: [
            { visibility: { in: allowed } },
            { authorId: userId },
        ],
    };
}

module.exports = { getCommunityRole, canView, visibilityWhere, VALID_VISIBILITY};