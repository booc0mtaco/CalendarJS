/**
 * 
 * @brief Extensions to the Date Object in Javascript
 * @author Andrew Holloway
 * @date 04/24/2007
 * 
 * These are some ease-of-use additions to the Date Object
 * 
 */
 
 Date.prototype.msInDay = 86400000;
 Date.prototype.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
 Date.prototype.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
 
 /**
  * 
  * @brief Retrieves the month Name (specified in Date.monthNames) of the date values' current month
  * 
  */
 Date.prototype.getMonthName = function() {
    
    return this.monthNames[this.getMonth()];
    
 }
 
 /**
  * 
  * @brief Retrieves the name of the day of the week for the current Date Object
  * 
  */ 
 Date.prototype.getDayName = function() {
    
    return this.dayNames[this.getDay()];
    
 }
 
 /**
  * 
  * @brief Retrieves the maximum number of days in the month.
  * 
  */
 Date.prototype.getDaysInMonth = function () {
 
    var year = this.getFullYear();
    var month = this.getMonth();
    
    // In javascript, if we put more days than are possible, it will go the next month
    // In the case of months with 31 days, it will be the first of the following month (32 - 1)
    // In the case of months with 30 days, it will be the second of the following month (32 - 2)
    return 32 - new Date(year, month, 32).getDate();
 
 }
 
 /**
  * 
  * @brief Retrieves the week number of the day based on the date values' current date
  * 
  */
 Date.prototype.getWeekNumber = function() {
 
    // get the details from the date object's values
    var year = this.getFullYear();
    var month = this.getMonth();
    var day = this.getDate();
    
    // get the epoch value for the date object's date
    var now = Date.UTC(year, month, (day+1), 0, 0, 0);
    
    // get the date value of the current year, first day
    var firstDay = new Date();
    firstDay.setFullYear(year);
    firstDay.setMonth(0);
    firstDay.setDate(1);
    
    // get the epoch value for the current year, first day
    var then = Date.UTC(year, 0, 1, 0, 0, 0);
    
    // by ISO standards, the first week with a thursday is the first week fo the year
    // if the weekday is thursday or higher
    var isoFirstWeek = firstDay.getDay();
    if (isoFirstWeek > 3) 
        isoFirstWeek -= 4;
    else
        isoFirstWeek += 3;
    
    // get the number of milliseconds between today and the first day of the current year
    // then, convert to days
    // add the iso Correction
    // and divide by 7 to make sure you get the number of weeks
    var noOfWeek = Math.round((((now-then)/firstDay.msInDay)+isoFirstWeek)/7);
    
    var weekNoString = new String(noOfWeek);
    if (noOfWeek < 10) {
        
        weekNoString = '0' + weekNoString;
        
    }
    
    return weekNoString;
 
 }
