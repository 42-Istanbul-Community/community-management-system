const users = require("./users.json");
const { jwtDecode } = require("jwt-decode");
jest.setTimeout(30000);
const {
  registerUsers,
  loginUsers,
  createCommunityRequest,
  displayCommunityRequests,
  manageCommunityRequest,
  getCommunities,
  deleteCommunity,
  deleteUser,
  joinCommunity,
  displayJoinRequests,
  manageJoinRequest,
  leaveCommunity,
  kickMember,
} = require("./utils");

const admin = users.admins[0];
const userA = users.users[0];
const userB = users.users[1];
const userC = users.users[2];

describe("Backend Tests", () => {
  //* register a beforeAll hook to run before all tests
  //* and login to the API and store the token in a variable
  //* user a - a community access open and visible public
  //* user b - b community restricted open and visible private
  //* user c - c community closed open and visible public
  //* admin - admin account to manage community requests
  beforeAll(async () => {
    await registerUsers([userA, userB, userC]);

    const tokens = await loginUsers([userA, userB, userC, admin]);
    userA.token = tokens[userA.email];
    userB.token = tokens[userB.email];
    userC.token = tokens[userC.email];
    admin.token = tokens[admin.email];
  });

  let communityRequests = [];
  describe("Create Community Request", () => {
    test("User A can create a community request", async () => {
      try {
        await createCommunityRequest(
          userA,
          "Community A",
          "Description A",
          "public",
          "open",
          "Message for Community A",
        );
      } catch (error) {
        throw new Error(
          `Error creating community request for user A: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });

    test("User B can create a community request", async () => {
      try {
        await createCommunityRequest(
          userB,
          "Community B",
          "Description B",
          "private",
          "restricted",
          "Message for Community B",
        );
      } catch (error) {
        throw new Error(
          `Error creating community request for user B: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });

    test("User C can create a community request", async () => {
      try {
        await createCommunityRequest(
          userC,
          "Community C",
          "Description C",
          "public",
          "closed",
          "Message for Community C",
        );
      } catch (error) {
        throw new Error(
          `Error creating community request for user C: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });
  });

  test("Admin can view all community requests", async () => {
    try {
      communityRequests = await displayCommunityRequests(admin);
      expect(communityRequests).toBeInstanceOf(Array);
      expect(communityRequests.length).toBe(3);
    } catch (error) {
      throw new Error(
        `Error displaying community requests for admin ${admin.email}: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
      );
    }
  });

  describe("Manage Community Requests", () => {
    let ida, idb, idc;

    beforeAll(() => {
      ida = communityRequests.findIndex(
        (request) => request.name === "Community A",
      );
      idb = communityRequests.findIndex(
        (request) => request.name === "Community B",
      );
      idc = communityRequests.findIndex(
        (request) => request.name === "Community C",
      );
    });

    test("approve the community request from user a with admin account", async () => {
      try {
        await manageCommunityRequest(
          admin,
          communityRequests[ida].id,
          "approved",
        );
      } catch (error) {
        throw new Error(
          `Error managing community request for user A: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });

    test("reject the community request from user b with admin account", async () => {
      try {
        await manageCommunityRequest(
          admin,
          communityRequests[idb].id,
          "rejected",
        );
      } catch (error) {
        throw new Error(
          `Error managing community request for user B: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });

    test("reject the community request from user c with admin account", async () => {
      try {
        await manageCommunityRequest(
          admin,
          communityRequests[idc].id,
          "rejected",
        );
      } catch (error) {
        throw new Error(
          `Error managing community request for user C: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });

    test("recreate the community request from user b after rejection and approve with admin account", async () => {
      try {
        await createCommunityRequest(
          userB,
          "Community B",
          "Description B",
          "private",
          "restricted",
          "Message for Community B",
        );
      } catch (error) {
        throw new Error(
          `Error creating community request for user B: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });

    test("approve the community request from user b with admin account", async () => {
      try {
        const newcommunityRequests = await displayCommunityRequests(admin);
        let idb = communityRequests.findIndex(
          (request) => request.name === "Community B",
        );
        communityRequests[idb] = newcommunityRequests.find(
          (request) => request.name === "Community B",
        );
        await manageCommunityRequest(
          admin,
          communityRequests[idb].id,
          "approved",
        );
      } catch (error) {
        throw new Error(
          `Error managing community request for user B: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });
  });

  describe("List Communities", () => {
    test("List communities with user a lists 1 community", async () => {
      try {
        const communities = await getCommunities(userA);
        expect(communities).toBeInstanceOf(Array);
        expect(communities.length).toBe(1);
      } catch (error) {
        throw new Error(
          `Error listing communities for user A: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });

    test("List communities with user b lists 2 community", async () => {
      try {
        const communities = await getCommunities(userB);
        expect(communities).toBeInstanceOf(Array);
        expect(communities.length).toBe(2);
      } catch (error) {
        throw new Error(
          `Error listing communities for user B: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });

    test("List communities with user c lists 1 community", async () => {
      try {
        const communities = await getCommunities(userC);
        expect(communities).toBeInstanceOf(Array);
        expect(communities.length).toBe(1);
      } catch (error) {
        throw new Error(
          `Error listing communities for user C: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });
  });

  test("Recreate community request with user c after rejection and approve with admin account", async () => {
    try {
      await createCommunityRequest(
        userC,
        "Community C",
        "Description C",
        "private",
        "restricted",
        "Message for Community C",
      );
      const communityRequests = await displayCommunityRequests(admin);
      let idc = communityRequests.findIndex(
        (request) => request.name === "Community C",
      );
      await manageCommunityRequest(
        admin,
        communityRequests[idc].id,
        "approved",
      );
    } catch (error) {
      throw new Error(
        `Error managing community request for user C: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
      );
    }
  });

  describe("List Communities with c community", () => {
    test("List communities with user c lists 2 community", async () => {
      try {
        const communities = await getCommunities(userC);
        expect(communities).toBeInstanceOf(Array);
        expect(communities.length).toBe(2);
      } catch (error) {
        throw new Error(
          `Error listing communities for user C: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });

    test("List communities with user b lists 3 community", async () => {
      try {
        const communities = await getCommunities(userB);
        expect(communities).toBeInstanceOf(Array);
        expect(communities.length).toBe(3);
      } catch (error) {
        throw new Error(
          `Error listing communities for user B: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });

    //* list communities with user c lists 2 community
    test("List communities with user c lists 2 community", async () => {
      try {
        const communities = await getCommunities(userC);
        expect(communities).toBeInstanceOf(Array);
        expect(communities.length).toBe(2);
      } catch (error) {
        throw new Error(
          `Error listing communities for user C: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });
  });

  describe("Join Community", () => {
    let communities = [];
    beforeAll(async () => {
      try {
        communities = await getCommunities(admin);
      } catch (error) {
        throw new Error(
          `Error getting communities for admin: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });

    test("join community with user a to c community fail", async () => {
      try {
        const cCommunity = communities.find(
          (community) => community.name === "Community C",
        );
        const joinResponse = await joinCommunity(userA, cCommunity.id);
        expect(joinResponse.status).toBe(403);
        expect(joinResponse.data.error).toBe("Community is closed");
      } catch (error) {
        throw new Error(
          `Error joining community with user A to C community: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });

    test("join community with user c to b community success", async () => {
      try {
        const bCommunity = communities.find(
          (community) => community.name === "Community B",
        );
        const joinResponse = await joinCommunity(userC, bCommunity.id);
        expect(joinResponse.status).toBe(201);
        expect(joinResponse.data).toHaveProperty("status", "pending");
        expect(joinResponse.data).toHaveProperty("id");
      } catch (error) {
        throw new Error(
          `Error joining community with user C to B community: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });

    test("join community with user c to a community success", async () => {
      try {
        const aCommunity = communities.find(
          (community) => community.name === "Community A",
        );
        const joinResponse = await joinCommunity(userC, aCommunity.id);
        expect(joinResponse.status).toBe(201);
        expect(joinResponse.data).toHaveProperty("role", "member");
      } catch (error) {
        throw new Error(
          `Error joining community with user C to A community: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });

    test("list communities with user c lists 2 community", async () => {
      try {
        const communities = await getCommunities(userC);
        expect(communities.length).toBe(2);
      } catch (error) {
        throw new Error(
          `Error listing communities with user C: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });

    test("accept the join request from user c to b community with a account", async () => {
      try {
        const bCommunity = communities.find(
          (community) => community.name === "Community B",
        );
        const joinResponses = await displayJoinRequests(userA, bCommunity.id);
        expect(joinResponses.status).toBe(403);
        expect(joinResponses.data.error).toBe("Access denied");
      } catch (error) {
        throw new Error(
          `Error accepting join request from user C to B community with user B: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });

    test("accept the join request from user c to b community with b account", async () => {
      try {
        const bCommunity = communities.find(
          (community) => community.name === "Community B",
        );
        const joinResponses = await displayJoinRequests(userB, bCommunity.id);
        console.log("Join Responses:", joinResponses.data);
        const joinRequest = joinResponses.data.requests[0];
        const manageResponse = await manageJoinRequest(
          userB,
          joinRequest.id,
          "approve",
          bCommunity.id
        );
        expect(manageResponse.status).toBe(200);
      } catch (error) {
        throw new Error(
          `Error accepting join request from user C to B community with user B: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });

    test("list communities with user c lists 3 community", async () => {
      try {
        const communities = await getCommunities(userC);
        expect(communities.length).toBe(3);
      } catch (error) {
        throw new Error(
          `Error listing communities with user C: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });
  });

  describe("Leave Community", () => {
    test("leave community with user c from b community", async () => {
      try {
        const communities = await getCommunities(userC);
        const bCommunity = communities.find(
          (community) => community.name === "Community B",
        );
        const leaveResponse = await leaveCommunity(userC, bCommunity.id);
        expect(leaveResponse.status).toBe(200);
        expect(leaveResponse.data).toHaveProperty(
          "message",
          "Left community successfully",
        );
      } catch (error) {
        throw new Error(
          `Error leaving community with user C: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });

    test("leave community with user a from c community", async () => {
      try {
        const communities = await getCommunities(userA);
        const cCommunity = communities.find(
          (community) => community.name === "Community C",
        );
        const leaveResponse = await leaveCommunity(userA, cCommunity.id);
        expect(leaveResponse.status).toBe(404);
        expect(leaveResponse.data.error).toBe("Membership not found");
      } catch (error) {
        throw new Error(
          `Error leaving community with user A: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });

    test("leave community with user a from a community", async () => {
      try {
        const communities = await getCommunities(userA);
        const aCommunity = communities.find(
          (community) => community.name === "Community A",
        );
        const leaveResponse = await leaveCommunity(userA, aCommunity.id);
        expect(leaveResponse.status).toBe(403);
        expect(leaveResponse.data.error).toBe(
          "Owner cannot leave the community",
        );
      } catch (error) {
        throw new Error(
          `Error leaving community with user A: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });
  });



  // kick user c in a community with user a
  describe("Kick Member", () => {
    test("kick a user with user c from a community", async () => {
      try {
        const communities = await getCommunities(userC);
        const aCommunity = communities.find(
          (community) => community.name === "Community A",
        );
        const kickResponse = await kickMember(userC, aCommunity.id, userA);
        expect(kickResponse.status).toBe(403);
        expect(kickResponse.data.error).toBe("Access denied");
      } catch (error) {
        throw new Error(
          `Error kicking member with user C: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });

    test("kick c user with user a from a community", async () => {
      try {
        const communities = await getCommunities(userA);
        const aCommunity = communities.find(
          (community) => community.name === "Community A",
        );
        const kickResponse = await kickMember(userA, aCommunity.id, userC);
        expect(kickResponse.status).toBe(200);
        expect(kickResponse.data).toHaveProperty("message", "Member kicked successfully");
      } catch (error) {
        throw new Error(
          `Error kicking member with user A: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });

    test("kick a user wtih a user from a community", async () => {
      try {
        const communities = await getCommunities(userA);
        const aCommunity = communities.find(
          (community) => community.name === "Community A",
        );
        const kickResponse = await kickMember(userA, aCommunity.id, userA);
        expect(kickResponse.status).toBe(403);
        expect(kickResponse.data.error).toBe("Cannot kick yourself");
      } catch (error) {
        throw new Error(
          `Error kicking member with user A: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });
  });

  afterAll(async () => {
    try {
      const communities = await getCommunities(admin);
      for (const community of communities) {
        await deleteCommunity(admin, community.id);
      }
    } catch (error) {
      throw new Error(
        `Error deleting communities with admin: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
      );
    }

    try {
      for (const user of [userA, userB, userC]) {
        await deleteUser(admin, user);
      }
    } catch (error) {
      throw new Error(
        `Error deleting users with admin: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
      );
    }
  });
});
