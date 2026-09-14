const COMMUNITY_URL = process.env.COMMUNITY_URL || 'http://community';
const MEMBERSHIP_URL = process.env.MEMBERSHIP_URL || 'http://membership';

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
    if (!response.ok) {
+     console.error(`getCommunityRole: membership returned ${response.status} for ${url}`);
      return null;
	}
    const data = await response.json();
    return data.role || null;
  } catch (err) {
	console.error("getCommunityRole: membership request failed:", err);
    return null;
  }
}

async function getCommunityStatus(communityId) {
  if (!communityId) return 'not_found';
  try {
    const url = `${COMMUNITY_URL}/internal/communities/${communityId}`;
    const response = await fetch(url);

    if (response.status === 404) return 'not_found';
    if (!response.ok) return 'unreachable';

    const data = await response.json();
    if (!data.community || !data.community.status) return 'unreachable';

    return data.community.status;
  } catch (error) {
    console.error("Community status check failed:", error);
    return 'unreachable';
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

module.exports = { getCommunityRole, canView, visibilityWhere, getCommunityStatus, VALID_VISIBILITY};