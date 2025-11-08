// OrderModal.jsx
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// ✅ ایمپورت کردن فرم از فایل مجزا در همین پوشه
import OrderForm from "./OrderForm";

const OrderModal = ({ open, onClose, product }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      // 💡 اعمال افکت مات روی پس‌زمینه (Backdrop)
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(5px)", // افکت مات
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          padding: "16px",
          // 💡 استفاده از رنگ پس‌زمینه مورد علاقه شما
          backgroundColor: "#EDE9DE",
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, textAlign: "center" }}>
        ثبت سفارش {product?.name}
        <IconButton
          onClick={onClose} // ✅ دکمه بستن (X)
          sx={{
            position: "absolute",
            left: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        {/* ✅ رندر کردن فرم در داخل پاپ‌آپ */}
        <OrderForm product={product} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
