-- CreateTable
CREATE TABLE `profiles` (
    `id` VARCHAR(36) NOT NULL,
    `cnpj` VARCHAR(14) NULL,
    `cpf` VARCHAR(11) NULL,
    `name` VARCHAR(100) NOT NULL,
    `cellphone` VARCHAR(20) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `email` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `profiles_cnpj_key`(`cnpj`),
    UNIQUE INDEX `profiles_cpf_key`(`cpf`),
    UNIQUE INDEX `profiles_cellphone_key`(`cellphone`),
    UNIQUE INDEX `profiles_email_key`(`email`),
    INDEX `profiles_email_idx`(`email`),
    INDEX `profiles_cpf_idx`(`cpf`),
    INDEX `profiles_cnpj_idx`(`cnpj`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `addresses` (
    `id` VARCHAR(36) NOT NULL,
    `profileId` VARCHAR(36) NOT NULL,
    `zipcode` VARCHAR(8) NOT NULL,
    `street` VARCHAR(100) NOT NULL,
    `number` VARCHAR(10) NOT NULL,
    `complement` VARCHAR(50) NULL,
    `neighborhood` VARCHAR(100) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `state` VARCHAR(2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `addresses_profileId_key`(`profileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
