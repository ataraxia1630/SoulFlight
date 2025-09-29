import { Outlet } from "react-router-dom";
import { Box, Paper } from "@mui/material";
import { useEffect, useRef } from "react";
import Header from "@/shared/components/Header";

const AuthLayout = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    let t = 0;
    const layers = [
      { amp: 20, freq: 0.015, speed: 0.8, color: "rgba(255,255,255,0.25)" },
      { amp: 10, freq: 0.03, speed: 1.2, color: "rgba(255,255,255,0.15)" },
      { amp: 5, freq: 0.05, speed: 0.5, color: "rgba(255,255,255,0.1)" },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradient nền biển sáng
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, "#a0e1ff");
      grad.addColorStop(1, "#0074a3");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Vẽ các lớp sóng
      layers.forEach((layer) => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        for (let x = 0; x < canvas.width; x++) {
          let y =
            Math.sin(x * layer.freq + t * layer.speed) * layer.amp +
            canvas.height / 2;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = layer.color;
        ctx.fill();
      });

      t += 0.05;
      requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      {/* Canvas nền sóng */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1, minHeight: "100vh", p: 2 }}>
        <Header />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          sx={{ pt: { xs: 12, lg: 10 }, px: { xs: 2, lg: 2 } }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, lg: 4 },
              borderRadius: 3,
              width: "100%",
              maxWidth: 400,
              overflow: "auto",
            }}
          >
            <Outlet />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;
