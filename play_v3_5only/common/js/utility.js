var porting = false;
if(!porting){
	//포팅버전이 아닐 경우 컨트롤바 제어 가능하게 처리
	controlBar = false;
	// controlBar = true;
}
var utility = (function () 
{
	var loc = window.location.href;
	var locationGet = function () {
		if (typeof loc === 'string' && loc.indexOf("file://") != -1) {
			return "local";
		}
		else if (typeof loc === 'string' && loc.indexOf("media.scrown.co.kr") != -1) { 
			return "scrown";
		}
		else {
			return "notlocalscrown";
		}
	}
	
	//기계 타입 리턴
    var getMachineType = function () 
    {
        // navigator.platform은 deprecated되었으므로 userAgent를 사용
        var userAgent = navigator.userAgent.toLowerCase();
        // 모바일 기기 체크
        if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
            return "Mobile";
        }
        // PC 체크
        if (typeof userAgent === 'string' && (userAgent.indexOf("win") !== -1 || userAgent.indexOf("mac") !== -1)) {
            return "PC";
        }
        // 기본값
        return "PC";
    }



    //브라우저 타입 리턴
    var getBrowserType = function()
    {
        var _ua = navigator.userAgent;

        /* IE7,8,9,10,11 */
        if (navigator.appName == 'Microsoft Internet Explorer' || (typeof _ua === 'string' && _ua.indexOf("rv:11.0") != -1))
        {
            var rv = -1;
            var trident = _ua.match(/Trident\/(\d.\d)/i);

            //ie11에서는 MSIE토큰이 제거되고 rv:11 토큰으로 수정됨 (Trident표기는 유지)
            if (trident != null && trident[1]  == "7.0") return rv = "IE" + 11;
            if (trident != null && trident[1]  == "6.0") return rv = "IE" + 10;
            if (trident != null && trident[1]  == "5.0") return rv = "IE" + 9;
            if (trident != null && trident[1]  == "4.0") return rv = "IE" + 8;
            if (trident == null) return rv = "IE" + 7;
            
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(_ua) != null) rv = parseFloat(RegExp.$1);
            
            return rv;
        }

        /* etc */
        var agt = _ua.toLowerCase();
        
        if (typeof agt === 'string' && agt.indexOf("edge") != -1) return 'Edge';
        if (typeof agt === 'string' && agt.indexOf("edg") != -1) return 'Edge';
        if (typeof agt === 'string' && agt.indexOf("opera") != -1) return 'Opera'; 
        if (typeof agt === 'string' && agt.indexOf("opr") != -1) return 'Opera'; 
        if (typeof agt === 'string' && agt.indexOf("whale") != -1) return 'Whale'; 
        if (typeof agt === 'string' && agt.indexOf("chrome") != -1) return 'Chrome';
        if (typeof agt === 'string' && agt.indexOf("staroffice") != -1) return 'Star Office'; 
        if (typeof agt === 'string' && agt.indexOf("webtv") != -1) return 'WebTV'; 
        if (typeof agt === 'string' && agt.indexOf("beonex") != -1) return 'Beonex'; 
        if (typeof agt === 'string' && agt.indexOf("chimera") != -1) return 'Chimera'; 
        if (typeof agt === 'string' && agt.indexOf("netpositive") != -1) return 'NetPositive'; 
        if (typeof agt === 'string' && agt.indexOf("phoenix") != -1) return 'Phoenix'; 
        if (typeof agt === 'string' && agt.indexOf("firefox") != -1) return 'Firefox'; 
        if (typeof agt === 'string' && agt.indexOf("safari") != -1) return 'Safari'; 
        if (typeof agt === 'string' && agt.indexOf("skipstone") != -1) return 'SkipStone'; 
        if (typeof agt === 'string' && agt.indexOf("netscape") != -1) return 'Netscape'; 
        if (typeof agt === 'string' && agt.indexOf("mozilla/5.0") != -1) return 'Mozilla'; 
    }

    // 0+숫자
    var digit = function(c)
    {
		// c가 undefined나 null인 경우 처리
		if (c === undefined || c === null) return '01';
		
		var num = Number(c);
		if (isNaN(num)) return '01';
		
		var str = '';
		if(num < 10) str = '0'+num;
		else str = num.toString();
		return str;
    }

    var reversDigit = function(c){
        // c가 undefined나 null인 경우 처리
        if (!c) return 1;
        
        var str = c.toString().split('')[0];
        var num;
		if(str == '0') num = Number(c.toString().split('')[1]);
		else num = Number(c);
		return num || 1; // 숫자가 아닌 경우 기본값 1 반환
    }

    // 시간 포맷(xx:xx)
    var timeFormat = function(time)
    {
        var min = parseInt(time/60);
        var sec = parseInt(time%60);
        if(min < 10) min = '0'+min;
        if(sec < 10) sec = '0'+sec;
        return min+':'+sec;
    }

    // 쿠키 세팅
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    // 쿠키 가져오기
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (typeof c === 'string' && c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    // 주소 파라미터 가져오기
    function getParameter(address, param) {
        if(address.indexOf('?') == -1) return '';
        var parameters = (address.slice(address.indexOf('?')+1,address.length)).split('&');
        for(var i=0; i<parameters.length; i++) {
            var keyValue = parameters[i].split('=');
            if(keyValue[0] == param) return keyValue[1];
        }
        return '';
    }

    // 쿠키 세트/겟 (구버전)
    function csetCookie(c_name,value,exdays) {
        var exdate=new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
        document.cookie=c_name + "=" + c_value;
    }
    function cgetCookie(c_name) {
        var i,x,y,ARRcookies=document.cookie.split(";");
        for (i=0;i<ARRcookies.length;i++) {
            x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
            y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
            while (x.charAt(0)==' ') x = x.substring(1,x.length);
            if (x==c_name) {
                return unescape(y);
            }
        }
        return null;
    }

	if(porting){

					var Request = function(){
						this.getParameter = function( name ){
							var value = '';
							var address = unescape(location.href);
							var parameters = (address.slice(address.indexOf('?')+1,address.length)).split('&');
							 
							for(var i = 0 ; i < parameters.length ; i++) {
								var param = parameters[i].split('=')[0];
								if(param.toUpperCase() == name.toUpperCase()) {
									value = parameters[i].split('=')[1];
									break;
								}
							}
							return value;
						};
					};

					var request = new Request();
					var domain = request.getParameter('domain') == '' ? cgetCookie('domain') : request.getParameter('domain');
					var debug = request.getParameter('debug') == '' ? "" : request.getParameter('debug');
					csetCookie('domain', domain, null);

					// cross domain setup
					if (domain == undefined) {
						alert('Not Set Domain. Please set the domain.')
					}
					else {
						document.domain = domain;
					}

					try{
						var test = top.document.domain;
					}
					catch(e) {
						alert('There is a problem with your browser settings. \n\nPlease contact your system administrator.');
					}

					function csetCookie(c_name,value,exdays) {
						var exdate = new Date();
						exdate.setDate(exdate.getDate() + exdays);
						var c_value = escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
						document.cookie = c_name + "=" + c_value;
					}

					function cgetCookie(c_name) {
						var i,x,y,ARRcookies = document.cookie.split(";");
						for ( i = 0;i < ARRcookies.length;i++) {
							x = ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
							y = ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
							x = x.replace(/^\s+|\s+$/g,"");
							
							if (x == c_name){
								return unescape(y);
							}	
						}
					}
	}

    return {
        locationGet: locationGet,
        getMachineType: getMachineType,
        getBrowserType: getBrowserType,
        digit: digit,
        reversDigit: reversDigit,
        timeFormat: timeFormat,
        setCookie: setCookie,
        getCookie: getCookie,
        getParameter: getParameter,
        csetCookie: csetCookie,
        cgetCookie: cgetCookie
    }

})()



