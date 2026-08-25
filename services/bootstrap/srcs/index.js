const axios = require("axios");

const AdminEmail = process.env.ADMIN_EMAIL;

const fs = require("fs");

const AdminPassword = fs
  .readFileSync("/run/secrets/bootstrap_admin_password", "utf8")
  .trim();

async function main() {
  try {
    const response = await axios.post("http://auth/internal/register", {
      email: AdminEmail,
      password: AdminPassword,
    });
    console.log("Bootstrap completed successfully.");
    const id = response.data.id;

    const userResponse = await axios.post(
      "http://id/internal/createUser",
      {
        id: id,
        name: "Admin User",
        role: "super_admin",
      },
    );

    console.log("Admin user created successfully:", userResponse.data);
  } catch (error) {
    console.error("Error during bootstrap:", error);
    process.exit(1);
  }
}

main();
