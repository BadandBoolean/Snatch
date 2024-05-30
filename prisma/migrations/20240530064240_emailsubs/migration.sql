-- CreateTable
CREATE TABLE "LandingPageSignUpEmails" (
    "subscriberid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "businessname" TEXT NOT NULL,

    CONSTRAINT "LandingPageSignUpEmails_pkey" PRIMARY KEY ("subscriberid")
);
