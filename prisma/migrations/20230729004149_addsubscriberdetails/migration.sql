-- CreateTable
CREATE TABLE "ClientPhoneNumber" (
    "id" TEXT NOT NULL,
    "clientphone" TEXT NOT NULL,

    CONSTRAINT "ClientPhoneNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientEmailAddress" (
    "id" TEXT NOT NULL,
    "clientemail" TEXT NOT NULL,

    CONSTRAINT "ClientEmailAddress_pkey" PRIMARY KEY ("id")
);
