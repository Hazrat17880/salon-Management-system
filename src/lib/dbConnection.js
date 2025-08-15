// lib/db.js
import mysql from "mysql2/promise";

// Create a connection pool instead of a single connection for better performance
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Utility function to execute queries
export async function query(sql, params) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    connection.release();
  }
}

// Initialize the database (create table if not exists)
(async function initDB() {
  try {
    // ______________________________________AUTHENTICATION TABLES________________________________
    // use auth table
    await query(`
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  image VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  address VARCHAR(255),
  otp_code VARCHAR(10),
  otp_expires_at DATETIME,
  is_verified BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


    `);
  
    // slon table
    await query(`
    CREATE TABLE IF NOT EXISTS salons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  salon_name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  id_card VARCHAR(255),
  license VARCHAR(255),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  street_info VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(100),
 days VARCHAR(255),
  opening_hours VARCHAR(255),
  otp_code VARCHAR(10),
  otp_expires_at DATETIME,
  is_verified BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT FALSE,

  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

`)


//  _______________________________SALON TABLES _____________________________________
// table for salon services
await query(`
  CREATE TABLE IF NOT EXISTS salon_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    salon_id INT NOT NULL, -- FK to salon table
    main_category ENUM('male', 'female', 'unisex') NOT NULL,
    sub_category VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL, -- Detailed service title
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(5,2) DEFAULT 0.00, -- % discount
    special_days VARCHAR(255), 
    available_start_time TIME, 
    available_end_time TIME,   
    duration_minutes INT DEFAULT 30, 
    image_url VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE

);`)


// for favorite salon
await query(`
CREATE TABLE IF NOT EXISTS favorite_salon (
    id INT AUTO_INCREMENT PRIMARY KEY,
    salon_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

);

  `)
  await query(`
CREATE TABLE IF NOT EXISTS appointment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    salon_id INT NOT NULL,
    user_id INT NOT NULL,
    services_id INT NOT NULL,
    FOREIGN KEY (services_id) REFERENCES salon_services(id) ON DELETE CASCADE,
    FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

);

  `)


    console.log('Database initialized');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
})()