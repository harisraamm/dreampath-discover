package com.dreampath.user;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class UserSchemaMigration implements ApplicationRunner {
    private final JdbcTemplate jdbcTemplate;

    public UserSchemaMigration(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN email DROP NOT NULL");
        jdbcTemplate.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone_unique "
                + "ON users(phone) WHERE phone IS NOT NULL");
    }
}
