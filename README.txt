
# WhatsApp Bot v1.0

## How to Run the Program

1. Navigate to the project directory.
2. Run `npm install` and `npm update`.
3. Start the bot with `node index.js`.

## User Workflow

1. **NIK Validation**: The user will be validated using their NIK.
2. **Service Selection**: If the NIK is correct, the user will be prompted to choose the service they want to apply for.
3. **Submission**: After selecting the service, the user will proceed with the application.
4. **Additional Options or Logout**: The user will then be presented with additional options or can choose to log out.

## Admin Workflow

1. **Notification**: The admin (Ketua RT) will receive a notification from the bot regarding the user's application.
2. **Approval**: The admin will approve the application to generate a letter with a unique letter number.

## Directory Structure

- `data_warga.csv`: Contains resident data in CSV format. [Created manually following the provided attributes]
- `sessions.json`: Stores login data of residents validated by NIK. [Generated automatically by the system]
- `submissions.json`: Tracks service requests to prevent spam, limited to 3 requests per day. [Generated automatically by the system]
- `submissions/`: Contains completed letters based on `template.docx`. [Generated automatically by the system]
- `template.docx`: The letter template. [Created manually following the specified format]

## Additional Information

- Ensure `data_warga.csv` is populated with the correct attributes.
- The system automatically generates `sessions.json` and `submissions.json`.
- Service request letters are generated using `template.docx` and stored in the `submissions` folder.

---
