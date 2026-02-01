import app from "./app";
import { prisma } from "./src";

process.on("uncaughtException", (err) => {
  console.error(err.name, err.message);
  console.log("UNHANDLED EXEPRION! 💥 Shutting down...");
  process.exit(1);
});

const port = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully! 🚀");

    const server = app.listen(port, () => {
      console.log(`App running on port ${port}...`);
    });

    process.on("unhandledRejection", (err) => {
      if (err instanceof Error) {
        console.error(err.name, err.message);
      }
      console.log("UNHANDLED REJECTION! 💥 Shutting down...");
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error("DATABASE CONNECTION ERROR! 💥 Shutting down...");
    console.error(error);
    process.exit(1);
  }
};

startServer();
