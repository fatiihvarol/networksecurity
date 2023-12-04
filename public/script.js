document.addEventListener("DOMContentLoaded", function () {
  // Your ThingSpeak channel ID and read API key
  const channelId = "2368157";
  const apiKey = "08ZAA7DRBQZDCW6R";

  // RC4 Key for decryption (replace 'yourRC4Key' with your actual key)
  const rc4Key = "bugercektenguclubirsifrebence";

  // URL to fetch data from ThingSpeak
  const apiUrl = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=10`;

  // Function to decrypt data using RC4
  // Function to decrypt data using RC4
  // ... (Your existing code)

  // Function to decrypt data using RC4
  function decryptRC4(encryptedText, key) {
    const keyArray = [];
    for (let i = 0; i < key.length; i++) {
      keyArray.push(key.charCodeAt(i));
    }

    let i = 0;
    let j = 0;
    const S = Array.from(Array(256).keys());

    for (let i = 0; i < 256; i++) {
      j = (j + S[i] + keyArray[i % keyArray.length]) % 256;
      [S[i], S[j]] = [S[j], S[i]];
    }

    i = 0;
    j = 0;

    const decryptedText = [];
    for (let k = 0; k < encryptedText.length; k++) {
      i = (i + 1) % 256;
      j = (j + S[i]) % 256;
      [S[i], S[j]] = [S[j], S[i]];

      const keyStream = S[(S[i] + S[j]) % 256];
      decryptedText.push(encryptedText.charCodeAt(k) ^ keyStream);
    }

    return String.fromCharCode(...decryptedText);
  }

  // ... (Your existing code)

  // Function to fetch and decrypt data from ThingSpeak
  async function fetchData() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Decrypt each field that is encrypted
      const decryptedFeeds = data.feeds.map((feed) => ({
        created_at: feed.created_at,
        field1: decryptRC4(feed.field1, rc4Key),
        field2: decryptRC4(feed.field2, rc4Key),
        // Add more fields if needed
      }));

      displayData(decryptedFeeds);
    } catch (error) {
      console.error("Error fetching or decrypting data:", error);
    }
  }

  // Function to display data on the web page
  function displayData(feeds) {
    const dataContainer = document.getElementById("data-container");
    dataContainer.innerHTML = ""; // Clear previous data

    feeds.forEach((feed) => {
      const entry = document.createElement("p");
      entry.textContent = `Date: ${feed.created_at}, Field 1: ${feed.field1}, Field 2: ${feed.field2}`; // Adjust fields as per your channel
      dataContainer.appendChild(entry);
    });
  }

  // Fetch and decrypt data on page load
  fetchData();

  // Set up a timer to periodically fetch and decrypt new data (every 5 seconds in this example)
  setInterval(fetchData, 5000); // Fetch data every 5 seconds (adjust as needed)
});
