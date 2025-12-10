import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function test() {
  try {
    console.log("Testing HuggingFace API key...");
    
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    
    if (!apiKey) {
      console.error("API Test Failed: No API key found in environment variables");
      return false;
    }
    
    // Test with a simple API endpoint to verify the key
    const response = await fetch("https://huggingface.co/api/whoami-v2", {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Key Test Failed: ${response.status} - ${errorText}`);
      return false;
    }

    const data = await response.json();
    
    console.log("API Key Test Successful!");
    console.log("User Info:", JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("API Key Test Failed:", error.message);
    return false;
  }
}

test();