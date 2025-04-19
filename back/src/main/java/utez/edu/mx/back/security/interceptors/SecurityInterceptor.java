package utez.edu.mx.back.security.interceptors;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import utez.edu.mx.back.modules.activity.service.UserActivityService;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
public class SecurityInterceptor implements HandlerInterceptor {
    private static final Logger logger = LoggerFactory.getLogger(SecurityInterceptor.class);

    private final UserActivityService userActivityService;

    public SecurityInterceptor(UserActivityService userActivityService) {
        this.userActivityService = userActivityService;
    }

    // Almacenamiento de solicitudes para rate limiting
    private final ConcurrentHashMap<String, RequestCounter> requestCounts = new ConcurrentHashMap<>();

    // Sistema de reputación de IPs
    private final ConcurrentHashMap<String, Integer> ipViolations = new ConcurrentHashMap<>();
    private final Set<String> blockedIps = ConcurrentHashMap.newKeySet();
    private final ConcurrentHashMap<String, Long> requestTimestamps = new ConcurrentHashMap<>();

    // Lista negra de User-Agents
    private static final Set<String> MALICIOUS_USER_AGENTS = new HashSet<>(Arrays.asList(
            "sqlmap", "nmap", "hydra", "metasploit", "wget", "curl",
            "nikto", "zap", "havij", "dirbuster", "burpsuite"
    ));

    // Configuraciones (se definen en application.properties)
    @Value("${security.rate-limit}")
    private int rateLimit;

    @Value("${security.rate-limit-window}")
    private int rateLimitWindow;

    @Value("${security.max-violations}")
    private int maxViolations;

    @Value("${security.block-duration-minutes}")
    private int blockDuration;

    @Value("${security.min-request-interval-ms}")
    private int minRequestInterval;

    // Scheduler para desbloqueo automático
    private ScheduledExecutorService scheduler;

    @PostConstruct
    public void init() {
        scheduler = Executors.newScheduledThreadPool(1);
        logger.info("SecurityInterceptor iniciado con configuración:");
        logger.info("Límite de solicitudes: {}/{} segundos", rateLimit, rateLimitWindow);
        logger.info("Bloqueo después de {} violaciones por {} minutos", maxViolations, blockDuration);
    }

    @PreDestroy
    public void cleanup() {
        scheduler.shutdownNow();
        logger.info("SecurityInterceptor detenido");
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        final String clientIp = getClientIp(request);
        final String userAgent = request.getHeader("User-Agent");
        final String requestUri = request.getRequestURI();
        final String httpMethod = request.getMethod();

        // 1. Verificar IP bloqueada
        if (isBlockedIp(clientIp)) {
            logViolation(clientIp, "Intento de acceso desde IP bloqueada", userAgent);
            sendErrorResponse(response, 403, "IP bloqueada por comportamiento sospechoso");
            return false;
        }

        // 2. Análisis de comportamiento en tiempo real
        analyzeRequestPattern(clientIp);

        // 3. Validación mejorada de User-Agent
        if (isMaliciousUserAgent(userAgent)) {
            handleSecurityViolation(clientIp, "User-Agent malicioso: " + userAgent);
            sendErrorResponse(response, 403, "Acceso no autorizado");
            return false;
        }

        // 4. Rate Limiting con reputación
        if (isRateLimitExceeded(clientIp)) {
            handleSecurityViolation(clientIp, "Exceso de solicitudes");
            sendErrorResponse(response, 429, "Demasiadas solicitudes");
            return false;
        }

        // 5. Registro de tiempo de solicitud
        request.setAttribute("startTime", System.currentTimeMillis());

        // 6. Log de acceso
        logAccess(clientIp, userAgent, requestUri, httpMethod);

        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        try {
            long startTime = (Long) request.getAttribute("startTime");
            long duration = System.currentTimeMillis() - startTime;

            logger.info("Procesado en {} ms | Status: {} | URI: {}", duration, response.getStatus(), request.getRequestURI());
        } catch (Exception e) {
            logger.error("Error en afterCompletion: {}", e.getMessage());
        }
    }

    /**
     * Analiza patrones de solicitud para detectar actividad automatizada
     */
    private void analyzeRequestPattern(String clientIp) {
        long currentTime = System.currentTimeMillis();
        Long lastTimestamp = requestTimestamps.put(clientIp, currentTime);

        if (lastTimestamp != null) {
            long interval = currentTime - lastTimestamp;

            // Detectar intervalos demasiado cortos (posible bot)
            if (interval < minRequestInterval) {
                handleSecurityViolation(clientIp, "Actividad robótica detectada (intervalo: " + interval + "ms)");
                logger.warn("Patrón anormal en IP {}: {} ms entre solicitudes", clientIp, interval);
            }
        }
    }

    /**
     * Maneja violaciones de seguridad y bloquea IPs recurrentes
     */
    private void handleSecurityViolation(String clientIp, String reason) {
        int violations = ipViolations.merge(clientIp, 1, Integer::sum);
        logger.warn("Violación #{} para {}: {}", violations, clientIp, reason);

        if (violations >= maxViolations) {
            blockClientIp(clientIp);
        }
    }

    /**
     * Bloquea una IP y programa su desbloqueo automático
     */
    private void blockClientIp(String clientIp) {
        blockedIps.add(clientIp);
        logger.error("IP {} BLOQUEADA por {} minutos", clientIp, blockDuration);

        scheduler.schedule(() -> {
            blockedIps.remove(clientIp);
            ipViolations.remove(clientIp);
            logger.info("IP {} DESBLOQUEADA automáticamente", clientIp);
        }, blockDuration, TimeUnit.MINUTES);
    }

    // ================== [HELPER METHODS] ================== //

    private boolean isBlockedIp(String ip) {
        return blockedIps.contains(ip);
    }

    private boolean isMaliciousUserAgent(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) {
            return true; // Bloquear clientes sin User-Agent
        }
        String lowerUA = userAgent.toLowerCase();
        return MALICIOUS_USER_AGENTS.stream().anyMatch(lowerUA::contains);
    }

    private boolean isRateLimitExceeded(String ip) {
        RequestCounter counter = requestCounts.computeIfAbsent(ip, k -> new RequestCounter());

        synchronized (counter) {
            long currentTime = System.currentTimeMillis();

            // Reiniciar contador si la ventana ha expirado
            if (currentTime - counter.windowStart > TimeUnit.SECONDS.toMillis(rateLimitWindow)) {
                counter.windowStart = currentTime;
                counter.count = 0;
            }

            // Verificar límite
            if (counter.count >= rateLimit) {
                return true;
            }

            counter.count++;
            return false;
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return normalizeIp(ip.split(",")[0].trim()); // Manejar múltiples proxies
    }

    private String normalizeIp(String ip) {
        try {
            InetAddress inetAddress = InetAddress.getByName(ip);
            if (inetAddress.isLoopbackAddress()) {
                return "127.0.0.1";
            }
            return inetAddress.getHostAddress();
        } catch (UnknownHostException e) {
            logger.warn("Error normalizando IP: {}", ip);
            return ip;
        }
    }

    // ================== [LOGGING & RESPONSE] ================== //

    private void logAccess(String ip, String userAgent, String uri, String httpMethod) {
        logger.info("Acceso permitido | IP: {} | UA: {} | Endpoint: {} | Method: {}", ip, userAgent, uri, httpMethod);

        try {
            // Get authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = "anonymous";

            if (authentication != null && authentication.isAuthenticated()) {
                username = authentication.getName();
                // Don't log system user activities
                if ("anonymousUser".equals(username)) {
                    username = "anonymous";
                }
            }

            // Log the activity in the database
            userActivityService.logActivity(httpMethod, username, uri);
        } catch (Exception e) {
            logger.error("Error logging user activity: {}", e.getMessage());
        }
    }

    private void logViolation(String ip, String reason, String userAgent) {
        logger.warn("🚫 Violación de seguridad | IP: {} | Razón: {} | UA: {}", ip, reason, userAgent);
    }

    private void sendErrorResponse(HttpServletResponse response, int status, String message) {
        try {
            response.sendError(status, message);
        } catch (Exception e) {
            logger.error("Error enviando respuesta HTTP {}: {}", status, e.getMessage());
        }
    }

    // ================== [INNER CLASSES] ================== //

    private static class RequestCounter {
        int count;
        long windowStart = System.currentTimeMillis();
    }
}
