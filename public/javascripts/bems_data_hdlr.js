function ajax_data() {

   let str_id = Number(document.getElementById("str_id").value)
   let str_lbl = str_id + 1
  
   if ( ! ( str_id >= 0 && str_id <= 3 ) ) {
         console.error('str_id outside range 0 to 3 = ',str_id)
         alert('str_lbl outside range 1 to 4 = ' + str_lbl)
         // Maybe a redirect here...
         return
   }
   
   let host = window.location.hostname
   let proto = window.location.protocol
   let port = window.location.port
   let url = `${proto}//${host}:${port}/xhr/str/${str_lbl}`;

   var xhr = $.ajax({
         url: url,
         success: function(data){ 

            if ( data['error'] ) {
               this.error(this.xhr,this.textStatus,data['error'])
               return
            }

            // --- Process Data ----
            for (let series in data) {
               for (let key in data[series]) {
                  let td = document.getElementById(key)
                  if ( td != null ) {
                     td.innerHTML = data[series][key]
                  }
               }
            }

            // highlights
            let spHighVolt = document.getElementById("spHighVolt").value
            let spLowVolt = document.getElementById("spLowVolt").value
            let numHighVolt = 0
            let numLowVolt  = 0
            for ( let key in data['volts']){
               let td = document.getElementById(key)
               if ( td != null ){
                  td.style.backgroundColor  = "forestgreen"
                  if (data['volts'][key] >= spHighVolt){
                     td.style.backgroundColor  = "#EE2222"
                     numHighVolt++
                  }else if ( data['volts'][key] <= spLowVolt ){
                     td.style.backgroundColor  = "#DDDD11"
                     numLowVolt++
                  } 
               } 
            }

            let numEl = document.getElementById('numHighVolt')
            if ( numEl != null ) numEl.innerHTML = numHighVolt
            
            numEl = document.getElementById('numLowVolt')
            if ( numEl != null ) numEl.innerHTML = numLowVolt

            let numHighTemp = 0
            let spHighTemp = document.getElementById("spHighTemp").value
            for ( let key in data['temperature']){
               let td = document.getElementById(key)
               if ( td != null ){
                  td.style.backgroundColor  = "forestgreen"
                  if (data['temperature'][key] >= spHighTemp){
                     td.style.backgroundColor  = "#EE2222"
                     numHighTemp++
                  } 
               } 
            }
            
            numEl = document.getElementById('numHighTemp')
            if ( numEl != null ) numEl.innerHTML = numHighTemp

         },
         complete: function(){
            setTimeout(ajax_data,5000)
         },
         error: function (jqXhr, textStatus, errorMessage) {
            alert('Ajax Error! ' + errorMessage);
         },
         timeout:30000,
         dataType: 'json',        
   });
}

function get_home_data() {

}
/* function get_str_data() {

   //$.get("http://perlworks.com:8086/query?pretty=true&db=bems&q=SELECT+*+FROM+volts+limit+1").done(
   //function (data) { var d = data["results"][0]["series"][0]["values"][0][1]; alert(d); 
   // });
   ajax_repeat();
   ajax_max();
}

function ajax_repeat(){
   str_select = Array();
   str_select[0] = "v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11,v12,v13,v14,v15,v16,v17,v18,v19,v20,v21,v22,v23,v24,v25,v26,v27,v28,v29,v30,v31,v32,v33,v34,v35,v36,v37,v38,v39,v40,v41,v42,v43,v44,v45,v46,v47,v48,v49,v50,v51,v52,v53,v54,v55,v56,v57,v58,v59,v60,v61,v62,v63,v64,v65,v66,v67,v68,v69,v70"
   str_select[1] = "v71,v72,v73,v74,v75,v76,v77,v78,v79,v80,v81,v82,v83,v84,v85,v86,v87,v88,v89,v90,v91,v92,v93,v94,v95,v96,v97,v98,v99,v100,v101,v102,v103,v104,v105,v106,v107,v108,v109,v110,v111,v112,v113,v114,v115,v116,v117,v118,v119,v120,v121,v122,v123,v124,v125,v126,v127,v128,v129,v130,v131,v132,v133,v134,v135,v136,v137,v138,v139,v140"
   str_select[2] = "v141,v142,v143,v144,v145,v146,v147,v148,v149,v150,v151,v152,v153,v154,v155,v156,v157,v158,v159,v160,v161,v162,v163,v164,v165,v166,v167,v168,v169,v170,v171,v172,v173,v174,v175,v176,v177,v178,v179,v180,v181,v182,v183,v184,v185,v186,v187,v188,v189,v190,v191,v192,v193,v194,v195,v196,v197,v198,v199,v200,v201,v202,v203,v204,v205,v206,v207,v208,v209,v210"
   str_select[3] = "v211,v212,v213,v214,v215,v216,v217,v218,v219,v220,v221,v222,v223,v224,v225,v226,v227,v228,v229,v230,v231,v232,v233,v234,v235,v236,v237,v238,v239,v240,v241,v242,v243,v244,v245,v246,v247,v248,v249,v250,v251,v252,v253,v254,v255,v256,v257,v258,v259,v260,v261,v262,v263,v264,v265,v266,v267,v268,v269,v270,v271,v272,v273,v274,v275,v276,v277,v278,v279,v280"
   var url = `http://perlworks.com:8086/query?pretty=true&db=bems&q=SELECT+${str_select[0]}+FROM+volts+limit+1`;

   console.log(url)

   $.ajax({url: url, 
           success: function(d){ 
            var col = d["results"][0]['series'][0]['columns'] 
            var val = d["results"][0]['series'][0]['values'][0] 
            console.log(col) 
            console.log(val) 

            for (var i=1;i<=270;i++) {

               var td = document.getElementById(col[i])
               if ( td != null ) {
                  td.innerHTML = val[i]
               }
            }
            
           },
           complete: function(){
            setTimeout(ajax_repeat,50000)
           },
           error: function (jqXhr, textStatus, errorMessage) { // error callback 
           alert('Error: ' + errorMessage); },
           timeout:500000,
           dataType: 'json',        
   });
};

function ajax_max(){
   str_select = Array();
   str_select[0] = "v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11,v12,v13,v14,v15,v16,v17,v18,v19,v20,v21,v22,v23,v24,v25,v26,v27,v28,v29,v30,v31,v32,v33,v34,v35,v36,v37,v38,v39,v40,v41,v42,v43,v44,v45,v46,v47,v48,v49,v50,v51,v52,v53,v54,v55,v56,v57,v58,v59,v60,v61,v62,v63,v64,v65,v66,v67,v68,v69,v70"
   str_select[1] = "v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11,v12,v13,v14,v15,v16,v17,v18,v19,v20,v21,v22,v23,v24,v25,v26,v27,v28,v29,v30,v31,v32,v33,v34,v35,v36,v37,v38,v39,v40,v41,v42,v43,v44,v45,v46,v47,v48,v49,v50,v51,v52,v53,v54,v55,v56,v57,v58,v59,v60,v61,v62,v63,v64,v65,v66,v67,v68,v69,v70"
   str_select[2] = "v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11,v12,v13,v14,v15,v16,v17,v18,v19,v20,v21,v22,v23,v24,v25,v26,v27,v28,v29,v30,v31,v32,v33,v34,v35,v36,v37,v38,v39,v40,v41,v42,v43,v44,v45,v46,v47,v48,v49,v50,v51,v52,v53,v54,v55,v56,v57,v58,v59,v60,v61,v62,v63,v64,v65,v66,v67,v68,v69,v70"
   str_select[3] = "v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11,v12,v13,v14,v15,v16,v17,v18,v19,v20,v21,v22,v23,v24,v25,v26,v27,v28,v29,v30,v31,v32,v33,v34,v35,v36,v37,v38,v39,v40,v41,v42,v43,v44,v45,v46,v47,v48,v49,v50,v51,v52,v53,v54,v55,v56,v57,v58,v59,v60,v61,v62,v63,v64,v65,v66,v67,v68,v69,v70"
   var url = `http://perlworks.com:8086/query?pretty=true&db=bems&q=SELECT+${str_select[0]}+FROM+volts+order+by+limit+10`;

   console.log(url)

   $.ajax({url: url, 
           success: function(d){ 
            var col = d["results"][0]['series'][0]['columns'] 
            var val = d["results"][0]['series'][0]['values'][0] 
            console.log(col) 
            console.log(val) 

            for (var i=1;i<=270;i++) {

               var td = document.getElementById(col[i])
               if ( td != null ) {
                  td.innerHTML = val[i]
               }
            }
            
           },
           complete: function(){
            setTimeout(ajax_repeat,50000)
           },
           error: function (jqXhr, textStatus, errorMessage) { // error callback 
           alert('Error: ' + errorMessage); },
           timeout:500000,
           dataType: 'json',        
   });
}; */

// Global used by getSetPoints() and setSetPoints()
// Defaults
var spHsh = {}
spHsh['spHighVolt'] = 13
spHsh['spLowVolt']  = 12
spHsh['spHighVoltChrg'] = 13
spHsh['spLowVoltChrg']  = 12
spHsh['spHighTemp'] = 80

// -----------------------------------
function getSetPoints() {

   let keys = Object.keys(spHsh);
   for(let i = 0; i< keys.length;i++) {

      let val = readCookie(keys[i])
     
      if ( (! isNaN(val)) && (val>1) ) {
         spHsh[keys[i]] = val
      }
 
      // generic for all pages
      let spEl = document.getElementById(keys[i])

      if ( spEl != null ) {
         spEl.value = spHsh[keys[i]]
      }
   }
}


// ------------------------------------
// --- Form Handlers ------------------
// ------------------------------------
$( document ).ready( () => {
  
   // Set Point Change
   $(".spVal").change( () => {

      let keys = Object.keys(spHsh);
      for(let i = 0; i< keys.length;i++) {
         if ( $("#"+keys[i] )) {
            let val = $("#"+keys[i] ).val()
          
            if ( ! isNaN(val) ) {
               writeCookie(keys[i],val)
            }
         }
      }

      ajax_data();
   })

}) // Form Handler 


// ---------- Cookie Utils ------------------------
function writeCookie(name, value, days) {

       var expires = "";

        if (days) {
           var date = new Date();
           date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
           expires = "; expires=" + date.toGMTString();
       }

       document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {

        var nameEQ = name + "=";
        var ca = document.cookie.split(";");

        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }

        return null;
}

function eraseCookie (name) {
        Cookie.create(name, "", -1);
}
