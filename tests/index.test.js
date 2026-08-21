const users = require("./users.json");
const {
  registerUsers,
  loginUsers,
  createCommunityRequest,
  displayCommunityRequests,
  manageCommunityRequest,
  getCommunities,
  deleteCommunity,
  deleteUser,
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
  //* create community_request
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
          "Message for Community B"
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
          "Message for Community C"
        );
      } catch (error) {
        throw new Error(
          `Error creating community request for user C: ${error.response ? JSON.stringify(error.response.data) : error.message}`,
        );
      }
    });
  });

  //* check the community requests with admin account
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
          "Message for Community B"
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
        "Message for Community C"
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

    //* list communities with user b lists 3 community
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

  // describe("Join Community", () => {
  //   //* join community with user a to c community fail
  //   test();

  //   //* join community with user c to b community success
  //   test();

  //   //* join community with user c to a community success
  //   test();

  //   //* list communities with user c listes 2 community
  //   test();

  //   //* accept the join request from user c to b community with admin account success
  //   test();

  //   //* list communities with user c lists 3 community
  //   test();
  // });

  // describe("Leave Community", () => {
  //   //* leave community with user c from b community success
  //   test();

  //   //* leave community with user a from c community fail
  //   test();

  //   //* leave community with user a from a community *fail* because user a is the owner of the community
  // });

  // describe("Delete Community", () => {
  //   //* admin delete b community success
  //   test();

  //   //* list user b communities with user b lists 2 community
  //   test();
  // });

  // //* admin kick user c from a community success
  // test();

  //* list all communities with admin
  //* delete all communities with admin
  //* delete all users with admin
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
