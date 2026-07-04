if doc.attached_to_doctype == "Expense Claim" and doc.content_hash:

    # Search for an existing file with the same MD5 content hash.
    existing = frappe.db.get_value(
        "File",
        {
            "content_hash": doc.content_hash,
            "attached_to_doctype": "Expense Claim"
        },
        "attached_to_name"
    )

    # Stop the upload if an identical file already exists.
    if existing:
        frappe.throw(
            f"Upload Failed: This image is already attached to <b>{existing}</b>."
        )
