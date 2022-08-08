function openSheet(
  /** @type {string} */ sheetId,
  /** @type string */ email,
  sheetName = 'Sheet1'
) {
  const sheet = SpreadsheetApp.openById(sheetId);
  const access = getAccess(sheetId, email);

  return {
    sheet: sheet.getSheetByName(sheetName) || sheet.getActiveSheet(),
    access,
  };
}

function getAccess(/** @type string */ fileId, /** @type string */ email) {
  const file = DriveApp.getFileById(fileId);
  const { OWNER, EDIT, COMMENT, VIEW } = DriveApp.Permission;
  const editable = [OWNER, EDIT];
  const readable = [...editable, COMMENT, VIEW];
  const access = file.getAccess(email);
  return {
    canEdit: editable.includes(access),
    canRead: readable.includes(access),
  };
}

function write(
  /** @type {string} */ sheetId,
  /** @type {string} */ email,
  data,
  sheetName = 'Sheet1'
) {
  const { sheet, access } = openSheet(sheetId, email, sheetName);
  if (!access.canEdit)
    throw new Error(`Sheet not shared with ${email} for editing`);

  let rowsAsArray = data;
  if (!Array.isArray(data[0])) {
    rowsAsArray = [];
    const headers = [];
    let index = 0;
    for (const row of data) {
      const rowAsArray = [];
      for (const [key, value] of Object.entries(row)) {
        headers[index] = key;
        rowAsArray[index] = value;
        index++;
      }
      rowsAsArray.push(rowAsArray);
    }
    rowsAsArray.unshift(headers);
  }
  let range = 'A1:';
  const column = String.fromCharCode(
    'A'.charCodeAt(0) + rowsAsArray[0].length - 1
  );
  range += `${column}${rowsAsArray.length}`;
  sheet.clear();
  sheet.getRangeList([range]).getRanges()[0].setValues(rowsAsArray);
}

function read(
  /** @type {string} */ sheetId,
  /** @type {string} */ email,
  /** @type {string} */ maxCell = undefined,
  sheetName = 'Sheet1'
) {
  const { sheet, access } = openSheet(sheetId, email, sheetName);
  if (!access.canRead) throw new Error(`Sheet not shared with ${email}`);

  let range = 'A1:';
  if (!maxCell) {
    const lastColumn = sheet.getLastColumn();
    const lastRow = sheet.getLastRow();
    if (lastColumn > 26) {
      throw new Error('Sheet too large, please specify range');
    }
    const column = String.fromCharCode('A'.charCodeAt(0) + lastColumn - 1);
    range += `${column}${lastRow}`;
  } else {
    range += maxCell;
  }
  const values = sheet.getRangeList([range]);
  const vals = values.getRanges().map((r) => r.getValues())[0];
  const firstRow = vals[0];
  const firstRowIsHeaders = firstRow.every((c) => c.length);
  if (!firstRowIsHeaders) {
    return vals;
  } else {
    const returns = [];
    const headerItems = [];
    for (const header of firstRow) {
      headerItems.push(header);
    }
    for (const row of vals.slice(1)) {
      const formattedRow = {};
      for (const [index, header] of Object.entries(headerItems)) {
        formattedRow[header] = row[index];
      }
      returns.push(formattedRow);
    }
    return returns;
  }
}

function getDatabase(/** @type string */ path) {
  if (path[0] === '/') path = path.slice(1);
  const authToken = ScriptApp.getOAuthToken();
  const dbURL = `https://app-g-sheets-default-rtdb.firebaseio.com/${path}.json`;
  const url = dbURL + '?access_token=' + encodeURIComponent(authToken);
  var response = UrlFetchApp.fetch(url, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${ScriptApp.getOAuthToken()}`,
    },
  });
  return JSON.parse(response.getContentText());
}

function doGet(e) {
  try {
    const { id } = e.parameter;
    const [uid, token] = e.parameter.token.split('/');
    const email = getDatabase(`users/${uid}/email`);
    if (!email) throw new Error('email not found');
    const origin = getDatabase(`users/${uid}/tokens/${token}`);
    if (!origin) throw new Error('No access');

    const returns = JSON.stringify(read(id, email));
    // const returns = JSON.stringify({email, token, uid, id});
    return ContentService.createTextOutput(returns).setMimeType(
      ContentService.MimeType.JAVASCRIPT
    );
  } catch (error) {
    const returns = JSON.stringify({
      message: error.message,
      stack: error.stack,
    });
    return ContentService.createTextOutput(returns).setMimeType(
      ContentService.MimeType.JAVASCRIPT
    );
  }
}

function doPost(e) {
  try {
    const { id } = e.parameter;
    const [uid, token] = e.parameter.token.split('/');
    const email = getDatabase(`users/${uid}/email`);
    if (!email) throw new Error('email not found');
    const origin = getDatabase(`users/${uid}/tokens/${token}`);
    if (!origin) throw new Error('No access');

    const data = JSON.parse(e.postData.contents);

    write(id, email, data);

    const returns = JSON.stringify(read(id, email));
    return ContentService.createTextOutput(returns).setMimeType(
      ContentService.MimeType.JAVASCRIPT
    );
  } catch (error) {
    const returns = JSON.stringify({
      message: error.message,
      stack: error.stack,
    });
    return ContentService.createTextOutput(returns).setMimeType(
      ContentService.MimeType.JAVASCRIPT
    );
  }
}
