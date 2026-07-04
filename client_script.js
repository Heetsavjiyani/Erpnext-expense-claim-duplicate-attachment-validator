frappe.ui.form.on('Expense Claim', {
    refresh: function(frm) {
        setTimeout(function() {

            // Block auto-save on UPLOAD for Expense Claim only
            frappe.ui.form.ControlAttach.prototype.on_upload_complete = async function(attachment) {
                if (this.frm && this.frm.doctype === 'Expense Claim') {
                    await this.parse_validate_and_set_in_model(attachment.file_url);
                    this.frm.attachments.update_attachment(attachment);
                    this.frm.dirty();
                } else {
                    await this.parse_validate_and_set_in_model(attachment.file_url);
                    if (this.frm) {
                        this.frm.attachments.update_attachment(attachment);
                        this.frm.doc.docstatus == 1 ? this.frm.save("Update") : this.frm.save();
                    }
                }
                this.set_value(attachment.file_url);
            };

            // Block auto-save on REMOVE for Expense Claim only
            frappe.ui.form.ControlAttach.prototype.clear_attachment = function() {
                let me = this;
                if (this.frm) {
                    if (this.frm.doctype === 'Expense Claim') {
                        me.parse_validate_and_set_in_model(null);
                        me.refresh();
                        me.frm.attachments.remove_attachment_by_filename(me.value, async () => {
                            await me.parse_validate_and_set_in_model(null);
                            me.refresh();
                            me.frm.dirty();
                        });
                    } else {
                        me.parse_validate_and_set_in_model(null);
                        me.refresh();
                        me.frm.attachments.remove_attachment_by_filename(me.value, async () => {
                            await me.parse_validate_and_set_in_model(null);
                            me.refresh();
                            me.frm.doc.docstatus == 1 ? me.frm.save("Update") : me.frm.save();
                        });
                    }
                } else {
                    this.dataurl = null;
                    this.fileobj = null;
                    this.set_input(null);
                    this.parse_validate_and_set_in_model(null);
                    this.refresh();
                }
            };

            // Watch upload dialog DOM and replace ugly error with clean message
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                            const errorDiv = node.querySelector
                                ? node.querySelector('.file-upload-error, .upload-error, [class*="error"]')
                                : null;
                            if (errorDiv && errorDiv.innerText && errorDiv.innerText.toLowerCase().includes('already attached')) {
                                errorDiv.innerText = 'Duplicate attachment not allowed.';
                            }
                            if (node.innerText && node.innerText.toLowerCase().includes('already attached')) {
                                node.innerText = 'Duplicate attachment not allowed.';
                            }
                        }
                    });

                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        const allErrorNodes = document.querySelectorAll('.file-upload-error, .upload-error, [class*="error"]');
                        allErrorNodes.forEach(function(el) {
                            if (el.innerText && el.innerText.toLowerCase().includes('already attached')) {
                                el.innerText = 'Duplicate attachment not allowed.';
                            }
                        });
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });

        }, 1000);
    },

    validate: function(frm) {
        // Replace Frappe's default mandatory message with custom message
        frm.doc.expenses && frm.doc.expenses.forEach(function(row) {
            if (!row.custom_attach_pdf) {
                frappe.throw(__("Attachment 1 is mandatory. Please upload it to proceed."));
            }
        });

        // Secondary attachments without primary attachment
        let has_secondary_attachments = frm.doc.custom_attachment_2 ||
                                        frm.doc.custom_attachment_3 ||
                                        frm.doc.custom_attachment_4 ||
                                        frm.doc.custom_attachment_5;

        if (has_secondary_attachments && !frm.doc.custom_attach_pdf) {
            frappe.throw(__("Attachment 1 is mandatory. Please upload it to proceed."));
        }
    }
});
