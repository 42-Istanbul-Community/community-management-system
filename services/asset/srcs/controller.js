const { idMinio, communityMinio, contentMinio } = require("./minio")
const { objectExists } = require("./utils");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const axios = require("axios");

exports.getUserAssets = async (req, res) => {
  try {
    const assetId = req.params.assetId;
    if (!assetId) {
      return res
        .status(400)
        .json({ error: "Bad Request: Asset ID is required" });
    }
    if (!(await objectExists(idMinio, process.env.ID_MINIO_BUCKET, assetId))) {
      return res.status(404).json({ error: "Asset not found" });
    }
    const result = await idMinio.send(
      new GetObjectCommand({
        Bucket: process.env.ID_MINIO_BUCKET,
        Key: assetId,
      }),
    );

    res.setHeader(
      "Content-Type",
      result.ContentType || "application/octet-stream",
    );

    if (result.ContentLength) {
      res.setHeader("Content-Length", result.ContentLength);
    }

    result.Body.pipe(res);
  } catch (error) {
    console.error("Error fetching user assets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getCommunityAssets = async (req, res) => {
  try {
    const assetId = req.params.assetId;
    if (!assetId) {
      return res
        .status(400)
        .json({ error: "Bad Request: Asset ID is required" });
    }
    if (!(await objectExists(communityMinio, process.env.COMMUNITY_MINIO_BUCKET, assetId))) {
      return res.status(404).json({ error: "Asset not found" });
    }
    const result = await communityMinio.send(
      new GetObjectCommand({
        Bucket: process.env.COMMUNITY_MINIO_BUCKET,
        Key: assetId,
      }),
    );

    if (req.user.role === "super_admin") {
      res.setHeader(
        "Content-Type",
        result.ContentType || "application/octet-stream",
      );

      if (result.ContentLength) {
        res.setHeader("Content-Length", result.ContentLength);
      }

      result.Body.pipe(res);
      return;
    }

    if (!result.Metadata?.service !== "Community Service")
      return res
        .status(400)
        .json({ error: "Bad Request: Asset does not belong to a community" });

    const communitySlug = result.Metadata?.communityslug;

    if (!communitySlug) {
      return res.status(400).json({ error: "Bad Request: Asset deformed" });
    }

    const communityRes = await axios.get(
      "http://community/internal/communities/" + communitySlug,
    );

    if (communityRes.status !== 200) {
      return res
        .status(400)
        .json({ error: "Bad Request: Community not found" });
    }

    if (communityRes.data.community.visibility === "public") {
      res.setHeader(
        "Content-Type",
        result.ContentType || "application/octet-stream",
      );

      if (result.ContentLength) {
        res.setHeader("Content-Length", result.ContentLength);
      }
      result.Body.pipe(res);
      return;
    }

    const memberRes = await axios.get(
      "http://membership/internal/userRole/" +
      req.user.id +
      "/" +
      communityRes.data.community.id,
    );

    if (memberRes.status !== 200 || !memberRes.data.role) {
      return res
        .status(403)
        .json({ error: "Forbidden: User is not a member of the community" });
    }

    if (memberRes.data.role === "normal")
      return res
        .status(403)
        .json({ error: "Forbidden: User is not a member of the community" });

    res.setHeader(
      "Content-Type",
      result.ContentType || "application/octet-stream",
    );

    if (result.ContentLength) {
      res.setHeader("Content-Length", result.ContentLength);
    }

    result.Body.pipe(res);
    return;
  } catch (error) {
    console.error("Error fetching community assets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getContentAsset = async (req, res) => {
  try {
    const assetId = req.params.assetId;
    if (!assetId) {
      return res
        .status(400)
        .json({ error: "Bad Request: Asset ID is required" });
    }

    if (!(await objectExists(contentMinio, process.env.CONTENT_MINIO_BUCKET, assetId))) {
      return res.status(404).json({ error: "Asset not found" });
    }

    const result = await contentMinio.send(
      new GetObjectCommand({
        Bucket: process.env.CONTENT_MINIO_BUCKET,
        Key: assetId,
      }),
    );

    if (req.user.role === "super_admin") {
      res.setHeader(
        "Content-Type",
        result.ContentType || "application/octet-stream",
      );

      if (result.ContentLength) {
        res.setHeader("Content-Length", result.ContentLength);
      }

      result.Body.pipe(res);
      return;
    }

    const contentReq = await axios.get(
      "http://content/internal/contents/" + result.Metadata?.contentid,
    );

    if (contentReq.status !== 200) {
      return res.status(400).json({ error: "Bad Request: Content not found" });
    }

    if (
      (contentReq.data.content.visibility === "member" ||
        contentReq.data.content.visibility === "moderator") &&
      !req.user
    ) {
      return res.status(403).json({
        error: "Forbidden: User is not authorized to access this content",
      });
    }

    //* durum 1 all ise herkes erişebilir
    if (contentReq.data.content.visibility === "all") {
      res.setHeader(
        "Content-Type",
        result.ContentType || "application/octet-stream",
      );

      if (result.ContentLength) {
        res.setHeader("Content-Length", result.ContentLength);
      }

      result.Body.pipe(res);
      return;
    }
    //* durum 2 community_page community açıksa herkes erişebilir
    if (contentReq.data.content.visibility === "community_page") {
      const communityRes = await axios.get(
        "http://community/internal/communities/" +
        contentReq.data.content.community_id,
      );

      if (
        communityRes.status !== 200 ||
        !communityRes.data.community ||
        communityRes.data.community.visibility !== "public"
      ) {
        const memberRes = await axios.get(
          "http://membership/internal/userRole/" +
          req.user.id +
          "/" +
          contentReq.data.content.community_id,
        );
        if (memberRes.status !== 200 || !memberRes.data.role) {
          return res.status(403).json({
            error: "Forbidden: User is not a member of the community",
          });
        }

        if (memberRes.data.role === "normal")
          return res.status(403).json({
            error: "Forbidden: User is not a member of the community",
          });
      }
      res.setHeader(
        "Content-Type",
        result.ContentType || "application/octet-stream",
      );

      if (result.ContentLength) {
        res.setHeader("Content-Length", result.ContentLength);
      }

      result.Body.pipe(res);
      return;
    }

    //* durum 3 member ise sadece member ve moderator erişebilir
    if (contentReq.data.content.visibility === "member") {
      const memberRes = await axios.get(
        "http://membership/internal/userRole/" +
        req.user.id +
        "/" +
        contentReq.data.content.community_id,
      );

      if (memberRes.status !== 200 || !memberRes.data.role) {
        return res.status(403).json({
          error: "Forbidden: User is not a member of the community",
        });
      }

      if (memberRes.data.role === "normal")
        return res.status(403).json({
          error: "Forbidden: User is not a member of the community",
        });

      res.setHeader(
        "Content-Type",
        result.ContentType || "application/octet-stream",
      );

      if (result.ContentLength) {
        res.setHeader("Content-Length", result.ContentLength);
      }

      result.Body.pipe(res);
      return;
    }

    //* durum 4 moderator ise sadece moderator ya da admin erişebilir
    if (contentReq.data.content.visibility === "moderator") {
      const memberRes = await axios.get(
        "http://membership/internal/userRole/" +
        req.user.id +
        "/" +
        contentReq.data.content.community_id,
      );

      if (memberRes.status !== 200 || !memberRes.data.role) {
        return res.status(403).json({
          error: "Forbidden: User is not a member of the community",
        });
      }

      if (
        memberRes.data.role !== "moderator" &&
        memberRes.data.role !== "admin"
      )
        return res.status(403).json({
          error: "Forbidden: User is not a moderator or admin of the community",
        });

      res.setHeader(
        "Content-Type",
        result.ContentType || "application/octet-stream",
      );

      if (result.ContentLength) {
        res.setHeader("Content-Length", result.ContentLength);
      }

      result.Body.pipe(res);
      return;
    }

    return res.status(400).json({
      error: "Bad Request: Invalid or unrecognized status provided.",
    });
  } catch (error) {
    console.error("Error fetching content asset:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
