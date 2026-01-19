-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 14, 2026 at 08:42 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `erp_db2`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` bigint(20) NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `city`, `country`, `postal_code`, `state`, `street`, `user_id`) VALUES
(1, 'Jakarta', 'Indonesia', '10110', 'DKI', '123 Admin St', 1),
(2, 'Bandung', 'Indonesia', '40115', 'Jawa Barat', '456 HR Ln', 2);

-- --------------------------------------------------------

--
-- Table structure for table `addresses_seq`
--

CREATE TABLE `addresses_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addresses_seq`
--

INSERT INTO `addresses_seq` (`next_val`) VALUES
(1);

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` bigint(20) NOT NULL,
  `date` date DEFAULT NULL,
  `overtime` bit(1) NOT NULL,
  `present` bit(1) NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `status` enum('ABSENT','HALF_DAY','LEAVE','NOT_MARKED','PRESENT') DEFAULT NULL,
  `employee_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `date`, `overtime`, `present`, `remarks`, `status`, `employee_id`) VALUES
(1, '2025-04-01', b'0', b'1', 'On Time', 'PRESENT', 1),
(2, '2025-04-02', b'0', b'1', 'On Time', 'PRESENT', 1),
(3, '2025-04-03', b'0', b'0', 'Sick', 'ABSENT', 1),
(4, '2025-04-01', b'0', b'1', 'On Time', 'PRESENT', 2),
(5, '2025-04-02', b'0', b'0', 'Casual Leave', 'LEAVE', 2);

-- --------------------------------------------------------

--
-- Table structure for table `core_company`
--

CREATE TABLE `core_company` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `active` bit(1) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_company`
--

INSERT INTO `core_company` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `active`, `code`, `name`) VALUES
(1, '2026-01-12 06:52:17.000000', 'admin@test.com', '2026-01-12 06:52:17.000000', 'admin@test.com', b'1', '12345678', 'PT Mencari Cinta Sejati');

-- --------------------------------------------------------

--
-- Table structure for table `core_document_sequence`
--

CREATE TABLE `core_document_sequence` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `document_type` varchar(64) NOT NULL,
  `next_number` bigint(20) NOT NULL,
  `padding` int(11) NOT NULL,
  `prefix` varchar(255) NOT NULL,
  `company_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_document_sequence`
--

INSERT INTO `core_document_sequence` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `document_type`, `next_number`, `padding`, `prefix`, `company_id`) VALUES
(7, '2026-01-12 07:48:31.000000', 'admin@test.com', '2026-01-14 02:12:42.000000', 'admin@test.com', 'PURCHASE_ORDER', 4, 5, 'PO-', 1),
(8, '2026-01-12 07:49:20.000000', 'admin@test.com', '2026-01-13 02:47:14.000000', 'admin@test.com', 'SALES_ORDER', 3, 5, 'SO-', 1),
(9, '2026-01-12 08:44:41.000000', 'admin@test.com', '2026-01-12 08:44:41.000000', 'admin@test.com', 'INVENTORY_MOVEMENT', 2, 5, 'MM-', 1),
(12, '2026-01-13 03:55:23.000000', 'admin@test.com', '2026-01-13 03:55:23.000000', 'admin@test.com', 'WORK_ORDER', 2, 5, 'WO-', 1),
(16, '2026-01-14 04:03:59.000000', 'admin@test.com', '2026-01-14 04:16:39.000000', 'admin@test.com', 'INVENTORY_ADJUSTMENT', 3, 5, 'IA-', 1);

-- --------------------------------------------------------

--
-- Table structure for table `core_org`
--

CREATE TABLE `core_org` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `active` bit(1) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `company_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_org`
--

INSERT INTO `core_org` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `active`, `code`, `name`, `company_id`) VALUES
(1, '2026-01-13 04:27:48.000000', 'admin@test.com', '2026-01-13 04:27:48.000000', 'admin@test.com', b'1', '00001', 'Head Office', 1),
(2, '2026-01-13 07:02:30.000000', 'admin@test.com', '2026-01-13 07:02:30.000000', 'admin@test.com', b'1', '00002', 'FPI', 1);

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`) VALUES
(1, 'HR'),
(2, 'Finance'),
(3, 'Engineering'),
(4, 'Sales'),
(5, 'Inventory'),
(6, 'Production');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` bigint(20) NOT NULL,
  `base_salary` double DEFAULT NULL,
  `bonus` double DEFAULT NULL,
  `deduction` double DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `final_salary` double DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `performance_impact` double DEFAULT NULL,
  `performance_rating` double DEFAULT NULL,
  `phone` varchar(255) NOT NULL,
  `role` enum('ADMIN','EMPLOYEE','FINANCE','HR','INVENTORY') NOT NULL,
  `department_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `base_salary`, `bonus`, `deduction`, `email`, `final_salary`, `is_active`, `name`, `password`, `performance_impact`, `performance_rating`, `phone`, `role`, `department_id`) VALUES
(1, 5000, 500, 100, 'john@test.com', 5400, b'1', 'John Doe', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 0, 4.5, '1234567890', 'EMPLOYEE', 3),
(2, 4500, 400, 50, 'jane@test.com', 4850, b'1', 'Jane Smith', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 0, 4, '0987654321', 'EMPLOYEE', 4),
(3, 4000, 200, 0, 'bob@test.com', 4200, b'1', 'Bob Builder', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 0, 3.5, '1122334455', 'EMPLOYEE', 5),
(4, 50000000, 200000, 0, 'nama@test.com', NULL, b'1', 'Juan', '$2a$10$WiEYzUKlvwXk43WgT0/SuuQPqHxQ6qcAYxc0nQX1nbfmz6aSGAKCS', NULL, 5, '081290299578', 'EMPLOYEE', 1);

-- --------------------------------------------------------

--
-- Table structure for table `employee_leave`
--

CREATE TABLE `employee_leave` (
  `id` bigint(20) NOT NULL,
  `end_date` date DEFAULT NULL,
  `leave_type` varchar(255) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `status` enum('APPROVED','PENDING','REJECTED') DEFAULT NULL,
  `employee_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_leave`
--

INSERT INTO `employee_leave` (`id`, `end_date`, `leave_type`, `reason`, `start_date`, `status`, `employee_id`) VALUES
(1, '2025-04-03', 'Sick Leave', 'Flu', '2025-04-03', 'APPROVED', 1),
(2, '2025-04-02', 'Casual Leave', 'Personal Errand', '2025-04-02', 'APPROVED', 2),
(3, '2025-04-12', 'Annual Leave', 'Vacation', '2025-04-10', 'PENDING', 3);

-- --------------------------------------------------------

--
-- Table structure for table `fin_accounting_period`
--

CREATE TABLE `fin_accounting_period` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `fiscal_year_id` bigint(20) NOT NULL,
  `period_no` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fin_accounting_period`
--

INSERT INTO `fin_accounting_period` (`id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `fiscal_year_id`, `period_no`, `start_date`, `end_date`, `status`, `name`) VALUES
(1, '2026-01-13 04:14:23.000000', '2026-01-13 04:14:23.000000', 'admin@test.com', 'admin@test.com', 4, 1, '2026-01-01', '2026-01-31', 'OPEN', 'FY2026-P01 (2026-01-01..2026-01-31)'),
(2, '2026-01-13 04:14:23.000000', '2026-01-13 04:14:23.000000', 'admin@test.com', 'admin@test.com', 4, 2, '2026-02-01', '2026-02-28', 'OPEN', 'FY2026-P02 (2026-02-01..2026-02-28)'),
(3, '2026-01-13 04:14:23.000000', '2026-01-13 04:14:23.000000', 'admin@test.com', 'admin@test.com', 4, 3, '2026-03-01', '2026-03-31', 'OPEN', 'FY2026-P03 (2026-03-01..2026-03-31)'),
(4, '2026-01-13 04:14:23.000000', '2026-01-13 04:14:23.000000', 'admin@test.com', 'admin@test.com', 4, 4, '2026-04-01', '2026-04-30', 'OPEN', 'FY2026-P04 (2026-04-01..2026-04-30)'),
(5, '2026-01-13 04:14:23.000000', '2026-01-13 04:14:23.000000', 'admin@test.com', 'admin@test.com', 4, 5, '2026-05-01', '2026-05-31', 'OPEN', 'FY2026-P05 (2026-05-01..2026-05-31)'),
(6, '2026-01-13 04:14:23.000000', '2026-01-13 04:14:23.000000', 'admin@test.com', 'admin@test.com', 4, 6, '2026-06-01', '2026-06-30', 'OPEN', 'FY2026-P06 (2026-06-01..2026-06-30)'),
(7, '2026-01-13 04:14:23.000000', '2026-01-13 04:14:23.000000', 'admin@test.com', 'admin@test.com', 4, 7, '2026-07-01', '2026-07-31', 'OPEN', 'FY2026-P07 (2026-07-01..2026-07-31)'),
(8, '2026-01-13 04:14:23.000000', '2026-01-13 04:14:23.000000', 'admin@test.com', 'admin@test.com', 4, 8, '2026-08-01', '2026-08-31', 'OPEN', 'FY2026-P08 (2026-08-01..2026-08-31)'),
(9, '2026-01-13 04:14:23.000000', '2026-01-13 04:14:23.000000', 'admin@test.com', 'admin@test.com', 4, 9, '2026-09-01', '2026-09-30', 'OPEN', 'FY2026-P09 (2026-09-01..2026-09-30)'),
(10, '2026-01-13 04:14:23.000000', '2026-01-13 04:14:23.000000', 'admin@test.com', 'admin@test.com', 4, 10, '2026-10-01', '2026-10-31', 'OPEN', 'FY2026-P10 (2026-10-01..2026-10-31)'),
(11, '2026-01-13 04:14:23.000000', '2026-01-13 04:14:23.000000', 'admin@test.com', 'admin@test.com', 4, 11, '2026-11-01', '2026-11-30', 'OPEN', 'FY2026-P11 (2026-11-01..2026-11-30)'),
(12, '2026-01-13 04:14:23.000000', '2026-01-13 04:14:23.000000', 'admin@test.com', 'admin@test.com', 4, 12, '2026-12-01', '2026-12-31', 'OPEN', 'FY2026-P12 (2026-12-01..2026-12-31)');

-- --------------------------------------------------------

--
-- Table structure for table `fin_bank_account`
--

CREATE TABLE `fin_bank_account` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `company_id` bigint(20) NOT NULL,
  `org_id` bigint(20) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `account_no` varchar(255) DEFAULT NULL,
  `currency_code` varchar(255) DEFAULT NULL,
  `gl_account_id` bigint(20) NOT NULL,
  `active` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fin_bank_statement`
--

CREATE TABLE `fin_bank_statement` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `company_id` bigint(20) NOT NULL,
  `org_id` bigint(20) DEFAULT NULL,
  `bank_account_id` bigint(20) NOT NULL,
  `document_no` varchar(255) NOT NULL,
  `statement_date` date NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fin_bank_statement_line`
--

CREATE TABLE `fin_bank_statement_line` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `bank_statement_id` bigint(20) NOT NULL,
  `trx_date` date NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `amount` decimal(38,2) NOT NULL,
  `payment_id` bigint(20) DEFAULT NULL,
  `journal_entry_id` bigint(20) DEFAULT NULL,
  `reconciled` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fin_budget`
--

CREATE TABLE `fin_budget` (
  `id` bigint(20) NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `org_id` bigint(20) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `fiscal_year_id` bigint(20) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'DRAFTED',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fin_budget_line`
--

CREATE TABLE `fin_budget_line` (
  `id` bigint(20) NOT NULL,
  `budget_id` bigint(20) NOT NULL,
  `gl_account_id` bigint(20) NOT NULL,
  `accounting_period_id` bigint(20) NOT NULL,
  `budget_amount` decimal(38,2) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fin_fiscal_year`
--

CREATE TABLE `fin_fiscal_year` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `company_id` bigint(20) NOT NULL,
  `year` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fin_fiscal_year`
--

INSERT INTO `fin_fiscal_year` (`id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `company_id`, `year`, `start_date`, `end_date`, `status`) VALUES
(4, '2026-01-13 04:14:23.000000', '2026-01-13 04:14:23.000000', 'admin@test.com', 'admin@test.com', 1, 2026, '2026-01-01', '2026-12-31', 'OPEN');

-- --------------------------------------------------------

--
-- Table structure for table `fin_gl_account`
--

CREATE TABLE `fin_gl_account` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `company_id` bigint(20) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `active` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fin_gl_account`
--

INSERT INTO `fin_gl_account` (`id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `company_id`, `code`, `name`, `type`, `active`) VALUES
(1, '2026-01-13 04:11:16.000000', '2026-01-13 04:11:16.000000', 'admin@test.com', 'admin@test.com', 1, '1100', 'Cash', 'ASSET', b'1'),
(2, '2026-01-13 06:16:39.000000', '2026-01-13 06:16:39.000000', 'admin@test.com', 'admin@test.com', 1, '8888', 'cash', 'ASSET', b'1');

-- --------------------------------------------------------

--
-- Table structure for table `fin_invoice`
--

CREATE TABLE `fin_invoice` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `document_no` varchar(255) NOT NULL,
  `grand_total` decimal(38,2) NOT NULL,
  `invoice_date` date NOT NULL,
  `invoice_type` enum('AP','AR') NOT NULL,
  `status` enum('COMPLETED','DRAFTED','VOIDED') NOT NULL,
  `total_net` decimal(38,2) NOT NULL,
  `total_tax` decimal(38,2) NOT NULL,
  `business_partner_id` bigint(20) NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `org_id` bigint(20) DEFAULT NULL,
  `tax_rate_id` bigint(20) DEFAULT NULL,
  `open_amount` decimal(38,2) NOT NULL,
  `paid_amount` decimal(38,2) NOT NULL,
  `journal_entry_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fin_invoice_line`
--

CREATE TABLE `fin_invoice_line` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `line_net` decimal(38,2) NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `qty` decimal(38,2) NOT NULL,
  `invoice_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `uom_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fin_invoice_tax_line`
--

CREATE TABLE `fin_invoice_tax_line` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `invoice_id` bigint(20) NOT NULL,
  `tax_rate_id` bigint(20) DEFAULT NULL,
  `tax_base` decimal(38,2) NOT NULL,
  `tax_amount` decimal(38,2) NOT NULL,
  `rounding_amount` decimal(38,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fin_journal_entry`
--

CREATE TABLE `fin_journal_entry` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `accounting_date` date NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `document_no` varchar(255) NOT NULL,
  `status` enum('COMPLETED','DRAFTED','VOIDED') NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `org_id` bigint(20) DEFAULT NULL,
  `source_document_type` varchar(50) DEFAULT NULL,
  `source_document_no` varchar(255) DEFAULT NULL,
  `accounting_period_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fin_journal_line`
--

CREATE TABLE `fin_journal_line` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `account_code` enum('AP','AR','CASH') NOT NULL,
  `credit` decimal(38,2) NOT NULL,
  `debit` decimal(38,2) NOT NULL,
  `journal_entry_id` bigint(20) NOT NULL,
  `gl_account_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fin_payment`
--

CREATE TABLE `fin_payment` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `amount` decimal(38,2) NOT NULL,
  `document_no` varchar(255) NOT NULL,
  `payment_date` date NOT NULL,
  `status` enum('COMPLETED','DRAFTED','VOIDED') NOT NULL,
  `business_partner_id` bigint(20) NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `invoice_id` bigint(20) NOT NULL,
  `journal_entry_id` bigint(20) DEFAULT NULL,
  `org_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fin_payment_allocation`
--

CREATE TABLE `fin_payment_allocation` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `amount` decimal(38,2) NOT NULL,
  `invoice_id` bigint(20) NOT NULL,
  `payment_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `flyway_schema_history`
--

CREATE TABLE `flyway_schema_history` (
  `installed_rank` int(11) NOT NULL,
  `version` varchar(50) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `type` varchar(20) NOT NULL,
  `script` varchar(1000) NOT NULL,
  `checksum` int(11) DEFAULT NULL,
  `installed_by` varchar(100) NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `execution_time` int(11) NOT NULL,
  `success` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `flyway_schema_history`
--

INSERT INTO `flyway_schema_history` (`installed_rank`, `version`, `description`, `type`, `script`, `checksum`, `installed_by`, `installed_on`, `execution_time`, `success`) VALUES
(1, '1', '<< Flyway Baseline >>', 'BASELINE', '<< Flyway Baseline >>', NULL, 'root', '2026-01-11 03:34:01', 0, 1),
(2, '2', 'mfg bom', 'SQL', 'V2__mfg_bom.sql', -600431703, 'root', '2026-01-11 03:53:35', 200, 1),
(3, '3', 'mfg work order', 'SQL', 'V3__mfg_work_order.sql', 2019597206, 'root', '2026-01-11 04:16:14', 154, 1),
(4, '4', 'mfg work order void', 'SQL', 'V4__mfg_work_order_void.sql', -927803145, 'root', '2026-01-11 04:28:05', 200, 1),
(5, '5', 'fin gl account and journal line fk', 'SQL', 'V5__fin_gl_account_and_journal_line_fk.sql', 338248462, 'root', '2026-01-11 05:11:01', 433, 1),
(6, '6', 'fin journal entry source link', 'SQL', 'V6__fin_journal_entry_source_link.sql', -714375288, 'root', '2026-01-11 05:11:01', 37, 1),
(7, '7', 'fin fiscal year and period', 'SQL', 'V7__fin_fiscal_year_and_period.sql', -73433045, 'root', '2026-01-11 05:32:43', 320, 1),
(8, '8', 'fin bank statement', 'SQL', 'V8__fin_bank_statement.sql', -152660901, 'root', '2026-01-11 06:12:47', 376, 1),
(9, '9', 'fin journal entry idempotency', 'SQL', 'V9__fin_journal_entry_idempotency.sql', 1788206169, 'root', '2026-01-11 07:15:46', 145, 1),
(10, '10', 'fin invoice tax line', 'SQL', 'V10__fin_invoice_tax_line.sql', -3500630, 'root', '2026-01-11 07:15:46', 118, 1),
(11, '11', 'trx order fulfillment tracking', 'SQL', 'V11__trx_order_fulfillment_tracking.sql', 119082112, 'root', '2026-01-11 07:48:00', 90, 1),
(12, '12', 'fin budget', 'SQL', 'V12__fin_budget.sql', 1439054809, 'root', '2026-01-11 08:32:44', 349, 1),
(13, '13', 'fin journal entry accounting period', 'SQL', 'V13__fin_journal_entry_accounting_period.sql', -1231255528, 'root', '2026-01-11 08:32:45', 491, 1),
(14, '14', 'fin accounting period name', 'SQL', 'V14__fin_accounting_period_name.sql', -682791585, 'root', '2026-01-11 08:32:45', 74, 1),
(15, '15', 'inv inventory adjustment', 'SQL', 'V15__inv_inventory_adjustment.sql', -1835997356, 'root', '2026-01-11 14:19:13', 842, 1),
(16, '16', 'inv onhand', 'SQL', 'V16__inv_onhand.sql', -767320700, 'root', '2026-01-11 14:19:13', 110, 1),
(17, '17', 'core document sequence document type varchar', 'SQL', 'V17__core_document_sequence_document_type_varchar.sql', 1464578643, 'root', '2026-01-12 09:30:33', 92, 1);

-- --------------------------------------------------------

--
-- Table structure for table `inv_inventory_adjustment`
--

CREATE TABLE `inv_inventory_adjustment` (
  `id` bigint(20) NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `org_id` bigint(20) DEFAULT NULL,
  `document_no` varchar(255) NOT NULL,
  `adjustment_date` date NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'DRAFTED',
  `journal_entry_id` bigint(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inv_inventory_adjustment`
--

INSERT INTO `inv_inventory_adjustment` (`id`, `company_id`, `org_id`, `document_no`, `adjustment_date`, `description`, `status`, `journal_entry_id`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 1, 1, 'IA-00001', '2026-01-14', '', 'VOIDED', NULL, '2026-01-13 21:03:59', '2026-01-13 21:04:08', 'admin@test.com', 'admin@test.com'),
(2, 1, 1, 'IA-00002', '2026-01-14', '', 'DRAFTED', NULL, '2026-01-13 21:16:39', '2026-01-13 21:16:39', 'admin@test.com', 'admin@test.com');

-- --------------------------------------------------------

--
-- Table structure for table `inv_inventory_adjustment_line`
--

CREATE TABLE `inv_inventory_adjustment_line` (
  `id` bigint(20) NOT NULL,
  `adjustment_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `locator_id` bigint(20) NOT NULL,
  `quantity_on_hand_before` decimal(38,2) NOT NULL,
  `quantity_adjusted` decimal(38,2) NOT NULL,
  `quantity_on_hand_after` decimal(38,2) NOT NULL,
  `adjustment_amount` decimal(38,2) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inv_inventory_adjustment_line`
--

INSERT INTO `inv_inventory_adjustment_line` (`id`, `adjustment_id`, `product_id`, `locator_id`, `quantity_on_hand_before`, `quantity_adjusted`, `quantity_on_hand_after`, `adjustment_amount`, `notes`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 1, 7, 1, 0.00, 12.00, 12.00, 10000.00, '', '2026-01-13 21:03:59', '2026-01-13 21:03:59', 'admin@test.com', 'admin@test.com'),
(2, 2, 1, 1, 0.00, 19.00, 19.00, 0.00, '', '2026-01-13 21:16:39', '2026-01-13 21:16:39', 'admin@test.com', 'admin@test.com');

-- --------------------------------------------------------

--
-- Table structure for table `inv_locator`
--

CREATE TABLE `inv_locator` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `active` bit(1) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `org_id` bigint(20) DEFAULT NULL,
  `warehouse_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inv_locator`
--

INSERT INTO `inv_locator` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `active`, `code`, `name`, `company_id`, `org_id`, `warehouse_id`) VALUES
(1, '2026-01-12 08:25:48.000000', 'admin@test.com', '2026-01-12 08:25:48.000000', 'admin@test.com', b'1', 'rak01', 'rak 01', 1, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `inv_movement`
--

CREATE TABLE `inv_movement` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `document_no` varchar(255) NOT NULL,
  `movement_date` date NOT NULL,
  `movement_type` enum('IN','OUT','TRANSFER') NOT NULL,
  `status` enum('COMPLETED','DRAFTED','VOIDED') NOT NULL,
  `company_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inv_movement`
--

INSERT INTO `inv_movement` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `description`, `document_no`, `movement_date`, `movement_type`, `status`, `company_id`) VALUES
(1, '2026-01-12 08:44:41.000000', 'admin@test.com', '2026-01-12 08:44:41.000000', 'admin@test.com', '', 'MM-00001', '2026-01-12', 'IN', 'DRAFTED', 1);

-- --------------------------------------------------------

--
-- Table structure for table `inv_movement_line`
--

CREATE TABLE `inv_movement_line` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `qty` decimal(38,2) NOT NULL,
  `from_locator_id` bigint(20) DEFAULT NULL,
  `movement_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `to_locator_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inv_movement_line`
--

INSERT INTO `inv_movement_line` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `qty`, `from_locator_id`, `movement_id`, `product_id`, `to_locator_id`) VALUES
(1, '2026-01-12 08:44:41.000000', 'admin@test.com', '2026-01-12 08:44:41.000000', 'admin@test.com', 1.00, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `inv_onhand`
--

CREATE TABLE `inv_onhand` (
  `id` bigint(20) NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `locator_id` bigint(20) NOT NULL,
  `quantity_on_hand` decimal(38,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inv_onhand`
--

INSERT INTO `inv_onhand` (`id`, `company_id`, `product_id`, `locator_id`, `quantity_on_hand`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 1, 7, 1, 0.00, '2026-01-13 21:03:59', '2026-01-13 21:03:59', 'admin@test.com', 'admin@test.com'),
(2, 1, 1, 1, 0.00, '2026-01-13 21:16:39', '2026-01-13 21:16:39', 'admin@test.com', 'admin@test.com');

-- --------------------------------------------------------

--
-- Table structure for table `inv_stock_txn`
--

CREATE TABLE `inv_stock_txn` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `movement_time` datetime(6) NOT NULL,
  `qty` decimal(38,2) NOT NULL,
  `reference_doc_no` varchar(255) DEFAULT NULL,
  `company_id` bigint(20) NOT NULL,
  `locator_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inv_stock_txn`
--

INSERT INTO `inv_stock_txn` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `movement_time`, `qty`, `reference_doc_no`, `company_id`, `locator_id`, `product_id`) VALUES
(1, '2026-01-12 08:44:41.000000', 'admin@test.com', '2026-01-12 08:44:41.000000', 'admin@test.com', '2026-01-12 08:44:41.000000', 1.00, 'MM-00001', 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `leaves`
--

CREATE TABLE `leaves` (
  `id` bigint(20) NOT NULL,
  `end_date` date DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `status` enum('APPROVED','HALF_DAY','PENDING','REJECTED') DEFAULT NULL,
  `employee_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `md_business_partner`
--

CREATE TABLE `md_business_partner` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `active` bit(1) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `type` enum('BOTH','CUSTOMER','VENDOR') NOT NULL,
  `company_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `md_business_partner`
--

INSERT INTO `md_business_partner` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `active`, `email`, `name`, `phone`, `type`, `company_id`) VALUES
(1, '2026-01-12 07:17:21.000000', 'admin@test.com', '2026-01-12 07:17:21.000000', 'admin@test.com', b'1', 'jtrustcoba@gmail.com', 'PT Vendor A', '0812', 'VENDOR', 1),
(2, '2026-01-12 07:29:37.000000', 'admin@test.com', '2026-01-12 07:29:37.000000', 'admin@test.com', b'1', 'jtrustcoba@gmail.com', 'PT PAN', NULL, 'CUSTOMER', 1),
(3, '2026-01-13 04:32:02.000000', 'admin@test.com', '2026-01-13 04:32:02.000000', 'admin@test.com', b'1', 'fpicoba@gmail.com', 'PT FPI', '081234567890', 'BOTH', 1),
(4, '2026-01-14 02:10:25.000000', 'admin@test.com', '2026-01-14 02:10:25.000000', 'admin@test.com', b'1', 'jtrustcoba@gmail.com', 'PT Vendor C', '777777', 'VENDOR', 1);

-- --------------------------------------------------------

--
-- Table structure for table `md_currency`
--

CREATE TABLE `md_currency` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `active` bit(1) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `precision_value` int(11) NOT NULL,
  `company_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `md_currency`
--

INSERT INTO `md_currency` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `active`, `code`, `name`, `precision_value`, `company_id`) VALUES
(1, '2026-01-12 07:14:59.000000', 'admin@test.com', '2026-01-13 07:10:34.000000', 'admin@test.com', b'1', 'IDR', 'Indonesia Rupiah Prabowo', 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `md_price_list`
--

CREATE TABLE `md_price_list` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `active` bit(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sales_price_list` bit(1) NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `currency_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `md_price_list`
--

INSERT INTO `md_price_list` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `active`, `name`, `sales_price_list`, `company_id`, `currency_id`) VALUES
(1, '2026-01-12 07:15:32.000000', 'admin@test.com', '2026-01-12 07:15:32.000000', 'admin@test.com', b'1', 'Salas PL', b'1', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `md_price_list_version`
--

CREATE TABLE `md_price_list_version` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `active` bit(1) NOT NULL,
  `valid_from` date NOT NULL,
  `price_list_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `md_price_list_version`
--

INSERT INTO `md_price_list_version` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `active`, `valid_from`, `price_list_id`) VALUES
(1, '2026-01-12 07:22:03.000000', 'admin@test.com', '2026-01-12 07:22:03.000000', 'admin@test.com', b'1', '2026-01-12', 1),
(2, '2026-01-12 07:22:18.000000', 'admin@test.com', '2026-01-12 07:22:18.000000', 'admin@test.com', b'1', '2026-01-12', 1),
(3, '2026-01-12 07:27:58.000000', 'admin@test.com', '2026-01-12 07:27:58.000000', 'admin@test.com', b'1', '2026-01-12', 1);

-- --------------------------------------------------------

--
-- Table structure for table `md_product`
--

CREATE TABLE `md_product` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `active` bit(1) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `uom_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `md_product`
--

INSERT INTO `md_product` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `active`, `code`, `name`, `company_id`, `uom_id`) VALUES
(1, '2026-01-12 07:09:43.000000', 'admin@test.com', '2026-01-12 07:09:43.000000', 'admin@test.com', b'1', 'prd-002', 'Aqua Botol', 1, 2),
(2, '2026-01-12 07:10:09.000000', 'admin@test.com', '2026-01-12 07:10:09.000000', 'admin@test.com', b'1', 'prd-001', 'aqua', 1, 1),
(3, '2026-01-12 07:13:14.000000', 'admin@test.com', '2026-01-12 07:13:14.000000', 'admin@test.com', b'1', 'prd-01', 'item A', 1, 1),
(4, '2026-01-13 04:29:14.000000', 'admin@test.com', '2026-01-13 09:53:14.000000', 'admin@test.com', b'1', 'prd-003', 'aqua botol', 1, 2),
(6, '2026-01-14 02:11:21.000000', 'admin@test.com', '2026-01-14 02:11:21.000000', 'admin@test.com', b'1', 'PRD 8', 'Meja', 1, 1),
(7, '2026-01-14 02:19:37.000000', 'admin@test.com', '2026-01-14 02:19:37.000000', 'admin@test.com', b'1', '222', 'Papan 1 Meter', 1, 7),
(8, '2026-01-14 02:20:07.000000', 'admin@test.com', '2026-01-14 02:20:07.000000', 'admin@test.com', b'1', '666', 'kayu setengah meter', 1, 7),
(9, '2026-01-14 02:20:46.000000', 'admin@test.com', '2026-01-14 02:20:46.000000', 'admin@test.com', b'1', '2221', 'Paku 3 cm', 1, 7);

-- --------------------------------------------------------

--
-- Table structure for table `md_product_price`
--

CREATE TABLE `md_product_price` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `active` bit(1) NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `price_list_version_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `md_product_price`
--

INSERT INTO `md_product_price` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `active`, `price`, `price_list_version_id`, `product_id`) VALUES
(1, '2026-01-12 07:48:06.000000', 'admin@test.com', '2026-01-12 07:48:06.000000', 'admin@test.com', b'1', 1000.00, 1, 1),
(2, '2026-01-12 07:48:11.000000', 'admin@test.com', '2026-01-12 07:48:11.000000', 'admin@test.com', b'1', 2000.00, 1, 2),
(3, '2026-01-12 07:48:16.000000', 'admin@test.com', '2026-01-13 07:51:58.000000', 'admin@test.com', b'1', 12000.00, 1, 3),
(4, '2026-01-13 07:26:12.000000', 'admin@test.com', '2026-01-13 07:26:12.000000', 'admin@test.com', b'1', 3000.00, 1, 4),
(5, '2026-01-14 02:12:07.000000', 'admin@test.com', '2026-01-14 02:12:07.000000', 'admin@test.com', b'1', 200000.00, 1, 6),
(6, '2026-01-14 02:21:19.000000', 'admin@test.com', '2026-01-14 02:21:19.000000', 'admin@test.com', b'1', 100.00, 1, 7),
(7, '2026-01-14 02:21:20.000000', 'admin@test.com', '2026-01-14 02:21:20.000000', 'admin@test.com', b'1', 200.00, 1, 8),
(8, '2026-01-14 02:21:21.000000', 'admin@test.com', '2026-01-14 02:21:21.000000', 'admin@test.com', b'1', 10.00, 1, 9);

-- --------------------------------------------------------

--
-- Table structure for table `md_tax_rate`
--

CREATE TABLE `md_tax_rate` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `active` bit(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  `rate` decimal(38,2) NOT NULL,
  `company_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `md_uom`
--

CREATE TABLE `md_uom` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `active` bit(1) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `company_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `md_uom`
--

INSERT INTO `md_uom` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `active`, `code`, `name`, `company_id`) VALUES
(1, '2026-01-12 07:04:56.000000', 'admin@test.com', '2026-01-13 07:05:41.000000', 'admin@test.com', b'1', '1238', 'Unit', 1),
(2, '2026-01-12 07:05:16.000000', 'admin@test.com', '2026-01-12 07:05:16.000000', 'admin@test.com', b'1', 'PCS', 'Pieces', 1),
(5, '2026-01-13 07:51:12.000000', 'admin@test.com', '2026-01-13 07:51:12.000000', 'admin@test.com', b'1', '1236', 'Unit', 1),
(6, '2026-01-14 02:18:39.000000', 'admin@test.com', '2026-01-14 02:18:39.000000', 'admin@test.com', b'1', '999', 'barang jadi', 1),
(7, '2026-01-14 02:18:52.000000', 'admin@test.com', '2026-01-14 02:18:52.000000', 'admin@test.com', b'1', '7777', 'bahan baku', 1);

-- --------------------------------------------------------

--
-- Table structure for table `md_warehouse`
--

CREATE TABLE `md_warehouse` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `active` bit(1) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `org_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `md_warehouse`
--

INSERT INTO `md_warehouse` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `active`, `code`, `name`, `company_id`, `org_id`) VALUES
(1, '2026-01-12 08:18:08.000000', 'admin@test.com', '2026-01-13 07:43:26.000000', 'admin@test.com', b'1', 'WH-01', 'main warehouse 2', 1, NULL),
(2, '2026-01-12 08:18:34.000000', 'admin@test.com', '2026-01-12 08:18:34.000000', 'admin@test.com', b'1', 'wh-01', 'gudang utama', 1, NULL),
(3, '2026-01-12 08:21:59.000000', 'admin@test.com', '2026-01-14 07:40:19.000000', 'admin@test.com', b'1', 'wh-006', 'gudang bekasi', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `mfg_bom`
--

CREATE TABLE `mfg_bom` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `company_id` bigint(20) NOT NULL,
  `org_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) NOT NULL,
  `version` int(11) NOT NULL,
  `active` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mfg_bom`
--

INSERT INTO `mfg_bom` (`id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `company_id`, `org_id`, `product_id`, `version`, `active`) VALUES
(1, '2026-01-13 03:51:02.000000', '2026-01-13 03:51:02.000000', 'admin@test.com', 'admin@test.com', 1, NULL, 1, 1, b'1'),
(3, '2026-01-13 08:07:10.000000', '2026-01-13 08:07:10.000000', 'admin@test.com', 'admin@test.com', 1, 1, 4, 1, b'1');

-- --------------------------------------------------------

--
-- Table structure for table `mfg_bom_line`
--

CREATE TABLE `mfg_bom_line` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `bom_id` bigint(20) NOT NULL,
  `component_product_id` bigint(20) NOT NULL,
  `qty` decimal(38,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mfg_bom_line`
--

INSERT INTO `mfg_bom_line` (`id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `bom_id`, `component_product_id`, `qty`) VALUES
(1, '2026-01-13 03:51:02.000000', '2026-01-13 03:51:02.000000', 'admin@test.com', 'admin@test.com', 1, 2, 1.00),
(2, '2026-01-13 03:51:02.000000', '2026-01-13 03:51:02.000000', 'admin@test.com', 'admin@test.com', 1, 1, 1.00),
(6, '2026-01-13 08:07:10.000000', '2026-01-13 08:07:10.000000', 'admin@test.com', 'admin@test.com', 3, 1, 1.00);

-- --------------------------------------------------------

--
-- Table structure for table `mfg_work_order`
--

CREATE TABLE `mfg_work_order` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `company_id` bigint(20) NOT NULL,
  `org_id` bigint(20) DEFAULT NULL,
  `document_no` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL,
  `work_date` date NOT NULL,
  `bom_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `qty` decimal(38,2) NOT NULL,
  `from_locator_id` bigint(20) NOT NULL,
  `to_locator_id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `issue_movement_doc_no` varchar(255) DEFAULT NULL,
  `receipt_movement_doc_no` varchar(255) DEFAULT NULL,
  `issue_reversal_movement_doc_no` varchar(255) DEFAULT NULL,
  `receipt_reversal_movement_doc_no` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mfg_work_order`
--

INSERT INTO `mfg_work_order` (`id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `company_id`, `org_id`, `document_no`, `status`, `work_date`, `bom_id`, `product_id`, `qty`, `from_locator_id`, `to_locator_id`, `description`, `issue_movement_doc_no`, `receipt_movement_doc_no`, `issue_reversal_movement_doc_no`, `receipt_reversal_movement_doc_no`) VALUES
(1, '2026-01-13 03:55:23.000000', '2026-01-13 03:55:23.000000', 'admin@test.com', 'admin@test.com', 1, NULL, 'WO-00001', 'DRAFTED', '2026-01-13', 1, 1, 1.00, 1, 1, '', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payslips`
--

CREATE TABLE `payslips` (
  `id` bigint(20) NOT NULL,
  `base_salary` double DEFAULT NULL,
  `bonus` double DEFAULT NULL,
  `date_issued` date DEFAULT NULL,
  `deduction` double DEFAULT NULL,
  `download_url` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `total_payable` double DEFAULT NULL,
  `employee_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payslips`
--

INSERT INTO `payslips` (`id`, `base_salary`, `bonus`, `date_issued`, `deduction`, `download_url`, `status`, `total_payable`, `employee_id`) VALUES
(1, 5000, 500, '2025-03-31', 100, '/api/payslip/download/1', 'Generated', 5200, 1);

-- --------------------------------------------------------

--
-- Table structure for table `payslip_log`
--

CREATE TABLE `payslip_log` (
  `id` bigint(20) NOT NULL,
  `action` enum('DOWNLOADED','EMAILED','GENERATED') NOT NULL,
  `done_by` varchar(255) DEFAULT NULL,
  `timestamp` datetime(6) NOT NULL,
  `employee_id` bigint(20) DEFAULT NULL,
  `payslip_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payslip_log`
--

INSERT INTO `payslip_log` (`id`, `action`, `done_by`, `timestamp`, `employee_id`, `payslip_id`) VALUES
(1, 'GENERATED', 'hr@test.com', '2025-03-31 10:00:00.000000', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `performance_reviews`
--

CREATE TABLE `performance_reviews` (
  `id` bigint(20) NOT NULL,
  `comments` longtext DEFAULT NULL,
  `performance_rating` varchar(255) NOT NULL,
  `review_date` date DEFAULT NULL,
  `employee_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `performance_reviews`
--

INSERT INTO `performance_reviews` (`id`, `comments`, `performance_rating`, `review_date`, `employee_id`) VALUES
(1, 'Exceeded expectations', 'Excellent', '2025-03-31', 1),
(2, 'Met expectations', 'Good', '2025-03-31', 2);

-- --------------------------------------------------------

--
-- Table structure for table `salary`
--

CREATE TABLE `salary` (
  `id` bigint(20) NOT NULL,
  `absent_days` int(11) NOT NULL,
  `approved_byhr` bit(1) NOT NULL,
  `base_salary` double DEFAULT NULL,
  `bonus` double DEFAULT NULL,
  `date` date DEFAULT NULL,
  `deduction` double DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `employee_name` varchar(255) DEFAULT NULL,
  `final_salary` double NOT NULL,
  `forwarded_to_finance` bit(1) NOT NULL,
  `leave_days` int(11) NOT NULL,
  `month` date DEFAULT NULL,
  `paid` bit(1) NOT NULL,
  `present_days` int(11) NOT NULL,
  `tax` double DEFAULT NULL,
  `total_payable` double DEFAULT NULL,
  `employee_id` bigint(20) DEFAULT NULL,
  `performance_review_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salary`
--

INSERT INTO `salary` (`id`, `absent_days`, `approved_byhr`, `base_salary`, `bonus`, `date`, `deduction`, `department`, `employee_name`, `final_salary`, `forwarded_to_finance`, `leave_days`, `month`, `paid`, `present_days`, `tax`, `total_payable`, `employee_id`, `performance_review_id`) VALUES
(1, 1, b'1', 5000, 500, '2025-03-31', 100, 'Engineering', 'John Doe', 5200, b'1', 1, '2025-03-01', b'1', 20, 200, 5200, 1, 1),
(2, 0, b'1', 4500, 400, '2025-03-31', 50, 'Sales', 'Jane Smith', 4700, b'1', 1, '2025-03-01', b'0', 21, 150, 4700, 2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `trx_purchase_order`
--

CREATE TABLE `trx_purchase_order` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `document_no` varchar(255) NOT NULL,
  `grand_total` decimal(38,2) NOT NULL,
  `order_date` date NOT NULL,
  `status` enum('COMPLETED','DRAFTED','VOIDED') NOT NULL,
  `total_net` decimal(38,2) NOT NULL,
  `total_tax` decimal(38,2) NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `org_id` bigint(20) DEFAULT NULL,
  `price_list_version_id` bigint(20) NOT NULL,
  `vendor_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trx_purchase_order`
--

INSERT INTO `trx_purchase_order` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `document_no`, `grand_total`, `order_date`, `status`, `total_net`, `total_tax`, `company_id`, `org_id`, `price_list_version_id`, `vendor_id`) VALUES
(2, '2026-01-13 07:53:26.000000', 'admin@test.com', '2026-01-13 08:02:22.000000', 'admin@test.com', 'PO-00002', 25000.00, '2026-01-13', 'DRAFTED', 25000.00, 0.00, 1, NULL, 1, 3),
(3, '2026-01-14 02:12:42.000000', 'admin@test.com', '2026-01-14 02:12:42.000000', 'admin@test.com', 'PO-00003', 2000000.00, '2026-01-14', 'DRAFTED', 2000000.00, 0.00, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `trx_purchase_order_line`
--

CREATE TABLE `trx_purchase_order_line` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `line_net` decimal(38,2) NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `qty` decimal(38,2) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `purchase_order_id` bigint(20) NOT NULL,
  `uom_id` bigint(20) NOT NULL,
  `received_qty` decimal(38,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trx_purchase_order_line`
--

INSERT INTO `trx_purchase_order_line` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `line_net`, `price`, `qty`, `product_id`, `purchase_order_id`, `uom_id`, `received_qty`) VALUES
(4, '2026-01-13 08:02:21.000000', 'admin@test.com', '2026-01-13 08:02:21.000000', 'admin@test.com', 1000.00, 1000.00, 1.00, 1, 2, 2, 0.00),
(5, '2026-01-13 08:02:22.000000', 'admin@test.com', '2026-01-13 08:02:22.000000', 'admin@test.com', 12000.00, 1000.00, 12.00, 1, 2, 2, 0.00),
(6, '2026-01-13 08:02:22.000000', 'admin@test.com', '2026-01-13 08:02:22.000000', 'admin@test.com', 12000.00, 12000.00, 1.00, 3, 2, 1, 0.00),
(7, '2026-01-14 02:12:42.000000', 'admin@test.com', '2026-01-14 02:12:42.000000', 'admin@test.com', 2000000.00, 200000.00, 10.00, 6, 3, 1, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `trx_sales_order`
--

CREATE TABLE `trx_sales_order` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `document_no` varchar(255) NOT NULL,
  `grand_total` decimal(38,2) NOT NULL,
  `order_date` date NOT NULL,
  `status` enum('COMPLETED','DRAFTED','VOIDED') NOT NULL,
  `total_net` decimal(38,2) NOT NULL,
  `total_tax` decimal(38,2) NOT NULL,
  `business_partner_id` bigint(20) NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `org_id` bigint(20) DEFAULT NULL,
  `price_list_version_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trx_sales_order`
--

INSERT INTO `trx_sales_order` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `document_no`, `grand_total`, `order_date`, `status`, `total_net`, `total_tax`, `business_partner_id`, `company_id`, `org_id`, `price_list_version_id`) VALUES
(2, '2026-01-13 02:47:14.000000', 'admin@test.com', '2026-01-13 07:52:47.000000', 'admin@test.com', 'SO-00002', 29000.00, '2026-01-13', 'DRAFTED', 29000.00, 0.00, 2, 1, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `trx_sales_order_line`
--

CREATE TABLE `trx_sales_order_line` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `line_net` decimal(38,2) NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `qty` decimal(38,2) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `sales_order_id` bigint(20) NOT NULL,
  `uom_id` bigint(20) NOT NULL,
  `shipped_qty` decimal(38,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trx_sales_order_line`
--

INSERT INTO `trx_sales_order_line` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `line_net`, `price`, `qty`, `product_id`, `sales_order_id`, `uom_id`, `shipped_qty`) VALUES
(35, '2026-01-13 07:52:47.000000', 'admin@test.com', '2026-01-13 07:52:47.000000', 'admin@test.com', 1000.00, 1000.00, 1.00, 1, 2, 2, 0.00),
(36, '2026-01-13 07:52:47.000000', 'admin@test.com', '2026-01-13 07:52:47.000000', 'admin@test.com', 2000.00, 2000.00, 1.00, 2, 2, 1, 0.00),
(37, '2026-01-13 07:52:47.000000', 'admin@test.com', '2026-01-13 07:52:47.000000', 'admin@test.com', 24000.00, 12000.00, 2.00, 3, 2, 1, 0.00),
(38, '2026-01-13 07:52:47.000000', 'admin@test.com', '2026-01-13 07:52:47.000000', 'admin@test.com', 1000.00, 1000.00, 1.00, 1, 2, 2, 0.00),
(39, '2026-01-13 07:52:47.000000', 'admin@test.com', '2026-01-13 07:52:47.000000', 'admin@test.com', 1000.00, 1000.00, 1.00, 1, 2, 2, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','EMPLOYEE','FINANCE','HR','INVENTORY') DEFAULT NULL,
  `status` enum('ACTIVE','DISABLED') DEFAULT NULL,
  `department_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `full_name`, `is_active`, `password`, `role`, `status`, `department_id`) VALUES
(1, 'admin@test.com', 'Admin User', b'1', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'ADMIN', 'ACTIVE', 1),
(2, 'hr@test.com', 'HR Manager', b'1', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'HR', 'ACTIVE', 1),
(3, 'finance@test.com', 'Finance Manager', b'1', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'FINANCE', 'ACTIVE', 2),
(4, 'inventory@test.com', 'Inventory Manager', b'1', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'INVENTORY', 'ACTIVE', 5);

-- --------------------------------------------------------

--
-- Table structure for table `users_seq`
--

CREATE TABLE `users_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_seq`
--

INSERT INTO `users_seq` (`next_val`) VALUES
(1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK1fa36y2oqhao3wgg2rw1pi459` (`user_id`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKb48lmkou5j4rvde9sr88bqgjw` (`employee_id`);

--
-- Indexes for table `core_company`
--
ALTER TABLE `core_company`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKtpt0yf71g1gce98ets1w0gavp` (`code`);

--
-- Indexes for table `core_document_sequence`
--
ALTER TABLE `core_document_sequence`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKoi3q0fgef9k5dl1tt37y7mk1r` (`company_id`);

--
-- Indexes for table `core_org`
--
ALTER TABLE `core_org`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK26txbjmeeadjg9ei7oliy3cfh` (`company_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKj9xgmd0ya5jmus09o0b8pqrpb` (`email`),
  ADD KEY `FKgy4qe3dnqrm3ktd76sxp7n4c2` (`department_id`);

--
-- Indexes for table `employee_leave`
--
ALTER TABLE `employee_leave`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKam8hnlr1aykn1p7ehcb2ee4by` (`employee_id`);

--
-- Indexes for table `fin_accounting_period`
--
ALTER TABLE `fin_accounting_period`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_fin_period_year_period` (`fiscal_year_id`,`period_no`),
  ADD KEY `idx_fin_period_year` (`fiscal_year_id`),
  ADD KEY `idx_fin_period_dates` (`start_date`,`end_date`);

--
-- Indexes for table `fin_bank_account`
--
ALTER TABLE `fin_bank_account`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_fin_bank_account_company` (`company_id`),
  ADD KEY `idx_fin_bank_account_org` (`org_id`),
  ADD KEY `idx_fin_bank_account_gl` (`gl_account_id`);

--
-- Indexes for table `fin_bank_statement`
--
ALTER TABLE `fin_bank_statement`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_fin_bank_statement_docno` (`document_no`),
  ADD KEY `idx_fin_bank_statement_company` (`company_id`),
  ADD KEY `idx_fin_bank_statement_bank_account` (`bank_account_id`),
  ADD KEY `FK8js2373ukpjp3vlhlq58p9ksd` (`org_id`);

--
-- Indexes for table `fin_bank_statement_line`
--
ALTER TABLE `fin_bank_statement_line`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_fin_bank_stmt_line_stmt` (`bank_statement_id`),
  ADD KEY `idx_fin_bank_stmt_line_payment` (`payment_id`),
  ADD KEY `idx_fin_bank_stmt_line_je` (`journal_entry_id`);

--
-- Indexes for table `fin_budget`
--
ALTER TABLE `fin_budget`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_budget_company_fiscal` (`company_id`,`fiscal_year_id`,`name`),
  ADD KEY `org_id` (`org_id`),
  ADD KEY `fiscal_year_id` (`fiscal_year_id`);

--
-- Indexes for table `fin_budget_line`
--
ALTER TABLE `fin_budget_line`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_budget_line_account_period` (`budget_id`,`gl_account_id`,`accounting_period_id`),
  ADD KEY `gl_account_id` (`gl_account_id`),
  ADD KEY `accounting_period_id` (`accounting_period_id`);

--
-- Indexes for table `fin_fiscal_year`
--
ALTER TABLE `fin_fiscal_year`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_fin_fiscal_year_company_year` (`company_id`,`year`),
  ADD KEY `idx_fin_fiscal_year_company` (`company_id`);

--
-- Indexes for table `fin_gl_account`
--
ALTER TABLE `fin_gl_account`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_fin_gl_account_company_code` (`company_id`,`code`),
  ADD KEY `idx_fin_gl_account_company` (`company_id`);

--
-- Indexes for table `fin_invoice`
--
ALTER TABLE `fin_invoice`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKfxlw02fep048f3q84lhb6k2ik` (`document_no`),
  ADD KEY `FKpjcivvomes29ah6q8haeh8agp` (`business_partner_id`),
  ADD KEY `FKmmhgqqg6xrh5q3vsm0f24gee6` (`company_id`),
  ADD KEY `FKohetjml3vo4x6ox93wgwatjhk` (`org_id`),
  ADD KEY `FKngriw655kx842ulrpmw3dkx27` (`tax_rate_id`),
  ADD KEY `FK8rifybtm7iaooikye456jkivc` (`journal_entry_id`);

--
-- Indexes for table `fin_invoice_line`
--
ALTER TABLE `fin_invoice_line`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK30nkneaphg4gta1k1d8vmb8ka` (`invoice_id`),
  ADD KEY `FKk29rkql6m2h3u0jf34fpujvgr` (`product_id`),
  ADD KEY `FKbrgpq35u3qpx5u9tecmm406ia` (`uom_id`);

--
-- Indexes for table `fin_invoice_tax_line`
--
ALTER TABLE `fin_invoice_tax_line`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_fin_invoice_tax_line_invoice` (`invoice_id`),
  ADD KEY `idx_fin_invoice_tax_line_tax_rate` (`tax_rate_id`);

--
-- Indexes for table `fin_journal_entry`
--
ALTER TABLE `fin_journal_entry`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKrawxmf2od0uepfttqpsabxmj7` (`document_no`),
  ADD UNIQUE KEY `uk_fin_je_company_source` (`company_id`,`source_document_type`,`source_document_no`),
  ADD KEY `FKi8ywrtvy0cf0atcy1vsqapk12` (`org_id`),
  ADD KEY `idx_fin_je_source` (`company_id`,`source_document_type`,`source_document_no`),
  ADD KEY `fk_journal_entry_period` (`accounting_period_id`);

--
-- Indexes for table `fin_journal_line`
--
ALTER TABLE `fin_journal_line`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKrr0nrf4727l066ros5l715eua` (`journal_entry_id`),
  ADD KEY `idx_fin_journal_line_gl_account` (`gl_account_id`);

--
-- Indexes for table `fin_payment`
--
ALTER TABLE `fin_payment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKirw6bhm25xhr10x8ceupblpq9` (`document_no`),
  ADD KEY `FK6t3m06chge0xwmjngqc3u60gj` (`business_partner_id`),
  ADD KEY `FKbnujd8m2ktkgmlunaa7uqtnia` (`company_id`),
  ADD KEY `FK1wdwdvhcdjhp4w29jk9hpdf5x` (`invoice_id`),
  ADD KEY `FKejcmfgeyfpi8gjbtxpas8ovyo` (`journal_entry_id`),
  ADD KEY `FK93i6fxkgam0yjml3q97p83ew4` (`org_id`);

--
-- Indexes for table `fin_payment_allocation`
--
ALTER TABLE `fin_payment_allocation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKccbb8g9648ebswe7qhlujxgn0` (`invoice_id`),
  ADD KEY `FKcv9805dglo8ilylkixh3vvsep` (`payment_id`);

--
-- Indexes for table `flyway_schema_history`
--
ALTER TABLE `flyway_schema_history`
  ADD PRIMARY KEY (`installed_rank`),
  ADD KEY `flyway_schema_history_s_idx` (`success`);

--
-- Indexes for table `inv_inventory_adjustment`
--
ALTER TABLE `inv_inventory_adjustment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `document_no` (`document_no`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `org_id` (`org_id`),
  ADD KEY `journal_entry_id` (`journal_entry_id`);

--
-- Indexes for table `inv_inventory_adjustment_line`
--
ALTER TABLE `inv_inventory_adjustment_line`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_adjustment_line_product_locator` (`adjustment_id`,`product_id`,`locator_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `locator_id` (`locator_id`);

--
-- Indexes for table `inv_locator`
--
ALTER TABLE `inv_locator`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKclac12de36267xbvw4ems8n1e` (`company_id`),
  ADD KEY `FKf17gkfs5mxt7423s4myctgw8n` (`org_id`),
  ADD KEY `FK70c74uqp1hsxn96ikstk24ktg` (`warehouse_id`);

--
-- Indexes for table `inv_movement`
--
ALTER TABLE `inv_movement`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKbc3bavaa1f5j3f83n9flau3rh` (`document_no`),
  ADD KEY `FK9w9c6rdqhmb7sbi7qtfkq9a36` (`company_id`);

--
-- Indexes for table `inv_movement_line`
--
ALTER TABLE `inv_movement_line`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK8b3swlx9t3sqi9ymjsujw3120` (`from_locator_id`),
  ADD KEY `FK7y5pcrt7igbsa9t71gbk1bw5o` (`movement_id`),
  ADD KEY `FKlhvtkrro7nahwp3sfkrmux0ia` (`product_id`),
  ADD KEY `FKo7w2c12rl2r5vk17jrgrs0geq` (`to_locator_id`);

--
-- Indexes for table `inv_onhand`
--
ALTER TABLE `inv_onhand`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_onhand_company_product_locator` (`company_id`,`product_id`,`locator_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `locator_id` (`locator_id`);

--
-- Indexes for table `inv_stock_txn`
--
ALTER TABLE `inv_stock_txn`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKtg22u0vk27dp81yvekcxx5fai` (`company_id`),
  ADD KEY `FK4u1bof7dsi24fjy4eij96i3r8` (`locator_id`),
  ADD KEY `FKmaa0wr48qgq7qvepbgy30jjqk` (`product_id`);

--
-- Indexes for table `leaves`
--
ALTER TABLE `leaves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK6kwhuq11saeyki0nc54elfap2` (`employee_id`);

--
-- Indexes for table `md_business_partner`
--
ALTER TABLE `md_business_partner`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKb6ybriy57gxk20rkv2v6hmcc4` (`company_id`);

--
-- Indexes for table `md_currency`
--
ALTER TABLE `md_currency`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKfi2l06m912a2bx4t7etgox8go` (`company_id`);

--
-- Indexes for table `md_price_list`
--
ALTER TABLE `md_price_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKjbwf94b7gho0hnnyg04kolgts` (`company_id`),
  ADD KEY `FK21mx8mdqe0kqao97sp3rabbba` (`currency_id`);

--
-- Indexes for table `md_price_list_version`
--
ALTER TABLE `md_price_list_version`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK2oj4xw5nfl8ua1nevcs2g5hy8` (`price_list_id`);

--
-- Indexes for table `md_product`
--
ALTER TABLE `md_product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKiqlfjecrm8sy72am9kswypi7n` (`company_id`),
  ADD KEY `FKn6jicfgl3r062ir33hhp3rq5r` (`uom_id`);

--
-- Indexes for table `md_product_price`
--
ALTER TABLE `md_product_price`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKhqcohap0j8wvefc9d74mv3g0d` (`price_list_version_id`),
  ADD KEY `FKsuc0cdhd870mx4vg0eff4hrfy` (`product_id`);

--
-- Indexes for table `md_tax_rate`
--
ALTER TABLE `md_tax_rate`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKmr3guydg3cpt07eercf274wfr` (`company_id`);

--
-- Indexes for table `md_uom`
--
ALTER TABLE `md_uom`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKn92aquelf74ya4ldfju6ihs41` (`company_id`);

--
-- Indexes for table `md_warehouse`
--
ALTER TABLE `md_warehouse`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKpldqe89x5rffeqffijvafcrsp` (`company_id`),
  ADD KEY `FKjovjinqarxr3ca44ctk5jsnxb` (`org_id`);

--
-- Indexes for table `mfg_bom`
--
ALTER TABLE `mfg_bom`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_mfg_bom_company_product_version` (`company_id`,`product_id`,`version`),
  ADD KEY `idx_mfg_bom_company` (`company_id`),
  ADD KEY `idx_mfg_bom_product` (`product_id`),
  ADD KEY `idx_mfg_bom_org` (`org_id`);

--
-- Indexes for table `mfg_bom_line`
--
ALTER TABLE `mfg_bom_line`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_mfg_bom_line_bom` (`bom_id`),
  ADD KEY `idx_mfg_bom_line_component` (`component_product_id`);

--
-- Indexes for table `mfg_work_order`
--
ALTER TABLE `mfg_work_order`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_mfg_work_order_document_no` (`document_no`),
  ADD KEY `idx_mfg_work_order_company` (`company_id`),
  ADD KEY `idx_mfg_work_order_bom` (`bom_id`),
  ADD KEY `idx_mfg_work_order_product` (`product_id`),
  ADD KEY `idx_mfg_work_order_from_locator` (`from_locator_id`),
  ADD KEY `idx_mfg_work_order_to_locator` (`to_locator_id`),
  ADD KEY `FKcnocjkxfvbari3qrap8ej7tew` (`org_id`);

--
-- Indexes for table `payslips`
--
ALTER TABLE `payslips`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKi2u90djkfkqooebb9b26gxqmi` (`employee_id`);

--
-- Indexes for table `payslip_log`
--
ALTER TABLE `payslip_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKku871ay438k3rxf506vrua00x` (`employee_id`),
  ADD KEY `FKfw2us0ubnkbl4d4e67lxo59lv` (`payslip_id`);

--
-- Indexes for table `performance_reviews`
--
ALTER TABLE `performance_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK75f19q3rvitsw5bl5o3k0lirt` (`employee_id`);

--
-- Indexes for table `salary`
--
ALTER TABLE `salary`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK8shr4to2ct7gci2vauwolmrlk` (`employee_id`),
  ADD KEY `FKgmp3o8c9ajuv3497jrqk1en28` (`performance_review_id`);

--
-- Indexes for table `trx_purchase_order`
--
ALTER TABLE `trx_purchase_order`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKmya4l6q7qgglm4gkbxs1bedb9` (`document_no`),
  ADD KEY `FK2hjh6a8d6evdxi05h7apwcrat` (`company_id`),
  ADD KEY `FKkrcela5xv0eaqna73rh1w6ipl` (`org_id`),
  ADD KEY `FK9m963kgmomksoilvmat4ca644` (`price_list_version_id`),
  ADD KEY `FK5mflwcyyrk96dchtp1heyltar` (`vendor_id`);

--
-- Indexes for table `trx_purchase_order_line`
--
ALTER TABLE `trx_purchase_order_line`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKap0qi010day3ndx4ev2cufk5d` (`product_id`),
  ADD KEY `FK8c34vy1g9alvi0912ehmjcycx` (`purchase_order_id`),
  ADD KEY `FKoln67iv41nrjqn7w2nqcnb3lr` (`uom_id`);

--
-- Indexes for table `trx_sales_order`
--
ALTER TABLE `trx_sales_order`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKr1ll8ceeti7wdhyedow1ewxua` (`document_no`),
  ADD KEY `FKpjnegga8t83kg6q37f9leqgr7` (`business_partner_id`),
  ADD KEY `FK5vtmle5kjjni4rks0knb97t3u` (`company_id`),
  ADD KEY `FKlg1w0td5jcgreo8v6o5541auw` (`org_id`),
  ADD KEY `FK7atiiaf46bylnk9v0idp8w6eb` (`price_list_version_id`);

--
-- Indexes for table `trx_sales_order_line`
--
ALTER TABLE `trx_sales_order_line`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK4ff89h0u8k8j2k9g4shemvsq8` (`product_id`),
  ADD KEY `FKg4k1dueficok3fj8uql45y64b` (`sales_order_id`),
  ADD KEY `FK65ngcq7mhtkbp0c6de5w7j72y` (`uom_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  ADD KEY `FKsbg59w8q63i0oo53rlgvlcnjq` (`department_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `core_company`
--
ALTER TABLE `core_company`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `core_document_sequence`
--
ALTER TABLE `core_document_sequence`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `core_org`
--
ALTER TABLE `core_org`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `employee_leave`
--
ALTER TABLE `employee_leave`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `fin_accounting_period`
--
ALTER TABLE `fin_accounting_period`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `fin_bank_account`
--
ALTER TABLE `fin_bank_account`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fin_bank_statement`
--
ALTER TABLE `fin_bank_statement`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fin_bank_statement_line`
--
ALTER TABLE `fin_bank_statement_line`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fin_budget`
--
ALTER TABLE `fin_budget`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fin_budget_line`
--
ALTER TABLE `fin_budget_line`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fin_fiscal_year`
--
ALTER TABLE `fin_fiscal_year`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `fin_gl_account`
--
ALTER TABLE `fin_gl_account`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `fin_invoice`
--
ALTER TABLE `fin_invoice`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fin_invoice_line`
--
ALTER TABLE `fin_invoice_line`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fin_invoice_tax_line`
--
ALTER TABLE `fin_invoice_tax_line`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fin_journal_entry`
--
ALTER TABLE `fin_journal_entry`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fin_journal_line`
--
ALTER TABLE `fin_journal_line`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fin_payment`
--
ALTER TABLE `fin_payment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fin_payment_allocation`
--
ALTER TABLE `fin_payment_allocation`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inv_inventory_adjustment`
--
ALTER TABLE `inv_inventory_adjustment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `inv_inventory_adjustment_line`
--
ALTER TABLE `inv_inventory_adjustment_line`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `inv_locator`
--
ALTER TABLE `inv_locator`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `inv_movement`
--
ALTER TABLE `inv_movement`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `inv_movement_line`
--
ALTER TABLE `inv_movement_line`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `inv_onhand`
--
ALTER TABLE `inv_onhand`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `inv_stock_txn`
--
ALTER TABLE `inv_stock_txn`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `leaves`
--
ALTER TABLE `leaves`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `md_business_partner`
--
ALTER TABLE `md_business_partner`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `md_currency`
--
ALTER TABLE `md_currency`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `md_price_list`
--
ALTER TABLE `md_price_list`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `md_price_list_version`
--
ALTER TABLE `md_price_list_version`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `md_product`
--
ALTER TABLE `md_product`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `md_product_price`
--
ALTER TABLE `md_product_price`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `md_tax_rate`
--
ALTER TABLE `md_tax_rate`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `md_uom`
--
ALTER TABLE `md_uom`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `md_warehouse`
--
ALTER TABLE `md_warehouse`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mfg_bom`
--
ALTER TABLE `mfg_bom`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mfg_bom_line`
--
ALTER TABLE `mfg_bom_line`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `mfg_work_order`
--
ALTER TABLE `mfg_work_order`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `payslips`
--
ALTER TABLE `payslips`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `payslip_log`
--
ALTER TABLE `payslip_log`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `performance_reviews`
--
ALTER TABLE `performance_reviews`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `salary`
--
ALTER TABLE `salary`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `trx_purchase_order`
--
ALTER TABLE `trx_purchase_order`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `trx_purchase_order_line`
--
ALTER TABLE `trx_purchase_order_line`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `trx_sales_order`
--
ALTER TABLE `trx_sales_order`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `trx_sales_order_line`
--
ALTER TABLE `trx_sales_order_line`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `FK1fa36y2oqhao3wgg2rw1pi459` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `FKb48lmkou5j4rvde9sr88bqgjw` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Constraints for table `core_document_sequence`
--
ALTER TABLE `core_document_sequence`
  ADD CONSTRAINT `FKoi3q0fgef9k5dl1tt37y7mk1r` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`);

--
-- Constraints for table `core_org`
--
ALTER TABLE `core_org`
  ADD CONSTRAINT `FK26txbjmeeadjg9ei7oliy3cfh` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`);

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `FKgy4qe3dnqrm3ktd76sxp7n4c2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`);

--
-- Constraints for table `employee_leave`
--
ALTER TABLE `employee_leave`
  ADD CONSTRAINT `FKam8hnlr1aykn1p7ehcb2ee4by` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Constraints for table `fin_accounting_period`
--
ALTER TABLE `fin_accounting_period`
  ADD CONSTRAINT `fk_fin_period_year` FOREIGN KEY (`fiscal_year_id`) REFERENCES `fin_fiscal_year` (`id`);

--
-- Constraints for table `fin_bank_account`
--
ALTER TABLE `fin_bank_account`
  ADD CONSTRAINT `FK12covf5nkasxmaedojxfmv1f6` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`),
  ADD CONSTRAINT `FKt71k8w2tijjrlvjj3j4otnbep` FOREIGN KEY (`org_id`) REFERENCES `core_org` (`id`),
  ADD CONSTRAINT `fk_fin_bank_account_gl` FOREIGN KEY (`gl_account_id`) REFERENCES `fin_gl_account` (`id`);

--
-- Constraints for table `fin_bank_statement`
--
ALTER TABLE `fin_bank_statement`
  ADD CONSTRAINT `FK8js2373ukpjp3vlhlq58p9ksd` FOREIGN KEY (`org_id`) REFERENCES `core_org` (`id`),
  ADD CONSTRAINT `FKaw8yauwdexc8ahrpvjrra29yn` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`),
  ADD CONSTRAINT `fk_fin_bank_statement_bank_account` FOREIGN KEY (`bank_account_id`) REFERENCES `fin_bank_account` (`id`);

--
-- Constraints for table `fin_bank_statement_line`
--
ALTER TABLE `fin_bank_statement_line`
  ADD CONSTRAINT `fk_fin_bank_stmt_line_je` FOREIGN KEY (`journal_entry_id`) REFERENCES `fin_journal_entry` (`id`),
  ADD CONSTRAINT `fk_fin_bank_stmt_line_payment` FOREIGN KEY (`payment_id`) REFERENCES `fin_payment` (`id`),
  ADD CONSTRAINT `fk_fin_bank_stmt_line_stmt` FOREIGN KEY (`bank_statement_id`) REFERENCES `fin_bank_statement` (`id`);

--
-- Constraints for table `fin_budget`
--
ALTER TABLE `fin_budget`
  ADD CONSTRAINT `fin_budget_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`),
  ADD CONSTRAINT `fin_budget_ibfk_2` FOREIGN KEY (`org_id`) REFERENCES `core_org` (`id`),
  ADD CONSTRAINT `fin_budget_ibfk_3` FOREIGN KEY (`fiscal_year_id`) REFERENCES `fin_fiscal_year` (`id`);

--
-- Constraints for table `fin_budget_line`
--
ALTER TABLE `fin_budget_line`
  ADD CONSTRAINT `fin_budget_line_ibfk_1` FOREIGN KEY (`budget_id`) REFERENCES `fin_budget` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fin_budget_line_ibfk_2` FOREIGN KEY (`gl_account_id`) REFERENCES `fin_gl_account` (`id`),
  ADD CONSTRAINT `fin_budget_line_ibfk_3` FOREIGN KEY (`accounting_period_id`) REFERENCES `fin_accounting_period` (`id`);

--
-- Constraints for table `fin_fiscal_year`
--
ALTER TABLE `fin_fiscal_year`
  ADD CONSTRAINT `FKent3xlx9g1elbhdvxaerw2f4h` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`);

--
-- Constraints for table `fin_gl_account`
--
ALTER TABLE `fin_gl_account`
  ADD CONSTRAINT `FK9qt6dg5lnnem9875xdc1iuhhf` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`);

--
-- Constraints for table `fin_invoice`
--
ALTER TABLE `fin_invoice`
  ADD CONSTRAINT `FK8rifybtm7iaooikye456jkivc` FOREIGN KEY (`journal_entry_id`) REFERENCES `fin_journal_entry` (`id`),
  ADD CONSTRAINT `FKmmhgqqg6xrh5q3vsm0f24gee6` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`),
  ADD CONSTRAINT `FKngriw655kx842ulrpmw3dkx27` FOREIGN KEY (`tax_rate_id`) REFERENCES `md_tax_rate` (`id`),
  ADD CONSTRAINT `FKohetjml3vo4x6ox93wgwatjhk` FOREIGN KEY (`org_id`) REFERENCES `core_org` (`id`),
  ADD CONSTRAINT `FKpjcivvomes29ah6q8haeh8agp` FOREIGN KEY (`business_partner_id`) REFERENCES `md_business_partner` (`id`);

--
-- Constraints for table `fin_invoice_line`
--
ALTER TABLE `fin_invoice_line`
  ADD CONSTRAINT `FK30nkneaphg4gta1k1d8vmb8ka` FOREIGN KEY (`invoice_id`) REFERENCES `fin_invoice` (`id`),
  ADD CONSTRAINT `FKbrgpq35u3qpx5u9tecmm406ia` FOREIGN KEY (`uom_id`) REFERENCES `md_uom` (`id`),
  ADD CONSTRAINT `FKk29rkql6m2h3u0jf34fpujvgr` FOREIGN KEY (`product_id`) REFERENCES `md_product` (`id`);

--
-- Constraints for table `fin_invoice_tax_line`
--
ALTER TABLE `fin_invoice_tax_line`
  ADD CONSTRAINT `fk_fin_invoice_tax_line_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `fin_invoice` (`id`),
  ADD CONSTRAINT `fk_fin_invoice_tax_line_tax_rate` FOREIGN KEY (`tax_rate_id`) REFERENCES `md_tax_rate` (`id`);

--
-- Constraints for table `fin_journal_entry`
--
ALTER TABLE `fin_journal_entry`
  ADD CONSTRAINT `FKbd7k5id9jrt5hgo5s6bexjd5a` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`),
  ADD CONSTRAINT `FKi8ywrtvy0cf0atcy1vsqapk12` FOREIGN KEY (`org_id`) REFERENCES `core_org` (`id`),
  ADD CONSTRAINT `fk_journal_entry_period` FOREIGN KEY (`accounting_period_id`) REFERENCES `fin_accounting_period` (`id`);

--
-- Constraints for table `fin_journal_line`
--
ALTER TABLE `fin_journal_line`
  ADD CONSTRAINT `FKrr0nrf4727l066ros5l715eua` FOREIGN KEY (`journal_entry_id`) REFERENCES `fin_journal_entry` (`id`),
  ADD CONSTRAINT `fk_fin_journal_line_gl_account` FOREIGN KEY (`gl_account_id`) REFERENCES `fin_gl_account` (`id`);

--
-- Constraints for table `fin_payment`
--
ALTER TABLE `fin_payment`
  ADD CONSTRAINT `FK1wdwdvhcdjhp4w29jk9hpdf5x` FOREIGN KEY (`invoice_id`) REFERENCES `fin_invoice` (`id`),
  ADD CONSTRAINT `FK6t3m06chge0xwmjngqc3u60gj` FOREIGN KEY (`business_partner_id`) REFERENCES `md_business_partner` (`id`),
  ADD CONSTRAINT `FK93i6fxkgam0yjml3q97p83ew4` FOREIGN KEY (`org_id`) REFERENCES `core_org` (`id`),
  ADD CONSTRAINT `FKbnujd8m2ktkgmlunaa7uqtnia` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`),
  ADD CONSTRAINT `FKejcmfgeyfpi8gjbtxpas8ovyo` FOREIGN KEY (`journal_entry_id`) REFERENCES `fin_journal_entry` (`id`);

--
-- Constraints for table `fin_payment_allocation`
--
ALTER TABLE `fin_payment_allocation`
  ADD CONSTRAINT `FKccbb8g9648ebswe7qhlujxgn0` FOREIGN KEY (`invoice_id`) REFERENCES `fin_invoice` (`id`),
  ADD CONSTRAINT `FKcv9805dglo8ilylkixh3vvsep` FOREIGN KEY (`payment_id`) REFERENCES `fin_payment` (`id`);

--
-- Constraints for table `inv_inventory_adjustment`
--
ALTER TABLE `inv_inventory_adjustment`
  ADD CONSTRAINT `inv_inventory_adjustment_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`),
  ADD CONSTRAINT `inv_inventory_adjustment_ibfk_2` FOREIGN KEY (`org_id`) REFERENCES `core_org` (`id`),
  ADD CONSTRAINT `inv_inventory_adjustment_ibfk_3` FOREIGN KEY (`journal_entry_id`) REFERENCES `fin_journal_entry` (`id`);

--
-- Constraints for table `inv_inventory_adjustment_line`
--
ALTER TABLE `inv_inventory_adjustment_line`
  ADD CONSTRAINT `inv_inventory_adjustment_line_ibfk_1` FOREIGN KEY (`adjustment_id`) REFERENCES `inv_inventory_adjustment` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inv_inventory_adjustment_line_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `md_product` (`id`),
  ADD CONSTRAINT `inv_inventory_adjustment_line_ibfk_3` FOREIGN KEY (`locator_id`) REFERENCES `inv_locator` (`id`);

--
-- Constraints for table `inv_locator`
--
ALTER TABLE `inv_locator`
  ADD CONSTRAINT `FK70c74uqp1hsxn96ikstk24ktg` FOREIGN KEY (`warehouse_id`) REFERENCES `md_warehouse` (`id`),
  ADD CONSTRAINT `FKclac12de36267xbvw4ems8n1e` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`),
  ADD CONSTRAINT `FKf17gkfs5mxt7423s4myctgw8n` FOREIGN KEY (`org_id`) REFERENCES `core_org` (`id`);

--
-- Constraints for table `inv_movement`
--
ALTER TABLE `inv_movement`
  ADD CONSTRAINT `FK9w9c6rdqhmb7sbi7qtfkq9a36` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`);

--
-- Constraints for table `inv_movement_line`
--
ALTER TABLE `inv_movement_line`
  ADD CONSTRAINT `FK7y5pcrt7igbsa9t71gbk1bw5o` FOREIGN KEY (`movement_id`) REFERENCES `inv_movement` (`id`),
  ADD CONSTRAINT `FK8b3swlx9t3sqi9ymjsujw3120` FOREIGN KEY (`from_locator_id`) REFERENCES `inv_locator` (`id`),
  ADD CONSTRAINT `FKlhvtkrro7nahwp3sfkrmux0ia` FOREIGN KEY (`product_id`) REFERENCES `md_product` (`id`),
  ADD CONSTRAINT `FKo7w2c12rl2r5vk17jrgrs0geq` FOREIGN KEY (`to_locator_id`) REFERENCES `inv_locator` (`id`);

--
-- Constraints for table `inv_onhand`
--
ALTER TABLE `inv_onhand`
  ADD CONSTRAINT `inv_onhand_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`),
  ADD CONSTRAINT `inv_onhand_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `md_product` (`id`),
  ADD CONSTRAINT `inv_onhand_ibfk_3` FOREIGN KEY (`locator_id`) REFERENCES `inv_locator` (`id`);

--
-- Constraints for table `inv_stock_txn`
--
ALTER TABLE `inv_stock_txn`
  ADD CONSTRAINT `FK4u1bof7dsi24fjy4eij96i3r8` FOREIGN KEY (`locator_id`) REFERENCES `inv_locator` (`id`),
  ADD CONSTRAINT `FKmaa0wr48qgq7qvepbgy30jjqk` FOREIGN KEY (`product_id`) REFERENCES `md_product` (`id`),
  ADD CONSTRAINT `FKtg22u0vk27dp81yvekcxx5fai` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`);

--
-- Constraints for table `leaves`
--
ALTER TABLE `leaves`
  ADD CONSTRAINT `FK6kwhuq11saeyki0nc54elfap2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Constraints for table `md_business_partner`
--
ALTER TABLE `md_business_partner`
  ADD CONSTRAINT `FKb6ybriy57gxk20rkv2v6hmcc4` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`);

--
-- Constraints for table `md_currency`
--
ALTER TABLE `md_currency`
  ADD CONSTRAINT `FKfi2l06m912a2bx4t7etgox8go` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`);

--
-- Constraints for table `md_price_list`
--
ALTER TABLE `md_price_list`
  ADD CONSTRAINT `FK21mx8mdqe0kqao97sp3rabbba` FOREIGN KEY (`currency_id`) REFERENCES `md_currency` (`id`),
  ADD CONSTRAINT `FKjbwf94b7gho0hnnyg04kolgts` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`);

--
-- Constraints for table `md_price_list_version`
--
ALTER TABLE `md_price_list_version`
  ADD CONSTRAINT `FK2oj4xw5nfl8ua1nevcs2g5hy8` FOREIGN KEY (`price_list_id`) REFERENCES `md_price_list` (`id`);

--
-- Constraints for table `md_product`
--
ALTER TABLE `md_product`
  ADD CONSTRAINT `FKiqlfjecrm8sy72am9kswypi7n` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`),
  ADD CONSTRAINT `FKn6jicfgl3r062ir33hhp3rq5r` FOREIGN KEY (`uom_id`) REFERENCES `md_uom` (`id`);

--
-- Constraints for table `md_product_price`
--
ALTER TABLE `md_product_price`
  ADD CONSTRAINT `FKhqcohap0j8wvefc9d74mv3g0d` FOREIGN KEY (`price_list_version_id`) REFERENCES `md_price_list_version` (`id`),
  ADD CONSTRAINT `FKsuc0cdhd870mx4vg0eff4hrfy` FOREIGN KEY (`product_id`) REFERENCES `md_product` (`id`);

--
-- Constraints for table `md_tax_rate`
--
ALTER TABLE `md_tax_rate`
  ADD CONSTRAINT `FKmr3guydg3cpt07eercf274wfr` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`);

--
-- Constraints for table `md_uom`
--
ALTER TABLE `md_uom`
  ADD CONSTRAINT `FKn92aquelf74ya4ldfju6ihs41` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`);

--
-- Constraints for table `md_warehouse`
--
ALTER TABLE `md_warehouse`
  ADD CONSTRAINT `FKjovjinqarxr3ca44ctk5jsnxb` FOREIGN KEY (`org_id`) REFERENCES `core_org` (`id`),
  ADD CONSTRAINT `FKpldqe89x5rffeqffijvafcrsp` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`);

--
-- Constraints for table `mfg_bom`
--
ALTER TABLE `mfg_bom`
  ADD CONSTRAINT `FKqbhxmi4picoj4op1mt36s8uot` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`),
  ADD CONSTRAINT `FKswnlipx49nlnt086bf1vqapqr` FOREIGN KEY (`org_id`) REFERENCES `core_org` (`id`),
  ADD CONSTRAINT `FKtqc6jwufpd7ns0sje52aswhxq` FOREIGN KEY (`product_id`) REFERENCES `md_product` (`id`);

--
-- Constraints for table `mfg_bom_line`
--
ALTER TABLE `mfg_bom_line`
  ADD CONSTRAINT `FKjake8723tsq8g3gwch48jwfj5` FOREIGN KEY (`component_product_id`) REFERENCES `md_product` (`id`),
  ADD CONSTRAINT `fk_mfg_bom_line_bom` FOREIGN KEY (`bom_id`) REFERENCES `mfg_bom` (`id`);

--
-- Constraints for table `mfg_work_order`
--
ALTER TABLE `mfg_work_order`
  ADD CONSTRAINT `FK2fh6xc4w5xhctdy6asiogvle6` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`),
  ADD CONSTRAINT `FK4gogj1cebv92wirrm3uqdp6mh` FOREIGN KEY (`product_id`) REFERENCES `md_product` (`id`),
  ADD CONSTRAINT `FK9qo78dy83iwbaewf13hhlxoe8` FOREIGN KEY (`bom_id`) REFERENCES `mfg_bom` (`id`),
  ADD CONSTRAINT `FKcnocjkxfvbari3qrap8ej7tew` FOREIGN KEY (`org_id`) REFERENCES `core_org` (`id`),
  ADD CONSTRAINT `FKpmiui2kwcxmyik28pogalipvm` FOREIGN KEY (`from_locator_id`) REFERENCES `inv_locator` (`id`),
  ADD CONSTRAINT `FKsq0m0w1tbvcuhwi2sd1i54m3l` FOREIGN KEY (`to_locator_id`) REFERENCES `inv_locator` (`id`);

--
-- Constraints for table `payslips`
--
ALTER TABLE `payslips`
  ADD CONSTRAINT `FKi2u90djkfkqooebb9b26gxqmi` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Constraints for table `payslip_log`
--
ALTER TABLE `payslip_log`
  ADD CONSTRAINT `FKfw2us0ubnkbl4d4e67lxo59lv` FOREIGN KEY (`payslip_id`) REFERENCES `payslips` (`id`),
  ADD CONSTRAINT `FKku871ay438k3rxf506vrua00x` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Constraints for table `performance_reviews`
--
ALTER TABLE `performance_reviews`
  ADD CONSTRAINT `FK75f19q3rvitsw5bl5o3k0lirt` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Constraints for table `salary`
--
ALTER TABLE `salary`
  ADD CONSTRAINT `FK8shr4to2ct7gci2vauwolmrlk` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `FKgmp3o8c9ajuv3497jrqk1en28` FOREIGN KEY (`performance_review_id`) REFERENCES `performance_reviews` (`id`);

--
-- Constraints for table `trx_purchase_order`
--
ALTER TABLE `trx_purchase_order`
  ADD CONSTRAINT `FK2hjh6a8d6evdxi05h7apwcrat` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`),
  ADD CONSTRAINT `FK5mflwcyyrk96dchtp1heyltar` FOREIGN KEY (`vendor_id`) REFERENCES `md_business_partner` (`id`),
  ADD CONSTRAINT `FK9m963kgmomksoilvmat4ca644` FOREIGN KEY (`price_list_version_id`) REFERENCES `md_price_list_version` (`id`),
  ADD CONSTRAINT `FKkrcela5xv0eaqna73rh1w6ipl` FOREIGN KEY (`org_id`) REFERENCES `core_org` (`id`);

--
-- Constraints for table `trx_purchase_order_line`
--
ALTER TABLE `trx_purchase_order_line`
  ADD CONSTRAINT `FK8c34vy1g9alvi0912ehmjcycx` FOREIGN KEY (`purchase_order_id`) REFERENCES `trx_purchase_order` (`id`),
  ADD CONSTRAINT `FKap0qi010day3ndx4ev2cufk5d` FOREIGN KEY (`product_id`) REFERENCES `md_product` (`id`),
  ADD CONSTRAINT `FKoln67iv41nrjqn7w2nqcnb3lr` FOREIGN KEY (`uom_id`) REFERENCES `md_uom` (`id`);

--
-- Constraints for table `trx_sales_order`
--
ALTER TABLE `trx_sales_order`
  ADD CONSTRAINT `FK5vtmle5kjjni4rks0knb97t3u` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`),
  ADD CONSTRAINT `FK7atiiaf46bylnk9v0idp8w6eb` FOREIGN KEY (`price_list_version_id`) REFERENCES `md_price_list_version` (`id`),
  ADD CONSTRAINT `FKlg1w0td5jcgreo8v6o5541auw` FOREIGN KEY (`org_id`) REFERENCES `core_org` (`id`),
  ADD CONSTRAINT `FKpjnegga8t83kg6q37f9leqgr7` FOREIGN KEY (`business_partner_id`) REFERENCES `md_business_partner` (`id`);

--
-- Constraints for table `trx_sales_order_line`
--
ALTER TABLE `trx_sales_order_line`
  ADD CONSTRAINT `FK4ff89h0u8k8j2k9g4shemvsq8` FOREIGN KEY (`product_id`) REFERENCES `md_product` (`id`),
  ADD CONSTRAINT `FK65ngcq7mhtkbp0c6de5w7j72y` FOREIGN KEY (`uom_id`) REFERENCES `md_uom` (`id`),
  ADD CONSTRAINT `FKg4k1dueficok3fj8uql45y64b` FOREIGN KEY (`sales_order_id`) REFERENCES `trx_sales_order` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `FKsbg59w8q63i0oo53rlgvlcnjq` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
