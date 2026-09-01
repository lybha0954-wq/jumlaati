import { retailerService } from "./retailerService";
import { wholesaleService } from "./wholesaleService";
import { commissionService } from "./commissionService";
import { deliveryService } from "./deliveryService";
import { notificationService } from "./notificationService";
import { logger } from "@/lib/utils/logger";
import type { OrderItem } from "@/types/order";

export const orchestrationService = {
  // دورة حياة الطلب الكاملة (إنشاء طلب جديد)
  async createFullOrder(orderData: { items: OrderItem[]; address: string; retailerId: string; retailerEmail?: string; retailerPhone?: string }) {
    try {
      // 1. حساب الإجمالي
      const total = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // 2. إنشاء الطلب (عبر خدمة التاجر)
      const order = await retailerService.createOrder({
        user_id: orderData.retailerId,
        items: orderData.items,
        total,
        address: orderData.address,
      });

      // 3. إنشاء العمولة تلقائياً
      await commissionService.createCommission(order.id, orderData.retailerId, total);

      // 4. خصم الكميات من المخزون (عبر خدمة الجملة)
      for (const item of orderData.items) {
        await wholesaleService.updateStock(item.productId, -item.quantity); // سنعدل دالة updateStock لتقبل قيم سالبة (خصم)
      }

      // 5. إشعار التاجر بنجاح الطلب
      await notificationService.notify({
        userId: orderData.retailerId,
        type: "order",
        title: "تم استلام طلبك بنجاح!",
        message: `طلبك رقم #${order.id} بقيمة ${total} د.ع قيد المعالجة.`,
        email: orderData.retailerEmail,
        phone: orderData.retailerPhone,
      });

      logger.info("Order created successfully", { orderId: order.id });
      return order;

    } catch (error) {
      logger.error("Orchestration failed during order creation", error);
      throw new Error("فشل في إتمام عملية الطلب. يرجى المحاولة لاحقاً.");
    }
  },

  // دورة حياة التوصيل (تحديث حالة وتسليم طلب)
  async updateDeliveryStatus(orderId: string, status: "shipped" | "delivered", deliveryId: string) {
    try {
      // 1. تحديث الحالة في قاعدة البيانات عبر خدمة التوصيل
      await deliveryService.updateDeliveryStatus(orderId, status);

      // 2. إشعار التاجر بوصول الطلب أو شحنه
      const message = status === "delivered" ? "تم تسليم طلبك بنجاح." : "طلبك الآن في الطريق إليك.";
      await notificationService.notify({
        userId: deliveryId,
        type: "order",
        title: status === "delivered" ? "تم التوصيل ✅" : "طلبك في الطريق 🚚",
        message,
      });

    } catch (error) {
      logger.error("Orchestration failed during delivery status update", error);
      throw new Error("فشل في تحديث حالة التوصيل.");
    }
  }
};
