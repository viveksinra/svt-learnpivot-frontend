import React, { forwardRef } from 'react';
import EmailMainCom from "@/app/Components/Common/Email/EmailMainCom";

const SendEmailCom = forwardRef((props, ref) => {
  const handleClear = () => {};

  const formatEmailData = (item, emailSubject, emailBody, attachmentUrls) => {
    const personalizedSubject = emailSubject
      .replace(/{name}/g, `${item.user.firstName} ${item.user.lastName}`)
      .replace(/{email}/g, item.user.email)
      .replace(/{childName}/g, item.childId.childName)
      .replace(/{setTitle}/g, item.paperSetId.setTitle)
      .replace(/{invoice}/g, item.invoiceNumber || '-');

    const personalizedBody = emailBody
      .replace(/{name}/g, `${item.user.firstName} ${item.user.lastName}`)
      .replace(/{email}/g, item.user.email)
      .replace(/{childName}/g, item.childId.childName)
      .replace(/{setTitle}/g, item.paperSetId.setTitle)
      .replace(/{invoice}/g, item.invoiceNumber || '-');

    return {
      to: [
        {
          email: item.user.email,
          name: `${item.user.firstName} ${item.user.lastName}`,
          id: item.user._id || null,
        },
      ],
      emailSubject: personalizedSubject,
      emailBody: personalizedBody,
      attachmentUrls,
    };
  };

  const subjectDynamicFields = ['{name}', '{email}', '{childName}', '{setTitle}', '{invoice}'];
  const bodyDynamicFields = ['{name}', '{email}', '{childName}', '{setTitle}', '{invoice}'];

  return (
    <EmailMainCom
      selectedItems={props.selectedItems}
      onClear={handleClear}
      title="Send Paper Email"
      subjectDynamicFields={subjectDynamicFields}
      bodyDynamicFields={bodyDynamicFields}
      formatEmailData={formatEmailData}
      ref={ref}
    />
  );
});

export default SendEmailCom;


