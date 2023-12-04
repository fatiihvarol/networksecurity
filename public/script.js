// Function to decrypt temperature and humidity values
function decryptData(encryptedTemperature, encryptedHumidity, xorKey) {
  // XOR operation to decrypt
  const decryptedTemperature = encryptedTemperature ^ xorKey;
  const decryptedHumidity = encryptedHumidity ^ xorKey;

  return {
    temperature: decryptedTemperature,
    humidity: decryptedHumidity,
  };
}

document.addEventListener("DOMContentLoaded", function () {
  // Your ThingSpeak channel ID and read API key
  const channelId = "2368157";
  const apiKey = "08ZAA7DRBQZDCW6R";

  // URL to fetch data from ThingSpeak
  const apiUrl = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=10`;

  // Function to display data on the web page
  function displayData(feeds) {
    const dataContainer = document.getElementById("data-container");
    dataContainer.innerHTML = ""; // Clear previous data

    feeds.forEach((feed) => {
      // Decrypt temperature and humidity values
      const decryptedData = decryptData(parseInt(feed.field1), parseInt(feed.field2), 0b10101010);

      const entry = document.createElement("p");
      entry.textContent = `Date: ${feed.created_at}, Decrypted Temperature: ${decryptedData.temperature}, Decrypted Humidity: ${decryptedData.humidity}`;
      dataContainer.appendChild(entry);
    });
  }

  // Fetch and decrypt data on page load
  fetchData();

  // Set up a timer to periodically fetch and decrypt new data (every 5 seconds in this example)
  setInterval(fetchData, 5000); // Fetch data every 5 seconds (adjust as needed)
});
