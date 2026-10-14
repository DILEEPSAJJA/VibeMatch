package com.vibematch.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
public class MongoConnectionVerifier implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;

    public MongoConnectionVerifier(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public void run(String... args) {
        try {
            String dbName = mongoTemplate.getDb().getName();
            System.out.println("🌐 [MongoDB Atlas] Connecting to database: " + dbName);
            int count = mongoTemplate.getCollectionNames().size();
            System.out.println("✅ [MongoDB Atlas] Successfully connected to MongoDB Atlas! Existing collections: " + count);
        } catch (Exception e) {
            System.err.println("⚠️ [MongoDB Atlas] Connection pending: " + e.getMessage());
            System.err.println("👉 Please ensure the Database User 'dileep_admin' with password 'Dileep123' exists in MongoDB Atlas -> Security -> Database Access with 'Read and write to any database' privilege.");
        }
    }
}
