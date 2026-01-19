-- Disable foreign key checks to avoid ordering issues during bulk insert
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Departments
INSERT INTO departments (id, name) VALUES 
(1, 'HR'),
(2, 'Finance'),
(3, 'Engineering'),
(4, 'Sales'),
(5, 'Inventory');

-- 2. Users (Login Credentials)
-- Password is 'password' (BCrypt encoded: $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG)
INSERT INTO users (id, full_name, email, password, is_active, role, status, department_id) VALUES 
(1, 'Admin User', 'admin@test.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 1, 'ADMIN', 'ACTIVE', 1),
(2, 'HR Manager', 'hr@test.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 1, 'HR', 'ACTIVE', 1),
(3, 'Finance Manager', 'finance@test.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 1, 'FINANCE', 'ACTIVE', 2),
(4, 'Inventory Manager', 'inventory@test.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 1, 'INVENTORY', 'ACTIVE', 5);

-- 3. Employees (Workforce Data)
-- Password is 'password'
INSERT INTO employees (id, name, email, phone, role, department_id, is_active, password, base_salary, bonus, deduction, performance_rating, final_salary, performance_impact) VALUES
(1, 'John Doe', 'john@test.com', '1234567890', 'EMPLOYEE', 3, 1, '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 5000.00, 500.00, 100.00, 4.5, 5400.00, 0.0),
(2, 'Jane Smith', 'jane@test.com', '0987654321', 'EMPLOYEE', 4, 1, '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 4500.00, 400.00, 50.00, 4.0, 4850.00, 0.0),
(3, 'Bob Builder', 'bob@test.com', '1122334455', 'EMPLOYEE', 5, 1, '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 4000.00, 200.00, 0.00, 3.5, 4200.00, 0.0);

-- 4. Addresses
INSERT INTO addresses (id, street, city, state, postal_code, country, user_id) VALUES
(1, '123 Admin St', 'Jakarta', 'DKI', '10110', 'Indonesia', 1),
(2, '456 HR Ln', 'Bandung', 'Jawa Barat', '40115', 'Indonesia', 2);

-- 5. Attendance (Sample Data for April 2025)
INSERT INTO attendance (id, employee_id, date, status, present, remarks, overtime) VALUES
(1, 1, '2025-04-01', 'PRESENT', 1, 'On Time', 0),
(2, 1, '2025-04-02', 'PRESENT', 1, 'On Time', 0),
(3, 1, '2025-04-03', 'ABSENT', 0, 'Sick', 0),
(4, 2, '2025-04-01', 'PRESENT', 1, 'On Time', 0),
(5, 2, '2025-04-02', 'LEAVE', 0, 'Casual Leave', 0);

-- 6. Employee Leaves
INSERT INTO employee_leave (id, employee_id, leave_type, start_date, end_date, status, reason) VALUES
(1, 1, 'Sick Leave', '2025-04-03', '2025-04-03', 'APPROVED', 'Flu'),
(2, 2, 'Casual Leave', '2025-04-02', '2025-04-02', 'APPROVED', 'Personal Errand'),
(3, 3, 'Annual Leave', '2025-04-10', '2025-04-12', 'PENDING', 'Vacation');

-- 7. Performance Reviews
INSERT INTO performance_reviews (id, employee_id, review_date, performance_rating, comments) VALUES
(1, 1, '2025-03-31', 'Excellent', 'Exceeded expectations'),
(2, 2, '2025-03-31', 'Good', 'Met expectations');

-- 8. Salary (Historical Data for March 2025)
-- Note: approved_byhr=1 (true), forwarded_to_finance=1 (true), paid=1 (true) for John
INSERT INTO salary (id, employee_id, employee_name, department, month, base_salary, bonus, tax, deduction, present_days, leave_days, absent_days, final_salary, total_payable, approved_byhr, forwarded_to_finance, paid, date, performance_review_id) VALUES
(1, 1, 'John Doe', 'Engineering', '2025-03-01', 5000.00, 500.00, 200.00, 100.00, 20, 1, 1, 5200.00, 5200.00, 1, 1, 1, '2025-03-31', 1),
(2, 2, 'Jane Smith', 'Sales', '2025-03-01', 4500.00, 400.00, 150.00, 50.00, 21, 1, 0, 4700.00, 4700.00, 1, 1, 0, '2025-03-31', 2);

-- 9. Payslips
INSERT INTO payslips (id, employee_id, base_salary, bonus, deduction, total_payable, date_issued, status, download_url) VALUES
(1, 1, 5000.00, 500.00, 100.00, 5200.00, '2025-03-31', 'Generated', '/api/payslip/download/1');

-- 10. Payslip Logs
INSERT INTO payslip_log (id, employee_id, payslip_id, action, done_by, timestamp) VALUES
(1, 1, 1, 'GENERATED', 'hr@test.com', '2025-03-31 10:00:00');

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;