-- 新建部门表
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
    `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '唯一标识',
    `name` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '部门名称',
    `parentId` int(11) UNSIGNED NOT NULL DEFAULT 0 COMMENT '父ID',
    `sort` int(11) NOT NULL DEFAULT 0 COMMENT '排序，越小越靠前',
    `createdAt` datetime(0) NOT NULL COMMENT '创建时间',
    `updatedAt` datetime(0) NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE INDEX `name`(`name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1000001 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;


INSERT INTO `departments` VALUES (9999999, '总公司', 0, 0, now(), now());


-- 新建成员表
DROP TABLE IF EXISTS `members`;
CREATE TABLE `members` (
    `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '唯一标识',
    `departmentsId` int(11) UNSIGNED NOT NULL DEFAULT 0 COMMENT '所在部门id',
    `name` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '成员名称',
    `email` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '邮箱',
    `state` tinyint(4) NOT NULL DEFAULT 1 COMMENT '状态：0.停用、1.正常',
    `phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '手机号',
    `createdAt` datetime(0) NOT NULL COMMENT '创建时间',
    `updatedAt` datetime(0) NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE INDEX `name`(`name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1000001 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;