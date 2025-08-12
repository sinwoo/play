
//메뉴, 스크립트 생성
var menu = (function () 
{
    var subArr = [];
    var listArr = [];
    var count = 0;
    var listId = 0;
    var curTitle, curSubTitle;
    var pageInfoArray = [];
    var help_teacher_num = 1;
    
    var init = function()
    {
        makeElement();//태그 생성
        menuInit();//메뉴 이벤트
        var tabIndexTimer = setTimeout(function(){$('.mCSB_inside').attr('tabindex', '-1');},700)
        
    }

    //태그 생성
    var makeElement = function()
    {
        // VIDEO_LIST 기반으로 메뉴 생성
        var element = '';
        element += '<div id="menuContainer" style="margin-top: 7%; font-size: 24px; "></div>';
        element += '<div id="menuXBtn"></div>';
        $('.menuObj').append(element);

        // 메뉴 항목 생성 (가독성 개선 및 스크롤 지원)
        var menuHtml = '<div style="background:#fff; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.08); border:1px solid #e0e0e0; padding:24px 18px; max-height:340px; min-width:240px; overflow-y:auto; font-family: \"Noto Sans KR\", Arial, sans-serif;">';
        menuHtml += '<ul class="videoMenuList" style="list-style:none; margin:0; padding:0;">';
        if (window.VIDEO_LIST && Array.isArray(window.VIDEO_LIST)) {
            window.VIDEO_LIST.forEach(function(item) {
                var isActive = (window.videoFile === item.filename);
                menuHtml += '<li style="margin-bottom:14px;">'
                    +'<a href="player.html?video='+encodeURIComponent(item.filename)+'"'
                    +' style="display:block; padding:10px 14px; border-radius:6px; font-size:15px; color:'+(isActive?'#1a237e':'#222')+'; font-weight:'+(isActive?'bold':'normal')+'; background:'+(isActive?'#e3e8f7':'transparent')+'; text-decoration:none; transition:background 0.2s, color 0.2s;"'
                    +' onmouseover="this.style.background=\'#f5f7fa\';this.style.color=\'#0d47a1\'"'
                    +' onmouseout="this.style.background=\''+(isActive?'#e3e8f7':'transparent')+'\';this.style.color=\''+(isActive?'#1a237e':'#222')+'\'"'
                    +' onclick="window.location.href=\'player.html?video='+encodeURIComponent(item.filename)+'\';return false;">'
                    +item.title+'</a></li>';
            });
        }
        menuHtml += '</ul></div>';
        $('#menuContainer').html(menuHtml);

        // 메뉴 닫기 버튼
        $('#menuXBtn').on('click', function(e)
        {
            controller.menuToggle();
        });
    }

    //메뉴 관련 이벤트
    var menuInit = function()
    {
        // 변수 초기화
        var subArr = [];
        var listArr = [];
        var count = 0;
        var listId = 0;
        var pageInfoArray = {};
        
        //console.log('MENU_INFO  ', MENU_INFO)
		//MENU_INFO를 배열에 임시로 담음
		for(var i=0; i<MENU_INFO.length; i++)
		{
			subArr.push(MENU_INFO[i].pageNum);
			listArr[i] = [];

			for(var j=0; j<MENU_INFO[i].subMenu.length; j++)
			{
                listArr[i].push(MENU_INFO[i].subMenu[j].pageNum);
            }
        }
        
		for(var i=0; i<PAGE_INFO.length; i++)
		{
			//대메뉴 번호 추출
			if(subArr && subArr.indexOf(i+1) !== -1) count ++;
			//소메뉴 번호 추출
            if(listArr && listArr[count-1] && listArr[count-1].indexOf(i+1) !== -1) listId = listArr[count-1].indexOf(i+1);

            pageInfoArray[i+1] = [
                count, 
                listId+1, 
                utility.digit(i+1)+'.html'
            ];

        }

        //전체 페이지 배열 만듦
        //console.log(' pageInfoArray  ', pageInfoArray);
        
        //강조
        if (pageInfoArray[NOWPAGE]) {
            curTitle = pageInfoArray[NOWPAGE][0];
            curSubTitle = pageInfoArray[NOWPAGE][1];
            
            //console.log(' curTitle : ', curTitle,  ' curSubTitle : ', curSubTitle);
            //강조
            $('#tMenu_' + curTitle).addClass('active');
            $('#sMenu_' + curTitle + '_' + curSubTitle).addClass('active');
        }

        if(MACHINE_TYPE !== 'PC')
        {
            //모바일일때는 텍스트 작게
            $('.menuObj .subText').addClass('mobile');
            $('.menuObj .tMenuBtn .subText').addClass('mobile');
			$('.content .scrownPlayer .scrownControls').addClass('mobile');
        }

        //대메뉴 
        $('.tMenuBtn').each(function(idx)
        {
            var arr = $(this).attr('id').split('_');
            var p_id = Number(arr[1]);
            
            if(pageInfoArray[NOWPAGE] && p_id !== pageInfoArray[NOWPAGE][0])
            {
                $(this).on('mouseover', function(e){
                    $(this).addClass('active');
                })

                $(this).on('mouseout', function(e){
                    $(this).removeClass('active');
                })
                
                //대메뉴 클릭
                $(this).on('click', function(e){

					if (controlBar) { //컨트롤바 제어 할 경우
						if (curPageStatus =="Y") {
                            if(CHAPTER < 10){
                                location.href = "0" + CHAPTER + "_" + utility.digit(MENU_INFO[p_id-1].pageNum) + '.html'; // 해당 페이지로 이동
                            } else {
                                location.href = CHAPTER + "_" + utility.digit(MENU_INFO[p_id-1].pageNum) + '.html'; // 해당 페이지로 이동
                            }
						} else {
							if ($('.end-bubble').hasClass('view')) {
								if(CHAPTER < 10){
                                    location.href = "0" + CHAPTER + "_" + utility.digit(MENU_INFO[p_id-1].pageNum) + '.html'; // 해당 페이지로 이동
                                } else {
                                    location.href = CHAPTER + "_" + utility.digit(MENU_INFO[p_id-1].pageNum) + '.html'; // 해당 페이지로 이동
                                }
							} else {
								alert('학습이 완료되지 않았습니다.');
							}
						}
					} else {
						if(CHAPTER < 10){
                            location.href = "0" + CHAPTER + "_" + utility.digit(MENU_INFO[p_id-1].pageNum) + '.html'; // 해당 페이지로 이동
                        } else {
                            location.href = CHAPTER + "_" + utility.digit(MENU_INFO[p_id-1].pageNum) + '.html'; // 해당 페이지로 이동
                        }
					}

                })
            }
            
        })


        //소메뉴 
        $('.sMenuBtn').each(function(idx)
        {
            var arr = $(this).attr('id').split('_');
            var p_id = Number(arr[1]);
            var id = Number(arr[2]);
            var menuId = p_id+'_'+id;
            var curId = pageInfoArray[NOWPAGE] ? (pageInfoArray[NOWPAGE][0] + '_' + pageInfoArray[NOWPAGE][1]) : '';
            //console.log('curId ', curId)
            if(menuId !== curId)
            {
                $(this).on('mouseover', function(e){
                    $(this).addClass('active');
                })

                $(this).on('mouseout', function(e){
                    $(this).removeClass('active');
                })

                //소메뉴 클릭
                $(this).on('click', function(e){
					var pageComplete = getLastPage(id);

					if(pageComplete == "PASS") {
						if (controlBar) { //컨트롤바 제어 할 경우
							if (curPageStatus =="Y") {
								if(CHAPTER < 10){
									location.href = "0" + CHAPTER + "_" + utility.digit(MENU_INFO[p_id-1].subMenu[id-1].pageNum) + '.html'; // 해당 페이지로 이동
								} else {
									location.href = CHAPTER + "_" + utility.digit(MENU_INFO[p_id-1].subMenu[id-1].pageNum) + '.html'; // 해당 페이지로 이동
								}
							} else {
								if ($('.end-bubble').hasClass('view')) {
									if(CHAPTER < 10){
										location.href = "0" + CHAPTER + "_" + utility.digit(MENU_INFO[p_id-1].subMenu[id-1].pageNum) + '.html'; // 해당 페이지로 이동
									} else {
										location.href = CHAPTER + "_" + utility.digit(MENU_INFO[p_id-1].subMenu[id-1].pageNum) + '.html'; // 해당 페이지로 이동
									}
								} else {
									alert('학습이 완료되지 않았습니다.');
								}
							}
						} else {
							if(CHAPTER < 10){
								location.href = "0" + CHAPTER + "_" + utility.digit(MENU_INFO[p_id-1].subMenu[id-1].pageNum) + '.html'; // 해당 페이지로 이동
							} else {
								location.href = CHAPTER + "_" + utility.digit(MENU_INFO[p_id-1].subMenu[id-1].pageNum) + '.html'; // 해당 페이지로 이동
							}
						}
					}
					else {
						popLayer("학습이 완료된 페이지만 이동이 가능합니다.");
					}
                })

            }
        });
        

        //메뉴 닫기 버튼
        $('#menuXBtn').on('click', function(e)
        {
            //console.log('menuXBtn')
            controller.menuToggle();
        });
        //help 닫기 버튼
        $('#helpmenuXBtn').on('click', function(e)
        {
            console.log('helpmenuXBtn')
            controller.helpMenuToggle();
        });
        //러닝맵 버튼
        $('.help_1').on('click', function(e)
        {
            $('.helpContents').attr('class','helpContents').addClass('helplearning');
            // $('.helpContents').addClass('helplearning')
            $('.goHelpPrev').hide();
            $('.goHelpNext').hide();
            $('.helpCourseName').hide();
        });
        //화면안내 버튼
        $('.help_2').on('click', function(e)
        {
            $('.helpContents').attr('class','helpContents').addClass('helpplayer');
            // $('.helpContents').addClass('helpplayer')
            $('.helpCourseName').show();
            $('.goHelpPrev').hide();
            $('.goHelpNext').hide();
        });
        //강사소개 버튼
        $('.help_3').on('click', function(e)
        {
            $('.helpContents').attr('class','helpContents').addClass('helpteacher1').attr('data-id', 1);
            // $('.goHelpPrev').show();
            $('.helpCourseName').hide();
            // $('.helpContents').addClass('helpteacher1')
        });
    }

    var returnTitle = function()
    {
        //console.log('#sMenu_' + curTitle + '_' + curSubTitle + ' .subText')
        return {
            maintitle: $('#tMenu_' + curTitle + ' .subText').text()
            ,subtitle: $('#sMenu_' + curTitle + '_' + curSubTitle + ' .subText').text()
            ,num:curTitle
        }
    }

    function replaceText(str)
    {
        var txt = str.replace(/@q/gi, '<span class="menuEmphasisText">').replace(/@w/gi, '</span>');
        return txt;
    }
    return {
        init : init
        ,returnTitle: returnTitle
    }

})()