$(document).ready(function () {

    const hi = 'one연결 성공';
    console.log(hi);

    const testList = ['A']
    let jsonObj = {};

    //자리를 jsonObj에 생성
    const listFill = function(listFillParam){
        for(var i=0; i<listFillParam.length; i++){
            jsonObj
        }
    }

    // 자리 히스토리
    const itemHistory = function(itemHistoryKey ,itemHistoryValue) {
        jsonObj.itemHistoryKey.push(itemHistoryValue);
    }

    // render
    const renderList = function (renderListParam) {
        for (var i in renderListParam) {
            $('li').eq(i).text(renderListParam[i]);
            itemHistory(renderListParam[i], i);
        }
    }

    const setList = function() {
        renderList(testList);
    };
    
    const shuffleList = function() {

    };



    $("#setSeat").on("click", function () {
        setList();
    });

    $("#randomSeat").on("click", function () {
        shuffleList();
    });
});