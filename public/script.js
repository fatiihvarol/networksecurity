document.addEventListener("DOMContentLoaded", function () {
  // Your ThingSpeak channel ID and read API key
  const channelId = "2368157";
  const apiKey = "08ZAA7DRBQZDCW6R";

  // XOR Key for decryption
  const xorKey = 0b10101010;

  // URL to fetch data from ThingSpeak
  const apiUrl = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=10`;

  // Function to decrypt data using XOR
  function decryptXOR(encryptedText, key) {
    const binaryArray = encryptedText
      .split(" ")
      .map((byte) => parseInt(byte, 2));

    const decryptedArray = binaryArray.map((byte) => byte ^ key);

    const decryptedDecimalArray = decryptedArray.map((byte) =>
      byte.toString(10)
    );

    return decryptedDecimalArray[0];
  }

  // Function to fetch and decrypt data from ThingSpeak
  async function fetchData() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Decrypt each field that is encrypted
      const decryptedFeeds = data.feeds.map((feed) => ({
        created_at: feed.created_at,
        field1: decryptXOR(feed.field1, xorKey),
        field2: decryptXOR(feed.field2, xorKey),
        field3: feed.field1,
        field4: feed.field2,
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
      entry.innerHTML = `Temperature Cipher Text: ${feed.field3},<br>Temperature: ${feed.field1},<br>Humidity Cipher Text: ${feed.field4},<br>Humidity: ${feed.field2}`; // Adjust fields as per your channel
      dataContainer.appendChild(entry);
    });
  }

  // Fetch and decrypt data on page load
  fetchData();

  // Set up a timer to periodically fetch and decrypt new data (every 5 seconds in this example)
  setInterval(fetchData, 5000); // Fetch data every 5 seconds (adjust as needed)
});
