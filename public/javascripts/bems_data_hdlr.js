const host = window.location.hostname
const proto = window.location.protocol
const port = window.location.port
var url_srv = `${proto}//${host}:${port}`;
var timeoutId

// global var used to associate a page with its xhr call
// See assignment in html (jade) page 
var data_xhr

// Used by all pages to display spinner and time
let spin = ['|','/','—','\\']
let spinCnt = 0
function spinner(time) {
   let timeThreshold = 20000 // 20 seconds 

   let spnId = document.getElementById('spn')
   if ( spnId != null ) {
      spnId.innerHTML = spin[spinCnt]
      spinCnt++
      spinCnt = spinCnt % 4

      spnId.classList.remove('bg-danger')
      spnId.classList.add('bg-success')
   }

   if ( time ) {
      let diff = new Date() - new Date(time)
      if ( diff > timeThreshold ){
         timeFmt.classList.remove('bg-success')
         timeFmt.classList.add('bg-danger')
      } else {
         timeFmt.classList.add('bg-success')
         timeFmt.classList.remove('bg-danger')
      }
   }

   let timeId = document.getElementById('timeFmt')
   if ( timeId != null ) {
   
   }
}

function spinnerX() {

   let spnId = document.getElementById('spn')
   if ( spnId != null ) {
      spnId.innerHTML = 'X'
      spnId.classList.remove('bg-success')
      spnId.classList.add('bg-danger')
   }
}

// ------------------------- get functions--------------------
// -- get xhr data for the various screens
// -----------------------------------------------------------

// ------------------------- String --------------------------
function get_str_data() {

   let str_id = Number(document.getElementById("str_id").value)
   let str_lbl = str_id + 1
  
   if ( ! ( str_id >= 0 && str_id <= 3 ) ) {
         console.error('str_id outside range 0 to 3 = ',str_id)
         alert('str_lbl outside range 1 to 4 = ' + str_lbl)
         // Maybe a redirect here...
         return
   }

   const url = `${url_srv}/xhr/str/${str_lbl}`;
   
   var xhr = $.ajax({
         url: url,
         success: function(data){ 

            if ( data['error'] ) {
               this.error(this.xhr,this.textStatus,data['error'])
               return
            }

            // --- Dispaly Data ----
            var dh = dataHdlr()
            dh.process(data)
            
            // highlights
            highlightVolts(/^v\d+/)
            highlightTemps()
         },
         complete: function(){
            setTimeout(get_str_data,3000)
         },
         error: function (jqXhr, textStatus, errorMessage) {
            console.error('Ajax Error! ' + errorMessage);
         },
         timeout:30000,
         dataType: 'json',        
   });
}

// ----------------------------------------------------------
// ------------------------- Home --------------------------
// ----------------------------------------------------------
function get_home_data(clearFaults=0) {
   
   var url = `${url_srv}/xhr`;
   if (clearFaults) {
      url += '?clearFaults=1'
   }

   var xhr = $.ajax({
         url: url,
         success: function(data){ 

            if ( data['error'] ) {
               this.error(this.xhr,this.textStatus,data['error'])
               return
            }

            spinner(data.time)

            dh = dataHdlr({fltAlm:fltAlm}) // Add handler fault/alarm display
            dh.process(data)
            highlightVolts(/^vM\w+?Val\d+/) // matches vMaxVal or vMinVal
            
         },
         complete: function(){
            clearTimeout(timeoutId)
            timeoutId = setTimeout(get_home_data,3000)
         },
         error: function (jqXhr, textStatus, errorMessage) {
            console.error('Ajax Error! ' + errorMessage);
            spinnerX()
         },
         timeout:7000,
         dataType: 'json',        
   });
}

// ----------------------------------------------------------
// ------------------------- System --------------------------
// ----------------------------------------------------------
function get_sys_data(action) {

   var url = `${url_srv}/sys/xhr`;

   if ( typeof action != 'undefined') {
      if ( 'id' in action) {
         url += `?id=${action.id}&cmd=${action.cmd}`
      }
   }

   var xhr = $.ajax({
         url: url,
         success: function(data){ 
            if ( data['error'] ) {
               this.error(this.xhr,this.textStatus,data['error'])
               return
            }
         
            // --- display by id ----
            let dh = dataHdlr()
            dh.process(data)
         },
         complete: function(){
            // clear previous so don't stack'm up
            clearTimeout(timeoutId)
            timeoutId = setTimeout(get_sys_data,9000)
         },
         error: function (jqXhr, textStatus, errorMessage) {
            console.error('Ajax Error! ' + errorMessage);
         },
         timeout:30000,
         dataType: 'json',        
   });
}

// ----------------------------------------------------------
// ----------------------  get Charge -----------------------
// ----------------------------------------------------------
function get_chg_data(action) {

   var url = `${url_srv}/chg/xhr`;

   if ( typeof action != 'undefined') {
      if ( 'id' in action) {
         url += `?id=${action.id}&cmd=${action.cmd}`
      }
   }

   var xhr = $.ajax({
         url: url,
         success: function(data){ 
            if ( data['error'] ) {
               this.error(this.xhr,this.textStatus,data['error'])
               return
            }
         
            // --- display by id ----
            let dh = dataHdlr()
            dh.process(data)

            highlightVolts(/^v\d+/)
            highlightBalance()

         },
         complete: function(){
            // clear previous so don't stack'm up
            clearTimeout(timeoutId)
            timeoutId = setTimeout(get_chg_data,9000)
         },
         error: function (jqXhr, textStatus, errorMessage) {
            console.error('Ajax Error! ' + errorMessage);
         },
         timeout:30000,
         dataType: 'json',        
   });
}

// ----------------------------------------------------------
// ------------------------get Aux    -----------------------
// ----------------------------------------------------------
function get_aux_data() {

   const url = `${url_srv}/aux/xhr`;

   var xhr = $.ajax({
         url: url,
         success: function(data){ 
            if ( data['error'] ) {
               this.error(this.xhr,this.textStatus,data['error'])
               return
            }
         
            // --- display by id ----
            let dh = dataHdlr()
            dh.process(data)

            highlightTempsAux()
            highlightVolts(/^va\d+/)
            highlightVolts(/^vM\w+?Val\d+/)

         },
         complete: function(){
            // clear previous so don't stack'm up
            clearTimeout(timeoutId)
            timeoutId = setTimeout(get_aux_data,9000)
         },
         error: function (jqXhr, textStatus, errorMessage) {
            console.error('Ajax Error! ' + errorMessage);
         },
         timeout:30000,
         dataType: 'json',        
   });
}

// ----------------------------------------------------------
// ------------------------get env xhr    -----------------------
// ----------------------------------------------------------
function get_env_data() {

   const url = `${url_srv}/env/xhr`;

   var xhr = $.ajax({
         url: url,
         success: function(data){ 
            if ( data['error'] ) {
               this.error(this.xhr,this.textStatus,data['error'])
               return
            }
         
            // --- display by id ----
            let dh = dataHdlr()
            dh.process(data)
         },
         complete: function(){
            // clear previous so don't stack'm up
            clearTimeout(timeoutId)
            timeoutId = setTimeout(get_env_data,9000)
         },
         error: function (jqXhr, textStatus, errorMessage) {
            console.error('Ajax Error! ' + errorMessage);
         },
         timeout:5000,
         dataType: 'json',        
   });
}

// -------------- End get functions ----------------

// ----------------- Set Points ------------------
// Global used by getSetPoints() and setSetPoints()
// Defaults
var spHsh = {}
spHsh['spHighVolt'] = 13
spHsh['spLowVolt']  = 12
spHsh['spHighVoltChrg'] = 13
spHsh['spLowVoltChrg']  = 12
spHsh['spHighTemp'] = 80
spHsh['spHighTempAux'] = 80
spHsh['spHighBalance'] = .9
spHsh['spLowBalance']  = .3

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
// --- Data Handler -------------------
// automate displaying data
// Need to move this to a module
// ------------------------------------
function dataHdlr(hdlrObj) {

   // Add non-standard handlers
   for (let k in hdlrObj) {
      this[k] = hdlrObj[k]
   }

   //---------------------------------   
   this.innerHTML = function(data)
   {
      for (let key in data) {

         if (typeof(data[key]) === 'object' ) {
            innerHTML(data[key])  // yep recursive
         } 
         else {
            let elid = document.getElementById(key) 
            if ( elid != null ) {
               elid.innerHTML = data[key]
            }
         }
      }
   }

   // ------------------------------
   // data[classList] = {elid:{add:myclass,remove:thatclass},replace:['foo','bar']... }
   // ------------------------------
   this.classList = function(data) {

      for (let key in data) {

         if (typeof(data[key]) === 'object' ) {
            classList(data[key])
         } 

         const elid = document.getElementById(key)
         if ( elid != null ) {
            for (let method in data[key]){
               if ( Array.isArray(data[key][method]) ) {
                  elid.classList[method](...data[key][method])
               }
               else {
                  elid.classList[method](data[key][method])
               }
            }
         }
      }
   }

   // ------------------------------
   // data[style] = {elid:{backgroundColor:'red'},  }
   // ------------------------------
   this.style = function(data) {

      for (let id in data) {
         
         if (typeof(data[key]) === 'object' ) {
            style(data[key])
         } 

         const elid = document.getElementById(id)
         if ( elid != null ) {
            for (let attr in data[id]) {
               elid.style[attr] = data[id][attr]
            }
         }
      }
   }

   //---------------------------------   
   this.setAttribute = function(data) {
       for (let id in data) {

         if (typeof(data[id]) === 'object' ) {
            this.setAttribute(data[id])
         }

         const elid = document.getElementById(id)
         if ( elid != null ) {
            for (let attr in data[id]) {
               elid.setAttribute(attr,data[id][attr])
            }
         }
      }
   }
   this.src = function() {}
 
   // --- The crux --- 
   // Routes data to the handler of the same name
   this.process = function(dataIn) {
      for (key in dataIn) {
         if ( typeof this[key] == 'function') {
            // Call the function with the data
            this[key](dataIn[key])
         }
      }  
   }

   return(this)
}

// ------------------------------
//  Data handler for the fault/alarm display
//  Called from within dataHdlr()
//  flt_alm_lst = [ {ts:timestamp,msg:fltalmMsg,flt:0/1},... ]
// ------------------------------
function fltAlm(fltLst) {
   let sortToggle = readCookie('sortToggle')

   // wipe it clean
   let fltStr = ''
   let tblId = document.getElementById("flt_alm")
   if (tblId == null) return  // why?

   tblId.innerHTML = "";
   
   if ( fltLst.length == 0 ) {
     
      let row = tblId.insertRow(0)
      if (row != null ) {
         row.classList.add("bg-success");
         row.classList.add("text-white");
      }

      let cell0 = row.insertCell(0)
      if (cell0 != null ) {
         cell0.setAttribute('colspan','99')
         cell0.style.textAlign = 'center'
         cell0.innerHTML = "No Alarms or Faults"
      }
 
      return
   }

   fltLst.reverse()
   
   // ---- Flt or Alm present  -----
   for (let i = 0; i < fltLst.length; i++){
      let row = tblId.insertRow(i)
      let cell0 = row.insertCell(0)
      let cell1 = row.insertCell(1)

      let timefmt = (new Date(fltLst[i]['time'])).toLocaleString('en-GB', { timeZone: 'America/Los_Angeles',hour24: false })

      cell0.innerHTML = timefmt
      cell1.innerHTML = fltLst[i]['msg']
      if ( fltLst[i].flt ) {
         row.classList.add("bg-danger");
      }
      else {
         row.classList.add("bg-warning");
      }
   }
}

// ------------------------------------
// --- Highlighting  ------------------
// ------------------------------------

// ---------- Highlight Volts ---------
function highlightVolts(re=/^v\d+/) {
   var ids = document.querySelectorAll('[id]');
   
   //const re = /^va?\d+/

   let spHighVolt = document.getElementById("spHighVolt").value
   let spLowVolt = document.getElementById("spLowVolt").value
   let numHighVolt = 0
   let numLowVolt  = 0
   ids.forEach( (el, inx) => {
      if ( re.test(el.id) ) {

         let val = parseFloat(el.innerText)
         el.style.backgroundColor  = "forestgreen"
         if ( val >= spHighVolt) {
            el.style.backgroundColor  = "#EE2222"
            numHighVolt++
         }else if ( val <= spLowVolt ){
            el.style.backgroundColor  = "yellow"
            numLowVolt++
         } 
      } 
   })

   let numEl = document.getElementById('numHighVolt')
   if ( numEl != null ) numEl.innerHTML = numHighVolt
         
   numEl = document.getElementById('numLowVolt')
   if ( numEl != null ) numEl.innerHTML = numLowVolt
}

// ---------- Highlight Volts ---------
function highlightTemps() {
   var ids = document.querySelectorAll('[id]');
   
   const re = /^t\d+/

   let spHighTemp = document.getElementById("spHighTemp").value
   let numHighTemp = 0
 
   ids.forEach( (el, inx) => {
      if ( re.test(el.id) ) {

         let val = parseFloat(el.innerText)
         el.style.backgroundColor  = "forestgreen"
         if (val >= spHighTemp) {
            el.style.backgroundColor  = "#EE2222"
            numHighTemp++
         } 
      } 
   })

   let numEl = document.getElementById('numHighTemp')
   if ( numEl != null ) numEl.innerHTML = numHighTemp
}

// ---------- Highlight Balance ---------
// Need to check is there too high balance
// Probably not 
function highlightBalance() {
   var ids = document.querySelectorAll('[id]');
   
   const re = /^b\d+/

   let spHighBalance = document.getElementById("spHighBalance").value
   let spLowBalance = document.getElementById("spLowBalance").value
   let numHighBalance = 0
   let numLowBalance  = 0
   ids.forEach( (el, inx) => {
      if ( re.test(el.id) ) {

         let val = parseFloat(el.innerText)
         el.style.backgroundColor  = "forestgreen"
         if ( val >= spHighBalance) {
            el.style.backgroundColor  = "#EE2222"
            numHighBalance++
         }else if ( val <= spLowBalance ){
            el.style.backgroundColor  = "#DDDD11"
            numLowBalance++
         } 
      } 
   })

   let numEl = document.getElementById('numHighBalance')
   if ( numEl != null ) numEl.innerHTML = numHighBalance

   numEl = document.getElementById('numLowBalance')
   if ( numEl != null ) numEl.innerHTML = numLowBalance
}

function highlightTempsAux() {

   // The aux temps are a short list, explicity call out lst
   let auxTempLst = ['aux_cell_temp_1','aux_cell_temp_2','aux_cell_temp_3','aux_cell_temp_4','aux_amb_temp_1','aux_amb_temp_2']
 
   let spHighTempAux = document.getElementById("spHighTempAux").value
 
   for (let id of auxTempLst) {

      let el = document.getElementById(id)

      if ( el != null ) {
         let val = parseFloat(el.innerText)
         el.style.backgroundColor  = "forestgreen"
         if (val >= spHighTempAux) {
            el.style.backgroundColor  = "#EE2222"
         } 
      }
   }
}

// ------------------------------------
// --- Event Handlers ------------------
// ------------------------------------
$( document ).ready( () => {
  
   // Set Point Change
   $(".spVal").change( (event) => {

      //if(event.keycode == '13'){}

      let keys = Object.keys(spHsh);
      for(let i = 0; i< keys.length;i++) {
         if ( $("#"+keys[i] )) {
            let val = $("#"+keys[i] ).val()
          
            if ( ! isNaN(val) ) {
               writeCookie(keys[i],val)
            }
         }
      }

      console.log(event.target.id)

      data_xhr()
      //highlightVolts()
      //highlightTemps()
   })

   $("#clearFaults").click( () => { 
      get_home_data(1)
   })

   // ------------- system
   $(".procSubmit").click( (event) => {
      
      get_sys_data({id:event.target.id,cmd:event.target.innerHTML})

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
