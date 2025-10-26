// ==============================
// 🌦 ESP32 Weather Bridge Server
// ==============================

// --- Required Modules ---
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mqtt = require('mqtt');
const webpush = require('web-push');
const path = require('path');

// --- Express Setup ---
const app = express();
app.use(bodyParser.json());
app.use(cors());

// --- Serve Frontend Files (PWA) ---
app.use(express.static(path.join(__dirname, 'public')));

// --- CONFIGURATION ---
const MQTT_URL = 'wss://broker.hivemq.com:8884/mqtt'; // Public HiveMQ WebSocket Broker
const MQTT_TOPICS = ['esp32/rain', 'esp32/temp', 'esp32/hum']; // ESP32 Publish Topics

// --- VAPID KEYS (for Push Notifications) ---
const VAPID_PUBLIC = 'BBiul0FRmUT8rMriHAofq--doFLEkOsEzzn6RYFXo1_mBBRSbnaabHbUwqYeO1kXc1MgC8jh64P4zddWfTcEukc';
const VAPID_PRIVATE = 'MlHhkEhC9fAQVSCk2VTvPAJ077ePl1x_T81oNVYi0m8';
const VAPID_EMAIL = 'mailto:Wooihong0185@gmail.com';

// --- Web Push Configuration ---
webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE);

// --- In-memory list of subscribed clients ---
const subscriptions = new Set();

// --- Default Route ---
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Subscription Route ---
app.post('/subscribe', (req, res) => {
  const sub = req.body;
  if (!sub || !sub.endpoint) {
    return res.status(400).json({ error: 'Invalid subscription' });
  }

  subscriptions.add(JSON.stringify(sub));
  console.log('📬 New subscription added:', sub.endpoint);
  res.status(201).json({ success: true });
});

// --- MQTT Setup ---
const mqttClient = mqtt.connect(MQTT_URL);

mqttClient.on('connect', () => {
  console.log('📡 Connected to MQTT broker');
  MQTT_TOPICS.forEach(topic => mqttClient.subscribe(topic));
});

mqttClient.on('message', (topic, messageBuffer) => {
  const message = messageBuffer.toString();
  console.log(`📩 MQTT message on [${topic}]: ${message}`);

  // Default notification payload
  let payload = {
    title: `MQTT Update: ${topic}`,
    body: message,
    url: '/'
  };

  // --- Custom notifications by topic ---
  if (topic === 'esp32/rain') {
    payload.title = (message === '0') ? '🌧 Rain Detected' : '☀️ Clear Sky';
    payload.body = (message === '0')
      ? 'Rain detected by your ESP32 weather station!'
      : 'No rain detected.';
  } else if (topic === 'esp32/temp') {
    payload.title = '🌡 Temperature Update';
    payload.body = `Current temperature: ${message}°C`;
  } else if (topic === 'esp32/hum') {
    payload.title = '💧 Humidity Update';
    payload.body = `Current humidity: ${message}%`;
  }

  // --- Send web push notification to all clients ---
  subscriptions.forEach(subStr => {
    const sub = JSON.parse(subStr);
    webpush.sendNotification(sub, JSON.stringify(payload))
      .catch(err => {
        console.error('❌ Push send failed:', err.statusCode);
        if (err.statusCode === 410 || err.statusCode === 404) {
          subscriptions.delete(subStr); // Remove expired subscription
        }
      });
  });
});

// --- Start the Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Bridge server running on http://localhost:${PORT}`);
  console.log(`🌍 Serving static files from: ${path.join(__dirname, 'public')}`);
});