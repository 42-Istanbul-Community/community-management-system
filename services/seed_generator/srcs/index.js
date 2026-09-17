const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const NUM_USERS = 50;
const NUM_COMMUNITIES = 20;
const NUM_ANNOUNCEMENTS_PER_COMMUNITY = 5;
const NUM_EVENTS_PER_COMMUNITY = 5;

const userIds = Array.from({ length: NUM_USERS }, () => crypto.randomUUID());
const communityIds = Array.from({ length: NUM_COMMUNITIES }, () =>
    crypto.randomUUID(),
);
const tagIds = Array.from({ length: 8 }, () => crypto.randomUUID());

const communityMemberships = {};
const memberRoles = ["member", "moderator"];

communityIds.forEach((cId) => {
    const members = [];
    while (members.length < 3) {
        const u = userIds[Math.floor(Math.random() * userIds.length)];
        if (!members.find((m) => m.userId === u)) {
            const role =
                members.length === 0
                    ? "admin"
                    : memberRoles[Math.floor(Math.random() * memberRoles.length)];
            members.push({ userId: u, role });
        }
    }
    communityMemberships[cId] = members;
});


const getRandomInt = (max) => Math.floor(Math.random() * max);

const generateIdSeed = () => {
    let sql = "";
    const role = "normal";

    userIds.forEach((id, index) => {
        const name = `User_${index + 1}`;
        const picture = `https://picsum.photos/seed/${id}/200/300`;
        sql += `INSERT INTO users (id, name, role, picture)\nVALUES ('${id}', '${name}', '${role}', '${picture}');\n\n`;
    });

    return sql;
};

const generateAuthSeed = () => {
    let sql = "";

    userIds.forEach((id, index) => {
        const email = `user${index + 1}@example.com`;
        const hash = "$2b$10$dummyHash1234567890dummyHash1234567890";
        sql += `INSERT INTO user_auth (id, email, password_hash)\nVALUES ('${id}', '${email}', '${hash}');\n\n`;
    });

    return sql;
};

const generateCommunitySeed = () => {
    let sql = "";
    const statuses = ["active", "inactive"];
    const visibilities = ["public", "private"];
    const accesses = ["open", "restricted", "closed"];

    communityIds.forEach((id, index) => {
        const name = `Community ${index + 1}`;
        const slug = `community-${index + 1}`;
        const description = `This is a generic description for ${name}. Great place to hang out.`;
        const status = statuses[getRandomInt(statuses.length)];
        const visibility = visibilities[getRandomInt(visibilities.length)];
        const access = accesses[getRandomInt(accesses.length)];
        const rulesPath = "https://pdfobject.com/pdf/sample-3pp.pdf";

        sql += `INSERT INTO communities (id, name, slug, description, status, visibility, access, rules_path)\nVALUES ('${id}', '${name}', '${slug}', '${description}', '${status}', '${visibility}', '${access}', '${rulesPath}');\n\n`;
    });

    sql += "";
    const tagNames = [
        "Programming",
        "Design",
        "Gaming",
        "Music",
        "Movies",
        "Books",
        "Sports",
        "Art",
    ];
    tagIds.forEach((id, index) => {
        sql += `INSERT INTO tags (id, name) VALUES ('${id}', '${tagNames[index]}');\n`;
    });

    sql += "\n";
    communityIds.forEach((communityId) => {
        const t1 = tagIds[getRandomInt(tagIds.length)];
        let t2 = tagIds[getRandomInt(tagIds.length)];
        while (t1 === t2) t2 = tagIds[getRandomInt(tagIds.length)];

        sql += `INSERT INTO community_tags (community_id, tag_id) VALUES ('${communityId}', '${t1}');\n`;
        sql += `INSERT INTO community_tags (community_id, tag_id) VALUES ('${communityId}', '${t2}');\n`;
    });

    return sql + "\n";
};

const generateContentSeed = () => {
    let sql = "";
    const visibilities = ["all", "community_page", "member", "moderator"];
    const eventAccesses = ["all", "member", "moderator"];

    communityIds.forEach((communityId, cIndex) => {
        for (let i = 0; i < NUM_ANNOUNCEMENTS_PER_COMMUNITY; i++) {
            const id = crypto.randomUUID();
            const members = communityMemberships[communityId];
            const authorId = members[getRandomInt(members.length)].userId;
            const title = `Announcement ${i + 1} - Community ${cIndex + 1}`;
            const content = `Welcome to our latest announcement! Stay tuned for more updates.`;
            const visibility = visibilities[getRandomInt(visibilities.length)];
            const attachments = JSON.stringify([
                { url: `https://picsum.photos/seed/${id}/200/300`, type: "image" },
            ]);

            sql += `INSERT INTO announcements (id, community_id, author_id, title, content, attachments, visibility)\nVALUES ('${id}', '${communityId}', '${authorId}', '${title}', '${content}', '${attachments}', '${visibility}');\n\n`;
        }

        for (let i = 0; i < NUM_EVENTS_PER_COMMUNITY; i++) {
            const eventId = crypto.randomUUID();
            const members = communityMemberships[communityId];
            const eventAuthorId = members[getRandomInt(members.length)].userId;
            const eventTitle = `Event: Gathering for Community ${cIndex + 1}`;
            const eventContent = `Join us for an amazing time! Everyone is welcome.`;
            const capacity = 20 + getRandomInt(80);
            const attachments = JSON.stringify([
                { url: `https://picsum.photos/seed/${eventId}/200/300`, type: "image" },
            ]);
            const visibility = visibilities[getRandomInt(visibilities.length)];
            const access = eventAccesses[getRandomInt(eventAccesses.length)];

            sql += `INSERT INTO events (id, community_id, author_id, title, content, capacity, attachments, visibility, access, start_at, end_at)\nVALUES ('${eventId}', '${communityId}', '${eventAuthorId}', '${eventTitle}', '${eventContent}', ${capacity}, '${attachments}', '${visibility}', '${access}', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 4 hours');\n\n`;

            const participantStatuses = ["requested", "joined", "no_show"];
            const eventParticipants = [];

            let eligibleParticipants = [];
            const communityMembers = communityMemberships[communityId];

            if (access === "member") {
                eligibleParticipants = communityMembers.map((m) => m.userId);
            } else if (access === "moderator") {
                eligibleParticipants = communityMembers
                    .filter((m) => m.role === "moderator" || m.role === "admin")
                    .map((m) => m.userId);
            } else {
                eligibleParticipants = userIds;
            }

            const numParticipants = Math.min(2, eligibleParticipants.length);
            while (
                eventParticipants.length < numParticipants &&
                eligibleParticipants.length > 0
            ) {
                const u =
                    eligibleParticipants[getRandomInt(eligibleParticipants.length)];
                if (!eventParticipants.includes(u)) eventParticipants.push(u);
            }

            eventParticipants.forEach((userId) => {
                const pId = crypto.randomUUID();
                const pStatus =
                    participantStatuses[getRandomInt(participantStatuses.length)];
                sql += `INSERT INTO events_participants (id, event_id, user_id, status)\nVALUES ('${pId}', '${eventId}', '${userId}', '${pStatus}');\n\n`;
            });
        }
    });

    return sql;
};

const generateMembershipSeed = () => {
    let sql = "";

    const defaultModPerms = JSON.stringify([
        "seeRequests",
        "resolveRequests",
        "kickMembers",
        "setPermissions",
        "setVisibility",
        "setAccessibility",
        "setDescription"
    ]);

    communityIds.forEach((communityId) => {
        const permId = crypto.randomUUID();
        sql += `INSERT INTO moderator_permissions (id, community_id, permission)\nVALUES ('${permId}', '${communityId}', '${defaultModPerms}');\n\n`;

        const members = communityMemberships[communityId];

        members.forEach(({ userId, role }) => {
            const id = crypto.randomUUID();
            sql += `INSERT INTO community_members (id, community_id, user_id, role)\nVALUES ('${id}', '${communityId}', '${userId}', '${role}');\n\n`;
        });
    });

    return sql;
};

const writeSeedFile = (serviceName, sqlContent) => {
    const dirPath = path.join(__dirname, "..", "..", serviceName, "seed");

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, "001_seed.sql");
    fs.writeFileSync(filePath, sqlContent, "utf-8");
    console.log(`Generated seed for ${serviceName} -> ${filePath}`);
};

const main = () => {
    console.log("Generating relational seeds...");

    writeSeedFile("id", generateIdSeed());
    writeSeedFile("auth", generateAuthSeed());
    writeSeedFile("community", generateCommunitySeed());
    writeSeedFile("content", generateContentSeed());
    writeSeedFile("membership", generateMembershipSeed());

    console.log("Done! All seed files have been created.");
};

main();
