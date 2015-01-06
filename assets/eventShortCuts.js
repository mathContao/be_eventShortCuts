
/* öffnet den Kalender */
function openCalendar(elem){
    jQuery(elem).trigger("click");
}

/* schließt den Kalender */
function closeCalendar() {
    jQuery("body").trigger("click");
}

/* lädt den Kalender neu */
function reloadCalendar(elem) {
    closeCalendar();
    openCalendar(elem);
}

jQuery( document ).ready(function( jQuery ) {

        /* Cookie löschen und neu setzen. Cookie enthält das letzte Datum (Taste L) */
	jQuery('#ctrl_endDate, #ctrl_startDate').blur ( function() {
		document.cookie = "lastDate=; expires=Thu, 01 Jan 1970 00:00:00 UTC"; 
		document.cookie="lastDate="+jQuery(this).val();
	
	});

        /* Key-Listener */
	jQuery('#ctrl_endDate').keyup( function(e){ 
		var date1InputId = 'ctrl_startDate'; // Bezugsdatum
		var date2InputId = 'ctrl_endDate'; // Eingabefeld

		var date1InputValue = jQuery( '#'+date1InputId ).val();
		var date2InputValue = jQuery( '#'+date2InputId ).val();

		var key = (jQuery(this).val());

		if ( e.shiftKey ) {
			var code = (e.keyCode ? e.keyCode : e.which);
			if (code == 40) {
				// Pfeiltaste nach unten
				key = ">";
			} else if (code == 38) {
				// Pfeiltaste nach oben
				key = "<";
			}
			
		}

		
		jQuery('#'+date2InputId).val( shortCuts(date1InputValue, date2InputValue, key ) );
                reloadCalendar("#toggle_endDate");
	});


        /* Key-Listener */
	jQuery('#ctrl_startDate').keyup( function(e){ 
		var date1InputId = 'ctrl_endDate'; // Bezugsdatum
		var date2InputId = 'ctrl_startDate'; // Eingabefeld

		var date1InputValue = jQuery( '#'+date1InputId ).val();
		var date2InputValue = jQuery( '#'+date2InputId ).val();

		var key = (jQuery(this).val());	


		if ( e.shiftKey ) {
			var code = (e.keyCode ? e.keyCode : e.which);
			if (code == 40) {
				// Pfeiltaste nach unten
				key = ">";
			} else if (code == 38) {
				// Pfeiltaste nach oben
				key = "<";
			}
			
		}

		jQuery('#'+date2InputId).val( shortCuts(date1InputValue, date2InputValue, key ) );
                reloadCalendar("#toggle_startDate");

	});
	
	
	/* autocomplete ausschalten, wenn shift-taste gedrückt */
	jQuery( '#ctrl_startDate, #ctrl_endDate' ).keydown( function(e){ 
		if ( e.shiftKey ) {
			jQuery( '#ctrl_startDate, #ctrl_endDate' ).attr("autocomplete","off");
		}
	});
	
        /* autocomplete einschalten */
	jQuery( '#ctrl_startDate, #ctrl_endDate' ).keyup( function(e){ 		
		var code = (e.keyCode ? e.keyCode : e.which);
		if (code == 16) {
			jQuery( '#ctrl_startDate, #ctrl_endDate' ).removeAttr("autocomplete");
		}
	});


/* Wenn aktive Eingabemaske, dann öffne Kalender */
jQuery('#ctrl_startDate,#ctrl_endDate').focus( function(e){
    openCalendar("#toggle_startDate");
    
});

/* Wenn aktive Eingabemaske, dann öffne Kalender */
jQuery('#ctrl_endDate').focus( function(e){
    openCalendar("#toggle_endDate");
    
});

/* Wenn Eingabemaske verlassen wird, dann schließe Kalender */
jQuery('#ctrl_startDate,#ctrl_endDate').blur( function(e){
    closeCalendar();    
});




});





function shortCuts(date1InputValue, date2InputValue, key ) {

	if ( key.indexOf('#') > -1 ) {
		return "";
	}

	var dateNew = date2InputValue;

	if (date1InputValue.length != 10 && key != "t") {
		// wenn kein Bezugsdatum vorhanden ist, dann abbrechen
		// wenn t, dann nicht abbrechen (Heute-Datum setzen, kein Bezugsdatum benoetigt)
		return dateNew;
	}
	
	
	
	switch (key.substring(0,1)) {
		case "=": // gleiches Datum wie im anderen Feld
			dateNew = dateCalc( date1InputValue, 0, 0, 0 );
			break;
		case "+": // + Tage (0 bis 9)
			if (key.length>1 && !isNaN(key)) {
				dateNew = dateCalc( date1InputValue, 0, 0, parseInt(key) );
			}
			break;
		case "-": // - Tage (0 bis 9)
			if (key.length>1 && !isNaN(key)) {
				dateNew = dateCalc( date1InputValue, 0, 0, parseInt(key) );
			}
			break;
		case "<": // +1 Tag im selben Feld
			dateNew = dateCalc( date2InputValue, 0, 0, 1 ) ;
			break;
		case ">": // -1 Tag im selben Feld
			dateNew = dateCalc( date2InputValue, 0, 0, -1 ) ;
			break;
		case "t": // today = heutiges Datum
			dateNew = dateCalc( 0, 0, 0, 0 ) ;
			break;
		case "y": // year = yearJJJJ = 4stelliges Jahr
			if ((key.length > 4) && !isNaN(key.substring(1,5))) {
				dateNew = "01.01."+parseInt(key.substring(1,5));
			}
			break;
		case "l": // last = letztes Datum verwenden (nutzt Cookies)
			dateNew = getCookie('lastDate');
		default:
	}
	
	switch (key.substring(0,2)) {
		case "++": // +1 Tag
			dateNew = dateCalc( date1InputValue, 0, 0, 1 );
			break;
                case "--": // -1 Tag
			dateNew = dateCalc( date1InputValue, 0, 0, -1 );
			break;
		case "+d": // +d### = + ### Tage (zwingend dreistellig)
			if (key.length>4 && !isNaN(key.substring(2,6))) {
				dateNew = dateCalc( date1InputValue, 0, 0, parseInt(key.substring(2,6)) );
			}
			break;
		case "-d": // -d### = - ### Tage (zwingend dreistellig)
			if (key.length>4 && !isNaN(key.substring(2,6))) {
				dateNew = dateCalc( date1InputValue, 0, 0, -1*parseInt(key.substring(2,6)) );
			}
			break;
		default:
	}
	
	return dateNew;

}

/*
 * calculate year, month, days to date1
 * @param date1 String DD.MM.YY
 * @return date (String DD.MM.YY)
*/
function dateCalc( date1, years, months, days ) {
	
	
	if (date1 != 0) {
		var datumOrg = date1;
		
		var year = parseInt(datumOrg.substring(6)); 	
		var month = parseInt(datumOrg.substring(3,5)); 	
		var day = parseInt(datumOrg.substring(0,2)); 

		var datum = new Date(year,month-1,day);
	}
	else {
		var datum = new Date();
	}

	
	var datum2 = new Date(datum.getTime()+days*24*60*60*1000);
	
	return (datum2.getDate()+100+"").substring(1,3)+"."+(datum2.getMonth()+101+"").substring(1,3)+"."+datum2.getFullYear();
}



/* read cookie
 * @param cname Cookiename
 * @return value (String)
 *   */
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
} 





