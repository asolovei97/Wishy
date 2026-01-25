import { Role } from '@api/generated/prisma/enums';
import { prisma } from '../src/lib/prisma/client';

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Global Settings
  const settings = await prisma.globalSettings.create({
    data: {
      allowed_sites: [
        { domain: 'rozetka.com.ua', freshness_days: 7 },
        { domain: 'aliexpress.com', freshness_days: 3 },
        { domain: 'amazon.com', freshness_days: 5 },
      ],
    },
  });
  console.log('✅ Global Settings seeded');

  // 2. Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@wishy.app' },
    update: {},
    create: {
      email: 'admin@wishy.app',
      first_name: 'Super',
      last_name: 'Admin',
      role: Role.ADMIN,
      avatar_url: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    },
  });
  console.log('✅ Admin user seeded:', admin.email);

  // 3. User with Wishlist
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      first_name: 'Alice',
      last_name: 'Wonderland',
      role: Role.USER,
      wishlists: {
        create: {
          title: "Alice's Birthday",
          description: "My 25th birthday wishlist!",
          is_private: false,
          items: {
            create: [
              {
                name: 'iPhone 15 Pro',
                description: 'Titanium Black, 256GB',
                price: 999.00,
                currency: 'USD',
                source_url: 'https://apple.com/iphone',
                is_parsed: false,
              },
              {
                name: 'Kindle Paperwhite',
                price: 139.99,
                currency: 'USD',
                source_url: 'https://amazon.com/kindle',
                is_parsed: true,
              },
            ],
          },
        },
      },
    },
  });
  console.log('✅ User 1 seeded (with wishlist):', user1.email);

  // 4. Empty User
  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      first_name: 'Bob',
      last_name: 'Builder',
      role: Role.USER,
    },
  });
  console.log('✅ User 2 seeded (empty):', user2.email);

  console.log('🏁 Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
