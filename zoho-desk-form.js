// Zoho Desk Form JavaScript
// All inline scripts moved to this file for security (CSP compliance)

window.addEventListener('pageshow', function () {
  const submitButton = document.getElementById('submitButton');
  if (submitButton) {
    submitButton.removeAttribute('disabled');
  }
});

function trimBoth(str) {
  return jQuery.trim(str);
}

var zsWebFormMandatoryFields = new Array('Contact Name', 'Email', 'Subject', 'Category', 'Description');
var zsFieldsDisplayLabelArray = new Array('Organization', 'Email', 'Subject', 'Category', 'Description');

function reformatAllDateFields() {
  const dateFields = document.querySelectorAll('.dob-field');
  dateFields.forEach((field) => {
    if (field.value && field.value.includes('-')) {
      const parts = field.value.split('-');
      if (parts.length === 3) {
        const [yyyy, mm, dd] = parts;
        field.type = 'text';
        field.value = `${dd}/${mm}/${yyyy}`;
      }
    }
  });
}

function zsValidateMandatoryFields() {
  var name = '';
  var email = '';
  var isError = 0;
  for (var index = 0; index < zsWebFormMandatoryFields.length; index++) {
    isError = 0;
    var fieldObject = document.forms['zsWebToCase_1176583000000529295'][zsWebFormMandatoryFields[index]];
    if (fieldObject) {
      if (fieldObject.value.replace(/^\s+|\s+$/g, '').length == 0) {
        alert(zsFieldsDisplayLabelArray[index] + ' cannot be empty ');
        fieldObject.focus();
        isError = 1;
        return false;
      } else {
        if (fieldObject.name == 'Email') {
          if (
            !fieldObject.value.match(
              /^([\w_][\w\-_.+\'&]*)@(?=.{4,256}$)(([\w]+)([\-_]*[\w])*[\.])+[a-zA-Z]{2,22}$/,
            )
          ) {
            isError = 1;
            alert('Enter a valid email-Id');
            fieldObject.focus();
            return false;
          }
        }
      }
      if (fieldObject.nodeName == 'SELECT') {
        if (fieldObject.options[fieldObject.selectedIndex].value == '-None-') {
          alert(zsFieldsDisplayLabelArray[index] + ' cannot be none');
          fieldObject.focus();
          isError = 1;
          return false;
        }
      }
      if (fieldObject.type == 'checkbox') {
        if (fieldObject.checked == false) {
          alert('Please accept ' + zsFieldsDisplayLabelArray[index]);
          fieldObject.focus();
          isError = 1;
          return false;
        }
      }
    }
  }
  if (isError == 0) {
    reformatAllDateFields();

    // Disable submit button to prevent double submission
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    // Setup iframe load listener for successful submission
    const iframe = document.getElementById('zoho-submit-frame');
    iframe.onload = function () {
      // Show success message
      document.getElementById('zsWebToCase_1176583000000529295').style.display = 'none';
      document.getElementById('successMessage').style.display = 'block';
    };
  }

  return isError == 0;
}

var ZSEncoder = {
  encodeForHTML: function (str) {
    if (str && typeof str === 'string') {
      return jQuery.encoder.encodeForHTML(str);
    }
    return str;
  },
  encodeForHTMLAttribute: function (str) {
    if (str && typeof str === 'string') {
      return jQuery.encoder.encodeForHTMLAttribute(str);
    }
    return str;
  },
  encodeForJavascript: function (str) {
    if (str && typeof str === 'string') {
      return jQuery.encoder.encodeForJavascript(str);
    }
    return str;
  },
  encodeForCSS: function (str) {
    if (str && typeof str === 'string') {
      return jQuery.encoder.encodeForCSS(str);
    }
    return str;
  },
};

var zsAttachedAttachmentsCount = 0;
var zsAllowedAttachmentLimit = 4;
var zsAttachmentFileBrowserIdsList = [1, 2, 3, 4, 5];

function zsOpenFileBrowseAttachment(clickEvent) {
  if (zsAttachedAttachmentsCount >= 5) {
    clickEvent.preventDefault();
  }
}

function zsRenderBrowseFileAttachment(zsAttachmentObject, zsAttachmentDetails) {
  if (zsAttachmentObject != '') {
    if (zsAttachmentDetails.files && zsAttachmentDetails.files[0].size / (1024 * 1024) > 20) {
      zsAttachmentDetails.value = '';
      alert('Maximum allowed file size is 20MB.');
      return;
    }
    if (zsAttachedAttachmentsCount < 5) {
      var zsFileName = '';
      if (zsAttachmentObject.indexOf('\\') > -1) {
        var zsAttachmentDataSplits = zsAttachmentObject.split('\\');
        var zsAttachmentDataSplitsLen = zsAttachmentDataSplits.length;
        zsFileName = zsAttachmentDataSplits[zsAttachmentDataSplitsLen - 1];
      } else {
        zsFileName = zsAttachmentObject;
      }
      var extension = zsFileName.split('.').pop().toLowerCase();
      var unSupportedExtensions = [
        'ade',
        'adp',
        'apk',
        'appx',
        'appxbundle',
        'bat',
        'cab',
        'cer',
        'chm',
        'cmd',
        'com',
        'cpl',
        'dll',
        'dmg',
        'exe',
        'hlp',
        'hta',
        'ins',
        'iso',
        'isp',
        'jar',
        'js',
        'jse',
        'lnk',
        'mde',
        'msc',
        'msi',
        'msix',
        'msixbundle',
        'msp',
        'mst',
        'nsh',
        'pif',
        'ps1',
        'pst',
        'reg',
        'scr',
        'sct',
        'shb',
        'sys',
        'tmp',
        'url',
        'vb',
        'vbe',
        'vbs',
        'vxd',
        'wsc',
        'wsf',
        'wsh',
        'terminal',
      ];
      if (unSupportedExtensions.indexOf(extension) != -1) {
        alert("The file wasn't attached since its extension is not supported.");
        return;
      }
      var zsCurrentAttachmentIdTokens = jQuery(zsAttachmentDetails).attr('id').split('_');
      var zsCurrentAttachmentId = parseInt(zsCurrentAttachmentIdTokens[1]);
      var zsAttachmentIdToBeRemoved = jQuery.inArray(zsCurrentAttachmentId, zsAttachmentFileBrowserIdsList);
      zsAttachmentFileBrowserIdsList.splice(zsAttachmentIdToBeRemoved, 1);
      var zsNextAttachmentId = zsAttachmentFileBrowserIdsList[0];
      var zsnextAttachment = 'zsattachment_' + zsNextAttachmentId;
      jQuery('#zsattachment_' + zsCurrentAttachmentId).hide();
      jQuery('#' + zsnextAttachment).show();
      jQuery('#zsFileBrowseAttachments').append(
        '<div class="filenamecls zsFontClass" id="file_' +
          zsCurrentAttachmentId +
          '">' +
          ZSEncoder.encodeForHTML(zsFileName) +
          '<a class="zsfilebrowseAttachment" style="margin-left:10px;" href="javascript:;" id="fileclose_' +
          zsCurrentAttachmentId +
          '">X</a></div>',
      );
      zsAttachedAttachmentsCount = zsAttachedAttachmentsCount + 1;
    }
  }
  zsChangeMousePointer();
}

jQuery(document).off('click.fba').on('click.fba', '.zsfilebrowseAttachment', function () {
  var currentlyDeletedElement = jQuery(this).attr('id').split('_')[1];
  jQuery('#zsattachment_' + currentlyDeletedElement).val('');
  jQuery('#zsattachment_' + currentlyDeletedElement).replaceWith(
    jQuery('#zsattachment_' + currentlyDeletedElement).clone(),
  );
  jQuery(this).parent().remove();
  zsAttachedAttachmentsCount = zsAttachedAttachmentsCount - 1;
  zsAttachmentFileBrowserIdsList.push(parseInt(currentlyDeletedElement));
  zsRearrangeFileBrowseAttachments();
  zsChangeMousePointer();
});

function zsRearrangeFileBrowseAttachments() {
  jQuery.each(jQuery('input[type = file]'), function (fileIndex, fileObject) {
    fileIndex = fileIndex + 1;
    if (fileIndex == zsAttachmentFileBrowserIdsList[0]) {
      jQuery('#zsattachment_' + fileIndex).show();
    } else {
      jQuery('#zsattachment_' + fileIndex).hide();
    }
  });
}

function zsChangeMousePointer() {
  if (zsAttachedAttachmentsCount >= 5) {
    jQuery('#zsMaxLimitMessage').show();
    jQuery('#zsattachment_1,#zsattachment_2,#zsattachment_3,#zsattachment_4,#zsattachment_5').hide();
    jQuery('#zsBrowseAttachment').css('cursor', 'default');
  } else {
    jQuery('#zsMaxLimitMessage').hide();
    zsRearrangeFileBrowseAttachments();
    jQuery('#zsBrowseAttachment').css('cursor', 'pointer');
  }
}

document.addEventListener('readystatechange', function () {
  if (document.readyState === 'complete' && window.zsRegenerateCaptcha) {
    zsRegenerateCaptcha();
  }
  const submitButton = document.getElementById('submitButton');
  if (submitButton) {
    submitButton.removeAttribute('disabled');
  }
  zsAttachedAttachmentsCount = 0;
  zsAttachmentFileBrowserIdsList = [1, 2, 3, 4, 5];
  jQuery('#zsFileBrowseAttachments').html('');
  jQuery.each(jQuery('input[type = file]'), function (fileIndex, fileObject) {
    var zsAttachmentId = jQuery(fileObject).attr('id');
    var zsAttachmentNo = zsAttachmentId.split('_')[1];
    var zsAttachedFile = jQuery('#zsattachment_' + zsAttachmentNo);
    if (zsAttachedFile[0] != undefined && zsAttachedFile[0].files[0] != undefined) {
      var zsFileBrowserAttachmentHtml = '';
      zsAttachedFileName = zsAttachedFile[0].files[0].name;
      zsFileBrowserAttachmentHtml =
        '<div class="filenamecls zsFontClass" id="file_' +
        zsAttachmentNo +
        '">' +
        ZSEncoder.encodeForHTML(zsAttachedFileName) +
        '<a class="zsfilebrowseAttachment" style="margin-left:10px" href="javascript:;" id="fileclose_' +
        zsAttachmentNo +
        '">X</a></div>';
      jQuery('#zsFileBrowseAttachments').append(zsFileBrowserAttachmentHtml);
      zsAttachedAttachmentsCount = zsAttachedAttachmentsCount + 1;
      var zsAttachmentIdToBeRemoved = jQuery.inArray(parseInt(zsAttachmentNo), zsAttachmentFileBrowserIdsList);
      zsAttachmentFileBrowserIdsList.splice(zsAttachmentIdToBeRemoved, 1);
    }
  });
  if (document.forms['zsWebToCase_1176583000000529295']['zsCloudPickerAttachments'] != undefined) {
    var zsCloudAttachments = jQuery.parseJSON(
      document.forms['zsWebToCase_1176583000000529295']['zsCloudPickerAttachments'].value,
    );
    zsRenderCloudAttachments(zsCloudAttachments);
  }
  zsRearrangeFileBrowseAttachments();
  zsChangeMousePointer();
});

function zsResetWebForm(webFormId) {
  document.forms['zsWebToCase_' + webFormId].reset();
  const submitButton = document.getElementById('submitButton');
  if (submitButton) {
    submitButton.removeAttribute('disabled');
  }
  zsAttachedAttachmentsCount = 0;
  zsAttachmentFileBrowserIdsList = [1, 2, 3, 4, 5];
  jQuery('#zsFileBrowseAttachments').html('');
  zsCloudPickerJSON = {};
  if (document.forms['zsWebToCase_1176583000000529295']['zsCloudPickerAttachments'] != undefined) {
    document.forms['zsWebToCase_1176583000000529295']['zsCloudPickerAttachments'].value = JSON.stringify({});
  }
  zsRearrangeFileBrowseAttachments();
  zsChangeMousePointer();
}

// Auto-fill form if data is passed from parent
window.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'prefillForm') {
    const data = event.data.payload;
    if (data.email) document.getElementById('email').value = data.email;
    if (data.firstName) document.getElementById('firstName').value = data.firstName;
    if (data.organizationName) document.getElementById('contactName').value = data.organizationName;
  }
});

// Notify parent when form is loaded
if (window.parent !== window) {
  window.parent.postMessage({ type: 'zohoDeskFormLoaded' }, '*');
}

// Initialize event handlers when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  // Form submit handler
  const form = document.getElementById('zsWebToCase_1176583000000529295');
  if (form) {
    form.addEventListener('submit', function (e) {
      // replica: the form never posts to desk.zoho.com. Same validation, then the built-in success flow without any network request.
      e.preventDefault();
      if (!zsValidateMandatoryFields()) {
        return false;
      }
      const frame = document.getElementById('zoho-submit-frame');
      if (frame) frame.onload = null;
      document.getElementById('zsWebToCase_1176583000000529295').style.display = 'none';
      document.getElementById('successMessage').style.display = 'block';
      return false;
    });

    // replica: prefill the same values the live app passes in (Organization + Email) when the fields are still empty
    const contactNameField = document.getElementById('contactName');
    if (contactNameField && !contactNameField.value) contactNameField.value = 'PDS (Peak Dental Services)';
    const emailField = document.getElementById('email');
    if (emailField && !emailField.value) emailField.value = 'pds.dso.demo@zentist.io';
  }

  // Reset button handler
  const resetButton = document.querySelector('.btn-reset');
  if (resetButton) {
    resetButton.addEventListener('click', function () {
      zsResetWebForm('1176583000000529295');
    });
  }

  // File input handlers
  const attachmentInputs = [
    'zsattachment_1',
    'zsattachment_2',
    'zsattachment_3',
    'zsattachment_4',
    'zsattachment_5',
  ];

  attachmentInputs.forEach(function (inputId) {
    const input = document.getElementById(inputId);
    if (input) {
      input.addEventListener('click', function (e) {
        zsOpenFileBrowseAttachment(e);
      });

      input.addEventListener('change', function () {
        zsRenderBrowseFileAttachment(this.value, this);
      });
    }
  });
});
