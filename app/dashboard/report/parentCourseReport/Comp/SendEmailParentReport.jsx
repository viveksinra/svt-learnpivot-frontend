import React, { forwardRef } from 'react';
import EmailMainCom from "@/app/Components/Common/Email/EmailMainCom";

const SendEmailParentReport = forwardRef((props, ref) => {
    const handleClear = () => {
        if (props.setId) {
            props.setId("");
        }
    };

    // Format email data with replacements for dynamic fields
    const formatEmailData = (item, emailSubject, emailBody, attachmentUrls) => {
        const personalizedSubject = emailSubject
            .replace(/{name}/g, `${item.user?.firstName || ''} ${item.user?.lastName || ''}`.trim())
            .replace(/{email}/g, item.user?.email || '')
            .replace(/{childName}/g, item.childId?.childName || 'Student')
            .replace(/{courseTitle}/g, item.courseId?.courseTitle || '');

        const personalizedBody = emailBody
            .replace(/{name}/g, `${item.user?.firstName || ''} ${item.user?.lastName || ''}`.trim())
            .replace(/{email}/g, item.user?.email || '')
            .replace(/{childName}/g, item.childId?.childName || 'Student')
            .replace(/{courseTitle}/g, item.courseId?.courseTitle || '');

        return {
            to: [{
                email: item.user.email,
                name: `${item.user.firstName} ${item.user.lastName}`,
                id: item.user._id || null,
            }],
            emailSubject: personalizedSubject,
            emailBody: personalizedBody,
            attachmentUrls,
        };
    };

    const subjectDynamicFields = ['{name}', '{email}', '{childName}', '{courseTitle}'];
    const bodyDynamicFields = ['{name}', '{email}', '{childName}', '{courseTitle}'];

    return (
        <EmailMainCom
            selectedItems={props.selectedItems}
            onClear={handleClear}
            title="Send Parent Report Email"
            subjectDynamicFields={subjectDynamicFields}
            bodyDynamicFields={bodyDynamicFields}
            formatEmailData={formatEmailData}
            ref={ref}
        />
    );
});

export default SendEmailParentReport;
