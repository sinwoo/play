var cURL = this.location.href;
var curChapStr = cURL.substring( cURL.lastIndexOf('/') + 1 , cURL.lastIndexOf('/') + 3); // 차시번호 잘라내기
var curPageStr = cURL.substring( cURL.lastIndexOf('/') + 4 , cURL.lastIndexOf('/') + 6); // 페이지번호 잘라내기

// let bookMrkArr = new Array();
// for (let index = 0; index < 17; index++) {
//     bookMrkArr[index] = new Array();
//     // bookMrkArr[index]
// } 
// console.log(bookMrkArr[index])

function pageInit() {
    try{
        var pageInfo = curChapStr + "_" + curPageStr;
        //curChapStr은 차시번호, curPageStr은 해당 차시의 페이지번호
        _getParagraph();
        _setPageInfo(pageInfo); //장 절
        _setCurrentLocation(curPageStr); //현재 페이지
        _progressSave(); //진도체크 실행 부분
    } catch(e) {
        alert("페이지 정보 저장 시 오류가 발생 함");
    }
}

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




// 글로벌 변수들 (0727_back 프로젝트와 동일한 형식)
var CHAPTER = 1; // 차시 번호
var NOWPAGE = 1; // 현재 페이지
var TOTALPAGE = 1; // 총 페이지 수
var MEDIA_INFO = {}; // 비디오 오디오 정보
var MEDIA_ROOT;
var MACHINE_TYPE = 'PC'; // PC인지 모바일인지 default는 PC
var BROWSER_TYPE = 'Chrome'; // 브라우저 어떤것인지 default는 Chrome
var FULLSCREEN_VISIBLE = true; // 풀스크린 버튼 보일지 말지
var FULL_SCREEN = false; // 풀스크린일때 아닐때
var PORTING = true; // 포팅 버젼인지 아닌지
var CONTAINER; // 퀴즈와 서머리에서 쓰일 컨테이너
var QUIZ_SUMMARY_END = false;
var QUIZS_START_SINK = 2; // 퀴즈에서 스타트 버튼 나올시간 (초 단위)
var CONTROLL_HEIGHT = 40; // 컨트롤바 높이값(퀴즈와 서머리의 위치값에 영향)
var SITETYPE = "vill"; // 티처빌: vill , 모바일 : m
var isNextMovieShowFlag = false;
var loadFrameURL;
var groupCode = "1001451"; // 티처빌 그룹코드
var isTYPE;
var HTML_TYPE;
var COURSE_TITLE = "영상 플레이어";

// 학습중인 페이지번호 저장(북마크)
var scoCurPnum = 1; // 현재 페이지가 해당스코의 몇번째 페이지인지 확인

// 전체 진도 목록 가져오기
var prograteList;
var curPage;
var curPageStatus;
var curLastTime;

// 도큐먼트 레디
$(document).ready(function() {
    startContent();
    // =============세팅=============
    controller.init(); // 컨트롤러 세팅
    resize.resizeScale(); // 리사이즈
    resize.windowResizeChk(); // 윈도우 사이즈 변경시 리사이즈
});

// 콘텐츠 시작
function startContent() {
    // 기본 설정
    CONTAINER = document.querySelector('.content');
    
    // 브라우저 타입 확인
    if (navigator.userAgent.indexOf('Chrome') !== -1) {
        BROWSER_TYPE = 'Chrome';
    } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
        BROWSER_TYPE = 'Firefox';
    } else if (navigator.userAgent.indexOf('Safari') !== -1) {
        BROWSER_TYPE = 'Safari';
    } else if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Trident') !== -1) {
        BROWSER_TYPE = 'IE';
    }
    
    // 기기 타입 확인
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        MACHINE_TYPE = 'Mobile';
    }
}

// 진도 목록 가져오기 (더미 데이터)
function fnGetPrograteList() {
    return [];
}

// 페이지 정보 설정
function _setPageInfo(pageInfo) {
    // 페이지 정보 설정 로직
}

// 현재 위치 설정
function _setCurrentLocation(curPageStr) {
    // 현재 위치 설정 로직
}

// 진도 저장
function _progressSave() {
    // 진도 저장 로직
}

// 문단 정보 가져오기
function _getParagraph() {
    // 문단 정보 가져오기 로직
}
