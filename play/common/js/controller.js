var isProgressPer = 0;

//컨트롤러
var controller = (function () {
    var media, player;
    var loading = false;
    var state = 'play';
    var duration = 0;
    var defaultVol = 0.5; //기본 볼륨값
    var currentVol;
    var endFlag = false;
    var canPlay = false;
    var setTimer;
    var bookMrkArr = [];

    var init = function () {
        // body 영역의 마우스 이벤트 리스너 추가
        $('body').on('mouseleave', function () {
            $('.scrownControls, .menuBox, .menuObj.view').stop().fadeOut(400); // 두 요소를 400밀리초 동안 점차적으로 사라지게 함
        });

        $('body').on('mouseenter', function () {
            $('.scrownControls, .menuBox, .menuObj.view').stop().fadeIn(400); // 두 요소를 400밀리초 동안 점차적으로 나타나게 함
        });

        makeElement(); //태그 생성
        playerFirst(); //맨처음 플레이어바 초기화
        setCurrentVolume(); //볼륨 세팅
        setController(); //컨트롤러 세팅
        rateInit(); //배속초기화

        if (NOWPAGE === 3) {
            // 예를 들어 페이지 2와 4에서 전체화면 버튼을 숨기고 싶다면
            $('#fullscreen').hide();
            $('#exitfullscreen').hide();
            $('.player_rate-dummy').hide();
        }
    };

    //태그 생성
    var makeElement = function () {
        /*
         * 미디어 붙이기
         * 비디오 일때, 오디오 일때
         */
        var mediaElement = '';
        if (MEDIA_INFO.type == 'mp4') {
            //mp4
            //자막여부
            var vttStr =
                MEDIA_INFO.vtt && MEDIA_INFO.vtt !== ''
                    ? '<track src="' + MEDIA_INFO.vtt + '" kind="subtitles" srclang="kr" label="korean">'
                    : '';

            //붙이기
            ////MEDIA_INFO.link 값 : common.js > main.init()
            mediaElement =
                '\
                <video class="scrownVideo" preload="metadata" playsinline="playsinline">\
                    <source src="' +
                MEDIA_INFO.link +
                '" type="video/mp4">' +
                vttStr +
                '\
                </video>';

            $('.scrownMedia').append(mediaElement);
            media = $('.scrownVideo');

            var playElement =
                '\
            <div class="st-playBox">\
                <div class="st-play"></div>\
            </div>';

            $('.scrownPlayer').append(playElement);
        } else if (MEDIA_INFO.type == 'summary') {
            mediaElement =
                '\
                <video class="scrownVideo" preload="metadata" playsinline="playsinline" style="display:none;">\
                    <source muted autoplay src="' +
                MEDIA_INFO.link +
                '" type="video/mp4">\
                </video>';

            $('.scrownMedia').append(mediaElement);
            media = $('.scrownVideo');
        } else {
            //퀴즈 mp3
            mediaElement =
                '\
			<audio class="scrownAudio">\
				<source src="' +
                MEDIA_INFO.link +
                '" type="audio/mp3">\
			</audio>';

            $('.scrownMedia').append(mediaElement);
            media = $('.scrownAudio');
        }

        //로딩과 영상화면에 플레이 버튼
        var loadElement =
            '\
            <div class="st-loading"></div>\
            <div class="end-bubble"></div>';
        $('.scrownPlayer').append(loadElement);

        player = $('.scrownPlayer');

        // media.load();
        if (media.length > 0 && typeof media[0].load === 'function') {
            media[0].load();
        }
        // 자동 재생 제거 - 사용자가 클릭할 때 재생되도록 변경
        // media[0].play();
        /*
         * 컨트롤러 붙이기
         * leftBtnBox 와 rightBtnBox 로 나뉘는데
         * leftBtnBox는 왼쪽으로 정렬 - html태그 순서대로
         * rightBtnBox 오른쪽으로 정렬 - html태그 순서의 반대로
         */

        var controllerElement =
            '\
        \
        <div class="scrownControls">\
            <div class="scrownControlUp"></div>\
            \
            <div class="progress-bar" title="진행바">\
                <div class="progress-range" style="width: 100%;">\
                    <div class="progress-handle"></div>\
                </div>\
            </div>\
            \
            \
            <div class="leftBtnBox">\
                <button class="button" id="menuToggleBtn" title="메뉴" >INDEX</button>\
                <button class="button" id="playBtn" title="재생" ></button>\
                <button class="button" id="pauseBtn" title="일시정지" ></button>\
                <button class="button" id="replayBtn" title="다시보기"></button>\
                <button class="button" id="scriptBtn" style="display:none;" title="자막 열기/닫기" ></button>\
                <button class="button" id="guideBtn" style="display:none;" title="가이드" ></button>\
                <button class="button" id="downBtn" style="display:none;" title="다운로드" ></button>\
                <div class="timeBox">\
                    <span class="timeCurrent" title="현재시간">00:00</span>\
                    <span class="timeSep">/</span>\
                    <span class="timeDuration" title="전체시간">00:00</span>\
                </div>\
            </div>\
            \
            \
            <div class="rightBtnBox">\
                \
                \
                <div class="player_rate-dummy">\
                    <div class="player_rate_over off">\
                        <ul>\
                        </ul>\
                    </div>\
                    <div class="player_rate-dummy2">\
                        <div class="player_rate off">\
                            <div class="rate on" value="1" title="배속 1" style="display: block;">x1.0</div>\
                            <div class="rate" value="1.2" title="배속 1.2" style="display: none;">x1.2</div>\
                            <div class="rate" value="1.5" title="배속 1.5" style="display: none;">x1.5</div>\
                            <div class="rate" value="1.8" title="배속 1.8" style="display: none;">x1.8</div>\
                            <div class="rate" value="2" title="배속 2" style="display: none;">x2.0</div>\
                        </div>\
                    </div>\
                </div>\
                \
                \
                <div class="volumeBox">\
                    <div class="volume-bar" title="소리조절바">\
                        <div class="volume-range" style="width: 50%;">\
                            <div class="volume-handle"></div>\
                        </div>\
                    </div>\
                    <button class="button" id="mute" title="음소거" ></button>\
                    <button class="button" id="unmute" title="음복구"></button>\
                </div>\
                \
                <button class="button" id="fullscreen" title="전체화면" ></button>\
                <button class="button" id="exitfullscreen" title="전체화면 해제" ></button>\
                \
                <div class="pageBox">\
                    <button class="button goPrev" id="prevBtn" title="이전페이지" ></button>\
                    \
                    <div class="page">\
                        <span class="pageCurrent" title="현재 페이지">' +
            utility.digit(NOWPAGE) +
            '</span>\
                        <span class="pageSep">/</span>\
                        <span class="pageTotal" title="전체 페이지">' +
            utility.digit(TOTALPAGE) +
            '</span>\
                    </div>\
                    <button class="button goNext" id="nextBtn" title="다음페이지" ></button>\
                </div>\
                \
            </div>\
            \
        </div>';
        console.log(utility.digit(NOWPAGE));
        console.log(NOWPAGE);

        $('.scrownPlayer').append(controllerElement);
        // $('.scrownMedia').append(controllerElement);

        var centerPrevNext =
            '\
            <div class="centerPnNBox">\
				<div class="centerPlay"></div>\
                </div>\
            </div>';

        $('.scrownPlayer').append(centerPrevNext);

        // 북마크 UI 관련 코드 완전 제거
        // (bookmkElement 및 관련 append 코드 삭제)
    };

    //플레이어 초기화
    var playerFirst = function () {
        //맨처음 플레이어바 초기화
        $('.progress-handle').css({ left: 0 + 'px' });
        $('.progress-range').css({ width: 0 + '%' });
        player.removeClass('fullscreen');

        //풀스크린 안될때 버튼 안보이게 함
        if (!FULLSCREEN_VISIBLE) {
            $('#fullscreen').show();
            $('#exitfullscreen').hide();
        } else {
            $('#fullscreen').show();
            $('#exitfullscreen').hide();
        }
    };

    var setController = function () {
        //로딩 시
        media.on('loadedmetadata', function () {
            duration = media[0].duration;
            $('.timeDuration').html(utility.timeFormat(duration)); //총 시간 표시
        });

        // 영상 로딩 오류 처리
        media.on('error', function (e) {
            console.error('영상 로딩 오류:', e);
            $('.st-loading').css({ display: 'none' });
            $('.scrownMedia').html('<div style="color: white; text-align: center; padding: 50px; font-size: 18px;">영상을 로드할 수 없습니다.</div>');
        });

        //재생 가능할때!
        media.on('canplaythrough', function () {
            console.log('영상 재생 가능');
            $('.st-loading').css({ display: 'none' });

            //크롬일때 바로 자동재생 안됨
            if (BROWSER_TYPE == 'Chrome') {
                console.log('크롬 브라우저 - 일시정지 상태로 설정');
                state = 'pause';
            }
        });

        //버퍼링에 의해 멈춘 후 다시 재생될 때
        media.on('playing', function () {
            $('.st-loading').css({ display: 'none' });
        });

        //사용자에 의해 위치값이 바뀐 경우
        media.on('seeking', function () {
            endFlag = false;
            $('.st-loading').css({ display: 'block' });
        });

        //seeked 이벤트리스너, seeking한 후 다시 재생될 때
        media.on('seeked', function () {
            $('.st-loading').css({ display: 'none' });
        });

        //버퍼링 대기중
        media.on('waiting', function () {
            $('.st-loading').css({ display: 'none' });
        });

        //종료시
        media.on('ended', function () {
            state = 'pause';
            playContents(state);
            $('#playBtn').removeClass('on');

            endFlag = true;
            lastBubble();
        });

        media.on('timeupdate', timeUpdateEvt);

        //=========== 클릭 이벤트 ============
        //help 토글 버튼
        //누르면 영상 일시중지 / 재생
        $('#mapBtn').on('click', function (e) {
            helpMenuToggle();
        });
        //북마크 토글 버튼
        $('#bookmkBtn').on('click', function (e) {
            bookmkToggle();
        });
        //메뉴 토글 버튼
        $('#menuToggleBtn').on('click', function (e) {
            menuToggle();
        });
        //플레이 버튼
        $('#playBtn').on('click', function (e) {
            //console.log('state ', state);
            state = state == 'pause' ? 'play' : 'pause';
            playContents(state);
        });
        //플레이 버튼
        $('.centerPlay').on('click', function (e) {
            //console.log('state ', state);
            state = state == 'pause' ? 'play' : 'pause';
            playContents(state);
        });
        //퍼즈 버튼
        $('#pauseBtn').on('click', function (e) {
            //console.log('state ', state);
            state = 'pause';
            playContents(state);
        });
        //다시보기 버튼
        $('#replayBtn').on('click', function (e) {
            media[0].currentTime = 0;
            $('.progress-range').width($('.progress-handle').width() / 2 + 'px');
            endFlag = false;
            state = 'play';
            playContents(state);
        });
        //가이드 버튼
        $('#guideBtn').on('click', function (e) {
            alert('가이드 팝업');
        });
        //자막 버튼
        $('#scriptBtn').on('click', function (e) {
            scriptToggle();
        });
        //자막 닫기
        $('#scriptCloseBtn').on('click', function (e) {
            //console.log('=====closed====');
            scriptToggle();
        });
        function scriptToggle() {
            if (!$('#scriptBtn').hasClass('on')) {
                $('#scriptBtn').addClass('on');
                $('.scriptObj').addClass('on');
            } else {
                $('#scriptBtn').removeClass('on');
                $('.scriptObj').removeClass('on');
            }
        }
        //음소거 안되는 버튼 이벤트리스너
        $('#mute').on('click', function (e) {
            setVolume('on');
        });
        //음소거 버튼 이벤트리스너
        $('#unmute').on('click', function (e) {
            setVolume('off');
        });
        //풀스크린 버튼
        $('#fullscreen').on('click', function (e) {
            if (getTrainingType() == 'TT02' && progressComplete == 'N') {
                popLayer('현재 페이지 학습이 완료되어야 전체화면기능이 가능합니다.');
            } else {
                player.fullScreen(true);
            }
        });
        //풀스크린 버튼 esc
        $('#exitfullscreen').on('click', function (e) {
            player.fullScreen(false);
            $('.scrownMedia').css({
                transform: 'none',
            });
        });
        //풀스크린 체인지 이벤트
        $(document).on('fullscreenchange', function () {
            fullScreenToggle();
        });
        window.onkeydown = function () {
            switch (window.event.keyCode) {
                case 27:
                    //console.log('esc');
                    break;
            }
        };

        $(document).on('click', '.subBookmkMenu', function () {
            // console.log($(this).attr("data-time"))
            // var thischapter = $(this).attr("data-time").split('_')[0];
            var thistime = $(this).attr('data-time').split('_')[1];

            // console.log(thischapter)
            // console.log(thistime)
            // console.log(bookMrkArr)
            // console.log(media[0].currentTime)

            // media[0].currentTime = media[0].duration * per / 100;
            media[0].currentTime = bookMrkArr[CHAPTER][thistime - 1][1];

            // console.log(media[0].currentTime)

            // 현재는 playerinfo에서 조정하지만 common에서 다 같이 조정할 수 있도록 시도 예정

            playContents('play');
        });

        function fullScreenToggle() {
            //console.log('FULL_SCREEN : ', FULL_SCREEN);
            if (!FULL_SCREEN) {
                FULL_SCREEN = true;
                player.addClass('fullscreen');
                $('#fullscreen').hide();
                $('#exitfullscreen').show();
            } else {
                FULL_SCREEN = false;
                player.removeClass('fullscreen');
                $('#fullscreen').show();
                $('#exitfullscreen').hide();
                setTimeout(() => {
                    $('.scrownMedia').css({
                        transform: '',
                        '-webkit-transform': '',
                    });
                }, 10);
            }
        }

        //이전 버튼s
        $('.goPrev').on('click', function (e) {
            if (NOWPAGE == 1) {
                alert('첫 페이지입니다.');
                return;
            }
            if (CHAPTER < 10) {
                location.href = '0' + CHAPTER + '_' + utility.digit(NOWPAGE - 1) + '.html';
            } else {
                location.href = CHAPTER + '_' + utility.digit(NOWPAGE - 1) + '.html';
            }
            // location.href = utility.digit(NOWPAGE-1) + '.html';
        });

        //다음 버튼
        $('.goNext').on('click', function (e) {
            var pageComplete = getPageComplete(pageNum, hideTime);
            var mpageNum = pageNum + 1;
            if (pageComplete == 'PASS') {
                nextPg_Go();
            } else {
                popLayer('현재페이지 학습이 완료되어야 다음페이지로 이동이 가능합니다.');
            }
        });

        //다음말풍선 알림 클릭시에도 다음버튼 클릭 이벤트 실행
        $('.end-bubble').on('click', function (e) {
            var pageComplete = getPageComplete(pageNum, hideTime);
            var mpageNum = pageNum + 1;
            if (pageComplete == 'PASS') {
                nextPg_Go();
            } else {
                popLayer('현재페이지 학습이 완료되어야 다음페이지로 이동이 가능합니다.');
            }
        });

        function nextPg_Go() {
            if (NOWPAGE == TOTALPAGE) {
                alert('마지막 페이지입니다.');
                return;
            } else {
                if (controlBar) {
                    //컨트롤바 제어 할 경우
                    if (curPageStatus == 'Y') {
                        if (CHAPTER < 10) {
                            location.href = '0' + CHAPTER + '_' + utility.digit(NOWPAGE + 1) + '.html';
                        } else {
                            location.href = CHAPTER + '_' + utility.digit(NOWPAGE + 1) + '.html';
                        }
                    } else {
                        if (media[0].currentTime >= media[0].duration) {
                            if (CHAPTER < 10) {
                                location.href = '0' + CHAPTER + '_' + utility.digit(NOWPAGE + 1) + '.html';
                            } else {
                                location.href = CHAPTER + '_' + utility.digit(NOWPAGE + 1) + '.html';
                            }
                        } else {
                            alert('학습이 완료되지 않았습니다.');
                        }
                    }
                } else {
                    if (CHAPTER < 10) {
                        location.href = '0' + CHAPTER + '_' + utility.digit(NOWPAGE + 1) + '.html';
                    } else {
                        location.href = CHAPTER + '_' + utility.digit(NOWPAGE + 1) + '.html';
                    }
                }
            }
        }

        setInterval(seekTimeBookMk, 200);

        function seekTimeBookMk() {
            var nt = media[0].currentTime;

            const element_0 = bookMrkArr[CHAPTER][0][1];
            const element_1 = bookMrkArr[CHAPTER][1][1];
            const element_2 = bookMrkArr[CHAPTER][2][1];

            if (nt < element_0) {
                $('#sbookmk_1 > li').css({ 'font-weight': 'inherit' });
                $('#sbookmk_2 > li').css({ 'font-weight': 'inherit' });
                $('#sbookmk_3 > li').css({ 'font-weight': 'inherit' });
            } else if (nt < element_1) {
                $('#sbookmk_1 > li').css({ 'font-weight': 'bold' });
                $('#sbookmk_2 > li').css({ 'font-weight': 'inherit' });
                $('#sbookmk_3 > li').css({ 'font-weight': 'inherit' });
            } else if (nt < element_2) {
                $('#sbookmk_1 > li').css({ 'font-weight': 'inherit' });
                $('#sbookmk_2 > li').css({ 'font-weight': 'bold' });
                $('#sbookmk_3 > li').css({ 'font-weight': 'inherit' });
            } else {
                $('#sbookmk_1 > li').css({ 'font-weight': 'inherit' });
                $('#sbookmk_2 > li').css({ 'font-weight': 'inherit' });
                $('#sbookmk_3 > li').css({ 'font-weight': 'bold' });
            }
        }

        $('.st-playBox').on('click', function () {
            state = state == 'pause' ? 'play' : 'pause';
            playContents(state);
        });

        $('.st-playBox').on('mouseover', function () {
            $('.st-play').css({ 'background-position': '-240px 0px' });
        });

        $('.st-playBox').on('mouseout', function () {
            $('.st-play').css({ 'background-position': '0px 0px' });
        });

        //=========== 플레이어 이벤트 ============

        //타임라인 클릭
        var dragging = false;

        $('.progress-bar')
            .off()
            .on('mousedown', function (e) {
                if (getTrainingType() == 'TT02' && progressComplete == 'N') {
                    popLayer('현재 페이지 학습이 완료되어야 이동 가능합니다.');
                } else {
                    if (controlBar) {
                        //컨트롤바 제어 할 경우
                        if (curPageStatus == 'Y') {
                            moveProgressBar(e.pageX);
                            dragging = true;
                            endFlag = false;
                            //media[0].pause();
                        } else {
                            alert('학습이 완료되지 않았습니다.');
                        }
                    } else {
                        moveProgressBar(e.pageX);
                        dragging = true;
                        endFlag = false;
                        //media[0].pause();
                    }
                }
            });

        $('.progress-handle').on('mousedown', function (e) {
            if (getTrainingType() == 'TT02' && progressComplete == 'N') {
                popLayer('현재 페이지 학습이 완료되어야 이동 가능합니다.');
            } else {
                if (controlBar) {
                    //컨트롤바 제어 할 경우
                    if (curPageStatus == 'Y') {
                        dragging = true;
                        //media[0].pause();
                        moveProgressBar(e.pageX);
                    } else {
                        alert('학습이 완료되지 않았습니다.');
                    }
                } else {
                    dragging = true;
                    //media[0].pause();
                    moveProgressBar(e.pageX);
                }
            }
        });

        $(window).on('mouseup', function (e) {
            if (dragging) {
                dragging = false;
                moveProgressBar(e.pageX);
                media[0].play();
            }
        });

        $(window).on('mousemove', function (e) {
            if (dragging) moveProgressBar(e.pageX);
        });

        //타임라인 바 헤드 오브젝트 움직이기
        function moveProgressBar(point) {
            var pos = point - $('.progress-bar').offset().left;
            var per = (100 * pos) / $('.progress-bar').width();

            if (per < 0) per = 0;
            if (per > 100) per = 100;

            $('.progress-range').css({ width: per + '%' });
            media[0].currentTime = (media[0].duration * per) / 100;

            playContents('play');
        }

        //볼륨
        var volDrag = false;

        $('.volume-bar')
            .off()
            .on('mousedown', function (e) {
                volDrag = true;
                moveVolumeBar(e.pageX);
            });

        $('.volume-handle').on('mousedown', function (e) {
            volDrag = true;
        });

        $(window).on('mouseup', function (e) {
            if (volDrag) {
                volDrag = false;
                moveVolumeBar(e.pageX);
            }
        });

        $(window).on('mousemove', function (e) {
            if (volDrag) moveVolumeBar(e.pageX);
        });

        //볼륨 바 헤드 오브젝트 움직이기
        function moveVolumeBar(point) {
            var volPos = point - $('.volume-bar').offset().left;
            var volPer = (100 * volPos) / $('.volume-bar').width();

            if (volPer < 0) volPer = 0;
            if (volPer > 100) volPer = 100;

            currentVol = volPer / 100;
            if (currentVol <= 0) setVolume('off');
            else setVolume('on');
        }

        $('#downBtn').on('click', function () {
            // alert('프로토에서는 지원하지 않습니다.')
            alert('자료 다운로드 팝업');
            // window.open("./common/down/"+utility.digit(CHAPTER)+".zip"); // zip
            // window.open("./common/down/"+utility.digit(CHAPTER)+".pdf"); // pdf
        });
    };
    //배속버튼 이벤트
    var rateEvent = function () {
        $('.scrownControls .rate').off('click');
        $('.scrownControls .rate').on('click', function (e) {
            if (getTrainingType() == 'TT02' && progressComplete == 'N') {
                popLayer('현재 페이지 학습이 완료되어야 배속기능이 가능합니다.');
            } else {
                var btn_obj = new Array();
                var rate_obj;

                $.each($('.scrownControls .player_rate .rate'), function (index, el) {
                    btn_obj.push($(this));
                    $(this).removeClass('on');
                    $(this).hide();
                });
                for (i = 0; i < btn_obj.length; i++) {
                    if (btn_obj[i].attr('value') == $(this).attr('value')) {
                        if (i == btn_obj.length - 1) rate_obj = btn_obj[0]; //마지막은 첫번째로
                        else rate_obj = btn_obj[i + 1]; //마지막 아니면 다음 엘리먼트
                    }
                }
                //배속설정
                media[0].playbackRate = Number(rate_obj.attr('value'));

                rate_obj.show();
                rate_obj.addClass('on');
                utility.setCookie('rate', media[0].playbackRate, 30);

                $('.player_rate_over').removeClass('off').addClass('on');
                $('.player_rate').removeClass('off').addClass('on');
            }
        });

        /* 배속 버튼 */
        $('.player_rate-dummy').on('mouseover', function () {
            if (getTrainingType() == 'TT02' && progressComplete == 'N') {
                //popLayer('현재 페이지 학습이 완료되어야 배속기능이 가능합니다.');
            } else {
                $('.player_rate_over').removeClass('off').addClass('on');
                $('.player_rate').removeClass('off').addClass('on');
            }
        });

        $('.player_rate-dummy').on('mouseout', function () {
            $('.player_rate_over').removeClass('on').addClass('off');
            $('.player_rate').removeClass('on').addClass('off');
        });

        //배속 롤오버 설정
        var _player_rate_overEL = '';
        var btn_obj = new Array();
        $.each($('.scrownControls .player_rate .rate'), function (index, el) {
            btn_obj.push($(this));
        });
        for (i = 0; i < btn_obj.length; i++) {
            var _vv = parseFloat(btn_obj[i].attr('value')).toFixed(1);
            _player_rate_overEL +=
                "<li value='" +
                btn_obj[i].attr('value') +
                "'  title='" +
                btn_obj[i].attr('title') +
                "'>" +
                _vv +
                '</li>';
        }
        $('.player_rate_over').append('<ul>' + _player_rate_overEL + '</ul>');

        $('.player_rate_over li').off('click');
        $('.player_rate_over li').on('click', function () {
            rateClick($(this).html());
            //$('.player_rate_over').fadeOut(200);
            $('.player_rate_over').removeClass('on').addClass('off');
            $('.player_rate').removeClass('on').addClass('off');
            $('.player_rate').blur();
        });
    };

    var rateInit = function () {
        if (BROWSER_TYPE.substr(0, 2) == 'IE') {
            //$('.player_rate-dummy').css({'display':'none'})
            //return;
        }

        if (controlBar) {
            //컨트롤바 제어 할 경우.
            if (curPageStatus == 'Y') {
                var _rate;
                _rate = utility.getCookie('rate'); //<----------- 배속 이어지게 선택

                if (_rate == null || _rate == undefined || _rate == '') _rate = 1;
                media[0].playbackRate = _rate;

                $('.rate').each(function () {
                    $(this).hide();
                });
                $('.scrownControls .rate[value="' + _rate + '"]').addClass('on');
                $('.scrownControls .rate[value="' + _rate + '"]').show();

                rateEvent(); //배속이벤트
            } else {
                //미완료 페이지 학습 중일때 배속버튼 안보이게 하기
                media[0].playbackRate = 1;
                $('.player_rate-dummy').css({ display: 'none' });
                return;
            }
        } else {
            var _rate;
            _rate = utility.getCookie('rate'); //<----------- 배속 이어지게 선택

            if (_rate == null || _rate == undefined || _rate == '') _rate = 1;
            media[0].playbackRate = _rate;

            $('.rate').each(function () {
                $(this).hide();
            });
            $('.scrownControls .rate[value="' + _rate + '"]').addClass('on');
            $('.scrownControls .rate[value="' + _rate + '"]').show();

            rateEvent(); //배속이벤트
        }
    };
    //배속버튼 클릭
    var rateClick = function (val) {
        //배속설정
        //console.log('val ', val);
        $('.scrownControls .rate').hide();
        media[0].playbackRate = Number(val);

        var btn_obj = new Array();
        var rate_obj;

        $.each($('.scrownControls .player_rate .rate'), function (index, el) {
            btn_obj.push($(this));
            $(this).removeClass('on');
        });

        var tempVal = val == '1.0' || val == '2.0' ? val.substr(0, 1) : val;
        for (var i = 0; i < btn_obj.length; i++) {
            if (btn_obj[i].attr('value') == tempVal) rate_obj = btn_obj[i];
        }

        rate_obj.show();
        rate_obj.addClass('on');
        utility.setCookie('rate', media[0].playbackRate, 30);
    };

    //타임업데이트 함수. timeupdate시 매번 호출
    var timeUpdateEvt = function () {
        //자동실행이 되면 play 버튼 삭제
        if (!loading && !media[0].paused) {
            loading = true;
            state = 'play';
            //console.log('playplay')
            $('#playBtn').css({ display: 'none' });
            $('#pauseBtn').css({ display: 'block' });
            if (PAGE_INFO[NOWPAGE - 1].type == 'mp4') {
                $('.centerPlay').css({ opacity: '0' });
            } else {
                $('.centerPlay').css({ display: 'none' });
            }
        }

        var curTime = media[0].currentTime;
        var totalTime = media[0].duration;
        var per = (curTime / totalTime) * 100;
        isProgressPer = per / 100;
        if (per > 100) per = 100; //IE에서 currentTime이 duration보다 커지는 경우 발생(소수점)

        $('.progress-range').css({ width: per + '%' });
        $('.timeCurrent').html(utility.timeFormat(media[0].currentTime)); //현재시간 보여주기

        if (media[0].currentTime >= media[0].duration) lastBubble(); //끝났을 때
        else lastBubleHidden();

        seekingSink(media[0].currentTime); //싱크 찾기
        quizIntroMotion(); //퀴즈일때 예외 - 스타트버튼이 나와야 함

        //자막내용붙이기
        if (PAGE_INFO[NOWPAGE - 1].vtt == 'on') {
            ///vtt///
            media[0].textTracks[0].mode = 'hidden';
            var track = media[0].textTracks[0];
            var activeCue;
            try {
                activeCue = track.activeCues[0];

                $('#scrollTextBox').html(activeCue.text.replace('\n', '<br/>'));
                $('#scrollTextBox').css({ 'text-align': 'center' });
                $('.scriptObj').addClass('vttScript');
                $('.scriptObj').removeClass('nomalScript');
            } catch (e) {
                $('#scrollTextBox').html('');
            }
        } else {
            $('#scrollTextBox').html(PAGE_INFO[NOWPAGE - 1].script);
            $('#scrollTextBox').css({ 'text-align': 'left' });
            $('.scriptObj').addClass('nomalScript');
            $('.scriptObj').removeClass('vttScript');
        }
    };

    //시작과 종료
    var playContents = function (st) {
        if (st == 'play') {
            console.log('재생 시작');
            media[0].play().then(function() {
                console.log('영상 재생 성공');
            }).catch(function(error) {
                console.error('영상 재생 실패:', error);
            });
            $('#playBtn').css({ display: 'none' });
            $('#pauseBtn').css({ display: 'block' });
            $('.centerPlay').css({ display: 'block' });
            $('.centerPlay').css({ opacity: '0' });
            //$('.st-playBox').css({'display':'none'});
        } else {
            console.log('일시정지');
            media[0].pause();
            $('#playBtn').css({ display: 'block' });
            $('#pauseBtn').css({ display: 'none' });

            if (!endFlag) {
                if (PAGE_INFO[NOWPAGE - 1].type == 'mp4') {
                    $('.centerPlay').css({ opacity: '1' });
                } else {
                    $('.centerPlay').css({ display: 'block' });
                }
            }
            //if(PAGE_INFO[NOWPAGE-1].type !== 'quiz' && PAGE_INFO[NOWPAGE-1].type !== 'summary') $('.st-playBox').css({'display':'block'});
        }
    };

    //볼륨 음소거 함수
    var setVolume = function (type) {
        if (type == 'off') {
            media[0].volume = 0;
            $('#unmute').hide();
            $('#mute').show();
            media[0].muted = true; //음소거 on
            $('.volume-range').css({ width: 0 + '%' });
        } else {
            media[0].volume = Number(currentVol).toFixed(1);
            $('#mute').hide();
            $('#unmute').show();
            media[0].muted = false; //음소거 off
            $('.volume-range').css({ width: currentVol * 100 + '%' });
        }

        utility.setCookie('scrownVolume', currentVol, 360);
    };

    //볼륨 처음 지정
    var setCurrentVolume = function (vol) {
        currentVol = utility.getCookie('scrownVolume') || defaultVol; //볼륨값
        if (currentVol <= 0) setVolume('off');
        else setVolume('on');
    };

    //마지막 말풍선
    var lastBubble = function () {
        //console.log('  endFlag  : ', endFlag, '   QUIZ_SUMMARY_END : ', QUIZ_SUMMARY_END);
        ///// LMS
        if (porting) {
            try {
                opener.fnCmdEndObject(NOWPAGE, media[0].duration);
            } catch (e) {
                parent.fnCmdEndObject(NOWPAGE, media[0].duration);
            }
        }

        $('.centerPlay').css({ display: 'none' });
        //다음페이지 말풍선
        if (NOWPAGE == TOTALPAGE) {
            //마지막 페이지인 경우
            //goisPerCheck();
            $('.end-bubble').addClass('complete');
        }
        if (endFlag) {
            // 2023 사제동행 - quiz bubble 퀴즈일때는 감추기
            if (PAGE_INFO[NOWPAGE - 1].type == 'interaction_quiz') {
            } else {
                $('.end-bubble').addClass('view');
            }
            /*
            if(isTYPE=="interaction")
            {
                //인터랙션 페이지
                if(QUIZ_SUMMARY_END){
					//goisPerCheck();
                    $('.end-bubble').addClass('view');
                }
            }else{
				//goisPerCheck();
                $('.end-bubble').addClass('view');
            }
			*/
        } else {
            if ($('.end-bubble').hasClass('view')) {
                $('.end-bubble').removeClass('view');
            }
        }
    };

    var lastBubleHidden = function () {
        $('.end-bubble').removeClass('view');
    };

    var retrunvol = function () {
        return currentVol;
    };

    //퀴즈 모션 싱크
    var quizIntroMotion = function () {
        //퀴즈 스타트 버튼 나올때
        if (HTML_TYPE == 'quiz') {
            if (media[0].currentTime > QUIZS_START_SINK) {
                //스타트 버튼 나온 다음 시점
                if (quiz.quizActive()) {
                    //스타트 버튼 눌렀을때
                    quiz.setActive('startClick');
                    // alert(curPageStatus)
                    // gggggg();
                } else {
                    //스타트 버튼 누르지 않았을때
                    quiz.setActive('startVisible');
                    // alert(curPageStatus)
                }
            } else {
                //스타트 버튼 나오기 전 시점
                quiz.setActive('startVisibleNot');
            }
        }
    };

    //스타트 버튼 시간 찾기
    var seekToTimeEnd = function () {
        // try and avoid pauses after seeking

        media[0].currentTime = media[0].duration; // if this is far enough away from current, it implies a "play" call as well...oddly. I mean seriously that is junk.
        // however if it close enough, then we need to call play manually
        // some shenanigans to try and work around this:
        var timer = setInterval(function () {
            if ((media[0].paused && media[0].readyState == 4) || !media[0].paused) {
                media[0].pause();

                clearInterval(timer);
            }
        }, 50);
    };

    //메뉴 나오고 안나오고
    var menuToggle = function () {
        if ($('.menuObj').hasClass('view')) {
            $('.menuObj').removeClass('view');
            $('#menuToggleBtn').removeClass('on');
            clearTimeout(setTimer);
            setTimer = setTimeout(function () {
                //$('.menuObj').css({'display':'none'})
            }, 500);
        } else {
            clearTimeout(setTimer);
            $('.menuObj').addClass('view');
            $('#menuToggleBtn').addClass('on');
        }
    };

    //help 나오고 안나오고
    var helpMenuToggle = function () {
        if ($('.helpObj').hasClass('view')) {
            $('.helpObj').removeClass('view');
            $('#mapBtn').removeClass('on');

            state = 'play';
            playContents(state);

            clearTimeout(setTimer);
            setTimer = setTimeout(function () {
                //$('.helpObj').css({'display':'none'})
            }, 500);
        } else {
            clearTimeout(setTimer);

            state = 'pause';
            playContents(state);

            $('.helpObj').addClass('view');
            $('.helpContents ').addClass('helplearning');
            $('#mapBtn').addClass('on');
        }
    };

    //bookmark 나오고 안나오고
    var bookmkToggle = function () {
        if ($('.bookmkObj').hasClass('view')) {
            $('.bookmkObj').removeClass('view');
            $('#bookmkBtn').removeClass('on');
            clearTimeout(setTimer);
            setTimer = setTimeout(function () {
                //$('.helpObj').css({'display':'none'})
            }, 500);
        } else {
            clearTimeout(setTimer);
            $('.bookmkObj').addClass('view');
            // $('.helpContents ').addClass('helplearning');
            $('#bookmkBtn').addClass('on');
        }
    };

    /*
     * 싱크 찾기
     */
    var sinkStop = false;

    var seekingSink = function (stime) {
        var sinkArr = PAGE_INFO[NOWPAGE - 1].sink;

        if (sinkArr) {
            //싱크 있을때
            var secArr = [];
            for (var idx in sinkArr) {
                idx = Number(idx);
                var allTimeArr = sinkArr[idx].times.split(':');
                var sec = Number(allTimeArr[0]) * 60 + Number(allTimeArr[1]); //초로 변환
                secArr[idx] = sec;
            }
            var seekTime = Math.floor(stime);
            var findId = findTime(seekTime, secArr); //내게 맞는 싱크인지 찾기

            //버튼 나오는 시간 - 영상 멈추는 시간
            if (findId !== -1) {
                //				console.log('++++싱크가 맞으면 sinkStop ++++', sinkStop);
                if (seekTime === secArr[findId] && !sinkStop) {
                    //싱크가 끝나는 시점
                    //싱크가 끝나는 시점에 들어갈 액션 지정

                    sinkStop = true;
                    state = 'pause';
                    playContents('pause');
                    //console.log('++++싱크끝 findId+1++++', (findId+1));
                }
            } //싱크가 안맞으면
            else {
                //싱크가 안맞는 시간에 들어갈 액션 지정
                sinkStop = false;
                //console.log('++++++싱크가 안맞으면+++++++');
            }
        }
    };

    //시간 찾기
    var findTime = function (seekTime, secArr) {
        var sinkArr = PAGE_INFO[NOWPAGE - 1].sink;
        var findNum = -1;

        if (sinkArr) {
            for (var idx in sinkArr) {
                idx = Number(idx);

                //버튼 나오는 시간 - 영상 멈추는 시간
                if (seekTime === secArr[idx]) {
                    //싱크사이에 있으면 seekTime >= secArr[idx][0] && seekTime <= secArr[idx][1]
                    findNum = idx;
                    break;
                }
            }
        }

        return findNum;
    };

    // 컨트롤바 페이지/슬라이드 및 좌우 버튼 연동
    function updatePageControls() {
        var videoList = window.VIDEO_LIST || [];
        var currentFile = window.videoFile;
        var currentIndex = videoList.findIndex(function(item) { return item.filename === currentFile; });
        var total = videoList.length;
        var pageText = (currentIndex+1).toString().padStart(2, '0') + ' / ' + total.toString().padStart(2, '0');
        $('.pageCurrent').text((currentIndex+1).toString().padStart(2, '0'));
        $('.pageTotal').text(total.toString().padStart(2, '0'));
        // 좌우 버튼 활성/비활성
        if (currentIndex <= 0) {
            $('#prevBtn').prop('disabled', true).css({opacity:0.4, cursor:'default'});
        } else {
            $('#prevBtn').prop('disabled', false).css({opacity:1, cursor:'pointer'});
        }
        if (currentIndex >= total-1) {
            $('#nextBtn').prop('disabled', true).css({opacity:0.4, cursor:'default'});
        } else {
            $('#nextBtn').prop('disabled', false).css({opacity:1, cursor:'pointer'});
        }
    }

    // 좌우 버튼 클릭 이벤트
    $(document).on('click', '#prevBtn', function() {
        var videoList = window.VIDEO_LIST || [];
        var currentFile = window.videoFile;
        var currentIndex = videoList.findIndex(function(item) { return item.filename === currentFile; });
        if (currentIndex > 0) {
            var prevFile = videoList[currentIndex-1].filename;
            window.location.href = 'player.html?video=' + encodeURIComponent(prevFile);
        }
    });
    $(document).on('click', '#nextBtn', function() {
        var videoList = window.VIDEO_LIST || [];
        var currentFile = window.videoFile;
        var currentIndex = videoList.findIndex(function(item) { return item.filename === currentFile; });
        if (currentIndex < videoList.length-1) {
            var nextFile = videoList[currentIndex+1].filename;
            window.location.href = 'player.html?video=' + encodeURIComponent(nextFile);
        }
    });

    // 페이지(슬라이드) 클릭 시 INDEX 메뉴처럼 영상 선택
    $(document).on('click', '.page', function(e) {
        e.stopPropagation();
        var videoList = window.VIDEO_LIST || [];
        var currentFile = window.videoFile;
        var currentIndex = videoList.findIndex(function(item) { return item.filename === currentFile; });
        // 간단한 드롭다운 리스트 표시
        var $dropdown = $('<ul class="pageDropdown" style="position:absolute;z-index:9999;left:0;right:0;bottom:40px;background:#fff;border:1px solid #bbb;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:8px 0;margin:0;list-style:none;max-height:220px;overflow-y:auto;"></ul>');
        videoList.forEach(function(item, idx) {
            var active = (idx === currentIndex) ? 'font-weight:bold;color:#1a237e;background:#e3e8f7;' : '';
            $dropdown.append('<li style="padding:7px 18px;cursor:pointer;'+active+'" data-idx="'+idx+'">'+item.title+'</li>');
        });
        $('.page').append($dropdown);
    });
    // 드롭다운 항목 클릭 시 이동
    $(document).on('click', '.pageDropdown li', function(e) {
        var idx = parseInt($(this).attr('data-idx'));
        var videoList = window.VIDEO_LIST || [];
        if (videoList[idx]) {
            window.location.href = 'player.html?video=' + encodeURIComponent(videoList[idx].filename);
        }
    });
    // 드롭다운 외부 클릭 시 닫기
    $(document).on('click', function(e) {
        $('.pageDropdown').remove();
    });

    // 기존 컨트롤바 생성 후 updatePageControls 호출
    setTimeout(updatePageControls, 300);

    return {
        init: init,
        menuToggle: menuToggle,
        helpMenuToggle: helpMenuToggle,
        lastBubble: lastBubble,
        volume: retrunvol,
        seekToTimeEnd: seekToTimeEnd,
    };
})();

/* 미학습페이지 완료시 버튼제어 해제 */
function goisPerCheck() {
    if (parent.bolPorting) {
        if (parent.bolTLock) {
            parent.bolTLock = false;
            parent.bookmarkNum = NOWPAGE;
            //console.log("::::::::::::::  goisPerCheck  ::::::::::::::   ||  is"+ NOWPAGE+"Page OK");
        }
    }
}
