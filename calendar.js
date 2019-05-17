(function() {

    /* ==== Functionality regarding the calendar ==== */

    var weekDays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    var months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

    for(let i = 0; i < weekDays.length; i++) {
        var weekDaySelector = "WeekDay" + i;
        document.getElementById(weekDaySelector).innerHTML = weekDays[i];
    }

    
    function fillCalendar(year = date.getFullYear(), month = date.getMonth(), day = date.getDay()) {

        for(let i = 0; i <= 41; i++) {
            document.getElementById("nr"+i).innerHTML = "";
        }

        document.getElementById("SelectedDay").innerHTML = "";

        const date = new Date(year, month, day);

        document.getElementById("CalendarHeading").innerHTML = months[month] + ' ' + year;

        const firstDay = date.getDay(date.setDate(1));
        const lastDay = (() => {
            if (month == 1 && !(year % 4)) {
                return 29;
            } else if (month == 1 && (year % 4)) {
                return 28;
            } else if (month <= 6 && !(month % 2)) {
                return 31;
            } else if (month <= 6 && month % 2) {
                return 30;
            } else if (month > 6 && month % 2) {
                return 31;
            } else if (month > 6 && !(month % 2)) {
                return 30;
            }
        })();

        for(let i = firstDay; i <= lastDay+firstDay-1; i++) {
            document.getElementById("nr" + i).innerHTML = i - firstDay+1;
            document.getElementById("SelectedDay").innerHTML += "<option>" + (i - firstDay + 1) + "</option>";
        }

        if(document.getElementById("nr35").innerHTML === "") {
            document.getElementById("LastRow").style.display= "none" ;
        }

        addNotes(firstDay);

    }

    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDay();
    let noteCount = localStorage.getItem("noteCount") || 0;

    function prevMonth() {
        month = month - 1;
        if(month === -1) {
            month = 11;
            year = year - 1;
        }
        fillCalendar(year, month, day);
    }

    function nextMonth() {
        month = month + 1;
        if(month === 12) {
            month = 0;
            year = year + 1;
        }
        fillCalendar(year, month, day);
    }

    document.getElementById("PrevMonth").addEventListener('click', prevMonth);
    document.getElementById("NextMonth").addEventListener('click', nextMonth);

    fillCalendar();

    /* ==== Functionality regarding the notes ==== */

    function saveNote() {
        const text = document.getElementById("NotifyText").value;
        const noteDate = document.getElementById("SelectedDay").value + "." + month + "." + year;
        
        // TODO: Handle double entries and invalid chars
        localStorage.setItem("note" + noteCount, text + "," + noteDate);
        noteCount++;
        localStorage.setItem("noteCount", noteCount);

        fillCalendar(year, month, day);
        document.getElementById("NotifyText").value = "";
    }
    
    document.getElementById("SaveNoteBtn").addEventListener("click", saveNote);

    function addNotes(firstDay) {

        document.querySelectorAll(".tool").forEach((el) => {
            document.body.removeChild(el);
        });

        document.getElementById("remove-note").innerHTML = "";

        for(let i = 0; i < noteCount; i++) {

            try {
                const note = localStorage.getItem("note"+i);
                const noteText = note.split(",")[0];
                const noteDate = note.split(",")[1];
                const noteDay = noteDate.split(".")[0];
                const noteMonth = noteDate.split(".")[1];
                const noteYear = noteDate.split(".")[2];
    
                if(noteMonth == month && noteYear == year) {
    
                    let notify = document.createElement("div");
                    notify.classList.add("notify");
                    document.getElementById("nr"+(parseInt(noteDay)+firstDay-1)).appendChild(notify);
                    notify.addEventListener("mouseenter", function() {
                        document.getElementById(noteDay).style.display = "block";
                    });
                    notify.addEventListener("mouseleave", function() {
                        document.getElementById(noteDay).style.display = "none";
                    });
    
                    let tool = document.createElement("p");
                    tool.innerHTML = noteText;
                    tool.classList.add("tool");
                    tool.setAttribute("id", noteDay);
                    const left = notify.getBoundingClientRect().x;
                    const top = notify.getBoundingClientRect().y;
                    tool.style.left = left + window.scrollX + 15 + "px";
                    tool.style.top = top + window.scrollY + 5 + "px";
                    document.body.appendChild(tool);
    
                    document.getElementById("remove-note").innerHTML += `<option>${noteText}</option>`
                }
            } catch {
                continue;
            }
            
        }

        if(document.getElementById("remove-note").innerHTML === "") {
            document.getElementById("NotificationSelector").style.display = "none";
        } else {
            document.getElementById("NotificationSelector").style.display = "block";
        }

    }

    function removeNote() {
        const removeText = document.getElementById("remove-note").value;
        
        for(let i = 0; i < noteCount; i++) {
            try {
                const note = localStorage.getItem("note"+i);
                const noteText = note.split(",")[0];
    
                if(removeText === noteText) {
                    localStorage.removeItem("note"+i);
                    fillCalendar(year, month, day);
                }
            } catch {
                continue;
            }
        }
    }

    document.getElementById("BtnRemove").addEventListener("click", removeNote);

})();