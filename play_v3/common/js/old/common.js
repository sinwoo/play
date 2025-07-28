

var makeActiveHTML = (function ()
{
    //세팅
    var init = function(title, url)
    {       
        makeElement(title, url);                                                                                              //태그 붙이기
        CONTAINER = document.getElementById('htmlContents');

    }

    //태그 붙이기
    var makeElement = function(title, url)
    {
        //내용 붙이기
        var element = '\
            <div id="htmlContents" alt="">\
					<iframe title='+title+' id="loadActFrame" src='+url+' frameborder="0" scrolling="no"></iframe>\
            </div>'
            
        $('.scrownPlayer').append(element);
	}
    return {
        init : init
    }
})();




//글로벌 변수는 대문자 - 오직 main과 playerInfo 에서만 생성함
//js파일은 main.js, playerInfo.js와 plugin을 제외하고 하나의 function만 사용(사용된 함수나 변수의 위치를 알기 쉽게 하기 위함 - js와 함수명은 통일함)

var CHAPTER; //차시 번호
var NOWPAGE; //현재 페이지
var TOTALPAGE; //총 페이지 수
var MEDIA_INFO = {};//비디오 오디오 정보
var MEDIA_ROOT;
var MACHINE_TYPE = 'PC';//PC인지 모바일인지 default는 PC
var BROWSER_TYPE = 'Chrome';//브라우저 어떤것인지 default는 Chrome
var FULLSCREEN_VISIBLE = true;//풀스크린 버튼 보일지 말지
var FULL_SCREEN = false;//풀스크린일때 아닐때
var PORTING = true//포팅 버젼인지 아닌지
var CONTAINER;//퀴즈와 서머리에서 쓰일 컨테이너
var QUIZ_SUMMARY_END = false;
var QUIZS_START_SINK = 2;//퀴즈에서 스타트 버튼 나올시간 (초 단위)
var CONTROLL_HEIGHT = 40;//컨트롤바 높이값(퀴즈와 서머리의 위치값에 영향)

var isNextMovieShowFlag=false;
var loadFrameURL;

var isTYPE;
var HTML_TYPE;
var COURSE_TITLE

//학습중인 페이지번호 저장(북마크)
var scoCurPnum = 1;   //현재 페이지가 해당스코의 몇번째 페이지인지 확인

// 전체 진도 목록 가져오기
var prograteList;
var curPage;
var curPageStatus;
var curLastTime;

//도큐먼트 레디 - 오직 main.js에서만 실행
$(document).ready(function() {
	//console.log('PAGE_INFO ', PAGE_INFO);
	prograteList = fnGetPrograteList();
    // console.log(prograteList)
	startContent();
    //=============세팅=============
    main.init();//메인 세팅
    controller.init();//컨트롤러 세팅
    menu.init();//메뉴, 스크립트 세팅
	main.makeTopTitle();
    resize.resizeScale();                                                                                        //리사이즈
    resize.windowResizeChk();                                                                            //윈도우 사이즈 변경시 리사이즈

    // 2023.02.22 사제동행 작업 - JY
    // CHAPTER / 과정 별 디자인 차이에 대한 정보 없어서 주석 처리함.
    // 향후 디자인 차이에 대한 정보 있을 경우 수정해서 작업
    //#menuBox_1
    if(CHAPTER == 1238) {
        $("#menuBox_1").css({
            "margin-top" : "18px"
        })
    }
});

//초기 세팅
var main = (function () {
	var init = function()
	{
		//console.log(":::::: locationGet : " + utility.locationGet());
        //브라우져 타입, 머신 타입
        MACHINE_TYPE = utility.getMachineType();
        BROWSER_TYPE = utility.getBrowserType();

        //챕터와 현재 페이지 지정
        TOTALPAGE = PAGE_INFO.length;

        var url = document.location.href.split('/');
        CHAPTER = utility.reversDigit(url[url.length - 2]) || 1;
        // NOWPAGE = utility.reversDigit(url[url.length - 1].split('.')[0]) || 1;
        NOWPAGE = utility.reversDigit(url[url.length - 1].split('.')[0]) || '01_01';

        // 2023.02.22 사제동행 작업 - JY
		// 과정명 설정
        COURSE_TITLE = "사제동행"
        //console.log(' CHAPTER : ', CHAPTER, ' NOWPAGE : ', NOWPAGE );
        //console.log(' MEDIA_INFO : ', MEDIA_INFO );

		isTYPE = PAGE_INFO[NOWPAGE-1].type.split("_")[0];
		HTML_TYPE = PAGE_INFO[NOWPAGE-1].type.split("_")[1];

		switch(HTML_TYPE)
        {
            case 'quiz'://퀴즈 일때
                MEDIA_INFO.type = 'mp3'
                MEDIA_INFO.link = './common/mp3/quiz.mp3';
                quiz.init();//퀴즈 세팅
                break;

            case 'summary'://서머리 일때
                MEDIA_INFO.type = 'summary'

                // 2023.02.22 사제동행 작업 - JY
                // CHAPTER / 과정 별 차이에 대한 정보 없어서 주석 처리함.
                // 향후 차이에 대한 정보 있을 경우 수정해서 작업
                MEDIA_INFO.link = './common/summary/mp4/summary_intro_basic.mp4';
                makeActiveHTML.init("정리하기","./common/summary/summary_M2.html");
                
                break;

            case 'check'://check 일때
                MEDIA_INFO.type = 'mp3'
                MEDIA_INFO.link = './common/mp3/check.mp3';
                makeActiveHTML.init("chek","./common/check/"+utility.digit(CHAPTER) + "_" + utility.digit(NOWPAGE)+".html");//
                break;

            default ://mp4일때
                var videoPath = '';
                videoPath = "./common/mp4/"; //로컬 비디오 경로
                MEDIA_INFO.type = 'mp4'
                MEDIA_INFO.link = videoPath + utility.digit(CHAPTER) + '_' + utility.digit(NOWPAGE) + '.mp4';
				//console.log("MEDIA_INFO.link : " + MEDIA_INFO.link);
                CONTAINER = document.querySelector('.scrownMedia');
        }

        $(top.document).find("#viewer_popup").css({'height':'795px'});
        
        //자막여부
        if(PAGE_INFO[NOWPAGE-1].vtt && PAGE_INFO[NOWPAGE-1].vtt == 'on') MEDIA_INFO.vtt = './common/vtt/' + utility.digit(CHAPTER) + '_' + utility.digit(NOWPAGE) + '.vtt';
        else MEDIA_INFO.vtt = '';
    }

    //상단 과정명, 차시명
    var makeTopTitle = function()
    {
        var element = '\
            <div class="titleTopBox">\
                <div class="chasiText">'+MAIN_TITLE+' </div>\
                <div class="courseTExt">'+COURSE_TITLE+'</div>\
            </div>'
		$('.scrownPlayer').append(element);
    }


    return {
        init : init
		,makeTopTitle : makeTopTitle
    }


})()


/**
 * startContent		시작 시 호출 함수
 */

function startContent()
{
	var url = document.location.href.split('/');
	// NOWPAGE = utility.reversDigit(url[url.length - 1].split('.')[0]) || 1;
    NOWPAGE = utility.reversDigit(url[url.length - 1].split('.')[0]) || '01_01';
	//console.log("startContent : " + NOWPAGE);
	if(porting){
		curPage = prograteList[Number(NOWPAGE)-1].contentsNo;
		curPageStatus = prograteList[Number(NOWPAGE)-1].completeYn;
		//console.log("curPageStatus : " + curPageStatus);

		try {
			opener.fnCmdStartObject(NOWPAGE);
		}
		catch(e) {
			parent.fnCmdStartObject(NOWPAGE);
		}
	}
}

function setQuizIntroDone()
{
	curPageStatus = 'Y'
    //console.log("curPageStatus : " + curPageStatus);
}

// 전체 진도 목록 가져오기
function fnGetPrograteList() {
	if(porting){
		var result = null;
		try {
			return opener.fnCmdLessonPrograteList();
		}
		catch(e) {
			return top.fnCmdLessonPrograteList();
		}
	}
}
