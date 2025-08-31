# MAPPLS Map Setup Instructions

## 🔑 **API Key Setup Required**

Your MAPPLS map is not visible because you need to add your API key to the environment configuration.

### **Step 1: Get Your MAPPLS API Key**
1. Go to [MapmyIndia Developer Console](https://www.mapmyindia.com/api/dashboard)
2. Sign up/Login to your account
3. Create a new project or use existing one
4. Get your API key from the project dashboard

### **Step 2: Add API Key to Environment**
1. In the `packages/frontend/` directory, create a new file called `.env`
2. Add this line to the `.env` file:
   ```
   VITE_MAPPLS_API_KEY=your_actual_api_key_here
   ```
3. Replace `your_actual_api_key_here` with your real MAPPLS API key

### **Step 3: Restart Development Server**
1. Stop the current development server (Ctrl+C)
2. Run `npm run dev` again

### **Example .env file:**
```
VITE_MAPPLS_API_KEY=abc123def456ghi789
```

### **What This Will Enable:**
✅ **Interactive MAPPLS Map** with real-time data  
✅ **Worker and Job Markers** with status-based colors  
✅ **Zoom Controls** and navigation  
✅ **Professional Mapping Interface** powered by MapmyIndia  
✅ **Responsive Design** that works on all devices  

### **Troubleshooting:**
- If the map still doesn't show, check the browser console for error messages
- Ensure your API key is valid and has the necessary permissions
- Make sure you're using the correct API key format

### **Need Help?**
- Check the [MAPPLS API Documentation](https://www.mapmyindia.com/api/)
- Verify your API key permissions in the MapmyIndia dashboard
- Ensure your project has the Maps API enabled

---

**Note:** The `.env` file should NOT be committed to version control. It's already in your `.gitignore` file.
