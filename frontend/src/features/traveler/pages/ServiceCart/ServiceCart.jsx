import { Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";
import { travelServices } from "./data";
import CartTable from "./Table/CartTable";
import columnConfig from "./Table/columnConfig";
import VoucherSection from "./VoucherSection";

export default function ServiceCart() {
  const [cart, setCart] = useState(travelServices);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("travelCart");
    setCart(saved ? JSON.parse(saved) : travelServices);
  }, []);

  useEffect(() => {
    localStorage.setItem("travelCart", JSON.stringify(cart));
  }, [cart]);

  const columns = columnConfig;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Giỏ Dịch Vụ Du Lịch
      </Typography>

      {cart.length === 0 ? (
        <Box textAlign="center" py={5}>
          <Typography color="text.secondary">Giỏ hàng trống!</Typography>
        </Box>
      ) : showCheckout ? (
        <CheckoutForm cart={cart} setCart={setCart} goBack={() => setShowCheckout(false)} />
      ) : (
        <>
          <VoucherSection />
          <Box mt={3}>
            <CartTable
              columns={columns}
              data={cart}
              onCartChange={setCart}
              onCheckout={() => setShowCheckout(true)}
            />
          </Box>
        </>
      )}
    </Container>
  );
}
