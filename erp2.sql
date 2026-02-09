-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 09, 2026 at 07:19 AM
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
-- Database: `erp2`
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

-- --------------------------------------------------------

--
-- Table structure for table `core_attachment`
--

CREATE TABLE `core_attachment` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `company_id` bigint(20) NOT NULL,
  `content_type` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `original_file_name` varchar(255) NOT NULL,
  `ref_id` bigint(20) NOT NULL,
  `ref_type` varchar(255) NOT NULL,
  `size_bytes` bigint(20) NOT NULL,
  `storage_path` varchar(1024) NOT NULL,
  `stored_file_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, '2026-02-09 06:12:44.000000', 'admin@test.com', '2026-02-09 06:12:44.000000', 'admin@test.com', b'1', 'c-01', 'Doosan Cipta PT');

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
  `document_type` enum('BANK_STATEMENT','INVENTORY_ADJUSTMENT','INVENTORY_MOVEMENT','INVOICE','JOURNAL_ENTRY','PAYMENT','PURCHASE_ORDER','SALES_ORDER','WORK_ORDER') NOT NULL,
  `next_number` bigint(20) NOT NULL,
  `padding` int(11) NOT NULL,
  `prefix` varchar(255) NOT NULL,
  `company_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_document_sequence`
--

INSERT INTO `core_document_sequence` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `document_type`, `next_number`, `padding`, `prefix`, `company_id`) VALUES
(1, '2026-02-09 06:16:51.000000', 'admin@test.com', '2026-02-09 06:16:51.000000', 'admin@test.com', 'SALES_ORDER', 2, 5, 'SO-', 1);

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
(1, '2026-02-09 06:13:03.000000', 'admin@test.com', '2026-02-09 06:13:03.000000', 'admin@test.com', b'1', 'o-01', 'org-01', 1);

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `fin_accounting_period`
--

CREATE TABLE `fin_accounting_period` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `end_date` date NOT NULL,
  `name` varchar(255) NOT NULL,
  `period_no` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `status` enum('CLOSED','OPEN') NOT NULL,
  `fiscal_year_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fin_bank_account`
--

CREATE TABLE `fin_bank_account` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `account_no` varchar(255) DEFAULT NULL,
  `active` bit(1) NOT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `currency_code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `company_id` bigint(20) NOT NULL,
  `gl_account_id` bigint(20) NOT NULL,
  `org_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fin_bank_statement`
--

CREATE TABLE `fin_bank_statement` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `document_no` varchar(255) NOT NULL,
  `statement_date` date NOT NULL,
  `bank_account_id` bigint(20) NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `org_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fin_bank_statement_line`
--

CREATE TABLE `fin_bank_statement_line` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `amount` decimal(38,2) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `reconciled` bit(1) NOT NULL,
  `trx_date` date NOT NULL,
  `bank_statement_id` bigint(20) NOT NULL,
  `journal_entry_id` bigint(20) DEFAULT NULL,
  `payment_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fin_budget`
--

CREATE TABLE `fin_budget` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('APPROVED','COMPLETED','DRAFTED','PARTIALLY_COMPLETED','VOIDED') NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `fiscal_year_id` bigint(20) NOT NULL,
  `org_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fin_budget_line`
--

CREATE TABLE `fin_budget_line` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `budget_amount` decimal(38,2) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `accounting_period_id` bigint(20) NOT NULL,
  `budget_id` bigint(20) NOT NULL,
  `gl_account_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fin_fiscal_year`
--

CREATE TABLE `fin_fiscal_year` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `end_date` date NOT NULL,
  `start_date` date NOT NULL,
  `status` enum('CLOSED','OPEN') NOT NULL,
  `year` int(11) NOT NULL,
  `company_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fin_gl_account`
--

CREATE TABLE `fin_gl_account` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `active` bit(1) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('ASSET','EQUITY','EXPENSE','LIABILITY','REVENUE') NOT NULL,
  `company_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `open_amount` decimal(38,2) NOT NULL,
  `paid_amount` decimal(38,2) NOT NULL,
  `purchase_order_id` bigint(20) DEFAULT NULL,
  `sales_order_id` bigint(20) DEFAULT NULL,
  `status` enum('APPROVED','COMPLETED','DRAFTED','PARTIALLY_COMPLETED','VOIDED') NOT NULL,
  `total_net` decimal(38,2) NOT NULL,
  `total_tax` decimal(38,2) NOT NULL,
  `business_partner_id` bigint(20) NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `journal_entry_id` bigint(20) DEFAULT NULL,
  `org_id` bigint(20) DEFAULT NULL,
  `tax_rate_id` bigint(20) DEFAULT NULL
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
  `purchase_order_line_id` bigint(20) DEFAULT NULL,
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
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `rounding_amount` decimal(38,2) NOT NULL,
  `tax_amount` decimal(38,2) NOT NULL,
  `tax_base` decimal(38,2) NOT NULL,
  `invoice_id` bigint(20) NOT NULL,
  `tax_rate_id` bigint(20) DEFAULT NULL
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
  `source_document_no` varchar(255) DEFAULT NULL,
  `source_document_type` enum('BANK_STATEMENT','INVENTORY_ADJUSTMENT','INVENTORY_MOVEMENT','INVOICE','JOURNAL_ENTRY','PAYMENT','PURCHASE_ORDER','SALES_ORDER','WORK_ORDER') DEFAULT NULL,
  `status` enum('APPROVED','COMPLETED','DRAFTED','PARTIALLY_COMPLETED','VOIDED') NOT NULL,
  `accounting_period_id` bigint(20) DEFAULT NULL,
  `company_id` bigint(20) NOT NULL,
  `org_id` bigint(20) DEFAULT NULL
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
  `account_code` enum('ADJUSTMENT','AP','AR','CASH','EXPENSE','INVENTORY','REVENUE','TAX_PAYABLE','TAX_RECEIVABLE') NOT NULL,
  `credit` decimal(38,2) NOT NULL,
  `debit` decimal(38,2) NOT NULL,
  `gl_account_id` bigint(20) DEFAULT NULL,
  `journal_entry_id` bigint(20) NOT NULL
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
  `status` enum('APPROVED','COMPLETED','DRAFTED','PARTIALLY_COMPLETED','VOIDED') NOT NULL,
  `business_partner_id` bigint(20) NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `invoice_id` bigint(20) DEFAULT NULL,
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
-- Table structure for table `inv_inventory_adjustment`
--

CREATE TABLE `inv_inventory_adjustment` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `adjustment_date` date NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `document_no` varchar(255) NOT NULL,
  `status` enum('APPROVED','COMPLETED','DRAFTED','PARTIALLY_COMPLETED','VOIDED') NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `journal_entry_id` bigint(20) DEFAULT NULL,
  `org_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inv_inventory_adjustment_line`
--

CREATE TABLE `inv_inventory_adjustment_line` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `adjustment_amount` decimal(38,2) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `quantity_adjusted` decimal(38,2) NOT NULL,
  `quantity_on_hand_after` decimal(38,2) NOT NULL,
  `quantity_on_hand_before` decimal(38,2) NOT NULL,
  `adjustment_id` bigint(20) NOT NULL,
  `locator_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `purchase_order_id` bigint(20) DEFAULT NULL,
  `sales_order_id` bigint(20) DEFAULT NULL,
  `status` enum('APPROVED','COMPLETED','DRAFTED','PARTIALLY_COMPLETED','VOIDED') NOT NULL,
  `company_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `inv_onhand`
--

CREATE TABLE `inv_onhand` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `quantity_on_hand` decimal(38,2) NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `locator_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, '2026-02-09 06:13:58.000000', 'admin@test.com', '2026-02-09 06:13:58.000000', 'admin@test.com', b'1', 'admin@test.com', 'PT PAN', '777777', 'VENDOR', 1),
(2, '2026-02-09 06:14:16.000000', 'admin@test.com', '2026-02-09 06:14:16.000000', 'admin@test.com', b'1', 'admin@test.com', 'PT Nike', '777777', 'CUSTOMER', 1);

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
(1, '2026-02-09 06:14:30.000000', 'admin@test.com', '2026-02-09 06:14:30.000000', 'admin@test.com', b'1', '333', 'IDR', 1, 1);

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
(1, '2026-02-09 06:15:43.000000', 'admin@test.com', '2026-02-09 06:15:43.000000', 'admin@test.com', b'1', 'IDR', b'1', 1, 1);

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
(1, '2026-02-09 06:15:48.000000', 'admin@test.com', '2026-02-09 06:15:48.000000', 'admin@test.com', b'1', '2026-02-09', 1);

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
  `item_type` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `uom_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `md_product`
--

INSERT INTO `md_product` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `active`, `code`, `item_type`, `name`, `company_id`, `uom_id`) VALUES
(1, '2026-02-09 06:14:59.000000', 'admin@test.com', '2026-02-09 06:14:59.000000', 'admin@test.com', b'1', 'ki-01', NULL, 'KIMONO', 1, 1),
(2, '2026-02-09 06:15:16.000000', 'admin@test.com', '2026-02-09 06:15:16.000000', 'admin@test.com', b'1', '01', 'MARCHANDISES', 'Kain', 1, 1),
(3, '2026-02-09 06:15:29.000000', 'admin@test.com', '2026-02-09 06:15:29.000000', 'admin@test.com', b'1', '22', 'MARCHANDISES', 'Benang', 1, 1);

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
(1, '2026-02-09 06:16:00.000000', 'admin@test.com', '2026-02-09 06:16:00.000000', 'admin@test.com', b'1', 1000.00, 1, 1),
(2, '2026-02-09 06:16:03.000000', 'admin@test.com', '2026-02-09 06:16:03.000000', 'admin@test.com', b'1', 100.00, 1, 2),
(3, '2026-02-09 06:16:06.000000', 'admin@test.com', '2026-02-09 06:16:06.000000', 'admin@test.com', b'1', 10.00, 1, 3);

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
(1, '2026-02-09 06:13:33.000000', 'admin@test.com', '2026-02-09 06:13:33.000000', 'admin@test.com', b'1', '01', 'pcs', 1);

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
(1, '2026-02-09 06:16:23.000000', 'admin@test.com', '2026-02-09 06:16:23.000000', 'admin@test.com', b'1', '99', 'Gudang Pertama', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `mfg_bom`
--

CREATE TABLE `mfg_bom` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `active` bit(1) NOT NULL,
  `version` int(11) NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `org_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mfg_bom_line`
--

CREATE TABLE `mfg_bom_line` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `qty` decimal(38,2) NOT NULL,
  `bom_id` bigint(20) NOT NULL,
  `component_product_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mfg_work_order`
--

CREATE TABLE `mfg_work_order` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `document_no` varchar(255) NOT NULL,
  `issue_movement_doc_no` varchar(255) DEFAULT NULL,
  `issue_reversal_movement_doc_no` varchar(255) DEFAULT NULL,
  `qty` decimal(38,2) NOT NULL,
  `receipt_movement_doc_no` varchar(255) DEFAULT NULL,
  `receipt_reversal_movement_doc_no` varchar(255) DEFAULT NULL,
  `status` enum('APPROVED','COMPLETED','DRAFTED','PARTIALLY_COMPLETED','VOIDED') NOT NULL,
  `work_date` date NOT NULL,
  `bom_id` bigint(20) DEFAULT NULL,
  `company_id` bigint(20) NOT NULL,
  `from_locator_id` bigint(20) NOT NULL,
  `org_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) NOT NULL,
  `sales_order_line_bom_id` bigint(20) DEFAULT NULL,
  `to_locator_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `department` varchar(255) NOT NULL,
  `employee_name` varchar(255) DEFAULT NULL,
  `final_salary` double NOT NULL,
  `forwarded_to_finance` bit(1) NOT NULL,
  `leave_days` int(11) NOT NULL,
  `month` date NOT NULL,
  `paid` bit(1) NOT NULL,
  `present_days` int(11) NOT NULL,
  `tax` double DEFAULT NULL,
  `total_payable` double DEFAULT NULL,
  `employee_id` bigint(20) DEFAULT NULL,
  `performance_review_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `status` enum('APPROVED','COMPLETED','DRAFTED','PARTIALLY_COMPLETED','VOIDED') NOT NULL,
  `total_net` decimal(38,2) NOT NULL,
  `total_tax` decimal(38,2) NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `org_id` bigint(20) DEFAULT NULL,
  `price_list_version_id` bigint(20) NOT NULL,
  `vendor_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `invoiced_qty` decimal(38,2) NOT NULL,
  `line_net` decimal(38,2) NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `qty` decimal(38,2) NOT NULL,
  `received_qty` decimal(38,2) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `purchase_order_id` bigint(20) NOT NULL,
  `uom_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `buyer_po` varchar(255) DEFAULT NULL,
  `delivery_place` varchar(255) DEFAULT NULL,
  `document_no` varchar(255) NOT NULL,
  `exchange_rate` decimal(38,2) DEFAULT NULL,
  `foreign_amount` decimal(38,2) DEFAULT NULL,
  `grand_total` decimal(38,2) NOT NULL,
  `in_charge` varchar(255) DEFAULT NULL,
  `memo` varchar(255) DEFAULT NULL,
  `order_date` date NOT NULL,
  `order_type` enum('DOMESTIC','EXPORT') NOT NULL,
  `payment_condition` varchar(255) DEFAULT NULL,
  `status` enum('APPROVED','COMPLETED','DRAFTED','PARTIALLY_COMPLETED','VOIDED') NOT NULL,
  `total_net` decimal(38,2) NOT NULL,
  `total_tax` decimal(38,2) NOT NULL,
  `business_partner_id` bigint(20) NOT NULL,
  `company_id` bigint(20) NOT NULL,
  `currency_id` bigint(20) DEFAULT NULL,
  `department_id` bigint(20) DEFAULT NULL,
  `employee_id` bigint(20) DEFAULT NULL,
  `forwarding_warehouse_id` bigint(20) DEFAULT NULL,
  `org_id` bigint(20) DEFAULT NULL,
  `price_list_version_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trx_sales_order`
--

INSERT INTO `trx_sales_order` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `buyer_po`, `delivery_place`, `document_no`, `exchange_rate`, `foreign_amount`, `grand_total`, `in_charge`, `memo`, `order_date`, `order_type`, `payment_condition`, `status`, `total_net`, `total_tax`, `business_partner_id`, `company_id`, `currency_id`, `department_id`, `employee_id`, `forwarding_warehouse_id`, `org_id`, `price_list_version_id`) VALUES
(1, '2026-02-09 06:16:51.000000', 'admin@test.com', '2026-02-09 06:17:44.000000', 'admin@test.com', NULL, NULL, 'SO-00001', NULL, NULL, 3000.00, NULL, 'test memo', '2026-02-09', 'DOMESTIC', NULL, 'DRAFTED', 3000.00, 0.00, 2, 1, NULL, NULL, NULL, NULL, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `trx_sales_order_delivery_schedule`
--

CREATE TABLE `trx_sales_order_delivery_schedule` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `factory` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `ship_mode` varchar(255) DEFAULT NULL,
  `sales_order_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `cm_cost` decimal(38,2) DEFAULT NULL,
  `cmt_cost` decimal(38,2) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `cutting_no` varchar(255) DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `destination` varchar(255) DEFAULT NULL,
  `dp_price` decimal(38,2) DEFAULT NULL,
  `fabric_eta` date DEFAULT NULL,
  `fabric_etd` date DEFAULT NULL,
  `factory` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `fob_price` decimal(38,2) DEFAULT NULL,
  `ldp_price` decimal(38,2) DEFAULT NULL,
  `line_net` decimal(38,2) NOT NULL,
  `national_size` varchar(255) DEFAULT NULL,
  `price` decimal(38,2) NOT NULL,
  `qty` decimal(38,2) NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `ship_mode` varchar(255) DEFAULT NULL,
  `shipped_qty` decimal(38,2) NOT NULL,
  `size` varchar(255) DEFAULT NULL,
  `style` varchar(255) DEFAULT NULL,
  `supply_amount` decimal(38,2) DEFAULT NULL,
  `unit` varchar(255) DEFAULT NULL,
  `vat_amount` decimal(38,2) DEFAULT NULL,
  `product_id` bigint(20) NOT NULL,
  `sales_order_id` bigint(20) NOT NULL,
  `uom_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trx_sales_order_line`
--

INSERT INTO `trx_sales_order_line` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `cm_cost`, `cmt_cost`, `color`, `cutting_no`, `delivery_date`, `description`, `destination`, `dp_price`, `fabric_eta`, `fabric_etd`, `factory`, `file_path`, `fob_price`, `ldp_price`, `line_net`, `national_size`, `price`, `qty`, `remark`, `ship_mode`, `shipped_qty`, `size`, `style`, `supply_amount`, `unit`, `vat_amount`, `product_id`, `sales_order_id`, `uom_id`) VALUES
(1, '2026-02-09 06:16:51.000000', 'admin@test.com', '2026-02-09 06:17:44.000000', 'admin@test.com', NULL, NULL, 'RED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2000.00, NULL, 1000.00, 2.00, NULL, NULL, 0.00, 'XL', 'Style A', NULL, NULL, NULL, 1, 1, 1),
(2, '2026-02-09 06:17:44.000000', 'admin@test.com', '2026-02-09 06:17:44.000000', 'admin@test.com', NULL, NULL, 'RED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1000.00, NULL, 1000.00, 1.00, NULL, NULL, 0.00, 'L', 'Style A', NULL, NULL, NULL, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `trx_sales_order_line_bom`
--

CREATE TABLE `trx_sales_order_line_bom` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `source_bom_id` bigint(20) DEFAULT NULL,
  `source_bom_version` int(11) DEFAULT NULL,
  `sales_order_line_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trx_sales_order_line_bom`
--

INSERT INTO `trx_sales_order_line_bom` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `source_bom_id`, `source_bom_version`, `sales_order_line_id`) VALUES
(1, '2026-02-09 06:17:59.000000', 'admin@test.com', '2026-02-09 06:17:59.000000', 'admin@test.com', NULL, NULL, 1),
(2, '2026-02-09 06:17:59.000000', 'admin@test.com', '2026-02-09 06:17:59.000000', 'admin@test.com', NULL, NULL, 2);

-- --------------------------------------------------------

--
-- Table structure for table `trx_sales_order_line_bom_line`
--

CREATE TABLE `trx_sales_order_line_bom_line` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `amount_domestic` decimal(38,2) DEFAULT NULL,
  `amount_foreign` decimal(38,2) DEFAULT NULL,
  `bom_code` varchar(255) DEFAULT NULL,
  `color_description2` varchar(255) DEFAULT NULL,
  `currency_id` bigint(20) DEFAULT NULL,
  `description1` varchar(255) DEFAULT NULL,
  `exchange_rate` decimal(38,2) DEFAULT NULL,
  `qty` decimal(38,2) NOT NULL,
  `unit` varchar(255) DEFAULT NULL,
  `unit_price_domestic` decimal(38,2) DEFAULT NULL,
  `unit_price_foreign` decimal(38,2) DEFAULT NULL,
  `yy` decimal(38,2) DEFAULT NULL,
  `component_product_id` bigint(20) NOT NULL,
  `sales_order_line_bom_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trx_sales_order_line_bom_line`
--

INSERT INTO `trx_sales_order_line_bom_line` (`id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `amount_domestic`, `amount_foreign`, `bom_code`, `color_description2`, `currency_id`, `description1`, `exchange_rate`, `qty`, `unit`, `unit_price_domestic`, `unit_price_foreign`, `yy`, `component_product_id`, `sales_order_line_bom_id`) VALUES
(1, '2026-02-09 06:17:59.000000', 'admin@test.com', '2026-02-09 06:17:59.000000', 'admin@test.com', NULL, NULL, '2', NULL, NULL, NULL, NULL, 1.00, NULL, NULL, NULL, NULL, 2, 1),
(2, '2026-02-09 06:17:59.000000', 'admin@test.com', '2026-02-09 06:17:59.000000', 'admin@test.com', NULL, NULL, '2', NULL, NULL, NULL, NULL, 1.00, NULL, NULL, NULL, NULL, 2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `trx_sales_order_line_lookup`
--

CREATE TABLE `trx_sales_order_line_lookup` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `company_id` bigint(20) NOT NULL,
  `field_name` varchar(255) NOT NULL,
  `field_value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 'admin@test.com', 'Admin User', b'1', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'ADMIN', 'ACTIVE', NULL);

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
-- Indexes for table `core_attachment`
--
ALTER TABLE `core_attachment`
  ADD PRIMARY KEY (`id`);

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
  ADD UNIQUE KEY `uk_fin_period_year_period` (`fiscal_year_id`,`period_no`);

--
-- Indexes for table `fin_bank_account`
--
ALTER TABLE `fin_bank_account`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK12covf5nkasxmaedojxfmv1f6` (`company_id`),
  ADD KEY `FKs4db4i7y80e7kc060ax55wd8` (`gl_account_id`),
  ADD KEY `FKt71k8w2tijjrlvjj3j4otnbep` (`org_id`);

--
-- Indexes for table `fin_bank_statement`
--
ALTER TABLE `fin_bank_statement`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKaq74qmcaauwj15fth69u4jkcx` (`document_no`),
  ADD KEY `FKofrrwu728q08yyam64udy2wq0` (`bank_account_id`),
  ADD KEY `FKaw8yauwdexc8ahrpvjrra29yn` (`company_id`),
  ADD KEY `FK8js2373ukpjp3vlhlq58p9ksd` (`org_id`);

--
-- Indexes for table `fin_bank_statement_line`
--
ALTER TABLE `fin_bank_statement_line`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKlatth8wpd8v39hy5acd1hlt8j` (`bank_statement_id`),
  ADD KEY `FK1praojujxdchx0c0qorwcacc1` (`journal_entry_id`),
  ADD KEY `FKr3seeiolgcv00dvcdrsif6slh` (`payment_id`);

--
-- Indexes for table `fin_budget`
--
ALTER TABLE `fin_budget`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK5ocht87mv0cdnp7le0u49iqu0` (`company_id`),
  ADD KEY `FKgdidbemm54jfiwk88pohdmly4` (`fiscal_year_id`),
  ADD KEY `FKnjk5rx7pri3xl5xa7f8jws5tj` (`org_id`);

--
-- Indexes for table `fin_budget_line`
--
ALTER TABLE `fin_budget_line`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKjnfn118rop46jnnla15pf2hh4` (`accounting_period_id`),
  ADD KEY `FKmreofeyllnef4v7c4p494yurh` (`budget_id`),
  ADD KEY `FKrjsghdfcfhlbe75d3ajvvnos` (`gl_account_id`);

--
-- Indexes for table `fin_fiscal_year`
--
ALTER TABLE `fin_fiscal_year`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_fin_fiscal_year_company_year` (`company_id`,`year`);

--
-- Indexes for table `fin_gl_account`
--
ALTER TABLE `fin_gl_account`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_fin_gl_account_company_code` (`company_id`,`code`);

--
-- Indexes for table `fin_invoice`
--
ALTER TABLE `fin_invoice`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKfxlw02fep048f3q84lhb6k2ik` (`document_no`),
  ADD KEY `FKpjcivvomes29ah6q8haeh8agp` (`business_partner_id`),
  ADD KEY `FKmmhgqqg6xrh5q3vsm0f24gee6` (`company_id`),
  ADD KEY `FK8rifybtm7iaooikye456jkivc` (`journal_entry_id`),
  ADD KEY `FKohetjml3vo4x6ox93wgwatjhk` (`org_id`),
  ADD KEY `FKngriw655kx842ulrpmw3dkx27` (`tax_rate_id`);

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
  ADD KEY `FKip8tiagjemmle0nuav4rqg1ga` (`invoice_id`),
  ADD KEY `FK1s1ea10ijeqp9ndd3ilbbngf5` (`tax_rate_id`);

--
-- Indexes for table `fin_journal_entry`
--
ALTER TABLE `fin_journal_entry`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKrawxmf2od0uepfttqpsabxmj7` (`document_no`),
  ADD KEY `FK9mlpmff4tnar5ja994usrxcng` (`accounting_period_id`),
  ADD KEY `FKbd7k5id9jrt5hgo5s6bexjd5a` (`company_id`),
  ADD KEY `FKi8ywrtvy0cf0atcy1vsqapk12` (`org_id`);

--
-- Indexes for table `fin_journal_line`
--
ALTER TABLE `fin_journal_line`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKdify2dgd8t4nlytexsrx4chk2` (`gl_account_id`),
  ADD KEY `FKrr0nrf4727l066ros5l715eua` (`journal_entry_id`);

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
-- Indexes for table `inv_inventory_adjustment`
--
ALTER TABLE `inv_inventory_adjustment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKpd9y7c2n5j21969x0w5d2g1qb` (`document_no`),
  ADD KEY `FKdx6qm648nmlrh870o4h8k7e4b` (`company_id`),
  ADD KEY `FKbasq0gcx30dqan307ah3yx72r` (`journal_entry_id`),
  ADD KEY `FK83v7t5hvl002ygea4fafki4s6` (`org_id`);

--
-- Indexes for table `inv_inventory_adjustment_line`
--
ALTER TABLE `inv_inventory_adjustment_line`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKa0tl973wc6yniwe2ka6y5fcor` (`adjustment_id`),
  ADD KEY `FK6wmbvyemwibrk8rnrawkebo7c` (`locator_id`),
  ADD KEY `FKlb193e3r7wqf6dfyp5h1hvtqh` (`product_id`);

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
  ADD KEY `FKa6hap1v8ijwo3y80oy6pewp24` (`company_id`),
  ADD KEY `FKk8hch4nxwbk305gmgkfecx0eb` (`locator_id`),
  ADD KEY `FKt04sf73hsbsuaetynmckn8hes` (`product_id`);

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
  ADD KEY `FKswnlipx49nlnt086bf1vqapqr` (`org_id`),
  ADD KEY `FKtqc6jwufpd7ns0sje52aswhxq` (`product_id`);

--
-- Indexes for table `mfg_bom_line`
--
ALTER TABLE `mfg_bom_line`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKbgtwxbwur6flk0p7fjit3tf8q` (`bom_id`),
  ADD KEY `FKjake8723tsq8g3gwch48jwfj5` (`component_product_id`);

--
-- Indexes for table `mfg_work_order`
--
ALTER TABLE `mfg_work_order`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKdu3nqyg111gpkxcj4n69oyqkt` (`document_no`),
  ADD KEY `FK9qo78dy83iwbaewf13hhlxoe8` (`bom_id`),
  ADD KEY `FK2fh6xc4w5xhctdy6asiogvle6` (`company_id`),
  ADD KEY `FKpmiui2kwcxmyik28pogalipvm` (`from_locator_id`),
  ADD KEY `FKcnocjkxfvbari3qrap8ej7tew` (`org_id`),
  ADD KEY `FK4gogj1cebv92wirrm3uqdp6mh` (`product_id`),
  ADD KEY `FKal618jxpl83l3kdrhonjhxyee` (`sales_order_line_bom_id`),
  ADD KEY `FKsq0m0w1tbvcuhwi2sd1i54m3l` (`to_locator_id`);

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
  ADD KEY `FK62ii83qpfkjg6775m1k6026m7` (`currency_id`),
  ADD KEY `FKoitm0dh0r6cusea2qm0a92j2r` (`department_id`),
  ADD KEY `FKkbmqo7mbaxjcjij8m3ey40d2n` (`employee_id`),
  ADD KEY `FKdogv0h7k1h4pbq9k2fq8uj09o` (`forwarding_warehouse_id`),
  ADD KEY `FKlg1w0td5jcgreo8v6o5541auw` (`org_id`),
  ADD KEY `FK7atiiaf46bylnk9v0idp8w6eb` (`price_list_version_id`);

--
-- Indexes for table `trx_sales_order_delivery_schedule`
--
ALTER TABLE `trx_sales_order_delivery_schedule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK6saenn5hcx525i504idif9qyr` (`sales_order_id`);

--
-- Indexes for table `trx_sales_order_line`
--
ALTER TABLE `trx_sales_order_line`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK4ff89h0u8k8j2k9g4shemvsq8` (`product_id`),
  ADD KEY `FKg4k1dueficok3fj8uql45y64b` (`sales_order_id`),
  ADD KEY `FK65ngcq7mhtkbp0c6de5w7j72y` (`uom_id`);

--
-- Indexes for table `trx_sales_order_line_bom`
--
ALTER TABLE `trx_sales_order_line_bom`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_trx_sol_bom_line` (`sales_order_line_id`);

--
-- Indexes for table `trx_sales_order_line_bom_line`
--
ALTER TABLE `trx_sales_order_line_bom_line`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK95nfq5ddy427nuwk1sk9742k6` (`component_product_id`),
  ADD KEY `FK1pt7myrmp5jx5x1rp44a181c9` (`sales_order_line_bom_id`);

--
-- Indexes for table `trx_sales_order_line_lookup`
--
ALTER TABLE `trx_sales_order_line_lookup`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `core_attachment`
--
ALTER TABLE `core_attachment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `core_company`
--
ALTER TABLE `core_company`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `core_document_sequence`
--
ALTER TABLE `core_document_sequence`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `core_org`
--
ALTER TABLE `core_org`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee_leave`
--
ALTER TABLE `employee_leave`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fin_accounting_period`
--
ALTER TABLE `fin_accounting_period`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fin_gl_account`
--
ALTER TABLE `fin_gl_account`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inv_inventory_adjustment_line`
--
ALTER TABLE `inv_inventory_adjustment_line`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inv_locator`
--
ALTER TABLE `inv_locator`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inv_movement`
--
ALTER TABLE `inv_movement`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inv_movement_line`
--
ALTER TABLE `inv_movement_line`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inv_onhand`
--
ALTER TABLE `inv_onhand`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inv_stock_txn`
--
ALTER TABLE `inv_stock_txn`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leaves`
--
ALTER TABLE `leaves`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `md_business_partner`
--
ALTER TABLE `md_business_partner`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `md_product`
--
ALTER TABLE `md_product`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `md_product_price`
--
ALTER TABLE `md_product_price`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `md_tax_rate`
--
ALTER TABLE `md_tax_rate`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `md_uom`
--
ALTER TABLE `md_uom`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `md_warehouse`
--
ALTER TABLE `md_warehouse`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `mfg_bom`
--
ALTER TABLE `mfg_bom`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mfg_bom_line`
--
ALTER TABLE `mfg_bom_line`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mfg_work_order`
--
ALTER TABLE `mfg_work_order`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payslips`
--
ALTER TABLE `payslips`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payslip_log`
--
ALTER TABLE `payslip_log`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `performance_reviews`
--
ALTER TABLE `performance_reviews`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `salary`
--
ALTER TABLE `salary`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trx_purchase_order`
--
ALTER TABLE `trx_purchase_order`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trx_purchase_order_line`
--
ALTER TABLE `trx_purchase_order_line`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trx_sales_order`
--
ALTER TABLE `trx_sales_order`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `trx_sales_order_delivery_schedule`
--
ALTER TABLE `trx_sales_order_delivery_schedule`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trx_sales_order_line`
--
ALTER TABLE `trx_sales_order_line`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `trx_sales_order_line_bom`
--
ALTER TABLE `trx_sales_order_line_bom`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `trx_sales_order_line_bom_line`
--
ALTER TABLE `trx_sales_order_line_bom_line`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `trx_sales_order_line_lookup`
--
ALTER TABLE `trx_sales_order_line_lookup`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

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
  ADD CONSTRAINT `FK5ic0sermyyhj7ipflahl3xun3` FOREIGN KEY (`fiscal_year_id`) REFERENCES `fin_fiscal_year` (`id`);

--
-- Constraints for table `fin_bank_account`
--
ALTER TABLE `fin_bank_account`
  ADD CONSTRAINT `FK12covf5nkasxmaedojxfmv1f6` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`),
  ADD CONSTRAINT `FKs4db4i7y80e7kc060ax55wd8` FOREIGN KEY (`gl_account_id`) REFERENCES `fin_gl_account` (`id`),
  ADD CONSTRAINT `FKt71k8w2tijjrlvjj3j4otnbep` FOREIGN KEY (`org_id`) REFERENCES `core_org` (`id`);

--
-- Constraints for table `fin_bank_statement`
--
ALTER TABLE `fin_bank_statement`
  ADD CONSTRAINT `FK8js2373ukpjp3vlhlq58p9ksd` FOREIGN KEY (`org_id`) REFERENCES `core_org` (`id`),
  ADD CONSTRAINT `FKaw8yauwdexc8ahrpvjrra29yn` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`),
  ADD CONSTRAINT `FKofrrwu728q08yyam64udy2wq0` FOREIGN KEY (`bank_account_id`) REFERENCES `fin_bank_account` (`id`);

--
-- Constraints for table `fin_bank_statement_line`
--
ALTER TABLE `fin_bank_statement_line`
  ADD CONSTRAINT `FK1praojujxdchx0c0qorwcacc1` FOREIGN KEY (`journal_entry_id`) REFERENCES `fin_journal_entry` (`id`),
  ADD CONSTRAINT `FKlatth8wpd8v39hy5acd1hlt8j` FOREIGN KEY (`bank_statement_id`) REFERENCES `fin_bank_statement` (`id`),
  ADD CONSTRAINT `FKr3seeiolgcv00dvcdrsif6slh` FOREIGN KEY (`payment_id`) REFERENCES `fin_payment` (`id`);

--
-- Constraints for table `fin_budget`
--
ALTER TABLE `fin_budget`
  ADD CONSTRAINT `FK5ocht87mv0cdnp7le0u49iqu0` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`),
  ADD CONSTRAINT `FKgdidbemm54jfiwk88pohdmly4` FOREIGN KEY (`fiscal_year_id`) REFERENCES `fin_fiscal_year` (`id`),
  ADD CONSTRAINT `FKnjk5rx7pri3xl5xa7f8jws5tj` FOREIGN KEY (`org_id`) REFERENCES `core_org` (`id`);

--
-- Constraints for table `fin_budget_line`
--
ALTER TABLE `fin_budget_line`
  ADD CONSTRAINT `FKjnfn118rop46jnnla15pf2hh4` FOREIGN KEY (`accounting_period_id`) REFERENCES `fin_accounting_period` (`id`),
  ADD CONSTRAINT `FKmreofeyllnef4v7c4p494yurh` FOREIGN KEY (`budget_id`) REFERENCES `fin_budget` (`id`),
  ADD CONSTRAINT `FKrjsghdfcfhlbe75d3ajvvnos` FOREIGN KEY (`gl_account_id`) REFERENCES `fin_gl_account` (`id`);

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
  ADD CONSTRAINT `FK1s1ea10ijeqp9ndd3ilbbngf5` FOREIGN KEY (`tax_rate_id`) REFERENCES `md_tax_rate` (`id`),
  ADD CONSTRAINT `FKip8tiagjemmle0nuav4rqg1ga` FOREIGN KEY (`invoice_id`) REFERENCES `fin_invoice` (`id`);

--
-- Constraints for table `fin_journal_entry`
--
ALTER TABLE `fin_journal_entry`
  ADD CONSTRAINT `FK9mlpmff4tnar5ja994usrxcng` FOREIGN KEY (`accounting_period_id`) REFERENCES `fin_accounting_period` (`id`),
  ADD CONSTRAINT `FKbd7k5id9jrt5hgo5s6bexjd5a` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`),
  ADD CONSTRAINT `FKi8ywrtvy0cf0atcy1vsqapk12` FOREIGN KEY (`org_id`) REFERENCES `core_org` (`id`);

--
-- Constraints for table `fin_journal_line`
--
ALTER TABLE `fin_journal_line`
  ADD CONSTRAINT `FKdify2dgd8t4nlytexsrx4chk2` FOREIGN KEY (`gl_account_id`) REFERENCES `fin_gl_account` (`id`),
  ADD CONSTRAINT `FKrr0nrf4727l066ros5l715eua` FOREIGN KEY (`journal_entry_id`) REFERENCES `fin_journal_entry` (`id`);

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
  ADD CONSTRAINT `FK83v7t5hvl002ygea4fafki4s6` FOREIGN KEY (`org_id`) REFERENCES `core_org` (`id`),
  ADD CONSTRAINT `FKbasq0gcx30dqan307ah3yx72r` FOREIGN KEY (`journal_entry_id`) REFERENCES `fin_journal_entry` (`id`),
  ADD CONSTRAINT `FKdx6qm648nmlrh870o4h8k7e4b` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`);

--
-- Constraints for table `inv_inventory_adjustment_line`
--
ALTER TABLE `inv_inventory_adjustment_line`
  ADD CONSTRAINT `FK6wmbvyemwibrk8rnrawkebo7c` FOREIGN KEY (`locator_id`) REFERENCES `inv_locator` (`id`),
  ADD CONSTRAINT `FKa0tl973wc6yniwe2ka6y5fcor` FOREIGN KEY (`adjustment_id`) REFERENCES `inv_inventory_adjustment` (`id`),
  ADD CONSTRAINT `FKlb193e3r7wqf6dfyp5h1hvtqh` FOREIGN KEY (`product_id`) REFERENCES `md_product` (`id`);

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
  ADD CONSTRAINT `FKa6hap1v8ijwo3y80oy6pewp24` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`),
  ADD CONSTRAINT `FKk8hch4nxwbk305gmgkfecx0eb` FOREIGN KEY (`locator_id`) REFERENCES `inv_locator` (`id`),
  ADD CONSTRAINT `FKt04sf73hsbsuaetynmckn8hes` FOREIGN KEY (`product_id`) REFERENCES `md_product` (`id`);

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
  ADD CONSTRAINT `FKbgtwxbwur6flk0p7fjit3tf8q` FOREIGN KEY (`bom_id`) REFERENCES `mfg_bom` (`id`),
  ADD CONSTRAINT `FKjake8723tsq8g3gwch48jwfj5` FOREIGN KEY (`component_product_id`) REFERENCES `md_product` (`id`);

--
-- Constraints for table `mfg_work_order`
--
ALTER TABLE `mfg_work_order`
  ADD CONSTRAINT `FK2fh6xc4w5xhctdy6asiogvle6` FOREIGN KEY (`company_id`) REFERENCES `core_company` (`id`),
  ADD CONSTRAINT `FK4gogj1cebv92wirrm3uqdp6mh` FOREIGN KEY (`product_id`) REFERENCES `md_product` (`id`),
  ADD CONSTRAINT `FK9qo78dy83iwbaewf13hhlxoe8` FOREIGN KEY (`bom_id`) REFERENCES `mfg_bom` (`id`),
  ADD CONSTRAINT `FKal618jxpl83l3kdrhonjhxyee` FOREIGN KEY (`sales_order_line_bom_id`) REFERENCES `trx_sales_order_line_bom` (`id`),
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
  ADD CONSTRAINT `FK62ii83qpfkjg6775m1k6026m7` FOREIGN KEY (`currency_id`) REFERENCES `md_currency` (`id`),
  ADD CONSTRAINT `FK7atiiaf46bylnk9v0idp8w6eb` FOREIGN KEY (`price_list_version_id`) REFERENCES `md_price_list_version` (`id`),
  ADD CONSTRAINT `FKdogv0h7k1h4pbq9k2fq8uj09o` FOREIGN KEY (`forwarding_warehouse_id`) REFERENCES `md_warehouse` (`id`),
  ADD CONSTRAINT `FKkbmqo7mbaxjcjij8m3ey40d2n` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `FKlg1w0td5jcgreo8v6o5541auw` FOREIGN KEY (`org_id`) REFERENCES `core_org` (`id`),
  ADD CONSTRAINT `FKoitm0dh0r6cusea2qm0a92j2r` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `FKpjnegga8t83kg6q37f9leqgr7` FOREIGN KEY (`business_partner_id`) REFERENCES `md_business_partner` (`id`);

--
-- Constraints for table `trx_sales_order_delivery_schedule`
--
ALTER TABLE `trx_sales_order_delivery_schedule`
  ADD CONSTRAINT `FK6saenn5hcx525i504idif9qyr` FOREIGN KEY (`sales_order_id`) REFERENCES `trx_sales_order` (`id`);

--
-- Constraints for table `trx_sales_order_line`
--
ALTER TABLE `trx_sales_order_line`
  ADD CONSTRAINT `FK4ff89h0u8k8j2k9g4shemvsq8` FOREIGN KEY (`product_id`) REFERENCES `md_product` (`id`),
  ADD CONSTRAINT `FK65ngcq7mhtkbp0c6de5w7j72y` FOREIGN KEY (`uom_id`) REFERENCES `md_uom` (`id`),
  ADD CONSTRAINT `FKg4k1dueficok3fj8uql45y64b` FOREIGN KEY (`sales_order_id`) REFERENCES `trx_sales_order` (`id`);

--
-- Constraints for table `trx_sales_order_line_bom`
--
ALTER TABLE `trx_sales_order_line_bom`
  ADD CONSTRAINT `FKp0wa24i5hd5t521ee2t4o6n1k` FOREIGN KEY (`sales_order_line_id`) REFERENCES `trx_sales_order_line` (`id`);

--
-- Constraints for table `trx_sales_order_line_bom_line`
--
ALTER TABLE `trx_sales_order_line_bom_line`
  ADD CONSTRAINT `FK1pt7myrmp5jx5x1rp44a181c9` FOREIGN KEY (`sales_order_line_bom_id`) REFERENCES `trx_sales_order_line_bom` (`id`),
  ADD CONSTRAINT `FK95nfq5ddy427nuwk1sk9742k6` FOREIGN KEY (`component_product_id`) REFERENCES `md_product` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `FKsbg59w8q63i0oo53rlgvlcnjq` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
