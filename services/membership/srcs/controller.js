const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { validateAction } = require("./utils");
const axios = require("axios");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

exports.sendCommunityRequest = async (req, res) => {
  const { communityId, message } = req.body;
  if (!communityId) {
    return res.status(400).json({ error: "Community ID is required" });
  }
  const community = await axios.get(
    `http://community/internal/communities/${communityId}`,
  );
  if (!community.data.community) {
    return res.status(404).json({ error: "Community not found" });
  }

  if (community.data.community.access === "closed") {
    return res.status(403).json({ error: "Community is closed" });
  }

  //* check if the user has already sent a request to this community
  const existingRequest = await prisma.community_join_requests.findFirst({
    where: {
      community_id: communityId,
      user_id: req.user.id,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  if (existingRequest && existingRequest.status === "pending") {
    return res.status(400).json({ error: "Request already sent" });
  }

  if (community.data.community.access === "open") {
    const newMember = await prisma.community_members.create({
      data: {
        user_id: req.user.id,
        community_id: communityId,
        role: "member",
      },
    });
    return res.status(201).json(newMember);
  }

  const newRequest = await prisma.community_join_requests.create({
    data: {
      user_id: req.user.id,
      community_id: communityId,
      message,
      status: "pending",
    },
  });
  res.status(201).json(newRequest);
};

exports.getCommunityRequests = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { status } = req.query;

    //* validate param and query
    if (!communityId) {
      return res.status(400).json({ error: "Community ID is required" });
    }

    if (status && !["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    //* check the user permissions for the community
    const userPerm = await prisma.community_members.findFirst({
      where: {
        community_id: communityId,
        user_id: req.user.id,
      },
    });
    if (!userPerm && req.user.role !== "super_admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    if (userPerm.role === "member") {
      return res.status(403).json({ error: "Access denied" });
    }

    if (userPerm.role === "moderator") {
      const modperms = await prisma.moderator_permissions.findFirst({
        where: {
          community_id: communityId,
        },
      });
      if (!modperms || !modperms.permission.includes("seeRequests")) {
        return res.status(403).json({ error: "Access denied" });
      }
    }

    const requests = await prisma.community_join_requests.findMany({
      where: {
        community_id: communityId,
        ...(status && { status }),
      },
      orderBy: {
        created_at: "desc",
      },
    });
    res.status(200).json({ requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.resolveCommunityRequest = async (req, res) => {
  try {
    const { requestIds, action, communityId } = req.body;

    //* validate params
    if (!requestIds || !action || !communityId) {
      return res
        .status(400)
        .json({ error: "Request IDs, action, and community ID are required" });
    }
    if (!validateAction(action)) {
      return res.status(400).json({ error: "Invalid action value" });
    }
    if (!Array.isArray(requestIds)) {
      return res.status(400).json({ error: "Request IDs must be an array" });
    }
    if (requestIds.length === 0) {
      return res
        .status(400)
        .json({ error: "Request IDs array cannot be empty" });
    }
    if (requestIds.some((id) => typeof id !== "string")) {
      return res.status(400).json({ error: "Request IDs must be strings" });
    }

    const userPerm = await prisma.community_members.findFirst({
      where: {
        community_id: communityId,
        user_id: req.user.id,
      },
    });

    if (!userPerm && req.user.role !== "super_admin") {
      return res.status(403).json({ error: "Access denied" });
    }
    if (userPerm.role === "member") {
      return res.status(403).json({ error: "Access denied" });
    }
    if (userPerm.role === "moderator") {
      const modperms = await prisma.moderator_permissions.findFirst({
        where: {
          community_id: communityId,
        },
      });
      if (!modperms || !modperms.permission.includes("resolveRequests")) {
        return res.status(403).json({ error: "Access denied" });
      }
    }

    const successfulRequests = [];
    const failedRequests = [];
    for (const requestId of requestIds) {
      const request = await prisma.community_join_requests.findUnique({
        where: {
          id: requestId,
          community_id: communityId,
        },
      });
      if (!request) {
        failedRequests.push({ requestId, error: "Request not found" });
        continue;
      }
      if (request.status !== "pending") {
        failedRequests.push({ requestId, error: "Request is not pending" });
        continue;
      }
      await prisma.community_join_requests.update({
        where: {
          id: requestId,
          community_id: communityId,
        },
        data: {
          status: action === "approve" ? "approved" : "rejected",
          reviewed_by: req.user.id,
          reviewed_at: new Date(),
        },
      });
      const newMember = await prisma.community_members.create({
        data: {
          user_id: request.user_id,
          community_id: communityId,
          role: "member",
        },
      });
      successfulRequests.push(newMember);
    }
    if (failedRequests.length > 0) {
      return res.status(207).json({ successfulRequests, failedRequests });
    }
    res.status(200).json({ successfulRequests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getRole = async (req, res) => {
  try {
    const { communityId, userId } = req.params;
    const membership = await prisma.community_members.findFirst({
      where: {
        community_id: communityId,
        user_id: userId,
      },
    });

    if (!membership) {
      res.status(200).json({ role: "normal" });
    }
    res.status(200).json({ role: membership.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserCommunities = async (req, res) => {
  try {
    const { userId } = req.params;
    const memberships = await prisma.community_members.findMany({
      where: {
        user_id: userId,
      },
      select: {
        community_id: true,
      },
    });
    res.status(200).json({ communities: memberships });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCommunityMembers = async (req, res) => {
  try {
    const { communityId } = req.params;
    if (!communityId) {
      return res.status(400).json({ error: "Community ID is required" });
    }
    if (isUUID(communityId) === false) {
      return res.status(400).json({ error: "Community ID is not valid" });
    }
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const members = await prisma.$queryRaw`
      SELECT
        user_id,
        role
      FROM community_members
      WHERE community_id = ${communityId}
      ORDER BY
        CASE role
          WHEN 'admin' THEN 1
          WHEN 'moderator' THEN 2
          WHEN 'member' THEN 3
        END,
        user_id ASC
      LIMIT ${limitNumber}
      OFFSET ${offset}
    `;
    res.status(200).json({ members });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getModeratorPermissions = async (req, res) => {
  try {
    const { communityId } = req.params;
    const permissions = await prisma.moderator_permissions.findFirst({
      where: {
        community_id: communityId,
      },
    });
    if (!permissions) {
      return res.status(404).json({ error: "Permissions not found" });
    }
    res.status(200).json(permissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.setModeratorPermissions = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { permissions } = req.body;

    if (!Array.isArray(permissions)) {
      return res.status(400).json({ error: "Permissions must be an array" });
    }

    const userPerm = await prisma.community_members.findFirst({
      where: {
        community_id: communityId,
        user_id: req.user.id,
      },
    });

    if (!userPerm && req.user.role !== "super_admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const modPerms = await prisma.moderator_permissions.findFirst({
      where: {
        community_id: communityId,
      },
    });
    if (!modPerms) {
      return res.status(404).json({ error: "Permissions not found" });
    }

    if (userPerm.role === "moderator") {
      if (!modPerms.permission.includes("setPermissions")) {
        return res.status(403).json({ error: "Access denied" });
      }
    }

    const updatedPermissions = await prisma.moderator_permissions.update({
      where: {
        community_id: communityId,
      },
      data: {
        ...modPerms.permission,
        permission: permissions,
      },
    });
    res.status(200).json(updatedPermissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createCommunities = async (req, res) => {
  try {
    const { communities } = req.body;

    if (
      !Array.isArray(communities) ||
      !communities.every(
        (x) =>
          x && typeof x === "object" && "communityId" in x && "adminId" in x,
      )
    ) {
      return res.status(400).json({ error: "Invalid communities data" });
    }

    const result = await prisma.$transaction(
      communities.flatMap(({ communityId, adminId }) => [
        prisma.community_members.create({
          data: {
            user_id: adminId,
            community_id: communityId,
            role: "admin",
          },
        }),

        prisma.moderator_permissions.create({
          data: {
            community_id: communityId,
            permission: ["seeRequests", "resolveRequests", "kickMembers"],
          },
        }),
      ]),
    );

    return res.status(201).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.kickMember = async (req, res) => {
  try {
    const { communityId, userId } = req.body;

    if (!communityId || !userId) {
      return res
        .status(400)
        .json({ error: "Community ID and User ID are required" });
    }

    const userPerm = await prisma.community_members.findFirst({
      where: {
        community_id: communityId,
        user_id: req.user.id,
      },
    });

    if (!userPerm && req.user.role !== "super_admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    if (userPerm && userPerm.role === "member") {
      return res.status(403).json({ error: "Access denied" });
    }

    if (userPerm.role === "moderator") {
      const modperms = await prisma.moderator_permissions.findFirst({
        where: {
          community_id: communityId,
        },
      });
      if (!modperms || !modperms.permissions.includes("kickMembers")) {
        return res.status(403).json({ error: "Access denied" });
      }
    }

    const membership = await prisma.community_members.findFirst({
      where: {
        community_id: communityId,
        user_id: userId,
      },
    });
    if (!membership) {
      return res.status(404).json({ error: "Membership not found" });
    }

    if (req.user.id === userId) {
      return res.status(403).json({ error: "Cannot kick yourself" });
    }

    const targetUserPerm = await prisma.community_members.findFirst({
      where: {
        community_id: communityId,
        user_id: userId,
      },
    });

    if (targetUserPerm.role === "admin") {
      return res.status(403).json({ error: "Cannot kick the owner" });
    }

    await prisma.community_members.delete({
      where: {
        id: membership.id,
      },
    });
    res.status(200).json({ message: "Member kicked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.leaveCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;

    if (!communityId) {
      return res.status(400).json({ error: "Community ID is required" });
    }
    const membership = await prisma.community_members.findFirst({
      where: {
        community_id: communityId,
        user_id: req.user.id,
      },
    });

    if (!membership) {
      return res.status(404).json({ error: "Membership not found" });
    }
    if (membership.role === "admin") {
      return res
        .status(403)
        .json({ error: "Owner cannot leave the community" });
    }

    await prisma.community_members.delete({
      where: {
        id: membership.id,
      },
    });
    res.status(200).json({ message: "Left community successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;

    if (!communityId) {
      return res.status(400).json({ error: "Community ID is required" });
    }
    await prisma.$transaction(async (tx) => {
      await tx.moderator_permissions.deleteMany({
        where: {
          community_id: communityId,
        },
      });

      await tx.community_members.deleteMany({
        where: {
          community_id: communityId,
        },
      });

      await tx.community_join_requests.deleteMany({
        where: {
          community_id: communityId,
        },
      });
    });

    res.status(200).json({ message: "Community deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error", message: error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      return res.status(400).json({ error: "User ID is required" });
    }

    await prisma.$transaction(async (tx) => {
      const adminMemberships = await tx.community_members.findMany({
        where: {
          user_id: userid,
          role: "admin",
        },
        select: {
          community_id: true,
        },
      });

      const communityIds = adminMemberships.map(
        (membership) => membership.community_id,
      );

      if (communityIds.length > 0) {
        await tx.moderator_permissions.deleteMany({
          where: {
            community_id: {
              in: communityIds,
            },
          },
        });

        await tx.community_members.deleteMany({
          where: {
            community_id: {
              in: communityIds,
            },
          },
        });
      }

      await tx.community_members.deleteMany({
        where: {
          user_id: userid,
        },
      });

      await tx.community_join_requests.deleteMany({
        where: {
          user_id: userid,
        },
      });
    });

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
