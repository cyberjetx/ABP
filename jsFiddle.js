

Date.prototype.customFormat = function (formatString) {
    var YYYY, YY, MMMM, MMM, MM, M, DDDD, DDD, DD, D, hhh, hh, h, mm, m, ss, s, ampm, AMPM, dMod, th;
    var dateObject = this;
    YY = ((YYYY = dateObject.getFullYear()) + "").slice(-2);
    MM = (M = dateObject.getMonth() + 1) < 10 ? ('0' + M) : M;
    MMM = (MMMM = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][M - 1]).substring(0, 3);
    DD = (D = dateObject.getDate()) < 10 ? ('0' + D) : D;
    DDD = (DDDD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dateObject.getDay()]).substring(0, 3);
    th = (D >= 10 && D <= 20) ? 'th' : ((dMod = D % 10) == 1) ? 'st' : (dMod == 2) ? 'nd' : (dMod == 3) ? 'rd' : 'th';
    formatString = formatString.replace("#YYYY#", YYYY).replace("#YY#", YY).replace("#MMMM#", MMMM).replace("#MMM#", MMM).replace("#MM#", MM).replace("#M#", M).replace("#DDDD#", DDDD).replace("#DDD#", DDD).replace("#DD#", DD).replace("#D#", D).replace("#th#", th);

    h = (hhh = dateObject.getHours());
    if (h == 0) h = 24;
    if (h > 12) h -= 12;
    hh = h < 10 ? ('0' + h) : h;
    AMPM = (ampm = hhh < 12 ? 'am' : 'pm').toUpperCase();
    mm = (m = dateObject.getMinutes()) < 10 ? ('0' + m) : m;
    ss = (s = dateObject.getSeconds()) < 10 ? ('0' + s) : s;
    return formatString.replace("#hhh#", hhh).replace("#hh#", hh).replace("#h#", h).replace("#mm#", mm).replace("#m#", m).replace("#ss#", ss).replace("#s#", s).replace("#ampm#", ampm).replace("#AMPM#", AMPM);
}

function dtMe() {
    $('#myFiddles').DataTable({
        "sDom": 'T<"clear">lfrtip'
        , "order": [[2, "desc"]]
        , "sPaginationType": "full_numbers"
        , "aLengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]]
        , "iDisplayLength": -1
        , "oTableTools": {
            "aButtons": [
                "pdf",
                "copy",
                "print", {
                    "sExtends": "collection",
                    "sButtonText": "Save",
                    "aButtons": ["csv", "xls", "pdf"]
                }]
        }
    });
}

function GetFiddles(start, limit, end) {
        //var user = "http://jsfiddle.net/user/get_username/";
    var url = 'http://jsfiddle.net/api/user/Cyberjetx/demo/list.json?callback=?&start=' + start + '&limit=' + limit; //&sort=created
    console.log("url: " + url);

    $.getJSON(url, function (data) {
        var box = $('#myFiddlesBod');
        var list = data.list;
        var title, description, created, framework, url, version;

        var item;
        var output = "";

        for (i = 0; i < list.length; i++) {
            item = list[i];
            created = item.created;
            description = item.description;
            framework = item.framework;
            version = item.latest_version;
            title = item.title;
            url = item.url;

            var fmtdDate = new Date(created.substring(0, 10)).customFormat("#MM#/#DD#/#YYYY#");

            output += "<tr class='entry'>";
            output += "<td><a target='_blank' href='" + url + version + "/'><span class='link'>" + title + "</span></a></td>";
            output += "<td>" + version + "</td>";
            output += "<td>" + fmtdDate + "</td>";
            output += "<td>" + framework + "</td>";
            output += "<td>" + description + "</td>";
            output += "</tr>";
        }

        box.append(output);

        var currentFiddle = start + limit;
        if (data.overallResultSetCount > currentFiddle) {

            if (currentFiddle + 100 > data.overallResultSetCount) {
                GetFiddles(currentFiddle, 100, true);
            } else {
                GetFiddles(currentFiddle, 100);    
            }
        }

        if (end === true) {
            dtMe();    
        }
        
    });


}

function GetCount() {

    var url = "http://jsfiddle.net/api/user/Cyberjetx/demo/list.json?callback=?&start=0&limit=0";
    var retVal = 0;

    $.getJSON(url, function (data) {
        retVal = data.overallResultSetCount;
    });
    return retVal;
}



$(document).ready(function () {

    GetFiddles(0, 100);

});

