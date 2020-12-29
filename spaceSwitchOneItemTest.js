/* 

2차원 배열에 false로 할당하고
각 그룹에 flag를 true로 줌
그리고 할당한 그룹에 flag를 false로 줘서
그 자리에 앉았으면 다음 앉을때
해당 그룹의 flag가 false라 들어갈 수 없고
2개 중에 랜덤으로 true인 그룹에 들어가는데
랜덤으로 뽑힌 그룹의 배열이 모두 true이면 다른 그룹에 할당
*/

$(document).ready(function () {

    const hi = 'one연결 성공';
    console.log(hi);

    const testList = ['A']
    let jsonObj = {};

    const groupCreate = function(groups, members){
        
    };

    //자리를 jsonObj에 생성
    const listFill = function(listFillParam){
        for(var i=0; i<listFillParam.length; i++){
            // 12개 0들어간 리스트 생성
            jsonObj.listFillParam[i] = [false,0,0,0,0,0,0,0,0,0,0,0]
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