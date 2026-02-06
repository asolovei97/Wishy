import { fetch } from "bun";

const API_URL = "http://localhost:3001/api/v1/client"; // Guessing prefix based on file structure
// app.ts will reveal the prefix. 
// routes/client/index.ts mounted v1Router at /client.
// index.ts (root) exported clientRouter.
// If app.ts mounts root router at /api/v1 ...
// I'll adjust after seeing app.ts.

const email = `test+${Date.now()}@example.com`;
const password = "password123";
let token = "";
let userId = "";
let wishlistId = "";

const run = async () => {
  console.log("🚀 Starting verification...");

  // 1. Register
  console.log("\n1. Registering User...");
  const registerRes = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      first_name: "Test",
      last_name: "User",
    }),
  });
  
  // Try to parse JSON even on error to see message
  const registerData = await registerRes.json();
  console.log("Status:", registerRes.status);
  if (!registerRes.ok) {
     console.error("Register failed:", registerData);
     // If user exists, try login
  } else {
     console.log("Register success");
     // Usually register returns token or we login
     // My auth handler implementation returns cookie.
     // Does it return token in body?
     // Handler: createSendToken -> res.cookie... .json({ status: "success", user });
     // It does NOT return token in body explicitly in my `base.ts` impl? 
     // `res.cookie("jwt", token...`.
     // Fetch in Bun doesn't automatically handle cookies unless configured?
     // But wait, `createSendToken` in `base.ts`...
     /*
     res.status(statusCode).json({
       status: "success",
       user: this.formatUserResponse(user),
     });
     */
     // It DOES NOT return token in JSON.
     // So I need to get it from Set-Cookie header.
     const setCookie = registerRes.headers.get("set-cookie");
     console.log("Set-Cookie:", setCookie);
     if (setCookie) {
         const match = setCookie.match(/jwt=([^;]+)/);
         if (match) token = match[1];
     }
  }

  if (!token) {
      console.log("Trying to login to get token...");
      const loginRes = await fetch(`${API_URL}/auth/login`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
      });
      const loginData = await loginRes.json();
      console.log("Login Status:", loginRes.status);
      const setCookie = loginRes.headers.get("set-cookie");
      if (setCookie) {
         const match = setCookie.match(/jwt=([^;]+)/);
         if (match) token = match[1];
      }
  }

  if (!token) {
      console.error("❌ No token obtained. Aborting.");
      return;
  }
  console.log("✅ Token obtained.");
  
  const headers = {
      "Content-Type": "application/json",
      "Cookie": `jwt=${token}` // Send as cookie
      // "Authorization": `Bearer ${token}` // And/Or Bearer
  };

  // 2. Update Profile
  console.log("\n2. Updating Profile (/users/me/profile)...");
  // Route mounted at /users/me/profile ?
  // My route index: router.use("/users", userRouter).
  // userRouter: router.patch("/me/profile", ...).
  // combined: /users/me/profile
  const profileRes = await fetch(`${API_URL}/users/me/profile`, {
      method: "PATCH", headers,
      body: JSON.stringify({ first_name: "UpdatedName" })
  });
  console.log("Profile Status:", profileRes.status);
  console.log(await profileRes.json());


  // 3. Create Wishlist
  console.log("\n3. Creating Wishlist (/wishlists)...");
  const wishlistRes = await fetch(`${API_URL}/wishlists`, {
      method: "POST", headers,
      body: JSON.stringify({ title: "My Birthday" })
  });
  const wishlistData = await wishlistRes.json();

  // 3b. List Wishlists
  console.log("\n3b. Listing Wishlists (/wishlists)...");
  const listWishlistsRes = await fetch(`${API_URL}/wishlists`, {
      method: "GET", headers
  });
  console.log("List Wishlists Status:", listWishlistsRes.status);
  const listData = await listWishlistsRes.json();
  console.log("Listed count:", listData?.results); 
  // Should see at least 1 (created above)

  console.log("Wishlist Status:", wishlistRes.status, wishlistData);
  if(wishlistRes.ok) wishlistId = wishlistData.data.wishlist.id;

  if (wishlistId) {
      // 4. Create Parsed Item
      console.log("\n4. Creating Parsed Item...");
      const itemRes = await fetch(`${API_URL}/wishlists/${wishlistId}/items`, {
          method: "POST", headers,
          body: JSON.stringify({
              source_url: "https://example.com/product/123",
              name: "Cool Product",
              price: 100,
              currency: "USD"
          })
      });
      console.log("Parsed Item Status:", itemRes.status);
      console.log(await itemRes.json());

      // 5. Create Custom Item
      console.log("\n5. Creating Custom Item...");
      const customItemRes = await fetch(`${API_URL}/wishlists/${wishlistId}/items`, {
          method: "POST", headers,
          body: JSON.stringify({
              name: "Custom Thing",
              description: "Handmade"
          })
      });
      console.log("Custom Item Status:", customItemRes.status);
      console.log(await customItemRes.json());
      
      // 6. List Items
      console.log("\n6. Listing Items...");
      const listRes = await fetch(`${API_URL}/wishlists/${wishlistId}/items`, {
          method: "GET", headers
      });
      console.log("List Status:", listRes.status);
      console.log(await listRes.json());
  }

};

run();
