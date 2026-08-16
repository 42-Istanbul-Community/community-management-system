const axios = require("axios");

describe("Backend Tests", async () => {
  //* register a beforeAll hook to run before all tests
  //* and login to the API and store the token in a variable
  //* user a - a community access open and visible public
  //* user b - b community restricted open and visible private
  //* user c - c community closed open and visible public
  //* admin - admin account to manage community requests
  beforeAll(() => {});

  //* create community_request
  describe("Create Community Request", () => {
    //* create a community request with user a
    test();

    //* create a community request with user b
    test();

    //* create a community request with user c
    test();
  });

  //* check the community requests with admin account
  test();

  describe("Manage Community Requests", () => {
    //* approve the community request from user a with admin account
    test();

    //* reject the community request from user b with admin account
    test();

    //* reject the community request from user c with admin account
    test();

    //* recreate the community request from user b with admin account
    test();

    //* approve the community request from user b with admin account
    test();
  });

  describe("List Communities", () => {
    //* list communities with user a listes 1 community
    test();

    //* list communities with user b lists 2 community
    test();

    //* list communities with user c lists 1 community
    test();
  });

  //* recreate community request with user c after rejection and approve with admin account
  test();

  describe("List Communities with c community", () => {
    //* list communities with user a listes 2 community
    test();

    //* list communities with user b lists 3 community
    test();

    //* list communities with user c lists 2 community
    test();
  });

  describe("Join Community", () => {
    //* join community with user a to c community fail
    test();

    //* join community with user c to b community success
    test();

    //* join community with user c to a community success
    test();

    //* list communities with user c listes 2 community
    test();

    //* accept the join request from user c to b community with admin account success
    test();

    //* list communities with user c lists 3 community
    test();
  });

  describe("Leave Community", () => {
    //* leave community with user c from b community success
    test();

    //* leave community with user a from c community fail
    test();

    //* leave community with user a from a community *fail* because user a is the owner of the community
  });

  describe("Delete Community", () => {
    //* admin delete b community success
    test();

    //* list user b communities with user b lists 2 community
    test();
  });

  //* admin kick user c from a community success
  test();

  //* list all communities with admin
  //* delete all communities with admin
  //* delete all users with admin
  afterAll(() => {});
});
