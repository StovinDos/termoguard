package com.termoguard.service;

import com.termoguard.dto.OrderDto;
import com.termoguard.model.Order;
import com.termoguard.model.User;
import com.termoguard.repository.OrderRepository;
import com.termoguard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Business logic for order operations.
 */
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private static final SecureRandom RANDOM = new SecureRandom();

    /**
     * Create a new order for the authenticated user.
     */
    @Transactional
    public OrderDto.OrderResponse createOrder(Long userId, OrderDto.OrderRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        String orderNumber = generateUniqueOrderNumber();

        Order order = Order.builder()
            .user(user)
            .orderNumber(orderNumber)
            .productName(request.getProductName())
            .quantity(request.getQuantity())
            .total(request.getTotal())
            .status(Order.OrderStatus.PROCESSING)
            .build();

        Order savedOrder = orderRepository.save(order);

        updateCustomerRank(userId);

        return OrderDto.OrderResponse.from(savedOrder);
    }

    /**
     * Generate a unique order number in format TG-XXXXXX.
     */
    private String generateUniqueOrderNumber() {
        String orderNumber;
        do {
            orderNumber = "TG-" + generateRandomAlphanumeric(6);
        } while (orderRepository.existsByOrderNumber(orderNumber));
        return orderNumber;
    }

    /**
     * Generate a random alphanumeric string of specified length.
     */
    private String generateRandomAlphanumeric(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(RANDOM.nextInt(chars.length())));
        }
        return sb.toString();
    }

    /**
     * Get all orders for the authenticated user.
     */
    @Transactional(readOnly = true)
    public List<OrderDto.OrderResponse> getUserOrders(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return orders.stream()
            .map(OrderDto.OrderResponse::from)
            .collect(Collectors.toList());
    }

    /**
     * Calculate and update the customer rank based on total spending.
     * This should be called after each order is placed.
     */
    @Transactional
    public void updateCustomerRank(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        BigDecimal totalSpent = orders.stream()
            .map(Order::getTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        User.CustomerRank newRank = calculateRank(totalSpent);
        user.setCustomerRank(newRank);
        userRepository.save(user);
    }

    /**
     * Calculate rank based on total spent amount.
     * - Bronze: < $100
     * - Silver: $100 - $299.99
     * - Gold: $300 - $599.99
     * - Platinum: $600+
     */
    private User.CustomerRank calculateRank(BigDecimal totalSpent) {
        if (totalSpent.compareTo(new BigDecimal("600")) >= 0) {
            return User.CustomerRank.PLATINUM;
        } else if (totalSpent.compareTo(new BigDecimal("300")) >= 0) {
            return User.CustomerRank.GOLD;
        } else if (totalSpent.compareTo(new BigDecimal("100")) >= 0) {
            return User.CustomerRank.SILVER;
        } else {
            return User.CustomerRank.BRONZE;
        }
    }
}
