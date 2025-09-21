// 영상 관리 파일
// 차시명과 영상 파일명을 관리하는 설정 파일

var COURSE_NAME = "농협대학교 농협회계 온라인 콘텐츠";

// 영상 정보 배열
// 각 객체는 차시명과 해당 영상 파일명을 포함
// 타이틀에 입력한 내용은 index.html 페이지에서 차시명으로 반영됨
// 파일 네임은 확장자를 포함하여, movies 폴더 내에 존재하는 파일명으로 정확하게 입력
// (참고) 파일 네임에 파일이 업로드되어 있는 외부 url주소를 입력해도 동작함
// 디스크립션은 영상 내용 참고적으로 설명용, 실질적으로는 UI상 반영되지 않음 
var VIDEO_LIST = [
    {
        id: 1,
        title: "1주차 1차시",
        filename: "https://www.monory.co.kr/media/01.mp4",
        description: "학원 강사 채용과 해임에 관한 교육 내용"
    },
    {
        id: 2,
        title: "1주차 2차시",
        filename: "https://www.monory.co.kr/media/02.mp4",
        description: "학원 및 교습소 지도 점검에 관한 교육 내용"
    },
    {
        id: 3,
        title: "1주차 3차시",
        filename: "https://www.monory.co.kr/media/03.mp4",
        description: "외국인 강사 대상 연수에 관한 교육 내용"
    },
    {
        id: 4,
        title: "3주차 1차시",
        filename: "https://www.monory.co.kr/media/04.mp4",
        description: "긴급복지 신고의무자 교육에 관한 교육 내용"
    },
    {
        id: 5,
        title: "3주차 2차시",
        filename: "https://www.monory.co.kr/media/05.mp4",
        description: "아동학대 신고의무자 교육에 관한 교육 내용"
    },
    {
        id: 6,
        title: "3주차 3차시",
        filename: "https://www.monory.co.kr/media/06.mp4",
        description: "장애인학대 신고의무자 교육에 관한 교육 내용"
    }
];

// 영상 정보를 가져오는 함수
function getVideoList() {
    return VIDEO_LIST;
}

// 특정 ID의 영상 정보를 가져오는 함수
function getVideoById(id) {
    return VIDEO_LIST.find(video => video.id === id);
}

// 영상 파일 경로를 가져오는 함수
function getVideoPath(filename) {
    return "./movies/" + filename;

} 

