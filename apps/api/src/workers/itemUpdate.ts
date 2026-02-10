import cron from "node-cron";
import { prisma } from "@api/lib/prisma/client";
import { adminNotificationService } from "@api/services/notification/admin";
import { parserFactory } from "@api/services/parser/factory";

export const startItemUpdateWorker = () => {
  // Schedule task to run daily at 03:00 AM
  // Format: "0 3 * * *" (At 03:00)
  cron.schedule("0 3 * * *", async () => {
    console.log("[ItemUpdateWorker] Starting daily update check...");
    await processItems();
  });

  console.log("[ItemUpdateWorker] Scheduled (03:00 daily)");
};

export const processItems = async () => {
  try {
    const items = await prisma.parsedItem.findMany({
      orderBy: { last_checked_at: "asc" },
      take: 20,
    });

    if (items.length === 0) {
        console.log("[ItemUpdateWorker] No items to update.");
        return;
    }

    console.log(`[ItemUpdateWorker] Processing ${items.length} items...`);

    let successCount = 0;
    let errorCount = 0;

    for (const item of items) {
      try {
        const parsedData = await parserFactory.getParser(item.source_url).parse(item.source_url);

        await prisma.parsedItem.update({
          where: { id: item.id },
          data: {
            name: parsedData.name,
            description: parsedData.description,
            price: parsedData.price,
            currency: parsedData.currency,
            imageUrl: parsedData.imageUrl,
            
            // We don't have is_available in ParsedItem yet, but usually price updates imply it.
            // If price = 0 or unavailable, logic might differ. 
            // For now just storing metadata.
            
            last_checked_at: new Date(),
            check_status: "SUCCESS",
            check_error_count: 0,
          },
        });
        successCount++;
      } catch (error: any) {
        errorCount++;
        console.error(`[ItemUpdateWorker] Failed to update item ${item.id}:`, error.message);

        const newErrorCount = item.check_error_count + 1;
        
        await prisma.parsedItem.update({
          where: { id: item.id },
          data: {
            last_checked_at: new Date(),
            check_status: "ERROR",
            check_error_count: newErrorCount,
          },
        });

        // Notify admin if error persists (e.g., > 3 times) or always?
        // Prompt says: "if parsing operational error appears, notify admin"
        // Let's notify on every failure for now, or maybe only critical ones.
        // Assuming operational error means logic failure or 404/500 from source.
        
        await adminNotificationService.notifyError(
          `Failed to update item: ${item.source_url}`,
          { 
              itemId: item.id, 
              error: error.message,
              errorCount: newErrorCount
          }
        );
      }
      
      // Basic rate limiting / niceness
      await new Promise(r => setTimeout(r, 2000));
    }

    console.log(`[ItemUpdateWorker] Finished. Success: ${successCount}, Errors: ${errorCount}`);
    
  } catch (criticalError) {
      console.error("[ItemUpdateWorker] Critical execution error:", criticalError);
      await adminNotificationService.notifyError(
          "ItemUpdateWorker Critical Failure", 
          criticalError
      );
  }
};
