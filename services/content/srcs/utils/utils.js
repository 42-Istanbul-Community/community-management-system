const { getCommunityRole } = require('./visibility');

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

module.exports = { isValidUuid, canModify};