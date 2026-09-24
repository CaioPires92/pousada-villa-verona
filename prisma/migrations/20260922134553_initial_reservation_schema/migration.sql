-- CreateTable
CREATE TABLE "RoomType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "maxGuests" INTEGER NOT NULL DEFAULT 3,
    "inventoryFor4Guests" INTEGER NOT NULL DEFAULT 0,
    "includedAdults" INTEGER NOT NULL DEFAULT 2,
    "totalUnits" INTEGER NOT NULL DEFAULT 1,
    "basePrice" DECIMAL NOT NULL,
    "extraAdultFee" DECIMAL NOT NULL DEFAULT 0,
    "child6To11Fee" DECIMAL NOT NULL DEFAULT 0,
    "amenities" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "externalId" TEXT
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "roomTypeId" TEXT NOT NULL,
    CONSTRAINT "Photo_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomTypeId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "price" DECIMAL NOT NULL,
    "cta" BOOLEAN NOT NULL DEFAULT false,
    "ctd" BOOLEAN NOT NULL DEFAULT false,
    "stopSell" BOOLEAN NOT NULL DEFAULT false,
    "minLos" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Rate_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InventoryAdjustment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomTypeId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "dateKey" TEXT NOT NULL,
    "totalUnits" INTEGER NOT NULL,
    "occupiedUnits" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InventoryAdjustment_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FourGuestInventoryAdjustment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomTypeId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "dateKey" TEXT NOT NULL,
    "totalUnits" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FourGuestInventoryAdjustment_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guestId" TEXT NOT NULL,
    "roomTypeId" TEXT NOT NULL,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "childrenAges" TEXT,
    "checkIn" DATETIME NOT NULL,
    "checkOut" DATETIME NOT NULL,
    "totalPrice" DECIMAL NOT NULL,
    "subtotalPrice" DECIMAL,
    "discountAmount" DECIMAL,
    "appliedCouponCode" TEXT,
    "status" TEXT NOT NULL,
    "funnelStage" TEXT,
    "funnelUpdatedAt" DATETIME,
    "lastErrorMessage" TEXT,
    "pendingEmailSentAt" DATETIME,
    "expiredEmailSentAt" DATETIME,
    "confirmationEmailSentAt" DATETIME,
    "checkoutConfirmedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Booking_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PartialPaymentSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "percentage" INTEGER NOT NULL DEFAULT 50,
    "minimumBookingAmount" DECIMAL,
    "minimumLeadTimeDays" INTEGER,
    "balanceDueAt" TEXT NOT NULL DEFAULT 'CHECK_IN',
    "balanceDueDaysBeforeCheckIn" INTEGER,
    "defaultPaymentMode" TEXT NOT NULL DEFAULT 'FULL',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DiscountPolicySettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sendEnabled" BOOLEAN NOT NULL DEFAULT true,
    "percentage" INTEGER NOT NULL DEFAULT 10,
    "validityDays" INTEGER NOT NULL DEFAULT 7,
    "minimumBookingValue" DECIMAL,
    "maximumDiscountAmount" DECIMAL,
    "blockedDateRanges" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingId" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "totalAmount" DECIMAL,
    "remainingAmount" DECIMAL NOT NULL DEFAULT 0,
    "paymentMode" TEXT NOT NULL DEFAULT 'FULL',
    "balanceDueAt" TEXT,
    "balanceDueDate" DATETIME,
    "provider" TEXT NOT NULL,
    "providerId" TEXT,
    "method" TEXT,
    "cardBrand" TEXT,
    "installments" INTEGER,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "codePrefix" TEXT NOT NULL,
    "codeCiphertext" TEXT,
    "type" TEXT NOT NULL,
    "value" DECIMAL NOT NULL,
    "maxDiscountAmount" DECIMAL,
    "minBookingValue" DECIMAL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" DATETIME,
    "endsAt" DATETIME,
    "maxGlobalUses" INTEGER,
    "maxUsesPerGuest" INTEGER,
    "bindEmail" TEXT,
    "bindPhone" TEXT,
    "originBookingId" TEXT,
    "allowedRoomTypeIds" TEXT,
    "allowedSources" TEXT,
    "singleUse" BOOLEAN NOT NULL DEFAULT false,
    "stackable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Coupon_originBookingId_fkey" FOREIGN KEY ("originBookingId") REFERENCES "Booking" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CouponRedemption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "couponId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RESERVED',
    "bookingId" TEXT,
    "guestEmail" TEXT,
    "guestPhone" TEXT,
    "discountAmount" DECIMAL NOT NULL DEFAULT 0,
    "reservedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME,
    "confirmedAt" DATETIME,
    "releasedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CouponRedemption_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CouponRedemption_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CouponAttemptLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "couponId" TEXT,
    "codePrefix" TEXT,
    "guestEmail" TEXT,
    "ipHash" TEXT,
    "userAgentHash" TEXT,
    "result" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CouponAttemptLog_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Rate_roomTypeId_startDate_endDate_key" ON "Rate"("roomTypeId", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "InventoryAdjustment_dateKey_idx" ON "InventoryAdjustment"("dateKey");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryAdjustment_roomTypeId_dateKey_key" ON "InventoryAdjustment"("roomTypeId", "dateKey");

-- CreateIndex
CREATE INDEX "FourGuestInventoryAdjustment_dateKey_idx" ON "FourGuestInventoryAdjustment"("dateKey");

-- CreateIndex
CREATE UNIQUE INDEX "FourGuestInventoryAdjustment_roomTypeId_dateKey_key" ON "FourGuestInventoryAdjustment"("roomTypeId", "dateKey");

-- CreateIndex
CREATE INDEX "Booking_checkoutConfirmedAt_idx" ON "Booking"("checkoutConfirmedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "Payment"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_codeHash_key" ON "Coupon"("codeHash");

-- CreateIndex
CREATE INDEX "Coupon_codePrefix_idx" ON "Coupon"("codePrefix");

-- CreateIndex
CREATE INDEX "Coupon_active_idx" ON "Coupon"("active");

-- CreateIndex
CREATE INDEX "Coupon_originBookingId_idx" ON "Coupon"("originBookingId");

-- CreateIndex
CREATE INDEX "Coupon_startsAt_endsAt_idx" ON "Coupon"("startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "CouponRedemption_bookingId_key" ON "CouponRedemption"("bookingId");

-- CreateIndex
CREATE INDEX "CouponRedemption_couponId_status_idx" ON "CouponRedemption"("couponId", "status");

-- CreateIndex
CREATE INDEX "CouponRedemption_guestEmail_couponId_idx" ON "CouponRedemption"("guestEmail", "couponId");

-- CreateIndex
CREATE INDEX "CouponAttemptLog_createdAt_idx" ON "CouponAttemptLog"("createdAt");

-- CreateIndex
CREATE INDEX "CouponAttemptLog_codePrefix_idx" ON "CouponAttemptLog"("codePrefix");
