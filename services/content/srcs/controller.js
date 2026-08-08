const prisma = require('./prisma');

exports.getAnnouncement = async (req, res) => {
  try {
	const id = req.params.id;
    const announcement = await prisma.announcement.findUnique({
      where: { id: id },
    });

    if (!announcement) {
      return res.status(404).json({ error: "Not Found: duyuru bulunamadi" });
    }

    res.status(200).json({ announcement });
  } catch (error) {
    console.error("Duyuru getirme hatasi:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
	const id = req.params.id;
    const existing = await prisma.announcement.findUnique({ where: { id: id } });
    if (!existing) return res.status(404).json({ error: "Not Found: duyuru bulunamadi" });

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
	const id = req.params.id;
    const existing = await prisma.announcement.findUnique({ where: { id: id } });
    if (!existing) return res.status(404).json({ error: "Not Found: duyuru bulunamadi" });

    await prisma.announcement.delete({ where: { id: id } });

    res.status(200).json({ message: "Duyuru silindi" });
  } catch (error) {
    console.error("Duyuru silme hatasi:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.createAnnouncement = async (req, res) => {
  try {
    const authorId = req.headers['x-user-id'];
    if (!authorId) {
      return res
	  	.status(401)
		.json({ error: "Unauthorized: giris gerekli" });
    }

	const communityId = req.body.communityId;
	const title = req.body.title;
	const content = req.body.content;

    if (!communityId || !title || !content) {
      return res
        .status(400)
        .json({ error: "Bad Request: communityId, title ve content zorunlu" });
    }

    const announcement = await prisma.announcement.create({
    	data: {
			communityId : communityId,
			authorId: authorId,
			title: title,
			content: content
		},
    });

    res.status(201).json({ announcement });
  } catch (error) {
    console.error("Duyuru olusturma hatasi:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.listAnnouncements = async (req, res) => {
  try {
	const communityId = req.query.communityId;
    if (!communityId) {
      return res
        .status(400)
        .json({ error: "Bad Request: communityId query parametresi zorunlu" });
    }

    const announcements = await prisma.announcement.findMany({
      	where: {
			communityId: communityId
	  	},
      	orderBy: {
			createdAt: 'desc'
		},
    });

    res.status(200).json({ announcements });
  } catch (error) {
    console.error("Duyuru listeleme hatasi:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};