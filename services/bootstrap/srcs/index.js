const axios = require("axios");

const AdminEmail = process.env.ADMIN_EMAIL;

const fs = require("fs");

const AdminPassword = fs
  .readFileSync("/run/secrets/bootstrap_admin_password", "utf8")
  .trim();

axios.defaults.validateStatus = function (status) {
  return status >= 200 && status < 600;
};

async function main() {
  try {
    const response = await axios.post("http://auth/internal/register", {
      email: AdminEmail,
      password: AdminPassword,
    });
    if (response.status > 299) {
      console.error("Error during bootstrap:", response.data);
      throw new Error("Bootstrap failed in auth registration with status: " + response.status);
    }
    console.log("Bootstrap completed successfully.");
    const id = response.data.id;

    const userResponse = await axios.post("http://id/internal/createUser", {
      id: id,
      name: "Admin User",
      role: "super_admin",
    });

    if (userResponse.status > 299) {
      await axios.delete(`http://auth/internal/user/${id}`);
      console.error("Error during bootstrap:", userResponse.data);
      throw new Error("Bootstrap failed in id createUser with status: " + userResponse.status);
    }

    console.log("Admin user created successfully:", userResponse.data);
  } catch (error) {
    console.error("Error during bootstrap:", error);
    process.exit(1);
  }
}

main();
