// Go to "Extensions" at the top of Google Docs and then click "Apps Script". Paste all this to the blank scripting box and then press the save icon, then it will save this to your Google Drive, and then it should show up as a button on the top of your Google Docs
function onOpen() {
  var ui = DocumentApp.getUi();
  ui.createMenu("Countdown")
    .addItem("Run Amanda Timer", "AmandaTimer")
    .addToUi();
}

function AmandaTimer() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();

  // Target date: Feb 3, 2026 at 1 PM MST
  var targetDate = new Date(2026, 1, 3, 13, 0, 0);
  var now = new Date();
  var diff = targetDate - now;

  var daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
  var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  var mins = Math.floor((diff / (1000 * 60)) % 60);

  var timerText = Utilities.formatString("%02d:%02d mins remaining", hours, mins);

  var lines = [];
  if (daysLeft === 4) lines = ["Dawn of", "The Third Day", "~ 72 Hours Remain ~"];
  else if (daysLeft === 3) lines = ["Dawn of", "The Second Day", "~ 48 Hours Remain ~"];
  else if (daysLeft === 2) lines = ["Dawn of", "The Final Day", "~ 24 Hours Remain ~"];
  else if (diff > 0) lines = [daysLeft + " days left"];
  else lines = ["It is already too late"];

  lines.push(timerText);

  // Find existing table or create a new one
  var tables = body.getTables();
  var table;
  if (tables.length > 0 && tables[0].getNumRows() === 1 && tables[0].getRow(0).getNumCells() === 1) {
    table = tables[0];
  } else {
    table = body.appendTable([[""]]);
    var cell = table.getCell(0, 0);
    cell.setBackgroundColor("#6aa84f");
    cell.setPaddingTop(0);
    cell.setPaddingBottom(0);
    cell.setPaddingLeft(0);
    cell.setPaddingRight(0);
    cell.setVerticalAlignment(DocumentApp.VerticalAlignment.TOP);

    // Force initial paragraph style
    var p = cell.getChild(0).asParagraph(); // get the first (empty) paragraph
    p.setFontFamily("Press Start 2P");
    p.setFontSize(24);
    p.setForegroundColor("#ffff00");
    p.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    p.setSpacingBefore(0);
    p.setSpacingAfter(0);
    p.setLineSpacing(1.5);
  }

  // Clear the cell and append timer lines
  var cell = table.getCell(0, 0);
  cell.clear();
  var p = cell.appendParagraph(""); // single paragraph
  p.setFontFamily("Press Start 2P");
  p.setFontSize(24);
  p.setForegroundColor("#ffff00");
  p.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  p.setSpacingBefore(0);
  p.setSpacingAfter(0);
  p.setLineSpacing(1.5);

  lines.forEach(function(line, index) {
    p.appendText(line);
    if (index < lines.length - 1) p.appendText("\n");
  });

  // Auto-refresh trigger
  ensureCountdownTrigger();
}

function ensureCountdownTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  var exists = triggers.some(t => t.getHandlerFunction() === "AmandaTimer");
  if (!exists) {
    ScriptApp.newTrigger("AmandaTimer")
      .timeBased()
      .everyMinutes(1)
      .create();
  }
}
