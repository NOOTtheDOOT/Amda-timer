// Save this to your Google Drive, and then it should show up as a button on the top of your Google Docs
function onOpen() {
  var ui = DocumentApp.getUi();
  ui.createMenu("Countdown")
    .addItem("Run Amanda Timer", "AmandaTimer")
    .addToUi();
} 

function AmandaTimer() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();

  // Set the target date (YYYY, MM-1, DD, HH, MM, SS)
  var targetDate = new Date(2026, 1, 3, 13, 0, 0); // Feb 3, 2026 at 1 PM
  var now = new Date();

  // Time difference
  var diff = targetDate - now;

  // Days left
  var daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Breakdown time remaining
  var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  var mins = Math.floor((diff / (1000 * 60)) % 60);
  var secs = Math.floor((diff / 1000) % 60);

  var timerText = Utilities.formatString(
    "%02d:%02d:%02d remaining",
    hours, mins, secs
  );

  var text = "";

  // Majora's Mask messages
  if (daysLeft === 3) {
    text = "Dawn of\nThe Third Day\n~ 72 Hours Remain ~";
  } else if (daysLeft === 2) {
    text = "Dawn of\nThe Second Day\n~ 48 Hours Remain ~";
  } else if (daysLeft === 1) {
    text = "Dawn of\nThe Final Day\n~ 24 Hours Remain ~";
  }

  // Clear old countdown
  clearPreviousCountdown(body);

  // Create a 1x1 table
  var table = body.appendTable([[""]]);
  var cell = table.getCell(0, 0);
  cell.setBackgroundColor("#115511"); // dark green highlight
  cell.setPaddingTop(6);
  cell.setPaddingBottom(6);
  cell.setPaddingLeft(6);
  cell.setPaddingRight(6);

  // Insert the countdown text inside the table cell
  var lines = [];
  if (text !== "") {
    lines = text.split("\n");
  } else {
    if (diff > 0) {
      lines = [daysLeft + " days left"];
    } else {
      lines = ["It is already too late"];
    }
  }
  lines.push(timerText); // add the timer visual at the end

  // Clear the cell first
  cell.clear();

  // Append each line as a paragraph
  lines.forEach(function(line) {
    var p = cell.appendParagraph(line);
    p.setFontFamily("Press Start 2P");
    p.setForegroundColor("#FFFF00"); // yellow text
    p.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  });

  // Auto-refresh
  ensureCountdownTrigger();
}


// ----------------------------
// Helper: clear old countdown tables
// ----------------------------
function clearPreviousCountdown(body) {
  var tables = body.getTables();
  for (var i = tables.length - 1; i >= 0; i--) {
    var table = tables[i];
    var text = table.getText();
    if (
      text.includes("Dawn of") ||
      text.includes("~") ||
      text.includes("remaining") ||
      text.includes("days left")
    ) {
      body.removeChild(table);
    }
  }
}

// ----------------------------
// Auto-update trigger
// ----------------------------
function ensureCountdownTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  var exists = triggers.some(
    t => t.getHandlerFunction() === "AmandaTimer"
  );

  if (!exists) {
    ScriptApp.newTrigger("AmandaTimer")
      .timeBased()
      .everyMinutes(1)
      .create();
  }
}
