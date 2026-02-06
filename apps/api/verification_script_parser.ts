import { processItems } from "./src/worker/itemUpdate";
import { rozetkaParser } from "./src/services/parser/rozetka";
import { prisma } from "./src";

const TEST_URL = "https://rozetka.com.ua/ua/apple_iphone_15_128gb_black/p393529810/"; // Example available product
const TEST_URL_FAIL = "https://rozetka.com.ua/ua/invalid-product-url-12345/p000000000/"; // Example 404

const verifyParser = async () => {
  console.log("🔍 Verifying Rozetka Parser & Worker...");

  // 1a. Factory & API Test
  console.log("\n1a. Testing Parser API (/parser/parse)...");
  try {
      const apiRes = await fetch("http://localhost:3001/api/v1/client/parser/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: TEST_URL })
      });
      console.log("API Status:", apiRes.status);
      const apiData = await apiRes.json();
      if(apiRes.ok) {
          console.log("✅ API Success:", { name: apiData.data.product.name });
      } else {
          console.error("❌ API Failed:", apiData);
      }
      
      const apiFailRes = await fetch("http://localhost:3001/api/v1/client/parser/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: "https://google.com" }) // Unsupported
      });
      console.log("API Invalid URL Status:", apiFailRes.status); // Should be 400
  } catch (e: any) {
      console.error("❌ API Test Error:", e.message);
  }

  // 1b. Direct Parser Test
  console.log("\n1b. Testing Parser Service (Direct)...");
  try {
    const data = await rozetkaParser.parse(TEST_URL);
    console.log("✅ Parser Success:", { name: data.name, price: data.price });
  } catch (error: any) {
    console.error("❌ Parser Failed:", error.message);
  }

  // 2. Worker Test
  console.log("\n2. Testing Worker execution...");

  // Setup: Create a ParsedItem that needs update
  const item = await prisma.parsedItem.upsert({
    where: { source_url: TEST_URL },
    update: { last_checked_at: new Date(0) }, // Force update
    create: {
      source_url: TEST_URL,
      name: "Old Name",
      price: 0,
      last_checked_at: new Date(0),
    }
  });
  console.log(`- Created/Updated test item: ${item.id}`);
  
  // Setup: Create a broken item
  const failItem = await prisma.parsedItem.upsert({
    where: { source_url: TEST_URL_FAIL },
    update: { last_checked_at: new Date(0) },
    create: {
       source_url: TEST_URL_FAIL,
       name: "Invalid Item",
       last_checked_at: new Date(0)
    }
  });
  console.log(`- Created valid item (${item.id}) and invalid item (${failItem.id})`);

  // Run Worker Logic
  console.log("- Running worker process...");
  await processItems();
  
  // 3. Verify Results
  console.log("\n3. Verifying Database State...");
  
  const updatedItem = await prisma.parsedItem.findUnique({ where: { id: item.id } });
  console.log("✅ Valid Item Status:", updatedItem?.check_status, "| Price:", updatedItem?.price);

  const updatedFailItem = await prisma.parsedItem.findUnique({ where: { id: failItem.id } });
  console.log("✅ Invalid Item Status:", updatedFailItem?.check_status, "| Error Count:", updatedFailItem?.check_error_count);

  const notifications = await prisma.adminNotification.findMany({
      orderBy: { created_at: 'desc' },
      take: 1
  });
  console.log("✅ Latest Admin Notification:", notifications[0]?.message);
};

verifyParser()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
