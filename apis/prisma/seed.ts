/**
 * Full marketplace seed for UI / layout testing.
 *
 * Volume
 * ------
 * - 10 users (each owns 1 shop) + 1 admin (no shop)
 * - 10 shops: 3 VERIFIED, 3 PENDING, 2 UNVERIFIED, 2 REJECTED
 * - 100 products per shop → 1,000 products
 * - 10 ratings per product → 10,000 ratings (one from each of the 10 sellers)
 * - Orders / sales across all statuses; shop #1 gets a heavy sales book
 *
 * Auth (optional)
 * ---------------
 * If SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set, also creates matching
 * auth.users so you can log in. Password for all seed accounts:
 *   SeedPass123!
 *
 * Run:  npm run prisma:seed
 */
import "dotenv/config";
import { randomUUID } from "crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  AuthProvider,
  VerificationStatus,
  OrderStatus,
  UserRole,
} from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString:
    (process.env.DIRECT_URL || process.env.DATABASE_URL) as string,
});
const prisma = new PrismaClient({ adapter });

const SEED_PASSWORD = "SeedPass123!";
const EMAIL_DOMAIN = "sashastore.ng";
const PRODUCTS_PER_SHOP = 100;
const RATINGS_PER_PRODUCT = 10;
const BATCH = 500;

/** Deterministic UUIDs so re-seeds stay stable. */
function seedUuid(n: number): string {
  const hex = n.toString(16).padStart(12, "0");
  return `aaaaaaaa-bbbb-4ccc-8ddd-${hex}`;
}

const ADMIN_ID = "aaaaaaaa-bbbb-4ccc-8ddd-000000000099";

const RATING_COMMENTS = [
  "I got a perfume here, it is nice",
  "Long lasting scent — will buy again",
  "Packaging was neat, seller was helpful",
  "Good value for Port Harcourt delivery",
  "Fresh and clean fragrance",
  "A bit strong at first, settles nicely",
  "Exactly as described",
  "Gift-worthy quality",
  "Fast response from the shop",
  "Would recommend to friends",
];

/** Fictional / unbranded catalog — names matched to perfume & cream stock photos. */
const PRODUCT_CATALOG = [
  {
    name: "Noir Amber Eau de Parfum",
    category: "Perfume",
    description: "Warm amber and soft woods in a long-wearing evening scent.",
    imageUrl:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=750&fit=crop&q=80",
    price: 18500,
  },
  {
    name: "Velvet Rose Parfum",
    category: "Perfume",
    description: "Romantic rose petals with a creamy musky dry-down.",
    imageUrl:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=750&fit=crop&q=80",
    price: 22000,
  },
  {
    name: "Citrus Grove Cologne",
    category: "Fragrance",
    description: "Bright bergamot and orange blossom for warm Port Harcourt days.",
    imageUrl:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=750&fit=crop&q=80",
    price: 9800,
  },
  {
    name: "Oud Ember Attar",
    category: "Perfume",
    description: "Rich oud oil with smoky spice — concentrated and lasting.",
    imageUrl:
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&h=750&fit=crop&q=80",
    price: 27500,
  },
  {
    name: "Jasmine Night Mist",
    category: "Fragrance",
    description: "Soft jasmine body mist for layering or light daytime wear.",
    imageUrl:
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&h=750&fit=crop&q=80",
    price: 6500,
  },
  {
    name: "Sandalwood Drift Eau de Toilette",
    category: "Perfume",
    description: "Creamy sandalwood with a clean, modern finish.",
    imageUrl:
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600&h=750&fit=crop&q=80",
    price: 14200,
  },
  {
    name: "Gold Cap Luxury Spray",
    category: "Perfume",
    description: "Elegant bottle, warm vanilla-spice trail.",
    imageUrl:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=750&fit=crop&q=80",
    price: 19800,
  },
  {
    name: "Crystal Bloom Fragrance",
    category: "Fragrance",
    description: "Floral bouquet with a sparkling top note.",
    imageUrl:
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&h=750&fit=crop&q=80",
    price: 12500,
  },
  {
    name: "Midnight Musk Roll-on",
    category: "Perfume",
    description: "Travel-friendly musk oil for pulse points.",
    imageUrl:
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&h=750&fit=crop&q=80",
    price: 4500,
  },
  {
    name: "Ivory Pearl Body Cream",
    category: "Body care",
    description: "Rich shea cream that softens and lightly scents the skin.",
    imageUrl:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=750&fit=crop&q=80",
    price: 7200,
  },
  {
    name: "Silk Glow Face Cream",
    category: "Beauty",
    description: "Lightweight moisturizer for a smooth, dewy finish.",
    imageUrl:
      "https://images.unsplash.com/photo-1570194065650-d99fbce4a0ca?w=600&h=750&fit=crop&q=80",
    price: 8900,
  },
  {
    name: "Honey Butter Body Lotion",
    category: "Body care",
    description: "Nourishing lotion with a soft honey-vanilla scent.",
    imageUrl:
      "https://images.unsplash.com/photo-1608248543808-cefaea4c6697?w=600&h=750&fit=crop&q=80",
    price: 5800,
  },
  {
    name: "Spa Jar Whipped Cream",
    category: "Body care",
    description: "Whipped body cream for after-bath softness.",
    imageUrl:
      "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=600&h=750&fit=crop&q=80",
    price: 6400,
  },
  {
    name: "Rose Petal Hand Cream",
    category: "Beauty",
    description: "Small-tube hand cream with a gentle rose scent.",
    imageUrl:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&h=750&fit=crop&q=80",
    price: 3200,
  },
  {
    name: "Coconut Milk Body Butter",
    category: "Body care",
    description: "Thick body butter for dry skin — tropical coconut note.",
    imageUrl:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=750&fit=crop&q=80",
    price: 7500,
  },
  {
    name: "Clear Serum Dropper",
    category: "Beauty",
    description: "Hydrating face serum in a glass dropper bottle.",
    imageUrl:
      "https://images.unsplash.com/photo-1620916567454-e4e64f5522ce?w=600&h=750&fit=crop&q=80",
    price: 11200,
  },
  {
    name: "Amber Glass Diffuser Oil",
    category: "Other",
    description: "Home fragrance oil for reed diffusers.",
    imageUrl:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=750&fit=crop&q=80",
    price: 8100,
  },
  {
    name: "Lavender Sleep Mist",
    category: "Fragrance",
    description: "Pillow and linen mist with calming lavender.",
    imageUrl:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=750&fit=crop&q=80",
    price: 5200,
  },
  {
    name: "Cedar Smoke Cologne",
    category: "Perfume",
    description: "Woody cologne with cedar and light smoke.",
    imageUrl:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=750&fit=crop&q=80",
    price: 15600,
  },
  {
    name: "Pink Blush Body Oil",
    category: "Body care",
    description: "Shimmering dry oil for legs and décolletage.",
    imageUrl:
      "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=600&h=750&fit=crop&q=80",
    price: 6800,
  },
  {
    name: "White Orchid Eau de Parfum",
    category: "Perfume",
    description: "Elegant orchid floral with a soft powder base.",
    imageUrl:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=750&fit=crop&q=80",
    price: 21000,
  },
  {
    name: "Mint Leaf Fresh Spray",
    category: "Fragrance",
    description: "Cool mint and citrus body spray.",
    imageUrl:
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&h=750&fit=crop&q=80",
    price: 4900,
  },
  {
    name: "Shea Radiance Cream",
    category: "Beauty",
    description: "Daily face cream with shea and light floral scent.",
    imageUrl:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=750&fit=crop&q=80",
    price: 9400,
  },
  {
    name: "Black Label Intense Parfum",
    category: "Perfume",
    description: "Bold, intense evening fragrance in a dark bottle.",
    imageUrl:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=750&fit=crop&q=80",
    price: 26500,
  },
  {
    name: "Garden Rain Body Mist",
    category: "Fragrance",
    description: "Green, watery freshness for everyday wear.",
    imageUrl:
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&h=750&fit=crop&q=80",
    price: 5500,
  },
] as const;

const SIZE_VARIANTS = ["30ml", "50ml", "100ml", "Travel set"] as const;

const SHOP_DEFS = [
  {
    name: "Sasha Fragrance PH",
    slug: "sasha-fragrance-ph",
    owner: "Ada Seller",
    emailLocal: "seller01",
    status: VerificationStatus.VERIFIED,
    verified: true,
  },
  {
    name: "Glow Body NG",
    slug: "glow-body-ng",
    owner: "Bola Glow",
    emailLocal: "seller02",
    status: VerificationStatus.VERIFIED,
    verified: true,
  },
  {
    name: "Rivers Essence",
    slug: "rivers-essence",
    owner: "Chidi Essence",
    emailLocal: "seller03",
    status: VerificationStatus.VERIFIED,
    verified: true,
  },
  {
    name: "Amber Lane Beauty",
    slug: "amber-lane-beauty",
    owner: "Dami Amber",
    emailLocal: "seller04",
    status: VerificationStatus.PENDING,
    verified: false,
  },
  {
    name: "PH Perfume Hub",
    slug: "ph-perfume-hub",
    owner: "Efe Hub",
    emailLocal: "seller05",
    status: VerificationStatus.PENDING,
    verified: false,
  },
  {
    name: "Trans Amadi Scents",
    slug: "trans-amadi-scents",
    owner: "Funke Scents",
    emailLocal: "seller06",
    status: VerificationStatus.PENDING,
    verified: false,
  },
  {
    name: "Garden City Oils",
    slug: "garden-city-oils",
    owner: "Grace Oils",
    emailLocal: "seller07",
    status: VerificationStatus.UNVERIFIED,
    verified: false,
  },
  {
    name: "Woji Fragrance Co",
    slug: "woji-fragrance-co",
    owner: "Hassan Woji",
    emailLocal: "seller08",
    status: VerificationStatus.UNVERIFIED,
    verified: false,
  },
  {
    name: "Rejected Sample Shop",
    slug: "rejected-sample-shop",
    owner: "Ife Rejected",
    emailLocal: "seller09",
    status: VerificationStatus.REJECTED,
    verified: false,
    note: "CAC document unreadable — please resubmit.",
  },
  {
    name: "Draft Scents NG",
    slug: "draft-scents-ng",
    owner: "Jide Draft",
    emailLocal: "seller10",
    status: VerificationStatus.REJECTED,
    verified: false,
    note: "Business address does not match ID.",
  },
] as const;

type ShopDef = (typeof SHOP_DEFS)[number];

function catalogProduct(i: number) {
  const item = PRODUCT_CATALOG[i % PRODUCT_CATALOG.length];
  const size =
    SIZE_VARIANTS[Math.floor(i / PRODUCT_CATALOG.length) % SIZE_VARIANTS.length];
  const priceBump =
    (Math.floor(i / PRODUCT_CATALOG.length) % SIZE_VARIANTS.length) * 1500;
  return {
    name: `${item.name} — ${size}`,
    category: item.category,
    description: item.description,
    imageUrl: item.imageUrl,
    price: item.price + priceBump,
  };
}

function unsplash(photoId: string, w = 400, h = 400): string {
  return `https://images.unsplash.com/${photoId}?w=${w}&h=${h}&fit=crop&q=80`;
}

async function createSupabaseAuthUser(opts: {
  id: string;
  email: string;
  fullName: string;
  password: string;
}): Promise<"created" | "exists" | "skipped" | "error"> {
  const base = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!base || !key) return "skipped";

  const res = await fetch(`${base}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: opts.id,
      email: opts.email,
      password: opts.password,
      email_confirm: true,
      user_metadata: { full_name: opts.fullName },
    }),
  });

  if (res.ok) return "created";

  const body = (await res.json().catch(() => ({}))) as {
    msg?: string;
    message?: string;
    error_code?: string;
  };
  const msg = `${body.msg || body.message || ""}`.toLowerCase();
  if (res.status === 422 || msg.includes("already") || msg.includes("exists")) {
    return "exists";
  }
  console.warn(`  Supabase auth create failed for ${opts.email}:`, body);
  return "error";
}

async function createManyInBatches<T extends Record<string, unknown>>(
  label: string,
  rows: T[],
  insert: (chunk: T[]) => Promise<unknown>,
) {
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    await insert(chunk);
    process.stdout.write(
      `\r  ${label}: ${Math.min(i + chunk.length, rows.length)}/${rows.length}`,
    );
  }
  process.stdout.write("\n");
}

async function main() {
  console.log("\n=== Sasha Store full seed ===\n");

  // Wipe previous seed + any marketplace data for a clean UI dataset
  console.log("Clearing existing marketplace data...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.product.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.user.deleteMany({
    where: {
      OR: [
        { email: { endsWith: `@${EMAIL_DOMAIN}` } },
        { id: { in: [...SHOP_DEFS.map((_, i) => seedUuid(i + 1)), ADMIN_ID] } },
      ],
    },
  });

  // --- Users ---
  console.log("Creating users...");
  const sellers: { id: string; email: string; fullName: string; def: ShopDef }[] =
    [];

  for (let i = 0; i < SHOP_DEFS.length; i++) {
    const def = SHOP_DEFS[i];
    const id = seedUuid(i + 1);
    const email = `${def.emailLocal}@${EMAIL_DOMAIN}`;
    sellers.push({ id, email, fullName: def.owner, def });

    await prisma.user.create({
      data: {
        id,
        email,
        fullName: def.owner,
        authProvider: AuthProvider.email,
        role: UserRole.CUSTOMER,
        avatarUrl: unsplash("photo-1494790108377-be9c29b29330", 200, 200),
      },
    });

    const auth = await createSupabaseAuthUser({
      id,
      email,
      fullName: def.owner,
      password: SEED_PASSWORD,
    });
    if (auth !== "skipped") {
      console.log(`  auth ${email}: ${auth}`);
    }
  }

  await prisma.user.create({
    data: {
      id: ADMIN_ID,
      email: `admin@${EMAIL_DOMAIN}`,
      fullName: "Sasha Admin",
      authProvider: AuthProvider.email,
      role: UserRole.ADMIN,
      avatarUrl: unsplash("photo-1472099645785-5658abf4ff4e", 200, 200),
    },
  });
  const adminAuth = await createSupabaseAuthUser({
    id: ADMIN_ID,
    email: `admin@${EMAIL_DOMAIN}`,
    fullName: "Sasha Admin",
    password: SEED_PASSWORD,
  });
  if (adminAuth !== "skipped") {
    console.log(`  auth admin@${EMAIL_DOMAIN}: ${adminAuth}`);
  }

  // --- Shops ---
  console.log("Creating shops...");
  const shops: { id: string; ownerId: string; slug: string; index: number }[] =
    [];

  for (let i = 0; i < sellers.length; i++) {
    const { id: ownerId, email, def } = sellers[i];
    const shopId = randomUUID();
    const verifiedAt =
      def.status === VerificationStatus.VERIFIED ? new Date() : null;

    await prisma.shop.create({
      data: {
        id: shopId,
        ownerId,
        name: def.name,
        slug: def.slug,
        description: `${def.name} — fragrance & beauty from Port Harcourt. Seller manages own logistics.`,
        logoUrl: unsplash("photo-1541643600914-78b084683601", 400, 400),
        legalName: `${def.name} Ltd`,
        cacNumber: `RC-${1000000 + i}`,
        tin: `${20000000 + i}-0001`,
        businessAddress: `${10 + i} Sample Street, Trans Amadi`,
        city: "Port Harcourt",
        state: "Rivers",
        phone: `+23480${String(10000000 + i).slice(0, 8)}`,
        email,
        cacDocumentUrl: unsplash("photo-1586281380349-632531db7ed4", 800, 600),
        idDocumentUrl: unsplash("photo-1554224155-6726b3ff858f", 800, 600),
        proofOfAddressUrl: unsplash("photo-1560518883-ce09059eeffa", 800, 600),
        verificationStatus: def.status,
        isVerified: def.verified,
        verifiedAt,
        verificationNote: "note" in def ? def.note : null,
      },
    });

    shops.push({ id: shopId, ownerId, slug: def.slug, index: i });
  }

  // --- Products (100 per shop) ---
  console.log(`Creating ${shops.length * PRODUCTS_PER_SHOP} products...`);
  const productRows: {
    id: string;
    shopId: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    stock: number;
    isActive: boolean;
  }[] = [];

  for (const shop of shops) {
    for (let p = 0; p < PRODUCTS_PER_SHOP; p++) {
      const n = shop.index * PRODUCTS_PER_SHOP + p;
      const item = catalogProduct(n);
      productRows.push({
        id: randomUUID(),
        shopId: shop.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        imageUrl: item.imageUrl,
        stock: 5 + (n % 120),
        isActive: p % 17 !== 0,
      });
    }
  }

  await createManyInBatches("products", productRows, (chunk) =>
    prisma.product.createMany({ data: chunk }),
  );

  // Products keyed by shop for order building
  const productsByShop = new Map<string, typeof productRows>();
  for (const row of productRows) {
    const list = productsByShop.get(row.shopId) || [];
    list.push(row);
    productsByShop.set(row.shopId, list);
  }

  // --- Ratings (10 per product from all 10 sellers) ---
  console.log(
    `Creating ${productRows.length * RATINGS_PER_PRODUCT} ratings...`,
  );
  const ratingRows: {
    productId: string;
    userId: string;
    score: number;
    comment: string;
  }[] = [];

  for (const product of productRows) {
    for (let r = 0; r < RATINGS_PER_PRODUCT; r++) {
      const rater = sellers[r];
      ratingRows.push({
        productId: product.id,
        userId: rater.id,
        score: 1 + ((r + product.name.length) % 5),
        comment: RATING_COMMENTS[(r + product.name.length) % RATING_COMMENTS.length],
      });
    }
  }

  await createManyInBatches("ratings", ratingRows, (chunk) =>
    prisma.rating.createMany({ data: chunk, skipDuplicates: true }),
  );

  // --- Orders / sales ---
  // Primary sales book for seller01 (shop 0) — rich dashboard data
  // Also seed purchases + sales for other shops across statuses
  console.log("Creating orders & sales...");

  const statuses = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
  ];

  let orderCount = 0;
  let itemCount = 0;

  async function placeOrder(opts: {
    buyerId: string;
    shopId: string;
    status: OrderStatus;
    productIndexes: number[];
    daysAgo: number;
  }) {
    const catalog = productsByShop.get(opts.shopId) || [];
    const items = opts.productIndexes
      .map((idx) => catalog[idx % catalog.length])
      .filter(Boolean);
    if (!items.length) return;

    const lines = items.map((p, i) => ({
      productId: p.id,
      quantity: 1 + (i % 3),
      unitPrice: p.price,
      name: p.name,
    }));
    const totalAmount = lines.reduce(
      (sum, l) => sum + Number(l.unitPrice) * l.quantity,
      0,
    );

    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - opts.daysAgo);

    await prisma.order.create({
      data: {
        buyerId: opts.buyerId,
        shopId: opts.shopId,
        status: opts.status,
        totalAmount,
        shippingAddress: `${20 + orderCount} Buyer Avenue`,
        shippingCity: "Port Harcourt",
        shippingState: "Rivers",
        shippingPhone: `+23481${String(20000000 + orderCount).slice(0, 8)}`,
        notes:
          opts.status === OrderStatus.PENDING
            ? "Awaiting seller confirmation — seller manages logistics."
            : null,
        createdAt,
        items: { create: lines },
      },
    });
    orderCount += 1;
    itemCount += lines.length;
  }

  // Heavy sales for shop 0 (seller01) — 40 orders from other sellers as buyers
  const primaryShop = shops[0];
  for (let i = 0; i < 40; i++) {
    const buyer = sellers[(i % (sellers.length - 1)) + 1]; // never buy from self as only buyer pool
    await placeOrder({
      buyerId: buyer.id,
      shopId: primaryShop.id,
      status: statuses[i % statuses.length],
      productIndexes: [i, i + 3, i + 7],
      daysAgo: i,
    });
  }

  // Cross-shop sales: each other shop gets ~8 orders
  for (let s = 1; s < shops.length; s++) {
    for (let i = 0; i < 8; i++) {
      const buyer = sellers[(s + i + 1) % sellers.length];
      if (buyer.id === shops[s].ownerId) continue;
      await placeOrder({
        buyerId: buyer.id,
        shopId: shops[s].id,
        status: statuses[i % statuses.length],
        productIndexes: [i * 2, i * 2 + 1],
        daysAgo: i + s,
      });
    }
  }

  // Extra purchases for seller02 as a buyer (purchase history UI)
  const purchaseHeavyBuyer = sellers[1];
  for (let s = 0; s < shops.length; s++) {
    if (shops[s].ownerId === purchaseHeavyBuyer.id) continue;
    await placeOrder({
      buyerId: purchaseHeavyBuyer.id,
      shopId: shops[s].id,
      status: OrderStatus.DELIVERED,
      productIndexes: [10, 20],
      daysAgo: 2 + s,
    });
  }

  console.log(`  orders: ${orderCount}, line items: ${itemCount}`);

  console.log(`
=== Seed complete ===

Counts
  users:     ${sellers.length + 1} (10 sellers + 1 admin)
  shops:     ${shops.length} (3 verified, 3 pending, 2 unverified, 2 rejected)
  products:  ${productRows.length}
  ratings:   ${ratingRows.length}
  orders:    ${orderCount}

Login (if Supabase auth was created)
  password for all: ${SEED_PASSWORD}
  sales-heavy seller: seller01@${EMAIL_DOMAIN}  (shop: ${primaryShop.slug})
  purchase-heavy:     seller02@${EMAIL_DOMAIN}
  verified sellers:   seller01..03@${EMAIL_DOMAIN}
  pending:            seller04..06@${EMAIL_DOMAIN}
  admin:              admin@${EMAIL_DOMAIN}

UI tips
  - Sales dashboard → log in as seller01
  - Purchases → log in as seller02
  - Admin verify/reject → log in as admin
  - Blue ticks → shops seller01–03
`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
