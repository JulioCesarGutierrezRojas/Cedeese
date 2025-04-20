package utez.edu.mx.back.kernel;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MailSenderService {
    private static final Logger logger = LoggerFactory.getLogger(MailSenderService.class);
    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;

    /**
     * Sends an email using a Thymeleaf template
     * 
     * @param to Recipient email address
     * @param subject Email subject
     * @param templateName Name of the Thymeleaf template (without extension)
     * @param variables Map of variables to be used in the template
     * @return true if the email was sent successfully, false otherwise
     */
    public boolean sendTemplateEmail(String to, String subject, String templateName, Map<String, Object> variables) {
        try {
            // Create a Thymeleaf context and add all variables
            Context context = new Context();
            if (variables != null) {
                variables.forEach(context::setVariable);
            }

            // Process the template
            String htmlContent = templateEngine.process(templateName, context);

            // Create a MIME message
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            // Set email properties
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true indicates HTML content

            // Send the email
            javaMailSender.send(mimeMessage);
            logger.info("Email sent successfully to: {}", to);
            return true;
        } catch (MessagingException e) {
            logger.error("Failed to send email to: {}", to, e);
            return false;
        }
    }
}
