-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "salonname" TEXT NOT NULL DEFAULT 'Salon Name',
    "phonenumber" TEXT NOT NULL,
    "bookingLink" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "physAddress" TEXT NOT NULL,
    "phoneSubsdev" TEXT[],
    "phoneSubsprod" TEXT[],

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);
