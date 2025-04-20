package utez.edu.mx.back.modules.activity.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserActivity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "http_method", nullable = false)
    private String httpMethod;
    
    @Column(name = "username", nullable = false)
    private String username;
    
    @Column(name = "endpoint", nullable = false)
    private String endpoint;
    
    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;
    
    // Constructor for easy creation
    public UserActivity(String httpMethod, String username, String endpoint) {
        this.httpMethod = httpMethod;
        this.username = username;
        this.endpoint = endpoint;
        this.timestamp = LocalDateTime.now();
    }
}