// 영상 관리 파일
// 차시명과 영상 파일명을 관리하는 설정 파일

var COURSE_NAME = "학원 및 교습소 설립‧운영자 연수 교육 자료";

// 영상 정보 배열
// 각 객체는 차시명과 해당 영상 파일명을 포함
var VIDEO_LIST = [
    {
        id: 1,
        title: "01. 학원 강사의 채용과 해임",
        filename: "01.mp4",
        description: "학원 강사 채용과 해임에 관한 교육 내용"
    },
    {
        id: 2,
        title: "02. 학원 및 교습소의 지도 점검",
        filename: "02.mp4",
        description: "학원 및 교습소 지도 점검에 관한 교육 내용"
    },
    {
        id: 3,
        title: "03. 외국인 강사 대상 연수",
        filename: "03.mp4",
        description: "외국인 강사 대상 연수에 관한 교육 내용"
    },
    {
        id: 4,
        title: "04. 긴급복지 신고의무자 교육",
        filename: "04.mp4",
        description: "긴급복지 신고의무자 교육에 관한 교육 내용"
    },
    {
        id: 5,
        title: "05. 아동학대 신고의무자 교육",
        filename: "05.mp4",
        description: "아동학대 신고의무자 교육에 관한 교육 내용"
    },
    {
        id: 6,
        title: "06. 장애인학대 신고의무자 교육",
        filename: "06.mp4",
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