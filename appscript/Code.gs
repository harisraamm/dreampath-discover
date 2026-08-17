/**
 * ======================================================
 * DREAMPATH DISCOVER
 * GOOGLE APPS SCRIPT WEB APP
 * ======================================================
 */


// ======================================================
// GOOGLE SHEET ID
// ======================================================

const SPREADSHEET_ID =
  '1OtFy8bpEMwlFjWOUfiZYr90R__ENucWuFRWM_3QCRZk';


// ======================================================
// POST REQUEST
// ======================================================

function doPost(e) {

  try {

    // ----------------------------------------------
    // CHECK INCOMING REQUEST
    // ----------------------------------------------

    if (
      !e ||
      !e.postData ||
      !e.postData.contents
    ) {

      throw new Error(
        'No form data received.'
      );

    }


    // ----------------------------------------------
    // PARSE JSON
    // ----------------------------------------------

    const data =
      JSON.parse(
        e.postData.contents
      );


    // ----------------------------------------------
    // OPEN GOOGLE SPREADSHEET
    // ----------------------------------------------

    const spreadsheet =
      SpreadsheetApp.openById(
        SPREADSHEET_ID
      );


    // ----------------------------------------------
    // DETERMINE FORM TYPE
    // ----------------------------------------------

    const type =
      data.type || 'booking';


    // ----------------------------------------------
    // DETERMINE SHEET NAME
    // ----------------------------------------------

    const tabName =
      sheetName_(type);


    // ----------------------------------------------
    // FIND SHEET
    // ----------------------------------------------

    let sheet =
      spreadsheet.getSheetByName(
        tabName
      );


    // ----------------------------------------------
    // CREATE SHEET IF IT DOESN'T EXIST
    // ----------------------------------------------

    if (!sheet) {

      sheet =
        spreadsheet.insertSheet(
          tabName
        );

    }


    // ----------------------------------------------
    // GET CORRECT HEADERS
    // ----------------------------------------------

    const headers =
      headers_(type);


    // ----------------------------------------------
    // ADD HEADERS TO EMPTY SHEET
    // ----------------------------------------------

    if (
      sheet.getLastRow() === 0
    ) {

      sheet.appendRow(
        headers
      );

    }


    // ----------------------------------------------
    // BUILD ROW
    // ----------------------------------------------

    const row =
      headers.map(
        header => {

          // ----------------------------------------
          // TIMESTAMP
          // ----------------------------------------

          if (
            header === 'Submitted at'
          ) {

            return new Date();

          }


          // ----------------------------------------
          // GET FORM FIELD KEY
          // ----------------------------------------

          const key =
            key_(header);


          // ----------------------------------------
          // RETURN FORM VALUE
          // ----------------------------------------

          return (
            data[key] !== undefined &&
            data[key] !== null
          )
            ? data[key]
            : '';

        }
      );


    // ----------------------------------------------
    // SAVE ENQUIRY
    // ----------------------------------------------

    sheet.appendRow(
      row
    );


    // ----------------------------------------------
    // FORMAT TIMESTAMP
    // ----------------------------------------------

    const lastRow =
      sheet.getLastRow();


    sheet
      .getRange(
        lastRow,
        1
      )
      .setNumberFormat(
        'dd/MM/yyyy HH:mm:ss'
      );


    // ----------------------------------------------
    // RETURN SUCCESS
    // ----------------------------------------------

    return json_({

      ok: true,

      message:
        'Enquiry submitted successfully.'

    });


  } catch (error) {

    console.error(
      error
    );


    return json_({

      ok: false,

      error:
        error.message

    });

  }

}


// ======================================================
// GET REQUEST
// ======================================================

function doGet(e) {

  try {

    // ----------------------------------------------
    // CHECK REQUESTED ACTION
    // ----------------------------------------------

    const action =
      e &&
      e.parameter &&
      e.parameter.action
        ? e.parameter.action
        : 'status';


    // ----------------------------------------------
    // RETURN FEEDBACK
    // ----------------------------------------------

    if (
      action === 'feedback' ||
      action === 'getFeedback'
    ) {

      return getFeedback_();

    }


    // ----------------------------------------------
    // DEFAULT STATUS RESPONSE
    // ----------------------------------------------

    return json_({

      ok: true,

      service:
        'Dreampath Discover Forms',

      message:
        'Google Apps Script Web App is working.'

    });


  } catch (error) {

    return json_({

      ok: false,

      error:
        error.message

    });

  }

}


// ======================================================
// GET FEEDBACK FROM GOOGLE SHEET
// ======================================================

function getFeedback_() {

  try {

    // ----------------------------------------------
    // OPEN SPREADSHEET
    // ----------------------------------------------

    const spreadsheet =
      SpreadsheetApp.openById(
        SPREADSHEET_ID
      );


    // ----------------------------------------------
    // FIND FEEDBACK SHEET
    // ----------------------------------------------

    const sheet =
      spreadsheet.getSheetByName(
        'Feedback'
      );


    // ----------------------------------------------
    // NO FEEDBACK SHEET
    // ----------------------------------------------

    if (!sheet) {

      return json_({

        ok: true,

        feedback: []

      });

    }


    // ----------------------------------------------
    // GET LAST ROW
    // ----------------------------------------------

    const lastRow =
      sheet.getLastRow();


    // ----------------------------------------------
    // ONLY HEADER OR EMPTY
    // ----------------------------------------------

    if (
      lastRow <= 1
    ) {

      return json_({

        ok: true,

        feedback: []

      });

    }


    // ----------------------------------------------
    // GET LAST COLUMN
    // ----------------------------------------------

    const lastColumn =
      sheet.getLastColumn();


    // ----------------------------------------------
    // READ SHEET DATA
    // ----------------------------------------------

    const values =
      sheet
        .getRange(
          1,
          1,
          lastRow,
          lastColumn
        )
        .getValues();


    // ----------------------------------------------
    // GET HEADERS
    // ----------------------------------------------

    const headers =
      values[0];


    // ----------------------------------------------
    // CONVERT ROWS TO OBJECTS
    // ----------------------------------------------

    const feedback =
      values
        .slice(1)
        .map(
          row => {

            const item = {};


            headers.forEach(
              (
                header,
                index
              ) => {

                let value =
                  row[index];


                // --------------------------------
                // FORMAT DATE
                // --------------------------------

                if (
                  value instanceof Date
                ) {

                  value =
                    Utilities.formatDate(
                      value,
                      Session.getScriptTimeZone(),
                      'dd MMM yyyy'
                    );

                }


                item[header] =
                  value;

              }
            );


            return item;

          }
        )
        .filter(
          item => {

            return (
              item['Name'] &&
              item['Message']
            );

          }
        )
        .reverse();


    // ----------------------------------------------
    // RETURN FEEDBACK
    // ----------------------------------------------

    return json_({

      ok: true,

      feedback:
        feedback

    });


  } catch (error) {

    return json_({

      ok: false,

      error:
        error.message

    });

  }

}


// ======================================================
// SHEET NAME
// ======================================================

function sheetName_(type) {

  const sheetNames = {

    booking:
      'Bookings',

    contact:
      'Contacts',

    feedback:
      'Feedback'

  };


  return (
    sheetNames[type] ||
    'Enquiries'
  );

}


// ======================================================
// SHEET HEADERS
// ======================================================

function headers_(type) {

  const headers = {

    // ==================================================
    // BOOKING
    // ==================================================

    booking: [

      'Submitted at',

      'Name',

      'Email',

      'Phone',

      'Journey / Package',

      'Preferred journey date',

      'Adults',

      'Children',

      'Message'

    ],


    // ==================================================
    // CONTACT
    // ==================================================

    contact: [

      'Submitted at',

      'First name',

      'Last name',

      'Email',

      'Phone',

      'Interest',

      'Message'

    ],


    // ==================================================
    // FEEDBACK
    // ==================================================

    feedback: [

      'Submitted at',

      'Name',

      'Email',

      'Trip',

      'Rating',

      'Message'

    ]

  };


  return (
    headers[type] ||
    [

      'Submitted at',

      'Name',

      'Email',

      'Message'

    ]
  );

}


// ======================================================
// CONVERT SHEET HEADER TO FORM KEY
// ======================================================

function key_(header) {

  const specialKeys = {

    // ----------------------------------------------
    // SYSTEM
    // ----------------------------------------------

    'Submitted at':
      '',


    // ----------------------------------------------
    // CONTACT
    // ----------------------------------------------

    'First name':
      'firstName',

    'Last name':
      'lastName',


    // ----------------------------------------------
    // OLD BOOKING FIELD
    // ----------------------------------------------

    'Travel month':
      'travelMonth',


    // ----------------------------------------------
    // NEW BOOKING FIELDS
    // ----------------------------------------------

    'Journey / Package':
      'trip',

    'Preferred journey date':
      'travelDate',

    'Adults':
      'adults',

    'Children':
      'children'

  };


  // ----------------------------------------------
  // CHECK SPECIAL KEY
  // ----------------------------------------------

  if (
    Object.prototype.hasOwnProperty.call(
      specialKeys,
      header
    )
  ) {

    return specialKeys[header];

  }


  // ----------------------------------------------
  // DEFAULT CONVERSION
  // ----------------------------------------------

  return header
    .toLowerCase()
    .replace(/\s+/g, '');

}


// ======================================================
// JSON RESPONSE
// ======================================================

function json_(payload) {

  return ContentService
    .createTextOutput(
      JSON.stringify(
        payload
      )
    )
    .setMimeType(
      ContentService.MimeType.JSON
    );

}