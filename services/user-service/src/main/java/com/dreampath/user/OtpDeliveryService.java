package com.dreampath.user;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class OtpDeliveryService {
    private final ObjectProvider<JavaMailSender> mailSenders;
    private final String mailFrom;
    private final String twilioAccountSid;
    private final String twilioAuthToken;
    private final String twilioFromNumber;
    private final int expiresMinutes;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public OtpDeliveryService(ObjectProvider<JavaMailSender> mailSenders,
                              @Value("${app.mail.from:}") String mailFrom,
                              @Value("${app.twilio.account-sid:}") String twilioAccountSid,
                              @Value("${app.twilio.auth-token:}") String twilioAuthToken,
                              @Value("${app.twilio.from-number:}") String twilioFromNumber,
                              @Value("${app.otp.expires-minutes:5}") int expiresMinutes) {
        this.mailSenders = mailSenders;
        this.mailFrom = mailFrom;
        this.twilioAccountSid = twilioAccountSid;
        this.twilioAuthToken = twilioAuthToken;
        this.twilioFromNumber = twilioFromNumber;
        this.expiresMinutes = expiresMinutes;
    }

    public String send(String contact, String code, boolean email) {
        if (email) {
            sendEmail(contact, code);
            return "EMAIL";
        }
        sendSms(contact, code);
        return "SMS";
    }

    private void sendEmail(String contact, String code) {
        JavaMailSender sender = mailSenders.getIfAvailable();
        if (sender == null || mailFrom.isBlank()) {
            throw new OtpDeliveryException("Email OTP delivery is not configured.");
        }
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom);
        message.setTo(contact);
        message.setSubject("Your Dreampath Discover sign-in code");
        message.setText("Your one-time sign-in code is " + code
                + ". It expires in " + expiresMinutes + " minutes. Do not share this code with anyone.");
        try {
            sender.send(message);
        } catch (RuntimeException exception) {
            throw new OtpDeliveryException("Email OTP could not be delivered.");
        }
    }

    private void sendSms(String contact, String code) {
        if (twilioAccountSid.isBlank() || twilioAuthToken.isBlank() || twilioFromNumber.isBlank()) {
            throw new OtpDeliveryException("SMS OTP delivery is not configured.");
        }
        String endpoint = "https://api.twilio.com/2010-04-01/Accounts/"
                + encode(twilioAccountSid) + "/Messages.json";
        String form = "To=" + encode(contact)
                + "&From=" + encode(twilioFromNumber)
                + "&Body=" + encode("Your Dreampath Discover sign-in code is " + code
                        + ". It expires in " + expiresMinutes + " minutes. Do not share this code.");
        String credentials = Base64.getEncoder().encodeToString(
                (twilioAccountSid + ":" + twilioAuthToken).getBytes(StandardCharsets.UTF_8));
        HttpRequest request = HttpRequest.newBuilder(URI.create(endpoint))
                .header("Authorization", "Basic " + credentials)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(form))
                .build();
        try {
            HttpResponse<Void> response = httpClient.send(request, HttpResponse.BodyHandlers.discarding());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new OtpDeliveryException("SMS OTP could not be delivered.");
            }
        } catch (IOException exception) {
            throw new OtpDeliveryException("SMS OTP could not be delivered.");
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new OtpDeliveryException("SMS OTP delivery was interrupted.");
        }
    }

    private static String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    public static class OtpDeliveryException extends RuntimeException {
        public OtpDeliveryException(String message) { super(message); }
    }
}
