<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WhatsApp Bot v1.0</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
            background-color: #f4f4f4;
        }
        h1 {
            color: #333;
        }
        h2 {
            color: #555;
        }
        code {
            background-color: #eee;
            padding: 2px 4px;
            border-radius: 4px;
        }
        pre {
            background-color: #eee;
            padding: 10px;
            border-radius: 4px;
            overflow-x: auto;
        }
        ul {
            list-style-type: none;
            padding-left: 0;
        }
        ul li {
            margin-bottom: 10px;
        }
        ul li::before {
            content: "• ";
            color: #555;
            margin-right: 5px;
        }
    </style>
</head>
<body>
    <h1>WhatsApp Bot v1.0 📱🤖</h1>
    <p>Welcome to the <strong>WhatsApp Bot v1.0</strong> project! This bot automates the process of validating residents' information and generating official documents via WhatsApp.</p>

    <h2>🚀 How to Run the Program</h2>
    <ol>
        <li><strong>Navigate</strong> to the project directory:</li>
        <pre><code>cd /path/to/your/project</code></pre>
        <li><strong>Install</strong> dependencies:</li>
        <pre><code>npm install<br>npm update</code></pre>
        <li><strong>Start</strong> the bot:</li>
        <pre><code>node index.js</code></pre>
    </ol>

    <h2>🧑‍💼 User Workflow</h2>
    <ul>
        <li><strong>NIK Validation</strong>: Users will be prompted to enter their <strong>NIK</strong> (National Identity Number) for validation.</li>
        <li><strong>Service Selection</strong>: Upon successful validation, users will select the desired service from a menu.</li>
        <li><strong>Submission</strong>: After selecting a service, users proceed with the application process.</li>
        <li><strong>Additional Options or Logout</strong>: Once the submission is completed, users can choose additional options or log out.</li>
    </ul>

    <h2>🛠️ Admin Workflow</h2>
    <ul>
        <li><strong>Notification</strong>: The admin (<strong>Ketua RT</strong>) receives a notification when a user submits an application.</li>
        <li><strong>Approval</strong>: The admin approves the application, triggering the generation of a letter with a unique letter number.</li>
    </ul>

    <h2>📂 Directory Structure</h2>
    <ul>
        <li><strong><code>data_warga.csv</code></strong>: 
            <ul>
                <li>Contains resident data in CSV format.</li>
                <li><em>Created manually with attributes like NAMA, NIK, JENIS KELAMIN, etc.</em></li>
            </ul>
        </li>
        <li><strong><code>sessions.json</code></strong>: 
            <ul>
                <li>Stores login data for residents validated by NIK.</li>
                <li><em>Generated automatically by the system.</em></li>
            </ul>
        </li>
        <li><strong><code>submissions.json</code></strong>: 
            <ul>
                <li>Tracks service requests to prevent spam (limited to 3 requests per day).</li>
                <li><em>Generated automatically by the system.</em></li>
            </ul>
        </li>
        <li><strong><code>submissions/</code></strong>: 
            <ul>
                <li>Contains completed letters generated from <code>template.docx</code>.</li>
                <li><em>Generated automatically by the system.</em></li>
            </ul>
        </li>
        <li><strong><code>template.docx</code></strong>: 
            <ul>
                <li>The letter template used for generating official documents.</li>
                <li><em>Created manually following the specified format.</em></li>
            </ul>
        </li>
    </ul>

    <h2>🔍 Additional Information</h2>
    <ul>
        <li><strong>Data Preparation</strong>: Ensure that <code>data_warga.csv</code> is correctly populated with the required attributes.</li>
        <li><strong>Automatic Generation</strong>: The system automatically generates <code>sessions.json</code> and <code>submissions.json</code>.</li>
        <li><strong>Document Storage</strong>: Generated letters are saved in the <code>submissions</code> folder, following the format specified in <code>template.docx</code>.</li>
    </ul>
</body>
</html>
