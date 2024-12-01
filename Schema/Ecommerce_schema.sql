-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2024 at 04:33 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `getAvgRating` (IN `pId` INT)   BEGIN
	SELECT AVG(r.rating) from product as p 
    JOIN  reviews as r ON r.product_id=p.id 
    where p.id=pId;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `email` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`email`, `password`) VALUES
('zakwanalam07@gmail.com', 'zakwan123');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `cart_item_id` int(11) NOT NULL,
  `email` varchar(60) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1 CHECK (`quantity` > 0),
  `stock_item_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`cart_item_id`, `email`, `product_id`, `quantity`, `stock_item_id`) VALUES
(127, 'zakwanalam07@gmail.com', 3, 1, 4),
(134, 'zakwanalam07@gmail.com', 6, 3, 12),
(131, 'zakwanalam07@gmail.com', 8, 1, 20),
(135, 'zakwanalam07@gmail.com', 13, 1, 49);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `email` varchar(60) NOT NULL,
  `order_date` date NOT NULL,
  `status` enum('Pending','Processing','Shipped','Delivered','Cancelled') NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `stripe_session_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `email`, `order_date`, `status`, `total_price`, `stripe_session_id`) VALUES
(39, 'zakwanalam07@gmail.com', '2024-11-30', 'Processing', 55.20, 'cs_test_b1BxOeDl6J6MvU4gMxUKj7MxGth2tNvhgLtWd3UWTE8kMM1xtNYe2aCbrV'),
(38, 'zakwanalam07@gmail.com', '2024-12-01', 'Processing', 177.24, 'cs_test_b1zcNH1CWXtXSyBWSwAydM9wHLwYUOQWTkrssrxGNlUPMVD0g21U2Ox5wf');

-- --------------------------------------------------------

--
-- Stand-in structure for view `orderview`
-- (See below for the actual view)
--
CREATE TABLE `orderview` (
`stripe_session_id` varchar(255)
,`email` varchar(60)
,`fullName` varchar(60)
,`product_id` int(11)
,`product_name` varchar(60)
,`unit_price` float
,`subtotal` float
,`size` int(11)
,`quantity` int(11)
);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` int(11) NOT NULL,
  `stripe_session_id` varchar(255) NOT NULL,
  `stock_item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` float NOT NULL,
  `subtotal` float GENERATED ALWAYS AS (`quantity` * `unit_price`) STORED
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `stripe_session_id`, `stock_item_id`, `quantity`, `unit_price`) VALUES
(50, 'cs_test_b1zcNH1CWXtXSyBWSwAydM9wHLwYUOQWTkrssrxGNlUPMVD0g21U2Ox5wf', 4, 1, 28),
(51, 'cs_test_b1zcNH1CWXtXSyBWSwAydM9wHLwYUOQWTkrssrxGNlUPMVD0g21U2Ox5wf', 12, 3, 23),
(52, 'cs_test_b1zcNH1CWXtXSyBWSwAydM9wHLwYUOQWTkrssrxGNlUPMVD0g21U2Ox5wf', 20, 1, 24),
(53, 'cs_test_b1zcNH1CWXtXSyBWSwAydM9wHLwYUOQWTkrssrxGNlUPMVD0g21U2Ox5wf', 49, 1, 27),
(54, 'cs_test_b1BxOeDl6J6MvU4gMxUKj7MxGth2tNvhgLtWd3UWTE8kMM1xtNYe2aCbrV', 4, 1, 28),
(55, 'cs_test_b1BxOeDl6J6MvU4gMxUKj7MxGth2tNvhgLtWd3UWTE8kMM1xtNYe2aCbrV', 12, 3, 23),
(56, 'cs_test_b1BxOeDl6J6MvU4gMxUKj7MxGth2tNvhgLtWd3UWTE8kMM1xtNYe2aCbrV', 20, 1, 24),
(57, 'cs_test_b1BxOeDl6J6MvU4gMxUKj7MxGth2tNvhgLtWd3UWTE8kMM1xtNYe2aCbrV', 49, 1, 27);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(60) DEFAULT NULL,
  `image_main` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(15) DEFAULT NULL,
  `subCategory` varchar(15) DEFAULT NULL,
  `image_secondary_1` text DEFAULT NULL,
  `image_secondary_2` text DEFAULT NULL,
  `status` varchar(15) DEFAULT NULL,
  `sales` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `image_main`, `description`, `category`, `subCategory`, `image_secondary_1`, `image_secondary_2`, `status`, `sales`) VALUES
(3, 'Nike Jordans 1', 'https://firebasestorage.googleapis.com/v0/b/zakwan-alam.appspot.com/o/images%2F25303.jpg?alt=media&token=7a9c9570-f8fb-49eb-a70f-653ad5a5cde3', 'asdsadd', 'Casual', 'Casual', 'https://firebasestorage.googleapis.com/v0/b/zakwan-alam.appspot.com/o/images%2F87783.jpg?alt=media&token=46dd01e4-cdcc-4f20-ace5-34acdf25f2cd', '', 'Active', 0),
(4, 'Nike V2K Run', 'https://firebasestorage.googleapis.com/v0/b/zakwan-alam.appspot.com/o/images%2F51426.png?alt=media&token=978ac476-b42c-4110-8136-659bac49fdb1', 'Fast forward. Rewind. Doesn\'t matter—this shoe takes retro into the future. The V2K remasters everything you love about the Vomero in a look pulled straight from an early \'00s running catalogue. Layer up in a mixture of flashy metallics, breathable mesh and a midsole with a perfectly aged aesthetic. The dual-density foam midsole and chunky heel make sure wherever you go, it\'s in comfort.\n', 'Casual', 'Sports', 'https://firebasestorage.googleapis.com/v0/b/zakwan-alam.appspot.com/o/images%2F14008.png?alt=media&token=c8acbfc4-9e06-4754-a165-1b7a57d6c442', '', 'Active', 0),
(5, 'Luka 3 PF \'Motorsport\'', 'https://firebasestorage.googleapis.com/v0/b/zakwan-alam.appspot.com/o/images%2F56562.png?alt=media&token=86f6519a-f07d-4bb2-8eb2-0926230b5c3f', 'On the court, Luka sets his own pace. But put him behind the wheel and it\'s a whole different story. Inspired by MJ and Luka\'s mutual love of fast vehicles, this Luka 3 will have you reaching for your seatbelt with a design that nods to screeching tyres and burning rubber. A touch of elephant print roots the design to Jordan heritage, while lightweight, responsive foam helps you speed up and slow down so you can make space and score.\n\n\nColour Shown: White/Black/Red Orbit/Metallic Gold\nStyle: FQ1285-170\nCountry/Region of Origin: Vietnam', 'Sports', 'Sports', 'https://firebasestorage.googleapis.com/v0/b/zakwan-alam.appspot.com/o/images%2F54714.jpg?alt=media&token=67846d36-5a8c-476a-a6b7-a2a9aa4dab06', 'https://firebasestorage.googleapis.com/v0/b/zakwan-alam.appspot.com/o/images%2F49611.png?alt=media&token=0308dc4a-e9ab-4934-ba83-ff82f44ebbf4', 'Active', 0),
(6, 'Racer TR23 Shoes', 'https://firebasestorage.googleapis.com/v0/b/zakwan-alam.appspot.com/o/images%2F6392.png?alt=media&token=bd71ce8c-38de-4ce1-8def-f6c6ad201fac', 'Busy days start here, with kicks that keep you comfortable through it all. A lightweight upper gives you freedom to move while a soft lining adds gentle support. The Cloudfoam midsole cushions your step and a durable rubber outsole grips the ground to propel you onward. From winding coastal paths to crowded city streets, these adidas sneakers help you navigate with ease.\n\nThis product features at least 20% recycled materials. By reusing materials that have already been created, we help to reduce waste and our reliance on finite resources and reduce the footprint of the products we make.', 'Casual', 'Casual', 'https://firebasestorage.googleapis.com/v0/b/zakwan-alam.appspot.com/o/images%2F58489.png?alt=media&token=6b184a03-0e22-49c6-8e54-b6c8c2636588', '', 'Active', 0),
(8, 'Fuse 2.0 Men\'s Training Shoes', 'https://firebasestorage.googleapis.com/v0/b/zakwan-alam.appspot.com/o/images%2F52790.png?alt=media&token=c7a2f0e9-06f7-4b0d-ab03-ecf572cd9120', 'We worked with professional athletes to amplify three key training attributes—stability, fit, and traction. The FUSE 2.0 features increased rubber for enhanced stability, including higher sidewall coverage to ensure traction and grip. The streamlined upper construction provides durability for rope climbs, while a lightweight TPU heel clip is designed for handstand push-ups. And all this innovation comes in one sleek package to help you reach your ultimate training potential.?\nStyle: 376151_13\nColor: PUMA Black-Cayenne-Wood Violet', 'Sports', 'Casual', 'https://firebasestorage.googleapis.com/v0/b/zakwan-alam.appspot.com/o/images%2F67756.png?alt=media&token=a070ab05-8248-4aba-9f77-f553231e086e', 'https://firebasestorage.googleapis.com/v0/b/zakwan-alam.appspot.com/o/images%2F52850.png?alt=media&token=3f6ba110-f77a-4b91-85be-055204d08503', 'Active', 0),
(13, 'Nike Superfly 10 Academy Mercurial Dream Speed', 'https://firebasestorage.googleapis.com/v0/b/zakwan-alam.appspot.com/o/images%2F2471.png?alt=media&token=ddfa638a-792e-46a7-aee4-3a4daeb287c9', 'Looking to take your speed to the next level? We made these Academy boots with an improved heel Air Zoom unit. It gives you the propulsive feel needed to break through the back line. The result is the most responsive Mercurial we\'ve ever made, so you can dictate pace and tempo all match long. This special version encourages you to chase your own destiny with all-out optimism.\n\n', 'Casual', 'Casual', 'https://firebasestorage.googleapis.com/v0/b/zakwan-alam.appspot.com/o/images%2F74032.png?alt=media&token=4709b9a3-5956-4d6c-8898-ab979924b6d3', 'https://firebasestorage.googleapis.com/v0/b/zakwan-alam.appspot.com/o/images%2F61938.png?alt=media&token=a8a17c9f-ff5d-423f-8b37-7d7cd4cbf531', 'Active', 0);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(60) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `rating` float DEFAULT NULL,
  `review_text` text DEFAULT NULL,
  `date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `email`, `product_id`, `rating`, `review_text`, `date`) VALUES
(7, 'zakwanalam07@gmail.com', 8, 5, 'Wonderful Product!!', '2024-11-17'),
(8, 'zakwanalam07@gmail.com', 8, 5, 'Excellent comfort!', '2024-11-17');

-- --------------------------------------------------------

--
-- Table structure for table `stock`
--

CREATE TABLE `stock` (
  `stock_item_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `size` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `sales_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `stock`
--

INSERT INTO `stock` (`stock_item_id`, `product_id`, `size`, `price`, `quantity`, `sales_count`) VALUES
(1, 3, 42, 23, 120, 0),
(2, 3, 43, 26, 150, 0),
(4, 3, 44, 28, 110, 0),
(5, 3, 45, 31, 110, 0),
(6, 4, 42, 20, 100, 0),
(7, 4, 43, 22, 120, 0),
(8, 4, 44, 25, 130, 0),
(9, 4, 45, 30, 110, 0),
(10, 6, 42, 18, 90, 0),
(11, 6, 43, 21, 95, 0),
(12, 6, 44, 23, 100, 0),
(13, 6, 45, 28, 105, 0),
(18, 8, 42, 17, 110, 0),
(19, 8, 43, 19, 120, 0),
(20, 8, 44, 24, 125, 0),
(21, 8, 45, 29, 130, 0),
(22, 5, 42, 18, 90, 0),
(23, 5, 43, 20, 95, 0),
(24, 5, 44, 23, 100, 0),
(25, 5, 45, 28, 105, 0),
(49, 13, 45, 27, 100, 0),
(50, 13, 44, 26, 120, 0),
(51, 13, 43, 22, 110, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `email` varchar(60) NOT NULL,
  `fullName` varchar(60) NOT NULL,
  `address` varchar(60) NOT NULL,
  `profile_picture` text NOT NULL,
  `password` text DEFAULT NULL,
  `expiry` date DEFAULT NULL,
  `verifyCode` int(11) DEFAULT NULL,
  `isVerified` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`email`, `fullName`, `address`, `profile_picture`, `password`, `expiry`, `verifyCode`, `isVerified`) VALUES
('farah.jabeen29000@gmail.com', 'Zakwan Alam', 'R267sector8', 'https://avatars.githubusercontent.com/u/124599?v=4', '$2a$10$dUlwyuTnAGWwts2hY2xUC.tZHpmnT34ljuhsIRLg7rEmWA1jfLjCG', '2024-10-03', 0, 1),
('zakwanalam07@gmail.com', 'Zakwan Alam', 'R267 Sector 8 North Karachi', 'https://avatars.githubusercontent.com/u/124599?v=4', '$2a$10$Y1Xp5Jw2uyTYYe9dOnBzHOTThq0NbxPWA5T8NRhOW477IL1KpwyUu', '2024-11-17', 0, 1);

-- --------------------------------------------------------

--
-- Structure for view `orderview`
--
DROP TABLE IF EXISTS `orderview`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `orderview`  AS   (select `o`.`stripe_session_id` AS `stripe_session_id`,`u`.`email` AS `email`,`u`.`fullName` AS `fullName`,`p`.`id` AS `product_id`,`p`.`name` AS `product_name`,`o`.`unit_price` AS `unit_price`,`o`.`subtotal` AS `subtotal`,`s`.`size` AS `size`,`o`.`quantity` AS `quantity` from ((((`orders` `o2` join `order_items` `o` on(`o2`.`stripe_session_id` = `o`.`stripe_session_id`)) join `stock` `s` on(`o`.`stock_item_id` = `s`.`stock_item_id`)) join `product` `p` on(`s`.`product_id` = `p`.`id`)) join `users` `u` on(`o2`.`email` = `u`.`email`)))  ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`email`,`product_id`,`stock_item_id`),
  ADD UNIQUE KEY `cart_item_id` (`cart_item_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `cart_ibfk_3` (`stock_item_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`stripe_session_id`),
  ADD UNIQUE KEY `order_id` (`order_id`),
  ADD UNIQUE KEY `stripe_session_id` (`stripe_session_id`),
  ADD KEY `f_key_email` (`email`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `stripe_session_id` (`stripe_session_id`),
  ADD KEY `stock_item_id` (`stock_item_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `fk_user_email` (`email`),
  ADD KEY `fk_product_id` (`product_id`);

--
-- Indexes for table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`stock_item_id`),
  ADD UNIQUE KEY `product_id` (`product_id`,`size`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=136;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `stock`
--
ALTER TABLE `stock`
  MODIFY `stock_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_ibfk_3` FOREIGN KEY (`stock_item_id`) REFERENCES `stock` (`stock_item_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `f_key_email` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`stripe_session_id`) REFERENCES `orders` (`stripe_session_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`stock_item_id`) REFERENCES `stock` (`stock_item_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_email` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `fk_product_stock` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
