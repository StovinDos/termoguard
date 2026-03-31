package com.termoguard.dto;

import com.termoguard.model.Order;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Data Transfer Objects for Order-related endpoints.
 */
public class OrderDto {

    // ── Order Response DTO ────────────────────────────────────────────────

    @Getter
    @Builder
    @AllArgsConstructor
    public static class OrderResponse {
        private Long id;
        private String orderNumber;
        private String productName;
        private Integer quantity;
        private BigDecimal total;
        private String status;
        private Instant createdAt;

        /** Map entity → DTO */
        public static OrderResponse from(Order order) {
            return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .productName(order.getProductName())
                .quantity(order.getQuantity())
                .total(order.getTotal())
                .status(order.getStatus().name())
                .createdAt(order.getCreatedAt())
                .build();
        }
    }
}
