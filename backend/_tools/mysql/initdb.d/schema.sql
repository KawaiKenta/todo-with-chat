DROP TABLE IF EXISTS `tasks`;

DROP TABLE IF EXISTS `users`;

CREATE TABLE
    `users` (
        `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ユーザーの識別子',
        `name` varchar(80) NOT NULL COMMENT 'ユーザー名',
        `email` varchar(80) NOT NULL COMMENT 'メールアドレス',
        `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'レコード作成日時',
        `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'レコード修正日時',
        `deleted_at` DATETIME NULL DEFAULT NULL,
        PRIMARY KEY (`id`)
    ) Engine = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = 'ユーザー';

CREATE TABLE
    `tasks` (
        `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'タスクの識別子',
        `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'ユーザーの識別子',
        `title` VARCHAR(256) NOT NULL COMMENT 'タスク名',
        `content` VARCHAR(1024) NOT NULL DEFAULT '' COMMENT 'タスクの詳細',
        `due_date` DATE COMMENT '期限',
        `priority` ENUM('低', '中', '高') NOT NULL DEFAULT '中' COMMENT '優先度',
        `status` ENUM('未着手', '着手中', '完了', '削除済み') NOT NULL DEFAULT '未着手' COMMENT 'ステータス',
        `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'レコード作成日時',
        `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'レコード修正日時',
        `last_modified_by` ENUM('user', 'AI') NOT NULL COMMENT '最終更新者',
        PRIMARY KEY (`id`),
        CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
    ) Engine = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = 'タスク';

INSERT INTO users (name, email) VALUES ('test', 'testuser@mail.com');

INSERT INTO
    tasks (
        user_id,
        title,
        content,
        due_date,
        priority,
        status,
        last_modified_by
    )
VALUES (
        1,
        'test',
        'test',
        '2023-12-10',
        '中',
        '未着手',
        'user'
    ), (
        1,
        'test1',
        'test1',
        '2023-12-10',
        '高',
        '未着手',
        'user'
    ), (
        1,
        'test2',
        'test2',
        '2023-12-10',
        '低',
        '未着手',
        'AI'
    );

INSERT INTO
    tasks (
        user_id,
        title,
        content,
        priority,
        status,
        last_modified_by
    )
VALUES (
        1,
        'test3',
        'test3',
        '中',
        '未着手',
        'user'
    ), (
        1,
        'test4',
        'test4',
        '高',
        '着手中',
        'user'
    ), (
        1,
        'test5',
        'test5',
        '低',
        '削除済み',
        'AI'
    ), (
        1,
        'test6',
        'test6',
        '中',
        '完了',
        'user'
    )