// Set up storage items
var calendarMonth = localStorage.getItem('calendarMonth');
var calendarYear = localStorage.getItem('calendarYear');
if(!localStorage.getItem('noteCount')) {
    localStorage.setItem('noteCount', 0);
}

// Check if storage has been set and set up date object depending on that
if(calendarMonth && calendarYear) {
  var date = new Date(calendarYear, calendarMonth, 1);
} else {
  var date = new Date();
  localStorage.setItem('calendarMonth', date.getMonth());
  calendarMonth = localStorage.getItem('calendarMonth');
  localStorage.setItem('calendarYear', date.getFullYear());
  calendarYear = localStorage.getItem('calendarYear');
}

/* ==== Create Calendar Object ==== */
var Calendar = {
  // Objekt für die Monate
  month: {
    current: calendarMonth,
    names: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
  },
  // Array für die Wochentage
  weekDays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
  // Eigenschaft für das gegenwärtige Jahr
  currentYear: calendarYear,
  lastDay: "",
  firstDay: "",
    
  // Fill Calendar Function
    
  fillCalendar: function() {
      
      // Get the number for the last day of the month
      (function() {
          
          if (this.month.current == 1 && !(this.currentYear % 4)) {
            this.lastDay = 29;
          } else if (this.month.current == 1 && (this.currentYear % 4)) {
            this.lastDay = 28;
          } else if (this.month.current <= 6 && !(this.month.current % 2)) {
            this.lastDay = 31;
          } else if (this.month.current <= 6 && this.month.current % 2) {
            this.lastDay = 30;
          } else if (this.month.current > 6 && this.month.current % 2) {
            this.lastDay = 31;
          } else if (this.month.current > 6 && !(this.month.current % 2)) {
            this.lastDay = 30;
          }
          return this.lastDay;

    }).call(Calendar);

    // Get the number of the first weekday of the month
    this.firstDay = date.getDay(date.setDate(1));
      

                /* ==== Fill in the Calendar HTML tree ==== */
      
    document.getElementById("CalendarHeading").innerHTML = Calendar.month.names[calendarMonth] + ' ' + calendarYear;
      
      
    // Fill in the Week Days in the Table Heading
      
    for(let i = 0; i < Calendar.weekDays.length; i++) {
        var weekDaySelector = "WeekDay" + i;
        document.getElementById(weekDaySelector).innerHTML = Calendar.weekDays[i];
    }
      
    // Fill in the Number of the Days in the Calendar Cells
      
    for(let i = 0; i < this.lastDay; i++) {
        var cellSelector = "nr" + (i + this.firstDay);
        document.getElementById(cellSelector).innerHTML = (i + 1);
    }
    
    // Hide the last row if there is nothing to display
    if(document.getElementById("nr35").innerHTML === "") {
        document.getElementById("LastRow").style.display= "none" ;
    }
  },
  // Functions for skipping months

  nextMonth: function() {
    calendarMonth = parseInt(calendarMonth) + 1;
    localStorage.setItem('calendarMonth', calendarMonth);

    if(localStorage.getItem('calendarMonth') == 12) {
      calendarYear = parseInt(calendarYear) + 1;
      localStorage.setItem('calendarYear', calendarYear);
      localStorage.setItem('calendarMonth', 0);
    }
    location.reload();
  },

  prevMonth: function() {
    calendarMonth = parseInt(calendarMonth) - 1;
    localStorage.setItem('calendarMonth', calendarMonth);

    if(localStorage.getItem('calendarMonth') == -1) {
      calendarYear = parseInt(calendarYear) - 1;
      localStorage.setItem('calendarYear', calendarYear);
      localStorage.setItem('calendarMonth', 11);
    }
    location.reload();
  }
}

/* ==== Create Note Object ==== */

var Note = {
    count: parseInt(localStorage.getItem('noteCount')),
    
    // Function to create the Day Option Selector
    createDaySelector: function() {
        for(let i = 1; i <= Calendar.lastDay; i++) {
            document.writeln("<option value='"+i+"'>"+i+"</option>");
        }
    },
    
    // Short function to clear the note textfield input text
    clearInput: function() {
        document.getElementById("NotifyText").value = "";
    },
    
    // Function to save the input
    saveNote: function() {
        
        // Save inputs into variables
        var selectedDay = document.getElementById("SelectedDay").value;
        var notificationText = document.getElementById("NotifyText").value;
        if(notificationText.search(",") !== -1) {
            alert("Sorry, you can't use commas in the Note");
            return;
        }
        if(notificationText.search("<") !== -1) {
            alert("Sorry, certain chars are not allowed.");
            return;
        }
        if(notificationText.length > 35) {
            alter("Sorry, too many characters.");
            return;
        }
        
        var note = [notificationText, selectedDay, calendarMonth, calendarYear, this.count];
        
        // Check for double entries
        if(Note.count){
            for(let i = 0; i < Note.count; i++) {
                this.notes[i] = localStorage.getItem("note"+i).split(",");
                if(this.notes[i][1] === selectedDay && this.notes[i][2] === calendarMonth) {
                    alert("Sorry, double entries are not allowd");
                    return;
                }
            }
        }
        
        // Save inputs into local storage
        var noteSelector = "note" + this.count;
        localStorage.setItem(noteSelector, note);
        this.count ++;
        localStorage.setItem('noteCount', this.count);
        
        // Reset everything
        document.getElementById("SelectedDay").value = "1";
        document.getElementById("NotifyText").value = "Enter Text";
        alert("Your note has been saved.");
        location.reload();
    },
    
    // Empty Array that will be filled when the page loads with matching note-arrays
    notes: [],
    
    // Function to load the notes out of the local storage into the Note.notes property
    getNotes: function() {
        for(let i = 0; i < this.count; i++) {
            var noteSelector = "note" + i;
            this.notes[i] = localStorage.getItem(noteSelector).split(",");
            
            // If the calendarMonths don't match, erase note.
            if (this.notes[i][2] !== calendarMonth) {
                this.notes.splice(i, 1);
            }
        }
    },
    
    // Function to create the Notifier
    createNotification: function() {
        for(let i = 0; i < Note.count; i++) {
            if(Note.notes[i]) {
                var notify = document.createElement("div");
                var cellSelector = parseInt(Note.notes[i][1])+Calendar.firstDay-1;
                notify.classList.add("notify");
                notify.classList.add("nr"+cellSelector);
                document.getElementById("nr"+cellSelector).appendChild(notify);
                notify.setAttribute("onmouseover", "Note.showToolTip("+cellSelector+")");
                notify.setAttribute("onmouseout", "Note.removeToolTip("+cellSelector+")");
            }
        }
    },
    
    // Function to create the ToolTip
    createToolTip: function(e) {
        for(let i = 0; i < Note.count; i++) {
            if(Note.notes[i]) {
                // Set Tooltip position
                var cellSelector = ".nr" + (parseInt(Note.notes[i][1])+Calendar.firstDay-1);
                var left = document.querySelector(cellSelector).getBoundingClientRect().x;
                var top = document.querySelector(cellSelector).getBoundingClientRect().y;
                var toolSelector = parseInt(Note.notes[i][1])+Calendar.firstDay-1
                
                // Create, style and position the Tooltip-Element
                var tooltip = document.createElement("p");
                document.body.appendChild(tooltip);
                var uniqueToolClass = "tool" + toolSelector;
                tooltip.classList.add("tool");
                tooltip.classList.add(uniqueToolClass);
                tooltip.innerHTML = Note.notes[i][0];
                tooltip.style.position = "absolute";
                tooltip.style.left = left + 4 + "px";
                tooltip.style.top = top + 16 + "px";
                tooltip.style.display = "none";
            }
        }
    },
    
    // Function to show the ToolTip
    showToolTip: function(i) {
        var toolSelector = ".tool" + i;
        document.querySelector(toolSelector).style.display = "block";
    },
    
    // Function to hide the ToolTip
    removeToolTip: function(i) {
        var toolSelector = ".tool" + i;
        document.querySelector(toolSelector).style.display = "none";
    },
    
    // Function to create the Notification Selector Input Field
    notificationSelector() {
        var noteSelector = "note";
        document.writeln('<select name="NotificationSelect">');
        
        for(let i = 0; i <= Note.count; i++) {
            if(localStorage.getItem(noteSelector+i) && Note.notes[i]) {
                document.writeln("<option value='note"+i+"'>"+Note.notes[i][0]+"</option>");
            }
        } if(document.getElementsByTagName("select")[1].innerHTML == "\n") {
            document.getElementById('NotificationSelector').innerHTML = "<i>Nothing to display or remove here</i>";
        }
        document.writeln("</select>");
    },
    
    // Function to remove a Note
    removeNote: function() {
        
        // Set up some variables
        var noteRemoveSelect = document.getElementsByTagName("select")[1].value;
        var noteToRemove = localStorage.getItem(noteRemoveSelect).split(",");
        var noteNumber = parseInt(noteToRemove[4]);
        var newNoteSelector;
        
        localStorage.removeItem(noteRemoveSelect);
        
        for(let i = noteNumber; i < Note.count; i++) {
            var oldNoteSelector = "note" + (i+1);
            newNoteSelector = "note" + i;
            var theNote = localStorage.getItem(oldNoteSelector);
            if(theNote){
                var oldNoteNumber = parseInt(theNote.slice(-1));
                var newNoteNumber = oldNoteNumber - 1;
                theNote = theNote.substr(0, (theNote.length-1));
                theNote+= newNoteNumber;
                localStorage.setItem(newNoteSelector, theNote);
            }
        }
        localStorage.removeItem(newNoteSelector);
        this.count --;
        localStorage.setItem("noteCount", this.count);
        location.reload();
    }
}

//function to highlight the current Day
function highlightToday () {
  var d = new Date();
  var todayCell = d.getDate() + d.getDay(d.setDate(1))-1;
  if(d.getMonth() == calendarMonth) {
    var cellSelector = "nr" + todayCell;
    document.getElementById(cellSelector).style.background = "lightblue";
  }
};




