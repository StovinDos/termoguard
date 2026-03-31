package com.termoguard.controller;

import com.termoguard.dto.OrderDto;
import com.termoguard.security.CustomUserDetailsService;
import com.termoguard.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
     * POST /api/orders
     * Create a new order for the authenticated user.
     */
    @PostMapping
    public ResponseEntity<OrderDto.OrderResponse> createOrder(
        @AuthenticationPrincipal UserDetails userDetails,
        @Valid @RequestBody OrderDto.OrderRequest request
    ) {
        Long userId = userDetailsService.getUserIdFromEmail(userDetails.getUsername());
        OrderDto.OrderResponse order = orderService.createOrder(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

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
