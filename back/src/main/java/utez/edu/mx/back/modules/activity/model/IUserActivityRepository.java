package utez.edu.mx.back.modules.activity.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IUserActivityRepository extends JpaRepository<UserActivity, Long> {
    
    // Find activities by username
    List<UserActivity> findByUsername(String username);
    
    // Find activities by HTTP method
    List<UserActivity> findByHttpMethod(String httpMethod);
    
    // Find activities by endpoint
    List<UserActivity> findByEndpointContaining(String endpoint);
    
    // Find activities between dates
    List<UserActivity> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
}