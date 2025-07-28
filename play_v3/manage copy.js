// 영상 관리 파일
// 차시명과 영상 파일명을 관리하는 설정 파일

var COURSE_NAME = "학원 및 교습소 설립‧운영자 연수 교육 자료";

// 영상 정보 배열
// 각 객체는 차시명과 해당 영상 파일명을 포함
// 타이틀에 입력한 내용은 index.html 페이지에서 차시명으로 반영됨
// 파일 네임은 확장자를 포함하여, movies 폴더 내에 존재하는 파일명으로 정확하게 입력
// (참고) 파일 네임에 파일이 업로드되어 있는 외부 url주소를 입력해도 동작함
// 디스크립션은 영상 내용 참고적으로 설명용, 실질적으로는 UI상 반영되지 않음 
var VIDEO_LIST = [
    {
        id: 1,
        title: "01. 학원 강사의 채용과 해임",
        filename: "http://kscsea87.ipdisk.co.kr:80/publist/VOL1/%EC%9D%B4%EC%8B%A0%EC%9A%B0%EC%9D%98%20%EC%8B%A0%EB%AC%98%ED%95%9C%20ai%20%EA%B0%9C%EB%B0%9C%EB%AA%A8%EB%93%9C/01.mp4",
        description: "학원 강사 채용과 해임에 관한 교육 내용"
    },
    {
        id: 2,
        title: "02. 학원 및 교습소의 지도 점검",
        filename: "http://kscsea87.ipdisk.co.kr:80/publist/VOL1/%EC%9D%B4%EC%8B%A0%EC%9A%B0%EC%9D%98%20%EC%8B%A0%EB%AC%98%ED%95%9C%20ai%20%EA%B0%9C%EB%B0%9C%EB%AA%A8%EB%93%9C/02.mp4",
        description: "학원 및 교습소 지도 점검에 관한 교육 내용"
    },
    {
        id: 3,
        title: "03. 외국인강사 대상 연수",
        filename: "http://kscsea87.ipdisk.co.kr:80/publist/VOL1/%EC%9D%B4%EC%8B%A0%EC%9A%B0%EC%9D%98%20%EC%8B%A0%EB%AC%98%ED%95%9C%20ai%20%EA%B0%9C%EB%B0%9C%EB%AA%A8%EB%93%9C/03.mp4",
        description: "외국인 강사 대상 연수에 관한 교육 내용"
    },
    {
        id: 4,
        title: "04. 긴급복지 신고의무자 교육",
        filename: "http://kscsea87.ipdisk.co.kr:80/publist/VOL1/%EC%9D%B4%EC%8B%A0%EC%9A%B0%EC%9D%98%20%EC%8B%A0%EB%AC%98%ED%95%9C%20ai%20%EA%B0%9C%EB%B0%9C%EB%AA%A8%EB%93%9C/04.mp4",
        description: "긴급복지 신고의무자 교육에 관한 교육 내용"
    },
    {
        id: 5,
        title: "05. 아동학대 신고의무자 교육",
        filename: "http://kscsea87.ipdisk.co.kr:80/publist/VOL1/%EC%9D%B4%EC%8B%A0%EC%9A%B0%EC%9D%98%20%EC%8B%A0%EB%AC%98%ED%95%9C%20ai%20%EA%B0%9C%EB%B0%9C%EB%AA%A8%EB%93%9C/05.mp4",
        description: "아동학대 신고의무자 교육에 관한 교육 내용"
    },
    {
        id: 6,
        title: "06. 장애인학대 신고의무자 교육",
        filename: "http://kscsea87.ipdisk.co.kr:80/publist/VOL1/%EC%9D%B4%EC%8B%A0%EC%9A%B0%EC%9D%98%20%EC%8B%A0%EB%AC%98%ED%95%9C%20ai%20%EA%B0%9C%EB%B0%9C%EB%AA%A8%EB%93%9C/06.mp4",
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