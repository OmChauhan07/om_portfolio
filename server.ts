import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Contact Route
  app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;
    
    console.log("New Message Received:");
    console.log(`From: ${name} (${email})`);
    console.log(`Message: ${message}`);

    // In a real production app, you would use a service like SendGrid or Nodemailer here
    // For now, we simulate success. We can also provide instructions on how to add a real email service.
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      res.status(200).json({ 
        success: true, 
        message: "Message sent successfully! (Simulated backend delivery)" 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to send message." 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
