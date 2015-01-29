// demurrage_demo.js - demonstrate 2-way demurrage/interest conversions
// Requires: jQuery, ripple-lib

var ADDRESS_ONE = "rrrrrrrrrrrrrrrrrrrrBZbvji";
var Amount = ripple.Amount;
var Currency = ripple.Currency;

$(document).ready(function() {
    //fill in some stuff on page load
    $("#to_display").click(calc_to_display);
    $("#time_to_now_1").click(time_to_now);
    $("#cur_1").change(gen_curcode);
    $("#rate_1").change(gen_curcode);
    
    time_to_now();
    $("#display_datetime_1").datetimepicker({
        format: "yyyy-mm-ddThh:ii:ssZ"
    });
});

function calc_to_display() {
    ref_time = get_ref_time();
    curcode = gen_curcode();
    ledger_amount = get_ledger_amount();
    
    demAmount = Amount.from_json(ledger_amount+"/"+curcode+"/"+ADDRESS_ONE);
    demAmount = demAmount.applyInterest(ref_time);
    
    if (demAmount === undefined ) {
        alert("Error: ripple-lib failed to calculate interest. Maybe not a valid date?");
    }
    
    set_display_amount(demAmount.to_json().value);
}

function calc_to_ledger() {
    //TODO
}


function gen_curcode() {
    threeletters = $("#cur_1").val();
    rate = $("#rate_1").val();
    c = Currency.from_json(threeletters+" ("+rate+"%pa)");
    
    if (c.is_valid()) {
        $("#hex_1").val(c.to_hex());
        return c.to_hex();
    } else {
        $("#hex_1").val("(Invalid currency/rate)");
        return false;
    }
}

function get_ledger_amount() {
    var ledger_val = $("#ledger_val_1").val();
    var test = Amount.from_json(ledger_val+"/2/1");
    if (!test.is_valid()) {
        alert("Error: Invalid ledger value");
    }
    return test.to_text();//normalized string
}

function set_ledger_amount(value) {
    $("#ledger_val_1").val(value);
}

function set_display_amount(value) {
    $("#display_val_1").val(value);
}

function get_ref_time() {
    t_string = $("#display_datetime_1").val();
    t_date = new Date(t_string);
    
    if (t_date === undefined) {
        alert("Error: invalid reference time");
    }
    
    return t_date;
}

function time_to_now() {
    t = new Date();
    $("#display_datetime_1").val( t.toISOString() );
}

