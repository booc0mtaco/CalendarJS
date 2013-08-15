/**
 * @brief Untropy Calendar
 * @author Andrew Holloway
 * @date 03/07/2007
 */

 /// This 'namespace' will hold all the definitions of the included objects
 if (typeof Untropy == "undefined") {
    
    Untropy = {};
    
 }
 
 /** 
  * 
  * Error Handler for Calendar components. 
  * This has components that will perform certain actions based on the error type.
  * 
  */
 Untropy.Error = {
    
    dateRange: function (bound) {
        alert("The date requested is out of range.\nDate Bound Violated: " + bound.getFullYear() + "-" + (bound.getMonth()+1) + "-" + bound.getDate());
    },
    
    generic: function (string) {
        
        alert(string);
        
    },
    
    maxSlotReached: function (string) {
    
        console.log(string);
    }
    
 };

 /**
  * 
  * @class Calendar Setup (Untropy.CalendarSetup)
  * 
  * @brief Provides the data for setting up and configuring all calendar functionality.
  * @author Andrew H
  * 
  */
 Untropy.CalSetup = function (config) {
     
    // Defaults
    var slots = 5;
    var hasAct = true;
    var dayOrder = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var width = '100%';
    var fontSize = '10pt';
    var dateMin = new Date(2005, 0, 1);
    var dateMax = new Date(2020, 11, 27);
   
    // if the config parameter is actually having a value, try to parse its contents
    if (config) {
        
        this.SLOTS_PER_DAY    = (config.SLOTS_PER_DAY) ? config.SLOTS_PER_DAY : slots;
        this.HAS_ACTIVITIES   = (config.HAS_ACTIVITIES)? config.HAS_ACTIVIITES: hasAct;
        this.DAY_ORDER        = (config.DAY_ORDER)     ? config.DAY_ORDER     : dayOrder;
        this.WIDTH_PCT        = (config.WIDTH_PCT)     ? config.WIDTH_PCT     : width;
        this.FONT_SIZE        = (config.FONT_SIZE)     ? config.FONT_SIZE     : fontSize;
        this.DATE_MINIMUM     = (config.DATE_MINIMUM)  ? config.DATE_MINIMUM  : dateMin;
        this.DATE_MAXIMUM     = (config.DATE_MAXIMUM)  ? config.DATE_MAXIMUM  : dateMax;
        
    } else {
        
        // load the defaults
        this.SLOTS_PER_DAY      = slots;
        this.HAS_ACTIVITIES     = hasAct;
        this.DAY_ORDER          = dayOrder;
        this.WIDTH_PCT          = width;
        this.FONT_SIZE          = fontSize
        this.DATE_MINIMUM       = dateMin;
        this.DATE_MAXIMUM       = dateMax;
        
    }
   
 };
 
 /** 
  * 
  * @class Untropy Calendar (Untropy.Calendar)
  * @brief Generates the frame, and navigation buttons for the calendar on screen.
  * 
  */
 Untropy.Calendar = function(container, startDate, config) {

    // the name of the object instance 
    this.activityList = new Array();
    
    // Grab the settings from the parameter, or return the defaults
    this.calSetup = new Untropy.CalSetup(config);
    
    // This is the date to use for processing
    this.displayDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());     
        
    // Set today equal to ... today
    this.today = new Date();
    
    this.headerContainer = null;
    this.monthContainer = null;
    this.footerContainer = null;
    
    this.calendarLabel = "";
    
    this.containerElement = $(container);
    this.containerElement.innerHTML = "";
    
    // get to work generating the proper month
    this.month = new Untropy.Month(this.displayDate, this.calSetup);
    
    // Func. to run after the calendar updates, by default, nothing
    this.afterCalUpdate = function() { return; };
 };
 
 /**
  * 
  * @brief Function to run after the calendar has been updated. Post-procedure for button creation and other maintenance.
  * 
  */
 Untropy.Calendar.prototype.onUpdateCalendar = function(functionToRun) {
 
    this.afterCalUpdate = functionToRun;
 
 }
 
 /**
  * 
  * @brief Take JSON (or an activity) and create a new one, then add it to the calendar's activity list
  * @return Activity added to the array
  * 
  */
 Untropy.Calendar.prototype.addActivity = function (activity) {
    
    this.activityList.push(new Untropy.Activity(activity));
    return this.activityList[this.activityList.length-1];
    
 }
 
 /**
  * 
  * @brief Iterate through the activity list and print the details to the screen.
  * 
  */  
 Untropy.Calendar.prototype.showActivities = function () { 
    
    for (var i = 0; i < this.activityList.length; i++) {
        
        alert(this.activityList[i].toString());
        
    }
    
 }
 
 /**
  * 
  * @brief Remove an activity from the calendar activity list, and updates calendar.
  * @return Copy of the removed object.
  * 
  */
 Untropy.Calendar.prototype.removeActivity = function (actId) {
 
    var found = false;
    var removedActivity = null;
    for (var i = 0; i < this.activityList.length && !found; i++) {
        
        if (this.activityList[i].getId() == actId) {
            
            found = true;
            // Remove the activity from the array (null it out), and then compact it
            removedActivity = new Untropy.CloneOf(this.activityList[i]);
            
            this.activityList[i] = null;
            this.activityList = this.activityList.compact();
            
        }
        
    }
    
    this.updateCalendar();
    
    return removedActivity;
    
 }
 
 /**
  * 
  * @brief Remove all activities from the list, and reload the calendar.
  * 
  */
 Untropy.Calendar.prototype.removeAllActivities = function() {
 
    this.activityList.clear();
    this.updateCalendar();
 
 }

 /**
  * 
  * @brief Get the current calendar date that is used for displaying the month
  * @return Display date
  * 
  */
 Untropy.Calendar.prototype.getCalDate = function () {
 
    return this.displayDate;
 
 }
 
 /**
  * 
  * @brief Sets the display date for the calendar month
  * 
  */
 Untropy.Calendar.prototype.setCalDate = function(newDate) {
 
    this.displayDate = newDate;
    this.updateCalendar();
    
 }
 
 /**
  *  
  *  @brief Sets the calendar's display date to the current month
  *  
  */ 
 Untropy.Calendar.prototype.setToCurrentMonth = function () {
 
    this.displayDate = new Date();
    this.updateCalendar();
    
 }
 
 /**
  * 
  * @brief Move calendar display date to the next month
  * 
  */
 Untropy.Calendar.prototype.setToNextMonth = function() {
 
    var d = this.displayDate;
    var testDate = new Date(d.getFullYear(), d.getMonth()+1, 1);
    if (testDate <= this.calSetup.DATE_MAXIMUM) {
        this.displayDate.setMonth(this.displayDate.getMonth()+1);
        this.updateCalendar();
        
    } else {
        
        Untropy.Error.dateRange(this.calSetup.DATE_MAXIMUM);
        
    }
    
 }
 
 /**
  * 
  * @brief Move calendar display date to the previous month
  * 
  */
 Untropy.Calendar.prototype.setToPreviousMonth = function() {
    
    var d = this.displayDate;
    var testDate = new Date(d.getFullYear(), d.getMonth()-1, 1);
    if (testDate >= this.calSetup.DATE_MINIMUM) {
        
        this.displayDate.setMonth(this.displayDate.getMonth()-1);
        this.updateCalendar();
    } else {
        
        Untropy.Error.dateRange(this.calSetup.DATE_MINIMUM);
        
    }
    
 }
 
 /**
  * 
  * @brief Move calendar display date to the next year
  * 
  */
 Untropy.Calendar.prototype.setToNextYear = function() { 
 
    var d = this.displayDate;
    var testDate = new Date(d.getFullYear()+1, d.getMonth(), 1);
    if (testDate <= this.calSetup.DATE_MAXIMUM) {
        this.displayDate.setFullYear(this.displayDate.getFullYear()+1);
        this.updateCalendar();
    } else {
        
        Untropy.Error.dateRange(this.calSetup.DATE_MAXIMUM);
        
    }

 }
 
 /**
  * 
  * @brief Move calendar display date to the previous year
  * 
  */
 Untropy.Calendar.prototype.setToPreviousYear = function() { 
    
    var d = this.displayDate;
    var testDate = new Date(d.getFullYear()-1, d.getMonth(), 1);
    if (testDate >= this.calSetup.DATE_MINIMUM) {
        
        this.displayDate.setFullYear(this.displayDate.getFullYear()-1);
        this.updateCalendar();
        
    } else {
        
        Untropy.Error.dateRange(this.calSetup.DATE_MINIMUM);
        
    }

 }
 
 /** 
  * 
  * @brief Retrieves the calendar's month reference
  * @return reference to the calendar's month
  * 
  */
 Untropy.Calendar.prototype.getCalMonth = function () {
 
    return this.month;
 
 }
  
 /**
  * 
  * @brief Updates the calendar based on the changed month and status of activities
  * 
  * This function updates the month date value, then renders the month section of the calendar
  * again. After calendar is generated, it updates the activity list of the month, then adds
  * the appropriate activities to the newly generated calendar month.
  * 
  */
 Untropy.Calendar.prototype.updateCalendar = function () {
 
    this.month.setMonthDate(this.displayDate);
    
    this.footerContainer.innerHTML = "Selected Date Here";
    $('headerBox').innerHTML = this.displayDate.getMonthName() + ", " + this.displayDate.getFullYear();

    // Now, generate the month
    var monthHolder = this.month.generateMonth();
    this.monthContainer.innerHTML = "";
    this.monthContainer.appendChild(monthHolder);
    
    // Attach Events to make calendar day hovers fill the footer
    this.month.days.each(function(dayObj) {
        
        if (dayObj) {
            
            var stringName;
            stringName = dayObj.getDayDate().getMonthName() + " " + dayObj.getDayDate().getDate() + ", " + dayObj.getDayDate().getFullYear();
            
            Event.observe(dayObj.getContainer(), "mouseover", function () {
                
                $('calendarDetail').innerHTML = stringName;
                
            });
            
        }
        
    });
    
    // clear out the old activities
    this.month.clearActivityList();
    
    // Put the new activities from the calendar into this new month
    var al = this.activityList;
    var calDate = this.getCalDate();
    
    for (var i = 0; i < this.activityList.length; i++) {
        
        /* Three cases:
            1- Start month and year of activity same as calendars current month and year
            2- End month and year of activity same as calendar's current mont and year
            3- Start month and year prior to calendar's current month and end month and year after calendar's current month
         */
        var calendarDateDepth = calDate.getFullYear() + (calDate.getMonth()/12);
        var startDateDepth = al[i].getStartDate().getFullYear()+(al[i].getStartDate().getMonth()/12);
        var endDateDepth   = al[i].getEndDate().getFullYear()+(al[i].getEndDate().getMonth()/12);
        
        if (al[i].getStartDate().getMonth() == calDate.getMonth() && al[i].getStartDate().getFullYear() == calDate.getFullYear()) {
            
            // 1
            this.month.addActivity(al[i]);
            
        } else if (al[i].getEndDate().getMonth() == calDate.getMonth() && al[i].getEndDate().getFullYear() == calDate.getFullYear()) {
            
            // 2
            this.month.addActivity(al[i]);
            
        } else if (startDateDepth <= calendarDateDepth && endDateDepth >= calendarDateDepth) {
            
            // 3
            // Determine the position in the year by calculating the 'year depth' (year + month/12)
            this.month.addActivity(al[i]);
            
        }
        
    }
    
    // and render the activities therein
    this.month.printActivities();
    
    // ... and run this function, which is user defined (tricky, eh?)
    this.afterCalUpdate();
 }
 
 /**
  * 
  * @brief Prints the calendar frame, and contents to the screen.
  * 
  * Creates the elements to hold the calendar command buttons, key bindings, and 
  * frame. responsible for assigning the command values to the calendar's navigation buttons.
  * 
  * 
  * 
  */
 Untropy.Calendar.prototype.printCalendarFrame = function() {
    
    var outerContainer = document.createElement("div");
        outerContainer.className = "untropy-calendar";
        outerContainer.style.width = this.calSetup.WIDTH_PCT;
        outerContainer.style.fontSize = this.calSetup.FONT_SIZE;
    
    // Define Buttons
    var prevYearBtn = document.createElement('input');
        prevYearBtn.setAttribute('id', 'prevYear');
        prevYearBtn.setAttribute('type', 'button');
        prevYearBtn.setAttribute('value', '<<');
        prevYearBtn.setAttribute('accesskey', "<");
        Event.observe(prevYearBtn, 'click', this.setToPreviousYear.bindAsEventListener(this));
        
    var prevMonthBtn = document.createElement('input');
        prevMonthBtn.setAttribute('id', 'prevMonth');
        prevMonthBtn.setAttribute('type', 'button');
        prevMonthBtn.setAttribute('value', '<');
        prevMonthBtn.setAttribute('accesskey',",");
        Event.observe(prevMonthBtn, 'click', this.setToPreviousMonth.bindAsEventListener(this));
        
    var nextMonthBtn = document.createElement('input');
        nextMonthBtn.setAttribute('id', 'nextMonth');
        nextMonthBtn.setAttribute('type', 'button');
        nextMonthBtn.setAttribute('value', '>');
        nextMonthBtn.setAttribute('accesskey', ".");
        Event.observe(nextMonthBtn, 'click', this.setToNextMonth.bindAsEventListener(this));
    
    var nextYearBtn = document.createElement('input');
        nextYearBtn.setAttribute('id', 'nextYear');
        nextYearBtn.setAttribute('type', 'button');
        nextYearBtn.setAttribute('value', '>>');
        nextYearBtn.setAttribute('accesskey', ">");
        Event.observe(nextYearBtn, 'click', this.setToNextYear.bindAsEventListener(this));
        
    var currMonthBtn = document.createElement("input");
        currMonthBtn.setAttribute("id", "lcurrentMonth");
        currMonthBtn.setAttribute("type", "button");
        currMonthBtn.setAttribute("value", "Today");
        Event.observe(currMonthBtn, 'click', this.setToCurrentMonth.bindAsEventListener(this));
        
    var cloCurrMonthBtn = document.createElement("input");
        cloCurrMonthBtn.setAttribute("id", "rcurrentMonth");
        cloCurrMonthBtn.setAttribute("type", "button");
        cloCurrMonthBtn.setAttribute("value", "Today");
        Event.observe(cloCurrMonthBtn, 'click', this.setToCurrentMonth.bindAsEventListener(this));
    
    // Now, for the contents of the header row
    var headerBox = document.createTextNode("Date Here");

    var headerTable = document.createElement("table");
        headerTable.className = 'headerTable';
        
    var headerTableBody = document.createElement("tbody");
    var headerTableRow = document.createElement("tr");
        
    var leftBtnCell = document.createElement('td');
        leftBtnCell.setAttribute("id", "leftBtnCell");
    var middleCell = document.createElement('td');
        middleCell.setAttribute("id", "headerBox");
    var rightBtnCell = document.createElement('td');
        rightBtnCell.setAttribute("id", "rightBtnCell");
    
    // Put contents in header cells
    leftBtnCell.appendChild(prevYearBtn);
    leftBtnCell.appendChild(prevMonthBtn);
    leftBtnCell.appendChild(cloCurrMonthBtn);
    middleCell.appendChild(headerBox);
    rightBtnCell.appendChild(nextYearBtn);
    rightBtnCell.appendChild(nextMonthBtn);
    rightBtnCell.appendChild(currMonthBtn);
    
    // Put cells in the header row
    headerTableRow.appendChild(leftBtnCell);
    headerTableRow.appendChild(middleCell);
    headerTableRow.appendChild(rightBtnCell);
    
    // Put Row in header table Body
    headerTableBody.appendChild(headerTableRow);
    
    // and put body in header table
    headerTable.appendChild(headerTableBody);
    
    // define headerContainer object, and store new table in ther
    this.headerContainer = document.createElement("div");
    this.headerContainer.className = "calheader";
    this.headerContainer.appendChild(headerTable);
    
    // define the footer and its object container
    var footertext = document.createTextNode("Selected Date Here");
    this.footerContainer = document.createElement("div");
    this.footerContainer.className = "calfooter";
    this.footerContainer.setAttribute('id', 'calendarDetail');
    this.footerContainer.appendChild(footertext);
    
    this.monthContainer = document.createElement("div");
    this.monthContainer.className = 'calbody';
    
    outerContainer.appendChild(this.headerContainer);
    outerContainer.appendChild(this.monthContainer);
    outerContainer.appendChild(this.footerContainer);
    
    this.containerElement.appendChild(outerContainer);
    
    $('headerBox').innerHTML = this.displayDate.getMonthName() + ", " + this.displayDate.getFullYear();
    
    this.updateCalendar();

 }
 
 /**
  * 
  * @class Untropy Month (Untropy.Month)
  * @brief Constructor for the Month object, holding the days, activities, and days of the month
  * 
  */
 Untropy.Month = function(initDate, calendarSetup) {
    
    this.date = initDate;
    this.monthSetup = calendarSetup;
    
    // Constant information
    this.dayOrder = this.monthSetup.DAY_ORDER;
    
    // Create the day dealies for the given month
    this.days = new Array();
    this.days[0] = null;
    
    this.activityList = new Array();
    
 };
 
 /**
  * 
  * @brief Retrieve the reference to the day list
  * @return Reference to the day object
  * 
  */
 Untropy.Month.prototype.getDayList = function () {
 
    return this.days;
 
 }
 
 /** 
  * 
  * @brief Get the position in the week calendar for the specified day string
  * @return numbered location of the weekday in the week
  * 
  */
 Untropy.Month.prototype.getDayPosition = function (weekday) {
    
    return this.dayOrder.indexOf(weekday);
    
 }
  
 /**
  * 
  * @brief Set the date of the month
  * @return the date value set in the calendar
  * 
  */
 Untropy.Month.prototype.setMonthDate = function(dateValue) {
    
    this.date = dateValue;
    return this.date;
    
 }
 
 /**
  * 
  * @brief Gets the currently set month Date
  * @return the month of the calendar
  * 
  */
 Untropy.Month.prototype.getMonthDate = function () {
 
    return this.date;
 
 }
 
 /**
  * 
  * @brief Generates the header elements for the month display
  * @return element containing all the calendar header information
  * 
  */
 Untropy.Month.prototype.generateMonthHeader = function () {
 
    // Make header row
    var weekLabelTxt = document.createTextNode("wk");
        
    var weekLabelContainer = document.createElement("div");
        weekLabelContainer.appendChild(weekLabelTxt);
        weekLabelContainer.className = "weeknumber";
        
    var weekLabel = document.createElement("td");
        weekLabel.appendChild(weekLabelContainer);
        weekLabel.className = "weeknumber label";
        
    var headerRow = document.createElement("tr");
        headerRow.appendChild(weekLabel);
        
    for (var headers = 0; headers < 7; headers++) {
        var tempLabelTxt = document.createTextNode(this.dayOrder[headers].slice(0,3));
        
        var tempLabelContainer = document.createElement("div");
            tempLabelContainer.appendChild(tempLabelTxt);
            tempLabelContainer.className = "day";
            
        var tempLabel = document.createElement("td");
            tempLabel.className = "label";
            tempLabel.appendChild(tempLabelContainer);
            
        headerRow.appendChild(tempLabel);
    }
    
    return headerRow;
 
 }
 
 /**
  * 
  * @brief Generates the elements for the month table
  * 
  * This function generates the month, and also the days of the month. 
  * 
  * @return element Containing all the data of the table
  * 
  */
 Untropy.Month.prototype.generateMonth = function() {
    
    var maxIndex = 1000;
    var day = 1;
    
    // This would include the row for the day name abbreviations, and the week numbers
    var monthTable = document.createElement("table");
        monthTable.setAttribute("id", "Untropy.Calendar");
        monthTable.className = 'mCalendar';
        
    var tableBody = document.createElement("tbody");
    
    var headerRow = this.generateMonthHeader();
    
    tableBody.appendChild(headerRow);
    
    // set up the date iterator
    var endOfDays = this.date.getDaysInMonth() + 1;
    
    var iterMonth = this.date.getMonth();
    var iterYear = this.date.getFullYear();
    var dayIter = new Date(this.date);
        dayIter.setFullYear(iterYear, iterMonth, day);
    
    var foundFirstDay = false;
    
    this.days.clear();
    this.days[0] = null;
    
    for (var rows = 0; rows < 7 && day < endOfDays; rows++) {
        
        var tableRow = document.createElement("tr");
        
        for (var col = 0; col < 8 && day < endOfDays; col++ ) {
        
            var stringContainer;
            
            if (col == 0) {
                // First column, so make month of year cell... not a day cell
                
                stringContainer = document.createElement("div");
                stringContainer.className += "weeknumber ";
                
                var string = document.createTextNode(dayIter.getWeekNumber());
                stringContainer.appendChild(string);
                
            } else {
            
                if (rows == 0 && !foundFirstDay) {
                    
                    if (this.dayOrder[col-1] == dayIter.dayNames[dayIter.getDay()]) {
                        // column matches day of week number first time
                        
                        foundFirstDay = true;
                        
                    } else {
                        // Not a day, so make the div manually
                        
                        var string = document.createTextNode(" ");
                        stringContainer = document.createElement("div");
                        stringContainer.className = 'blank';
                        stringContainer.appendChild(string);
                            
                    }
                    
                }
                
                if (foundFirstDay) {
                
                    dayIter.setFullYear(iterYear, iterMonth, day)
                    var tempDay = new Untropy.Day(dayIter, this.monthSetup.SLOTS_PER_DAY);
                        tempDay.setTakesActivities(this.monthSetup.HAS_EVENTS);
                    this.days[day] = tempDay;
                    
                    stringContainer = tempDay.generateDay();
                    dayIter.setFullYear(iterYear, iterMonth, ++day);
                    
                }
                
            }
            
            var tempCell = document.createElement("td");
                tempCell.style.zIndex = maxIndex--;
                tempCell.appendChild(stringContainer);
                
            if (col == 0) {
                
                tempCell.className = "weeknumber cell";
                
            } else if (foundFirstDay) {
                
                tempCell.className = "cell";
                
            } else {
                
                tempCell.style.border = "0";
                
            }
            
            tableRow.appendChild(tempCell);
            
        }
        
        tableBody.appendChild(tableRow);
        
    }
    
    monthTable.appendChild(tableBody);
    
    return monthTable;
    
 }
 
 /**
  * 
  * @brief Get the week day Name of the month's date
  * 
  */
 Untropy.Month.prototype.getWeekDayName = function() {
   
    return this.dayNames[this.date.getDay()];
    
 }
 
 /**
  * 
  * @brief Returns the week number of the internal (or specified ) date value
  * @return weeknumber the week number that was corresponding to the date
  * 
  */
 Untropy.Month.prototype.getWeekNumber = function (optionalDate) {
    
    if (arguments.length < 1) {
        
        thisdate = this.date;
        
    } else {
        
        thisdate = optionalDate;
        
    }
    
    return thisdate.getWeekNumber();
    
 }
 
 /**
  * 
  * @brief Adds activity to the month
  * @return length of the activity list in 
  * 
  */
 Untropy.Month.prototype.addActivity = function (activity) {
    
    this.activityList.push(activity);
    return this.activityList[this.activityList.length-1];
 
 }
 
 /**
  * 
  * @brief Render the specified activity to the month display
  * 
  */
 Untropy.Month.prototype.printActivity = function (activity) {

    // if things occur today (end today), then do not end cap it
    var today = new Date();
    
    var m = this.getMonthDate();
    var preFirst = false;
    var postLast = false;
    
    var startRange = activity.getStartDate().getDate();
    var endRange = activity.getEndDate().getDate();
    
    // set the bounds
    if ((activity.getStartDate().getMonth() < m.getMonth())) {
        
        preFirst = true;
        startRange = 1;
        
    } else if ((activity.getStartDate().getFullYear() < m.getFullYear())) {
        
        preFirst = true;
        startRange = 1;
        
    }

    if ((activity.getEndDate().getMonth() > m.getMonth())) {
        
       postLast = true;
       endRange = m.getDaysInMonth();
        
    } else if ((activity.getEndDate().getFullYear() > m.getFullYear())) {
        
        postLast = true;
        endRange = m.getDaysInMonth();
        
    }
    
    // find the proper slot depth
    var depth = 1;
    for (var j = startRange; j < endRange+1; j++) {
        
        if (!this.days[j].isFreeSlot(depth)) {
            
            // if the slot is used, add one to the possible depth, and check from the beginning again
            depth++;
            j = startRange-1;
            
        }
        
    }
    
    // If the depth is too deep, gen. error, and skip this
    if (depth > this.monthSetup.SLOTS_PER_DAY) {
        
        Untropy.Error.maxSlotReached("You have exceeded the Maximum Spaces available for this Day: " + j);
        
    } else {
        
        // If it is not before the beginning of the month, cap it. Otherwise, just print a normal one
        if (!preFirst) {
            var startTarget = this.days[startRange].addActivity(activity.getId()+ startRange, 'start ' + activity.getType(), activity.getDesc(), activity.getDesc(), depth);
            
        } else {
            var startTarget = this.days[startRange].addActivity(activity.getId()+startRange, activity.getType(), activity.getDesc(), activity.getDesc(), depth);
            
        }
        Event.observe(startTarget, 'click', activity.eventFunc.bindAsEventListener(startTarget, activity));
        
        // fix iterate through the dates
        for (var i = startRange+1; i < endRange; i++) {
            var tempTarget = this.days[i].addActivity(activity.getId()+i, activity.getType(), '>>>', activity.getDesc(), depth);
    	    Event.observe(tempTarget, 'click', activity.eventFunc.bindAsEventListener(tempTarget, activity));
        }
        
        // If it is not past the end of the month, cap it. otherwise, just print a normal one
        if (!postLast) {
            
            if (activity.getStartDate().getDate() == activity.getEndDate().getDate()) {
                var endTarget = this.days[endRange].addActivity(activity.getId()+endRange, 'start end ' + activity.getType(), activity.getDesc(), activity.getDesc(), depth);
            } else {
                var endTarget = this.days[endRange].addActivity(activity.getId()+endRange, 'end ' + activity.getType(), activity.getDesc(), activity.getDesc(), depth);
            }
            
        } else {
            
            // case: what if the first day is the last day of the month?
            if (activity.getStartDate().getDate() == m.getDaysInMonth()) {
            	var endTarget = this.days[endRange].addActivity(activity.getId()+endRange, 'start ' + activity.getType(), activity.getDesc(), activity.getDesc(), depth);
            	
            } else {
            
            	var endTarget = this.days[endRange].addActivity(activity.getId()+endRange, activity.getType(), activity.getDesc(), activity.getDesc(), depth);
            }
        }
        Event.observe(endTarget, 'click', activity.eventFunc.bindAsEventListener(endTarget, activity));
    }
    
 }
 
 /**
  * 
  * @brief prints the list of activities from the month to the calendar
  * 
  */
 Untropy.Month.prototype.printActivities = function() {
    
    for (var i = 0; i < this.activityList.length; i++) {
        this.printActivity(this.activityList[i]);
    }
    
 }
 
 /**
  * 
  * @brief Gets the activity list from the Month
  * @return activityList the list of activities in the month
  * 
  */
 Untropy.Month.prototype.getActivityList = function() {
    
    // shows all the activities that are occurring for the given month, in some fashion
    return this.activityList;
    
 }
 
 /**
  * 
  * @brief Clear the months activity list
  * @return the list of the activities in the month
  * 
  */
 Untropy.Month.prototype.clearActivityList = function () {
 
    this.activityList.clear();
    return this.activityList;
    
 }

 /**
  * 
  * @class Untropy Day Object (Untropy.Day)
  * @brief creates the data and functions of the month's days. marks days in a special fashion
  * 
  */
 Untropy.Day = function(date, numSlots) {
    
    this.slotCount = numSlots;
    this.filledSlots = new Array();
    
    this.dayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    
    this.dayContainer = null;
    this.buttonContainer = null;
    
    this.isDayOff = false;
    this.isToday = false;
    
    this.year = date.getFullYear();
    this.month = date.getMonth();
    this.day = date.getDate();
    
    var today = new Date();
    if (this.year  == today.getFullYear() && this.month == today.getMonth() &&  this.day == today.getDate()) {
        
        this.isToday = true;
        
    }
    
    // sunday or saturday
    if (this.dayDate.getDay() == 0 || this.dayDate.getDay() == 6) {
        
        this.isDayOff = true;
       
    }
    
    for (var i = 0; i < numSlots; i++) {
        
        this.filledSlots[i] = false;
        
    }
    
    this.canTakeEvents = false;
    
    // and initialize the button container, so that buttons can be added whenever
    
    this.buttonContainer = document.createElement("div");
    this.buttonContainer.className = "day-title";
    
    var string = document.createTextNode(this.day);

    this.buttonContainer.appendChild(string);

    
 };
 
 /**
  * 
  * 
  * 
  */
 Untropy.Day.prototype.toString = function () {
    
    var string = new String("\n");
        string += "\nDate: " + this.year + "-" + this.month + "-" + this.day;
        string += "\nIs Day Off: " + this.isDayOff;
        string += "\nIs Today: " + this.isToday;
        string += "\nSlot Count: " + this.slotCount;
        string += "\nSlots:\n";
        string += this.generateSlotAllocation();
        string += "\n\n";
    
    return string;
    
 }
 
 /**
  * 
  * @brief Sets the day as able to receive activities
  * 
  */
 Untropy.Day.prototype.setTakesActivities = function (value) {
    
    this.canTakeEvents = (typeof value == "boolean") ?  value : false;
    
 }
 
 /**
  * 
  * @brief Adds a button to the day objects
  * @return element of the button, used to add events
  * 
  */
 Untropy.Day.prototype.addButton = function(btnText, btnTitle) {
    
    var button = document.createElement('span');
        button.className = 'button';
        button.innerHTML = btnText;
        button.setAttribute('title', btnTitle);
    
    return this.buttonContainer.appendChild(button);
    
 }

 /**
  * 
  * @brief Retrieve the container that holds the day
  * @return Container holding the details of the day
  * 
  */
 Untropy.Day.prototype.getContainer = function () {
 
    return this.dayContainer;
 
 }
 
  
 /**
  * 
  * @brief Get the date of the day
  * @return date of the day
  * 
  */
 Untropy.Day.prototype.getDayDate = function () {
    
    return this.dayDate;
    
 }
 
  
 /**
  * 
  * @brief Generate the content of the day and put it inside a self-contained element
  * @return container element with the data of the day
  * 
  */
 Untropy.Day.prototype.generateDay = function () {
 
    var dayStyle = "day ";
    this.dayContainer = document.createElement("div");
    if (this.isToday) {
        dayStyle += "today ";
    }
    
    if (this.isDayOff) {
        dayStyle += "non-work ";
    }
    
    this.dayContainer.className = dayStyle;
    this.dayContainer.appendChild(this.buttonContainer);
    
    // Now, insert the slots you made
    for (var i = 0; i < this.slotCount; i++) {
        
        var blankContent = document.createTextNode("\ ");
        var tempElem = document.createElement("div");
            tempElem.setAttribute("id", this.getDayDate().getDate()+"_"+(i+1));
            tempElem.className = "slot";
            tempElem.appendChild(blankContent);
            
        this.dayContainer.appendChild(tempElem);
        
    }
    
    return this.dayContainer;
 
 }
 
 /**
  * 
  * @brief checks to see if a particular day is actually 'today'
  * @return boolean representing the status of isToday
  * 
  */
 Untropy.Day.prototype.markedAsToday = function () {
 
    return this.isToday;
 
 }
 
 /**
  * 
  * @brief checks to see if a particular day is actually a holiday
  * @return boolean representing the status of isHoliday
  * 
  */
 Untropy.Day.prototype.markedAsHoliday = function () {
 
    return this.isDayOff;
 
 }
 
 /**
  * 
  * @brief Adds an activity component to a day element, in the specified slot
  * @return activitycontainer created at insertion
  * 
  */
 Untropy.Day.prototype.addActivity = function (actId, actType, message, altText, slot) {
    
    // get the destination slot (day of month_slot number)
    var myContainer = $(this.getDayDate().getDate() + "_" + slot);
        myContainer.innerHTML = "";
        myContainer.className = "slot ";
    
    var newActContainer = document.createElement("div");
        newActContainer.className = "event " + actType;
        newActContainer.setAttribute("id", actId);
        newActContainer.setAttribute("title", altText);
        
    var contents = document.createTextNode(message);
    
    newActContainer.appendChild(contents);
    
    myContainer.appendChild(newActContainer);
    
    this.filledSlots[slot-1] = true;
    
    // Return the activity Container
    return newActContainer;
 }
 
 /**
  * 
  * @brief Determine if the specified day is a free slot
  * @return status if the slot is free or not
  * 
  */
 Untropy.Day.prototype.isFreeSlot = function (slotNumber) {
 
    return !this.filledSlots[slotNumber-1];
    
 }
 
 /**
  * 
  * @brief Generate the text for the slot allocation of the current day
  * @return text describing the slot allocation
  * 
  */
 Untropy.Day.prototype.generateSlotAllocation = function () {
    var message = new String();
    for (var i = 0; i < this.filledSlots.length; i++) {
        
        message += (i+1) + ": " + this.filledSlots[i] + "\n";
        
    }
    return message;
 }
 
 /**
  * 
  * @class Untropy Calendar Activity Object
  * @brief Sets up the basic data for the activity. 
  * 
  * Takes the data from the passed in JSON data, and creates a new object from that data.
  * Date parameters are evaluated, which allows for many formats of date or null.
  * 
  */
 Untropy.Activity = function(jsonValueObj) {
    
    this.actId            = jsonValueObj.actId;
    this.actType       = jsonValueObj.actType;
    this.description   = jsonValueObj.description;
    
    // end date can be null, which means whatever it is continues into present (e.g. person is sick)
    
    var start  = jsonValueObj.startDate;
    var end    = jsonValueObj.endDate;
    
    if (start > end) {
        this.startDate   = end;
        this.endDate     = start;
    } else {
        this.startDate   = start;
        this.endDate     = end;
    }

    this.rangeInDays   = this.setRange();
    
    // Default activity function is null
    this.eventFunc     = function () { return; };
    
 };
 
 /**
  * 
  * @brief Adds an event handler to activity section clicks
  * 
  * This function attaches an event to the activities created. When it attaches the event
  * a handler function will take two parameters: the event itself, and the activity clicked.
  * Any custom set of actions can then be performed from it.
  * 
  */
 Untropy.Activity.prototype.onActivityClick = function (funcToAdd) {
 	
    if (typeof funcToAdd != "undefined") {
        this.eventFunc = funcToAdd;
 	}
 }
 
 /**
  * 
  * @brief Generate the details of the activity
  * @return text representing the activity
  * 
  */
 Untropy.Activity.prototype.toString = function () {
    
    var displayString = new String("Activity \n");
    
    displayString += "Id: " + this.actId + "\n";
    displayString += "Type: " + this.actType + "\n";
    displayString += "Description: " + this.description + "\n";
    displayString += "Start: " + this.startDate + "\n";
    displayString += "End: " + this.endDate + "\n";
    displayString += "Range: " + (this.rangeInDays+1) + "\n\n";
    
    return displayString;
 }

 /**
  * 
  * @brief Gets the start date
  * @return startDate the start date of the activity
  * 
  */
 Untropy.Activity.prototype.getStartDate = function () {
    
    return this.startDate;
    
 }
 
 /**
  * 
  * @brief sets the start date
  * @return startDate or false, if the date cannot be set for whatever reason
  * 
  */
 Untropy.Activity.prototype.setStartDate = function (dateToSet) {
    
    if (typeof dateToSet == "Date") {
       
       this.startDate = dateToSet;
       this.setRange();
       
       return this.startDate;
       
    } else {
       return false;
    }
    
 }
 
 /**
  * 
  * @brief get the end date of the activity
  * @return EndDate (if it is null, returns the current date, else the end date specified
  * 
  */
 Untropy.Activity.prototype.getEndDate = function () {
    
    return (this.endDate == null) ? new Date() : this.endDate;
    
 }
 
 /**
  * 
  * @brief set the end date of the activity
  * @return endDate or false, if the date cannot be set for some reason
  * 
  */
 Untropy.Activity.prototype.setEndDate = function (dateToSet) {
    
    if (typeof dateToSet == "Date") {
        
        this.endDate = dateToSet;
        this.setRange();
        
        return this.endDate;
    } else {
        return false;
    }
    
 }
  
 /**
  * 
  * @brief retrieve the date range from the activity
  * @return rangeInDays the range in days
  * 
  */
 Untropy.Activity.prototype.getRange = function () {
    
    return this.rangeInDays;
    
 } 
 
 /**
  * 
  * @brief set the date range in days (count)
  * @return days number of days
  * 
  */
 Untropy.Activity.prototype.setRange = function () {
    
    var s = this.startDate;
    
    if (this.endDate != null) {
       var e = this.endDate;
    } else {
       var e = new Date();
    }
   
    var start = Date.UTC(s.getFullYear(), s.getMonth(), s.getDate(), 0, 0, 0);
    var end = Date.UTC(e.getFullYear(), e.getMonth(), e.getDate(), 0, 0, 0);
    
    this.rangeInDays = ((end-start)/this.startDate.msInDay)+1;
    
    return this.rangeInDays;
    
 }
 
 /**
  * 
  * @brief retrieve the type of the activity
  * @return type the freeform type of the activity (string)
  * 
  */
 Untropy.Activity.prototype.getType = function () {
    
    return this.actType;
    
 }
 
 /**
  * 
  * @brief sets the type of the activity, as specified by the user
  * @return type set-type of the activity, a freeform text description of the type
  * 
  */
 Untropy.Activity.prototype.setType = function (typeOfActivity) {
    
    this.actType = typeOfActivity;
    return this.actType;
    
 }
 
 /**
  * 
  * @brief retrieves the description of the activity
  * @return description the description of the activity
  * 
  */
 Untropy.Activity.prototype.getDesc = function () {
    
    return this.description;
    
 }
 
 /**
  * 
  * @brief Sets the description of the Activity
  * @return the copied in Description of the activity
  * 
  */
 Untropy.Activity.prototype.setDesc = function (desc) {
    
    this.description = desc;
    return this.description;
    
 }
 
 /**
  * 
  * @brief retrieves the activity's id
  * @return id the id of the activity
  * 
  */
 Untropy.Activity.prototype.getId = function () {
    
    return this.actId;
    
 }
 
 /**
  * 
  * @brief set the id of an activity
  * @return id the value of the id field after the assignment has been made.
  * 
  */
 Untropy.Activity.prototype.setId = function (newId) {
    
    this.actId = newId;
    return this.actId;
    
 }
