package com.urlShortener.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

@RestController
public class BuggyTestController {

    // 1. SECURITY VULNERABILITY: Hardcoded API token / Secret Key
    private static final String AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

    @GetMapping("/api/test-buggy")
    public String testBuggyEndpoint(
            @RequestParam String userId,
            @RequestParam(required = false) String userType
    ) {
        // 2. LOGIC BUG: Potential NullPointerException if userType is null
        if (userType.equalsIgnoreCase("PREMIUM")) {
            System.out.println("User is premium");
        }

        try {
            // 3. SECURITY VULNERABILITY: SQL Injection vulnerability via string concatenation
            Connection conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/mydb", "user", "pass");
            Statement stmt = conn.createStatement();
            String query = "SELECT * FROM users WHERE id = '" + userId + "' AND secret = '" + AWS_SECRET_ACCESS_KEY + "'";
            ResultSet rs = stmt.executeQuery(query);

            // 4. LOGIC BUG: Off-by-one array index out of bounds loop error
            int[] buffer = new int[10];
            for (int i = 0; i <= buffer.length; i++) {
                buffer[i] = i * 2;
            }

            if (rs.next()) {
                return "User found: " + rs.getString("username");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return "Done";
    }
}
