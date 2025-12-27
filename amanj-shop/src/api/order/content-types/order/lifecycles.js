module.exports = {
  async afterCreate(event) {
    const { result } = event;
    console.log("نظم جدید ثبت شد:", result.id); // بررسی اجرای فایل

    // نام فیلد محصولات را اینجا بر اساس schema.json خود اصلاح کنید (مثلا 'products' یا 'items')
    const orderItems = result.products || result.items;

    if (orderItems && orderItems.length > 0) {
      for (const item of orderItems) {
        console.log("در حال بررسی محصول با شناسه:", item.id);

        try {
          // پیدا کردن موجودی فعلی محصول
          const product = await strapi.entityService.findOne(
            "api::product.product",
            item.id
          );

          if (product) {
            const orderQuantity = item.quantity || 1; // اگر تعداد در سبد خرید دارید
            const newStock = product.stock - orderQuantity;

            console.log(
              `موجودی فعلی: ${product.stock} | تعداد سفارش: ${orderQuantity}`
            );

            await strapi.entityService.update("api::product.product", item.id, {
              data: { stock: Math.max(0, newStock) },
            });
            console.log("موجودی با موفقیت آپدیت شد.");
          } else {
            console.log("محصولی با این ID یافت نشد.");
          }
        } catch (err) {
          console.error("خطا در آپدیت موجودی:", err);
        }
      }
    } else {
      console.log("هیچ محصولی در این سفارش یافت نشد. فیلد محصولات را چک کنید.");
    }
  },
};
