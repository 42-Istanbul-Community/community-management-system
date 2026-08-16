const prisma = require('./prisma');
const { getCommunityRole, canView, visibilityWhere, VALID_VISIBILITY } = require('./utils/visibility');
const { isValidUuid } = require('./utils/utils');
const { saveAttachment } = require('./utils/upload');

async function canModify(item, req) {
  const userId = req.user.id;
  const role = req.user.role;
  const isOwner = item.authorId === userId;
  const isElevated = role === 'super_admin';
  const communityRole = await getCommunityRole(item.communityId, userId);
  const isCommunityMod = communityRole === 'moderator' || communityRole === 'admin';
  return isOwner || isElevated || isCommunityMod;
}

/* ---------- ANNOUNCEMENTS ---------- */

exports.getAnnouncement = async (req, res) => {
  try {
	const id = req.params.id;
    const announcement = await prisma.announcement.findUnique({
      where: { id: id },
    });

    if (!announcement) {
      return res.status(404).json({ error: "Not Found: duyuru bulunamadi" });
    }
    const userId = req.user.id;
    const communityRole = await getCommunityRole(announcement.communityId, userId);
    const viewer = { userId, globalRole: req.user.role, communityRole };
    if (!canView(announcement, viewer)) return res.status(404).json({ error: "Not Found: duyuru bulunamadi" });

    res.status(200).json({ announcement });
  } catch (error) {
    console.error("Duyuru getirme hatasi:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized: giris gerekli" });

	const id = req.params.id;
    const existing = await prisma.announcement.findUnique({ where: { id: id } });
    if (!existing) return res.status(404).json({ error: "Not Found: duyuru bulunamadi" });
	if (!await canModify(existing, req)) return res.status(403).json({ error: "Forbidden: bu icerigi degistirme yetkin yok" });

	const title = req.body.title;
	const content = req.body.content;
	const pinned = req.body.pinned;
	const visibility = req.body.visibility;
    const data = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (pinned !== undefined) data.pinned = pinned;
    if (visibility !== undefined) data.visibility = visibility;

    const announcement = await prisma.announcement.update({
      where: { id: id },
      data,
    });

    res.status(200).json({ announcement });
  } catch (error) {
    console.error("Duyuru guncelleme hatasi:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
	const userId = req.user.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized: giris gerekli" });

	const id = req.params.id;
    const existing = await prisma.announcement.findUnique({ where: { id: id } });
    if (!existing) return res.status(404).json({ error: "Not Found: duyuru bulunamadi" });
    if (!await canModify(existing, req)) return res.status(403).json({ error: "Forbidden: bu icerigi degistirme yetkin yok" });

    await prisma.announcement.delete({ where: { id: id } });

    res.status(200).json({ message: "Duyuru silindi" });
  } catch (error) {
    console.error("Duyuru silme hatasi:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.createAnnouncement = async (req, res) => {
  try {
    const authorId = req.user.id;
    if (!authorId) {
      return res
	  	.status(401)
		.json({ error: "Unauthorized: giris gerekli" });
    }

    const communityId = req.body.communityId;
    const title = req.body.title;
    const content = req.body.content;
    const pinned = req.body.pinned;
    const visibility = req.body.visibility;

    if (!communityId || !title || !content) return res.status(400).json({ error: "Bad Request: communityId, title ve content zorunlu" });
    if (!isValidUuid(communityId)) return res.status(400).json({ error: "Bad Request: gecersiz communityId" });
    if (title.length > 200) return res.status(400).json({ error: "Bad Request: baslik en fazla 200 karakter olabilir" });
    const attachment = await saveAttachment(req);
    const data = {
        communityId : communityId,
        authorId: authorId,
        title: title,
        content: content
    };

    if (pinned !== undefined) data.pinned = (pinned === true || pinned === 'true');
    if (visibility !== undefined) data.visibility = visibility;
    if (attachment) data.attachments = [attachment];
    const announcement = await prisma.announcement.create({ data: data });

    res.status(201).json({ announcement });
  } catch (error) {
    console.error("Duyuru olusturma hatasi:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.listAnnouncements = async (req, res) => {
  try {
	const communityId = req.query.communityId;
    if (!communityId) return res.status(400).json({ error: "Bad Request: communityId query parametresi zorunlu" });

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
    console.error("Duyuru listeleme hatasi:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ---------- EVENTS  ---------- */

exports.createEvent = async (req, res) => {
  try {
    const authorId = req.user.id;
    if (!authorId) return res.status(401).json({ error: "Unauthorized: giris gerekli" });

	const communityId = req.body.communityId;
	const title = req.body.title;
	const content = req.body.content;
	const capacity = req.body.capacity;
	const startAt = req.body.startAt;
	const endAt = req.body.endAt;
    const visibility = req.body.visibility;
    if (visibility !== undefined && !VALID_VISIBILITY.includes(visibility)) return res.status(400).json({ error: "Bad Request: gecersiz visibility" });
    if (!communityId || !title || !content || !endAt) return res.status(400).json({ error: "Bad Request: communityId, title, content ve endAt zorunlu" });
	if (!isValidUuid(communityId)) return res.status(400).json({ error: "Bad Request: gecersiz communityId" });
    if (title.length > 200) return res.status(400).json({ error: "Bad Request: baslik en fazla 200 karakter olabilir" });

    if (startAt && new Date(endAt) < new Date(startAt)) return res.status(400).json({ error: "Bad Request: endAt, startAt'ten once olamaz" });
    const attachment = await saveAttachment(req);
    const data = {
		communityId: communityId,
		authorId: authorId,
		title: title,
		content: content,
		endAt: new Date(endAt)
	};
    if (capacity !== undefined) data.capacity = parseInt(capacity);
    if (startAt !== undefined) data.startAt = new Date(startAt);
    if (attachment) data.attachments = [attachment];
    if (visibility !== undefined) data.visibility = visibility;

    const event = await prisma.event.create({ data: data });
    res.status(201).json({ event: event });
  } catch (error) {
    console.error("Etkinlik olusturma hatasi:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.listEvents = async (req, res) => {
  try {
	const communityId = req.query.communityId;
    if (!communityId) return res.status(400).json({ error: "Bad Request: communityId query parametresi zorunlu" });
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
        ...(userId && {
            include: {
        	    participants: {
        	        where: { userId: userId },
        	        select: { status: true },
        	    },
			},
        }),
    });

    const events = all.map((event) => {
        const myParticipation = event.participants?.[0];
        const { participants, ...rest } = event;
        return {
          ...rest,
          isJoined: myParticipation ? true : false,
          myStatus: myParticipation ? myParticipation.status : null,
        };
    });

    res.status(200).json({ events });
  } catch (error) {
    console.error("Etkinlik listeleme hatasi:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getEvent = async (req, res) => {
  try {
	const id = req.params.id;
    const event = await prisma.event.findUnique({ where: { id: id } });
    if (!event) return res.status(404).json({ error: "Not Found: etkinlik bulunamadi" });
	
	const userId = req.user.id;
    const communityRole = await getCommunityRole(event.communityId, userId);
    const viewer = { userId, globalRole: req.user.role, communityRole };
    if (!canView(event, viewer)) return res.status(404).json({ error: "Not Found: etkinlik bulunamadi" });
	
	res.status(200).json({ event });
  } catch (error) {
    console.error("Etkinlik getirme hatasi:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateEvent = async (req, res) => {
  try {
	const userId = req.user.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized: giris gerekli" });

	const id = req.params.id;
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not Found: etkinlik bulunamadi" });
    if (!await canModify(existing, req)) return res.status(403).json({ error: "Forbidden: bu icerigi degistirme yetkin yok" });

	const title = req.body.title;
	const content = req.body.content;
	const capacity = req.body.capacity;
	const startAt = req.body.startAt;
	const endAt = req.body.endAt;
    const visibility = req.body.visibility;
    if (visibility !== undefined && !VALID_VISIBILITY.includes(visibility)) return res.status(400).json({ error: "Bad Request: gecersiz visibility" });
    if (startAt !== undefined && endAt !== undefined && new Date(endAt) < new Date(startAt)) return res.status(400).json({ error: "Bad Request: endAt, startAt'ten once olamaz" });

    const data = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (capacity !== undefined) data.capacity = capacity;
    if (startAt !== undefined) data.startAt = new Date(startAt);
    if (endAt !== undefined) data.endAt = new Date(endAt);
    if (visibility !== undefined) data.visibility = visibility;

    const event = await prisma.event.update({ where: { id }, data });
    res.status(200).json({ event });
  } catch (error) {
    console.error("Etkinlik guncelleme hatasi:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
	const userId = req.user.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized: giris gerekli" });

	const id = req.params.id;
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not Found: etkinlik bulunamadi" });
    if (!await canModify(existing, req)) return res.status(403).json({ error: "Forbidden: bu icerigi degistirme yetkin yok" });

	await prisma.event.delete({ where: { id } });
    res.status(200).json({ message: "Etkinlik silindi" });
  } catch (error) {
    console.error("Etkinlik silme hatasi:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ---------- EVENTS PARTICIPANTS ---------- */

exports.joinEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized: giris gerekli" });

    const eventId = req.params.id;
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: "Not Found: etkinlik bulunamadi" });

    const already = await prisma.eventParticipant.findUnique({
      where: { eventId_userId: { eventId: eventId, userId: userId } },
    });
    if (already) return res.status(409).json({ error: "Conflict: zaten bu etkinlige katildin" });

    if (event.capacity > 0) {
      const count = await prisma.eventParticipant.count({ where: { eventId: eventId } });
      if (count >= event.capacity) {
        return res.status(409).json({ error: "Conflict: etkinlik kontenjani dolu" });
      }
    }

    const participant = await prisma.eventParticipant.create({
      data: { eventId: eventId, userId: userId },
    });
    res.status(201).json({ participant });
  } catch (error) {
    console.error("Etkinlige katilma hatasi:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.leaveEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized: giris gerekli" });

    const eventId = req.params.id;
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: "Not Found: etkinlik bulunamadi" });
    if (new Date() > event.endAt) return res.status(409).json({ error: "Conflict: etkinlik bitti, katilinamaz" });
    if (new Date() > event.endAt) return res.status(409).json({ error: "Conflict: etkinlik bitti, artik cikilamaz" });

    const existing = await prisma.eventParticipant.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });
    if (!existing) return res.status(404).json({ error: "Not Found: bu etkinlige katilmamissin" });

    await prisma.eventParticipant.delete({
      where: { eventId_userId: { eventId, userId } },
    });
    res.status(200).json({ message: "Etkinlikten cikildi" });
  } catch (error) {
    console.error("Etkinlikten cikma hatasi:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.listParticipants = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: "Not Found: etkinlik bulunamadi" });

    const participants = await prisma.eventParticipant.findMany({
      where: { eventId },
      orderBy: { joinedAt: 'asc' },
    });
    res.status(200).json({ participants });
  } catch (error) {
    console.error("Katilimci listeleme hatasi:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};