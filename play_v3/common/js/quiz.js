//퀴즈 시작
var quiz = (function () {
    var quizInfo;
    var alertTimer;
    var quizActive = false;
    var ifresolveselect = 0;
    var ifretry = 0; // 다시 풀기 중인지 체크
    //나의 정보
    var myData = {
        curPage: 1,
        chance: [],
        select: [],
        result: [],
        ifresolve: 0, // 다시 풀기 버튼 나오게 할 것인지 체크
    };

    //세팅
    var init = function () {
        //console.log(curPageStatus)
        quizInfo = QUIZ_INFO[NOWPAGE];

        //console.log('quizInfo ', quizInfo)

        makeElement(); //태그 붙이기
        quizInit(); //퀴즈 리셋하기
        quizEvent(); //퀴즈 이벤트

        CONTAINER = document.getElementById('quizContainer');
        resize.resizeScale(); //리사이즈
        //resize.windowResizeChk();//윈도우 사이즈 변경시 리사이즈
    };

    //태그 붙이기
    var makeElement = function () {
        //퀴즈 붙이기
        var quizEl,
            selectEl,
            resultEl,
            buttonBoxEl,
            successEl,
            alertEl,
            soundEl,
            introEl,
            haesulPopEl,
            haesulPopCloseEl,
            haesulPopOpenEl;
        var haesulEl = '';
        var element =
            '\
            <div id="quizContainer">\
                \
                <div class="quizSetBox">\
                </div>\
            </div>';

        $('.scrownPlayer').append(element);

        var introStr;
        // 2023.02.22 사제동행
        // CHAPTER / 과정 별 차이에 대한 정보 없어서 주석 처리함.
        // 향후 차이에 대한 정보 있을 경우 수정해서 작업
        introStr = '퀴즈를 통해 오늘 학습 내용을 확인해보겠습니다.';
        //인트로
        introEl =
            '<div class="quizIntro">\
                    <button id="quizStartBtn"></button>\
                </div>';

        //     introStr = '퀴즈를 통해 오늘 학습 내용을 확인해보겠습니다.'
        //     //인트로
        //     introEl = '<div class="quizIntro">\
        //                 <div id="quizIntroText_sjdh">'+replaceText(introStr)+'</div>\
        //                 <button id="quizStartBtn"></button>\
        //             </div>'

        $('#quizContainer').append(introEl);

        element = '';
        for (var i = 0; i < quizInfo.length; i++) {
            // 2023.02.22 사제동행
            // CHAPTER / 과정 별 차이에 대한 정보 없어서 주석 처리함.
            // 향후 차이에 대한 정보 있을 경우 수정해서 작업
            quizEl =
                '\
                <div class="quizBox_sjdh" id="quizBox_' +
                (i + 1) +
                '">\
                    <div class="munjeBox" id="munjeBox_' +
                (i + 1) +
                '">\
                    <div class="munjeNum" id="munjeNum_' +
                (i + 1) +
                '"></div>\
                    <div class="munjeOx" id="munjeOx_' +
                (i + 1) +
                '"></div>\
                    <div class="munjeText keepTheWord" id="munjeText_' +
                (i + 1) +
                '">' +
                replaceText(quizInfo[i].title) +
                '</div>\
                </div>';
            element += quizEl;

            //     quizEl = '\
            //         <div class="quizBox" id="quizBox_'+(i+1)+'">\
            //             <div class="munjeBox" id="munjeBox_'+(i+1)+'">\
            //             <div class="munjeNum" id="munjeNum_'+(i+1)+'"></div>\
            //             <div class="munjeOx" id="munjeOx_'+(i+1)+'"></div>\
            //             <div class="munjeText keepTheWord" id="munjeText_'+(i+1)+'">'+replaceText(quizInfo[i].title)+'</div>\
            //         </div>'
            //     element +=  quizEl
            //-----문제 end----

            //만약 ox면
            if (quizInfo[i].type == 'ox click') {
                element += '<div class="oxTitle">다음 글을 읽고 맞으면 O, 틀리면 X를 클릭하세요.</div>';
            } else if (quizInfo[i].type == 'ox click') {
                element += '<div class="oxTitle">제시된 문제를 잘 읽고 정답을 선택해주세요. </div>';
            }

            //문제에 보기 박스가 있을경우 보기 넣음
            if (quizInfo[i].exampleBox && quizInfo[i].exampleBox !== '') {
                element +=
                    '<div class="exampleBox" id="exampleBox_' + (i + 1) + '">' + quizInfo[i].exampleBox + '</div>';
            }

            //-----보기-----
            var oxClass = quizInfo[i].type == 'ox click' ? 'ox' : '';
            var addExampleSelect = quizInfo[i].exampleBox && quizInfo[i].exampleBox !== '' ? 'addExampleSelect' : '';
            element += '<div class="selectBox ' + oxClass + addExampleSelect + '" id="selectBox_' + (i + 1) + '">';

            for (var j = 0; j < quizInfo[i].select.length; j++) {
                //console.log(quizInfo[i].type);
                var leftTmp = '';
                if (quizInfo[i].type == 'text') {
                    if (quizInfo[i].select.length < 3) {
                        leftTmp = 'left:350px';
                    }
                    selectEl =
                        '\
                    <textarea class="selectWrite" id="selectWrite_' +
                        (i + 1) +
                        '_' +
                        (j + 1) +
                        '" style="resize: none;' +
                        leftTmp +
                        '">정답을 입력하세요.</textarea>';
                } else {
                    //ox 클릭일때는 ox로 붙이기
                    var oxClass = quizInfo[i].type == 'ox click' ? 'oxSelect oxSelect_' + (j + 1) : 'select';
                    var selectNumClass = quizInfo[i].type == 'ox click' ? 'selectNumOx_' + (j + 1) : 'selectNum';
                    selectEl =
                        '\
                    <button class="' +
                        oxClass +
                        '" id="select_' +
                        (i + 1) +
                        '_' +
                        (j + 1) +
                        '">\
                        <div class="selectNum ' +
                        selectNumClass +
                        '" id="selectNum_' +
                        (i + 1) +
                        '_' +
                        (j + 1) +
                        '">' +
                        returnCircle(j + 1) +
                        '</div>\
                        <div class="selectOx" id="selectOx_' +
                        (i + 1) +
                        '_' +
                        (j + 1) +
                        '"></div>\
                        <div class="selectText keepTheWord" id="selectText_' +
                        (i + 1) +
                        '_' +
                        (j + 1) +
                        '">' +
                        quizInfo[i].select[j] +
                        '</div>\
                    </button>';
                }
                element += selectEl;
            }

            element += '</div>'; //end selectBox
            //-----보기 end-----

            //-----결과-----

            //답이 여러개일 경우
            var dapStr = '';
            var result_bg = '';
            var topTmp = '';
            for (var j = 0; j < quizInfo[i].dap.length; j++) {
                dapStr += returnResultDap(i, quizInfo[i].dap[j]);
                if (j != quizInfo[i].dap.length - 1) dapStr += ', ';
            }

            // 2023.02.22 사제동행
            // CHAPTER / 과정 별 차이에 대한 정보 없어서 주석 처리함.
            // 향후 차이에 대한 정보 있을 경우 수정해서 작업
            if (quizInfo[i].type == 'ox click') {
                if (dapStr == 'O') {
                    result_bg = 'icon_ok.png';
                } else {
                    result_bg = 'icon_no.png';
                }

                resultEl =
                    '\
                    <div class="resultBox" id="resultBox_' +
                    (i + 1) +
                    '">\
                        <div class="resultDap" id="resultDap_' +
                    (i + 1) +
                    '" style="background: url(./common/images/quiz/' +
                    result_bg +
                    ') no-repeat;"></div>\
                        <div class="resultText keepTheWord" id="resultText_' +
                    (i + 1) +
                    '">' +
                    quizInfo[i].hassul +
                    '</div>\
                    </div>';

                element += resultEl;
            } else {
                // if(dapStr == "1" || dapStr == "2" || dapStr == "3" || dapStr == "4"){
                //     topTmp = "style='top:15px;'";
                // }
                resultEl =
                    '\
                    <div class="resultBox" id="resultBox_' +
                    (i + 1) +
                    '">\
                        <div class="resultDap" id="resultDap_' +
                    (i + 1) +
                    '" ' +
                    topTmp +
                    '><b>' +
                    dapStr +
                    '</b></div>\
                        <div class="resultText keepTheWord" id="resultText_' +
                    (i + 1) +
                    '">' +
                    quizInfo[i].hassul +
                    '</div>\
                    </div>';

                element += resultEl;
            }

            // if(CHAPTER > 1209 && CHAPTER < 1228){
            //     if(quizInfo[i].type == 'ox click') {
            //         resultEl = '\
            //             <div class="resultBox" id="resultBox_'+(i+1)+'">\
            //                 <div class="resultDap" id="resultDap_'+(i+1)+'" style="left: 23px;">'+dapStr+'</div>\
            //                 <div class="resultText keepTheWord" id="resultText_'+(i+1)+'">'+quizInfo[i].hassul+'</div>\
            //             </div>'

            //         element +=  resultEl;
            //     } else {
            //         resultEl = '\
            //             <div class="resultBox" id="resultBox_'+(i+1)+'">\
            //                 <div class="resultDap" id="resultDap_'+(i+1)+'">'+dapStr+'</div>\
            //                 <div class="resultText keepTheWord" id="resultText_'+(i+1)+'">'+quizInfo[i].hassul+'</div>\
            //             </div>'

            //         element +=  resultEl;
            //     }
            // } else{
            //     resultEl = '\
            //         <div class="resultBox" id="resultBox_'+(i+1)+'">\
            //             <div class="resultFix">\
            //             <div class="resultFix-dap">정답</div>\
            //             <div class="resultFix-haesul">해설</div>\
            //             </div>\
            //             <div class="resultDap" id="resultDap_'+(i+1)+'">'+dapStr+'</div>\
            //             <div class="resultText keepTheWord" id="resultText_'+(i+1)+'">'+quizInfo[i].hassul+'</div>\
            //         </div>'

            //     element +=  resultEl;
            // }
            //-----결과 end-----
            element += '</div>'; //end quizBox
        }

        //-----결과 보기 창-----
        // 2023.02.22 사제동행
        // CHAPTER / 과정 별 차이에 대한 정보 없어서 주석 처리함.
        // 향후 차이에 대한 정보 있을 경우 수정해서 작업
        element +=
            '\
        <div class="successBoxBasic">\
            <div class="successText">' +
            '<span class="allLength">' +
            quizInfo.length +
            '</span><span class="correctLength">' +
            1 +
            '</span>' +
            '</div>\
            \
            <div class="correctCircleBox">';

        //     element +=  '\
        //     <div class="successBox">\
        //         <div class="successText">'
        //         + '총 <span class="allLength">'+quizInfo.length+'</span>문항 중 <span class="correctLength">'+1+'</span>문항 맞았습니다!' + '</div>\
        //         \
        //         <div class="correctCircleBox">'

        for (var i = 0; i < quizInfo.length; i++) {
            // 2023.02.22 사제동행
            // CHAPTER / 과정 별 차이에 대한 정보 없어서 주석 처리함.
            // 향후 차이에 대한 정보 있을 경우 수정해서 작업
            successEl =
                '\
                <div class="circleBox" id="circleBox_' +
                (i + 1) +
                '">\
                    <div class="correctCircleBg"></div>\
                    <div class="correctCircleText"></div>\
                    <div class="correctCircle" id="correctCircle_' +
                (i + 1) +
                '"></div>\
                </div>';
            element += successEl;

            //     successEl = '\
            //         <div class="circleBox" id="circleBox_'+(i+1)+'">\
            //             <div class="correctCircleBg"></div>\
            //             <div class="correctCircleText">'+(i+1)+'</div>\
            //             <div class="correctCircle" id="correctCircle_'+(i+1)+'"></div>\
            //         </div>'
            //     element +=  successEl;
        }
        element += '</div>'; //end correctCircleBox
        element += '</div>'; //end successBox / successBoxBasic

        //-----결과 보기 창 end-----
        // 2023.02.22 사제동행
        // CHAPTER / 과정 별 차이에 대한 정보 없어서 주석 처리함.
        // 향후 차이에 대한 정보 있을 경우 수정해서 작업
        //-----버튼-----
        buttonBoxEl =
            '\
            \
            <div class="quizBlock"></div>\
            \
            <div class="buttonBox">\
                <button class="quizButton" id="retryBtn_sjdh"></button>\
                <button class="quizButton" id="showHaesulBtn_sjdh"></button>\
                <button class="quizButton" id="resolveBtn_sjdh"></button>\
                <button class="quizButton" id="resultBtn"></button>\
                <button class="quizButton" id="hintBtn"></button>\
                <button class="quizButton" id="successBtn_sjdh"></button>\
                <button class="quizButton" id="quizPrevBtn"></button>\
                <button class="quizButton" id="quizNextBtn_sjdh"></button>\
            </div>';
        //-----버튼 end-----
        element += buttonBoxEl;
        //     //-----버튼-----
        //     buttonBoxEl = '\
        //         \
        //         <div class="quizBlock"></div>\
        //         \
        //         <div class="buttonBox">\
        //             <button class="quizButton" id="retryBtn"></button>\
        //             <button class="quizButton" id="showHaesulBtn"></button>\
        //             <button class="quizButton" id="resolveBtn"></button>\
        //             <button class="quizButton" id="resultBtn"></button>\
        //             <button class="quizButton" id="hintBtn"></button>\
        //             <button class="quizButton" id="successBtn"></button>\
        //             <button class="quizButton" id="quizPrevBtn"></button>\
        //             <button class="quizButton" id="quizNextBtn"></button>\
        //         </div>'
        //     //-----버튼 end-----
        //     element +=  buttonBoxEl

        //-----얼럿창-----
        alertEl =
            '\
            <div class="alertBox">\
                <div class="alertMsg" id="alert_o"><img src="./common/images/quiz/alert_o.png" style="width: 100%;" /></div>\
                <div class="alertMsg" id="alert_retry"><img src="./common/images/quiz/alert_retry.png" style="width: 100%;" /></div>\
                <div class="alertMsg" id="alert_x"><img src="./common/images/quiz/alert_x.png" style="width: 100%;" /></div>\
                <div class="alertMsg" id="alert_noclick"><img src="./common/images/quiz/alert_noclick.png" style="width: 100%;" /></div>\
            </div>';

        //-----얼럿창 end-----
        element += alertEl;

        //-----해설팝업-----quizInfo
        haesulPopOpenEl =
            '\
        \
        <div id="haesulPop" >\
			<button type="button" id="closePop"  >닫기</button>\
            <div id="haesulList">';
        for (var i = 0; i < quizInfo.length; i++) {
            var dapString = '';
            for (var j = 0; j < quizInfo[i].dap.length; j++) {
                dapString += returnResultDap(i, quizInfo[i].dap[j]);
                if (j != quizInfo[i].dap.length - 1) dapString += ', ';
            }
            haesulEl +=
                '\
                        <div class="haesul_' +
                (i + 1) +
                '">\
                            <div class="">\
                            <div class="">' +
                (i + 1) +
                '번 정답 : ' +
                dapString +
                '</div>\
                            <div class="" id="">' +
                quizInfo[i].hassul +
                '</div>\
                            </div>\
                        </div>';
        }
        haesulPopCloseEl =
            '</div>\
        </div>\
        ';
        haesulPopEl = haesulPopOpenEl + haesulEl + haesulPopCloseEl;
        //-----해설팝업 end-----
        element += haesulPopEl;

        //-----사운드-----
        soundEl =
            '\
            <audio id="clickSnd" preload="auto"><source src="./common/mp3/click.mp3" type="audio/mpeg"></audio>\
            <audio id="q_right" preload="auto"><source src="./common/mp3/q_right.mp3" type="audio/mpeg"></audio>\
            <audio id="q_wrong" preload="auto"><source src="./common/mp3/q_wrong.mp3" type="audio/mpeg"></audio>\
            <audio id="q_wrong" preload="auto"><source src="./common/mp3/q_wrong.mp3" type="audio/mpeg"></audio>\
            <audio id="q_result" preload="auto"><source src="./common/mp3/q_result.mp3" type="audio/mpeg"></audio>';

        //-----사운드 end-----
        element += soundEl;

        $('.quizSetBox').append(element);

        //만약 타입이 mp3라면 인트로가 들어가니까 intro에 백그라운드 이미지를 붙인다
        if (MEDIA_INFO.type >= 'interaction_quiz') {
            // 2023.02.22 사제동행
            // CHAPTER / 과정 별 차이에 대한 정보 없어서 주석 처리함.
            // 향후 차이에 대한 정보 있을 경우 수정해서 작업
            $('.quizIntro').css({
                background: 'url(./common/images/quiz/quiz_start_bg.png) no-repeat',
                'background-size': 'contain',
            });
        }

        //스타트 버튼
        $('#quizStartBtn').on('click', function () {
            quizActive = true;
            //controller 의 quizIntroMotion()함수에 해당부분 있음
            controller.seekToTimeEnd();
            quizInit(); //퀴즈 리셋하기
            soundPlay('clickSnd');
        });
        $('#quizStartBtn').on('click', function () {
            quizActive = true;
            //controller 의 quizIntroMotion()함수에 해당부분 있음
            controller.seekToTimeEnd();
            quizInit(); //퀴즈 리셋하기
            soundPlay('clickSnd');
        });

        $('#closePop').on('click', function () {
            $('#haesulPop').hide();
        });

        $('.resultText').mCustomScrollbar({
            scrollButtons: { enable: true, scrollType: 'stepped' },
            keyboard: { scrollType: 'stepped' },
            mouseWheel: { scrollAmount: 60 },
            theme: 'light-thick',
            snapAmount: 60,
            snapOffset: 0,
        });

        //문제 넘버
        $('.munjeNum').each(function () {
            var id = $(this).attr('id').split('_').pop();
            // $(this).css({'background': 'url(./common/images/quiz/qNum_'+id+'.png) no-repeat'});
        });
    };

    //초기화
    var quizInit = function () {
        //myData 초기화
        myData.curPage = 1;

        for (var i = 0; i < quizInfo.length; i++) {
            myData.chance[i] = quizInfo[i].chance;
            myDataReset(i);
        }
        movePage(); //페이지 이동
    };

    // 틀린 문제만 나오도록
    var quizRetry = function () {
        myData.ifresolve = 0;

        for (var i = 0; i < quizInfo.length; i++) {
            myData.chance[i] = quizInfo[i].chance; // chance 횟수 초기화 여부 확인 필요
            myDataRetry(i);
        }
        //console.log(myData);
        //console.log(quizInfo);
        movePage(); //페이지 이동
        // // movePage_retry();//페이지 이동
    };

    var myDataReset = function (id) {
        //찬스만 빼고 지정
        myData.result[id] = false;
        myData.select[id] = [];

        for (var j = 0; j < quizInfo[id].select.length; j++) {
            myData.select[id].push(false);
        }
    };

    var myDataRetry = function (id) {
        if (myData.result[id] == 'incorrect') {
            if (ifresolveselect != 1) {
                myData.curPage = id + 1;
                //console.log("id : " + id);
                //console.log(myData.curPage);
                ifresolveselect = 1;
            }
            myData.result[id] = false;
            myData.select[id] = [];

            for (var j = 0; j < quizInfo[id].select.length; j++) {
                myData.select[id].push(false);
            }
        }
    };

    //페이지 이동
    var movePage = function () {
        firstInit(); //초기화

        if (ifretry != 0 && myData.result[myData.curPage - 1] == 'correct') {
            myData.curPage = myData.curPage + 1; // 일단 퀴즈 3개일때는 문제 없으나 4개 이상일 경우 해당 페이지 찾는 함수 만들어야됨.
        } else {
        }

        //맨처음 해당 번호가 보이게
        $('.quizBox').each(function () {
            $(this).css({ display: 'none' });
        });
        //맨처음 해당 번호가 보이게
        $('.quizBox_sjdh').each(function () {
            $(this).css({ display: 'none' });
        });
        //console.log(' movePage myData' , myData)

        // 2023.02.22 사제동행
        // CHAPTER / 과정 별 차이에 대한 정보 없어서 주석 처리함.
        // 향후 차이에 대한 정보 있을 경우 수정해서 작업
        $('#quizBox_' + myData.curPage).css({
            display: 'block',
            background: 'url(./common/images/quiz/quiz_bg0' + myData.curPage + '.png) no-repeat',
            'background-size': 'contain',
        });

        //     $('#quizBox_'+myData.curPage).css({
        //         display : 'block',
        //        'background':'url(./common/images/quiz/quiz_sjdh_'+myData.curPage+'.png) no-repeat'
        //    });

        //문제를 다 풀었을때는 막기, 안풀었을때는 안막기
        if (!myData.result[myData.curPage - 1]) $('.quizBlock').css({ display: 'none' });
        else $('.quizBlock').css({ display: 'block' });

        //정답 확인 버튼 보이게
        if (quizInfo[myData.curPage - 1].type !== 'select click' && quizInfo[myData.curPage - 1].type !== 'ox click')
            $('#resultBtn').css({ display: 'block' });
    };

    //초기화  만약 자기가 푼것을 볼수 있게 하려면 myData의 정보로 세팅을 다시한다.
    var firstInit = function () {
        $('#successBtn').css({ display: 'none' });
        $('#successBtn_sjdh').css({ display: 'none' });
        $('#resultBtn').css({ display: 'none' });
        $('#quizPrevBtn').css({ display: 'none' });
        $('#quizNextBtn').css({ display: 'none' });
        $('#quizNextBtn_sjdh').css({ display: 'none' });
        $('#retryBtn').css({ display: 'none' });
        $('#retryBtn_sjdh').css({ display: 'none' });
        $('#showHaesulBtn').css({ display: 'none' });
        $('#showHaesulBtn_sjdh').css({ display: 'none' });
        $('#resolveBtn').css({ display: 'none' });
        $('#resolveBtn_sjdh').css({ display: 'none' });
        $('#hintBtn').css({ display: 'none' });

        $('.successBox').css({ display: 'none' });
        $('.successBoxBasic').css({ display: 'none' });

        $('.munjeOx').each(function () {
            $(this).css({ display: 'none' });
        });

        $('.selectBox .select').each(function () {
            $(this).removeClass('active');
        });

        $('.resultBox').each(function () {
            $(this).css({ display: 'none' });
        });

        $('.alertBox').css({ display: 'none' });

        // $("#haesulPop").hide();
        $('#haesulPop').css({ display: 'none' });

        $('.select, .oxSelect').each(function () {
            $(this).children().removeClass('check');
            $(this).children().removeClass('answer');

            if (
                quizInfo[myData.curPage - 1].type == 'select click' ||
                quizInfo[myData.curPage - 1].type == 'ox click'
            ) {
                //보기 클릭일때는 마우스오버 되고
                $(this).on('mouseover', function () {
                    $(this).children().addClass('check');
                });

                $(this).on('mouseout', function () {
                    $(this).children().removeClass('check');
                });
            } else {
                //결과확인 클릭일땐 마우스 오버 안되고
                $(this).off('mouseover');
                $(this).off('mouseout');
            }
        });

        $('.munjeOx').each(function () {
            $(this).removeClass('correct');
            $(this).removeClass('incorrect');
            $(this).css({ display: 'none' });
        });

        $('.selectWrite').each(function () {
            $(this).val('');
        });

        $('.selectWrite').focus(function () {
            $(this).val('');
        });
    };

    //퀴즈 이벤트
    var quizEvent = function () {
        //====== 퀴즈 시작 ======
        //보기 버튼 클릭시
        $('.select, .oxSelect').each(function () {
            $(this).addClass('pointer');

            $(this).on('click', function (e) {
                var arr = $(this).attr('id').split('_');
                var p_id = Number(arr[1]);
                var id = Number(arr[2]);

                if (myData.select[p_id - 1][id - 1] == 'click') myData.select[p_id - 1][id - 1] = false;
                else myData.select[p_id - 1][id - 1] = 'click';

                //console.log(' myData : ', myData);

                if (quizInfo[p_id - 1].type == 'select click' || quizInfo[p_id - 1].type == 'ox click')
                    dapCheck(p_id); //타입이 select일때 보기 클릭시 바로 정답 체크
                else chooseSelect($(this), myData.select[p_id - 1][id - 1]); //타입이 result click (결과확인버튼 클릭)일때는 바로 정답체크 안함
            });

            $(this).on('mouseover', function () {
                $(this).children().addClass('check');
            });

            $(this).on('mouseout', function () {
                $(this).children().removeClass('check');
            });
        });

        //보기 텍스트
        $('.selectWrite').each(function () {
            $(this).on('keyup', function () {
                var arr = $(this).attr('id').split('_');
                var p_id = Number(arr[1]);
                var id = Number(arr[2]);
                var val = $(this).val();

                // 2023.02.22 사제동행
                // 공백문자 제외 처리
                // 정답에 공백문자가 필요할 경우 이 부분 수정

                // myData.select[p_id-1][id-1] = val;
                myData.select[p_id - 1][id - 1] = val.replace(/\s+/g, '');

                // console.log(' p_id : ', p_id, ' id : ', id, ' val : ', val);
                // console.log(' myData : ', myData);
            });
        });

        //정답 확인 버튼 클릭시
        $('#resultBtn').on('click', function (e) {
            //console.log("hihihihihihihihihihihihi")
            //console.log(myData['select'][myData.curPage-1]);
            dapCheck(myData.curPage);
        });

        //백넥스트 버튼
        $('#quizPrevBtn').on('click', function (e) {
            if (myData.curPage == 1) myData.curPage = 1;
            else myData.curPage--;
            soundPlay('clickSnd');
            movePage(); //페이지 이동
        });

        $('#quizNextBtn').on('click', function (e) {
            if (myData.curPage == quizInfo.length) myData.curPage = quizInfo.length;
            else myData.curPage++;
            soundPlay('clickSnd');
            movePage(); //페이지 이동
        });
        $('#quizNextBtn_sjdh').on('click', function (e) {
            if (myData.curPage == quizInfo.length) myData.curPage = quizInfo.length;
            else myData.curPage++;
            soundPlay('clickSnd');
            movePage(); //페이지 이동
        });

        //결과보기 버튼
        $('#successBtn').on('click', function (e) {
            soundPlay('q_result');
            makeResultPage();
        });
        //결과보기 버튼(기본과정)
        $('#successBtn_sjdh').on('click', function (e) {
            soundPlay('q_result');
            makeResultPage();
        });

        //리트라이 버튼
        $('#retryBtn').on('click', function (e) {
            soundPlay('clickSnd');
            quizInit();
        });
        //리트라이 버튼
        $('#retryBtn_sjdh').on('click', function (e) {
            $('.quizBox_sjdh').css({ opacity: '' }); // quizBox_sjdh opacity: 0.3;
            soundPlay('clickSnd');
            quizInit();
        });

        //다시 풀기 버튼
        $('#resolveBtn').on('click', function (e) {
            if ((ifresolveselect = 1)) {
                ifresolveselect = 0;
            }
            ifretry = 1;
            //console.log("다시풀기");
            soundPlay('clickSnd');
            quizRetry();
        });
        //다시 풀기 버튼
        $('#resolveBtn_sjdh').on('click', function (e) {
            $('.quizBox_sjdh').css({ opacity: '' }); // quizBox_sjdh opacity: 0.3;
            if ((ifresolveselect = 1)) {
                ifresolveselect = 0;
            }
            ifretry = 1;
            //console.log("다시풀기");
            soundPlay('clickSnd');
            quizRetry();
        });

        //해설 전체 보기 버튼
        $('#showHaesulBtn').on('click', function (e) {
            // alert("해설이다");
            soundPlay('clickSnd');
            $('#haesulPop').show();
        });
        //해설 전체 보기 버튼
        $('#showHaesulBtn_sjdh').on('click', function (e) {
            // alert("해설이다");
            soundPlay('clickSnd');
            $('#haesulPop').show();
        });
    };

    var chooseSelect = function (obj, click) {
        //console.log(' hasClass  check ', obj.hasClass('check'))
        if (!click) obj.children().removeClass('check');
        else obj.children().addClass('check');
        soundPlay('clickSnd');
    };

    //정답 체크
    var dapCheck = function (index) {
        var resultNum = 0;
        var plusNum = 0;
        var id = index - 1;
        var clickNum = 0;

        for (var j = 0; j < quizInfo[id].select.length; j++) {
            if (myData.select[id][j] !== false) {
                //클릭된것
                clickNum++;

                for (var k = 0; k < quizInfo[id].dap.length; k++) {
                    var dap = quizInfo[id].type !== 'text' ? j + 1 : myData.select[id][j]; //문제가 텍스트인지 클릭인지

                    var chkDap = quizInfo[id].dap[k];

                    if (quizInfo[id].type === 'text') {
                        dap = dap.toLowerCase();
                        chkDap = chkDap.toLowerCase();
                        dap = dap.replace(/ /g, '');
                        chkDap = chkDap.replace(/ /g, '');
                    }

                    //if(quizInfo[id].dap[k] == dap)//정답인것
                    if (chkDap == dap) {
                        //정답인것
                        plusNum++;
                    }
                }
            }
        }
        //console.log(' clickNum ', clickNum)
        if (quizInfo[id].type !== 'text') {
            //텍스트 문제가 아닐때(4지, 2지선다)
            if (clickNum >= 1) {
                //quizInfo[id].dap.length)
                if (clickNum == quizInfo[id].dap.length && plusNum == quizInfo[id].dap.length) {
                    //정답
                    correctEvt();
                } else {
                    //오답
                    incorrectEvt();
                }
            } else {
                //전부다 안풀었을때
                //console.log(quizInfo[id].type + ' == 전부다 안풀었을때 ');
                visibleAlert('noclick');
                soundPlay('clickSnd');
            }
        } else {
            // 2023.02.22 사제동행
            // 강의 콘텐츠 - 퀴즈 여러개 입력해야하는 주관식의 경우 모두 입력해야 정답 체크되도록
            const mydapconclusion = new Set(myData['select'][id]);
            //console.log(myData['select'][id])
            //console.log(mydapconclusion)
            // alert(testtesttest.length)
            // if(clickNum !== 0)
            // if(clickNum >= quizInfo[id].dap.length)//quizInfo[id].dap.length)
            if (clickNum == mydapconclusion.size) {
                //quizInfo[id].dap.length)
                if (plusNum == quizInfo[id].dap.length) {
                    //정답
                    correctEvt();
                } else {
                    //오답
                    incorrectEvt();
                }
            } else {
                if (clickNum == quizInfo[id].dap.length) {
                    //전부다 안풀었을때
                    //console.log( quizInfo[id].type + '전부다 안풀었을때' );
                    visibleAlert('noclick');
                    soundPlay('clickSnd');
                } else {
                    //전부다 안풀었을때
                    //console.log( quizInfo[id].type + '중복답 입력했을 때' );
                    visibleAlert('retry');
                    soundPlay('clickSnd');
                }
            }
        }

        //오답일때
        function incorrectEvt() {
            if (myData.chance[id] <= 0) {
                //찬스가 없으면
                //오답
                //console.log(quizInfo[id].type + '오답 ');
                myData.chance[id] = 0;
                myData.result[id] = 'incorrect';
                myData.ifresolve = 1;
                visibleAlert('x');
                setResult('x');
                soundPlay('q_wrong');
            } else {
                //찬스 다시 풀기
                //console.log(quizInfo[id].type + '찬스 다시 풀기 ');
                myData.chance[id]--;
                myDataReset(id);
                visibleAlert('retry');
                soundPlay('clickSnd');

                $('.select, .oxSelect').each(function () {
                    $(this).children().removeClass('check');
                });

                $('.selectWrite').each(function () {
                    $(this).val('');
                    $(this).focus();
                });
            }
        }

        //정답 일때
        function correctEvt() {
            //console.log(quizInfo[id].type + '정답 ');
            myData.result[id] = 'correct';
            visibleAlert('o');
            setResult('o');
            soundPlay('q_right');
            //내가 푼것 체크
        }

        //해설 보기!!
        function setResult(type) {
            $('#resultBox_' + index).fadeIn();

            //정답 후 정답확인 버튼 안보이고 문제 못풀게 막기
            $('.quizBlock').css({ display: 'block' });
            $('#resultBtn').css({ display: 'none' });

            if (quizInfo[id].type == 'text') {
                $('#resultDap_' + (id + 1)).css({
                    color: 'black',
                    left: '150px',
                    top: '17px',
                    width: '400px',
                    height: '100px',
                    'font-size': '26px',
                    background: 'none',
                });
                // $('#resultText_' + (id + 1)).css({
                //     'margin-top':'540px',
                //     'margin-left':'120px'
                // });
            }

            //모든 문제를 풀었을때는 결과 확인 버튼이 보이기
            for (var i = 0; i < myData.result.length; i++) {
                if (myData.result[i] !== false) resultNum++;
            }

            //console.log('  resultNum  ', resultNum);

            if (resultNum == myData.result.length) {
                $('#successBtn').css({ display: 'block' });
                $('#successBtn_sjdh').css({ display: 'block' });
                // $(top.document).find('.end-bubble').addClass('view');
                $('.end-bubble').addClass('view');
                // 2023.02.22 사제동행
                // 퀴즈 인트로 끝나기 전에 스타트 눌렀을 때 다음 페이지로 넘어가도록
                setQuizIntroDone();
                // console.log(curPageStatus)
            } else {
                //백넥스트 버튼 보이고 안보이고
                if (myData.curPage == 1) {
                    //$('#quizPrevBtn').css({'display' : 'none'});
                    $('#quizNextBtn').css({ display: 'block' });
                    $('#quizNextBtn_sjdh').css({ display: 'block' });
                } else if (myData.curPage == quizInfo.length) {
                    //$('#quizPrevBtn').css({'display' : 'block'});
                    $('#quizNextBtn').css({ display: 'none' });
                    $('#quizNextBtn_sjdh').css({ display: 'none' });
                } else {
                    //$('#quizPrevBtn').css({'display' : 'block'});
                    $('#quizNextBtn').css({ display: 'block' });
                    $('#quizNextBtn_sjdh').css({ display: 'block' });
                }
            }

            // 버튼!! 정답인것은 정답 내가 푼것은 체크
            $('.select, .oxSelect').each(function () {
                var arr = $(this).attr('id').split('_');
                var p_id = Number(arr[1]);
                var c_id = Number(arr[2]);

                if (id + 1 == p_id) {
                    $(this).off('mouseover');
                    $(this).off('mouseout');

                    if (quizInfo[p_id - 1].type == 'select click' || quizInfo[p_id - 1].type == 'ox click') {
                        //보기 클릭시 정답 나올때는 내가 클릭한것과 정답이 따로 나옴
                        for (var k = 0; k < quizInfo[p_id - 1].dap.length; k++) {
                            if (c_id == quizInfo[p_id - 1].dap[k]) $(this).children().addClass('answer'); //정답 클래스 붙이기
                        }

                        if (myData.select[p_id - 1][c_id - 1] == 'click') {
                            //console.log(' clcik ',  $(this).children())
                            $(this).children().removeClass('answer');
                            $(this).children().addClass('check');
                        }
                    } else {
                        //정답확인 버튼 클릭시 정답 나올때에는 정답일때는 체크한것이 오답일때는 정답만 나옴
                        if (type == 'x') {
                            $(this).children().removeClass('check');

                            for (var k = 0; k < quizInfo[p_id - 1].dap.length; k++) {
                                if (c_id == quizInfo[p_id - 1].dap[k]) $(this).children().addClass('answer'); //정답 클래스 붙이기
                            }
                        }
                    }
                }
            });

            //문제 정오답 모션
            var ox = type == 'o' ? 'correct' : 'incorrect';
            $('#munjeOx_' + (id + 1)).addClass(ox);
            $('#munjeOx_' + (id + 1)).fadeIn();
        }

        //console.log(' 정답체크 = plusNum ', plusNum, '  quizInfo[id].dap.length ', quizInfo[id].dap.length)
        //console.log(' 정답체크 = quizInfo[id].dap : ', quizInfo[id].dap);
        //console.log(' 정답체크 = myData : ', myData);
        //console.log(' 정답체크 = myData_select : ', myData['select'][id]);
        const testtesttest = new Set(myData['select'][id]);
        //console.log(' testtesttest : ', testtesttest);
    };

    //결과 보기 페이지
    var makeResultPage = function () {
        $('#successBtn').css({ display: 'none' });
        $('#successBtn_sjdh').css({ display: 'none' });
        $('.quizBox_sjdh').css({ opacity: '0.3' }); // quizBox_sjdh opacity: 0.3;

        $('.successBox').fadeIn();
        $('.successBoxBasic').fadeIn();
        // if(myData.ifresolve == 1){ // 틀린문제만 다시 풀기 가려둠
        //     $('#resolveBtn').fadeIn(); // 틀린문제 다시 풀기
        //     $('#resolveBtn_sjdh').fadeIn(); // 틀린문제 다시 풀기
        //     $('#showHaesulBtn').fadeIn();
        //     $('#showHaesulBtn_sjdh').fadeIn();
        // } else {
        $('#retryBtn').fadeIn();
        $('#retryBtn_sjdh').fadeIn();
        $('#showHaesulBtn').fadeIn();
        $('#showHaesulBtn_sjdh').fadeIn();
        // }

        $('.correctCircle').each(function (index) {
            $(this).removeClass('correct');
            $(this).removeClass('incorrect');
            var className = myData.result[index] == 'correct' ? 'correct' : 'incorrect';
            $(this).addClass(className);
        });

        var successNum = 0;
        //모든 문제를 풀었을때는 결과 확인 버튼이 보이기
        for (var i = 0; i < myData.result.length; i++) {
            if (myData.result[i] === 'correct') successNum++;
        }
        $('.correctLength').html(successNum);

        //말풍선 나오게
        QUIZ_SUMMARY_END = true;
        controller.lastBubble();
        // $(top.document).find('.end-bubble').addClass('view');
        $('.end-bubble').addClass('view');
    };

    var visibleAlert = function (type) {
        $('.alertMsg').each(function () {
            $(this).css({ display: 'none' });
            $(this).on('click', function () {
                $('.alertBox').fadeOut();
                clearTimeout(alertTimer);
            });
        });
        $('#alert_' + type).css({ display: 'block' });
        $('.alertBox').fadeIn();

        alertTimer = setTimeout(function () {
            $('.alertBox').fadeOut();
        }, 1000);
    };

    var setActive = function (type) {
        if (type == 'startVisibleNot') {
            //퀴즈 스타트 버튼 없는부분
            quizActive = false;
            $('.quizSetBox').fadeOut();
            $('.quizIntro').fadeIn();
            $('#quizStartBtn').fadeOut();
            $('#quizStartBtn').fadeOut();
            $('.scrownVideo').css({ display: 'block' });
        } else if (type == 'startClick') {
            //퀴즈 스타트 버튼 클릭시
            $('.quizSetBox').fadeIn();
            $('.quizIntro').fadeOut();
            $('#quizStartBtn').fadeOut();
            $('#quizStartBtn').fadeOut();
            $('.scrownVideo').css({ display: 'none' });
        } else if (type == 'startVisible') {
            //퀴즈 스타트 버튼 나오는 부분
            $('.quizSetBox').fadeOut();
            $('.quizIntro').fadeIn();
            $('#quizStartBtn').fadeIn();
            $('#quizStartBtn').fadeIn();
            $('.scrownVideo').css({ display: 'block' });
        }
    };

    var returnQuizActive = function () {
        return quizActive;
    };

    function returnCircle(num) {
        var str = '';
        switch (num) {
            case 1:
                str = '①';
                break;
            case 2:
                str = '②';
                break;
            case 3:
                str = '③';
                break;
            case 4:
                str = '④';
                break;
        }

        return str;
    }

    function replaceText(str) {
        var txt = str.replace(/@q/gi, '<span class="emphasizeText">').replace(/@w/gi, '</span>');
        return txt;
    }

    function returnResultDap(i, dap) {
        var str;
        if (quizInfo[i].type == 'ox click') {
            if (dap == 1) str = 'O';
            else str = 'X';
        } else {
            str = dap;
        }

        return str;
    }

    function soundPlay(type) {
        var sndObj = $('#' + type);
        //console.log('controller ', controller);
        sndObj[0].volume = controller.volume();
        sndObj.prop('currentTime', 0);
        sndObj.trigger('play');
    }

    return {
        init: init,
        quizActive: returnQuizActive,
        setActive: setActive,
    };
})();
