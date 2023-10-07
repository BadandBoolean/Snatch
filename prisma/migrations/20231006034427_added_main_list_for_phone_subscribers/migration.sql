-- CreateTable
CREATE TABLE "phoneSubMainList" (
    "subscriberid" TEXT NOT NULL,
    "phonenum" TEXT NOT NULL,
    "salonid" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "phoneSubMainList_pkey" PRIMARY KEY ("subscriberid")
);
