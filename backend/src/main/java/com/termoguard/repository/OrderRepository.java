package com.termoguard.repository;

import com.termoguard.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Order entity database operations.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * Find all orders for a specific user, ordered by creation date descending.
     */
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * Check if an order number already exists.
     */
    boolean existsByOrderNumber(String orderNumber);
}
