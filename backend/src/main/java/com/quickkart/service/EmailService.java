package com.quickkart.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${quickkart.mail.sender:noreply@quickkart.com}")
    private String senderEmail;

    public void sendOrderStatusEmail(String toEmail, String customerName, String productName, String newStatus) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail);
            helper.setTo(toEmail);
            helper.setSubject("QuickKart: Order Status Update for " + productName);

            String htmlContent = buildEmailTemplate(customerName, productName, newStatus);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
        }
    }

    private String buildEmailTemplate(String customerName, String productName, String newStatus) {
        String color = "#2874F0"; // Flipkart blue
        if ("DELIVERED".equals(newStatus)) color = "#26A541"; // Green
        else if ("CANCELLED".equals(newStatus)) color = "#FF6161"; // Red
        
        return "<html>" +
                "<body style='font-family: Arial, sans-serif; background-color: #f1f3f6; padding: 20px;'>" +
                "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>" +
                "<div style='text-align: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 15px; margin-bottom: 20px;'>" +
                "<h1 style='color: #2874F0; margin: 0;'>QuickKart</h1>" +
                "</div>" +
                "<p style='color: #212121; font-size: 16px;'>Hi " + customerName + ",</p>" +
                "<p style='color: #212121; font-size: 16px;'>The status of your order for <strong>" + productName + "</strong> has been updated.</p>" +
                "<div style='background-color: " + color + "; color: #ffffff; padding: 15px; text-align: center; border-radius: 4px; margin: 20px 0; font-size: 18px; font-weight: bold;'>" +
                "Status: " + newStatus +
                "</div>" +
                "<p style='color: #878787; font-size: 14px; text-align: center;'>Thank you for shopping with QuickKart!</p>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}
