const axios = require("axios");
const { jwtDecode } = require("jwt-decode");

const registerUsers = async (users) => {
  for (const user of users) {
    try {
      const response = await axios.post(
        "https://api.localhost/orchestration/register",
        user,
      );
      if (response.data.status !== "success") {
        throw new Error(
          `Failed to register user ${user.email}: ${response.data.message}`,
        );
      }
    } catch (error) {
      throw new Error(
        `Error registering user ${user.email}: ${error.response ? error.response.data : error.message}`,
      );
    }
  }
};

const loginUsers = async (users) => {
  const tokens = {};
  for (const user of users) {
    try {
      const response = await axios.post("https://api.localhost/auth/login", {
        email: user.email,
        password: user.password,
      });
      if (response.data.token === undefined) {
        throw new Error(
          `Failed to login user ${user.email}: No token received`,
        );
      }
      tokens[user.email] = response.data.token;
      console.log(`Successfully logged in user: ${user.email}`);
    } catch (error) {
      throw new Error(
        `Error logging in user ${user.email}: ${error.response ? error.response.data : error.message}`,
      );
    }
  }
  return tokens;
};

const createCommunityRequest = async (
  user,
  communityName,
  description,
  visibility,
  access,
) => {
  try {
    const decodedToken = jwtDecode(user.token);
    const response = await axios.post(
      "https://api.localhost/community/createCommunity",
      {
        name: communityName,
        description: description,
        visibility: visibility,
        access: access,
      },
      {
        headers: {
          "X-User-ID": decodedToken.user_id,
          "X-User-Role": decodedToken.role,
        },
      },
    );
    if (response.status !== 201) {
      throw new Error(
        `Failed to create community request for user ${user.email}: ${response.data.message}`,
      );
    }
  } catch (error) {
    throw new Error(
      `Error creating community request for user ${user.email}: ${error.response ? error.response.data : error.message}`,
    );
  }
};

const displayCommunityRequests = async (admin) => {
  try {
    const decodedToken = jwtDecode(admin.token);
    const response = await axios.get(
      "https://api.localhost/community/communityRequests?status=pending",
      {
        headers: {
          "X-User-ID": decodedToken.user_id,
          "X-User-Role": decodedToken.role,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Error displaying community requests for admin ${admin.email}: ${error.response ? error.response.data : error.message}`,
    );
  }
};

const manageCommunityRequest = async (admin, requestId, status) => {
  try {
    const decodedToken = jwtDecode(admin.token);
    const response = await axios.post(
      `https://api.localhost/orchestration/manageCommunityRequests`,
      {
        requestIds: [
          {
            id: requestId,
            status: status,
          },
        ],
      },
      {
        headers: {
          "X-User-ID": decodedToken.user_id,
          "X-User-Role": decodedToken.role,
        },
      },
    );
    if (response.status !== 200) {
      throw new Error(
        `Failed to approve community request with ID ${requestId}: ${response.data.message}`,
      );
    }
  } catch (error) {
    throw new Error(
      `Error approving community request with ID ${requestId}: ${error.response ? error.response.data : error.message}`,
    );
  }
};

const getCommunities = async (user) => {
  try {
    const decodedToken = jwtDecode(user.token);
    const response = await axios.get(
      "https://api.localhost/community/communities",
      {
        headers: {
          "X-User-ID": decodedToken.user_id,
          "X-User-Role": decodedToken.role,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Error fetching communities for user ${user.email}: ${error.response ? error.response.data : error.message}`,
    );
  }
};

const deleteCommunity = async (admin, communitySlug) => {
  try {
    const decodedToken = jwtDecode(admin.token);
    const response = await axios.delete(
      `https://api.localhost/orchestration/communities/${communitySlug}`,
      {
        headers: {
          "X-User-ID": decodedToken.user_id,
          "X-User-Role": decodedToken.role,
        },
      },
    );
    if (response.status !== 200) {
      throw new Error(
        `Failed to delete community with ID ${communitySlug}: ${response.data.message}`,
      );
    }
  } catch (error) {
    throw new Error(
      `Error deleting community with ID ${communitySlug}: ${error.response ? error.response.data : error.message}`,
    );
  }
};

const deleteUser = async (admin, userId) => {
  try {
    const decodedToken = jwtDecode(admin.token);
    const response = await axios.delete(
      `https://api.localhost/orchestration/users/${userId}`,
      {
        headers: {
          "X-User-ID": decodedToken.user_id,
          "X-User-Role": decodedToken.role,
        },
      },
    );
    if (response.status !== 200) {
      throw new Error(
        `Failed to delete user with ID ${userId}: ${response.data.message}`,
      );
    }
  } catch (error) {
    throw new Error(
      `Error deleting user with ID ${userId}: ${error.response ? error.response.data : error.message}`,
    );
  }
};

module.exports = {
  registerUsers,
  loginUsers,
  createCommunityRequest,
  displayCommunityRequests,
  manageCommunityRequest,
  getCommunities,
  deleteCommunity,
  deleteUser,
};
