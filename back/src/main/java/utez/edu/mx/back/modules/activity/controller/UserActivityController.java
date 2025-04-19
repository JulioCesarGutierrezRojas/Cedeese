package utez.edu.mx.back.modules.activity.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.back.kernel.ApiResponse;
import utez.edu.mx.back.kernel.TypesResponse;
import utez.edu.mx.back.modules.activity.model.UserActivity;
import utez.edu.mx.back.modules.activity.service.UserActivityService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class UserActivityController {

    private final UserActivityService service;

    /**
     * Get all user activities
     * @return List of all user activities
     */
    @GetMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserActivity>>> getAllActivities() {
        return new ResponseEntity<>(
                new ApiResponse<>(service.getAllActivities(), TypesResponse.SUCCESS, "Activities retrieved successfully"),
                HttpStatus.OK
        );
    }

    /**
     * Get activities by username
     * @param username Username to filter by
     * @return List of activities for the specified user
     */
    @GetMapping("/user/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserActivity>>> getActivitiesByUsername(@PathVariable String username) {
        return new ResponseEntity<>(
                new ApiResponse<>(service.getActivitiesByUsername(username), TypesResponse.SUCCESS, 
                        "Activities for user " + username + " retrieved successfully"),
                HttpStatus.OK
        );
    }

    /**
     * Get activities by HTTP method
     * @param method HTTP method to filter by (GET, POST, PUT, DELETE)
     * @return List of activities with the specified HTTP method
     */
    @GetMapping("/method/{method}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserActivity>>> getActivitiesByMethod(@PathVariable String method) {
        return new ResponseEntity<>(
                new ApiResponse<>(service.getActivitiesByHttpMethod(method.toUpperCase()), TypesResponse.SUCCESS, 
                        method.toUpperCase() + " activities retrieved successfully"),
                HttpStatus.OK
        );
    }
}
