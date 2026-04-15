/* ============================================================
   CONFIGURATION
   Set the due date here — everything else updates automatically
   Change this to any future or past date to test different states
   ============================================================ */
const DUE = new Date('2026-04-17T18:00:00Z');
// ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ
// The Z at the end means UTC (coordinated universal time)


/* ============================================================
   TIME REMAINING CALCULATOR
   Works out how far away (or overdue) the due date is
   and returns a human-friendly label + a CSS class name
   ============================================================ */
function getTimeRemaining() {

  // Get the difference in milliseconds between now and the due date
  // Positive = due in the future, Negative = already overdue
  const diffMs = DUE - Date.now();

  // Convert milliseconds to whole seconds (Math.round handles sub-second drift)
  const diffSec = Math.round(diffMs / 1000);

  // Work with the absolute (unsigned) value for all the time unit conversions
  const absSec = Math.abs(diffSec);
  const mins   = Math.floor(absSec / 60);          // total minutes
  const hours  = Math.floor(absSec / 3600);         // total hours
  const days   = Math.floor(absSec / 86400);        // total days

  // ── Overdue cases (diffSec is negative) ──────────────────

  // More than 1 day overdue
  if (diffSec < -86400) {
    return {
      text: `Overdue by ${days} day${days !== 1 ? 's' : ''}`,
      cls: 'time-overdue' // red badge
    };
  }

  // Between 1 hour and 1 day overdue
  if (diffSec < -3600) {
    return {
      text: `Overdue by ${hours} hour${hours !== 1 ? 's' : ''}`,
      cls: 'time-overdue'
    };
  }

  // Less than 1 hour overdue
  if (diffSec < 0) {
    return {
      text: `Overdue by ${mins} min${mins !== 1 ? 's' : ''}`,
      cls: 'time-overdue'
    };
  }

  // ── Due very soon or right now ────────────────────────────

  // Within 60 seconds — show "Due now!"
  if (diffSec < 60) {
    return { text: 'Due now!', cls: 'time-overdue' };
  }

  // Due within the hour — show minutes remaining
  if (diffSec < 3600) {
    return {
      text: `Due in ${mins} min${mins !== 1 ? 's' : ''}`,
      cls: 'time-soon' // amber badge
    };
  }

  // ── Due today (within 24 hours) ───────────────────────────

  if (diffSec < 86400) {
    return {
      text: `Due in ${hours} hour${hours !== 1 ? 's' : ''}`,
      cls: 'time-soon' // amber badge
    };
  }

  // ── Due in future ─────────────────────────────────────────

  // Due tomorrow specifically
  if (days === 1) {
    return { text: 'Due tomorrow', cls: 'time-ok' }; // green badge
  }

  // Due in 2 or more days
  return {
    text: `Due in ${days} days`,
    cls: 'time-ok' // green badge
  };
}


/* ============================================================
   UPDATE THE TIME REMAINING BADGE IN THE DOM
   Finds the badge element, sets its text and CSS class
   Called once on load, then again every 60 seconds
   ============================================================ */
function updateRemaining() {

  // Find the time remaining badge element by its ID
  const el = document.getElementById('time-remaining');

  // Get the current text and class from the calculator function above
  const { text, cls } = getTimeRemaining();

  // Update the visible text inside the badge
  el.textContent = text;

  // Replace the class — this changes the badge colour
  // We keep 'time-remaining-badge' for base styles and add the colour class
  el.className = 'time-remaining-badge ' + cls;
}


/* ============================================================
   GRAB ELEMENTS WE NEED TO UPDATE ON CHECKBOX TOGGLE
   We store references here so we don't search the DOM
   every single time the checkbox is clicked
   ============================================================ */
const checkbox = document.getElementById('complete-toggle');
const titleEl  = document.querySelector('[data-testid="test-todo-title"]');
const statusEl = document.getElementById('status-badge');


/* ============================================================
   CHECKBOX TOGGLE — COMPLETION BEHAVIOUR
   When checked:   strikes through title, sets status to Done
   When unchecked: restores title, sets status back to In Progress
   ============================================================ */
checkbox.addEventListener('change', function () {

  if (this.checked) {
    // ── Mark as complete ──────────────────────────────────

    // Add "done" class to the title — CSS will strike it through and grey it out
    titleEl.classList.add('done');

    // Swap the status badge to green "Done" styling
    statusEl.className = 'badge status-done';

    // Update the spoken label for screen readers
    statusEl.setAttribute('aria-label', 'Status: Done');

    // Update the visible badge content (dot + text)
    // We rebuild the innerHTML to keep the coloured dot inside
    statusEl.innerHTML = '<span class="dot" aria-hidden="true"></span>Done';

  } else {
    // ── Mark as incomplete (unchecked) ────────────────────

    // Remove the "done" class to restore normal title appearance
    titleEl.classList.remove('done');

    // Swap the status badge back to purple "In Progress" styling
    statusEl.className = 'badge status-inprogress';

    // Restore the screen reader label
    statusEl.setAttribute('aria-label', 'Status: In Progress');

    // Restore the visible badge content
    statusEl.innerHTML = '<span class="dot" aria-hidden="true"></span>In Progress';
  }
});


/* ============================================================
   EDIT BUTTON
   Currently a placeholder — logs to the browser console
   In a real app this would open an edit modal or form
   ============================================================ */
document.getElementById('edit-btn').addEventListener('click', function () {
  console.log('edit clicked');
  // To inspect this: open browser DevTools → Console tab → click Edit
});


/* ============================================================
   DELETE BUTTON
   Currently a placeholder — shows a browser alert
   In a real app this would remove the task from the database
   and remove the card from the DOM
   ============================================================ */
document.getElementById('delete-btn').addEventListener('click', function () {
  alert('Delete clicked');
});


/* ============================================================
   INITIALISE ON PAGE LOAD
   ============================================================ */

// Run immediately when the page loads to show the correct time remaining
updateRemaining();

// Then refresh every 60 seconds (60000 milliseconds) so the badge stays accurate
// For example "Due in 3 hours" will update to "Due in 2 hours" after an hour
setInterval(updateRemaining, 60000);