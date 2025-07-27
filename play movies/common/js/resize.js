//리사이즈
var resize = (function () {

    var isOldWidth, isOldHeight;
    var curWidth, curHeight;

    var curLeft = 0;
    var curTop = 0;
    var zoomWidth = 1;
    var zoomHeight = 1;
    var zoomRate = 1;
    
    var resizeScale = function()
    {
        var target = CONTAINER;

        switch (window.orientation) 
        {
            
            case 90 : case -90 ://가로모드
                curWidth = document.body.clientHeight;
                curHeight = document.body.clientWidth;
                break;
            default ://세로 모드		
                curWidth = document.body.clientWidth;
                curHeight = document.body.clientHeight;
                
        }

        //console.log(' curWidth ', curWidth, ' isOldWidth ', isOldWidth);
        //console.log(' curHeight ', curHeight, ' isOldHeight ', isOldHeight);
        //window창이 예전 window창의 width값과 같으면 return
        if(curWidth == isOldWidth && curHeight == isOldHeight){
            return;
        }

        /*switch (window.orientation) 
        {
            case 90 : case -90 ://가로모드
                //console.log('가로모드');
                zoomWidth = curWidth / target.clientHeight;
                zoomHeight = curHeight / target.clientWidth;
                
                zoomRate = Math.min(zoomWidth, zoomHeight);

                curLeft = curHeight/2 - (target.clientWidth*zoomRate)/2;
                curTop = curWidth/2 - (target.clientHeight*zoomRate)/2;
                
                break;
            default ://세로 모드
                //console.log('세로모드');
                zoomWidth = curWidth / target.clientWidth;
                zoomHeight = curHeight / target.clientHeight;
                zoomRate = Math.min(zoomWidth, zoomHeight);
                curLeft = curWidth/2 - (target.clientWidth*zoomRate)/2;
                curTop = (curHeight)/2 - (target.clientHeight*zoomRate)/2;
                
        }*/
        //console.log(' zoomWidth : ', zoomWidth , '   zoomHeight : ', zoomHeight);
        //console.log(' curWidth : ', curWidth , '   target.clientWidth : ', target.clientWidth);
        //console.log(' curHeight : ', curHeight , '   target.clientHeight : ', target.clientHeight);
        //console.log(' curTop : ', curTop , '   curLeft : ', curLeft);

       /* target.setAttribute('style', '-ms-transform: scale(' + zoomRate + ',' + zoomRate + ');'
            + '-webkit-transform: scale(' + zoomRate + ',' + zoomRate + ');' + 'transform: scale(' + zoomRate + ',' + zoomRate + ');'
            + 'transform-origin: 0 0; -webkit-transform-origin: 0 0; -ms-transform-origin: 0 0;' 
            + 'top:' + curTop + 'px;'
            + 'left:' + curLeft + 'px;');*/

        isOldWidth = curWidth;
        isOldHeight = curHeight;
    }

    //리사이즈 이벤트가 끝났는지 체크
    var windowResizeChk = function()
    {
        var rtime;
        var timeout = false;
        var delta = 200;
        
        window.addEventListener('resize', function(){
            resizeScale();
            rtime = new Date();
            if (timeout === false) {
                timeout = true;
                setTimeout(resizeend, delta);
            }
        }, false);

        function resizeend() {
            if (new Date() - rtime < delta) {
                setTimeout(resizeend, delta);
            } else {
                timeout = false;
                resizeScale();
                //console.log('리사이징 완료')
                //alert('리사이징 완료')
                
            }               
        }
    }

    return {
        resizeScale : resizeScale
        ,windowResizeChk : windowResizeChk
    }
})();