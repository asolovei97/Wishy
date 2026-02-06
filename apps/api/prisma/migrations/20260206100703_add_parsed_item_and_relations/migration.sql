-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "parsed_item_id" TEXT;

-- CreateTable
CREATE TABLE "ParsedItem" (
    "id" TEXT NOT NULL,
    "source_url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'UAH',
    "imageUrl" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParsedItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ParsedItem_source_url_key" ON "ParsedItem"("source_url");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_parsed_item_id_fkey" FOREIGN KEY ("parsed_item_id") REFERENCES "ParsedItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
