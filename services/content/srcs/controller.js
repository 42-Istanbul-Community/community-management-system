const prisma = require('./prisma');

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