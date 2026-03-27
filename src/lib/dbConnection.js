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
  queueLimit: 0,
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

  password_hash VARCHAR(255) NULL,

  
  provider ENUM('credentials', 'google', 'facebook') 
    DEFAULT 'credentials',
  provider_id VARCHAR(255) NULL,

  phone_number VARCHAR(20),
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  address VARCHAR(255),


  otp_code VARCHAR(10),
  otp_expires_at DATETIME,

  is_verified BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
    ON UPDATE CURRENT_TIMESTAMP
);

    `);

    // slon table
    await query(`
CREATE TABLE IF NOT EXISTS salons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  salon_name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255) NOT NULL,

  stripe_account_id VARCHAR(255),
  stripe_onboarded BOOLEAN DEFAULT false,
  stripe_account_status VARCHAR(50) DEFAULT 'pending',

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
  image VARCHAR(255),
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`);

    //  admin auth

    await query(`
CREATE TABLE IF NOT EXISTS admin_auth (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  otp_code VARCHAR(10),
  otp_expires_at DATETIME,
  is_verified BOOLEAN DEFAULT true,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


    `);
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

);`);

    // review
    await query(`
  CREATE TABLE IF NOT EXISTS review (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    review TEXT NOT NULL,
    stars INT NOT NULL CHECK (stars >= 1 AND stars <= 5),
    user_id INT NOT NULL,
    salon_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE

  )
`);

    // staff
    await query(`
  CREATE TABLE IF NOT EXISTS staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,                -- Staff name
    position VARCHAR(100),                      -- Job title/role (e.g., Hair Stylist)
    email VARCHAR(255) UNIQUE,                  -- Optional contact email
    phone VARCHAR(20),                           -- Optional phone number
    bio TEXT,                                   -- Short description / biography
    image VARCHAR(255),                         -- Profile image
    salon_id INT NOT NULL,                      -- Salon reference
    status ENUM('active','inactive') DEFAULT 'active',  -- Staff status
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE
  )
`); 

    // for favorite salon
    await query(`
CREATE TABLE IF NOT EXISTS favorite_salon (
    id INT AUTO_INCREMENT PRIMARY KEY,
    salon_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

);

  `);
    // APPOINTEMENT
    await query(`
CREATE TABLE IF NOT EXISTS appointment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    salon_id INT NOT NULL,
    user_id INT NOT NULL,
    services_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    accept BOOLEAN DEFAULT false,
    appointment_status ENUM('pending', 'completed', 'rejected', 'accept') DEFAULT 'pending',
    user_view BOOLEAN DEFAULT false,
    salon_view BOOLEAN DEFAULT false,
    image VARCHAR(255), -- to store image URL or path
    FOREIGN KEY (services_id) REFERENCES salon_services(id) ON DELETE CASCADE,
    FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`);

    // converstion
    await query(`
  CREATE TABLE IF NOT EXISTS conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  salon_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);`);

    await query(`
  CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT NOT NULL,
  sender_type ENUM('user', 'salon') NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);`);

    // complaints

    await query(`
CREATE TABLE IF NOT EXISTS complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_about ENUM('salon', 'services') NOT NULL,
  description TEXT NOT NULL,
  salon_id INT NOT NULL,
  user_id INT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX (salon_id),
  INDEX (user_id),
  INDEX (is_read)
);
`);

    // ________________________________ FOR SLIDER _____________________________________
    await query(`
  CREATE TABLE IF NOT EXISTS sliders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`);
    // Add this to your existing initDB function
    await query(`
  CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_viewed BOOLEAN DEFAULT FALSE,
    viewed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (is_viewed),
    INDEX (created_at)
  );
`);
    console.log("Database initialized");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
})();
