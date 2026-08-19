const axios = require("axios");

const AdminEmail = process.env.ADMIN_EMAIL;
const AdminPassword = process.env.ADMIN_PASSWORD;

async function main() {
  try {
    const response = await axios.post("http://auth:3000/internal/register", {
      email: AdminEmail,
      password: AdminPassword,
    });
    console.log("Bootstrap completed successfully.");
    const id = response.data.id;

    const userResponse = await axios.post(
      "http://id:3000/internal/createUser",
      {
        id: id,
        name: "Admin User",
        role: "superadmin",
      },
    );

    console.log("Admin user created successfully:", userResponse.data);
  } catch (error) {
    console.error("Error during bootstrap:", error);
    process.exit(1);
  }
}

main();
