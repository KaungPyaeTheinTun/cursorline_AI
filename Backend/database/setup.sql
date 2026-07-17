-- ============================================
-- Cursorline Database Setup
-- Run this in phpMyAdmin (http://localhost/phpmyadmin)
-- ============================================

CREATE DATABASE IF NOT EXISTS `cursorline`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `cursorline`;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `password` VARCHAR(255) NULL DEFAULT NULL,
  `avatar` VARCHAR(255) NULL DEFAULT NULL,
  `provider` VARCHAR(255) NULL DEFAULT NULL,
  `provider_id` VARCHAR(255) NULL DEFAULT NULL,
  `plan_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `usage_started_at` TIMESTAMP NULL DEFAULT NULL,
  `remember_token` VARCHAR(100) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- OAuth providers table
CREATE TABLE IF NOT EXISTS `oauth_providers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `provider` VARCHAR(255) NOT NULL,
  `provider_id` VARCHAR(255) NOT NULL,
  `access_token` TEXT NULL DEFAULT NULL,
  `refresh_token` TEXT NULL DEFAULT NULL,
  `token_expires_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `oauth_providers_provider_provider_id_unique` (`provider`, `provider_id`),
  KEY `oauth_providers_user_id_foreign` (`user_id`),
  CONSTRAINT `oauth_providers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Personal access tokens table (for Sanctum)
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` VARCHAR(255) NOT NULL,
  `tokenable_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `token` VARCHAR(64) NOT NULL,
  `abilities` TEXT NULL DEFAULT NULL,
  `last_used_at` TIMESTAMP NULL DEFAULT NULL,
  `expires_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`, `tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Conversations table
CREATE TABLE IF NOT EXISTS `conversations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL DEFAULT 'New Conversation',
  `last_message_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `conversations_user_id_foreign` (`user_id`),
  KEY `conversations_last_message_at_index` (`last_message_at`),
  KEY `conversations_user_id_last_message_at_index` (`user_id`, `last_message_at`),
  CONSTRAINT `conversations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Messages table
CREATE TABLE IF NOT EXISTS `messages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `conversation_id` BIGINT UNSIGNED NOT NULL,
  `role` ENUM('user','assistant') NOT NULL,
  `content` LONGTEXT NOT NULL,
  `tokens` INT UNSIGNED NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `messages_conversation_id_foreign` (`conversation_id`),
  KEY `messages_role_index` (`role`),
  KEY `messages_created_at_index` (`created_at`),
  KEY `messages_conversation_id_created_at_index` (`conversation_id`, `created_at`),
  KEY `messages_conversation_id_role_index` (`conversation_id`, `role`),
  CONSTRAINT `messages_conversation_id_foreign` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Password reset codes table
CREATE TABLE IF NOT EXISTS `password_reset_codes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `code` VARCHAR(6) NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `used` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `password_reset_codes_email_index` (`email`),
  KEY `password_reset_codes_email_code_index` (`email`, `code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Roles table
CREATE TABLE IF NOT EXISTS `roles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`),
  UNIQUE KEY `roles_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Role-user pivot table
CREATE TABLE IF NOT EXISTS `role_user` (
  `user_id` BIGINT UNSIGNED NOT NULL,
  `role_id` BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`),
  KEY `role_user_user_id_foreign` (`user_id`),
  KEY `role_user_role_id_foreign` (`role_id`),
  CONSTRAINT `role_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_user_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FAQs table
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `question` VARCHAR(255) NOT NULL,
  `answer` TEXT NOT NULL,
  `sort_order` INT UNSIGNED NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Plans table
CREATE TABLE IF NOT EXISTS `plans` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `price` INT UNSIGNED NOT NULL DEFAULT 0,
  `period` VARCHAR(255) NOT NULL DEFAULT 'month',
  `description` TEXT NULL DEFAULT NULL,
  `features` JSON NULL DEFAULT NULL,
  `cta` VARCHAR(255) NOT NULL DEFAULT 'Get Started',
  `highlighted` TINYINT(1) NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT UNSIGNED NOT NULL DEFAULT 0,
  `usage_duration_minutes` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plans_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Seed Data
-- ============================================

-- Roles
INSERT INTO `roles` (`name`, `slug`, `created_at`, `updated_at`) VALUES
('Admin', 'admin', NOW(), NOW()),
('User', 'user', NOW(), NOW());

-- Admin user (password: password)
INSERT INTO `users` (`name`, `email`, `password`, `email_verified_at`, `created_at`, `updated_at`) VALUES
('Admin', 'admin@cursorline.dev', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW(), NOW());

-- Demo user (password: password)
INSERT INTO `users` (`name`, `email`, `password`, `email_verified_at`, `created_at`, `updated_at`) VALUES
('Demo User', 'demo@cursorline.dev', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW(), NOW());

-- Assign roles
INSERT INTO `role_user` (`user_id`, `role_id`) VALUES
(1, 1),
(2, 2);

-- FAQs
INSERT INTO `faqs` (`question`, `answer`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
('What is Cursorline?', 'Cursorline is an AI-powered coding assistant that indexes your entire repository and provides intelligent autocomplete, debugging, and refactoring suggestions.', 1, 1, NOW(), NOW()),
('How does the AI indexing work?', 'Cursorline analyzes your codebase structure, dependencies, and patterns to build a contextual understanding of your project. This allows it to provide relevant suggestions.', 2, 1, NOW(), NOW()),
('Which programming languages are supported?', 'Cursorline supports all major programming languages including JavaScript, TypeScript, Python, Java, C#, Go, Rust, and many more.', 3, 1, NOW(), NOW()),
('Is my code data secure?', 'Yes. Your code is processed locally and is never stored on our servers. We only use it to provide real-time suggestions during your session.', 4, 1, NOW(), NOW()),
('Can I use Cursorline with my team?', 'Yes! Cursorline offers team plans with shared context and collaborative features. Check our pricing page for more details.', 5, 1, NOW(), NOW()),
('What is the difference between Free and Pro?', 'The Free plan includes basic autocomplete and up to 50 daily requests. Pro unlocks advanced debugging, refactoring, full context window, and unlimited requests.', 6, 1, NOW(), NOW());

-- Plans
INSERT INTO `plans` (`name`, `slug`, `price`, `period`, `description`, `features`, `cta`, `highlighted`, `is_active`, `sort_order`, `usage_duration_minutes`, `created_at`, `updated_at`) VALUES
('Free', 'free', 0, 'month', 'For individual developers exploring Cursorline.', '["1 hour of AI chat","Single-repo indexing","Stack trace analysis","VS Code extension","Community support"]', 'Get Started Free', 0, 1, 1, 60, NOW(), NOW()),
('Pro', 'pro', 1900, 'month', 'For professional developers who ship daily.', '["30 days of AI chat","Unlimited completions","Multi-repo indexing","Multi-file refactors","Git-aware PR review","All supported editors","Priority support"]', 'Start Pro Trial', 1, 1, 2, 43200, NOW(), NOW()),
('Plus', 'plus', 4900, 'month', 'For teams that want shared context and admin controls.', '["90 days of AI chat","Everything in Pro","Shared team context","Org-wide codebase index","Admin dashboard & usage","SSO / SAML","Dedicated support"]', 'Contact Sales', 0, 1, 3, 129600, NOW(), NOW());

-- Jobs table (for database queue driver)
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` VARCHAR(255) NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `attempts` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `reserved_at` INT UNSIGNED NULL DEFAULT NULL,
  `available_at` INT UNSIGNED NOT NULL,
  `created_at` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Failed jobs table
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` VARCHAR(255) NOT NULL,
  `connection` TEXT NOT NULL,
  `queue` TEXT NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `exception` LONGTEXT NOT NULL,
  `failed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
