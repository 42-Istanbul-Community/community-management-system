const { getCommunityRole, getCommunityStatus } = require('./visibility');

function isValidUuid(value) {
  if (typeof value !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

async function canModify(item, req) {
  const userId = req.user.id;
  const role = req.user.role;
  const isOwner = item.authorId === userId;
  const isElevated = role === 'super_admin';
  const communityRole = await getCommunityRole(item.communityId, userId);
  const isCommunityMod = communityRole === 'moderator' || communityRole === 'admin';
  return isOwner || isElevated || isCommunityMod;
}

async function checkCommunityWritable(communityId, req) {
  if (req.user.role === 'super_admin') return null;

  const status = await getCommunityStatus(communityId);
  if (status === 'not_found') return { code: 404, error: "Not Found: community not found" };
  if (status === 'unreachable') return { code: 503, error: "Service Unavailable: community status could not be verified" };
  if (status !== 'active') return { code: 403, error: "Forbidden: community is not active" };
  
  return null;
}


module.exports = { isValidUuid, canModify, checkCommunityWritable};