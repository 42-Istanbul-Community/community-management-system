const prisma = require('./prisma');
const { getCommunityRole, canView, visibilityWhere, VALID_VISIBILITY } = require('./utils/visibility');
const { isValidUuid, canModify, checkCommunityWritable } = require('./utils/utils');
const { saveAttachment, deleteAttachments, checkStorageConnection } = require('./utils/upload');

/* ---------- ANNOUNCEMENTS ---------- */

exports.getAnnouncement = async (req, res) => {
  try {
	const id = req.params.id;
    const announcement = await prisma.announcement.findUnique({
      where: { id: id },
    });

    if (!announcement) {
      return res.status(404).json({ error: "Not Found: announcement not found" });
    }
    const userId = req.user.id;
    const communityRole = await getCommunityRole(announcement.communityId, userId);
    const viewer = { userId, globalRole: req.user.role, communityRole };
    if (!canView(announcement, viewer)) return res.status(404).json({ error: "Not Found: announcement not found" });

    res.status(200).json({ announcement });
  } catch (error) {
    console.error("Announcement fetch error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await prisma.announcement.findUnique({ where: { id: id } });
    if (!existing) return res.status(404).json({ error: "Not Found: announcement not found" });
    
    if (!await canModify(existing, req)) return res.status(403).json({ error: "Forbidden: you don't have permission to modify this content" });

    const blocked = await checkCommunityWritable(existing.communityId, req);
    if (blocked) return res.status(blocked.code).json({ error: blocked.error });

    const title = req.body.title;
    const content = req.body.content;
    const pinned = req.body.pinned;
    const visibility = req.body.visibility;
    const removeAttachment = req.body.removeAttachment;
    if (visibility !== undefined && !VALID_VISIBILITY.includes(visibility)) return res.status(400).json({ error: "Bad Request: invalid visibility" });
    const data = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (pinned !== undefined) data.pinned = (pinned === true || pinned === 'true');
    if (visibility !== undefined) data.visibility = visibility;

    const newAttachment = await saveAttachment(req, id);
    const wantsRemove = (removeAttachment === 'true' || removeAttachment === true);
    if (newAttachment) data.attachments = [newAttachment];
    else if (wantsRemove) data.attachments = [];

    const announcement = await prisma.announcement.update({
      where: { id: id },
      data,
    });

    if (newAttachment || wantsRemove) await deleteAttachments(existing.attachments);

    res.status(200).json({ announcement });
  } catch (error) {
    console.error("Announcement update error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await prisma.announcement.findUnique({ where: { id: id } });
    if (!existing) return res.status(404).json({ error: "Not Found: announcement not found" });

    if (!await canModify(existing, req)) return res.status(403).json({ error: "Forbidden: you don't have permission to modify this content" });
    
    const blocked = await checkCommunityWritable(existing.communityId, req);
    if (blocked) return res.status(blocked.code).json({ error: blocked.error });

    await prisma.announcement.delete({ where: { id: id } });
    await deleteAttachments(existing.attachments);

    res.status(200).json({ message: "Announcement deleted" });
  } catch (error) {
    console.error("Announcement delete error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.createAnnouncement = async (req, res) => {
  try {
    const authorId = req.user.id;
    const communityId = req.body.communityId;
    const title = req.body.title;
    const content = req.body.content;
    const pinned = req.body.pinned;
    const visibility = req.body.visibility;
    const blocked = await checkCommunityWritable(communityId, req);

    if (!communityId || !title || !content) return res.status(400).json({ error: "Bad Request: communityId, title and content are required" });
    if (!isValidUuid(communityId)) return res.status(400).json({ error: "Bad Request: invalid communityId" });
    if (visibility !== undefined && !VALID_VISIBILITY.includes(visibility)) return res.status(400).json({ error: "Bad Request: invalid visibility" });
    if (blocked) return res.status(blocked.code).json({ error: blocked.error });
    if (title.length > 200) return res.status(400).json({ error: "Bad Request: title can be at most 200 characters" });

    const data = {
        communityId : communityId,
        authorId: authorId,
        title: title,
        content: content
    };

    if (pinned !== undefined) data.pinned = (pinned === true || pinned === 'true');
    if (visibility !== undefined) data.visibility = visibility;

    let announcement = await prisma.announcement.create({ data: data });
    const attachment = await saveAttachment(req, announcement.id);
    if (attachment) {
        announcement = await prisma.announcement.update({
            where: { id: announcement.id },
            data: { attachments: [attachment] },
        });
    }

    res.status(201).json({ announcement });
  } catch (error) {
    console.error("Announcement creation error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.listAnnouncements = async (req, res) => {
  try {
	const communityId = req.query.communityId;
    if (!communityId) return res.status(400).json({ error: "Bad Request: communityId query parameter is required" });

	const userId = req.user.id;
	const globalRole = req.user.role;
    const communityRole = await getCommunityRole(communityId, userId);
    const viewer = { userId, globalRole, communityRole };
	const limit = Math.min(parseInt(req.query.limit) || 20, 100);
	const page  = Math.max(parseInt(req.query.page)  || 1, 1);
    const announcements = await prisma.announcement.findMany({
      	where: {
			communityId,
			...visibilityWhere(viewer),
	  	},
      	orderBy: {
			createdAt: 'desc'
		},
		take: limit,
		skip: (page - 1) * limit,
    });

	res.status(200).json({ announcements });
  } catch (error) {
    console.error("Announcement listing error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ---------- EVENTS  ---------- */

exports.createEvent = async (req, res) => {
  try {
    const authorId = req.user.id;
    const communityId = req.body.communityId;
    const title = req.body.title;
    const content = req.body.content;
    const capacity = req.body.capacity;
    const startAt = req.body.startAt;
    const endAt = req.body.endAt;
    const visibility = req.body.visibility;
    const blocked = await checkCommunityWritable(communityId, req);
    
	if (visibility !== undefined && !VALID_VISIBILITY.includes(visibility)) return res.status(400).json({ error: "Bad Request: invalid visibility" });
    if (!communityId || !title || !content || !endAt) return res.status(400).json({ error: "Bad Request: communityId, title, content and endAt are required" });
    if (!isValidUuid(communityId)) return res.status(400).json({ error: "Bad Request: invalid communityId" });
    
    if (blocked) return res.status(blocked.code).json({ error: blocked.error });

    if (title.length > 200) return res.status(400).json({ error: "Bad Request: title can be at most 200 characters" });

    if (startAt && new Date(endAt) < new Date(startAt)) return res.status(400).json({ error: "Bad Request: endAt cannot be before startAt" });
    const data = {
        communityId: communityId,
    	authorId: authorId,
    	title: title,
    	content: content,
    	endAt: new Date(endAt)
	};
    if (capacity !== undefined) data.capacity = parseInt(capacity);
    if (startAt !== undefined) data.startAt = new Date(startAt);
    if (visibility !== undefined) data.visibility = visibility;

    let event = await prisma.event.create({ data: data });
    const attachment = await saveAttachment(req, event.id);
    if (attachment) {
      event = await prisma.event.update({
        where: { id: event.id },
        data: { attachments: [attachment] },
      });
    }
    res.status(201).json({ event: event });
  } catch (error) {
    console.error("Event creation error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.listEvents = async (req, res) => {
  try {
	const communityId = req.query.communityId;
    if (!communityId) return res.status(400).json({ error: "Bad Request: communityId query parameter is required" });
    const userId = req.user.id;
    const communityRole = await getCommunityRole(communityId, userId);
	const globalRole = req.user.role;
    const viewer = { userId, globalRole, communityRole };
	const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const page  = Math.max(parseInt(req.query.page)  || 1, 1);

    const all = await prisma.event.findMany({
    	where: {
		communityId,
		...visibilityWhere(viewer)
		},
    	orderBy: {
			startAt: 'asc'
		},
		take: limit,
		skip: (page - 1) * limit,
        include: {
            _count: { select: { participants: true } },
            ...(userId && {
        	    participants: {
        	        where: { userId: userId },
        	        select: { status: true },
        	    },
			}),
		},
    });

    const events = all.map((event) => {
        const myParticipation = event.participants?.[0];
        const { participants, _count, ...rest } = event;
        return {
          ...rest,
          participantCount: _count.participants,
          isJoined: myParticipation ? myParticipation.status === 'joined' : false,
          myStatus: myParticipation ? myParticipation.status : null,
        };
    });

    res.status(200).json({ events });
  } catch (error) {
    console.error("Event listing error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getEvent = async (req, res) => {
  try {
	const id = req.params.id;
    const event = await prisma.event.findUnique({
      where: { id: id },
      include: { _count: { select: { participants:  { where: { status: 'joined' } } } } },
    });
	if (!event) return res.status(404).json({ error: "Not Found: event not found" });
	
	const userId = req.user.id;
    const communityRole = await getCommunityRole(event.communityId, userId);
    const viewer = { userId, globalRole: req.user.role, communityRole };
    if (!canView(event, viewer)) return res.status(404).json({ error: "Not Found: event not found" });
	
	const { _count, ...rest } = event;
	res.status(200).json({ event: { ...rest, participantCount: _count.participants } });
  } catch (error) {
    console.error("Event fetch error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateEvent = async (req, res) => {
  try {
	const id = req.params.id;
    const existing = await prisma.event.findUnique({ where: { id } });
	if (!existing) return res.status(404).json({ error: "Not Found: event not found" });
    
    if (!await canModify(existing, req)) return res.status(403).json({ error: "Forbidden: you don't have permission to modify this content" });
    
	const blocked = await checkCommunityWritable(existing.communityId, req);
	if (blocked) return res.status(blocked.code).json({ error: blocked.error });

	const title = req.body.title;
	const content = req.body.content;
	const capacity = req.body.capacity;
	const startAt = req.body.startAt;
	const endAt = req.body.endAt;
    const visibility = req.body.visibility;
    const removeAttachment = req.body.removeAttachment;
    if (visibility !== undefined && !VALID_VISIBILITY.includes(visibility)) return res.status(400).json({ error: "Bad Request: invalid visibility" });
    if (startAt !== undefined && endAt !== undefined && new Date(endAt) < new Date(startAt)) return res.status(400).json({ error: "Bad Request: endAt cannot be before startAt" });

    const data = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (capacity !== undefined) data.capacity = parseInt(capacity);
    if (startAt !== undefined) data.startAt = new Date(startAt);
    if (endAt !== undefined) data.endAt = new Date(endAt);
    if (visibility !== undefined) data.visibility = visibility;

    const newAttachment = await saveAttachment(req, id);
    const wantsRemove = (removeAttachment === 'true' || removeAttachment === true);
    if (newAttachment) data.attachments = [newAttachment];
    else if (wantsRemove) data.attachments = [];

    const event = await prisma.event.update({ where: { id }, data });

    if (newAttachment || wantsRemove) await deleteAttachments(existing.attachments);

    res.status(200).json({ event });
  } catch (error) {
    console.error("Event update error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
	const id = req.params.id;
    const existing = await prisma.event.findUnique({ where: { id } });
	if (!existing) return res.status(404).json({ error: "Not Found: event not found" });
    
    if (!await canModify(existing, req)) return res.status(403).json({ error: "Forbidden: you don't have permission to modify this content" });
    
	const blocked = await checkCommunityWritable(existing.communityId, req);
	if (blocked) return res.status(blocked.code).json({ error: blocked.error });
	
	await prisma.event.delete({ where: { id } });
    await deleteAttachments(existing.attachments);
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    console.error("Event delete error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ----- INTERNAL (service-to-service) ----- */

exports.getContentInternal = async (req, res) => {
  try {
    const id = req.params.id;
	let content = await prisma.announcement.findUnique({
      where: { id: id },
      select: { visibility: true, communityId: true },
    });
    if (!content) {
      content = await prisma.event.findUnique({
        where: { id: id },
        select: { visibility: true, communityId: true },
      });
    }

    if (!content) return res.status(404).json({ error: "Content not found" });

    return res.status(200).json({
      content: {
        visibility: content.visibility,
        community_id: content.communityId,
      },
    });
  } catch (error) {
    console.error("getContentInternal error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteUserContent = async (req, res) => {
  try {
    const userId = req.params.userId;
    const announcements = await prisma.announcement.findMany({
      where: { authorId: userId },
      select: { id: true, attachments: true },
    });
    const events = await prisma.event.findMany({
      where: { authorId: userId },
      select: { id: true, attachments: true },
    });
    for (const item of [...announcements, ...events]) {
      if (item.attachments) await deleteAttachments(item.attachments);
    }
    await prisma.announcement.deleteMany({ where: { authorId: userId } });
    await prisma.event.deleteMany({ where: { authorId: userId } });

    return res.status(200).json({ message: "User content deleted" });
  } catch (error) {
    console.error("deleteUserContent error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteCommunityContent = async (req, res) => {
  try {
    const communityId = req.params.communityId;
    const announcements = await prisma.announcement.findMany({
      where: { communityId: communityId },
      select: { id: true, attachments: true },
    });
    const events = await prisma.event.findMany({
      where: { communityId: communityId },
      select: { id: true, attachments: true },
    });

    for (const item of [...announcements, ...events]) {
      if (item.attachments) await deleteAttachments(item.attachments);
    }

    await prisma.announcement.deleteMany({ where: { communityId: communityId } });
    await prisma.event.deleteMany({ where: { communityId: communityId } });

    return res.status(200).json({ message: "Community content deleted" });
  } catch (error) {
    console.error("deleteCommunityContent error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ---------- EVENTS PARTICIPANTS ---------- */

exports.joinEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.id;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: "Not Found: event not found" });

    const blocked = await checkCommunityWritable(event.communityId, req);
    if (blocked) return res.status(blocked.code).json({ error: blocked.error });

    if (new Date() > event.endAt) return res.status(409).json({ error: "Conflict: event has ended, cannot join" });

    const already = await prisma.eventParticipant.findUnique({
      where: { eventId_userId: { eventId: eventId, userId: userId } },
    });

	if (already) {
      if (already.status === 'rejected') return res.status(403).json({ error: "Forbidden: your request for this event was rejected" });
      return res.status(409).json({ error: "Conflict: you have already requested to join this event" });
    }

    const participant = await prisma.eventParticipant.create({
      data: { eventId: eventId, userId: userId, status: 'requested' },
    });
    res.status(201).json({ participant });
  } catch (error) {
    console.error("Event join error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.leaveEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.id;
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: "Not Found: event not found" });
    if (new Date() > event.endAt) return res.status(409).json({ error: "Conflict: event has ended, cannot join" });

    const existing = await prisma.eventParticipant.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });
    if (!existing) return res.status(404).json({ error: "Not Found: you haven't joined this event" });
	if (existing.status === 'rejected') return res.status(403).json({ error: "Forbidden: your request for this event was rejected" });

    await prisma.eventParticipant.delete({
      where: { eventId_userId: { eventId, userId } },
    });
    res.status(200).json({ message: "Left the event" });
  } catch (error) {
    console.error("Event leave error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const VALID_PARTICIPANT_STATUS = ['requested', 'joined', 'rejected', 'no_show'];

exports.updateParticipantStatus = async (req, res) => {
  try {
    const eventId = req.params.id;
    const targetUserId = req.params.userId;
    const status = req.body.status;

    if (!isValidUuid(targetUserId)) return res.status(400).json({ error: "Bad Request: invalid userId" });
    if (status === undefined || !VALID_PARTICIPANT_STATUS.includes(status)) return res.status(400).json({ error: "Bad Request: status must be one of requested, joined, no_show" });

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: "Not Found: event not found" });

    if (!await canModify(event, req)) return res.status(403).json({ error: "Forbidden: you don't have permission to manage participants" });

    const blocked = await checkCommunityWritable(event.communityId, req);
    if (blocked) return res.status(blocked.code).json({ error: blocked.error });

    const participant = await prisma.eventParticipant.findUnique({
      where: { eventId_userId: { eventId: eventId, userId: targetUserId } },
    });
    if (!participant) return res.status(404).json({ error: "Not Found: participant not found" });

    if (status === 'joined' && participant.status !== 'joined' && event.capacity > 0) {
      const joinedCount = await prisma.eventParticipant.count({
        where: { eventId: eventId, status: 'joined' },
      });
      if (joinedCount >= event.capacity) {
        return res.status(409).json({ error: "Conflict: event capacity is full" });
      }
    }

    const updated = await prisma.eventParticipant.update({
      where: { eventId_userId: { eventId: eventId, userId: targetUserId } },
      data: { status: status },
    });

    res.status(200).json({ participant: updated });
  } catch (error) {
    console.error("Participant status update error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.listParticipants = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: "Not Found: event not found" });

    const isManager = await canModify(event, req);

    const participants = await prisma.eventParticipant.findMany({
      where: isManager ? { eventId: eventId } : { eventId: eventId, status: 'joined' },
      orderBy: { joinedAt: 'asc' },
    });
    res.status(200).json({ participants });
  } catch (error) {
    console.error("Participant listing error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.listActiveCommunities = async (req, res) => {
  try {
   const ACTIVITY_DAYS = 30;
    const cursor = Math.max(parseInt(req.query.cursor) || 0, 0);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const order = (req.query.order || 'desc').toLowerCase();

    if (order !== 'asc' && order !== 'desc') return res.status(400).json({ error: "Bad Request: order must be 'asc' or 'desc'" });

    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - ACTIVITY_DAYS);

    const groups = await prisma.event.groupBy({
      by: ['communityId'],
      where: { createdAt: { gte: start, lte: now }, },
      _count: { id: true },
      orderBy: [
        { _count: { id: order } },
        { communityId: 'asc' },
      ],
      skip: cursor,
      take: limit,
    });

    const communities = [];
    for (const group of groups) communities.push({ community_id: group.communityId });

    return res.status(200).json({ communities });
  } catch (error) {
    console.error("listActiveCommunities error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.healthCheck = async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    console.error("Health check: database connection failed:", error);
    return res.status(503).json({ status: "error", database: "down" });
  }

  const storageOk = await checkStorageConnection();
  if (!storageOk) return res.status(503).json({ status: "error", storage: "down" });

  return res.status(200).json({ status: "ok" });
};