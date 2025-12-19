-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceAdult" INTEGER NOT NULL,
    "priceChild" INTEGER NOT NULL,
    "duration" TEXT NOT NULL,
    "activities" TEXT[],
    "imageUrl" TEXT NOT NULL,
    "availableTimes" TEXT[],
    "badge" TEXT,
    "badgeColor" TEXT,
    "category" TEXT,
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "childNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Package_slug_key" ON "Package"("slug");
