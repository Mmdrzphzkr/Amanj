import {
    Box,
    Grid,
    TextField,
    Button,
    Paper,
    Typography,
} from "@mui/material";

export default function NewAddressForm({
    values,
    onChange,
    onSubmit,
    onCancel,
    loading,
}) {
    return (
        <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Typography fontWeight={700} mb={2}>
                افزودن آدرس جدید
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="عنوان آدرس (خانه، محل کار...)"
                        fullWidth
                        value={values.title}
                        onChange={(e) => onChange("title", e.target.value)}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        label="شماره تماس"
                        fullWidth
                        value={values.phone}
                        onChange={(e) => onChange("phone", e.target.value)}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        label="استان"
                        fullWidth
                        value={values.province}
                        onChange={(e) => onChange("province", e.target.value)}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        label="شهر"
                        fullWidth
                        value={values.city}
                        onChange={(e) => onChange("city", e.target.value)}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        label="آدرس کامل"
                        fullWidth
                        multiline
                        rows={3}
                        value={values.full_address}
                        onChange={(e) => onChange("full_address", e.target.value)}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        label="کد پستی"
                        fullWidth
                        value={values.postal_code}
                        onChange={(e) => onChange("postal_code", e.target.value)}
                    />
                </Grid>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
                <Button variant="outlined" onClick={onCancel}>
                    انصراف
                </Button>
                <Button
                    variant="contained"
                    onClick={onSubmit}
                    disabled={loading}
                >
                    ذخیره آدرس
                </Button>
            </Box>
        </Paper>
    );
}
