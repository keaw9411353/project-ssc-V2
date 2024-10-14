-- CreateTable
CREATE TABLE `categories` (
    `CategoriesID` INTEGER NOT NULL AUTO_INCREMENT,
    `CategoriesName` VARCHAR(255) NULL,

    PRIMARY KEY (`CategoriesID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `paymentID` INTEGER NOT NULL AUTO_INCREMENT,
    `OrderID` INTEGER NOT NULL,
    `PaymentDate` TIMESTAMP(0) NULL,
    `Amount` DECIMAL(10, 2) NULL,
    `PaymentMethod` ENUM('Credit_Card', 'PayPal', 'Bank_Transfer') NULL,
    `remark` VARCHAR(191) NULL,
    `payment_status` VARCHAR(191) NULL,

    INDEX `OrderID`(`OrderID`),
    PRIMARY KEY (`paymentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orderdetails` (
    `OrdersDetailID` INTEGER NOT NULL AUTO_INCREMENT,
    `OrderID` INTEGER NOT NULL,
    `Products_id` INTEGER NOT NULL,
    `Quantity` INTEGER NULL,
    `UnitPrice` DECIMAL(10, 2) NULL,

    INDEX `Products_id`(`Products_id`),
    PRIMARY KEY (`OrdersDetailID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `OrderID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NULL,
    `OrderDate` TIMESTAMP(0) NULL,
    `TotalAmount` DECIMAL(10, 2) NULL,
    `OrderStatus` ENUM('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED') NULL,
    `phonenumber` VARCHAR(191) NULL,
    `shipping_address` VARCHAR(191) NULL,

    INDEX `UserID`(`UserID`),
    PRIMARY KEY (`OrderID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `Products_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ProductsName` VARCHAR(255) NULL,
    `CategoryID` INTEGER NULL,
    `Description` TEXT NULL,
    `Price` DECIMAL(10, 2) NULL,
    `ImageURL` VARCHAR(255) NULL,
    `status` VARCHAR(255) NULL,

    PRIMARY KEY (`Products_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `ReviewID` INTEGER NOT NULL AUTO_INCREMENT,
    `ProductID` INTEGER NOT NULL,
    `UserID` INTEGER NOT NULL,
    `Comment` TEXT NULL,
    `Rating` INTEGER NULL,
    `CreatedAt` TIMESTAMP(0) NULL,

    PRIMARY KEY (`ReviewID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `UserID` INTEGER NOT NULL AUTO_INCREMENT,
    `Username` VARCHAR(50) NULL,
    `Password` VARCHAR(255) NULL,

    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `ProjectID` INTEGER NOT NULL AUTO_INCREMENT,
    `ProjectName` VARCHAR(255) NULL,
    `Description` TEXT NULL,
    `ImageURL` VARCHAR(255) NULL,

    PRIMARY KEY (`ProjectID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customers` (
    `Customer_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Customer_name` VARCHAR(255) NULL,
    `UserID` INTEGER NOT NULL,
    `Status` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,

    UNIQUE INDEX `customers_UserID_key`(`UserID`),
    INDEX `UserID`(`UserID`),
    PRIMARY KEY (`Customer_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_OrderID_fkey` FOREIGN KEY (`OrderID`) REFERENCES `orders`(`OrderID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderdetails` ADD CONSTRAINT `orderdetails_OrderID_fkey` FOREIGN KEY (`OrderID`) REFERENCES `orders`(`OrderID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderdetails` ADD CONSTRAINT `orderdetails_Products_id_fkey` FOREIGN KEY (`Products_id`) REFERENCES `products`(`Products_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `users`(`UserID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_CategoryID_fkey` FOREIGN KEY (`CategoryID`) REFERENCES `categories`(`CategoriesID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `users`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_ProductID_fkey` FOREIGN KEY (`ProductID`) REFERENCES `products`(`Products_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `users`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;
