package utez.edu.mx.back.modules.activity.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.back.modules.activity.model.IUserActivityRepository;
import utez.edu.mx.back.modules.activity.model.UserActivity;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserActivityService {

    private final IUserActivityRepository repository;

    /**
     * Log a user activity
     * @param httpMethod The HTTP method (GET, POST, PUT, DELETE)
     * @param username The username of the user who performed the action
     * @param endpoint The endpoint that was accessed
     * @return The saved UserActivity
     */
    @Transactional
    public UserActivity logActivity(String httpMethod, String username, String endpoint) {
        UserActivity activity = new UserActivity(httpMethod, username, endpoint);
        return repository.save(activity);
    }

    /**
     * Get all activities
     * @return List of all activities
     */
    @Transactional(readOnly = true)
    public List<UserActivity> getAllActivities() {
        return repository.findAll();
    }

    /**
     * Get activities by username
     * @param username The username to filter by
     * @return List of activities for the specified user
     */
    @Transactional(readOnly = true)
    public List<UserActivity> getActivitiesByUsername(String username) {
        return repository.findByUsername(username);
    }

    /**
     * Get activities by HTTP method
     * @param httpMethod The HTTP method to filter by
     * @return List of activities with the specified HTTP method
     */
    @Transactional(readOnly = true)
    public List<UserActivity> getActivitiesByHttpMethod(String httpMethod) {
        return repository.findByHttpMethod(httpMethod);
    }

    /**
     * Get activities by date range
     * @param start Start date
     * @param end End date
     * @return List of activities within the specified date range
     */
    @Transactional(readOnly = true)
    public List<UserActivity> getActivitiesByDateRange(LocalDateTime start, LocalDateTime end) {
        return repository.findByTimestampBetween(start, end);
    }
}