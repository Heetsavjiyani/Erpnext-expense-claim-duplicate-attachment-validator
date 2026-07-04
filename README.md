# Erpnext-expense-claim-duplicate-attachment-validator
An ERPNext customization that prevents duplicate file uploads in Expense Claims using Frappe's built-in MD5 content hash, custom validation, and enhanced user experience.
# ERPNext Expense Claim Duplicate Attachment Validator

## Overview
This project prevents duplicate image/file uploads in ERPNext Expense Claims by leveraging Frappe's built-in MD5 content hashing (`content_hash`). If an identical file has already been attached to another Expense Claim, the upload is blocked and the user is informed where the file already exists.

## Features
- Prevents duplicate attachments
- Uses Frappe's built-in MD5 hash
- Fast database lookup
- No file comparison required
- User-friendly validation message
- Lightweight and easy to implement

## Technologies
- ERPNext
- Frappe Framework
- Python (Server Script)
- JavaScript (Client Script)

## Screenshots
(Add your screenshots here)

## Installation
1. Create the Client Script in ERPNext.
2. Create the Server Script in ERPNext.
3. Copy the code from this repository.
4. Save and test by uploading the same file twice.

## How It Works
Frappe automatically generates an MD5 hash (`content_hash`) for every uploaded file. The Server Script checks whether another file with the same hash is already attached to an Expense Claim. If found, the upload is cancelled and an error message displays the existing Expense Claim reference.

## Author
Heet Savjiyani

## License
MIT
