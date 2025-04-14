-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Апр 14 2025 г., 22:26
-- Версия сервера: 10.4.32-MariaDB
-- Версия PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `cloudecrm`
--

-- --------------------------------------------------------

--
-- Структура таблицы `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `login` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL,
  `name` varchar(64) NOT NULL,
  `admin` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `accounts`
--

INSERT INTO `accounts` (`id`, `login`, `password`, `name`, `admin`) VALUES
(1, 'admin', 'admin', 'Администратор', 2),
(2, '11', '123', 'Сотрудник', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `buyers`
--

CREATE TABLE `buyers` (
  `id` int(11) NOT NULL,
  `buys` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `numberPhone` varchar(11) NOT NULL,
  `discount` int(3) NOT NULL DEFAULT 5,
  `bonuses` int(64) NOT NULL,
  `barcode` varchar(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `buyers`
--

INSERT INTO `buyers` (`id`, `buys`, `name`, `numberPhone`, `discount`, `bonuses`, `barcode`) VALUES
(34, 0, 'ccc', '111', 5, 0, '4600000000001'),
(35, 0, '111', '111', 5, 0, '4600000000002'),
(36, 0, 'вфвфы', '111', 5, 0, '4600000000003');

-- --------------------------------------------------------

--
-- Структура таблицы `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` int(64) NOT NULL,
  `count` int(11) NOT NULL,
  `barcode` varchar(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `items`
--

INSERT INTO `items` (`id`, `name`, `price`, `count`, `barcode`) VALUES
(1, '111', 1000, 1, '1678234590129'),
(2, 'товар', 1000, 1, '1678234590129');

-- --------------------------------------------------------

--
-- Структура таблицы `receipts`
--

CREATE TABLE `receipts` (
  `id` int(11) NOT NULL,
  `shifId` int(11) NOT NULL,
  `total` int(64) NOT NULL,
  `date` datetime(6) NOT NULL,
  `employee` int(11) NOT NULL,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`items`)),
  `buyerId` int(11) NOT NULL DEFAULT -1,
  `discount` int(11) NOT NULL DEFAULT 0,
  `toPaid` int(64) NOT NULL,
  `payment` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `receipts`
--

INSERT INTO `receipts` (`id`, `shifId`, `total`, `date`, `employee`, `items`, `buyerId`, `discount`, `toPaid`, `payment`) VALUES
(1, 0, 0, '2025-04-01 04:25:20.000000', 0, '[{\"id\": 1, \"count\": 1}]\n', -1, 0, 100, 0),
(26, 1, 1, '2025-04-02 14:57:28.445000', 1, '[{\"id\":1,\"count\":1}]', 34, 5, 1, 0),
(27, 1, 1000, '2025-04-02 14:58:59.531000', 1, '[{\"id\":1,\"count\":1}]', -1, 0, 1000, 0),
(28, 1, 1000, '2025-04-02 14:59:23.219000', 1, '[{\"id\":1,\"count\":1}]', -1, 0, 1000, 0),
(29, 1, 1000, '2025-04-02 14:59:27.066000', 1, '[{\"id\":1,\"count\":1}]', -1, 0, 1000, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `settings`
--

CREATE TABLE `settings` (
  `marketName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `settings`
--

INSERT INTO `settings` (`marketName`) VALUES
('CloudCore');

-- --------------------------------------------------------

--
-- Структура таблицы `shifts`
--

CREATE TABLE `shifts` (
  `id` int(11) NOT NULL,
  `dateOpen` datetime(6) NOT NULL,
  `dateClose` datetime(6) NOT NULL,
  `employee` int(11) NOT NULL,
  `isOpen` tinyint(5) NOT NULL DEFAULT 1,
  `sales` int(11) NOT NULL,
  `generalReceipt` int(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `shifts`
--

INSERT INTO `shifts` (`id`, `dateOpen`, `dateClose`, `employee`, `isOpen`, `sales`, `generalReceipt`) VALUES
(1, '2025-04-01 04:26:08.000000', '2025-04-01 04:26:08.000000', 1, 1, 27, 12902);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `buyers`
--
ALTER TABLE `buyers`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `receipts`
--
ALTER TABLE `receipts`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `shifts`
--
ALTER TABLE `shifts`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `buyers`
--
ALTER TABLE `buyers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT для таблицы `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `receipts`
--
ALTER TABLE `receipts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT для таблицы `shifts`
--
ALTER TABLE `shifts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
