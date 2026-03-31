package com.termoguard.controller;

import com.termoguard.dto.OrderDto;
import com.termoguard.security.CustomUserDetailsService;
import com.termoguard.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST API endpoints for order management.
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final CustomUserDetailsService userDetailsService;

    /**
     * GET /api/orders
     * Get all orders for the authenticated user.
     */
    @GetMapping
    public ResponseEntity<List<OrderDto.OrderResponse>> getUserOrders(
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        Long userId = userDetailsService.getUserIdFromEmail(userDetails.getUsername());
        List<OrderDto.OrderResponse> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }
}
