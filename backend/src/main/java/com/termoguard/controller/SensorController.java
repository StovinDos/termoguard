package com.termoguard.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentLinkedDeque;

@RestController
@RequestMapping("/api/sensor")
@Slf4j
public class SensorController {

    public record SensorReading(
            double temperature,
            double humidity,
            double pressure,
            String status,
            Instant timestamp
    ) {}

    private static final int MAX_HISTORY = 20;
    private final ConcurrentLinkedDeque<SensorReading> history = new ConcurrentLinkedDeque<>();
    private volatile Instant lastSeen = null;

    // ── ESP32 POSTs here every second ──
    @PostMapping("/push")
    public ResponseEntity<Void> push(@RequestBody Map<String, Object> body) {
        double temp     = ((Number) body.get("temperature")).doubleValue();
        double humidity = ((Number) body.getOrDefault("humidity", 0)).doubleValue();
        double pressure = ((Number) body.getOrDefault("pressure", 0)).doubleValue();

        String status = temp < 18 ? "Cold" : temp <= 28 ? "Optimal" : "Too Hot";
        SensorReading reading = new SensorReading(temp, humidity, pressure, status, Instant.now());

        history.addLast(reading);
        if (history.size() > MAX_HISTORY) history.pollFirst();
        lastSeen = Instant.now();

        log.debug("Sensor push: {}°C", temp);
        return ResponseEntity.ok().build();
    }

    // ── Frontend polls this ──
    @GetMapping("/latest")
    public ResponseEntity<Map<String, Object>> latest() {
        boolean live = lastSeen != null &&
                lastSeen.isAfter(Instant.now().minusSeconds(5));

        return ResponseEntity.ok(Map.of(
                "live",    live,
                "history", history.stream().toList(),
                "latest",  history.isEmpty() ? null : history.getLast()
        ));
    }
}