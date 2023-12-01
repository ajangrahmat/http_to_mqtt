const express = require('express');
const mqtt = require('mqtt');

const app = express();
const port = 3000;

// Mqtt broker configuration
const mqttBrokerUrl = 'mqtt://broker.emqx.io';

// Create MQTT client
const mqttClient = mqtt.connect(mqttBrokerUrl);

// Endpoint untuk menerima permintaan HTTP GET
app.get('/publish-mqtt', (req, res) => {
  const topic = req.query.topic;
  const message = req.query.message;

  if (!topic || !message) {
    return res.status(400).send('Topic dan message harus disertakan');
  }

  // Terbitkan pesan ke broker MQTT
  mqttClient.publish(topic, message, (err) => {
    if (err) {
      console.error('Gagal menerbitkan pesan ke MQTT:', err);
      return res.status(500).send('Gagal menerbitkan pesan ke MQTT');
    }

    console.log(`Pesan berhasil diterbitkan ke ${topic}: ${message}`);
    res.send('Pesan berhasil diterbitkan ke MQTT');
  });
});

// Jalankan server Express
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

// Tangani event ketika koneksi MQTT terhubung
mqttClient.on('connect', () => {
  console.log('Terhubung ke broker MQTT');
});

// Tangani event jika terjadi kesalahan pada koneksi MQTT
mqttClient.on('error', (err) => {
  console.error('Kesalahan pada koneksi MQTT:', err);
});
