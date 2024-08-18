
# WhatsApp Bot v1.0 📱🤖

Welcome to the **WhatsApp Bot v1.0** project! This bot automates the process of validating residents' information and generating official documents via WhatsApp.

## 🚀 How to Run the Program

1. **Navigate** to the project directory:
   ```bash
   cd /path/to/your/project
   ```
2. **Install** dependencies:
   ```bash
   npm install
   npm update
   ```
3. **Start** the bot:
   ```bash
   node index.js
   ```

## 🧑‍💼 User Workflow

1. **NIK Validation**:
   - Users will be prompted to enter their **NIK** (National Identity Number) for validation.
2. **Service Selection**:
   - Upon successful validation, users will select the desired service from a menu.
3. **Submission**:
   - After selecting a service, users proceed with the application process.
4. **Additional Options or Logout**:
   - Once the submission is completed, users can choose additional options or log out.

## 🛠️ Admin Workflow

1. **Notification**:
   - The admin (**Ketua RT**) receives a notification when a user submits an application.
2. **Approval**:
   - The admin approves the application, triggering the generation of a letter with a unique letter number.

## 📂 Directory Structure

- **`data_warga.csv`**: 
  - Contains resident data in CSV format.
  - _Created manually with attributes like NAMA, NIK, JENIS KELAMIN, etc._
- **`sessions.json`**:
  - Stores login data for residents validated by NIK.
  - _Generated automatically by the system._
- **`submissions.json`**:
  - Tracks service requests to prevent spam (limited to 3 requests per day).
  - _Generated automatically by the system._
- **`submissions/`**:
  - Contains completed letters generated from `template.docx`.
  - _Generated automatically by the system._
- **`template.docx`**:
  - The letter template used for generating official documents.
  - _Created manually following the specified format._

## 🔍 Additional Information

- **Data Preparation**: 
  - Ensure that `data_warga.csv` is correctly populated with the required attributes.
- **Automatic Generation**: 
  - The system automatically generates `sessions.json` and `submissions.json`.
- **Document Storage**:
  - Generated letters are saved in the `submissions` folder, following the format specified in `template.docx`.

---
