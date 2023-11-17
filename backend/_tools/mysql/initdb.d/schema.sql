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

CREATE TABLE
    `slack_users` (
        `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'ユーザーの識別子',
        `slack_id` VARCHAR(80) NOT NULL COMMENT 'SlackのユーザーID',
        CONSTRAINT `fk_user_slack` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
    ) Engine = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = 'ユーザーとSlackの紐付け';

INSERT INTO users (name, email)
VALUES (
        'Taro Yamada',
        'TaroYamada@mail.com'
    );

INSERT INTO users (name, email)
VALUES (
        'Kento Ito',
        'KentoIto@mail.com'
    );

INSERT INTO users (name, email)
VALUES (
        'Yuki Sato',
        'YukiSato@mail.com'
    );

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
        '月次報告書の作成',
        '先月の業績や課題をまとめて報告書を作成',
        '2023-12-31',
        '中',
        '未着手',
        'user'
    ), (
        1,
        'クライアントミーティングの準備',
        '次回のクライアントミーティングに向けて資料の準備',
        '2024-01-05',
        '高',
        '未着手',
        'user'
    ), (
        1,
        'プロジェクト進捗の調査',
        'プロジェクトの進捗状況を確認し、課題点を洗い出す',
        NULL,
        '中',
        '完了',
        'user'
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
        '月次レポートの作成',
        '先月の業績や課題をまとめて報告書を作成する',
        '中',
        '未着手',
        'user'
    ), (
        1,
        '新プロジェクトのキックオフミーティング',
        '新しいプロジェクトの計画や目標を確認するためのミーティングに参加',
        '高',
        '着手中',
        'user'
    ), (
        1,
        'クライアント契約交渉',
        '新規クライアントとの契約交渉を行い、条件や提案を調整',
        '低',
        '削除済み',
        'AI'
    ), (
        1,
        '進捗報告書の最終確認',
        '進捗報告書の内容を確認し、必要な修正を行う',
        '中',
        '完了',
        'user'
    );

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
        2,
        '田中さんとの打ち合わせ',
        'これまでの進捗を報告する',
        '2023-12-10',
        '中',
        '未着手',
        'user'
    ), (
        2,
        '次回プロジェクト計画の作成',
        '新しいプロジェクトの計画を立てる',
        '2023-12-15',
        '高',
        '完了',
        'user'
    ), (
        2,
        'クライアントからの質問回答',
        'クライアントからの質問に対する回答をまとめる',
        '2023-12-18',
        '中',
        '着手中',
        'user'
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
        2,
        '週次レポートの作成',
        '今週の業務報告をまとめてレポート作成',
        '中',
        '未着手',
        'user'
    ), (
        2,
        'プロジェクトメンバーとの週次会議',
        '進捗状況や課題を共有し、次のステップを検討する',
        '高',
        '未着手',
        'user'
    ), (
        2,
        '新規クライアントの提案書作成',
        '新規クライアントへの提案書を作成してレビュー依頼',
        '高',
        '未着手',
        'user'
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
        3,
        'クライアントミーティングの予定調整',
        '次回のクライアントミーティングの日程調整と参加者の確認',
        '中',
        '未着手',
        'user'
    ), (
        3,
        'プロジェクトの課題解決会議',
        'プロジェクト内の課題や障害に対する解決策を検討するための会議',
        '高',
        '着手中',
        'user'
    ), (
        3,
        'マーケティング戦略の見直し',
        '現行のマーケティング戦略を評価し、改善点を見つける',
        '低',
        '未着手',
        'user'
    ), (
        3,
        '社内勉強会の企画',
        '新しい技術や知識の共有のための社内勉強会を企画',
        '中',
        '未着手',
        'user'
    );

INSERT INTO
    slack_users (user_id, slack_id)
VALUES (1, 'U04C2SYER3R'), (2, 'U04CVU9HQ4R'), (3, 'U04CHBVE21G');