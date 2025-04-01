import React, { forwardRef } from 'react';
import EmailMainCom from "@/app/Components/Common/Email/EmailMainCom";

const SendEmailCom = forwardRef((props, ref) => {
    const handleClear = () => {
        if (props.setId) {
            props.setId("");
        }
    };

    // Format batch dates for mock test
    const formatBatchDates = (selectedBatch) => {
        if (!selectedBatch) return '';
        const date = new Date(selectedBatch.date);
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        return `${formattedDate} (${selectedBatch.startTime} - ${selectedBatch.endTime})`;
    };

    // Format email data with replacements for dynamic fields
    const formatEmailData = (item, emailSubject, emailBody, attachmentUrls) => {
        const batchDates = formatBatchDates(item.selectedBatch);
        
        const personalizedSubject = emailSubject
            .replace(/{name}/g, `${item.user.firstName} ${item.user.lastName}`)
            .replace(/{email}/g, item.user.email)
            .replace(/{childName}/g, item.childId.childName)
            .replace(/{batchDates}/g, batchDates)
            .replace(/{mockTitle}/g, item.mockTestId.mockTestTitle);

        const personalizedBody = emailBody
            .replace(/{name}/g, `${item.user.firstName} ${item.user.lastName}`)
            .replace(/{email}/g, item.user.email)
            .replace(/{childName}/g, item.childId.childName)
            .replace(/{batchDates}/g, batchDates)
            .replace(/{mockTitle}/g, item.mockTestId.mockTestTitle);

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

    const subjectDynamicFields = ['{name}', '{email}', '{childName}', '{batchDates}', '{mockTitle}'];
    const bodyDynamicFields = ['{name}', '{email}', '{childName}', '{batchDates}', '{mockTitle}'];

    return (
        <EmailMainCom
            selectedItems={props.selectedItems}
            onClear={handleClear}
            title="Send Mock Test Email"
            subjectDynamicFields={subjectDynamicFields}
            bodyDynamicFields={bodyDynamicFields}
            formatEmailData={formatEmailData}
            ref={ref}
        />
    );
});

export default SendEmailCom;
